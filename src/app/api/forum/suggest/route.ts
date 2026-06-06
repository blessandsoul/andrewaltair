export const dynamic = 'force-dynamic';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { ForumService } from '@/services/forum.service';
import { getClientIp, checkAiRateLimit, recordAiUse, rateLimitMessageKa } from '@/lib/forum-ratelimit';
import { notifyAdminTelegram, escapeTelegramHtml } from '@/lib/telegram';

/**
 * POST /api/forum/suggest  {text, name?}
 * A visitor suggests a topic for the council. Saved as a QUEUED topic (Georgian title +
 * summary generated, but NO full debate yet) so the admin reviews it and decides whether
 * to publish. Public but rate-limited.
 */
export async function POST(request: Request) {
    try {
        const ip = getClientIp(request);
        const rl = checkAiRateLimit(ip);
        if (!rl.ok) return apiError(ERROR_CODES.RATE_LIMITED, rateLimitMessageKa(rl.reason), 429);

        const body = await request.json().catch(() => ({}));
        const text = String(body?.text || '').trim();
        const name = String(body?.name || '').trim().slice(0, 40);
        if (text.length < 5 || text.length > 300) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'text must be 5..300 chars', 400);
        }

        const topic = await ForumService.createTopic({ text, suggestedBy: name || 'მკითხველი' });
        recordAiUse(ip);

        // Notify the admin in Telegram that a new suggestion is waiting for approval.
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge';
        const tg =
            `🆕 <b>ფორუმზე ახალი თემის შემოთავაზება</b>\n\n` +
            `«${escapeTelegramHtml(topic.titleKa || text.slice(0, 120))}»\n` +
            `👤 ${escapeTelegramHtml(name || 'მკითხველი')}\n\n` +
            `დასამტკიცებლად: <a href="${siteUrl}/admin/forum">/admin/forum</a>`;
        await notifyAdminTelegram(tg);

        return apiSuccess({ ok: true, id: topic.id }, 'suggested');
    } catch (error) {
        console.error('[API] forum suggest error:', error);
        return apiError(ERROR_CODES.FORUM_CREATE_FAILED, 'Failed to suggest topic', 500);
    }
}

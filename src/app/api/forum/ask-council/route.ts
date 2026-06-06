export const dynamic = 'force-dynamic';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { askCouncil } from '@/lib/georgian-forum-generator';
import { getClientIp, checkAiRateLimit, recordAiUse, rateLimitMessageKa } from '@/lib/forum-ratelimit';

/**
 * POST /api/forum/ask-council  {question, mode?}
 * A visitor asks the whole council → N personas answer = instant mini-debate.
 * Public but rate-limited (each call = several LLM requests). Ephemeral: nothing is stored.
 */
export async function POST(request: Request) {
    try {
        const ip = getClientIp(request);
        const rl = checkAiRateLimit(ip);
        if (!rl.ok) return apiError(ERROR_CODES.RATE_LIMITED, rateLimitMessageKa(rl.reason), 429);

        const body = await request.json().catch(() => ({}));
        const question = String(body?.question || '').trim();
        const mode = body?.mode === 'absurd' ? 'absurd' : 'serious';
        if (question.length < 3 || question.length > 200) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'question must be 3..200 chars', 400);
        }

        const answers = await askCouncil(question, mode, 4);
        if (!answers.length) return apiError(ERROR_CODES.FORUM_GENERATE_FAILED, 'No answers generated', 502);
        recordAiUse(ip);

        return apiSuccess({ answers }, 'answered');
    } catch (error) {
        console.error('[API] forum ask-council error:', error);
        return apiError(ERROR_CODES.FORUM_GENERATE_FAILED, 'Failed to ask council', 500);
    }
}

export const dynamic = 'force-dynamic';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { generateDuel } from '@/lib/georgian-forum-generator';
import { getClientIp, checkAiRateLimit, recordAiUse, rateLimitMessageKa } from '@/lib/forum-ratelimit';

/**
 * POST /api/forum/duel  {personaAId, personaBId, theme}
 * Two personas debate a theme (3 turns each). Ephemeral — returns the transcript,
 * nothing is stored. Rate-limited (AI).
 */
export async function POST(request: Request) {
    try {
        const ip = getClientIp(request);
        const rl = checkAiRateLimit(ip);
        if (!rl.ok) return apiError(ERROR_CODES.RATE_LIMITED, rateLimitMessageKa(rl.reason), 429);

        const body = await request.json().catch(() => ({}));
        const personaAId = String(body?.personaAId || '');
        const personaBId = String(body?.personaBId || '');
        const theme = String(body?.theme || '').trim();
        if (!personaAId || !personaBId || personaAId === personaBId) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'two distinct personas required', 400);
        }
        if (theme.length < 3 || theme.length > 200) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'theme must be 3..200 chars', 400);
        }

        const turns = await generateDuel(personaAId, personaBId, theme);
        if (!turns) return apiError(ERROR_CODES.FORUM_GENERATE_FAILED, 'No duel generated', 502);
        recordAiUse(ip);

        return apiSuccess({ turns }, 'duel ready');
    } catch (error) {
        console.error('[API] forum duel error:', error);
        return apiError(ERROR_CODES.FORUM_GENERATE_FAILED, 'Failed to run duel', 500);
    }
}

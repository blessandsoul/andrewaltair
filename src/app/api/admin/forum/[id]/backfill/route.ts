export const dynamic = 'force-dynamic';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import { backfillTopic } from '@/lib/georgian-forum-generator';

/**
 * POST /api/admin/forum/[id]/backfill
 * Fill the gaps in a topic: generate the missing persona opinions + top the predictions
 * back up to 8. Idempotent. Used when the first generation came out thin (truncation /
 * rate-limit) or to rescue a topic stuck 'queued'.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!verifyAdmin(request)) return unauthorizedResponse('Admin access required');
    try {
        const { id } = await params;
        const res = await backfillTopic(id);
        if (!res.ok) return apiError(ERROR_CODES.FORUM_GENERATE_FAILED, res.reason, 502);
        return apiSuccess(res, 'backfilled');
    } catch (error) {
        console.error('[API] forum backfill error:', error);
        return apiError(ERROR_CODES.FORUM_GENERATE_FAILED, 'Failed to backfill', 500);
    }
}

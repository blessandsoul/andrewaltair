export const dynamic = 'force-dynamic';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import { generateAndSaveForumTopic } from '@/lib/georgian-forum-generator';

/**
 * POST /api/admin/forum/[id]/generate  (admin only)
 * Manual "generate now" — same work the cron does, for one specific topic.
 * Idempotent: a topic that already has posts returns { ok:false, reason:'already' }.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!verifyAdmin(request)) return unauthorizedResponse('Admin access required');
    try {
        const { id } = await params;
        const result = await generateAndSaveForumTopic(id);
        if (!result.ok && result.reason === 'not_found') {
            return apiError(ERROR_CODES.FORUM_NOT_FOUND, 'Forum topic not found', 404);
        }
        return apiSuccess(result, result.ok ? 'Forum topic generated' : `Skipped: ${result.reason}`);
    } catch (error) {
        console.error('[API] POST /api/admin/forum/[id]/generate error:', error);
        return apiError(ERROR_CODES.FORUM_GENERATE_FAILED, 'Failed to generate forum topic', 500);
    }
}

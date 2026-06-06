export const dynamic = 'force-dynamic';

import { revalidatePath } from 'next/cache';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import { ForumService } from '@/services/forum.service';

/** PATCH /api/admin/forum/[id] {titleKa,summaryKa} — edit the Georgian preview before publish. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!verifyAdmin(request)) return unauthorizedResponse('Admin access required');
    try {
        const { id } = await params;
        const body = await request.json().catch(() => ({}));
        const updated = await ForumService.updateTopic(id, {
            titleKa: typeof body?.titleKa === 'string' ? body.titleKa : undefined,
            summaryKa: typeof body?.summaryKa === 'string' ? body.summaryKa : undefined,
        });
        if (!updated) return apiError(ERROR_CODES.FORUM_NOT_FOUND, 'Forum topic not found', 404);
        return apiSuccess(updated, 'Forum topic updated');
    } catch (error) {
        console.error('[API] PATCH /api/admin/forum/[id] error:', error);
        return apiError(ERROR_CODES.FORUM_CREATE_FAILED, 'Failed to update forum topic', 500);
    }
}

/** DELETE /api/admin/forum/[id] — remove a topic and all its posts. */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!verifyAdmin(request)) return unauthorizedResponse('Admin access required');
    try {
        const { id } = await params;
        const result = await ForumService.deleteTopic(id);
        if (!result) return apiError(ERROR_CODES.FORUM_NOT_FOUND, 'Forum topic not found', 404);
        revalidatePath('/forum');
        revalidatePath('/');
        return apiSuccess(result, 'Forum topic deleted');
    } catch (error) {
        console.error('[API] DELETE /api/admin/forum/[id] error:', error);
        return apiError(ERROR_CODES.FORUM_DELETE_FAILED, 'Failed to delete forum topic', 500);
    }
}

export const dynamic = 'force-dynamic';

import { revalidatePath } from 'next/cache';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import { ForumService } from '@/services/forum.service';

/** GET /api/admin/forum/[id]/resolve — list a topic's predictions for the admin panel. */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!verifyAdmin(request)) return unauthorizedResponse('Admin access required');
    try {
        const { id } = await params;
        const predictions = await ForumService.getPredictions(id);
        return apiSuccess({ predictions }, 'Predictions fetched');
    } catch (error) {
        console.error('[API] GET /api/admin/forum/[id]/resolve error:', error);
        return apiError(ERROR_CODES.FORUM_FETCH_FAILED, 'Failed to fetch predictions', 500);
    }
}

/**
 * POST /api/admin/forum/[id]/resolve {predictionId, verdict:'right'|'wrong'|'pending'}
 * Mark a persona's prediction as having come true or failed. Feeds the prophet leaderboard.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!verifyAdmin(request)) return unauthorizedResponse('Admin access required');
    try {
        await params; // [id] is the topic; the prediction is addressed by predictionId in the body
        const body = await request.json().catch(() => ({}));
        const predictionId = String(body?.predictionId || '').trim();
        const verdict = body?.verdict;
        if (!predictionId || !['right', 'wrong', 'pending'].includes(verdict)) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'predictionId და სწორი verdict სავალდებულოა', 400);
        }
        const result = await ForumService.resolvePrediction(predictionId, verdict);
        if (!result) return apiError(ERROR_CODES.FORUM_NOT_FOUND, 'Prediction not found', 404);
        revalidatePath('/forum/leaderboard');
        revalidatePath('/forum');
        return apiSuccess(result, 'Prediction resolved');
    } catch (error) {
        console.error('[API] POST /api/admin/forum/[id]/resolve error:', error);
        return apiError(ERROR_CODES.FORUM_CREATE_FAILED, 'Failed to resolve prediction', 500);
    }
}

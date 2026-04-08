export const dynamic = 'force-dynamic';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import { InsightService } from '@/services/insight.service';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const insight = await InsightService.getInsightBySlug(id);

        if (!insight) {
            return apiError(ERROR_CODES.INSIGHT_NOT_FOUND, 'Insight not found', 404);
        }

        return apiSuccess(insight, 'Insight fetched');
    } catch (error) {
        console.error('[API] GET /api/insights/[id] error:', error);
        return apiError(ERROR_CODES.INSIGHT_FETCH_FAILED, 'Failed to fetch insight', 500);
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const insight = await InsightService.updateInsight(id, body);

        if (!insight) {
            return apiError(ERROR_CODES.INSIGHT_NOT_FOUND, 'Insight not found', 404);
        }

        return apiSuccess(insight, 'Insight updated');
    } catch (error) {
        console.error('[API] PUT /api/insights/[id] error:', error);
        return apiError(ERROR_CODES.INSIGHT_UPDATE_FAILED, 'Failed to update insight', 500);
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const { id } = await params;
        const result = await InsightService.deleteInsight(id);

        if (!result) {
            return apiError(ERROR_CODES.INSIGHT_NOT_FOUND, 'Insight not found', 404);
        }

        return apiSuccess(result, 'Insight deleted');
    } catch (error) {
        console.error('[API] DELETE /api/insights/[id] error:', error);
        return apiError(ERROR_CODES.INSIGHT_DELETE_FAILED, 'Failed to delete insight', 500);
    }
}

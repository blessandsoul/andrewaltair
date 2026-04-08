export const dynamic = 'force-dynamic';

import { apiSuccess, apiError, apiPaginated } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import { InsightService } from '@/services/insight.service';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const status = searchParams.get('status') || 'published';
        const tag = searchParams.get('tag');
        const search = searchParams.get('search');
        const afterSlug = searchParams.get('afterSlug');

        const { insights, pagination } = await InsightService.getAllInsights({
            page,
            limit,
            status,
            tag,
            search,
            afterSlug,
        });

        return apiPaginated(insights, {
            page: pagination.page,
            limit: pagination.limit,
            total: pagination.total,
        }, 'Insights fetched');
    } catch (error) {
        console.error('[API] GET /api/insights error:', error);
        return apiError(ERROR_CODES.INSIGHT_FETCH_FAILED, 'Failed to fetch insights', 500);
    }
}

export async function POST(request: Request) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const body = await request.json();

        if (!body.content || !body.sourceUrl) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'content and sourceUrl are required', 400);
        }

        const insight = await InsightService.createInsight(body);
        return apiSuccess(insight, 'Insight created', 201);
    } catch (error) {
        console.error('[API] POST /api/insights error:', error);
        return apiError(ERROR_CODES.INSIGHT_CREATE_FAILED, 'Failed to create insight', 500);
    }
}

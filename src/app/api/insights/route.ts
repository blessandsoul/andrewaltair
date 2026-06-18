export const dynamic = 'force-dynamic';

import { revalidatePath, revalidateTag } from 'next/cache';
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
        const language = searchParams.get('language') === 'en' ? 'en' : null;

        const { insights, pagination } = await InsightService.getAllInsights({
            page,
            limit,
            status,
            tag,
            search,
            afterSlug,
            language,
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

        // Revalidate pages that show insights
        revalidatePath('/');
        revalidatePath('/insights');
        revalidatePath('/en/insights');
        revalidatePath('/sitemap.xml');
        revalidateTag('insights'); // busts unstable_cache on both /insights and /en/insights listings

        return apiSuccess(insight, 'Insight created', 201);
    } catch (error) {
        console.error('[API] POST /api/insights error:', error);
        // TEMP DIAGNOSTIC: surface the real error to the (admin-authed) caller so
        // the publish script can report the exact cause. Revert to the generic
        // message once the insight ingest is confirmed working.
        const detail = error instanceof Error ? error.message : String(error);
        return apiError(ERROR_CODES.INSIGHT_CREATE_FAILED, `Failed to create insight: ${detail}`, 500);
    }
}

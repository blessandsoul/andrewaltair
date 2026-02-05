export const dynamic = 'force-dynamic'
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { AnalyticsService } from '@/services/analytics.service';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';

// GET - Aggregated analytics data
export async function GET(request: Request) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const result = await AnalyticsService.getDashboardStats();
        return apiSuccess(result, 'Analytics fetched successfully');
    } catch (error) {
        console.error('Analytics aggregation error:', error);
        return apiError(ERROR_CODES.ANALYTICS_FETCH_FAILED, 'Failed to fetch analytics', 500);
    }
}

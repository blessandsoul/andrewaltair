export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { AnalyticsService } from '@/services/analytics.service'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const period = searchParams.get('period') || 'all'

        const stats = await AnalyticsService.getDetailedStats(period)
        return apiSuccess(stats, 'Stats fetched successfully')
    } catch (error) {
        console.error('Stats error:', error)
        return apiError(ERROR_CODES.TRACKING_FETCH_FAILED, 'Failed to get stats', 500)
    }
}

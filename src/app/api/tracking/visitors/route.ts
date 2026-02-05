export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { AnalyticsService } from '@/services/analytics.service'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const userAgent = request.headers.get('user-agent') || ''
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

        const result = await AnalyticsService.trackVisitor(body, ip, userAgent)
        return apiSuccess(result, 'Visitor tracked successfully')
    } catch (error) {
        console.error('Visitor tracking error:', error)
        return apiError(ERROR_CODES.TRACKING_RECORD_FAILED, 'Tracking failed', 500)
    }
}

export async function GET() {
    try {
        const stats = await AnalyticsService.getDetailedStats('today') // Just reuse for online count
        return apiSuccess({
            online: stats.online,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.error('Online count error:', error)
        return apiError(ERROR_CODES.TRACKING_FETCH_FAILED, 'Failed to get count', 500)
    }
}

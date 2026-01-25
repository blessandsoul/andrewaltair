export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService } from '@/services/analytics.service'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const period = searchParams.get('period') || 'all'

        const stats = await AnalyticsService.getDetailedStats(period)
        return NextResponse.json(stats)
    } catch (error) {
        console.error('Stats error:', error)
        return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 })
    }
}

export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService } from '@/services/analytics.service'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const userAgent = request.headers.get('user-agent') || ''
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

        const result = await AnalyticsService.trackVisitor(body, ip, userAgent)
        return NextResponse.json(result)
    } catch (error: any) {
        console.error('Visitor tracking error:', error)
        return NextResponse.json({ error: error.message || 'Tracking failed' }, { status: 500 })
    }
}

export async function GET() {
    try {
        const stats = await AnalyticsService.getDetailedStats('today') // Just reuse for online count
        return NextResponse.json({
            online: stats.online,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.error('Online count error:', error)
        return NextResponse.json({ online: 0, error: 'Failed to get count' }, { status: 500 })
    }
}

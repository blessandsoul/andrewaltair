import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Visitor from '@/models/Visitor'
import Activity from '@/models/Activity'
import Click from '@/models/Click'

export const dynamic = 'force-dynamic'

// GET - Export data as CSV
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') || 'visitors'
        const limit = Math.min(parseInt(searchParams.get('limit') || '1000'), 10000)

        let data: any[] = []
        let headers: string[] = []
        let filename = ''

        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        switch (type) {
            case 'visitors':
                data = await Visitor.find({ firstSeen: { $gte: thirtyDaysAgo } })
                    .select('visitorId city country deviceType browser os pageViews sessionDuration bounced referrerSource firstSeen lastSeen')
                    .sort({ firstSeen: -1 })
                    .limit(limit)
                    .lean()
                headers = ['Visitor ID', 'City', 'Country', 'Device', 'Browser', 'OS', 'Page Views', 'Session (s)', 'Bounced', 'Source', 'First Seen', 'Last Seen']
                filename = 'visitors_export.csv'
                break

            case 'activities':
                data = await Activity.find({ createdAt: { $gte: thirtyDaysAgo } })
                    .select('type visitorId targetType targetTitle city country createdAt')
                    .sort({ createdAt: -1 })
                    .limit(limit)
                    .lean()
                headers = ['Type', 'Visitor ID', 'Target Type', 'Target Title', 'City', 'Country', 'Date']
                filename = 'activities_export.csv'
                break

            case 'searches':
                data = await Activity.find({ type: 'search', createdAt: { $gte: thirtyDaysAgo } })
                    .select('visitorId metadata.query createdAt')
                    .sort({ createdAt: -1 })
                    .limit(limit)
                    .lean()
                headers = ['Visitor ID', 'Query', 'Date']
                filename = 'searches_export.csv'
                break

            case 'clicks':
                data = await Click.find({ createdAt: { $gte: thirtyDaysAgo } })
                    .select('visitorId page x y element resolution createdAt')
                    .sort({ createdAt: -1 })
                    .limit(limit)
                    .lean()
                headers = ['Visitor ID', 'Page', 'X (%)', 'Y (%)', 'Element', 'Resolution', 'Date']
                filename = 'clicks_export.csv'
                break

            default:
                return NextResponse.json({ error: 'Invalid export type' }, { status: 400 })
        }

        // Convert to CSV
        const escapeCSV = (val: any): string => {
            if (val === null || val === undefined) return ''
            const str = String(val)
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`
            }
            return str
        }

        const rows = data.map(item => {
            switch (type) {
                case 'visitors':
                    return [
                        item.visitorId, item.city, item.country, item.deviceType,
                        item.browser, item.os, item.pageViews, Math.round(item.sessionDuration || 0),
                        item.bounced ? 'Yes' : 'No', item.referrerSource,
                        new Date(item.firstSeen).toISOString(),
                        new Date(item.lastSeen).toISOString()
                    ].map(escapeCSV).join(',')

                case 'activities':
                    return [
                        item.type, item.visitorId, item.targetType, item.targetTitle,
                        item.city, item.country, new Date(item.createdAt).toISOString()
                    ].map(escapeCSV).join(',')

                case 'searches':
                    return [
                        item.visitorId, item.metadata?.query || '',
                        new Date(item.createdAt).toISOString()
                    ].map(escapeCSV).join(',')

                case 'clicks':
                    return [
                        item.visitorId, item.page, item.x?.toFixed(2), item.y?.toFixed(2),
                        item.element, item.resolution, new Date(item.createdAt).toISOString()
                    ].map(escapeCSV).join(',')

                default:
                    return ''
            }
        })

        const csv = [headers.join(','), ...rows].join('\n')

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${filename}"`
            }
        })

    } catch (error) {
        console.error('Export error:', error)
        return NextResponse.json({ error: 'Export failed' }, { status: 500 })
    }
}

export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Visitor from '@/models/Visitor'
import Activity from '@/models/Activity'

// GET - Real-time dashboard metrics (optimized for frequent polling)
export async function GET() {
    try {
        await dbConnect()

        const now = new Date()
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        const [
            onlineNow,
            onlineByDevice,
            visitorsToday,
            activitiesThisHour,
            currentPages,
            recentSearches,
            avgEngagement
        ] = await Promise.all([
            // Current online count
            Visitor.countDocuments({ lastSeen: { $gte: fiveMinutesAgo } }),

            // Online by device type
            Visitor.aggregate([
                { $match: { lastSeen: { $gte: fiveMinutesAgo } } },
                { $group: { _id: '$deviceType', count: { $sum: 1 } } }
            ]),

            // Visitors today
            Visitor.countDocuments({ firstSeen: { $gte: todayStart } }),

            // Activities in last hour
            Activity.countDocuments({ createdAt: { $gte: oneHourAgo } }),

            // Current active pages (what people are viewing now)
            Visitor.aggregate([
                { $match: { lastSeen: { $gte: fiveMinutesAgo } } },
                { $group: { _id: '$currentPage', viewers: { $sum: 1 } } },
                { $sort: { viewers: -1 } },
                { $limit: 5 }
            ]),

            // Recent searches (last hour)
            Activity.find({ type: 'search', createdAt: { $gte: oneHourAgo } })
                .select('metadata.query createdAt')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            // Average engagement score today
            Visitor.aggregate([
                { $match: { firstSeen: { $gte: todayStart }, engagementScore: { $gt: 0 } } },
                { $group: { _id: null, avgScore: { $avg: '$engagementScore' } } }
            ])
        ])

        // Format device breakdown
        const deviceBreakdown = {
            desktop: onlineByDevice.find(d => d._id === 'desktop')?.count || 0,
            mobile: onlineByDevice.find(d => d._id === 'mobile')?.count || 0,
            tablet: onlineByDevice.find(d => d._id === 'tablet')?.count || 0
        }

        return NextResponse.json({
            success: true,
            timestamp: now.toISOString(),
            realtime: {
                online: onlineNow,
                devices: deviceBreakdown,
                visitorsToday,
                activitiesThisHour,
                activePages: currentPages.map(p => ({
                    page: p._id || '/',
                    viewers: p.viewers
                })),
                recentSearches: recentSearches.map((s: any) => ({
                    query: s.metadata?.query || '',
                    time: s.createdAt
                })),
                avgEngagementScore: Math.round(avgEngagement[0]?.avgScore || 0)
            }
        })
    } catch (error) {
        console.error('Realtime metrics error:', error)
        return NextResponse.json({ error: 'Failed to fetch realtime metrics' }, { status: 500 })
    }
}


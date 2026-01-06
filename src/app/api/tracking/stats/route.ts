import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Visitor from '@/models/Visitor'
import Activity from '@/models/Activity'

// Helper to get date range
function getDateRange(period: string): Date {
    const now = new Date()
    switch (period) {
        case 'today':
            return new Date(now.getFullYear(), now.getMonth(), now.getDate())
        case 'week':
            const weekAgo = new Date(now)
            weekAgo.setDate(weekAgo.getDate() - 7)
            return weekAgo
        case 'month':
            const monthAgo = new Date(now)
            monthAgo.setMonth(monthAgo.getMonth() - 1)
            return monthAgo
        case 'year':
            const yearAgo = new Date(now)
            yearAgo.setFullYear(yearAgo.getFullYear() - 1)
            return yearAgo
        default:
            return new Date(0) // All time
    }
}

// GET - Get aggregated statistics
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const period = searchParams.get('period') || 'all'
        const startDate = getDateRange(period)

        // Current online (last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

        // Parallel queries for performance
        const [
            onlineCount,
            totalVisitors,
            deviceBreakdown,
            countryBreakdown,
            cityBreakdown,
            trafficSourceBreakdown,
            sessionStatsResult,
            browserBreakdown,
            activityBreakdown,
            recentActivities,
            dailyVisitors,
            topSearches // Added topSearches here
        ] = await Promise.all([
            // Online now
            Visitor.countDocuments({ lastSeen: { $gte: fiveMinutesAgo } }),

            // Total unique visitors in period
            Visitor.countDocuments({ firstSeen: { $gte: startDate } }),

            // Device breakdown
            Visitor.aggregate([
                { $match: { firstSeen: { $gte: startDate } } },
                { $group: { _id: '$deviceType', count: { $sum: 1 } } }
            ]),

            // Country breakdown (top 10)
            Visitor.aggregate([
                { $match: { firstSeen: { $gte: startDate }, country: { $exists: true, $ne: null } } },
                { $group: { _id: '$country', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),

            // City breakdown (top 10) - for Georgian cities display
            Visitor.aggregate([
                { $match: { firstSeen: { $gte: startDate }, city: { $exists: true, $nin: [null, 'Unknown'] } } },
                { $group: { _id: '$city', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),

            // Traffic Sources
            Visitor.aggregate([
                { $match: { firstSeen: { $gte: startDate } } },
                { $group: { _id: '$referrerSource', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),

            // Session Stats (Bounce Rate, Avg Duration)
            Visitor.aggregate([
                { $match: { firstSeen: { $gte: startDate } } },
                {
                    $group: {
                        _id: null,
                        totalSessions: { $sum: 1 },
                        bouncedSessions: { $sum: { $cond: [{ $eq: ['$bounced', false] }, 0, 1] } }, // Default is true (bounced)
                        avgDuration: { $avg: '$sessionDuration' }
                    }
                }
            ]),

            // Browser breakdown
            Visitor.aggregate([
                { $match: { firstSeen: { $gte: startDate } } },
                { $group: { _id: '$browser', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),

            // Activity type breakdown
            Activity.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                { $group: { _id: '$type', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),

            // Recent public activities
            Activity.find({ isPublic: true })
                .sort({ createdAt: -1 })
                .limit(20)
                .lean(),

            // Daily visitors for chart (last 7 days)
            Visitor.aggregate([
                {
                    $match: {
                        firstSeen: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: '%Y-%m-%d', date: '$firstSeen' }
                        },
                        count: { $sum: 1 },
                        pageViews: { $sum: '$pageViews' }
                    }
                },
                { $sort: { _id: 1 } }
            ]),

            // Top Searches
            Activity.aggregate([
                { $match: { type: 'search', createdAt: { $gte: startDate } } },
                { $group: { _id: '$metadata.query', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ])
        ])

        // Format device breakdown
        const devices = Object.fromEntries(
            deviceBreakdown.map(d => [d._id || 'unknown', d.count])
        )
        const totalDevices = Object.values(devices).reduce((a, b) => (a as number) + (b as number), 0) as number

        // Format country breakdown with percentages
        const totalCountryVisitors = countryBreakdown.reduce((sum, c) => sum + c.count, 0)
        const countries = countryBreakdown.map(c => ({
            code: c._id || 'XX',
            count: c.count,
            percentage: totalCountryVisitors > 0 ? Math.round((c.count / totalCountryVisitors) * 100) : 0
        }))

        // Format city breakdown with percentages
        const totalCityVisitors = cityBreakdown.reduce((sum, c) => sum + c.count, 0)
        const cities = cityBreakdown.map(c => ({
            name: c._id || 'Unknown',
            count: c.count,
            percentage: totalCityVisitors > 0 ? Math.round((c.count / totalCityVisitors) * 100) : 0
        }))

        // Format traffic sources
        const totalTraffic = (trafficSourceBreakdown as any[]).reduce((sum: number, t: any) => sum + t.count, 0)
        const trafficSources = trafficSourceBreakdown.map((t: any) => ({
            source: t._id || 'direct',
            count: t.count,
            percentage: totalTraffic > 0 ? Math.round((t.count / totalTraffic) * 100) : 0
        }))

        // Format session stats
        const sessionStats = sessionStatsResult[0] || { totalSessions: 0, bouncedSessions: 0, avgDuration: 0 }
        const bounceRate = sessionStats.totalSessions > 0 ? Math.round((sessionStats.bouncedSessions / sessionStats.totalSessions) * 100) : 0
        const avgSessionDuration = Math.round(sessionStats.avgDuration || 0)

        // Format browser breakdown
        const browsers = browserBreakdown.map((b: any) => ({
            name: b._id || 'Unknown',
            count: b.count,
            percentage: totalVisitors > 0 ? Math.round((b.count / totalVisitors) * 100) : 0
        }))

        // Format activity breakdown
        const activities = activityBreakdown.map((a: any) => ({
            type: a._id,
            count: a.count
        }))
        const totalActivities = activities.reduce((sum: number, a: any) => sum + a.count, 0)

        // Format daily data
        const dailyData = dailyVisitors.map((d: any) => ({
            date: d._id,
            visitors: d.count,
            pageViews: d.pageViews || 0
        }))

        // Calculate page views in period
        const pageViewsResult = await Visitor.aggregate([
            { $match: { firstSeen: { $gte: startDate } } },
            { $group: { _id: null, total: { $sum: '$pageViews' } } }
        ])
        const totalPageViews = pageViewsResult[0]?.total || 0

        return NextResponse.json({
            // Summary
            online: onlineCount,
            totalVisitors,
            totalPageViews,
            totalActivities,
            bounceRate,
            avgSessionDuration,

            // Breakdowns
            devices: {
                desktop: devices.desktop || 0,
                mobile: devices.mobile || 0,
                tablet: devices.tablet || 0,
                desktopPercentage: totalDevices > 0 ? Math.round(((devices.desktop || 0) / totalDevices) * 100) : 0,
                mobilePercentage: totalDevices > 0 ? Math.round(((devices.mobile || 0) / totalDevices) * 100) : 0,
                tabletPercentage: totalDevices > 0 ? Math.round(((devices.tablet || 0) / totalDevices) * 100) : 0,
            },
            countries,
            cities,
            trafficSources,
            browsers,
            activities,

            // Charts
            dailyData,

            // Recent activity feed
            recentActivities: recentActivities.map((a: any) => ({
                id: a._id.toString(),
                type: a.type,
                displayName: a.displayName,
                city: a.city,
                targetTitle: a.metadata?.title || a.targetSlug,
                createdAt: a.createdAt
            })),

            // Top Searches
            topSearches: topSearches.map((s: any) => ({
                term: s._id || 'unknown',
                count: s.count
            })),

            // Meta
            period,
            generatedAt: new Date().toISOString()
        })
    } catch (error) {
        console.error('Stats error:', error)
        return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 })
    }
}

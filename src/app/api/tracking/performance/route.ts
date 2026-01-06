import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Activity from '@/models/Activity'
import Visitor from '@/models/Visitor'

// GET - Get content performance metrics
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const period = parseInt(searchParams.get('days') || '30')

        const startDate = new Date()
        startDate.setDate(startDate.getDate() - period)

        // Aggregate content performance by page
        const [pagePerformance, topEntryPages, topExitPages, avgTimeByPage] = await Promise.all([
            // Page views and engagement by page
            Activity.aggregate([
                {
                    $match: {
                        type: 'page_view',
                        createdAt: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: '$targetSlug',
                        views: { $sum: 1 },
                        uniqueVisitors: { $addToSet: '$visitorId' },
                        avgScrollDepth: { $avg: '$metadata.scrollDepth' }
                    }
                },
                {
                    $project: {
                        page: '$_id',
                        views: 1,
                        uniqueVisitors: { $size: '$uniqueVisitors' },
                        avgScrollDepth: { $round: ['$avgScrollDepth', 1] }
                    }
                },
                { $sort: { views: -1 } },
                { $limit: 20 }
            ]),

            // Top entry pages (first page in session)
            Visitor.aggregate([
                { $match: { firstSeen: { $gte: startDate } } },
                { $group: { _id: '$currentPage', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),

            // Top exit pages
            Visitor.aggregate([
                {
                    $match: {
                        firstSeen: { $gte: startDate },
                        exitPage: { $exists: true, $ne: null }
                    }
                },
                { $group: { _id: '$exitPage', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),

            // Average session duration by landing page
            Visitor.aggregate([
                {
                    $match: {
                        firstSeen: { $gte: startDate },
                        sessionDuration: { $gt: 0 }
                    }
                },
                {
                    $group: {
                        _id: '$currentPage',
                        avgDuration: { $avg: '$sessionDuration' },
                        totalSessions: { $sum: 1 }
                    }
                },
                { $sort: { totalSessions: -1 } },
                { $limit: 10 }
            ])
        ])

        // New vs Returning visitors
        const newVsReturning = await Visitor.aggregate([
            { $match: { firstSeen: { $gte: startDate } } },
            {
                $group: {
                    _id: { $cond: ['$isReturning', 'returning', 'new'] },
                    count: { $sum: 1 }
                }
            }
        ])

        const visitorBreakdown = {
            new: newVsReturning.find(v => v._id === 'new')?.count || 0,
            returning: newVsReturning.find(v => v._id === 'returning')?.count || 0
        }

        return NextResponse.json({
            success: true,
            data: {
                pagePerformance,
                entryPages: topEntryPages.map(p => ({ page: p._id || '/', count: p.count })),
                exitPages: topExitPages.map(p => ({ page: p._id || '/', count: p.count })),
                avgTimeByPage: avgTimeByPage.map(p => ({
                    page: p._id || '/',
                    avgDuration: Math.round(p.avgDuration),
                    sessions: p.totalSessions
                })),
                visitorBreakdown
            }
        })
    } catch (error) {
        console.error('Content performance error:', error)
        return NextResponse.json({ error: 'Failed to fetch content performance' }, { status: 500 })
    }
}

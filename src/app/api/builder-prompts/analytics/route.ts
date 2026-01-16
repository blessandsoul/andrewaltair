export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import PromptAnalytics from '@/models/PromptAnalytics'
import { cookies } from 'next/headers'

// POST - Track event
export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const cookieStore = await cookies()
        const sessionId = cookieStore.get('prompt_session')?.value || 'anonymous'

        const { event, role, model, generationTimeMs, tokenCount, success } = await request.json()

        const analytics = await PromptAnalytics.create({
            sessionId,
            event,
            role,
            model,
            generationTimeMs,
            tokenCount,
            success: success !== false
        })

        return NextResponse.json({ success: true, id: analytics._id })
    } catch (error) {
        console.error('Analytics tracking error:', error)
        return NextResponse.json({ error: 'Failed to track' }, { status: 500 })
    }
}

// GET - Get aggregated stats
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const days = parseInt(searchParams.get('days') || '30')

        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        // Event counts
        const eventCounts = await PromptAnalytics.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: '$event', count: { $sum: 1 } } }
        ])

        // Popular roles
        const popularRoles = await PromptAnalytics.aggregate([
            { $match: { createdAt: { $gte: startDate }, role: { $exists: true, $ne: null } } },
            { $group: { _id: '$role', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ])

        // Average generation time
        const avgTime = await PromptAnalytics.aggregate([
            { $match: { createdAt: { $gte: startDate }, generationTimeMs: { $exists: true } } },
            { $group: { _id: null, avg: { $avg: '$generationTimeMs' } } }
        ])

        // Daily usage
        const dailyUsage = await PromptAnalytics.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ])

        // Success rate
        const successRate = await PromptAnalytics.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    successful: { $sum: { $cond: ['$success', 1, 0] } }
                }
            }
        ])

        // Model usage
        const modelUsage = await PromptAnalytics.aggregate([
            { $match: { createdAt: { $gte: startDate }, model: { $exists: true, $ne: null } } },
            { $group: { _id: '$model', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])

        const stats = {
            eventCounts: eventCounts.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {}),
            popularRoles: popularRoles.map(r => ({ role: r._id, count: r.count })),
            avgGenerationTimeMs: avgTime[0]?.avg || 0,
            dailyUsage: dailyUsage.map(d => ({ date: d._id, count: d.count })),
            successRate: successRate[0] ? (successRate[0].successful / successRate[0].total * 100) : 100,
            modelUsage: modelUsage.map(m => ({ model: m._id, count: m.count })),
            totalEvents: eventCounts.reduce((sum, e) => sum + e.count, 0)
        }

        return NextResponse.json(stats)
    } catch (error) {
        console.error('Analytics fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
    }
}



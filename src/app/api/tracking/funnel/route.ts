export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Funnel from '@/models/Funnel'
import Activity from '@/models/Activity'
import Visitor from '@/models/Visitor'

export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        // Get the active funnel (for MVP, getting the first active one or creating a default)
        let funnel = await Funnel.findOne({ isActive: true })

        // Seed a default funnel if none exists
        if (!funnel) {
            funnel = await Funnel.create({
                name: 'Content Engagement',
                steps: [
                    { name: 'საიტზე შემოსვლა', type: 'page', target: '/' },
                    { name: 'ბლოგის ნახვა', type: 'page', target: '/blog' },
                    { name: 'სტატიის კითხვა', type: 'activity', target: 'page_view' }, // Approximation for specific article
                    { name: 'ინტერაქცია', type: 'activity', target: 'reaction' } // Likes/Shares
                ]
            })
        }

        const steps = funnel.steps
        const results: { name: string; count: number; stepIndex: number }[] = []

        // Calculate counts for each step
        // Note: This is a simplified calculation. True funnel analysis requires tracking unique users *through* the sequence.
        // For MVP/Demo: We will count unique unique visitors who performed each action in the last 30 days.

        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        for (const step of steps) {
            let count = 0
            if (step.type === 'page') {
                // Count unique revenue from visitors who viewed this page
                // We use Activity log for page views as it tracks specific paths
                // Or we can use Visitor.currentPage if we only cared about current state, but that's wrong.
                // We need history. Activity collection has 'page_view' type and 'targetSlug' (often path).

                // If target is '/', we check for homepage visits.
                // Usually represented as targetSlug: '/' or just based on Visitor creation?

                if (step.target === '/') {
                    count = await Visitor.countDocuments({ firstSeen: { $gte: thirtyDaysAgo } })
                } else {
                    // Count unique visitors who have an activity matching this
                    const distinctVisitors = await Activity.distinct('visitorId', {
                        createdAt: { $gte: thirtyDaysAgo },
                        type: 'page_view',
                        targetSlug: new RegExp(`^${step.target}`) // Starts with path
                    })
                    count = distinctVisitors.length
                }
            } else {
                // Activity based
                const distinctVisitors = await Activity.distinct('visitorId', {
                    createdAt: { $gte: thirtyDaysAgo },
                    type: step.target
                })
                count = distinctVisitors.length
            }

            results.push({
                name: step.name,
                count,
                stepIndex: results.length
            })
        }

        // Calculate drop-offs
        const finalResults = results.map((step, index) => {
            const prevCount = index > 0 ? results[index - 1].count : results[0].count // Base on first step or prev? usually prev
            // Funnel usually compares to *first* step for overall conversion, and *prev* for step conversion.
            // Let's return both.

            return {
                ...step,
                conversionRate: results[0].count > 0 ? Math.round((step.count / results[0].count) * 100) : 0,
                dropOff: prevCount > 0 ? Math.round(((prevCount - step.count) / prevCount) * 100) : 0
            }
        })

        return NextResponse.json({
            success: true,
            funnelName: funnel.name,
            steps: finalResults
        })

    } catch (error) {
        console.error("Funnel error:", error)
        return NextResponse.json({ error: 'Failed to fetch funnel' }, { status: 500 })
    }
}


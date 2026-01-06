import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Visitor from '@/models/Visitor'

// POST - Update engagement metrics (scroll depth, time on page, etc.)
export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const body = await request.json()
        const { visitorId, scrollDepth, timeOnPage, action } = body

        if (!visitorId) {
            return NextResponse.json({ error: 'Visitor ID required' }, { status: 400 })
        }

        const updateOps: any = {
            lastSeen: new Date(),
        }

        // Update scroll depth if higher than current
        if (scrollDepth !== undefined && scrollDepth >= 0 && scrollDepth <= 100) {
            updateOps.$max = { maxScrollDepth: scrollDepth }
        }

        // Add time spent on current page
        if (timeOnPage && timeOnPage > 0) {
            updateOps.$inc = { totalTimeOnSite: timeOnPage }
        }

        // Update last click time
        if (action === 'click') {
            updateOps.lastClickTime = new Date()
        }

        await Visitor.findOneAndUpdate(
            { visitorId },
            updateOps,
            { new: true }
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Engagement tracking error:', error)
        return NextResponse.json({ error: 'Failed to track engagement' }, { status: 500 })
    }
}

// GET - Get engagement metrics for a visitor
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const visitorId = searchParams.get('visitorId')

        if (!visitorId) {
            return NextResponse.json({ error: 'Visitor ID required' }, { status: 400 })
        }

        const visitor = await Visitor.findOne({ visitorId })
            .select('maxScrollDepth totalTimeOnSite engagementScore pageViews bounced')
            .lean()

        if (!visitor) {
            return NextResponse.json({ error: 'Visitor not found' }, { status: 404 })
        }

        // Calculate engagement score (0-100)
        // Factors: scroll depth (40%), time on site (30%), page views (20%), not bounced (10%)
        const scrollScore = (visitor.maxScrollDepth || 0) * 0.4
        const timeScore = Math.min((visitor.totalTimeOnSite || 0) / 300, 1) * 30 // Max 5 min = 30 points
        const pageScore = Math.min((visitor.pageViews || 1) / 5, 1) * 20 // Max 5 pages = 20 points
        const bounceScore = visitor.bounced ? 0 : 10

        const engagementScore = Math.round(scrollScore + timeScore + pageScore + bounceScore)

        return NextResponse.json({
            success: true,
            metrics: {
                scrollDepth: visitor.maxScrollDepth || 0,
                timeOnSite: visitor.totalTimeOnSite || 0,
                pageViews: visitor.pageViews || 1,
                bounced: visitor.bounced,
                engagementScore
            }
        })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch engagement' }, { status: 500 })
    }
}

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Click from '@/models/Click'
import Activity from '@/models/Activity'

// In-memory store for rage click detection (per visitor)
const recentClicks = new Map<string, { x: number; y: number; time: number }[]>()

// POST - Record a click with rage click detection
export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const body = await request.json()
        const { visitorId, page, x, y, element, resolution } = body

        if (!visitorId || !page || x === undefined || y === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Save the click
        await Click.create({
            visitorId,
            page,
            x,
            y,
            element,
            resolution
        })

        // Rage Click Detection
        // A rage click is 3+ clicks within 100px radius in < 2 seconds
        const now = Date.now()
        const visitorClicks = recentClicks.get(visitorId) || []

        // Add current click
        visitorClicks.push({ x, y, time: now })

        // Keep only clicks from last 2 seconds
        const recentWindow = visitorClicks.filter(c => now - c.time < 2000)
        recentClicks.set(visitorId, recentWindow)

        // Check for rage clicks (3+ clicks within 100px radius)
        if (recentWindow.length >= 3) {
            const lastClick = recentWindow[recentWindow.length - 1]
            const nearbyClicks = recentWindow.filter(c => {
                const dx = Math.abs(c.x - lastClick.x)
                const dy = Math.abs(c.y - lastClick.y)
                // Using percentages; 100px on 1920 screen ≈ 5.2%
                return dx < 6 && dy < 6
            })

            if (nearbyClicks.length >= 3) {
                // Log rage click activity (fire and forget)
                Activity.create({
                    type: 'rage_click',
                    visitorId,
                    targetSlug: page,
                    metadata: {
                        x,
                        y,
                        element,
                        clickCount: nearbyClicks.length
                    },
                    isPublic: false
                }).catch(() => { }) // Ignore errors

                // Clear this visitor's clicks after detecting rage
                recentClicks.delete(visitorId)
            }
        }

        // Clean up old entries periodically
        if (recentClicks.size > 1000) {
            for (const [key, clicks] of recentClicks.entries()) {
                if (clicks.every(c => now - c.time > 5000)) {
                    recentClicks.delete(key)
                }
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to record click' }, { status: 500 })
    }
}

// GET - Retrieve heatmap data
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const page = searchParams.get('page')

        if (!page) {
            return NextResponse.json({ error: 'Page required' }, { status: 400 })
        }

        const match: any = { page }

        // Return last 2000 clicks for heatmap
        const clicks = await Click.find(match)
            .select('x y resolution element')
            .sort({ createdAt: -1 })
            .limit(2000)
            .lean()

        return NextResponse.json({
            success: true,
            clicks: clicks.map((c: any) => ({
                x: c.x,
                y: c.y,
                value: 1
            }))
        })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch heatmap' }, { status: 500 })
    }
}

export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import dbConnect from '@/lib/db'
import Click from '@/models/Click'
import Activity from '@/models/Activity'

// In-memory store for rage click detection (per visitor)
const recentClicks = new Map<string, { x: number; y: number; time: number }[]>()

// POST - Record a click (or batch of clicks) with rage click detection
export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const body = await request.json()
        const { visitorId, clicks } = body

        if (!visitorId) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Missing required fields', 400)
        }

        // Support batched format: { visitorId, clicks: [{page, x, y, element, resolution}] }
        const clickList: { page: string; x: number; y: number; element?: string; resolution?: string }[] =
            Array.isArray(clicks) ? clicks : [{ page: body.page, x: body.x, y: body.y, element: body.element, resolution: body.resolution }]

        if (clickList.length === 0 || clickList.some(c => !c.page || c.x === undefined || c.y === undefined)) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Missing required fields', 400)
        }

        // Use the last click for rage detection context
        const { page, x, y, element, resolution } = clickList[clickList.length - 1]

        // Save all clicks
        await Click.insertMany(clickList.map(c => ({ visitorId, ...c })))

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

        return apiSuccess(null, 'Operation successful')
    } catch (error) {
        return apiError(ERROR_CODES.TRACKING_FETCH_FAILED, 'Failed to record click', 500)
    }
}

// GET - Retrieve heatmap data
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const page = searchParams.get('page')

        if (!page) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Page required', 400)
        }

        const match: any = { page }

        // Return last 2000 clicks for heatmap
        const clicks = await Click.find(match)
            .select('x y resolution element')
            .sort({ createdAt: -1 })
            .limit(2000)
            .lean()

        return apiSuccess({
            clicks: clicks.map((c: any) => ({
                x: c.x,
                y: c.y,
                value: 1
            }))
        })
    } catch (error) {
        return apiError(ERROR_CODES.TRACKING_FETCH_FAILED, 'Failed to fetch heatmap', 500)
    }
}


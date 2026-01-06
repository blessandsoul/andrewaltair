import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import { trackSubscribe } from '@/lib/activityTracker'

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
    const now = Date.now()
    const limit = rateLimitMap.get(ip)

    if (!limit || limit.resetAt < now) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 }) // 1 minute window
        return false
    }

    if (limit.count >= 5) { // Max 5 subscriptions per minute
        return true
    }

    limit.count++
    return false
}

// POST - Subscribe to newsletter
export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') || 'unknown'

        // Rate limiting
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'ძალიან ბევრი მოთხოვნა. სცადეთ მოგვიანებით.' },
                { status: 429 }
            )
        }

        await dbConnect()

        const body = await request.json()
        const { email, name, visitorId } = body

        if (!email) {
            return NextResponse.json(
                { error: 'ელფოსტა სავალდებულოა' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'არასწორი ელფოსტის ფორმატი' },
                { status: 400 }
            )
        }

        // Check if already subscribed
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            if (existingUser.newsletterSubscribed) {
                return NextResponse.json({
                    success: true,
                    message: 'თქვენ უკვე გამოწერილი ხართ! 🎉'
                })
            }

            // Update existing user to subscribe
            existingUser.newsletterSubscribed = true
            existingUser.newsletterSubscribedAt = new Date()
            await existingUser.save()
        } else {
            // Create new subscriber record (pseudo-user for newsletter only)
            await User.create({
                email,
                fullName: name || 'Newsletter Subscriber',
                username: `subscriber_${Date.now()}`,
                password: Math.random().toString(36), // Random password - they can reset later
                role: 'subscriber',
                newsletterSubscribed: true,
                newsletterSubscribedAt: new Date()
            })
        }

        // 🎯 TRACK SUBSCRIBE ACTIVITY
        trackSubscribe(email, { visitorId }).catch(() => { })

        return NextResponse.json({
            success: true,
            message: 'გამოწერა წარმატებით შესრულდა! 🎉'
        })
    } catch (error) {
        console.error('Newsletter subscription error:', error)
        return NextResponse.json(
            { error: 'სერვერის შეცდომა' },
            { status: 500 }
        )
    }
}

// GET - Get subscriber count (for admin)
export async function GET() {
    try {
        await dbConnect()

        const count = await User.countDocuments({ newsletterSubscribed: true })

        return NextResponse.json({
            subscriberCount: count
        })
    } catch (error) {
        console.error('Newsletter count error:', error)
        return NextResponse.json(
            { error: 'Failed to get count' },
            { status: 500 }
        )
    }
}

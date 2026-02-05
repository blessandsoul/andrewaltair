export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
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
            return apiError(ERROR_CODES.RATE_LIMITED, 'ძალიან ბევრი მოთხოვნა. სცადეთ მოგვიანებით.', 429)
        }

        await dbConnect()

        const body = await request.json()
        const { email, name, visitorId } = body

        if (!email) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'ელფოსტა სავალდებულოა', 400)
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'არასწორი ელფოსტის ფორმატი', 400)
        }

        // Check if already subscribed
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            if (existingUser.newsletterSubscribed) {
                return apiSuccess(null, 'თქვენ უკვე გამოწერილი ხართ!')
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

        return apiSuccess(null, 'გამოწერა წარმატებით შესრულდა!')
    } catch (error) {
        console.error('Newsletter subscription error:', error)
        return apiError(ERROR_CODES.NEWSLETTER_SUBSCRIBE_FAILED, 'სერვერის შეცდომა', 500)
    }
}

// GET - Get subscriber count (for admin)
export async function GET() {
    try {
        await dbConnect()

        const count = await User.countDocuments({ newsletterSubscribed: true })

        return apiSuccess({ subscriberCount: count }, 'Subscriber count fetched')
    } catch (error) {
        console.error('Newsletter count error:', error)
        return apiError(ERROR_CODES.NEWSLETTER_SUBSCRIBE_FAILED, 'Failed to get subscriber count', 500)
    }
}


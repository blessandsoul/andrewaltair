import dbConnect from '@/lib/db'
import Activity from '@/models/Activity'

export type ServerActivityType =
    | 'page_view'
    | 'subscribe'
    | 'comment'
    | 'reaction'
    | 'share'
    | 'purchase'
    | 'achievement'
    | 'quiz_complete'
    | 'download'
    | 'signup'

export interface ServerActivityOptions {
    type: ServerActivityType
    visitorId?: string
    userId?: string
    displayName?: string
    avatarUrl?: string
    city?: string
    country?: string
    targetType?: 'post' | 'tool' | 'prompt' | 'video' | 'bot' | 'page'
    targetId?: string
    targetTitle?: string
    targetSlug?: string
    metadata?: Record<string, any>
    isPublic?: boolean
}

/**
 * Server-side activity tracking utility
 * Use this in API routes to track activities that happen on the server
 */
export async function trackServerActivity(options: ServerActivityOptions): Promise<void> {
    try {
        await dbConnect()

        await Activity.create({
            type: options.type,
            visitorId: options.visitorId,
            userId: options.userId,
            displayName: options.displayName || 'Anonymous',
            avatarUrl: options.avatarUrl,
            city: options.city,
            country: options.country,
            targetType: options.targetType,
            targetId: options.targetId,
            targetTitle: options.targetTitle,
            targetSlug: options.targetSlug,
            metadata: options.metadata || {},
            isPublic: options.isPublic ?? true,
        })
    } catch (error) {
        // Silently fail - activity tracking should not break main functionality
        console.error('Server activity tracking error:', error)
    }
}

/**
 * Track signup activity
 */
export async function trackSignup(
    displayName: string,
    userId: string,
    options?: { city?: string; country?: string }
): Promise<void> {
    return trackServerActivity({
        type: 'signup',
        displayName,
        userId,
        city: options?.city,
        country: options?.country,
        isPublic: true
    })
}

/**
 * Track newsletter subscription
 */
export async function trackSubscribe(
    email: string,
    options?: { visitorId?: string; city?: string; country?: string }
): Promise<void> {
    // Mask email for privacy: "ex***@gmail.com"
    const maskedEmail = email.replace(/(.{2}).*@/, '$1***@')
    return trackServerActivity({
        type: 'subscribe',
        displayName: maskedEmail,
        visitorId: options?.visitorId,
        city: options?.city,
        country: options?.country,
        isPublic: true
    })
}

/**
 * Track purchase activity
 */
export async function trackPurchase(
    displayName: string,
    options?: {
        userId?: string
        productTitle?: string
        productId?: string
        amount?: number
        city?: string
        country?: string
    }
): Promise<void> {
    return trackServerActivity({
        type: 'purchase',
        displayName,
        userId: options?.userId,
        targetTitle: options?.productTitle,
        targetId: options?.productId,
        metadata: { amount: options?.amount },
        city: options?.city,
        country: options?.country,
        isPublic: true
    })
}

/**
 * Track achievement
 */
export async function trackAchievement(
    displayName: string,
    achievementName: string,
    options?: { userId?: string; city?: string; country?: string }
): Promise<void> {
    return trackServerActivity({
        type: 'achievement',
        displayName,
        userId: options?.userId,
        targetTitle: achievementName,
        metadata: { achievement: achievementName },
        city: options?.city,
        country: options?.country,
        isPublic: true
    })
}

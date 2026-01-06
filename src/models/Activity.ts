import mongoose, { Schema, Document } from 'mongoose'

export type ActivityType =
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
    | 'search'
    | 'rage_click'

export interface IActivity extends Document {
    _id: mongoose.Types.ObjectId
    type: ActivityType
    visitorId?: string
    userId?: mongoose.Types.ObjectId
    // User display info
    displayName?: string
    avatarUrl?: string
    // Location
    city?: string
    country?: string
    // Action details
    targetType?: 'post' | 'tool' | 'prompt' | 'video' | 'bot' | 'page'
    targetId?: string
    targetTitle?: string
    targetSlug?: string
    // Extra data
    metadata?: Record<string, any>
    // Visibility
    isPublic: boolean
    createdAt: Date
}

const ActivitySchema = new Schema<IActivity>(
    {
        type: {
            type: String,
            enum: ['page_view', 'subscribe', 'comment', 'reaction', 'share', 'purchase', 'achievement', 'quiz_complete', 'download', 'signup', 'search', 'rage_click'],
            required: true,
            index: true,
        },
        visitorId: {
            type: String,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        displayName: String,
        avatarUrl: String,
        city: String,
        country: String,
        targetType: {
            type: String,
            enum: ['post', 'tool', 'prompt', 'video', 'bot', 'page'],
        },
        targetId: String,
        targetTitle: String,
        targetSlug: String,
        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
        isPublic: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
)

// TTL index - auto-delete activities older than 7 days
ActivitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 })

// Index for fetching recent public activities
ActivitySchema.index({ isPublic: 1, createdAt: -1 })

// Compound index for type-based queries
ActivitySchema.index({ type: 1, createdAt: -1 })

const Activity = mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema)

export default Activity

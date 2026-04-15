import mongoose, { Schema, Document } from 'mongoose'

export interface IShortLink extends Document {
    _id: mongoose.Types.ObjectId
    slug: string
    originalUrl: string
    fallbackUrl: string
    title?: string
    expiresAt?: Date
    maxClicks?: number
    totalClicks: number
    uniqueClicks: number
    isActive: boolean
    lastClickedAt?: Date
    // Groups & Tags
    groupId?: mongoose.Types.ObjectId
    tags: string[]
    // Password protection
    password?: string
    // Branded redirect page
    showRedirectPage: boolean
    redirectPageDelay: number
    redirectPageMessage?: string
    // Webhook
    webhookUrl?: string
    webhookOnFirstClick: boolean
    webhookOnClickCount?: number
    createdAt: Date
    updatedAt: Date
}

const ShortLinkSchema = new Schema<IShortLink>(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        originalUrl: {
            type: String,
            required: true,
            trim: true,
        },
        fallbackUrl: {
            type: String,
            default: '/',
            trim: true,
        },
        title: {
            type: String,
            trim: true,
        },
        expiresAt: Date,
        maxClicks: Number,
        totalClicks: {
            type: Number,
            default: 0,
        },
        uniqueClicks: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastClickedAt: Date,
        // Groups & Tags
        groupId: {
            type: Schema.Types.ObjectId,
            ref: 'LinkGroup',
        },
        tags: {
            type: [String],
            default: [],
        },
        // Password protection
        password: String,
        // Branded redirect page
        showRedirectPage: {
            type: Boolean,
            default: false,
        },
        redirectPageDelay: {
            type: Number,
            default: 3,
        },
        redirectPageMessage: String,
        // Webhook
        webhookUrl: String,
        webhookOnFirstClick: {
            type: Boolean,
            default: false,
        },
        webhookOnClickCount: Number,
    },
    {
        timestamps: true,
    }
)

ShortLinkSchema.index({ isActive: 1, createdAt: -1 })
ShortLinkSchema.index({ expiresAt: 1 }, { sparse: true })
ShortLinkSchema.index({ groupId: 1 })
ShortLinkSchema.index({ tags: 1 })

const ShortLink = mongoose.models.ShortLink || mongoose.model<IShortLink>('ShortLink', ShortLinkSchema)

export default ShortLink

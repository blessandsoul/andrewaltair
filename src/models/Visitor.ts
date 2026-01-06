import mongoose, { Schema, Document } from 'mongoose'

export interface IVisitor extends Document {
    _id: mongoose.Types.ObjectId
    visitorId: string // Unique browser fingerprint / session ID
    sessionId?: string // Cookie session
    ip?: string
    userAgent?: string
    country?: string
    city?: string
    region?: string // State/Province for better geo accuracy
    timezone?: string // Visitor timezone
    language?: string // Browser language
    currentPage?: string
    referrer?: string
    deviceType: 'desktop' | 'mobile' | 'tablet'
    browser?: string
    os?: string
    screenResolution?: string // e.g. "1920x1080"
    lastSeen: Date
    firstSeen: Date
    pageViews: number
    isOnline: boolean
    // New vs Returning
    isReturning: boolean
    visitCount: number // Total visits from this visitor
    // Traffic Sources
    referrerSource?: 'direct' | 'organic' | 'social' | 'referral' | 'email' | 'paid'
    referrerDomain?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    utmContent?: string
    utmTerm?: string
    // Session Tracking
    sessionStart?: Date
    sessionDuration?: number // in seconds
    bounced?: boolean // true if only 1 page view in session
    exitPage?: string
    pagesInSession?: number
    // Engagement Metrics
    maxScrollDepth?: number // 0-100 percentage
    totalTimeOnSite?: number // cumulative seconds across all pages
    engagementScore?: number // 0-100 calculated score
    lastClickTime?: Date
}

const VisitorSchema = new Schema<IVisitor>(
    {
        visitorId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        sessionId: String,
        ip: String,
        userAgent: String,
        country: String,
        city: String,
        currentPage: String,
        referrer: String,
        deviceType: {
            type: String,
            enum: ['desktop', 'mobile', 'tablet'],
            default: 'desktop',
        },
        browser: String,
        os: String,
        lastSeen: {
            type: Date,
            default: Date.now,
        },
        firstSeen: {
            type: Date,
            default: Date.now,
        },
        pageViews: {
            type: Number,
            default: 1,
        },
        isOnline: {
            type: Boolean,
            default: true,
        },
        // Traffic Sources
        referrerSource: {
            type: String,
            enum: ['direct', 'organic', 'social', 'referral', 'email', 'paid'],
            default: 'direct',
        },
        referrerDomain: String,
        utmSource: String,
        utmMedium: String,
        utmCampaign: String,
        utmContent: String,
        utmTerm: String,
        // Session Tracking
        sessionStart: {
            type: Date,
            default: Date.now,
        },
        sessionDuration: {
            type: Number,
            default: 0,
        },
        bounced: {
            type: Boolean,
            default: true, // starts as bounced, set to false when 2nd page is viewed
        },
        exitPage: String,
        pagesInSession: {
            type: Number,
            default: 1,
        },
        // New Precision Fields
        region: String,
        timezone: String,
        language: String,
        screenResolution: String,
        isReturning: {
            type: Boolean,
            default: false,
        },
        visitCount: {
            type: Number,
            default: 1,
        },
        maxScrollDepth: {
            type: Number,
            default: 0,
        },
        totalTimeOnSite: {
            type: Number,
            default: 0,
        },
        engagementScore: {
            type: Number,
            default: 0,
        },
        lastClickTime: Date,
    },
    {
        timestamps: true,
    }
)

// TTL index - auto-delete visitors inactive for more than 24 hours
VisitorSchema.index({ lastSeen: 1 }, { expireAfterSeconds: 86400 })

// Compound index for online visitors
VisitorSchema.index({ isOnline: 1, lastSeen: -1 })

// Index for traffic source aggregation
VisitorSchema.index({ referrerSource: 1, firstSeen: -1 })

const Visitor = mongoose.models.Visitor || mongoose.model<IVisitor>('Visitor', VisitorSchema)

export default Visitor

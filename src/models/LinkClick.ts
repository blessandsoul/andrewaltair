import mongoose, { Schema, Document } from 'mongoose'

export interface ILinkClick extends Document {
    _id: mongoose.Types.ObjectId
    linkId: mongoose.Types.ObjectId
    ip: string
    country: string
    city: string
    device: 'desktop' | 'mobile' | 'tablet'
    browser: string
    os: string
    referrer: string
    utmSource: string
    utmMedium: string
    utmCampaign: string
    utmContent: string
    utmTerm: string
    isUnique: boolean
    clickedAt: Date
}

const LinkClickSchema = new Schema<ILinkClick>({
    linkId: {
        type: Schema.Types.ObjectId,
        ref: 'ShortLink',
        required: true,
    },
    ip: {
        type: String,
        default: '',
    },
    country: {
        type: String,
        default: 'Unknown',
    },
    city: {
        type: String,
        default: 'Unknown',
    },
    device: {
        type: String,
        enum: ['desktop', 'mobile', 'tablet'],
        default: 'desktop',
    },
    browser: {
        type: String,
        default: 'Unknown',
    },
    os: {
        type: String,
        default: 'Unknown',
    },
    referrer: {
        type: String,
        default: '',
    },
    utmSource: { type: String, default: '' },
    utmMedium: { type: String, default: '' },
    utmCampaign: { type: String, default: '' },
    utmContent: { type: String, default: '' },
    utmTerm: { type: String, default: '' },
    isUnique: {
        type: Boolean,
        default: false,
    },
    clickedAt: {
        type: Date,
        default: Date.now,
    },
})

LinkClickSchema.index({ linkId: 1, clickedAt: -1 })
LinkClickSchema.index({ linkId: 1, ip: 1 })
LinkClickSchema.index({ clickedAt: 1 })

const LinkClick = mongoose.models.LinkClick || mongoose.model<ILinkClick>('LinkClick', LinkClickSchema)

export default LinkClick

import mongoose, { Schema, Document } from 'mongoose';

export interface IAffiliateLink extends Document {
    userId: mongoose.Types.ObjectId;
    code: string;
    botId?: mongoose.Types.ObjectId; // If null, general store link
    campaign?: string; // e.g. "twitter-ad-1"

    // Stats
    clicks: number;
    conversions: number;
    totalRevenue: number;
    lastClickAt?: Date;

    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AffiliateLinkSchema = new Schema<IAffiliateLink>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        botId: {
            type: Schema.Types.ObjectId,
            ref: 'Bot',
            default: undefined
        },
        campaign: {
            type: String,
            trim: true
        },

        // Stats
        clicks: { type: Number, default: 0 },
        conversions: { type: Number, default: 0 },
        totalRevenue: { type: Number, default: 0 },
        lastClickAt: { type: Date },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Indexes
AffiliateLinkSchema.index({ code: 1 });
AffiliateLinkSchema.index({ userId: 1, botId: 1 });

const AffiliateLink = mongoose.models.AffiliateLink || mongoose.model<IAffiliateLink>('AffiliateLink', AffiliateLinkSchema);

export default AffiliateLink;

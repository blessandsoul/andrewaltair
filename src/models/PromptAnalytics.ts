// @ts-nocheck
import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPromptAnalytics extends Document {
    sessionId: string
    event: 'generate' | 'enhance' | 'copy' | 'share' | 'test' | 'suggest' | 'improve'
    role?: string
    model?: string
    generationTimeMs?: number
    tokenCount?: number
    success: boolean
    createdAt?: Date
    updatedAt?: Date
}

// Define model interface
interface IPromptAnalyticsModel extends Model<IPromptAnalytics> { }

const PromptAnalyticsSchema = new Schema<IPromptAnalytics>({
    sessionId: { type: String, required: true, index: true },
    event: {
        type: String,
        required: true,
        enum: ['generate', 'enhance', 'copy', 'share', 'test', 'suggest', 'improve'],
        index: true
    },
    role: { type: String },
    model: { type: String },
    generationTimeMs: { type: Number },
    tokenCount: { type: Number },
    success: { type: Boolean, default: true }
}, {
    timestamps: true
})

// Compound indexes for analytics queries
PromptAnalyticsSchema.index({ event: 1, createdAt: -1 })
PromptAnalyticsSchema.index({ role: 1, createdAt: -1 })

// Prevent model compilation error in development
const PromptAnalytics: IPromptAnalyticsModel = mongoose.models.PromptAnalytics || mongoose.model<IPromptAnalytics, IPromptAnalyticsModel>('PromptAnalytics', PromptAnalyticsSchema)

export default PromptAnalytics


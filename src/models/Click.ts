import mongoose, { Schema, Document } from 'mongoose'

export interface IClick extends Document {
    visitorId: string
    page: string
    x: number // percentage 0-100
    y: number // percentage 0-100
    element: string // CSS selector
    resolution: string // e.g. "1920x1080"
    createdAt: Date
}

const ClickSchema = new Schema<IClick>(
    {
        visitorId: {
            type: String,
            required: true,
            index: true,
        },
        page: {
            type: String,
            required: true,
            index: true,
        },
        x: {
            type: Number,
            required: true,
        },
        y: {
            type: Number,
            required: true,
        },
        element: String,
        resolution: String,
    },
    {
        timestamps: true,
    }
)

// Index for heatmap aggregation
ClickSchema.index({ page: 1, resolution: 1 })

// TTL 30 days
ClickSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 })

const Click = mongoose.models.Click || mongoose.model<IClick>('Click', ClickSchema)

export default Click

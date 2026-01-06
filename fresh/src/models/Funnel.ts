import mongoose, { Schema, Document } from 'mongoose'

export interface IFunnel extends Document {
    name: string
    steps: Array<{
        name: string
        type: 'page' | 'activity'
        target: string // url path or activity type
    }>
    isActive: boolean
    createdAt: Date
}

const FunnelSchema = new Schema<IFunnel>(
    {
        name: {
            type: String,
            required: true,
        },
        steps: [
            {
                name: String,
                type: {
                    type: String,
                    enum: ['page', 'activity'],
                    default: 'page'
                },
                target: String, // e.g. "/blog" or "subscribe"
            }
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
)

const Funnel = mongoose.models.Funnel || mongoose.model<IFunnel>('Funnel', FunnelSchema)

export default Funnel

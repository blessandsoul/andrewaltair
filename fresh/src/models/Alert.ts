import mongoose, { Schema, Document } from 'mongoose'

export interface IAlert extends Document {
    type: 'anomaly' | 'error' | 'system'
    severity: 'info' | 'warning' | 'critical'
    message: string
    isRead: boolean
    metadata?: Record<string, any>
    createdAt: Date
}

const AlertSchema = new Schema<IAlert>(
    {
        type: {
            type: String,
            enum: ['anomaly', 'error', 'system'],
            required: true,
            index: true,
        },
        severity: {
            type: String,
            enum: ['info', 'warning', 'critical'],
            required: true,
        },
        message: String,
        isRead: {
            type: Boolean,
            default: false,
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
)

const Alert = mongoose.models.Alert || mongoose.model<IAlert>('Alert', AlertSchema)

export default Alert

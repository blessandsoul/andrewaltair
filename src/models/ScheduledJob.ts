import mongoose, { Schema, Document } from 'mongoose'

export interface IScheduledJob extends Document {
    _id: mongoose.Types.ObjectId
    name: string
    type: 'email' | 'backup' | 'cleanup' | 'sync' | 'report' | 'other'
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
    schedule?: string // cron expression
    lastRun?: Date
    nextRun?: Date
    result?: {
        success: boolean
        message?: string
        data?: Record<string, unknown>
    }
    retryCount: number
    maxRetries: number
    createdAt: Date
    updatedAt: Date
}

const ScheduledJobSchema = new Schema<IScheduledJob>(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['email', 'backup', 'cleanup', 'sync', 'report', 'other'],
            default: 'other',
        },
        status: {
            type: String,
            enum: ['pending', 'running', 'completed', 'failed', 'cancelled'],
            default: 'pending',
        },
        schedule: String,
        lastRun: Date,
        nextRun: Date,
        result: {
            success: Boolean,
            message: String,
            data: Schema.Types.Mixed,
        },
        retryCount: {
            type: Number,
            default: 0,
        },
        maxRetries: {
            type: Number,
            default: 3,
        },
    },
    {
        timestamps: true,
    }
)

ScheduledJobSchema.index({ status: 1, nextRun: 1 })
ScheduledJobSchema.index({ type: 1 })

const ScheduledJob = mongoose.models.ScheduledJob || mongoose.model<IScheduledJob>('ScheduledJob', ScheduledJobSchema)

export default ScheduledJob

import mongoose, { Schema, Document } from 'mongoose'

export interface ISession extends Document {
    _id: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    token: string
    deviceInfo: {
        browser?: string
        os?: string
        device?: string
        ip?: string
    }
    isActive: boolean
    lastActivity: Date
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
}

const SessionSchema = new Schema<ISession>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        token: {
            type: String,
            required: true,
            unique: true,
        },
        deviceInfo: {
            browser: String,
            os: String,
            device: String,
            ip: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastActivity: {
            type: Date,
            default: Date.now,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
)

// Clean up expired sessions automatically (via TTL index)
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Index for finding user sessions
SessionSchema.index({ userId: 1, isActive: 1 })

const Session = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema)

export default Session

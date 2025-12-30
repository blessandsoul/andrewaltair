import mongoose, { Schema, Document } from 'mongoose';

export interface IMysticHistory extends Document {
    _id: mongoose.Types.ObjectId;
    sessionId: string; // For anonymous users
    userId?: mongoose.Types.ObjectId; // For logged-in users
    toolType: 'fortune' | 'love' | 'dream' | 'horoscope' | 'tarot' | 'numerology' | 'moonphase' | 'palmreading' | 'chat';
    input: Record<string, unknown>; // Flexible input storage (name, birth date, zodiac, etc.)
    result: Record<string, unknown>; // AI response
    isShared: boolean;
    shareToken?: string; // Unique token for shareable link
    createdAt: Date;
    updatedAt: Date;
}

const MysticHistorySchema = new Schema<IMysticHistory>(
    {
        sessionId: {
            type: String,
            required: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
            sparse: true,
        },
        toolType: {
            type: String,
            enum: ['fortune', 'love', 'dream', 'horoscope', 'tarot', 'numerology', 'moonphase', 'palmreading', 'chat'],
            required: true,
            index: true,
        },
        input: {
            type: Schema.Types.Mixed,
            required: true,
        },
        result: {
            type: Schema.Types.Mixed,
            required: true,
        },
        isShared: {
            type: Boolean,
            default: false,
        },
        shareToken: {
            type: String,
            unique: true,
            sparse: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
MysticHistorySchema.index({ createdAt: -1 });
MysticHistorySchema.index({ sessionId: 1, toolType: 1 });

const MysticHistory = mongoose.models.MysticHistory || mongoose.model<IMysticHistory>('MysticHistory', MysticHistorySchema);

export default MysticHistory;

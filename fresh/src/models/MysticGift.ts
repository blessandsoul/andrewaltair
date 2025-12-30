import mongoose, { Schema, Document } from 'mongoose';

export interface IMysticGift extends Document {
    _id: mongoose.Types.ObjectId;
    senderSessionId: string;
    senderId?: mongoose.Types.ObjectId;
    senderName: string;
    recipientEmail?: string;
    recipientPhone?: string;
    giftType: 'fortune' | 'love' | 'tarot' | 'horoscope' | 'numerology';
    personalMessage?: string;
    giftToken: string; // Unique claim token
    giftContent: Record<string, unknown>; // Pre-generated prediction
    isOpened: boolean;
    openedAt?: Date;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const MysticGiftSchema = new Schema<IMysticGift>(
    {
        senderSessionId: {
            type: String,
            required: true,
            index: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            sparse: true,
        },
        senderName: {
            type: String,
            required: true,
            trim: true,
        },
        recipientEmail: {
            type: String,
            trim: true,
            lowercase: true,
        },
        recipientPhone: {
            type: String,
            trim: true,
        },
        giftType: {
            type: String,
            enum: ['fortune', 'love', 'tarot', 'horoscope', 'numerology'],
            required: true,
        },
        personalMessage: {
            type: String,
            maxlength: 500,
        },
        giftToken: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        giftContent: {
            type: Schema.Types.Mixed,
            required: true,
        },
        isOpened: {
            type: Boolean,
            default: false,
        },
        openedAt: {
            type: Date,
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
);

// TTL index to auto-delete expired gifts after 7 days past expiry
MysticGiftSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 604800 });

const MysticGift = mongoose.models.MysticGift || mongoose.model<IMysticGift>('MysticGift', MysticGiftSchema);

export default MysticGift;

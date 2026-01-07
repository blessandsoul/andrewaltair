import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPromptPurchase extends Document {
    _id: mongoose.Types.ObjectId;

    // Reference
    promptId: mongoose.Types.ObjectId;
    promptTitle: string;        // Denormalized for easier queries
    promptSlug: string;         // For quick access links

    // Buyer Info
    userId?: mongoose.Types.ObjectId;
    userEmail: string;
    userName?: string;
    userPhone?: string;

    // Payment Details
    price: number;
    currency: 'GEL' | 'USD';

    // Status
    status: 'pending' | 'completed' | 'refunded' | 'expired';

    // Access
    accessToken: string;        // Unique token for accessing purchased prompt
    accessExpiresAt?: Date;     // Optional expiry for access
    accessedAt?: Date;          // When the user first accessed the prompt

    // Telegram Notification
    telegramNotified: boolean;
    telegramMessageId?: string;

    // Admin notes
    adminNotes?: string;

    createdAt: Date;
    updatedAt: Date;
}

const PromptPurchaseSchema = new Schema<IPromptPurchase>(
    {
        promptId: {
            type: Schema.Types.ObjectId,
            ref: 'MarketplacePrompt',
            required: true,
            index: true,
        },
        promptTitle: {
            type: String,
            required: true,
        },
        promptSlug: {
            type: String,
            required: true,
        },

        // Buyer Info
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        userEmail: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
        },
        userName: {
            type: String,
            trim: true,
        },
        userPhone: {
            type: String,
            trim: true,
        },

        // Payment Details
        price: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            enum: ['GEL', 'USD'],
            default: 'GEL',
        },

        // Status
        status: {
            type: String,
            enum: ['pending', 'completed', 'refunded', 'expired'],
            default: 'pending',
            index: true,
        },

        // Access
        accessToken: {
            type: String,
            required: true,
            unique: true,
        },
        accessExpiresAt: {
            type: Date,
        },
        accessedAt: {
            type: Date,
        },

        // Telegram
        telegramNotified: {
            type: Boolean,
            default: false,
        },
        telegramMessageId: {
            type: String,
        },

        // Admin
        adminNotes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
PromptPurchaseSchema.index({ userEmail: 1, promptId: 1 });
PromptPurchaseSchema.index({ accessToken: 1 });
PromptPurchaseSchema.index({ createdAt: -1 });
PromptPurchaseSchema.index({ status: 1, createdAt: -1 });

const PromptPurchase: Model<IPromptPurchase> =
    mongoose.models.PromptPurchase ||
    mongoose.model<IPromptPurchase>('PromptPurchase', PromptPurchaseSchema);

export default PromptPurchase;

import mongoose, { Schema, Document } from 'mongoose';

export interface IDeal extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    discount: number; // percentage
    originalPrice?: number;
    discountedPrice?: number;
    code?: string;
    expiresAt: Date;
    totalSlots: number;
    claimedSlots: number;
    claimedBy: mongoose.Types.ObjectId[];
    isActive: boolean;
    category: 'subscription' | 'credits' | 'course' | 'consultation';
    createdAt: Date;
    updatedAt: Date;
}

const DealSchema = new Schema<IDeal>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        discount: {
            type: Number,
            required: true,
            min: 1,
            max: 100,
        },
        originalPrice: Number,
        discountedPrice: Number,
        code: String,
        expiresAt: {
            type: Date,
            required: true,
        },
        totalSlots: {
            type: Number,
            default: 100,
        },
        claimedSlots: {
            type: Number,
            default: 0,
        },
        claimedBy: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        isActive: {
            type: Boolean,
            default: true,
        },
        category: {
            type: String,
            enum: ['subscription', 'credits', 'course', 'consultation'],
            default: 'credits',
        },
    },
    {
        timestamps: true,
    }
);

// Index for quick lookup of active deals
DealSchema.index({ isActive: 1, expiresAt: 1 });

const Deal = mongoose.models.Deal || mongoose.model<IDeal>('Deal', DealSchema);

export default Deal;

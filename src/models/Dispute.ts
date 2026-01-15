import mongoose, { Schema, Document } from 'mongoose';

export type DisputeStatus = 'open' | 'investigating' | 'resolved_refunded' | 'resolved_dismissed' | 'closed';
export type DisputeReason = 'not_working' | 'misleading' | 'poor_quality' | 'unauthorized' | 'other';

export interface IDispute extends Document {
    purchaseId: mongoose.Types.ObjectId;
    buyerId: mongoose.Types.ObjectId;
    sellerId: mongoose.Types.ObjectId;
    botId: mongoose.Types.ObjectId;
    reason: DisputeReason;
    description: string;
    status: DisputeStatus;
    messages: Array<{
        senderId: mongoose.Types.ObjectId;
        text: string;
        sentAt: Date;
        attachments?: string[];
    }>;
    resolution?: {
        resolvedBy: mongoose.Types.ObjectId;
        resolutionNotes: string;
        refundAmount?: number;
        resolvedAt: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}

const DisputeSchema = new Schema<IDispute>(
    {
        purchaseId: {
            type: Schema.Types.ObjectId,
            ref: 'Purchase',
            required: true,
            index: true
        },
        buyerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        sellerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        botId: {
            type: Schema.Types.ObjectId,
            ref: 'Bot',
            required: true
        },
        reason: {
            type: String,
            enum: ['not_working', 'misleading', 'poor_quality', 'unauthorized', 'other'],
            required: true
        },
        description: {
            type: String,
            required: true,
            maxlength: 2000
        },
        status: {
            type: String,
            enum: ['open', 'investigating', 'resolved_refunded', 'resolved_dismissed', 'closed'],
            default: 'open',
            index: true
        },
        messages: [{
            senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            text: { type: String, required: true },
            sentAt: { type: Date, default: Date.now },
            attachments: [{ type: String }]
        }],
        resolution: {
            resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
            resolutionNotes: { type: String },
            refundAmount: { type: Number },
            resolvedAt: { type: Date }
        }
    },
    {
        timestamps: true
    }
);

const Dispute = mongoose.models.Dispute || mongoose.model<IDispute>('Dispute', DisputeSchema);

export default Dispute;

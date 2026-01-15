import mongoose, { Schema, Document } from 'mongoose';

export interface IPayoutRequest extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    status: 'pending' | 'approved' | 'rejected' | 'paid';
    method: 'bank_transfer' | 'crypto' | 'paypal';
    details: string; // e.g. IBAN or Wallet Address
    adminNote?: string;
    processedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PayoutRequestSchema = new Schema<IPayoutRequest>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        amount: {
            type: Number,
            required: true,
            min: [10, 'Minimum payout is 10']
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'paid'],
            default: 'pending',
            index: true
        },
        method: {
            type: String,
            enum: ['bank_transfer', 'crypto', 'paypal'],
            required: true
        },
        details: {
            type: String,
            required: true
        },
        adminNote: { type: String },
        processedAt: { type: Date }
    },
    {
        timestamps: true
    }
);

export default mongoose.models.PayoutRequest || mongoose.model<IPayoutRequest>('PayoutRequest', PayoutRequestSchema);

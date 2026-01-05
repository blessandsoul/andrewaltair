import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchase extends Document {
    botId: string;
    userEmail: string;
    userId?: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentMethod?: string;
    transactionId?: string;
    purchasedAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>({
    botId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true, index: true },
    userId: { type: String },
    amount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
        index: true
    },
    paymentMethod: { type: String },
    transactionId: { type: String, unique: true, sparse: true },
    purchasedAt: { type: Date, default: Date.now }
});

// Compound index for efficient purchase checks
PurchaseSchema.index({ botId: 1, userEmail: 1, status: 1 });

export default mongoose.models.Purchase || mongoose.model<IPurchase>('Purchase', PurchaseSchema);


import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriptionPlan extends Document {
    name: string;
    slug: string; // e.g. 'pro', 'enterprise'
    price: number;
    interval: 'month' | 'year';
    features: string[];
    isActive: boolean;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        interval: { type: String, enum: ['month', 'year'], default: 'month' },
        features: [{ type: String }],
        isActive: { type: Boolean, default: true }
    },
    { versionKey: false }
);

export default mongoose.models.SubscriptionPlan || mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);

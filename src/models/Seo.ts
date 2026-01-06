import mongoose, { Schema, Document } from 'mongoose';

export interface ISeo extends Document {
    _id: mongoose.Types.ObjectId;
    key: string;
    value: Record<string, unknown>;
    type: 'robots' | 'sitemap' | 'meta' | 'keywords' | 'settings';
    createdAt: Date;
    updatedAt: Date;
}

const SeoSchema = new Schema<ISeo>(
    {
        key: {
            type: String,
            required: [true, 'Key is required'],
            unique: true,
        },
        value: {
            type: Schema.Types.Mixed,
            required: true,
        },
        type: {
            type: String,
            enum: ['robots', 'sitemap', 'meta', 'keywords', 'settings'],
            default: 'settings',
        },
    },
    {
        timestamps: true,
    }
);

const Seo = mongoose.models.Seo || mongoose.model<ISeo>('Seo', SeoSchema);

export default Seo;

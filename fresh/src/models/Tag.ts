import mongoose, { Schema, Document } from 'mongoose';

export interface ITag extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    description?: string;
    color: string;
    icon: string;
    count: number;
    createdAt: Date;
    updatedAt: Date;
}

const TagSchema = new Schema<ITag>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            default: '',
        },
        color: {
            type: String,
            default: 'bg-blue-500',
        },
        icon: {
            type: String,
            default: '🏷️',
        },
        count: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Text index for search
TagSchema.index({ name: 'text', description: 'text' });

const Tag = mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);

export default Tag;

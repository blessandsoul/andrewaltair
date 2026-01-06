import mongoose, { Schema, Document } from 'mongoose';

export interface ITool extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    url: string;
    logo?: string;
    category: string;
    pricing: 'free' | 'freemium' | 'paid';
    rating: number;
    featured: boolean;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

const ToolSchema = new Schema<ITool>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        url: {
            type: String,
            required: [true, 'URL is required'],
            trim: true,
        },
        logo: {
            type: String,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            index: true,
        },
        pricing: {
            type: String,
            enum: ['free', 'freemium', 'paid'],
            default: 'freemium',
            index: true,
        },
        rating: {
            type: Number,
            default: 4,
            min: 1,
            max: 5,
        },
        featured: {
            type: Boolean,
            default: false,
            index: true,
        },
        views: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Create text index for search
ToolSchema.index({ name: 'text', description: 'text', category: 'text' });

const Tool = mongoose.models.Tool || mongoose.model<ITool>('Tool', ToolSchema);

export default Tool;

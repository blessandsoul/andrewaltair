import mongoose, { Schema, Document } from 'mongoose';

export interface IEncyclopediaSection extends Document {
    _id: mongoose.Types.ObjectId;
    slug: string;
    title: string;
    description: string;
    gradientFrom: string;
    gradientTo: string;
    icon: string;
    order: number;
    isActive: boolean;
    articleCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const EncyclopediaSectionSchema = new Schema<IEncyclopediaSection>(
    {
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        gradientFrom: {
            type: String,
            default: 'purple-500',
        },
        gradientTo: {
            type: String,
            default: 'pink-500',
        },
        icon: {
            type: String,
            default: 'TbBook',
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        articleCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

EncyclopediaSectionSchema.index({ slug: 1 });
EncyclopediaSectionSchema.index({ order: 1 });

const EncyclopediaSection = mongoose.models.EncyclopediaSection ||
    mongoose.model<IEncyclopediaSection>('EncyclopediaSection', EncyclopediaSectionSchema);

export default EncyclopediaSection;

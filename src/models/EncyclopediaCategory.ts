import mongoose, { Schema, Document } from 'mongoose';

export interface IEncyclopediaCategory extends Document {
    _id: mongoose.Types.ObjectId;
    slug: string;
    title: string;
    icon: string;
    sectionId: mongoose.Types.ObjectId;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const EncyclopediaCategorySchema = new Schema<IEncyclopediaCategory>(
    {
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            trim: true,
            lowercase: true,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        icon: {
            type: String,
            default: '📚',
        },
        sectionId: {
            type: Schema.Types.ObjectId,
            ref: 'EncyclopediaSection',
            required: true,
            index: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for unique category per section
EncyclopediaCategorySchema.index({ sectionId: 1, slug: 1 }, { unique: true });
EncyclopediaCategorySchema.index({ sectionId: 1, order: 1 });

const EncyclopediaCategory = mongoose.models.EncyclopediaCategory ||
    mongoose.model<IEncyclopediaCategory>('EncyclopediaCategory', EncyclopediaCategorySchema);

export default EncyclopediaCategory;

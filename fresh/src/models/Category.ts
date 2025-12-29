import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    description?: string;
    color: string;
    icon: string;
    parentId?: mongoose.Types.ObjectId;
    count: number;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
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
            default: '#3b82f6',
        },
        icon: {
            type: String,
            default: 'Folder',
        },
        parentId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
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
CategorySchema.index({ name: 'text', description: 'text' });

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;

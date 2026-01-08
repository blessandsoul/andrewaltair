import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthor {
    name: string;
    avatar?: string;
    role?: string;
}

export interface IEncyclopediaArticle extends Document {
    _id: mongoose.Types.ObjectId;
    slug: string;
    title: string;
    content: string;
    excerpt: string;
    sectionId: mongoose.Types.ObjectId;
    categoryId: mongoose.Types.ObjectId;
    author: IAuthor;
    isFree: boolean;
    isPublished: boolean;
    order: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedMinutes: number;
    videoUrl?: string;
    videoId?: string;
    tags: string[];
    views: number;
    likes: number;
    version: number;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const AuthorSchema = new Schema<IAuthor>(
    {
        name: { type: String, required: true, default: 'Andrew Altair' },
        avatar: { type: String, default: '/images/andrew-avatar.jpg' },
        role: { type: String, default: 'AI Expert' },
    },
    { _id: false }
);

const EncyclopediaArticleSchema = new Schema<IEncyclopediaArticle>(
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
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        excerpt: {
            type: String,
            default: '',
        },
        sectionId: {
            type: Schema.Types.ObjectId,
            ref: 'EncyclopediaSection',
            required: true,
            index: true,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'EncyclopediaCategory',
            required: true,
            index: true,
        },
        author: {
            type: AuthorSchema,
            default: () => ({
                name: 'Andrew Altair',
                avatar: '/images/andrew-avatar.jpg',
                role: 'AI Expert',
            }),
        },
        isFree: {
            type: Boolean,
            default: false,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        order: {
            type: Number,
            default: 0,
        },
        difficulty: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner',
        },
        estimatedMinutes: {
            type: Number,
            default: 5,
        },
        videoUrl: {
            type: String,
        },
        videoId: {
            type: String,
        },
        tags: {
            type: [String],
            default: [],
        },
        views: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Number,
            default: 0,
        },
        version: {
            type: Number,
            default: 1,
        },
        publishedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for unique article per section
EncyclopediaArticleSchema.index({ sectionId: 1, slug: 1 }, { unique: true });
EncyclopediaArticleSchema.index({ categoryId: 1, order: 1 });
EncyclopediaArticleSchema.index({ isPublished: 1, sectionId: 1 });

// Full text search
EncyclopediaArticleSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

const EncyclopediaArticle = mongoose.models.EncyclopediaArticle ||
    mongoose.model<IEncyclopediaArticle>('EncyclopediaArticle', EncyclopediaArticleSchema);

export default EncyclopediaArticle;

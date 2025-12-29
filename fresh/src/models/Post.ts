import mongoose, { Schema, Document } from 'mongoose';

export interface IReactions {
    fire: number;
    love: number;
    mindblown: number;
    applause: number;
    insightful: number;
}

export interface IAuthor {
    name: string;
    avatar?: string;
    role?: string;
}

export interface IPost extends Document {
    _id: mongoose.Types.ObjectId;
    slug: string;
    title: string;
    excerpt: string;
    content?: string;
    coverImage?: string;
    category: string;
    tags: string[];
    author: IAuthor;
    publishedAt: Date;
    readingTime: number;
    views: number;
    comments: number;
    shares: number;
    reactions: IReactions;
    featured: boolean;
    trending: boolean;
    status: 'draft' | 'published' | 'scheduled' | 'archived';
    scheduledFor?: Date;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const ReactionsSchema = new Schema<IReactions>(
    {
        fire: { type: Number, default: 0 },
        love: { type: Number, default: 0 },
        mindblown: { type: Number, default: 0 },
        applause: { type: Number, default: 0 },
        insightful: { type: Number, default: 0 },
    },
    { _id: false }
);

const AuthorSchema = new Schema<IAuthor>(
    {
        name: { type: String, required: true },
        avatar: { type: String },
        role: { type: String },
    },
    { _id: false }
);

const PostSchema = new Schema<IPost>(
    {
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            trim: true,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        excerpt: {
            type: String,
            required: [true, 'Excerpt is required'],
            trim: true,
        },
        content: {
            type: String,
            default: '',
        },
        coverImage: {
            type: String,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            index: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        author: {
            type: AuthorSchema,
            required: true,
        },
        publishedAt: {
            type: Date,
            default: Date.now,
        },
        readingTime: {
            type: Number,
            default: 5,
        },
        views: {
            type: Number,
            default: 0,
        },
        comments: {
            type: Number,
            default: 0,
        },
        shares: {
            type: Number,
            default: 0,
        },
        reactions: {
            type: ReactionsSchema,
            default: () => ({
                fire: 0,
                love: 0,
                mindblown: 0,
                applause: 0,
                insightful: 0,
            }),
        },
        featured: {
            type: Boolean,
            default: false,
        },
        trending: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'scheduled', 'archived'],
            default: 'draft',
            index: true,
        },
        scheduledFor: {
            type: Date,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Create text index for search
PostSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;

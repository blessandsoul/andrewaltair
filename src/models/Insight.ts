import mongoose, { Schema, Document } from 'mongoose';

export interface IInsightSEO {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
}

export interface IInsightAuthor {
    name: string;
    avatar?: string;
    role?: string;
}

export interface IInsightReactions {
    fire: number;
    love: number;
    mindblown: number;
    applause: number;
    insightful: number;
}

export interface IInsight extends Document {
    _id: mongoose.Types.ObjectId;
    slug: string;
    content: string;
    excerpt: string;
    sourceUrl: string;
    sourceTitle: string;
    sourceDomain: string;
    sourceImage: string;
    tags: string[];
    autoTags: string[];
    categories: string[];
    language?: 'en';
    relatedInsights: string[];
    relatedPosts: string[];
    seo: IInsightSEO;
    author: IInsightAuthor;
    status: 'draft' | 'published' | 'archived';
    publishedAt: Date;
    views: number;
    reactions: IInsightReactions;
    likedBy?: { personaId: string; name: string }[]; // AI personas who liked this insight
    numericId: string;
    createdAt: Date;
    updatedAt: Date;
}

const InsightSEOSchema = new Schema<IInsightSEO>(
    {
        metaTitle: { type: String, maxlength: 70 },
        metaDescription: { type: String, maxlength: 160 },
        ogImage: { type: String },
        canonicalUrl: { type: String },
    },
    { _id: false }
);

const InsightAuthorSchema = new Schema<IInsightAuthor>(
    {
        name: { type: String, required: true },
        avatar: { type: String },
        role: { type: String },
    },
    { _id: false }
);

const InsightReactionsSchema = new Schema<IInsightReactions>(
    {
        fire: { type: Number, default: 0 },
        love: { type: Number, default: 0 },
        mindblown: { type: Number, default: 0 },
        applause: { type: Number, default: 0 },
        insightful: { type: Number, default: 0 },
    },
    { _id: false }
);

const InsightSchema = new Schema<IInsight>(
    {
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        excerpt: {
            type: String,
            required: [true, 'Excerpt is required'],
            trim: true,
        },
        sourceUrl: {
            type: String,
            required: [true, 'Source URL is required'],
        },
        sourceTitle: {
            type: String,
            default: '',
        },
        sourceDomain: {
            type: String,
            default: '',
        },
        sourceImage: {
            type: String,
            default: '',
        },
        tags: {
            type: [String],
            default: [],
        },
        autoTags: {
            type: [String],
            default: [],
        },
        categories: {
            type: [String],
            default: [],
            index: true,
        },
        // Set ONLY for English insights ('en'). Georgian + legacy docs leave it
        // ABSENT (KA-facing queries filter { $ne: 'en' }, which matches missing).
        // CRITICAL: never store 'ka' here. MongoDB's text index reads the field
        // named `language` as a per-doc stemming-language override, and 'ka' is
        // not a supported text-search language, so a 'ka' value makes .save()
        // throw "language override unsupported: ka". Hence enum is ['en'] only
        // and there is no default.
        language: {
            type: String,
            enum: ['en'],
            index: true,
        },
        relatedInsights: {
            type: [String],
            default: [],
        },
        relatedPosts: {
            type: [String],
            default: [],
        },
        seo: {
            type: InsightSEOSchema,
            default: () => ({}),
        },
        author: {
            type: InsightAuthorSchema,
            required: true,
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft',
            index: true,
        },
        publishedAt: {
            type: Date,
            default: Date.now,
        },
        views: {
            type: Number,
            default: 0,
        },
        reactions: {
            type: InsightReactionsSchema,
            default: () => ({
                fire: 0,
                love: 0,
                mindblown: 0,
                applause: 0,
                insightful: 0,
            }),
        },
        likedBy: {
            type: [{ _id: false, personaId: String, name: String }],
            default: [],
        },
        numericId: {
            type: String,
            unique: true,
            sparse: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

InsightSchema.index({ status: 1, publishedAt: -1 });
InsightSchema.index({ tags: 1 });
InsightSchema.index({ content: 'text', excerpt: 'text', sourceTitle: 'text' });

const Insight = mongoose.models.Insight || mongoose.model<IInsight>('Insight', InsightSchema);

export default Insight;

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

// Rich content section types
export interface ISection {
    icon?: string;  // lucide icon name (e.g., 'Brain', 'Factory', 'Globe')
    title?: string;
    content: string;
    type: 'intro' | 'section' | 'sarcasm' | 'warning' | 'tip' | 'fact' | 'opinion' | 'cta' | 'hashtags' | 'prompt' | 'author-comment' | 'graph';
}

// Cover images for responsive display
export interface ICoverImages {
    horizontal?: string;  // 16:9 for desktop
    vertical?: string;    // 9:16 for mobile
}

// Gallery image
export interface IGalleryImage {
    src: string;
    alt?: string;
    caption?: string;
}

// Advanced SEO interface
export interface ISEO {
    metaTitle?: string;       // SEO title (60 chars max), different from H1
    metaDescription?: string; // SEO description (160 chars max)
    keywords?: string;        // Comma-separated keywords
    canonicalUrl?: string;    // Canonical URL to prevent duplicates
    focusKeyword?: string;    // Main keyword to optimize for
    seoScore?: number;        // 0-100 SEO score
    ogImage?: string;         // Open Graph image for social
}

// Video embed interface
export interface IVideo {
    url: string;
    platform: 'youtube' | 'vimeo';
    videoId?: string;
    thumbnailUrl?: string;
}

// Prompt data for photo and video generation
export interface IPromptData {
    photoPrompt?: string;      // Prompt text for photo generation
    photoResult?: string;      // URL of uploaded photo result
    videoPrompt?: string;      // Prompt text for video generation
    videoResult?: string;      // URL of uploaded video result
    music?: string;            // Music style/suggestion
}

export interface IPost extends Document {
    _id: mongoose.Types.ObjectId;
    slug: string;
    title: string;
    excerpt: string;
    content?: string;
    rawContent?: string;  // Original pasted content
    coverImage?: string;  // Legacy single cover
    coverImages?: ICoverImages;  // New responsive covers
    gallery?: IGalleryImage[];  // Result gallery
    sections?: ISection[];  // Parsed sections
    categories: string[];
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
    seo?: ISEO;  // Advanced SEO fields
    videos?: IVideo[];  // Video embeds
    relatedPosts?: string[];  // Related post slugs
    prompts?: IPromptData;  // Photo and video prompts with results
    createdAt: Date;
    updatedAt: Date;
    numericId?: string;
    telegramContent?: string;  // Short Telegram version for channel posting
    repository?: IRepository;  // Optional repository data
    // AI & SEO Optimization Fields
    keyPoints?: string[];      // Array of key takeaways (3-5 items)
    faq?: { question: string; answer: string }[]; // Structured FAQ
    entities?: string[];       // Knowledge graph entities (people, tech, companies)
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

const SEOSchema = new Schema<ISEO>(
    {
        metaTitle: { type: String, maxlength: 60 },
        metaDescription: { type: String, maxlength: 160 },
        keywords: { type: String },
        canonicalUrl: { type: String },
        focusKeyword: { type: String },
        seoScore: { type: Number, min: 0, max: 100 },
        ogImage: { type: String },
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

const SectionSchema = new Schema<ISection>(
    {
        icon: { type: String },  // lucide icon name
        title: { type: String },
        content: { type: String, required: true },
        type: {
            type: String,
            enum: ['intro', 'section', 'sarcasm', 'warning', 'tip', 'fact', 'opinion', 'cta', 'hashtags', 'prompt', 'author-comment', 'quote', 'image', 'graph'],
            default: 'section'
        },
    },
    { _id: false }
);

const CoverImagesSchema = new Schema<ICoverImages>(
    {
        horizontal: { type: String },
        vertical: { type: String },
    },
    { _id: false }
);

const GalleryImageSchema = new Schema<IGalleryImage>(
    {
        src: { type: String, required: true },
        alt: { type: String },
        caption: { type: String },
    },
    { _id: false }
);

const VideoSchema = new Schema<IVideo>(
    {
        url: { type: String, required: true },
        platform: {
            type: String,
            enum: ['youtube', 'vimeo'],
            required: true
        },
        videoId: { type: String },
        thumbnailUrl: { type: String },
    },
    { _id: false }
);

const PromptDataSchema = new Schema<IPromptData>(
    {
        photoPrompt: { type: String },
        photoResult: { type: String },
        videoPrompt: { type: String },
        videoResult: { type: String },
        music: { type: String },
    },
    { _id: false }
);

// Repository Data Schema
export interface IRepository {
    type: 'github' | 'gitlab' | 'other';
    url: string;
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    topics: string[];
    license?: string;
}

const RepositorySchema = new Schema<IRepository>(
    {
        type: {
            type: String,
            enum: ['github', 'gitlab', 'other'],
            default: 'github',
            required: true
        },
        url: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String },
        stars: { type: Number, default: 0 },
        forks: { type: Number, default: 0 },
        language: { type: String },
        topics: { type: [String], default: [] },
        license: { type: String },
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
        rawContent: {
            type: String,
            default: '',
        },
        coverImage: {
            type: String,
        },
        coverImages: {
            type: CoverImagesSchema,
        },
        gallery: {
            type: [GalleryImageSchema],
            default: [],
        },
        sections: {
            type: [SectionSchema],
            default: [],
        },
        categories: {
            type: [String],
            default: [],
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
        seo: {
            type: SEOSchema,
            default: () => ({}),
        },
        videos: {
            type: [VideoSchema],
            default: [],
        },
        relatedPosts: {
            type: [String],
            default: [],
        },
        prompts: {
            type: PromptDataSchema,
            default: () => ({}),
        },
        repository: {
            type: RepositorySchema,
        },
        numericId: {
            type: String,
            unique: true,
            sparse: true,
            index: true
        },
        telegramContent: {
            type: String,
            default: ''
        },
        // AI & SEO Fields
        keyPoints: {
            type: [String],
            default: []
        },
        faq: {
            type: [{
                question: { type: String, required: true },
                answer: { type: String, required: true }
            }],
            default: []
        },
        entities: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true,
    }
);

// Create text index for search
PostSchema.index({ title: 'text', excerpt: 'text', content: 'text', rawContent: 'text', numericId: 'text' });

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;


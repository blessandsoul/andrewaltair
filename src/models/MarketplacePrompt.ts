import mongoose, { Schema, Document, Model } from 'mongoose';

// Variable in prompt template like [GENDER], [CLOTHING], etc.
export interface IPromptVariable {
    name: string;           // "GENDER"
    description?: string;   // "Choose character gender"
    type: 'text' | 'number' | 'select' | 'boolean';
    options?: string[];     // ["male", "female", "androgynous"]
    default?: string;
    required: boolean;
}

// Example image with generated result
export interface IExampleImage {
    src: string;
    alt?: string;
    promptUsed?: string;    // The actual prompt used to generate this image
}

// Version History
export interface IPromptVersion {
    version: number;
    promptTemplate: string;
    negativePrompt?: string;
    createdAt: Date;
    changelog?: string;
}

// A/B Test Variant
export interface IABTestVariant {
    name: string;
    promptTemplate: string;
    trafficSplit: number; // percentage 0-100
    views: number;
    conversions: number;
}

export interface IMarketplacePrompt extends Document {
    _id: mongoose.Types.ObjectId;

    // Basic Info
    slug: string;
    title: string;
    description: string;
    excerpt?: string;       // Short description for cards

    // Pricing
    price: number;          // 0 = free
    currency: 'GEL' | 'USD';
    originalPrice?: number; // For showing discounts
    isFree: boolean;

    // Prompt Content
    promptTemplate: string;             // The actual prompt with [VARIABLES]
    negativePrompt?: string;            // What not to generate
    variables: IPromptVariable[];       // Variables that can be customized
    instructions: string;               // How to use the prompt

    // Technical Details
    aiModel: string;                    // "Gemini 2.0", "Midjourney v6", etc.
    aiModelVersion?: string;            // "Nano", "Flash", "Pro"
    generationType: 'text-to-image' | 'text-to-text' | 'image-to-image' | 'text-to-video';
    aspectRatio?: string;               // "16:9", "1:1", etc.

    // Gallery
    coverImage: string;
    exampleImages: IExampleImage[];

    // Categorization
    category: string[];
    tags: string[];

    // Relationships
    relatedPrompts: mongoose.Types.ObjectId[];
    bundles: mongoose.Types.ObjectId[];

    // Advanced Features
    versions: IPromptVersion[];
    abTests: IABTestVariant[];

    // Author
    authorId?: mongoose.Types.ObjectId;
    authorName: string;
    authorAvatar?: string;

    // Stats
    views: number;
    purchases: number;
    downloads: number;      // For free prompts
    rating: number;         // Average rating (1-5)
    reviewsCount: number;

    // Status
    status: 'draft' | 'published' | 'archived';
    featuredOrder?: number; // For featured section (lower = higher priority)

    // SEO
    metaTitle?: string;
    metaDescription?: string;

    createdAt: Date;
    updatedAt: Date;
}

const PromptVariableSchema = new Schema<IPromptVariable>(
    {
        name: { type: String, required: true },
        description: { type: String },
        type: {
            type: String,
            enum: ['text', 'number', 'select', 'boolean'],
            default: 'text'
        },
        options: [{ type: String }],
        default: { type: String },
        required: { type: Boolean, default: true },
    },
    { _id: false }
);

const ExampleImageSchema = new Schema<IExampleImage>(
    {
        src: { type: String, required: true },
        alt: { type: String },
        promptUsed: { type: String },
    },
    { _id: false }
);

const PromptVersionSchema = new Schema<IPromptVersion>(
    {
        version: { type: Number, required: true },
        promptTemplate: { type: String, required: true },
        negativePrompt: { type: String },
        createdAt: { type: Date, default: Date.now },
        changelog: { type: String }
    },
    { _id: false }
);

const ABTestVariantSchema = new Schema<IABTestVariant>(
    {
        name: { type: String, required: true },
        promptTemplate: { type: String, required: true },
        trafficSplit: { type: Number, default: 50 },
        views: { type: Number, default: 0 },
        conversions: { type: Number, default: 0 }
    },
    { _id: false }
);

const MarketplacePromptSchema = new Schema<IMarketplacePrompt>(
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
            required: [true, 'Description is required'],
        },
        excerpt: {
            type: String,
            trim: true,
        },

        // Pricing
        price: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        currency: {
            type: String,
            enum: ['GEL', 'USD'],
            default: 'GEL',
        },
        originalPrice: {
            type: Number,
            min: 0,
        },
        isFree: {
            type: Boolean,
            default: true,
            index: true,
        },

        // Prompt Content
        promptTemplate: {
            type: String,
            required: [true, 'Prompt template is required'],
        },
        negativePrompt: {
            type: String,
        },
        variables: {
            type: [PromptVariableSchema],
            default: [],
        },
        instructions: {
            type: String,
            default: '',
        },

        // Technical Details
        aiModel: {
            type: String,
            required: [true, 'AI model is required'],
        },
        aiModelVersion: {
            type: String,
        },
        generationType: {
            type: String,
            enum: ['text-to-image', 'text-to-text', 'image-to-image', 'text-to-video'],
            default: 'text-to-image',
        },
        aspectRatio: {
            type: String, // e.g., "16:9"
        },

        // Gallery
        coverImage: {
            type: String,
            required: [true, 'Cover image is required'],
        },
        exampleImages: {
            type: [ExampleImageSchema],
            default: [],
        },

        // Categorization
        // Categorization
        category: {
            type: [String],
            default: [],
            index: true,
        },
        tags: {
            type: [String],
            default: [],
        },

        // Relationships
        relatedPrompts: [{
            type: Schema.Types.ObjectId,
            ref: 'MarketplacePrompt'
        }],
        bundles: [{
            type: Schema.Types.ObjectId,
            ref: 'PromptBundle' // Assuming a Bundle model exists or will exist
        }],

        // Advanced Features
        versions: {
            type: [PromptVersionSchema],
            default: []
        },
        abTests: {
            type: [ABTestVariantSchema],
            default: []
        },

        // Author
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        authorName: {
            type: String,
            default: 'Andrew Altair',
        },
        authorAvatar: {
            type: String,
        },

        // Stats
        views: {
            type: Number,
            default: 0,
        },
        purchases: {
            type: Number,
            default: 0,
        },
        downloads: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewsCount: {
            type: Number,
            default: 0,
        },

        // Status
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft',
            index: true,
        },
        featuredOrder: {
            type: Number,
        },

        // SEO
        metaTitle: {
            type: String,
        },
        metaDescription: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
MarketplacePromptSchema.index({ title: 'text', description: 'text', tags: 'text' });
MarketplacePromptSchema.index({ createdAt: -1 });
MarketplacePromptSchema.index({ purchases: -1 });
MarketplacePromptSchema.index({ rating: -1 });
MarketplacePromptSchema.index({ featuredOrder: 1 });
MarketplacePromptSchema.index({ category: 1, status: 1 });

// Pre-save hook to set isFree based on price
MarketplacePromptSchema.pre('save', async function () {
    this.isFree = this.price === 0;
});

const MarketplacePrompt: Model<IMarketplacePrompt> =
    mongoose.models.MarketplacePrompt ||
    mongoose.model<IMarketplacePrompt>('MarketplacePrompt', MarketplacePromptSchema);

export default MarketplacePrompt;

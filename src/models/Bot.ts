import mongoose, { Schema, Document } from 'mongoose';

export type BotCategory = 'content' | 'mystic' | 'business' | 'creative' | 'translation';
export type BotTier = 'free' | 'premium' | 'private';

export interface IBot extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    codename: string;
    version: string;
    description: string;
    shortDescription: string;
    category: BotCategory;
    tier: BotTier;
    price?: number;
    icon: string;
    color: string;
    features: string[];
    masterPrompt: string;
    rating: number;
    downloads: number;
    likes: number;
    isRecentlyAdded: boolean;
    isFeatured: boolean;
    isActive: boolean;
    // Creator info
    creator?: {
        name: string;
        avatar?: string;
        bio?: string;
        verified: boolean;
        totalSales: number;
        rating: number;
        responseTime?: string;
    };
    // Guarantees
    guarantees?: {
        moneyBack: number;
        freeUpdates: boolean;
        support: {
            type: string;
            responseTime: string;
            languages: string[];
        };
        warranty?: string;
    };
    // Stats
    stats?: {
        avgRating: number;
        totalReviews: number;
        successRate: number;
        completionRate: number;
        repeatPurchase: number;
    };
    // Updates
    updates?: {
        lastUpdated: string;
        currentVersionId?: mongoose.Types.ObjectId; // Link to BotVersion
        changelog: Array<{
            version: string;
            date: string;
            changes: string[];
        }>;
        roadmap: string[];
    };
    // Pricing & Sales
    salePrice?: number;
    saleEndsAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const BotSchema = new Schema<IBot>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            unique: true,
        },
        codename: {
            type: String,
            required: [true, 'Codename is required'],
            trim: true,
        },
        version: {
            type: String,
            required: true,
            default: 'V1.0',
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        shortDescription: {
            type: String,
            required: [true, 'Short description is required'],
            trim: true,
            maxlength: 150,
        },
        category: {
            type: String,
            enum: ['content', 'mystic', 'business', 'creative', 'translation'],
            required: true,
            index: true,
        },
        tier: {
            type: String,
            enum: ['free', 'premium', 'private'],
            default: 'free',
            index: true,
        },
        price: {
            type: Number,
            min: 0,
        },
        salePrice: {
            type: Number,
            min: 0,
            validate: {
                validator: function (this: any, val: number) {
                    return !val || val < this.price;
                },
                message: 'Sale price must be lower than regular price'
            }
        },
        saleEndsAt: {
            type: Date,
        },
        icon: {
            type: String,
            default: 'Bot',
        },
        color: {
            type: String,
            default: 'from-violet-500 to-purple-600',
        },
        features: [{
            type: String,
            trim: true,
        }],
        masterPrompt: {
            type: String,
            required: [true, 'Master prompt is required'],
        },
        rating: {
            type: Number,
            default: 4.5,
            min: 0,
            max: 5,
        },
        downloads: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Number,
            default: 0,
        },
        isRecentlyAdded: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        // Creator info
        creator: {
            name: { type: String },
            avatar: { type: String },
            bio: { type: String },
            verified: { type: Boolean, default: false },
            totalSales: { type: Number, default: 0 },
            rating: { type: Number, default: 5.0, min: 0, max: 5 },
            responseTime: { type: String },
        },
        // Guarantees
        guarantees: {
            moneyBack: { type: Number, default: 30 },
            freeUpdates: { type: Boolean, default: true },
            support: {
                type: { type: String, default: '24/7 ჩატი' },
                responseTime: { type: String, default: '< 2 საათი' },
                languages: [{ type: String }],
            },
            warranty: { type: String },
        },
        // Stats
        stats: {
            avgRating: { type: Number, default: 4.5, min: 0, max: 5 },
            totalReviews: { type: Number, default: 0 },
            successRate: { type: Number, default: 95, min: 0, max: 100 },
            completionRate: { type: Number, default: 90, min: 0, max: 100 },
            repeatPurchase: { type: Number, default: 60, min: 0, max: 100 },
        },
        // Updates
        updates: {
            lastUpdated: { type: String },
            currentVersionId: { type: Schema.Types.ObjectId, ref: 'BotVersion' },
            changelog: [{
                version: { type: String },
                date: { type: String },
                changes: [{ type: String }],
            }],
            roadmap: [{ type: String }],
        },
    },
    {
        timestamps: true,
        suppressReservedKeysWarning: true, // Allow 'isNew' field
    }
);

// Create text index for search
BotSchema.index({ name: 'text', description: 'text', codename: 'text' });

const Bot = mongoose.models.Bot || mongoose.model<IBot>('Bot', BotSchema);

export default Bot;


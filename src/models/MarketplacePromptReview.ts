import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMarketplacePromptReview extends Document {
    _id: mongoose.Types.ObjectId;

    // References
    promptId: mongoose.Types.ObjectId;
    purchaseId?: mongoose.Types.ObjectId;

    // Author
    authorName: string;
    authorEmail?: string;
    authorAvatar?: string;

    // Review content
    rating: number;             // 1-5 stars
    content?: string;           // Review text

    // Status
    status: 'pending' | 'approved' | 'rejected';

    // Helpful votes
    helpful: number;
    notHelpful: number;

    createdAt: Date;
    updatedAt: Date;
}

const MarketplacePromptReviewSchema = new Schema<IMarketplacePromptReview>(
    {
        promptId: {
            type: Schema.Types.ObjectId,
            ref: 'MarketplacePrompt',
            required: true,
            index: true,
        },
        purchaseId: {
            type: Schema.Types.ObjectId,
            ref: 'PromptPurchase',
        },

        // Author
        authorName: {
            type: String,
            required: true,
            default: 'Anonymous',
        },
        authorEmail: {
            type: String,
        },
        authorAvatar: {
            type: String,
        },

        // Review Content
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        content: {
            type: String,
            trim: true,
            maxlength: 2000,
        },

        // Status
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'approved',
            index: true,
        },

        // Helpful
        helpful: {
            type: Number,
            default: 0,
        },
        notHelpful: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
MarketplacePromptReviewSchema.index({ promptId: 1, purchaseId: 1 }, { unique: true, sparse: true });
MarketplacePromptReviewSchema.index({ promptId: 1, status: 1, createdAt: -1 });

const MarketplacePromptReview: Model<IMarketplacePromptReview> =
    mongoose.models.MarketplacePromptReview ||
    mongoose.model<IMarketplacePromptReview>('MarketplacePromptReview', MarketplacePromptReviewSchema);

export default MarketplacePromptReview;

import mongoose, { Schema, Document } from 'mongoose';

export interface IPromptReview extends Document {
    _id: mongoose.Types.ObjectId;
    promptId: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    sessionId?: string;

    rating: number; // 1-5 stars
    comment?: string;

    // Helpful votes
    helpful: number;
    notHelpful: number;

    createdAt: Date;
    updatedAt: Date;
}

const PromptReviewSchema = new Schema<IPromptReview>(
    {
        promptId: {
            type: Schema.Types.ObjectId,
            ref: 'Prompt',
            required: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        sessionId: {
            type: String,
            index: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
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

// Compound index to prevent duplicate reviews
PromptReviewSchema.index({ promptId: 1, userId: 1 }, { unique: true, sparse: true });
PromptReviewSchema.index({ promptId: 1, sessionId: 1 }, { unique: true, sparse: true });

const PromptReview = mongoose.models.PromptReview || mongoose.model<IPromptReview>('PromptReview', PromptReviewSchema);

export default PromptReview;


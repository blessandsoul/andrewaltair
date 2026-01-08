import mongoose, { Schema, Document } from 'mongoose';

export interface IEncyclopediaProgress extends Document {
    _id: mongoose.Types.ObjectId;
    visitorId: string;
    userId?: string;
    articleId: mongoose.Types.ObjectId;
    sectionId: mongoose.Types.ObjectId;
    readAt: Date;
    timeSpentSeconds: number;
    completed: boolean;
}

const EncyclopediaProgressSchema = new Schema<IEncyclopediaProgress>(
    {
        visitorId: {
            type: String,
            required: true,
            index: true,
        },
        userId: {
            type: String,
            index: true,
            sparse: true,
        },
        articleId: {
            type: Schema.Types.ObjectId,
            ref: 'EncyclopediaArticle',
            required: true,
        },
        sectionId: {
            type: Schema.Types.ObjectId,
            ref: 'EncyclopediaSection',
            required: true,
        },
        readAt: {
            type: Date,
            default: Date.now,
        },
        timeSpentSeconds: {
            type: Number,
            default: 0,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Unique progress per visitor/article
EncyclopediaProgressSchema.index({ visitorId: 1, articleId: 1 }, { unique: true });
EncyclopediaProgressSchema.index({ visitorId: 1, sectionId: 1 });

const EncyclopediaProgress = mongoose.models.EncyclopediaProgress ||
    mongoose.model<IEncyclopediaProgress>('EncyclopediaProgress', EncyclopediaProgressSchema);

export default EncyclopediaProgress;

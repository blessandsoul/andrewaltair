import mongoose, { Schema, Document } from 'mongoose';

export interface IEncyclopediaVersion extends Document {
    _id: mongoose.Types.ObjectId;
    articleId: mongoose.Types.ObjectId;
    version: number;
    title: string;
    content: string;
    changedBy: string;
    changeNote?: string;
    createdAt: Date;
}

const EncyclopediaVersionSchema = new Schema<IEncyclopediaVersion>(
    {
        articleId: {
            type: Schema.Types.ObjectId,
            ref: 'EncyclopediaArticle',
            required: true,
            index: true,
        },
        version: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        changedBy: {
            type: String,
            default: 'Admin',
        },
        changeNote: {
            type: String,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

EncyclopediaVersionSchema.index({ articleId: 1, version: -1 });

const EncyclopediaVersion = mongoose.models.EncyclopediaVersion ||
    mongoose.model<IEncyclopediaVersion>('EncyclopediaVersion', EncyclopediaVersionSchema);

export default EncyclopediaVersion;

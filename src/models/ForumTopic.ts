import mongoose, { Schema, Document } from 'mongoose';

/**
 * A forum discussion topic — a news item the user feeds by URL. Once the daily cron
 * (or the admin "generate now" button) runs, the 20 historical AI personas post their
 * opinions on it and it flips status 'queued' → 'published'.
 */
export interface IForumTopic extends Document {
    _id: mongoose.Types.ObjectId;
    slug: string;
    titleKa: string;        // Georgian topic title (generated from source)
    summaryKa: string;      // 1-2 sentence Georgian summary the personas react to
    tone: 'serious' | 'fun'; // debate tone — 'fun' = playful/absurd takes
    sourceUrl: string;
    sourceImage: string;
    sourceDomain: string;
    status: 'queued' | 'published';
    postCount: number;      // number of persona posts generated
    views: number;
    hotScore: number;       // views + reactions, drives the "🔥 hot" sort
    verdictKa?: string;     // AI 2-line summary of the debate (verdict + main conflict)
    likedBy?: { personaId: string; name: string }[];
    numericId: string;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ForumTopicSchema = new Schema<IForumTopic>(
    {
        slug: { type: String, required: true, unique: true, trim: true },
        titleKa: { type: String, required: true, trim: true },
        summaryKa: { type: String, default: '' },
        tone: { type: String, enum: ['serious', 'fun'], default: 'serious' },
        sourceUrl: { type: String, default: '' },
        sourceImage: { type: String, default: '' },
        sourceDomain: { type: String, default: '' },
        status: {
            type: String,
            enum: ['queued', 'published'],
            default: 'queued',
            index: true,
        },
        postCount: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        hotScore: { type: Number, default: 0 },
        verdictKa: { type: String, default: '' },
        likedBy: {
            type: [{ _id: false, personaId: String, name: String }],
            default: [],
        },
        numericId: { type: String, unique: true, sparse: true, index: true },
        publishedAt: { type: Date },
    },
    { timestamps: true }
);

ForumTopicSchema.index({ status: 1, createdAt: 1 });   // cron: oldest queued first
ForumTopicSchema.index({ status: 1, publishedAt: -1 }); // public list: newest published first
ForumTopicSchema.index({ status: 1, hotScore: -1 });    // public list: "🔥 hot" sort

const ForumTopic =
    mongoose.models.ForumTopic || mongoose.model<IForumTopic>('ForumTopic', ForumTopicSchema);

export default ForumTopic;

import mongoose, { Schema, Document } from 'mongoose';

/**
 * A single persona's contribution to a forum topic. Top-level opinions have no
 * parentId; debate replies point at the post they answer via parentId. `personaId`
 * maps to FORUM_PERSONAS in src/lib/georgian-forum-personas.ts. `likedBy` holds the
 * other personas who "liked" it (social proof), same shape as Comment.likedBy.
 */
export interface IForumPost extends Document {
    _id: mongoose.Types.ObjectId;
    topicId: mongoose.Types.ObjectId;
    personaId: string;
    author: { name: string; avatar?: string };
    content: string;        // Georgian
    parentId?: mongoose.Types.ObjectId | null;
    likedBy?: { personaId: string; name: string }[];
    likes: number;
    agrees: number;         // 👍 "ვეთანხმები" tally (drives the "who's right" ranking)
    disagrees: number;      // 👎 "არ ვეთანხმები" tally
    isUser?: boolean;       // true = a real visitor's comment/question (not a persona)
    userName?: string;      // display name for user-submitted posts/questions
    isPrediction?: boolean; // true = a persona's PREDICTION of the outcome (not an opinion)
    predictionVerdict?: 'pending' | 'right' | 'wrong'; // admin-resolved outcome of the prediction
    createdAt: Date;
    updatedAt: Date;
}

const ForumPostAuthorSchema = new Schema<IForumPost['author']>(
    {
        name: { type: String, required: true },
        avatar: { type: String },
    },
    { _id: false }
);

const ForumPostSchema = new Schema<IForumPost>(
    {
        topicId: { type: Schema.Types.ObjectId, ref: 'ForumTopic', required: true, index: true },
        personaId: { type: String, required: true },
        author: { type: ForumPostAuthorSchema, required: true },
        content: { type: String, required: true },
        parentId: { type: Schema.Types.ObjectId, ref: 'ForumPost', default: null },
        likedBy: {
            type: [{ _id: false, personaId: String, name: String }],
            default: [],
        },
        likes: { type: Number, default: 0 },
        agrees: { type: Number, default: 0 },
        disagrees: { type: Number, default: 0 },
        isUser: { type: Boolean, default: false },
        userName: { type: String },
        isPrediction: { type: Boolean, default: false },
        predictionVerdict: { type: String, enum: ['pending', 'right', 'wrong'], default: 'pending' },
    },
    { timestamps: true }
);

ForumPostSchema.index({ topicId: 1, createdAt: 1 });
ForumPostSchema.index({ personaId: 1, createdAt: -1 }); // persona profile feed
ForumPostSchema.index({ content: 'text' });             // opinion search
ForumPostSchema.index({ isPrediction: 1, personaId: 1 }); // prophet leaderboard

const ForumPost =
    mongoose.models.ForumPost || mongoose.model<IForumPost>('ForumPost', ForumPostSchema);

export default ForumPost;

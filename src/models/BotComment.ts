import mongoose, { Schema, Document } from 'mongoose';

export interface IBotComment extends Document {
    _id: mongoose.Types.ObjectId;
    botId: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    userName: string;
    userAvatar?: string;
    text: string;
    rating?: number;
    likes: number;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const BotCommentSchema = new Schema<IBotComment>(
    {
        botId: {
            type: Schema.Types.ObjectId,
            ref: 'Bot',
            required: [true, 'Bot ID is required'],
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        userName: {
            type: String,
            required: [true, 'User name is required'],
            trim: true,
        },
        userAvatar: {
            type: String,
        },
        text: {
            type: String,
            required: [true, 'Comment text is required'],
            trim: true,
            maxlength: [2000, 'Comment must be less than 2000 characters'],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        likes: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'approved',
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
BotCommentSchema.index({ botId: 1, createdAt: -1 });

const BotComment = mongoose.models.BotComment || mongoose.model<IBotComment>('BotComment', BotCommentSchema);

export default BotComment;


import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
    _id: mongoose.Types.ObjectId;
    postId: string; // Changed to string to support both posts and tools
    author: {
        name: string;
        email?: string;
        avatar?: string;
        userId?: mongoose.Types.ObjectId;
    };
    content: string;
    likes: number;
    parentId?: mongoose.Types.ObjectId;
    status: 'pending' | 'approved' | 'rejected' | 'spam';
    isSpam?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
    {
        postId: {
            type: String,
            required: [true, 'Post ID is required'],
            index: true,
        },
        author: {
            name: { type: String, required: true },
            email: { type: String },
            avatar: { type: String },
            userId: { type: Schema.Types.ObjectId, ref: 'User' },
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
            trim: true,
            maxlength: [2000, 'Comment must be less than 2000 characters'],
        },
        likes: {
            type: Number,
            default: 0,
        },
        parentId: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            default: null,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'spam'],
            default: 'pending',
        },
        isSpam: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for getting replies
CommentSchema.index({ parentId: 1 });

const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;

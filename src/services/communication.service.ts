import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';
import { sendEmail, sendWelcomeEmail, sendPasswordResetEmail, sendNotificationEmail } from '@/lib/email';
import { sendTelegramPost, TelegramPostData } from '@/lib/telegram';
import mongoose from 'mongoose';

import type { IComment } from '@/models/Comment';

interface GetCommentsParams {
    postId?: string;
    status?: IComment['status'];
    limit?: number;
    page?: number;
}

interface CreateCommentData {
    postId: string;
    text: string;
    parentId?: string;
}

interface CreateCommentUser {
    _id: mongoose.Types.ObjectId | string;
    fullName?: string;
    username?: string;
    avatar?: string;
}

interface SendEmailParams {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
}

export class CommunicationService {
    /**
     * --- COMMENTS ---
     */

    static async getComments(params: GetCommentsParams) {
        await dbConnect();
        const { postId, status, limit = 50, page = 1 } = params;

        const query: Record<string, unknown> = {};
        if (postId) query.postId = postId;
        if (status) query.status = status;

        const total = await Comment.countDocuments(query);
        const comments = await Comment.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        // Populate logic (moved from route)
        // Note: Dynamic imports in route were to avoid circular deps or lazy load.
        // We can keep them or import top level if safe.
        // Logic below mimics route aggregation for Post Titles.

        const Tool = (await import('@/models/Tool')).default;
        const Post = (await import('@/models/Post')).default;

        const toolIds: string[] = [];
        const postIds: string[] = [];

        comments.forEach((comment) => {
            if (comment.postId && typeof comment.postId === 'string') {
                if (comment.postId.startsWith('tool-')) {
                    toolIds.push(comment.postId.replace('tool-', ''));
                } else {
                    postIds.push(comment.postId);
                }
            }
        });

        const [tools, posts] = await Promise.all([
            toolIds.length > 0 ? Tool.find({ _id: { $in: toolIds } }).select('_id name').lean() : Promise.resolve([]),
            postIds.length > 0 ? Post.find({ _id: { $in: postIds } }).select('_id title').lean() : Promise.resolve([])
        ]);

        const toolMap = new Map(tools.map((t) => [t._id.toString(), t.name]));
        const postMap = new Map(posts.map((p) => [p._id.toString(), p.title]));

        const transformedComments = comments.map((comment) => {
            let postTitle = 'Unknown Post';
            if (comment.postId && typeof comment.postId === 'string') {
                if (comment.postId.startsWith('tool-')) {
                    const toolId = comment.postId.replace('tool-', '');
                    const toolName = toolMap.get(toolId);
                    if (toolName) postTitle = `Tool: ${toolName}`;
                } else {
                    const title = postMap.get(comment.postId);
                    if (title) postTitle = `Post: ${title}`;
                }
            }
            return {
                ...comment,
                id: comment._id.toString(),
                postId: comment.postId,
                postTitle,
                _id: undefined,
            };
        });

        return {
            comments: transformedComments,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        };
    }

    static async createComment(data: CreateCommentData, user: CreateCommentUser) {
        await dbConnect();
        const { postId, text, parentId } = data;

        if (!postId || !text) throw new Error('postId და text აუცილებელია');
        if (text.length < 2 || text.length > 2000) throw new Error('კომენტარი უნდა იყოს 2-2000 სიმბოლო');

        const comment = new Comment({
            postId,
            content: text.trim(),
            parentId: parentId || null,
            author: {
                userId: user._id.toString(),
                name: user.fullName || user.username, // Fallback if fullName missing
                avatar: user.avatar,
            },
            status: 'pending',
        });
        await comment.save();

        // Send email notification to Admin (optional, not in original route but good practice)
        // or notify post author.
        // For now just return.

        return { ...comment.toObject(), id: comment._id.toString() };
    }

    static async deleteComment(id: string) {
        await dbConnect();
        if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid comment ID');
        return await Comment.findByIdAndDelete(id);
    }

    static async updateCommentStatus(id: string, status: 'approved' | 'rejected') {
        await dbConnect();
        if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid comment ID');
        return await Comment.findByIdAndUpdate(id, { status }, { new: true });
    }

    /**
     * --- TELEGRAM ---
     */
    static async sendTelegram(data: TelegramPostData) {
        return await sendTelegramPost(data);
    }

    /**
     * --- EMAIL ---
     */
    static async sendEmail(params: SendEmailParams) {
        return await sendEmail(params);
    }

    static async sendWelcomeEmail(name: string, email: string, verificationUrl?: string) {
        return await sendWelcomeEmail(name, email, verificationUrl);
    }

    static async sendPasswordReset(name: string, email: string, resetLink: string) {
        return await sendPasswordResetEmail(name, email, resetLink);
    }

    static async sendNotification(to: string, title: string, message: string, actionUrl?: string) {
        return await sendNotificationEmail(to, title, message, actionUrl);
    }
}

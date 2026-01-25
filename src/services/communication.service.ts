import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';
import { sendEmail, sendWelcomeEmail, sendPasswordResetEmail, sendNotificationEmail } from '@/lib/email';
import { sendTelegramPost, TelegramPostData } from '@/lib/telegram';
import mongoose from 'mongoose';

export class CommunicationService {
    /**
     * --- COMMENTS ---
     */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async getComments(params: any) {
        await dbConnect();
        const { postId, status, limit = 50, page = 1 } = params;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Tool = (await import('@/models/Tool')).default;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Post = (await import('@/models/Post')).default;

        const toolIds: string[] = [];
        const postIds: string[] = [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        comments.forEach((comment: any) => {
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const toolMap = new Map(tools.map((t: any) => [t._id.toString(), t.name]));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const postMap = new Map(posts.map((p: any) => [p._id.toString(), p.title]));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedComments = comments.map((comment: any) => {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async createComment(data: any, user: any) {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async sendEmail(params: any) {
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

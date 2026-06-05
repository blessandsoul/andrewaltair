export const dynamic = 'force-dynamic';

import mongoose from 'mongoose';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { generateAndSaveComments, seedLikes } from '@/lib/ai-comment-generator';

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * POST /api/posts/[id]/ai-comments  (admin only)
 *
 * Generates 3-5 Georgian AI-persona comments for the post and stores them with
 * isAI:true, status:'approved'. Idempotent — if AI comments already exist for the
 * post it skips, so re-publishing / re-saving never duplicates them.
 *
 * Fired fire-and-forget from the publish flow, so it must never block publishing.
 */
export async function POST(request: Request, { params }: RouteParams) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('ადმინისტრატორის წვდომა საჭიროა');
    }

    try {
        await dbConnect();
        const { id } = await params;

        // Resolve by ObjectId or slug (mirrors GET /api/posts/[id])
        let post = null;
        if (mongoose.Types.ObjectId.isValid(id)) {
            post = await Post.findById(id).select('_id title excerpt').lean();
        }
        if (!post) {
            post = await Post.findOne({ slug: id }).select('_id title excerpt').lean();
        }
        if (!post) {
            return apiError(ERROR_CODES.POST_NOT_FOUND, 'Post not found', 404);
        }

        const pid = post._id.toString();
        const result = await generateAndSaveComments(pid, {
            title: post.title,
            excerpt: post.excerpt,
        });
        await seedLikes(Post, pid);

        return apiSuccess(result, 'AI comments processed');
    } catch (error) {
        console.error('AI comments error:', error);
        return apiError(ERROR_CODES.COMMENT_CREATE_FAILED, 'Failed to generate AI comments', 500);
    }
}

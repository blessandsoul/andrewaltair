export const dynamic = 'force-dynamic';

import mongoose from 'mongoose';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import dbConnect from '@/lib/db';
import Video from '@/models/Video';
import { generateAndSaveComments, seedLikes } from '@/lib/ai-comment-generator';

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * POST /api/videos/[id]/ai-comments  (admin only)
 *
 * Generates 3-5 Georgian AI-persona comments for a video, stored with isAI:true,
 * status:'approved', keyed by the video's bare _id (matches the
 * <Comments postId={video.id}> on the public video page). Idempotent.
 * Video has no excerpt — uses `description` as the seed body.
 */
export async function POST(request: Request, { params }: RouteParams) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('ადმინისტრატორის წვდომა საჭიროა');
    }

    try {
        await dbConnect();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return apiError(ERROR_CODES.VIDEO_NOT_FOUND, 'Video not found', 404);
        }
        const video = await Video.findById(id).select('_id title description').lean();
        if (!video) {
            return apiError(ERROR_CODES.VIDEO_NOT_FOUND, 'Video not found', 404);
        }

        const vid = video._id.toString();
        const result = await generateAndSaveComments(vid, {
            title: video.title,
            excerpt: video.description,
        });
        await seedLikes(Video, vid);

        return apiSuccess(result, 'AI comments processed');
    } catch (error) {
        console.error('Video AI comments error:', error);
        return apiError(ERROR_CODES.COMMENT_CREATE_FAILED, 'Failed to generate AI comments', 500);
    }
}

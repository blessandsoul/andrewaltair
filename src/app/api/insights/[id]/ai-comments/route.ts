export const dynamic = 'force-dynamic';

import mongoose from 'mongoose';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import dbConnect from '@/lib/db';
import Insight from '@/models/Insight';
import { generateAndSaveComments, seedLikes } from '@/lib/ai-comment-generator';

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * POST /api/insights/[id]/ai-comments  (admin only)
 *
 * Generates 3-5 Georgian AI-persona comments for an insight, stored with
 * isAI:true, status:'approved', keyed by the insight's bare _id (matches the
 * <Comments postId={insight.id}> on the public insight page). Idempotent.
 */
export async function POST(request: Request, { params }: RouteParams) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('ადმინისტრატორის წვდომა საჭიროა');
    }

    try {
        await dbConnect();
        const { id } = await params;

        let insight = null;
        if (mongoose.Types.ObjectId.isValid(id)) {
            insight = await Insight.findById(id).select('_id sourceTitle excerpt').lean();
        }
        if (!insight) {
            insight = await Insight.findOne({ slug: id }).select('_id sourceTitle excerpt').lean();
        }
        if (!insight) {
            return apiError(ERROR_CODES.POST_NOT_FOUND, 'Insight not found', 404);
        }

        const iid = insight._id.toString();
        const result = await generateAndSaveComments(iid, {
            title: insight.sourceTitle || insight.excerpt,
            excerpt: insight.excerpt,
        });
        await seedLikes(Insight, iid);

        return apiSuccess(result, 'AI comments processed');
    } catch (error) {
        console.error('Insight AI comments error:', error);
        return apiError(ERROR_CODES.COMMENT_CREATE_FAILED, 'Failed to generate AI comments', 500);
    }
}

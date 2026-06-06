export const dynamic = 'force-dynamic';

import mongoose from 'mongoose';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from '@/lib/db';
import ForumPost from '@/models/ForumPost';
import ForumTopic from '@/models/ForumTopic';

/**
 * POST /api/forum/posts/[id]/react  {type:'agree'|'disagree'}  (public, no AI)
 * Increments the post's agree/disagree tally + bumps the topic hotScore.
 * Dedup is client-side (localStorage) — cheap, no auth needed.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return apiError(ERROR_CODES.FORUM_NOT_FOUND, 'Invalid post id', 400);
        }
        const body = await request.json().catch(() => ({}));
        const type = body?.type;
        if (type !== 'agree' && type !== 'disagree') {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'type must be agree|disagree', 400);
        }

        await dbConnect();
        const field = type === 'agree' ? 'agrees' : 'disagrees';
        const post = await ForumPost.findByIdAndUpdate(id, { $inc: { [field]: 1 } }, { new: true })
            .select('agrees disagrees topicId')
            .lean<{ agrees: number; disagrees: number; topicId: unknown } | null>();

        if (!post) return apiError(ERROR_CODES.FORUM_NOT_FOUND, 'Post not found', 404);

        ForumTopic.updateOne({ _id: post.topicId }, { $inc: { hotScore: 1 } }).catch(() => {});

        return apiSuccess({ agrees: post.agrees, disagrees: post.disagrees }, 'reacted');
    } catch (error) {
        console.error('[API] forum react error:', error);
        return apiError(ERROR_CODES.FORUM_FETCH_FAILED, 'Failed to react', 500);
    }
}

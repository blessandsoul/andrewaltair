export const dynamic = 'force-dynamic';

import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from '@/lib/db';
import ForumTopic from '@/models/ForumTopic';
import ForumPost from '@/models/ForumPost';
import { personaReplyToUser } from '@/lib/georgian-forum-generator';
import { getClientIp, checkAiRateLimit, recordAiUse, rateLimitMessageKa } from '@/lib/forum-ratelimit';

/**
 * POST /api/forum/topics/[id]/comment  {parentId, name?, content}
 * A reader challenges a persona's opinion (parentId = that opinion's post); we store
 * the reader's comment + the persona's reply (parent → user → reply). Rate-limited.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const ip = getClientIp(request);
        const rl = checkAiRateLimit(ip);
        if (!rl.ok) return apiError(ERROR_CODES.RATE_LIMITED, rateLimitMessageKa(rl.reason), 429);

        const { id } = await params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return apiError(ERROR_CODES.FORUM_NOT_FOUND, 'Invalid topic id', 400);
        }
        const body = await request.json().catch(() => ({}));
        const parentId = String(body?.parentId || '');
        const content = String(body?.content || '').trim();
        const name = (String(body?.name || '').trim().slice(0, 40)) || 'მკითხველი';
        if (!mongoose.Types.ObjectId.isValid(parentId)) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'valid parentId required', 400);
        }
        if (content.length < 3 || content.length > 300) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'content must be 3..300 chars', 400);
        }

        await dbConnect();
        const [topic, parent] = await Promise.all([
            ForumTopic.findById(id).select('slug titleKa summaryKa').lean<{ slug: string; titleKa: string; summaryKa: string } | null>(),
            ForumPost.findById(parentId).select('topicId personaId isUser').lean<{ topicId: unknown; personaId: string; isUser?: boolean } | null>(),
        ]);
        if (!topic) return apiError(ERROR_CODES.FORUM_NOT_FOUND, 'Topic not found', 404);
        if (!parent || String(parent.topicId) !== id || parent.isUser) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'parent must be a persona opinion in this topic', 400);
        }

        const res = await personaReplyToUser(parent.personaId, { titleKa: topic.titleKa, summaryKa: topic.summaryKa }, content);
        if (!res) return apiError(ERROR_CODES.FORUM_GENERATE_FAILED, 'No reply generated', 502);
        recordAiUse(ip);

        const userPost = await ForumPost.create({
            topicId: id, personaId: 'reader', author: { name }, content,
            parentId, isUser: true, userName: name,
        });
        await ForumPost.create({
            topicId: id, personaId: parent.personaId, author: { name: res.name }, content: res.reply,
            parentId: userPost._id, isUser: false,
        });
        await ForumTopic.updateOne({ _id: id }, { $inc: { postCount: 2, hotScore: 2 } });
        revalidatePath(`/forum/${topic.slug}`);

        return apiSuccess({ ok: true }, 'replied');
    } catch (error) {
        console.error('[API] forum comment error:', error);
        return apiError(ERROR_CODES.FORUM_GENERATE_FAILED, 'Failed to comment', 500);
    }
}

export const dynamic = 'force-dynamic';

import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from '@/lib/db';
import ForumTopic from '@/models/ForumTopic';
import ForumPost from '@/models/ForumPost';
import { personaReplyToUser } from '@/lib/georgian-forum-generator';
import { getForumPersona, FORUM_PERSONAS } from '@/lib/georgian-forum-personas';
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

        const seed = { titleKa: topic.titleKa, summaryKa: topic.summaryKa };

        // SWARM: the challenged persona + up to 2 others (its rivals/allies, else random)
        // all reply to the reader — a pile-on instead of a lone answer.
        const challenged = parent.personaId;
        const cp = getForumPersona(challenged);
        const related = [...new Set([...(cp?.rivals || []), ...(cp?.allies || [])])]
            .filter((pid) => pid !== challenged && getForumPersona(pid))
            .sort(() => Math.random() - 0.5);
        const others = related.slice(0, 2);
        if (others.length < 2) {
            const pool = FORUM_PERSONAS.filter((p) => p.id !== challenged && !others.includes(p.id)).sort(() => Math.random() - 0.5);
            for (const p of pool) {
                if (others.length >= 2) break;
                others.push(p.id);
            }
        }
        const responders = [challenged, ...others];

        const replies = await Promise.all(responders.map((pid) => personaReplyToUser(pid, seed, content)));
        const okCount = replies.filter(Boolean).length;
        if (okCount === 0) return apiError(ERROR_CODES.FORUM_GENERATE_FAILED, 'No reply generated', 502);
        recordAiUse(ip);

        const userPost = await ForumPost.create({
            topicId: id, personaId: 'reader', author: { name }, content,
            parentId, isUser: true, userName: name,
        });
        for (let i = 0; i < responders.length; i++) {
            const r = replies[i];
            if (!r) continue;
            await ForumPost.create({
                topicId: id, personaId: responders[i], author: { name: r.name }, content: r.reply,
                parentId: userPost._id, isUser: false,
            });
        }
        await ForumTopic.updateOne({ _id: id }, { $inc: { postCount: 1 + okCount, hotScore: 1 + okCount } });
        revalidatePath(`/forum/${topic.slug}`);

        return apiSuccess({ ok: true, replies: okCount }, 'replied');
    } catch (error) {
        console.error('[API] forum comment error:', error);
        return apiError(ERROR_CODES.FORUM_GENERATE_FAILED, 'Failed to comment', 500);
    }
}

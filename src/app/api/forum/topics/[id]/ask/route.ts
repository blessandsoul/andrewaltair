export const dynamic = 'force-dynamic';

import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from '@/lib/db';
import ForumTopic from '@/models/ForumTopic';
import ForumPost from '@/models/ForumPost';
import { askPersona } from '@/lib/georgian-forum-generator';
import { getClientIp, checkAiRateLimit, recordAiUse, rateLimitMessageKa } from '@/lib/forum-ratelimit';

/**
 * POST /api/forum/topics/[id]/ask  {personaId, question, mode?, name?}
 * A reader asks a persona; stores the question (user post) + the persona's answer.
 * Public but rate-limited (AI). Returns {ok}. The page re-fetches to show the thread.
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
        const personaId = String(body?.personaId || '');
        const question = String(body?.question || '').trim();
        const mode = body?.mode === 'absurd' ? 'absurd' : 'serious';
        const name = (String(body?.name || '').trim().slice(0, 40)) || 'მკითხველი';
        if (!personaId) return apiError(ERROR_CODES.VALIDATION_FAILED, 'personaId required', 400);
        if (question.length < 3 || question.length > 200) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'question must be 3..200 chars', 400);
        }

        await dbConnect();
        const topic = await ForumTopic.findById(id)
            .select('slug titleKa summaryKa')
            .lean<{ slug: string; titleKa: string; summaryKa: string } | null>();
        if (!topic) return apiError(ERROR_CODES.FORUM_NOT_FOUND, 'Topic not found', 404);

        const res = await askPersona(personaId, { titleKa: topic.titleKa, summaryKa: topic.summaryKa }, question, mode);
        if (!res) return apiError(ERROR_CODES.FORUM_GENERATE_FAILED, 'No answer generated', 502);
        recordAiUse(ip);

        const q = await ForumPost.create({
            topicId: id, personaId: 'reader', author: { name }, content: question,
            parentId: null, isUser: true, userName: name,
        });
        await ForumPost.create({
            topicId: id, personaId, author: { name: res.name }, content: res.answer,
            parentId: q._id, isUser: false,
        });
        await ForumTopic.updateOne({ _id: id }, { $inc: { postCount: 2, hotScore: 2 } });
        revalidatePath(`/forum/${topic.slug}`);

        return apiSuccess({ ok: true }, 'answered');
    } catch (error) {
        console.error('[API] forum ask error:', error);
        return apiError(ERROR_CODES.FORUM_GENERATE_FAILED, 'Failed to ask', 500);
    }
}

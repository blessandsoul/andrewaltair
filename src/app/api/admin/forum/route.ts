export const dynamic = 'force-dynamic';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import { ForumService } from '@/services/forum.service';

/** GET /api/admin/forum?status=all|queued|published — list topics for the admin table. */
export async function GET(request: Request) {
    if (!verifyAdmin(request)) return unauthorizedResponse('Admin access required');
    try {
        const { searchParams } = new URL(request.url);
        const status = (searchParams.get('status') as 'queued' | 'published' | 'all') || 'all';
        const data = await ForumService.getAllTopics({ status, limit: 100 });
        return apiSuccess(data, 'Forum topics fetched');
    } catch (error) {
        console.error('[API] GET /api/admin/forum error:', error);
        return apiError(ERROR_CODES.FORUM_FETCH_FAILED, 'Failed to fetch forum topics', 500);
    }
}

/** POST /api/admin/forum {sourceUrl} — scrape + queue a new topic (opinions generated later). */
export async function POST(request: Request) {
    if (!verifyAdmin(request)) return unauthorizedResponse('Admin access required');
    try {
        const body = await request.json().catch(() => ({}));
        const text = String(body?.text || '').trim();
        const sourceUrl = String(body?.sourceUrl || '').trim();
        const imageUrl = String(body?.imageUrl || '').trim();
        const tone = body?.tone === 'fun' ? 'fun' : 'serious';
        if (text.length < 10) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'ტექსტი სავალდებულოა (მინ. 10 სიმბოლო)', 400);
        }
        const topic = await ForumService.createTopic({ text, sourceUrl, imageUrl, tone });
        return apiSuccess(topic, 'Forum topic queued', 201);
    } catch (error) {
        console.error('[API] POST /api/admin/forum error:', error);
        return apiError(ERROR_CODES.FORUM_CREATE_FAILED, 'Failed to create forum topic', 500);
    }
}

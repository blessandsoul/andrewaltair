export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';

import dbConnect from '@/lib/db';
import ForumTopic from '@/models/ForumTopic';
import { generateAndSaveForumTopic } from '@/lib/georgian-forum-generator';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

/**
 * Daily Forum run. Designed to be called by an external scheduler (Coolify / cron):
 *   POST /api/cron/forum-daily   Header: Authorization: Bearer {CRON_SECRET}
 *
 * Picks the OLDEST queued topic, generates all 20 persona opinions + debate replies,
 * and publishes it. No queued topic → no-op. Re-running is safe (generator is idempotent).
 */
const CRON_SECRET = process.env.CRON_SECRET || 'your-cron-secret-key';

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        const providedToken = authHeader?.replace('Bearer ', '');
        if (providedToken !== CRON_SECRET) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Unauthorized: invalid cron secret', 401);
        }

        await dbConnect();
        const topic = await ForumTopic.findOne({ status: 'queued' })
            .sort({ createdAt: 1 })
            .select('_id slug')
            .lean<{ _id: unknown; slug: string } | null>();

        if (!topic) {
            return apiSuccess({ generated: false, reason: 'no_queued_topics' }, 'Nothing queued');
        }

        const result = await generateAndSaveForumTopic(String(topic._id));
        return apiSuccess(
            { generated: result.ok, slug: topic.slug, result },
            'Forum daily run complete',
        );
    } catch (error) {
        console.error('Forum daily cron error:', error);
        return apiError(ERROR_CODES.FORUM_CRON_FAILED, 'Forum daily run failed', 500);
    }
}

export async function GET() {
    return apiSuccess(
        {
            status: 'ok',
            endpoint: 'Forum Daily Cron',
            description: 'POST with Authorization header to generate the oldest queued topic',
            required_header: 'Authorization: Bearer {CRON_SECRET}',
        },
        'Forum cron health check',
    );
}

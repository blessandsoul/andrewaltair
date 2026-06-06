export const dynamic = 'force-dynamic';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { getUserFromRequest } from '@/lib/server-auth';
import dbConnect from '@/lib/db';
import ForumSubscription from '@/models/ForumSubscription';

/** GET /api/forum/subscribe?scope=&personaId= → {following, auth} */
export async function GET(request: Request) {
    const user = await getUserFromRequest(request);
    if (!user) return apiSuccess({ following: false, auth: false }, 'not authed');

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') === 'persona' ? 'persona' : 'forum';
    const personaId = scope === 'persona' ? searchParams.get('personaId') || null : null;
    if (scope === 'persona' && !personaId) {
        return apiError(ERROR_CODES.VALIDATION_FAILED, 'personaId required', 400);
    }

    await dbConnect();
    const existing = await ForumSubscription.findOne({ userId: user._id, scope, personaId });
    return apiSuccess({ following: !!existing, auth: true }, 'status');
}

/** POST /api/forum/subscribe {scope, personaId?} → toggles, returns {following} (auth required) */
export async function POST(request: Request) {
    const user = await getUserFromRequest(request);
    if (!user) return apiError(ERROR_CODES.AUTH_REQUIRED, 'ავტორიზაცია საჭიროა', 401);

    const body = await request.json().catch(() => ({}));
    const scope = body?.scope === 'persona' ? 'persona' : 'forum';
    const personaId = scope === 'persona' ? String(body?.personaId || '') || null : null;
    if (scope === 'persona' && !personaId) {
        return apiError(ERROR_CODES.VALIDATION_FAILED, 'personaId required', 400);
    }

    await dbConnect();
    const filter = { userId: user._id, scope, personaId };
    const existing = await ForumSubscription.findOne(filter);
    if (existing) {
        await existing.deleteOne();
        return apiSuccess({ following: false }, 'unsubscribed');
    }
    await ForumSubscription.create(filter);
    return apiSuccess({ following: true }, 'subscribed');
}

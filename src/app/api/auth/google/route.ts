export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

import { googleConfigured, buildAuthUrl, redirectUriFrom } from '@/lib/google-oauth';

/** GET /api/auth/google — start the Google OAuth flow (sets state cookie, redirects to Google). */
export async function GET(request: NextRequest) {
    if (!googleConfigured()) {
        return NextResponse.redirect(new URL('/login?error=google_unconfigured', request.url));
    }

    const origin = new URL(request.url).origin;
    const redirectUri = redirectUriFrom(origin);
    const state = crypto.randomBytes(16).toString('hex');

    const res = NextResponse.redirect(buildAuthUrl(state, redirectUri));
    res.cookies.set('g_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // returns on Google's top-level redirect back
        maxAge: 600,
        path: '/',
    });
    return res;
}

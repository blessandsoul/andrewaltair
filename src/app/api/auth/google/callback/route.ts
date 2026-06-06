export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import { AuthService } from '@/services/auth.service';
import { setAuthCookie } from '@/lib/auth-cookie';
import { exchangeCode, fetchUserInfo, redirectUriFrom } from '@/lib/google-oauth';

/**
 * GET /api/auth/google/callback — verify state, exchange code, find-or-create the user,
 * link googleId, issue a session, set the auth cookie, redirect home.
 */
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const cookieState = request.cookies.get('g_state')?.value;

    const fail = (reason: string) => NextResponse.redirect(new URL(`/login?error=${reason}`, request.url));

    // CSRF: returned state must match the cookie we set.
    if (!code || !state || !cookieState || state !== cookieState) return fail('google_state');

    try {
        const redirectUri = redirectUriFrom(url.origin);
        const accessToken = await exchangeCode(code, redirectUri);
        if (!accessToken) return fail('google_token');

        const profile = await fetchUserInfo(accessToken);
        if (!profile) return fail('google_profile');

        await dbConnect();
        const email = profile.email.toLowerCase().trim();
        let user = await User.findOne({ $or: [{ googleId: profile.sub }, { email }] });

        if (!user) {
            // Create a fresh Google account with a unique username derived from the email.
            const base = (email.split('@')[0] || 'user').toLowerCase().replace(/[^a-z0-9_]/g, '') || 'user';
            let username = base;
            let n = 1;
            while (await User.findOne({ username }).select('_id').lean()) {
                username = `${base}${n++}`;
                if (n > 100) { username = `${base}${Date.now()}`; break; }
            }
            user = await User.create({
                username,
                email,
                googleId: profile.sub,
                fullName: profile.name || email.split('@')[0],
                avatar: profile.picture,
                role: 'viewer',
                isEmailVerified: true,
            });
        } else if (!user.googleId) {
            // Existing password account with same email → link Google.
            user.googleId = profile.sub;
            if (!user.avatar && profile.picture) user.avatar = profile.picture;
            await user.save();
        }

        if (user.isBlocked) return fail('blocked');

        const userAgent = request.headers.get('user-agent') || '';
        const { token } = await AuthService.issueSession(user, userAgent);

        const res = NextResponse.redirect(new URL('/', request.url));
        setAuthCookie(res, token);
        res.cookies.delete('g_state');
        return res;
    } catch (error) {
        console.error('Google callback error:', error);
        return fail('google');
    }
}

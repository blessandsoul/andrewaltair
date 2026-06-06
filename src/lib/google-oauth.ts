/**
 * Minimal hand-rolled Google OAuth 2.0 helpers (no NextAuth — fits the project's
 * custom JWT/Session auth). Used by /api/auth/google[+/callback].
 *
 * Env: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET. Authorized redirect URI must be
 * `${NEXT_PUBLIC_APP_URL or origin}/api/auth/google/callback`.
 */

const GOOGLE_AUTH = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO = 'https://www.googleapis.com/oauth2/v3/userinfo';

export function googleConfigured(): boolean {
    return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

/** Redirect URI for the OAuth callback (env app-url preferred, else request origin). */
export function redirectUriFrom(origin: string): string {
    const base = process.env.NEXT_PUBLIC_APP_URL || origin;
    return `${base.replace(/\/$/, '')}/api/auth/google/callback`;
}

export function buildAuthUrl(state: string, redirectUri: string): string {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        state,
        access_type: 'online',
        prompt: 'select_account',
    });
    return `${GOOGLE_AUTH}?${params.toString()}`;
}

/** Exchange an authorization code for an access token (or null on failure). */
export async function exchangeCode(code: string, redirectUri: string): Promise<string | null> {
    try {
        const res = await fetch(GOOGLE_TOKEN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID || '',
                client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json?.access_token ?? null;
    } catch {
        return null;
    }
}

export interface GoogleProfile {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
    email_verified?: boolean;
}

/** Fetch the Google userinfo for an access token (or null on failure). */
export async function fetchUserInfo(accessToken: string): Promise<GoogleProfile | null> {
    try {
        const res = await fetch(GOOGLE_USERINFO, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) return null;
        const json = await res.json();
        if (!json?.sub || !json?.email) return null;
        return {
            sub: json.sub,
            email: json.email,
            name: json.name,
            picture: json.picture,
            email_verified: json.email_verified,
        };
    } catch {
        return null;
    }
}

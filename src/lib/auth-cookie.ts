import { NextResponse } from 'next/server';

const SEVEN_DAYS = 7 * 24 * 60 * 60;

/**
 * Set the `auth_token` session cookie consistently across register / login / Google OAuth.
 * Unifies the previously-divergent flags (register used sameSite:'strict', login used 'lax').
 */
export function setAuthCookie(response: NextResponse, token: string): void {
    response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SEVEN_DAYS,
        path: '/',
    });
}

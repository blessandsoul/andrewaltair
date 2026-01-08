/**
 * CSRF Protection Utilities
 * Implements double-submit cookie pattern for admin routes
 */

import { NextRequest, NextResponse } from 'next/server';

const CSRF_TOKEN_LENGTH = 32;
const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Generate a random CSRF token
 */
export function generateCSRFToken(): string {
    const array = new Uint8Array(CSRF_TOKEN_LENGTH);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify CSRF token from request
 * Implements double-submit cookie pattern
 */
export function verifyCSRFToken(request: NextRequest): boolean {
    // Get token from header
    const headerToken = request.headers.get(CSRF_HEADER_NAME);
    
    // Get token from cookie
    const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
    
    // Both must exist and match
    if (!headerToken || !cookieToken) {
        return false;
    }
    
    return headerToken === cookieToken;
}

/**
 * Set CSRF token in response cookie
 */
export function setCSRFCookie(response: NextResponse, token: string): void {
    response.cookies.set(CSRF_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
    });
}

/**
 * Middleware helper to check CSRF for state-changing operations
 */
export function requireCSRF(request: NextRequest): NextResponse | null {
    const method = request.method;
    
    // Only check CSRF for state-changing methods
    if (method === 'POST' || method === 'PUT' || method === 'DELETE' || method === 'PATCH') {
        if (!verifyCSRFToken(request)) {
            return NextResponse.json(
                { error: 'Invalid CSRF token' },
                { status: 403 }
            );
        }
    }
    
    return null;
}

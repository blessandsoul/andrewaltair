/**
 * Server-side Admin Authentication Utilities
 * Used to protect API routes from unauthorized access
 */

import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

// Admin password from environment (NO HARDCODING!)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'fallback-dev-secret-change-me';

// Rate limiting map for brute-force protection
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Verify admin session token from request
 * Use this at the TOP of every admin API route
 */
export function verifyAdmin(request: Request): boolean {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return false;
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, SESSION_SECRET) as { role: string };

        return decoded.role === 'admin' || decoded.role === 'god';
    } catch {
        return false;
    }
}

/**
 * Verify admin session from cookies (for server components)
 */
export async function verifyAdminSession(): Promise<boolean> {
    try {
        const headersList = await headers();
        const cookie = headersList.get('cookie') || '';
        const match = cookie.match(/admin_session=([^;]+)/);

        if (!match) return false;

        const decoded = jwt.verify(match[1], SESSION_SECRET) as { role: string };
        return decoded.role === 'admin' || decoded.role === 'god';
    } catch {
        return false;
    }
}

/**
 * Validate admin password with brute-force protection
 */
export function validateAdminPassword(password: string, ip: string): {
    valid: boolean;
    locked: boolean;
    remainingAttempts: number;
    lockoutRemaining?: number;
} {
    // Check if IP is locked out
    const attempts = loginAttempts.get(ip);
    const now = Date.now();

    if (attempts) {
        if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
            const timeSinceLast = now - attempts.lastAttempt;
            if (timeSinceLast < LOCKOUT_DURATION) {
                return {
                    valid: false,
                    locked: true,
                    remainingAttempts: 0,
                    lockoutRemaining: Math.ceil((LOCKOUT_DURATION - timeSinceLast) / 1000)
                };
            }
            // Lockout expired, reset
            loginAttempts.delete(ip);
        }
    }

    // Check password
    if (!ADMIN_PASSWORD) {
        console.error('⚠️ ADMIN_PASSWORD not set in environment!');
        return { valid: false, locked: false, remainingAttempts: 0 };
    }

    if (password === ADMIN_PASSWORD) {
        // Success - clear attempts
        loginAttempts.delete(ip);
        return { valid: true, locked: false, remainingAttempts: MAX_LOGIN_ATTEMPTS };
    }

    // Failed attempt - increment counter
    const currentAttempts = loginAttempts.get(ip) || { count: 0, lastAttempt: now };
    currentAttempts.count++;
    currentAttempts.lastAttempt = now;
    loginAttempts.set(ip, currentAttempts);

    return {
        valid: false,
        locked: false,
        remainingAttempts: MAX_LOGIN_ATTEMPTS - currentAttempts.count
    };
}

/**
 * Generate admin session token
 */
export function generateAdminToken(): string {
    return jwt.sign(
        { role: 'admin', iat: Date.now() },
        SESSION_SECRET,
        { expiresIn: '24h' }
    );
}

/**
 * Helper to return unauthorized response
 */
export function unauthorizedResponse(message = 'Unauthorized'): Response {
    return new Response(JSON.stringify({ error: message }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
    });
}

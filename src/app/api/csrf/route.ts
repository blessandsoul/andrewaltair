import { NextRequest, NextResponse } from 'next/server';
import { generateCSRFToken, setCSRFCookie } from '@/lib/csrf';

export const dynamic = 'force-dynamic';

/**
 * GET /api/csrf
 * Generate and return CSRF token for all users
 */
export async function GET(request: NextRequest) {
    try {
        // Generate new CSRF token
        const csrfToken = generateCSRFToken();

        // Create response with token
        const response = NextResponse.json({
            success: true,
            csrfToken
        });

        // Set token in httpOnly cookie
        setCSRFCookie(response, csrfToken);

        return response;
    } catch (error) {
        console.error('CSRF token generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate CSRF token' },
            { status: 500 }
        );
    }
}

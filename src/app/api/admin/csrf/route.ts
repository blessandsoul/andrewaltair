import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import { generateCSRFToken, setCSRFCookie } from '@/lib/csrf';

/**
 * GET /api/admin/csrf
 * Generate and return CSRF token for admin operations
 */
export async function GET(request: NextRequest) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

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

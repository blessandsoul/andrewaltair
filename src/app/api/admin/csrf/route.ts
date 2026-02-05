export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { generateCSRFToken, setCSRFCookie } from '@/lib/csrf';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

/**
 * GET /api/admin/csrf
 * Generate and return CSRF token for admin operations
 */
export async function GET(request: NextRequest) {
    if (!verifyAdmin(request)) {
        return apiError(ERROR_CODES.ADMIN_UNAUTHORIZED, 'Admin access required', 401);
    }

    try {
        // Generate new CSRF token
        const csrfToken = generateCSRFToken();

        // Create response with token
        const response = apiSuccess({ csrfToken }, 'CSRF token generated');

        // Set token in httpOnly cookie
        setCSRFCookie(response, csrfToken);

        return response;
    } catch (error) {
        console.error('CSRF token generation error:', error);
        return apiError(ERROR_CODES.ADMIN_CSRF_FAILED, 'Failed to generate CSRF token', 500);
    }
}

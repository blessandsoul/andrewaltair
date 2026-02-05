import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
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
        const response = apiSuccess({ csrfToken }, 'CSRF token generated');

        // Set token in httpOnly cookie
        setCSRFCookie(response, csrfToken);

        return response;
    } catch (error) {
        console.error('CSRF token generation error:', error);
        return apiError(ERROR_CODES.CSRF_GENERATION_FAILED, 'Failed to generate CSRF token', 500);
    }
}

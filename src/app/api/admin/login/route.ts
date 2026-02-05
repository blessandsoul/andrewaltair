import { NextRequest } from 'next/server';
import { validateAdminPassword, generateAdminToken } from '@/lib/admin-auth';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        if (!password) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'პაროლი აუცილებელია', 400);
        }

        // Get IP for rate limiting
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            'unknown';

        // Validate password with brute-force protection
        const result = validateAdminPassword(password, ip);

        if (result.locked) {
            return apiError(
                ERROR_CODES.ADMIN_LOCKED,
                `ძალიან ბევრი მცდელობა. სცადეთ ${Math.ceil((result.lockoutRemaining || 0) / 60)} წუთში.`,
                429
            );
        }

        if (!result.valid) {
            return apiError(ERROR_CODES.AUTH_INVALID_CREDENTIALS, 'არასწორი პაროლი', 401);
        }

        // Generate JWT token
        const token = generateAdminToken();

        // Create response WITHOUT token in body (only in httpOnly cookie)
        const response = apiSuccess(null, 'წარმატებით შეხვედით');

        // Set httpOnly cookie for security
        response.cookies.set('admin_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return response;
    } catch (error) {
        console.error('Admin login error:', error);
        return apiError(ERROR_CODES.ADMIN_LOGIN_FAILED, 'შესვლა ვერ მოხერხდა', 500);
    }
}

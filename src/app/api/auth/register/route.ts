export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const userAgent = request.headers.get('user-agent') || '';

        // Registration logic
        const result = await AuthService.register(data, userAgent);

        const response = apiSuccess(
            { user: result.user, requiresVerification: false },
            'რეგისტრაცია წარმატებულია!',
            201
        );

        // ✅ Set httpOnly cookie
        response.cookies.set('auth_token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/'
        });

        return response;

    } catch (error: any) {
        console.error('Registration error:', error);
        const msg = error.message || 'სერვერის შეცდომა';
        const isDuplicate = msg.includes('უკვე არსებობს') || msg.includes('duplicate');
        if (isDuplicate) {
            return apiError(ERROR_CODES.AUTH_DUPLICATE_EMAIL, msg, 400);
        }
        return apiError(
            msg === 'სერვერის შეცდომა' ? ERROR_CODES.INTERNAL_ERROR : ERROR_CODES.AUTH_REGISTRATION_FAILED,
            msg,
            msg === 'სერვერის შეცდომა' ? 500 : 400
        );
    }
}

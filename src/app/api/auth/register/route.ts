export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { setAuthCookie } from '@/lib/auth-cookie';

export async function POST(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') || 'unknown';

    try {
        const data = await request.json();
        const userAgent = request.headers.get('user-agent') || '';

        const result = await AuthService.register(data, userAgent, ip);

        const response = apiSuccess(
            { user: result.user, requiresVerification: false },
            'რეგისტრაცია წარმატებულია!',
            201
        );
        setAuthCookie(response, result.token);
        return response;

    } catch (error: unknown) {
        console.error('Registration error:', error);
        const msg = error instanceof Error ? error.message : 'სერვერის შეცდომა';

        if (msg.startsWith('RateLimit:locked:')) {
            const remaining = parseInt(msg.split(':')[2]);
            return apiError(ERROR_CODES.RATE_LIMITED, `ძალიან ბევრი მცდელობა. სცადეთ მოგვიანებით. (${remaining}წმ)`, 429);
        }

        // Duplicate: app-thrown Georgian messages OR a Mongo E11000 unique-key error.
        const code = (error as { code?: number })?.code;
        if (msg.includes('მომხმარებლის სახელი უკვე')) {
            return apiError(ERROR_CODES.AUTH_DUPLICATE_USERNAME, msg, 400);
        }
        if (msg.includes('ეს ელფოსტა უკვე')) {
            return apiError(ERROR_CODES.AUTH_DUPLICATE_EMAIL, msg, 400);
        }
        if (code === 11000) {
            return apiError(ERROR_CODES.AUTH_DUPLICATE_EMAIL, 'ეს ელფოსტა ან მომხმარებლის სახელი უკვე დაკავებულია', 400);
        }

        return apiError(
            msg === 'სერვერის შეცდომა' ? ERROR_CODES.INTERNAL_ERROR : ERROR_CODES.AUTH_REGISTRATION_FAILED,
            msg,
            msg === 'სერვერის შეცდომა' ? 500 : 400
        );
    }
}

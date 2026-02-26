export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// 🛡️ SECURITY: Require JWT_SECRET - no fallback allowed
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

export async function POST(request: NextRequest) {
    // 🛡️ Rate limit check
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') || 'unknown';

    try {
        const body = await request.json();
        const { email, password, username, twoFactorCode } = body;

        // Log non-sensitive inputs
        const loginField = email || username;

        const userAgent = request.headers.get('user-agent') || '';

        const result = await AuthService.login(loginField, password, ip, userAgent, twoFactorCode);

        const response = apiSuccess({ user: result.user }, 'წარმატებით შეხვედით სისტემაში');

        // ✅ Set httpOnly cookie with robust settings
        // Determine secure flag based on environment and protocol
        const isProduction = process.env.NODE_ENV === 'production';
        // Check X-Forwarded-Proto header for headers behind proxy
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const isSecure = isProduction && protocol === 'https';


        response.cookies.set('auth_token', result.token, {
            httpOnly: true,
            secure: isSecure,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            path: '/'
        });


        return response;

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'სერვერის შეცდომა';

        if (msg.startsWith('RateLimit:locked:')) {
            const remaining = parseInt(msg.split(':')[2]);
            return apiError(ERROR_CODES.RATE_LIMITED, `ძალიან ბევრი მცდელობა. გთხოვთ სცადოთ მოგვიანებით. (${remaining}წმ)`, 429);
        }

        if (msg === 'ელფოსტა და პაროლი სავალდებულოა') {
            return apiError(ERROR_CODES.VALIDATION_FAILED, msg, 400);
        }

        if (msg === 'მომხმარებელი ვერ მოიძებნა' || msg === 'არასწორი პაროლი' || msg === 'არასწორი 2FA კოდი') {
            return apiError(ERROR_CODES.AUTH_INVALID_CREDENTIALS, msg, 401);
        }

        if (msg === 'თქვენი ანგარიში დაბლოკილია') {
            return apiError(ERROR_CODES.AUTH_ACCOUNT_BLOCKED, msg, 403);
        }

        // Handle 2FA Requirement
        if (msg.startsWith('2FA_REQUIRED:')) {
            const userId = msg.split(':')[1];
            return apiSuccess({ requires2FA: true, userId }, 'გთხოვთ შეიყვანოთ 2FA კოდი');
        }

        return apiError(ERROR_CODES.INTERNAL_ERROR, msg, 500);
    }
}

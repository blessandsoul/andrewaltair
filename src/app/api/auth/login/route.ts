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

    console.log(`[Login Attempt] IP: ${ip}`);

    try {
        const body = await request.json();
        const { email, password, username, twoFactorCode } = body;

        // Log non-sensitive inputs
        const loginField = email || username;
        console.log(`[Login Attempt] User: ${loginField}, HasPassword: ${!!password}, Has2FA: ${!!twoFactorCode}`);

        const userAgent = request.headers.get('user-agent') || '';

        const result = await AuthService.login(loginField, password, ip, userAgent, twoFactorCode);

        console.log(`[Login Success] User: ${result.user.username} (${result.user.id})`);

        const response = apiSuccess({ user: result.user }, 'წარმატებით შეხვედით სისტემაში');

        // ✅ Set httpOnly cookie
        // DEBUG: Force secure false to test if it's an SSL issue
        response.cookies.set('auth_token', result.token, {
            httpOnly: true,
            secure: false, // WAS: process.env.NODE_ENV === 'production'
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            path: '/'
        });

        console.log(`[Login Cookie Set] Token length: ${result.token.length}`);

        return response;

    } catch (error: any) {
        console.error('[Login Failed] Error:', error);
        console.error('[Login Failed] Stack:', error.stack);

        const msg = error.message || 'სერვერის შეცდომა';

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

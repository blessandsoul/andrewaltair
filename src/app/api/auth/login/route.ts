export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';

// 🛡️ SECURITY: Require JWT_SECRET - no fallback allowed
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

export async function POST(request: NextRequest) {
    // 🛡️ Rate limit check
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') || 'unknown';

    try {
        const { email, password, username, twoFactorCode } = await request.json();
        const userAgent = request.headers.get('user-agent') || '';
        const loginField = email || username;

        const result = await AuthService.login(loginField, password, ip, userAgent, twoFactorCode);

        const response = NextResponse.json({
            success: true,
            user: result.user
        });

        // ✅ Set httpOnly cookie
        response.cookies.set('auth_token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            path: '/'
        });

        return response;

    } catch (error: any) {
        console.error('Login error:', error);
        const msg = error.message || 'სერვერის შეცდომა';
        let status = 500;

        if (msg.startsWith('RateLimit:locked:')) {
            const remaining = parseInt(msg.split(':')[2]);
            return NextResponse.json({
                error: 'ძალიან ბევრი მცდელობა. გთხოვთ სცადოთ მოგვიანებით.',
                locked: true,
                lockoutRemaining: remaining
            }, { status: 429 });
        }

        if (msg === 'ელფოსტა და პაროლი სავალდებულოა') status = 400;
        if (msg === 'მომხმარებელი ვერ მოიძებნა' || msg === 'არასწორი პაროლი' || msg === 'არასწორი 2FA კოდი') status = 401;
        if (msg === 'თქვენი ანგარიში დაბლოკილია') status = 403;

        // Handle 2FA Requirement
        if (msg.startsWith('2FA_REQUIRED:')) {
            const userId = msg.split(':')[1];
            return NextResponse.json({
                requires2FA: true,
                message: 'გთხოვთ შეიყვანოთ 2FA კოდი',
                userId: userId
            }, { status: 403 });
        }

        return NextResponse.json(
            { error: msg, details: error instanceof Error ? error.message : undefined },
            { status }
        );
    }
}

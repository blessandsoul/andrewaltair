import { NextRequest, NextResponse } from 'next/server';
import { validateAdminPassword, generateAdminToken } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json(
                { error: 'პაროლი აუცილებელია', success: false },
                { status: 400 }
            );
        }

        // Get IP for rate limiting
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            'unknown';

        // Validate password with brute-force protection
        const result = validateAdminPassword(password, ip);

        if (result.locked) {
            return NextResponse.json({
                error: `ძალიან ბევრი მცდელობა. სცადეთ ${Math.ceil((result.lockoutRemaining || 0) / 60)} წუთში.`,
                locked: true,
                lockoutRemaining: result.lockoutRemaining,
                success: false
            }, { status: 429 });
        }

        if (!result.valid) {
            return NextResponse.json({
                error: 'არასწორი პაროლი',
                remainingAttempts: result.remainingAttempts,
                success: false
            }, { status: 401 });
        }

        // Generate JWT token
        const token = generateAdminToken();

        // Create response with httpOnly cookie
        const response = NextResponse.json({
            success: true,
            token,
            message: 'წარმატებით შეხვედით'
        });

        // Set httpOnly cookie for extra security
        response.cookies.set('admin_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return response;
    } catch (error) {
        console.error('Admin login error:', error);
        return NextResponse.json(
            { error: 'შესვლა ვერ მოხერხდა', success: false },
            { status: 500 }
        );
    }
}

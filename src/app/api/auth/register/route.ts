export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const userAgent = request.headers.get('user-agent') || '';

        // Registration logic
        const result = await AuthService.register(data, userAgent);

        const response = NextResponse.json({
            success: true,
            message: 'რეგისტრაცია წარმატებულია!',
            user: result.user,
            requiresVerification: false,
        });

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
        return NextResponse.json(
            { error: error.message || 'სერვერის შეცდომა' },
            { status: error.message === 'სერვერის შეცდომა' ? 500 : 400 }
        );
    }
}

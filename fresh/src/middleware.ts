import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for route protection
 * Protects /admin routes by checking for admin_session cookie
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip login page itself
    if (pathname === '/admin/login') {
        return NextResponse.next();
    }

    // Check for admin session cookie
    const adminSession = request.cookies.get('admin_session');

    // If no session and trying to access admin routes, redirect to login
    if (!adminSession?.value) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// Configure which routes to protect
export const config = {
    matcher: ['/admin/:path*'],
};

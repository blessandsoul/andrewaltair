import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { INSIGHT_SLUG_REDIRECTS } from '@/data/insightSlugRedirects';

/**
 * Edge middleware.
 *
 * Responsibilities:
 *   1. Admin route protection (admin_session cookie).
 *   2. 301 legacy /insights/* slugs that contained HTML-entity garbage
 *      (`-039-` / `-quot-`) to their clean equivalents.
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. /insights/<oldSlug> → 301 → /insights/<newSlug>
    if (pathname.startsWith('/insights/')) {
        const slug = pathname.slice('/insights/'.length);
        const replacement = INSIGHT_SLUG_REDIRECTS[slug];
        if (replacement && replacement !== slug) {
            const url = request.nextUrl.clone();
            url.pathname = `/insights/${replacement}`;
            return NextResponse.redirect(url, 301);
        }
        return NextResponse.next();
    }

    // 2. /admin/* route protection
    if (pathname === '/admin/login') {
        return NextResponse.next();
    }

    const adminSession = request.cookies.get('admin_session');
    if (!adminSession?.value) {
        if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/insights/:slug*'],
};

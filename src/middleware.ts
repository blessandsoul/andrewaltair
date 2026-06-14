import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { INSIGHT_SLUG_REDIRECTS } from '@/data/insightSlugRedirects';
import { BLOG_SLUG_REDIRECTS } from '@/data/blogSlugRedirects';

/**
 * Edge middleware.
 *
 * Responsibilities:
 *   1. Admin route protection (admin_session cookie).
 *   2. 301 legacy /insights/* slugs that contained HTML-entity garbage
 *      (`-039-` / `-quot-`) to their clean equivalents.
 *   3. 301 duplicate/dead /blog/* and /insights/* slugs to their canonical
 *      (SEO audit 2026-06-12 — see src/data/*SlugRedirects.ts).
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

    // 1b. /blog/<oldSlug> → 301 → /blog/<newSlug>
    if (pathname.startsWith('/blog/')) {
        const slug = pathname.slice('/blog/'.length);
        const replacement = BLOG_SLUG_REDIRECTS[slug];
        if (replacement && replacement !== slug) {
            const url = request.nextUrl.clone();
            url.pathname = `/blog/${replacement}`;
            return NextResponse.redirect(url, 301);
        }
        return NextResponse.next();
    }

    // 2. /admin/* route protection
    if (pathname === '/admin/login') {
        return NextResponse.next();
    }

    // LOCAL-DEV ONLY bypass — inert in production by two independent locks:
    //   (a) NODE_ENV must be 'development' (Coolify prod build sets 'production'),
    //   (b) ADMIN_DEV_BYPASS must be '1' (lives only in gitignored .env.local,
    //       never present in the prod env). Either lock alone blocks prod.
    if (
        process.env.NODE_ENV === 'development' &&
        process.env.ADMIN_DEV_BYPASS === '1' &&
        pathname.startsWith('/admin')
    ) {
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
    matcher: ['/admin/:path*', '/insights/:slug*', '/blog/:slug*'],
};

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { generateUniqueId } from '@/lib/id-system';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';

/**
 * GET /api/posts/generate-code
 * Generates a unique 6-digit numericId for a new post.
 * Protected - Admin only.
 */
export async function GET(request: Request) {
    // 🛡️ SECURITY: Verify admin authentication
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('ადმინისტრატორის წვდომა საჭიროა');
    }

    try {
        const code = await generateUniqueId();

        return NextResponse.json({
            success: true,
            code: code
        });
    } catch (error) {
        console.error('Generate code error:', error);
        return NextResponse.json(
            { error: 'კოდის გენერაცია ვერ მოხერხდა' },
            { status: 500 }
        );
    }
}

export const dynamic = 'force-dynamic';
import { generateUniqueId } from '@/lib/id-system';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

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

        return apiSuccess({ code }, 'Code generated successfully');
    } catch (error) {
        console.error('Generate code error:', error);
        return apiError(ERROR_CODES.POST_CREATE_FAILED, 'კოდის გენერაცია ვერ მოხერხდა', 500);
    }
}

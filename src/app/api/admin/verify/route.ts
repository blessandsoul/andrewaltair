export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

export async function GET(request: NextRequest) {
    try {
        const isValid = verifyAdmin(request);

        if (!isValid) {
            return apiError(ERROR_CODES.ADMIN_UNAUTHORIZED, 'Invalid or expired session', 401);
        }

        return apiSuccess({ valid: true }, 'Session is valid');
    } catch (error) {
        console.error('Admin verify error:', error);
        return apiError(ERROR_CODES.ADMIN_VERIFY_FAILED, 'Verification failed', 500);
    }
}

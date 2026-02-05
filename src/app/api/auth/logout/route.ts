export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import Session from '@/models/Session';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

export async function POST(request: NextRequest) {
    try {
        // 🛡️ CSRF PROTECTION
        const { requireCSRF } = await import('@/lib/csrf');
        const csrfError = requireCSRF(request);
        if (csrfError) return csrfError;

        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'არ ხართ ავტორიზებული', 401);
        }

        const token = authHeader.substring(7);

        try {
            const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string };

            await dbConnect();

            // 🛡️ Invalidate the session
            await Session.updateOne(
                { token, userId: decoded.userId },
                { isActive: false }
            );

            return apiSuccess(null, 'წარმატებით გახვედით სისტემიდან');
        } catch {
            return apiError(ERROR_CODES.AUTH_TOKEN_INVALID, 'არასწორი ტოკენი', 401);
        }
    } catch (error) {
        console.error('Logout error:', error);
        return apiError(ERROR_CODES.INTERNAL_ERROR, 'სერვერის შეცდომა', 500);
    }
}


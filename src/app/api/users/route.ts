export const dynamic = 'force-dynamic'
import { UserService } from '@/services/user.service';
import { verifyToken } from '@/lib/jwt-config';
import { verifyAdmin as verifyAdminSession } from '@/lib/admin-auth';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// Helper to verify admin role (User Token or Admin Cookie)
async function verifyAdminAuth(request: Request) {
    // 1. Check User Token
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
            const decoded = verifyToken(token) as { userId: string; role: string };
            if (['god', 'admin'].includes(decoded.role)) {
                return decoded;
            }
        } catch {
            // Invalid user token
        }
    }

    // 2. Check Admin Cookie (legacy / admin panel)
    if (verifyAdminSession(request)) {
        return { userId: 'admin-panel', role: 'admin' };
    }

    return null;
}

// GET - List all users (admin only)
export async function GET(request: Request) {
    try {
        const admin = await verifyAdminAuth(request);

        if (!admin) {
            return apiError(ERROR_CODES.ADMIN_UNAUTHORIZED, 'Access denied', 403);
        }

        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const result = await UserService.getAllUsers({ role, search, page, limit });

        return apiSuccess(result, 'Users fetched successfully');
    } catch (error) {
        console.error('Get users error:', error);
        return apiError(ERROR_CODES.USER_FETCH_FAILED, 'Failed to fetch users', 500);
    }
}

// POST - Create a new user (admin only)
export async function POST(request: Request) {
    try {
        const admin = await verifyAdminAuth(request);

        if (!admin) {
            return apiError(ERROR_CODES.ADMIN_UNAUTHORIZED, 'Access denied', 403);
        }

        const data = await request.json();

        const user = await UserService.createUser(data);

        return apiSuccess({ user }, 'User created successfully');
    } catch (error: unknown) {
        console.error('Create user error:', error);
        const message = error instanceof Error ? error.message : 'Failed to create user';
        const status = message === 'მომხმარებელი უკვე არსებობს' ? 400 : 500;
        const code = status === 400 ? ERROR_CODES.AUTH_DUPLICATE_EMAIL : ERROR_CODES.USER_FETCH_FAILED;
        return apiError(code, message, status);
    }
}

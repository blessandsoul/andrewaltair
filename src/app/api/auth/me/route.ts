export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Session from '@/models/Session';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

interface JwtPayload {
    userId: string;
    role: string;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        let token: string | undefined;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        } else {
            // Fallback to cookie
            token = request.cookies.get('auth_token')?.value;
        }

        if (!token) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'არ ხართ ავტორიზებული', 401);
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;

            await dbConnect();

            // Verify session exists and is active
            const session = await Session.findOne({
                token,
                userId: decoded.userId,
                isActive: true,
                expiresAt: { $gt: new Date() }
            });

            if (!session) {
                return apiError(ERROR_CODES.AUTH_TOKEN_EXPIRED, 'სესია ვადაგასულია ან არ არსებობს', 401);
            }

            // Update session activity
            await Session.findByIdAndUpdate(session._id, {
                lastActivity: new Date()
            });

            const user = await User.findById(decoded.userId);

            if (!user) {
                return apiError(ERROR_CODES.NOT_FOUND, 'მომხმარებელი ვერ მოიძებნა', 404);
            }

            if (user.isBlocked) {
                return apiError(ERROR_CODES.AUTH_ACCOUNT_BLOCKED, 'თქვენი ანგარიში დაბლოკილია', 403);
            }

            const userData = {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                avatar: user.avatar,
                coverImage: user.coverImage,
                coverOffsetY: user.coverOffsetY,
                role: user.role,
                badge: user.badge,
                createdAt: user.createdAt.toISOString(),
            };

            return apiSuccess({ user: userData }, 'მომხმარებლის მონაცემები');
        } catch {
            return apiError(ERROR_CODES.AUTH_TOKEN_INVALID, 'არასწორი ტოკენი', 401);
        }
    } catch (error) {
        console.error('Auth check error:', error);
        return apiError(ERROR_CODES.INTERNAL_ERROR, 'სერვერის შეცდომა', 500);
    }
}


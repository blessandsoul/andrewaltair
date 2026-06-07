export const dynamic = 'force-dynamic'
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// GET - Simple list of users for admin dropdown (name, avatar, verified status)
export async function GET() {
    try {
        await dbConnect();

        const users = await User.find({ isBlocked: false })
            .select('username fullName bio avatar role')
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        const userList = users.map(user => ({
            id: user._id.toString(),
            username: user.username,
            fullName: user.fullName,
            bio: user.bio || '',
            // Drop base64 data-URI avatars (bloat); keep real URL avatars, else default.
            avatar: (typeof user.avatar === 'string' && !user.avatar.startsWith('data:') && user.avatar) || '/images/default-avatar.jpg',
            verified: ['god', 'admin'].includes(user.role),
        }));

        return apiSuccess({ users: userList }, 'Users list fetched successfully');
    } catch (error) {
        console.error('Get users list error:', error);
        return apiError(ERROR_CODES.USER_FETCH_FAILED, 'Failed to fetch users list', 500);
    }
}



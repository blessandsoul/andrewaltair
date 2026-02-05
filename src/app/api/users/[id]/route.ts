import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

interface RouteParams {
    params: Promise<{ id: string }>;
}

// Helper to verify admin role
async function verifyAdmin(request: Request) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string; role: string };

        if (!['god', 'admin'].includes(decoded.role)) {
            return null;
        }

        return decoded;
    } catch {
        return null;
    }
}

// GET - Get a single user
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const admin = await verifyAdmin(request);

        if (!admin) {
            return apiError(ERROR_CODES.ADMIN_UNAUTHORIZED, 'წვდომა აკრძალულია', 403);
        }

        await dbConnect();

        const { id } = await params;

        const user = await User.findById(id).select('-password').lean();

        if (!user) {
            return apiError(ERROR_CODES.USER_NOT_FOUND, 'User not found', 404);
        }

        return apiSuccess({
            user: {
                ...user,
                id: user._id.toString(),
                _id: undefined,
            },
        }, 'User fetched');
    } catch (error) {
        console.error('Get user error:', error);
        return apiError(ERROR_CODES.USER_FETCH_FAILED, 'Failed to fetch user', 500);
    }
}

// PUT - Update a user
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const admin = await verifyAdmin(request);

        if (!admin) {
            return apiError(ERROR_CODES.ADMIN_UNAUTHORIZED, 'წვდომა აკრძალულია', 403);
        }

        await dbConnect();

        const { id } = await params;
        const data = await request.json();

        // Remove sensitive fields
        delete data.id;
        delete data._id;
        delete data.password;

        // Only god can change roles
        if (data.role && admin.role !== 'god') {
            delete data.role;
        }

        const user = await User.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).select('-password').lean();

        if (!user) {
            return apiError(ERROR_CODES.USER_NOT_FOUND, 'User not found', 404);
        }

        return apiSuccess({
            user: {
                ...user,
                id: user._id.toString(),
                _id: undefined,
            },
        }, 'User updated');
    } catch (error) {
        console.error('Update user error:', error);
        return apiError(ERROR_CODES.USER_UPDATE_FAILED, 'Failed to update user', 500);
    }
}

// DELETE - Delete a user
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const admin = await verifyAdmin(request);

        if (!admin) {
            return apiError(ERROR_CODES.ADMIN_UNAUTHORIZED, 'წვდომა აკრძალულია', 403);
        }

        await dbConnect();

        const { id } = await params;

        // Prevent deleting self
        if (admin.userId === id) {
            return apiError(ERROR_CODES.BAD_REQUEST, 'საკუთარი ანგარიშის წაშლა შეუძლებელია', 400);
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return apiError(ERROR_CODES.USER_NOT_FOUND, 'User not found', 404);
        }

        return apiSuccess(null, 'User deleted successfully');
    } catch (error) {
        console.error('Delete user error:', error);
        return apiError(ERROR_CODES.USER_DELETE_FAILED, 'Failed to delete user', 500);
    }
}

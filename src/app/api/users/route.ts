import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
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

// GET - List all users (admin only)
export async function GET(request: Request) {
    try {
        let admin = await verifyAdmin(request);

        // If not authenticated as User (JWT), try Admin Panel Session (Cookie)
        if (!admin) {
            const { verifyAdmin: verifyAdminSession } = await import('@/lib/admin-auth');
            if (verifyAdminSession(request)) {
                // Create a mock admin object to satisfy the check
                admin = { userId: 'admin-panel', role: 'admin' };
            }
        }

        if (!admin) {
            return NextResponse.json(
                { error: 'წვდომა აკრძალულია' },
                { status: 403 }
            );
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        // Build query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (role) {
            query.role = role;
        }

        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { fullName: { $regex: search, $options: 'i' } },
            ];
        }

        const total = await User.countDocuments(query);

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const transformedUsers = users.map(user => ({
            ...user,
            id: user._id.toString(),
            _id: undefined,
        }));

        return NextResponse.json({
            users: transformedUsers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

// POST - Create a new user (admin only)
export async function POST(request: Request) {
    try {
        let admin = await verifyAdmin(request);

        // If not authenticated as User (JWT), try Admin Panel Session (Cookie)
        if (!admin) {
            const { verifyAdmin: verifyAdminSession } = await import('@/lib/admin-auth');
            if (verifyAdminSession(request)) {
                admin = { userId: 'admin-panel', role: 'admin' };
            }
        }

        if (!admin) {
            return NextResponse.json(
                { error: 'წვდომა აკრძალულია' },
                { status: 403 }
            );
        }

        await dbConnect();

        const data = await request.json();

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ email: data.email }, { username: data.username }]
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'მომხმარებელი უკვე არსებობს' },
                { status: 400 }
            );
        }

        const user = new User(data);
        await user.save();

        return NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                createdAt: user.createdAt.toISOString(),
            },
        });
    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
}

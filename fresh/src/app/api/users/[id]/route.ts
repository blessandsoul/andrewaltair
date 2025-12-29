import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

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
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

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
            return NextResponse.json(
                { error: 'წვდომა აკრძალულია' },
                { status: 403 }
            );
        }

        await dbConnect();

        const { id } = await params;

        const user = await User.findById(id).select('-password').lean();

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                ...user,
                id: user._id.toString(),
                _id: undefined,
            },
        });
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}

// PUT - Update a user
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const admin = await verifyAdmin(request);

        if (!admin) {
            return NextResponse.json(
                { error: 'წვდომა აკრძალულია' },
                { status: 403 }
            );
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
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                ...user,
                id: user._id.toString(),
                _id: undefined,
            },
        });
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}

// DELETE - Delete a user
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const admin = await verifyAdmin(request);

        if (!admin) {
            return NextResponse.json(
                { error: 'წვდომა აკრძალულია' },
                { status: 403 }
            );
        }

        await dbConnect();

        const { id } = await params;

        // Prevent deleting self
        if (admin.userId === id) {
            return NextResponse.json(
                { error: 'საკუთარი ანგარიშის წაშლა შეუძლებელია' },
                { status: 400 }
            );
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}

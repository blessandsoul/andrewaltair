export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { UserService } from '@/services/user.service';
import { verifyToken } from '@/lib/jwt-config';
import { verifyAdmin as verifyAdminSession } from '@/lib/admin-auth';

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
            return NextResponse.json(
                { error: 'წვდომა აკრძალულია' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const result = await UserService.getAllUsers({ role, search, page, limit });

        return NextResponse.json(result);
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
        const admin = await verifyAdminAuth(request);

        if (!admin) {
            return NextResponse.json(
                { error: 'წვდომა აკრძალულია' },
                { status: 403 }
            );
        }

        const data = await request.json();

        const user = await UserService.createUser(data);

        return NextResponse.json({
            success: true,
            user,
        });
    } catch (error: any) {
        console.error('Create user error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create user' },
            { status: error.message === 'მომხმარებელი უკვე არსებობს' ? 400 : 500 }
        );
    }
}

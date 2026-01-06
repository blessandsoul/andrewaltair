import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

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
            avatar: user.avatar || '/images/default-avatar.jpg',
            verified: ['god', 'admin'].includes(user.role),
        }));

        return NextResponse.json({ users: userList });
    } catch (error) {
        console.error('Get users list error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}


export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';

// GET - List all notifications
export async function GET() {
    try {
        await dbConnect();
        const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(20).lean();
        const transformed = notifications.map(n => ({
            ...n,
            id: n._id.toString(),
            time: n.createdAt,
            _id: undefined,
        }));
        return NextResponse.json({ notifications: transformed });
    } catch (error) {
        console.error('Get notifications error:', error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}

// POST - Create new notification
export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();
        const notification = new Notification(data);
        await notification.save();
        return NextResponse.json({
            success: true,
            notification: { ...notification.toObject(), id: notification._id.toString() },
        });
    } catch (error) {
        console.error('Create notification error:', error);
        return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
    }
}


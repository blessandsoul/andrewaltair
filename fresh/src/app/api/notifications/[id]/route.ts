import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PUT - Mark notification as read
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        const data = await request.json();
        const notification = await Notification.findByIdAndUpdate(id, data, { new: true }).lean();
        if (!notification) {
            return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, notification: { ...notification, id: notification._id.toString() } });
    } catch (error) {
        console.error('Update notification error:', error);
        return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
    }
}

// DELETE - Delete notification
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        await Notification.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete notification error:', error);
        return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic'
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

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
        return apiSuccess({ notifications: transformed }, 'Notifications fetched successfully');
    } catch (error) {
        console.error('Get notifications error:', error);
        return apiError(ERROR_CODES.NOTIFICATION_FETCH_FAILED, 'Failed to fetch notifications', 500);
    }
}

// POST - Create new notification
export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();
        const notification = new Notification(data);
        await notification.save();
        return apiSuccess({
            notification: { ...notification.toObject(), id: notification._id.toString() },
        }, 'Notification created successfully');
    } catch (error) {
        console.error('Create notification error:', error);
        return apiError(ERROR_CODES.NOTIFICATION_CREATE_FAILED, 'Failed to create notification', 500);
    }
}


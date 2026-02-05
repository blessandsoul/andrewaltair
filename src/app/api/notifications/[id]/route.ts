import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

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
            return apiError(ERROR_CODES.NOTIFICATION_NOT_FOUND, 'Notification not found', 404);
        }
        return apiSuccess({ notification: { ...notification, id: notification._id.toString() } }, 'Notification updated successfully');
    } catch (error) {
        console.error('Update notification error:', error);
        return apiError(ERROR_CODES.NOTIFICATION_UPDATE_FAILED, 'Failed to update notification', 500);
    }
}

// DELETE - Delete notification
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        await Notification.findByIdAndDelete(id);
        return apiSuccess(null, 'Notification deleted successfully');
    } catch (error) {
        console.error('Delete notification error:', error);
        return apiError(ERROR_CODES.NOTIFICATION_DELETE_FAILED, 'Failed to delete notification', 500);
    }
}

import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PUT - Update task
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        const data = await request.json();
        const task = await Task.findByIdAndUpdate(id, data, { new: true }).lean();
        if (!task) {
            return apiError(ERROR_CODES.TASK_NOT_FOUND, 'Task not found', 404);
        }
        return apiSuccess({ task: { ...task, id: task._id.toString() } }, 'Task updated successfully');
    } catch (error) {
        console.error('Update task error:', error);
        return apiError(ERROR_CODES.TASK_UPDATE_FAILED, 'Failed to update task', 500);
    }
}

// DELETE - Delete task
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return apiError(ERROR_CODES.TASK_NOT_FOUND, 'Task not found', 404);
        }
        return apiSuccess(null, 'Task deleted successfully');
    } catch (error) {
        console.error('Delete task error:', error);
        return apiError(ERROR_CODES.TASK_DELETE_FAILED, 'Failed to delete task', 500);
    }
}

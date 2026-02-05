export const dynamic = 'force-dynamic'
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// GET - List all tasks
export async function GET() {
    try {
        await dbConnect();
        const tasks = await Task.find({}).sort({ createdAt: -1 }).lean();
        const transformedTasks = tasks.map(t => ({
            ...t,
            id: t._id.toString(),
            _id: undefined,
        }));
        return apiSuccess({ tasks: transformedTasks }, 'Tasks fetched successfully');
    } catch (error) {
        console.error('Get tasks error:', error);
        return apiError(ERROR_CODES.TASK_FETCH_FAILED, 'Failed to fetch tasks', 500);
    }
}

// POST - Create new task
export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();
        const task = new Task(data);
        await task.save();
        return apiSuccess({
            task: { ...task.toObject(), id: task._id.toString() },
        }, 'Task created successfully');
    } catch (error) {
        console.error('Create task error:', error);
        return apiError(ERROR_CODES.TASK_CREATE_FAILED, 'Failed to create task', 500);
    }
}


import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';

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
        return NextResponse.json({ tasks: transformedTasks });
    } catch (error) {
        console.error('Get tasks error:', error);
        return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
}

// POST - Create new task
export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();
        const task = new Task(data);
        await task.save();
        return NextResponse.json({
            success: true,
            task: { ...task.toObject(), id: task._id.toString() },
        });
    } catch (error) {
        console.error('Create task error:', error);
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}

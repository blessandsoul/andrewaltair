import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import CronJob from '@/models/CronJob';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PUT - Update cron job
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        const data = await request.json();
        const job = await CronJob.findByIdAndUpdate(id, data, { new: true }).lean();
        if (!job) {
            return NextResponse.json({ error: 'Cron job not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, job: { ...job, id: job._id.toString() } });
    } catch (error) {
        console.error('Update cron job error:', error);
        return NextResponse.json({ error: 'Failed to update cron job' }, { status: 500 });
    }
}

// DELETE - Delete cron job
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        await CronJob.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete cron job error:', error);
        return NextResponse.json({ error: 'Failed to delete cron job' }, { status: 500 });
    }
}

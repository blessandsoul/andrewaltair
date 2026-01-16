export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import CronJob from '@/models/CronJob';

// GET - List all cron jobs
export async function GET() {
    try {
        await dbConnect();
        const jobs = await CronJob.find({}).sort({ createdAt: -1 }).lean();
        const transformed = jobs.map(j => ({
            ...j,
            id: j._id.toString(),
            _id: undefined,
        }));
        return NextResponse.json({ jobs: transformed });
    } catch (error) {
        console.error('Get cron jobs error:', error);
        return NextResponse.json({ error: 'Failed to fetch cron jobs' }, { status: 500 });
    }
}

// POST - Create new cron job
export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();
        const job = new CronJob(data);
        await job.save();
        return NextResponse.json({
            success: true,
            job: { ...job.toObject(), id: job._id.toString() },
        });
    } catch (error) {
        console.error('Create cron job error:', error);
        return NextResponse.json({ error: 'Failed to create cron job' }, { status: 500 });
    }
}


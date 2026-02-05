export const dynamic = 'force-dynamic'
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
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
        return apiSuccess({ jobs: transformed }, 'Cron jobs fetched successfully');
    } catch (error) {
        console.error('Get cron jobs error:', error);
        return apiError(ERROR_CODES.CRON_FETCH_FAILED, 'Failed to fetch cron jobs', 500);
    }
}

// POST - Create new cron job
export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();
        const job = new CronJob(data);
        await job.save();
        return apiSuccess({
            job: { ...job.toObject(), id: job._id.toString() },
        }, 'Cron job created', 201);
    } catch (error) {
        console.error('Create cron job error:', error);
        return apiError(ERROR_CODES.CRON_CREATE_FAILED, 'Failed to create cron job', 500);
    }
}


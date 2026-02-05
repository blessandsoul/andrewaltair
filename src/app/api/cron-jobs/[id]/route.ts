import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
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
            return apiError(ERROR_CODES.CRON_NOT_FOUND, 'Cron job not found', 404);
        }
        return apiSuccess({ job: { ...job, id: job._id.toString() } }, 'Cron job updated');
    } catch (error) {
        console.error('Update cron job error:', error);
        return apiError(ERROR_CODES.CRON_UPDATE_FAILED, 'Failed to update cron job', 500);
    }
}

// DELETE - Delete cron job
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        await CronJob.findByIdAndDelete(id);
        return apiSuccess(null, 'Cron job deleted');
    } catch (error) {
        console.error('Delete cron job error:', error);
        return apiError(ERROR_CODES.CRON_DELETE_FAILED, 'Failed to delete cron job', 500);
    }
}

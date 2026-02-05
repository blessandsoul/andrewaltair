import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from '@/lib/db';
import Backup from '@/models/Backup';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// DELETE - Delete a backup
export async function DELETE(request: Request, { params }: RouteParams) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        await dbConnect();
        const { id } = await params;
        const backup = await Backup.findByIdAndDelete(id);

        if (!backup) {
            return apiError(ERROR_CODES.BACKUP_NOT_FOUND, 'Backup not found', 404);
        }

        return apiSuccess(null, 'Backup deleted successfully');
    } catch (error) {
        console.error('Delete backup error:', error);
        return apiError(ERROR_CODES.BACKUP_DELETE_FAILED, 'Failed to delete backup', 500);
    }
}

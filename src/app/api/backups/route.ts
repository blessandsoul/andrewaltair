export const dynamic = 'force-dynamic'
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { SystemService } from '@/services/system.service';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';

// GET - List all backups
export async function GET(request: Request) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const backups = await SystemService.getAllBackups();
        return apiSuccess({ backups }, 'Backups fetched successfully');
    } catch (error) {
        console.error('Get backups error:', error);
        return apiError(ERROR_CODES.BACKUP_FETCH_FAILED, 'Failed to fetch backups', 500);
    }
}

// POST - Create new backup
export async function POST(request: Request) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const data = await request.json();
        const backup = await SystemService.createBackup(data);
        return apiSuccess({ backup }, 'Backup created successfully');
    } catch (error) {
        console.error('Create backup error:', error);
        return apiError(ERROR_CODES.BACKUP_CREATE_FAILED, 'Failed to create backup', 500);
    }
}

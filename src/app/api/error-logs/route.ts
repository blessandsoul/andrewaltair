export const dynamic = 'force-dynamic'
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { SystemService } from '@/services/system.service';

// GET - List error logs
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const level = searchParams.get('level') || undefined;

        const logs = await SystemService.getErrorLogs(level);
        return apiSuccess({ logs }, 'Error logs fetched successfully');
    } catch (error) {
        console.error('Get error logs error:', error);
        return apiError(ERROR_CODES.ERROR_LOG_FETCH_FAILED, 'Failed to fetch error logs', 500);
    }
}

// POST - Create error log
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const log = await SystemService.createErrorLog(data);
        return apiSuccess({ log }, 'Error log created successfully');
    } catch (error) {
        console.error('Create error log error:', error);
        return apiError(ERROR_CODES.ERROR_LOG_CREATE_FAILED, 'Failed to create error log', 500);
    }
}

// DELETE - Clear all logs
export async function DELETE() {
    try {
        await SystemService.clearErrorLogs();
        return apiSuccess(null, 'All logs cleared');
    } catch (error) {
        console.error('Clear logs error:', error);
        return apiError(ERROR_CODES.ERROR_LOG_DELETE_FAILED, 'Failed to clear logs', 500);
    }
}

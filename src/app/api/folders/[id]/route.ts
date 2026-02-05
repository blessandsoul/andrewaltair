import dbConnect from '@/lib/db';
import Folder from '@/models/Folder';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PUT - Update folder
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        const data = await request.json();
        const folder = await Folder.findByIdAndUpdate(id, data, { new: true }).lean();
        if (!folder) {
            return apiError(ERROR_CODES.FOLDER_NOT_FOUND, 'Folder not found', 404);
        }
        return apiSuccess({ ...folder, id: folder._id.toString() }, 'Folder updated');
    } catch (error) {
        console.error('Update folder error:', error);
        return apiError(ERROR_CODES.FOLDER_UPDATE_FAILED, 'Failed to update folder', 500);
    }
}

// DELETE - Delete folder
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        await Folder.findByIdAndDelete(id);
        return apiSuccess(null, 'Folder deleted');
    } catch (error) {
        console.error('Delete folder error:', error);
        return apiError(ERROR_CODES.FOLDER_DELETE_FAILED, 'Failed to delete folder', 500);
    }
}

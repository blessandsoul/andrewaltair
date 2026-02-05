import dbConnect from '@/lib/db';
import Redirect from '@/models/Redirect';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// DELETE - Delete a redirect
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        const redirect = await Redirect.findByIdAndDelete(id);

        if (!redirect) {
            return apiError(ERROR_CODES.REDIRECT_NOT_FOUND, 'Redirect not found', 404);
        }

        return apiSuccess(null, 'Redirect deleted successfully');
    } catch (error) {
        console.error('Delete redirect error:', error);
        return apiError(ERROR_CODES.REDIRECT_DELETE_FAILED, 'Failed to delete redirect', 500);
    }
}

// PUT - Increment hit count
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;

        const redirect = await Redirect.findByIdAndUpdate(
            id,
            { $inc: { hits: 1 } },
            { new: true }
        ).lean();

        if (!redirect) {
            return apiError(ERROR_CODES.REDIRECT_NOT_FOUND, 'Redirect not found', 404);
        }

        return apiSuccess({
            redirect: { ...redirect, id: redirect._id.toString() },
        }, 'Redirect updated successfully');
    } catch (error) {
        console.error('Update redirect error:', error);
        return apiError(ERROR_CODES.REDIRECT_UPDATE_FAILED, 'Failed to update redirect', 500);
    }
}

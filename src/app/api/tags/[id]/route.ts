import dbConnect from '@/lib/db';
import Tag from '@/models/Tag';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get a single tag
export async function GET(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        const tag = await Tag.findById(id).lean();

        if (!tag) {
            return apiError(ERROR_CODES.TAG_NOT_FOUND, 'Tag not found', 404);
        }

        return apiSuccess({ ...tag, id: tag._id.toString() }, 'Tag retrieved');
    } catch (error) {
        console.error('Get tag error:', error);
        return apiError(ERROR_CODES.TAG_FETCH_FAILED, 'Failed to fetch tag', 500);
    }
}

// PUT - Update a tag
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        const data = await request.json();
        delete data.id;
        delete data._id;

        const tag = await Tag.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).lean();

        if (!tag) {
            return apiError(ERROR_CODES.TAG_NOT_FOUND, 'Tag not found', 404);
        }

        return apiSuccess({ ...tag, id: tag._id.toString() }, 'Tag updated');
    } catch (error) {
        console.error('Update tag error:', error);
        return apiError(ERROR_CODES.TAG_UPDATE_FAILED, 'Failed to update tag', 500);
    }
}

// DELETE - Delete a tag
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        const tag = await Tag.findByIdAndDelete(id);

        if (!tag) {
            return apiError(ERROR_CODES.TAG_NOT_FOUND, 'Tag not found', 404);
        }

        return apiSuccess(null, 'Tag deleted successfully');
    } catch (error) {
        console.error('Delete tag error:', error);
        return apiError(ERROR_CODES.TAG_DELETE_FAILED, 'Failed to delete tag', 500);
    }
}

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get a single comment
export async function GET(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();

        const { id } = await params;

        const comment = await Comment.findById(id).lean();

        if (!comment) {
            return apiError(ERROR_CODES.COMMENT_FETCH_FAILED, 'Comment not found', 404);
        }

        return apiSuccess({
            comment: {
                ...comment,
                id: comment._id.toString(),
            },
        }, 'Comment fetched successfully');
    } catch (error) {
        console.error('Get comment error:', error);
        return apiError(ERROR_CODES.COMMENT_FETCH_FAILED, 'Failed to fetch comment', 500);
    }
}

// PUT - Update a comment (approve/reject/edit)
export async function PUT(request: Request, { params }: RouteParams) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        await dbConnect();

        const { id } = await params;
        const data = await request.json();

        // Remove id from data if present
        delete data.id;
        delete data._id;

        const comment = await Comment.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).lean();

        if (!comment) {
            return apiError(ERROR_CODES.COMMENT_UPDATE_FAILED, 'Comment not found', 404);
        }

        return apiSuccess({
            comment: {
                ...comment,
                id: comment._id.toString(),
            },
        }, 'Comment updated successfully');
    } catch (error) {
        console.error('Update comment error:', error);
        return apiError(ERROR_CODES.COMMENT_UPDATE_FAILED, 'Failed to update comment', 500);
    }
}

// DELETE - Delete a comment
export async function DELETE(request: Request, { params }: RouteParams) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        await dbConnect();

        const { id } = await params;

        const comment = await Comment.findByIdAndDelete(id);

        if (!comment) {
            return apiError(ERROR_CODES.COMMENT_DELETE_FAILED, 'Comment not found', 404);
        }

        return apiSuccess(null, 'Comment deleted successfully');
    } catch (error) {
        console.error('Delete comment error:', error);
        return apiError(ERROR_CODES.COMMENT_DELETE_FAILED, 'Failed to delete comment', 500);
    }
}

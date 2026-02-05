import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import { verifyAdmin } from '@/lib/admin-auth';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get a single category
export async function GET(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        const category = await Category.findById(id).lean();

        if (!category) {
            return apiError(ERROR_CODES.CATEGORY_NOT_FOUND, 'Category not found', 404);
        }

        return apiSuccess({ ...category, id: category._id.toString() }, 'Category retrieved');
    } catch (error) {
        console.error('Get category error:', error);
        return apiError(ERROR_CODES.CATEGORY_FETCH_FAILED, 'Failed to fetch category', 500);
    }
}

// PUT - Update a category
export async function PUT(request: Request, { params }: RouteParams) {
    if (!verifyAdmin(request)) {
        return apiError(ERROR_CODES.ADMIN_UNAUTHORIZED, 'Admin access required', 401);
    }

    try {
        await dbConnect();
        const { id } = await params;
        const data = await request.json();
        delete data.id;
        delete data._id;

        const category = await Category.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).lean();

        if (!category) {
            return apiError(ERROR_CODES.CATEGORY_NOT_FOUND, 'Category not found', 404);
        }

        return apiSuccess({ ...category, id: category._id.toString() }, 'Category updated');
    } catch (error) {
        console.error('Update category error:', error);
        return apiError(ERROR_CODES.CATEGORY_UPDATE_FAILED, 'Failed to update category', 500);
    }
}

// DELETE - Delete a category
export async function DELETE(request: Request, { params }: RouteParams) {
    if (!verifyAdmin(request)) {
        return apiError(ERROR_CODES.ADMIN_UNAUTHORIZED, 'Admin access required', 401);
    }

    try {
        await dbConnect();
        const { id } = await params;
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return apiError(ERROR_CODES.CATEGORY_NOT_FOUND, 'Category not found', 404);
        }

        return apiSuccess(null, 'Category deleted successfully');
    } catch (error) {
        console.error('Delete category error:', error);
        return apiError(ERROR_CODES.CATEGORY_DELETE_FAILED, 'Failed to delete category', 500);
    }
}

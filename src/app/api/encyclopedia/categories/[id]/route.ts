import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import EncyclopediaCategory from '@/models/EncyclopediaCategory';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// GET single category
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const category = await EncyclopediaCategory.findById(params.id)
            .populate('sectionId', 'title slug')
            .lean();

        if (!category) {
            return apiError(ERROR_CODES.ENCYCLOPEDIA_NOT_FOUND, 'Category not found', 404);
        }

        return apiSuccess(category, 'Category fetched successfully');
    } catch (error) {
        console.error('Error fetching category:', error);
        return apiError(ERROR_CODES.ENCYCLOPEDIA_FETCH_FAILED, 'Failed to fetch category', 500);
    }
}

// PUT update category
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const body = await request.json();

        const category = await EncyclopediaCategory.findByIdAndUpdate(
            params.id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!category) {
            return apiError(ERROR_CODES.ENCYCLOPEDIA_NOT_FOUND, 'Category not found', 404);
        }

        return apiSuccess(category, 'Category updated successfully');
    } catch (error) {
        console.error('Error updating category:', error);
        return apiError(ERROR_CODES.ENCYCLOPEDIA_UPDATE_FAILED, 'Failed to update category', 500);
    }
}

// DELETE category
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const category = await EncyclopediaCategory.findByIdAndDelete(params.id);

        if (!category) {
            return apiError(ERROR_CODES.ENCYCLOPEDIA_NOT_FOUND, 'Category not found', 404);
        }

        return apiSuccess({ message: 'Category deleted' }, 'Category deleted successfully');
    } catch (error) {
        console.error('Error deleting category:', error);
        return apiError(ERROR_CODES.ENCYCLOPEDIA_DELETE_FAILED, 'Failed to delete category', 500);
    }
}

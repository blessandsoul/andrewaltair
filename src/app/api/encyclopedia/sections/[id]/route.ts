import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import EncyclopediaSection from '@/models/EncyclopediaSection';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// GET single section
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const section = await EncyclopediaSection.findById(params.id).lean();

        if (!section) {
            return apiError(ERROR_CODES.ENCYCLOPEDIA_NOT_FOUND, 'Section not found', 404);
        }

        return apiSuccess(section, 'Section fetched successfully');
    } catch (error) {
        console.error('Error fetching section:', error);
        return apiError(ERROR_CODES.ENCYCLOPEDIA_FETCH_FAILED, 'Failed to fetch section', 500);
    }
}

// PUT update section
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const body = await request.json();

        const section = await EncyclopediaSection.findByIdAndUpdate(
            params.id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!section) {
            return apiError(ERROR_CODES.ENCYCLOPEDIA_NOT_FOUND, 'Section not found', 404);
        }

        return apiSuccess(section, 'Section updated successfully');
    } catch (error) {
        console.error('Error updating section:', error);
        return apiError(ERROR_CODES.ENCYCLOPEDIA_UPDATE_FAILED, 'Failed to update section', 500);
    }
}

// DELETE section
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const section = await EncyclopediaSection.findByIdAndDelete(params.id);

        if (!section) {
            return apiError(ERROR_CODES.ENCYCLOPEDIA_NOT_FOUND, 'Section not found', 404);
        }

        return apiSuccess({ message: 'Section deleted' }, 'Section deleted successfully');
    } catch (error) {
        console.error('Error deleting section:', error);
        return apiError(ERROR_CODES.ENCYCLOPEDIA_DELETE_FAILED, 'Failed to delete section', 500);
    }
}

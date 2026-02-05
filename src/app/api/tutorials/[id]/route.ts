import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from "@/lib/db";
import Tutorial from "@/models/Tutorial";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const tutorial = await Tutorial.findById(params.id); // Or findBySlug if we use slug in URL

        if (!tutorial) {
            // Try slug
            const bySlug = await Tutorial.findOne({ slug: params.id });
            if (bySlug) return apiSuccess(bySlug, 'Tutorial fetched successfully');

            return apiError(ERROR_CODES.TUTORIAL_NOT_FOUND, 'Tutorial not found', 404);
        }

        return apiSuccess(tutorial, 'Tutorial fetched successfully');
    } catch (error) {
        console.error("Error fetching tutorial:", error);
        return apiError(ERROR_CODES.TUTORIAL_FETCH_FAILED, 'Failed to fetch tutorial', 500);
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const body = await req.json();

        const tutorial = await Tutorial.findByIdAndUpdate(
            params.id,
            { ...body },
            { new: true, runValidators: true }
        );

        if (!tutorial) {
            return apiError(ERROR_CODES.TUTORIAL_NOT_FOUND, 'Tutorial not found', 404);
        }

        return apiSuccess(tutorial, 'Tutorial updated successfully');
    } catch (error) {
        console.error("Error updating tutorial:", error);
        return apiError(ERROR_CODES.TUTORIAL_UPDATE_FAILED, 'Failed to update tutorial', 500);
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const tutorial = await Tutorial.findByIdAndDelete(params.id);

        if (!tutorial) {
            return apiError(ERROR_CODES.TUTORIAL_NOT_FOUND, 'Tutorial not found', 404);
        }

        return apiSuccess(null, 'Tutorial deleted successfully');
    } catch (error) {
        console.error("Error deleting tutorial:", error);
        return apiError(ERROR_CODES.TUTORIAL_DELETE_FAILED, 'Failed to delete tutorial', 500);
    }
}

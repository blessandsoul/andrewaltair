import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import EncyclopediaVersion from '@/models/EncyclopediaVersion';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// GET version history for article
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const versions = await EncyclopediaVersion.find({ articleId: params.id })
            .sort({ version: -1 })
            .lean();

        return apiSuccess(versions, 'Versions fetched successfully');
    } catch (error) {
        console.error('Error fetching versions:', error);
        return apiError(ERROR_CODES.ENCYCLOPEDIA_FETCH_FAILED, 'Failed to fetch versions', 500);
    }
}

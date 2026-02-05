import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Tool from '@/models/Tool';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const toolId = params.id;

        // Increment views count
        const tool = await Tool.findByIdAndUpdate(
            toolId,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!tool) {
            return apiError(ERROR_CODES.TOOL_NOT_FOUND, 'Tool not found', 404);
        }

        return apiSuccess({ views: tool.views }, 'View count incremented');
    } catch (error) {
        console.error('Increment views error:', error);
        return apiError(ERROR_CODES.TOOL_UPDATE_FAILED, 'Failed to increment views', 500);
    }
}

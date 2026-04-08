export const dynamic = 'force-dynamic';

import dbConnect from '@/lib/db';
import Insight from '@/models/Insight';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

const VALID_REACTIONS = ['fire', 'love', 'mindblown', 'applause', 'insightful'] as const;

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { reaction } = await request.json();

        if (!reaction || !VALID_REACTIONS.includes(reaction)) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, `Invalid reaction. Valid: ${VALID_REACTIONS.join(', ')}`, 400);
        }

        await dbConnect();

        const insight = await Insight.findByIdAndUpdate(
            id,
            { $inc: { [`reactions.${reaction}`]: 1 } },
            { new: true }
        ).select('reactions').lean();

        if (!insight) {
            return apiError(ERROR_CODES.INSIGHT_NOT_FOUND, 'Insight not found', 404);
        }

        return apiSuccess(insight.reactions, 'Reaction added');
    } catch (error) {
        console.error('[API] POST /api/insights/[id]/react error:', error);
        return apiError(ERROR_CODES.INTERNAL_ERROR, 'Failed to add reaction', 500);
    }
}

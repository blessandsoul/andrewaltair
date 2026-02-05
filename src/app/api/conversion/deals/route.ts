export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from '@/lib/db';
import Deal from '@/models/Deal';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/server-auth';

// GET: List active deals (public)
export async function GET() {
    try {
        await dbConnect();

        const now = new Date();
        const deals = await Deal.find({
            isActive: true,
            expiresAt: { $gt: now },
        }).sort({ expiresAt: 1 });

        return apiSuccess({ deals }, 'Deals fetched successfully');
    } catch (error) {
        console.error('Deals GET Error:', error);
        return apiError(ERROR_CODES.CONVERSION_FETCH_FAILED, 'Internal Server Error', 500);
    }
}

// POST: Claim a deal
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const user = await getUserFromRequest(req);
        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Unauthorized', 401);
        }
        const userId = user._id.toString();

        const { dealId } = await req.json();

        if (!dealId) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'dealId required', 400);
        }

        const deal = await Deal.findById(dealId);
        if (!deal) {
            return apiError(ERROR_CODES.NOT_FOUND, 'Deal not found', 404);
        }

        // Check if expired
        if (new Date() > deal.expiresAt) {
            return apiError(ERROR_CODES.BAD_REQUEST, 'Deal has expired', 400);
        }

        // Check if slots available
        if (deal.claimedSlots >= deal.totalSlots) {
            return apiError(ERROR_CODES.BAD_REQUEST, 'No slots remaining', 400);
        }

        // Check if user already claimed
        if (deal.claimedBy.includes(userId)) {
            return apiError(ERROR_CODES.BAD_REQUEST, 'Already claimed', 400);
        }

        // Claim the deal
        deal.claimedBy.push(userId);
        deal.claimedSlots += 1;
        await deal.save();

        // Optionally grant credits if it's a credits deal
        if (deal.category === 'credits' && deal.discountedPrice) {
            await User.findByIdAndUpdate(userId, {
                $inc: { credits: deal.discountedPrice }
            });
        }

        return apiSuccess({ code: deal.code }, 'Deal claimed successfully');

    } catch (error) {
        console.error('Deals POST Error:', error);
        return apiError(ERROR_CODES.CONVERSION_ACTION_FAILED, 'Internal Server Error', 500);
    }
}


export const dynamic = 'force-dynamic'
import { NextRequest } from "next/server";
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from "@/lib/db";
import PayoutRequest from "@/models/PayoutRequest";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/server-auth";

// GET - List user's payout history
export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Unauthorized', 401);
        }

        await dbConnect();

        const payouts = await PayoutRequest.find({ userId: user._id })
            .sort({ createdAt: -1 });

        return apiSuccess({ payouts }, 'Payouts fetched successfully');
    } catch (error) {
        console.error("Payout list error:", error);
        return apiError(ERROR_CODES.PAYOUT_FETCH_FAILED, 'Failed to fetch payouts', 500);
    }
}

// POST - Request a new payout
export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Unauthorized', 401);
        }

        await dbConnect();

        // Re-fetch user to get latest earnings
        const userData = await User.findById(user._id);
        const availableBalance = userData?.sellerInfo?.totalEarnings || 0; // In a real app, calculate 'withdrawable' separately from 'total'

        const { amount, method, details } = await request.json();

        if (amount < 50) {
            return apiError(ERROR_CODES.BAD_REQUEST, 'Minimum withdrawal is ₾50', 400);
        }

        if (amount > availableBalance) {
            return apiError(ERROR_CODES.BAD_REQUEST, 'Insufficient balance', 400);
        }

        // Check for pending requests
        const existingPending = await PayoutRequest.findOne({
            userId: user._id,
            status: 'pending'
        });

        if (existingPending) {
            return apiError(ERROR_CODES.BAD_REQUEST, 'You already have a pending request', 400);
        }

        const payout = await PayoutRequest.create({
            userId: user._id,
            amount,
            method,
            details
        });

        return apiSuccess({ payout }, 'Payout requested successfully', 201);

    } catch (error) {
        console.error("Payout request error:", error);
        return apiError(ERROR_CODES.PAYOUT_REQUEST_FAILED, 'Failed to request payout', 500);
    }
}


export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { getUserFromRequest } from '@/lib/server-auth';
import dbConnect from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);

        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Unauthorized', 401);
        }

        const now = new Date();
        const lastClaim = user.mysteryBox?.lastClaimedAt;

        if (lastClaim) {
            const diff = now.getTime() - new Date(lastClaim).getTime();
            const cooldown = 24 * 60 * 60 * 1000;
            if (diff < cooldown) {
                const remaining = Math.ceil((cooldown - diff) / (1000 * 60)); // minutes
                return apiError(ERROR_CODES.BAD_REQUEST, `Cooldown active. ${remaining} minutes remaining`, 400);
            }
        }

        // Grant Reward
        const rewardAmount = Math.floor(Math.random() * 50) + 10;

        user.mysteryBox = {
            lastClaimedAt: now,
            streak: (user.mysteryBox?.streak || 0) + 1
        };
        user.credits += rewardAmount;

        await user.save();

        return apiSuccess({
            reward: { type: 'credits', value: rewardAmount },
            newBalance: user.credits
        }, 'Mystery box claimed!');

    } catch (error) {
        console.error('MysteryBox Error:', error);
        return apiError(ERROR_CODES.CONVERSION_ACTION_FAILED, 'Internal Server Error', 500);
    }
}

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);

        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Unauthorized', 401);
        }

        const lastClaim = user.mysteryBox?.lastClaimedAt;
        let canClaim = true;

        if (lastClaim) {
            const now = new Date();
            const diff = now.getTime() - new Date(lastClaim).getTime();
            const cooldown = 24 * 60 * 60 * 1000;
            if (diff < cooldown) {
                canClaim = false;
            }
        }

        return apiSuccess({
            canClaim,
            lastClaimedAt: lastClaim,
            streak: user.mysteryBox?.streak || 0,
            credits: user.credits
        }, 'Mystery box status fetched');

    } catch (error) {
        return apiError(ERROR_CODES.CONVERSION_FETCH_FAILED, 'Internal Server Error', 500);
    }
}


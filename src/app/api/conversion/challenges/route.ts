export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from '@/lib/db';
import Challenge from '@/models/Challenge';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/server-auth';

// GET: List active challenges (public)
export async function GET() {
    try {
        await dbConnect();

        const challenges = await Challenge.find({
            isActive: true,
            endsAt: { $gt: new Date() }
        }).sort({ endsAt: 1 });

        return apiSuccess({ challenges }, 'Challenges fetched successfully');
    } catch (error) {
        console.error('Challenges Error:', error);
        return apiError(ERROR_CODES.CONVERSION_FETCH_FAILED, 'Failed to get challenges', 500);
    }
}

// POST: Join or complete a challenge
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const user = await getUserFromRequest(req);
        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Unauthorized', 401);
        }
        const userId = user._id.toString();

        const { challengeId, action } = await req.json();
        if (!challengeId) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Challenge ID required', 400);
        }

        const challenge = await Challenge.findById(challengeId);
        if (!challenge || !challenge.isActive) {
            return apiError(ERROR_CODES.NOT_FOUND, 'Challenge not found', 404);
        }

        const participantIndex = challenge.participants.findIndex(
            (p: any) => p.userId.toString() === userId
        );

        if (action === 'join') {
            if (participantIndex >= 0) {
                return apiError(ERROR_CODES.BAD_REQUEST, 'Already joined', 400);
            }

            challenge.participants.push({
                userId,
                joinedAt: new Date(),
            });
            await challenge.save();

            return apiSuccess(null, 'Joined challenge');
        }

        if (action === 'complete') {
            if (participantIndex < 0) {
                return apiError(ERROR_CODES.BAD_REQUEST, 'Not a participant', 400);
            }

            if (challenge.participants[participantIndex].completedAt) {
                return apiError(ERROR_CODES.BAD_REQUEST, 'Already completed', 400);
            }

            challenge.participants[participantIndex].completedAt = new Date();
            await challenge.save();

            // Grant XP
            await User.findByIdAndUpdate(userId, {
                $inc: { 'gamification.xp': challenge.xpReward }
            });

            return apiSuccess({
                xpEarned: challenge.xpReward
            }, 'Challenge completed');
        }

        return apiError(ERROR_CODES.BAD_REQUEST, 'Invalid action', 400);
    } catch (error) {
        console.error('Challenge Action Error:', error);
        return apiError(ERROR_CODES.CONVERSION_ACTION_FAILED, 'Failed to process', 500);
    }
}


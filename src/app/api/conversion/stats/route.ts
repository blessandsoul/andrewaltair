export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/server-auth';

// GET: Get user gamification stats for progress snapshot
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const user = await getUserFromRequest(req);
        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Unauthorized', 401);
        }

        // Calculate weekly stats from gamification data
        const stats = {
            totalXp: user.gamification?.xp || 0,
            level: user.gamification?.level || 1,
            streak: user.gamification?.streak || 0,
            completedLessons: user.gamification?.completedLessons?.length || 0,
            completedQuests: user.gamification?.completedQuests?.length || 0,
            unlockedSkills: user.gamification?.unlockedSkills || [],
            // Weekly stats would need activity logging, for now use totals
            weeklyXp: user.gamification?.xp || 0,
        };

        return apiSuccess({ stats }, 'Stats fetched successfully');
    } catch (error) {
        console.error('Stats Error:', error);
        return apiError(ERROR_CODES.CONVERSION_FETCH_FAILED, 'Failed to get stats', 500);
    }
}


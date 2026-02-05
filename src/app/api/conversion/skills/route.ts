export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/server-auth';

// GET: Get user's unlocked skills
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const user = await getUserFromRequest(req);
        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Unauthorized', 401);
        }

        return apiSuccess({
            xp: user.gamification?.xp || 0,
            unlockedSkills: user.gamification?.unlockedSkills || ['prompt-basics'],
        }, 'Skills fetched successfully');
    } catch (error) {
        console.error('Skills Error:', error);
        return apiError(ERROR_CODES.CONVERSION_FETCH_FAILED, 'Failed to get skills', 500);
    }
}

// POST: Unlock a skill
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const user = await getUserFromRequest(req);
        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Unauthorized', 401);
        }

        const { skillId } = await req.json();
        if (!skillId) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Skill ID required', 400);
        }

        // Initialize gamification if not exists
        if (!user.gamification) {
            user.gamification = {
                xp: 0,
                level: 1,
                streak: 0,
                unlockedSkills: ['prompt-basics'],
                completedQuests: [],
                completedLessons: []
            };
        }

        // Check if skill already unlocked
        if (user.gamification.unlockedSkills?.includes(skillId)) {
            return apiError(ERROR_CODES.BAD_REQUEST, 'Skill already unlocked', 400);
        }

        // Add skill to unlocked list
        if (!user.gamification.unlockedSkills) {
            user.gamification.unlockedSkills = [];
        }
        user.gamification.unlockedSkills.push(skillId);
        await user.save();

        return apiSuccess({
            unlockedSkills: user.gamification.unlockedSkills,
        }, 'Skill unlocked successfully');
    } catch (error) {
        console.error('Skill Unlock Error:', error);
        return apiError(ERROR_CODES.CONVERSION_ACTION_FAILED, 'Failed to unlock skill', 500);
    }
}


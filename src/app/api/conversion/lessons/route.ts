export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from '@/lib/db';
import Lesson from '@/models/Lesson';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/server-auth';

// GET: List lessons (public, but with user progress if authenticated)
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Get user if authenticated (optional)
        const user = await getUserFromRequest(req);
        const userId = user?._id?.toString();

        const lessons = await Lesson.find({ isActive: true })
            .sort({ order: 1 })
            .lean();

        // Mark which lessons user has completed
        const lessonsWithProgress = lessons.map(lesson => ({
            ...lesson,
            completed: userId ? lesson.completedBy?.some((id: any) => id.toString() === userId) : false,
        }));

        return apiSuccess({ lessons: lessonsWithProgress }, 'Lessons fetched successfully');
    } catch (error) {
        console.error('Lessons GET Error:', error);
        return apiError(ERROR_CODES.CONVERSION_FETCH_FAILED, 'Internal Server Error', 500);
    }
}

// POST: Complete a lesson
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const user = await getUserFromRequest(req);
        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Unauthorized', 401);
        }
        const userId = user._id.toString();

        const { lessonId } = await req.json();

        if (!lessonId) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'lessonId required', 400);
        }

        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return apiError(ERROR_CODES.NOT_FOUND, 'Lesson not found', 404);
        }

        // Check if already completed
        if (lesson.completedBy.includes(userId)) {
            return apiSuccess({ alreadyCompleted: true }, 'Already completed');
        }

        // Mark as completed
        lesson.completedBy.push(userId);
        await lesson.save();

        // Grant XP to user
        await User.findByIdAndUpdate(userId, {
            $inc: {
                'gamification.xp': lesson.xpReward,
            }
        });

        // Check if level up needed (every 100 XP = 1 level)
        const updatedUser = await User.findById(userId);
        const newLevel = Math.floor((updatedUser?.gamification?.xp || 0) / 100) + 1;
        if (updatedUser && newLevel > (updatedUser.gamification?.level || 1)) {
            await User.findByIdAndUpdate(userId, {
                $set: { 'gamification.level': newLevel }
            });
        }

        return apiSuccess({
            xpEarned: lesson.xpReward,
            newTotalXp: (updatedUser?.gamification?.xp || 0),
        }, 'Lesson completed');

    } catch (error) {
        console.error('Lessons POST Error:', error);
        return apiError(ERROR_CODES.CONVERSION_ACTION_FAILED, 'Internal Server Error', 500);
    }
}


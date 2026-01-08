import { NextRequest, NextResponse } from 'next/server';
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

        return NextResponse.json({ lessons: lessonsWithProgress });
    } catch (error) {
        console.error('Lessons GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Complete a lesson
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = user._id.toString();

        const { lessonId } = await req.json();

        if (!lessonId) {
            return NextResponse.json({ error: 'lessonId required' }, { status: 400 });
        }

        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
        }

        // Check if already completed
        if (lesson.completedBy.includes(userId)) {
            return NextResponse.json({
                success: true,
                alreadyCompleted: true,
                message: 'Already completed'
            });
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

        return NextResponse.json({
            success: true,
            xpEarned: lesson.xpReward,
            newTotalXp: (updatedUser?.gamification?.xp || 0),
        });

    } catch (error) {
        console.error('Lessons POST Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lesson from '@/models/Lesson';
import User from '@/models/User';

// GET: List lessons
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

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

        const { lessonId, userId } = await req.json();

        if (!lessonId || !userId) {
            return NextResponse.json({ error: 'lessonId and userId required' }, { status: 400 });
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
        const user = await User.findById(userId);
        const newLevel = Math.floor((user?.gamification?.xp || 0) / 100) + 1;
        if (user && newLevel > (user.gamification?.level || 1)) {
            await User.findByIdAndUpdate(userId, {
                $set: { 'gamification.level': newLevel }
            });
        }

        return NextResponse.json({
            success: true,
            xpEarned: lesson.xpReward,
            newTotalXp: (user?.gamification?.xp || 0),
        });

    } catch (error) {
        console.error('Lessons POST Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

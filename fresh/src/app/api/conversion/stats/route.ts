import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// GET: Get user gamification stats for progress snapshot
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findById(userId).select('gamification');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
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

        return NextResponse.json({ stats });
    } catch (error) {
        console.error('Stats Error:', error);
        return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
    }
}

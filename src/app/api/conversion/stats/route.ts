import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/server-auth';

// GET: Get user gamification stats for progress snapshot
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

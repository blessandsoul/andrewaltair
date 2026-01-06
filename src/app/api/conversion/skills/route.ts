import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// GET: Get user's unlocked skills
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

        return NextResponse.json({
            xp: user.gamification?.xp || 0,
            unlockedSkills: user.gamification?.unlockedSkills || ['prompt-basics'],
        });
    } catch (error) {
        console.error('Skills Error:', error);
        return NextResponse.json({ error: 'Failed to get skills' }, { status: 500 });
    }
}

// POST: Unlock a skill
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { skillId } = await req.json();
        if (!skillId) {
            return NextResponse.json({ error: 'Skill ID required' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
            return NextResponse.json({ error: 'Skill already unlocked' }, { status: 400 });
        }

        // Add skill to unlocked list
        if (!user.gamification.unlockedSkills) {
            user.gamification.unlockedSkills = [];
        }
        user.gamification.unlockedSkills.push(skillId);
        await user.save();

        return NextResponse.json({
            success: true,
            unlockedSkills: user.gamification.unlockedSkills,
        });
    } catch (error) {
        console.error('Skill Unlock Error:', error);
        return NextResponse.json({ error: 'Failed to unlock skill' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Challenge from '@/models/Challenge';
import User from '@/models/User';

// GET: List active challenges
export async function GET() {
    try {
        await dbConnect();

        const challenges = await Challenge.find({
            isActive: true,
            endsAt: { $gt: new Date() }
        }).sort({ endsAt: 1 });

        return NextResponse.json({ challenges });
    } catch (error) {
        console.error('Challenges Error:', error);
        return NextResponse.json({ error: 'Failed to get challenges' }, { status: 500 });
    }
}

// POST: Join or complete a challenge
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { challengeId, action } = await req.json();
        if (!challengeId) {
            return NextResponse.json({ error: 'Challenge ID required' }, { status: 400 });
        }

        const challenge = await Challenge.findById(challengeId);
        if (!challenge || !challenge.isActive) {
            return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
        }

        const participantIndex = challenge.participants.findIndex(
            (p: any) => p.userId.toString() === userId
        );

        if (action === 'join') {
            if (participantIndex >= 0) {
                return NextResponse.json({ error: 'Already joined' }, { status: 400 });
            }

            challenge.participants.push({
                userId,
                joinedAt: new Date(),
            });
            await challenge.save();

            return NextResponse.json({ success: true, message: 'Joined challenge' });
        }

        if (action === 'complete') {
            if (participantIndex < 0) {
                return NextResponse.json({ error: 'Not a participant' }, { status: 400 });
            }

            if (challenge.participants[participantIndex].completedAt) {
                return NextResponse.json({ error: 'Already completed' }, { status: 400 });
            }

            challenge.participants[participantIndex].completedAt = new Date();
            await challenge.save();

            // Grant XP
            await User.findByIdAndUpdate(userId, {
                $inc: { 'gamification.xp': challenge.xpReward }
            });

            return NextResponse.json({
                success: true,
                message: 'Challenge completed',
                xpEarned: challenge.xpReward
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Challenge Action Error:', error);
        return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
    }
}

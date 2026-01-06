import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/server-auth';
import dbConnect from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const now = new Date();
        const lastClaim = user.mysteryBox?.lastClaimedAt;

        if (lastClaim) {
            const diff = now.getTime() - new Date(lastClaim).getTime();
            const cooldown = 24 * 60 * 60 * 1000;
            if (diff < cooldown) {
                const remaining = Math.ceil((cooldown - diff) / (1000 * 60)); // minutes
                return NextResponse.json({
                    error: 'Cooldown active',
                    remainingMinutes: remaining
                }, { status: 400 });
            }
        }

        // Grant Reward
        const rewardAmount = Math.floor(Math.random() * 50) + 10;

        user.mysteryBox = {
            lastClaimedAt: now,
            streak: (user.mysteryBox?.streak || 0) + 1
        };
        user.credits += rewardAmount;

        await user.save();

        return NextResponse.json({
            success: true,
            reward: { type: 'credits', value: rewardAmount },
            newBalance: user.credits
        });

    } catch (error) {
        console.error('MysteryBox Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const lastClaim = user.mysteryBox?.lastClaimedAt;
        let canClaim = true;

        if (lastClaim) {
            const now = new Date();
            const diff = now.getTime() - new Date(lastClaim).getTime();
            const cooldown = 24 * 60 * 60 * 1000;
            if (diff < cooldown) {
                canClaim = false;
            }
        }

        return NextResponse.json({
            canClaim,
            lastClaimedAt: lastClaim,
            streak: user.mysteryBox?.streak || 0,
            credits: user.credits
        });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

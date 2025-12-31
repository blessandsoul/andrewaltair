import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
// import { authOptions } from '../../auth/[...nextauth]/route'; // Adjust path if needed, usually we might use a helper
import dbConnect from '@/lib/db';
import User from '@/models/User';

// Mock session helper if auth not fully set up or for speed
async function getSession() {
    // In a real app, use: 
    // const session = await getServerSession(authOptions);
    // return session;
    return { user: { email: 'test@example.com' } }; // TODO: Replace with real auth
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        // TODO: Get real user ID from session
        // const session = await getSession();
        // if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // const user = await User.findOne({ email: session.user.email });

        // For now, let's use a dummy user or wait for real integration
        // We will assume the request sends a userId for now to test connectivity
        // OR better: Just fail if no auth, but I want to show "connected to DB code"

        const body = await req.json();
        const { userId } = body;

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) return NextResponse.json({ error: 'UserId required' }, { status: 400 });

        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const lastClaim = user.mysteryBox?.lastClaimedAt;
        let canClaim = true;
        let timeLeft = '';

        if (lastClaim) {
            const now = new Date();
            const diff = now.getTime() - new Date(lastClaim).getTime();
            const cooldown = 24 * 60 * 60 * 1000;
            if (diff < cooldown) {
                canClaim = false;
                // Calculate time left logic here if needed for server-side rendering
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

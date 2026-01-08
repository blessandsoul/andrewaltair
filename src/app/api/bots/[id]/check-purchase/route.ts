import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Purchase from '@/models/Purchase';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        // For free bots, everyone can comment (maintained legacy logic comment, though this function is check-purchase)
        // Original logic: "For free bots, everyone can comment" -> returns hasPurchased: true
        const Bot = (await import('@/models/Bot')).default;
        const bot = await Bot.findById(params.id);

        if (bot?.tier === 'free') {
            return NextResponse.json({ hasPurchased: true });
        }

        // Verify Authentication
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ hasPurchased: false });
        }

        const token = authHeader.substring(7);
        let userEmail = null;

        try {
            const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string };
            const user = await User.findById(decoded.userId);
            if (user) {
                userEmail = user.email;
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            return NextResponse.json({ hasPurchased: false });
        }

        if (!userEmail) {
            return NextResponse.json({ hasPurchased: false });
        }

        // Check if user has purchased this bot
        const purchase = await Purchase.findOne({
            botId: params.id,
            userEmail: userEmail,
            status: 'completed'
        });

        return NextResponse.json({
            hasPurchased: !!purchase
        });

    } catch (error) {
        console.error('Error checking purchase:', error);
        return NextResponse.json({ hasPurchased: false });
    }
}

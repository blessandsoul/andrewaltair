import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Deal from '@/models/Deal';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/server-auth';

// GET: List active deals (public)
export async function GET() {
    try {
        await dbConnect();

        const now = new Date();
        const deals = await Deal.find({
            isActive: true,
            expiresAt: { $gt: now },
        }).sort({ expiresAt: 1 });

        return NextResponse.json({ deals });
    } catch (error) {
        console.error('Deals GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Claim a deal
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = user._id.toString();

        const { dealId } = await req.json();

        if (!dealId) {
            return NextResponse.json({ error: 'dealId required' }, { status: 400 });
        }

        const deal = await Deal.findById(dealId);
        if (!deal) {
            return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
        }

        // Check if expired
        if (new Date() > deal.expiresAt) {
            return NextResponse.json({ error: 'Deal has expired' }, { status: 400 });
        }

        // Check if slots available
        if (deal.claimedSlots >= deal.totalSlots) {
            return NextResponse.json({ error: 'No slots remaining' }, { status: 400 });
        }

        // Check if user already claimed
        if (deal.claimedBy.includes(userId)) {
            return NextResponse.json({ error: 'Already claimed' }, { status: 400 });
        }

        // Claim the deal
        deal.claimedBy.push(userId);
        deal.claimedSlots += 1;
        await deal.save();

        // Optionally grant credits if it's a credits deal
        if (deal.category === 'credits' && deal.discountedPrice) {
            await User.findByIdAndUpdate(userId, {
                $inc: { credits: deal.discountedPrice }
            });
        }

        return NextResponse.json({
            success: true,
            code: deal.code,
            message: 'Deal claimed successfully'
        });

    } catch (error) {
        console.error('Deals POST Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

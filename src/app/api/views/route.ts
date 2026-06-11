import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import Insight from '@/models/Insight';

export const dynamic = 'force-dynamic';

/**
 * POST /api/views — view-counter beacon target (see components/analytics/ViewBeacon).
 * Accepts { type: 'post' | 'insight', id } and $inc's the doc's views.
 * Body may arrive as a sendBeacon Blob — parse text manually, never trust content-type.
 */
export async function POST(request: NextRequest) {
    try {
        const raw = await request.text();
        const { type, id } = JSON.parse(raw || '{}') as { type?: string; id?: string };

        if ((type !== 'post' && type !== 'insight') || !id || !mongoose.Types.ObjectId.isValid(id)) {
            return new NextResponse(null, { status: 400 });
        }

        await dbConnect();
        const Model = type === 'post' ? Post : Insight;
        await Model.updateOne({ _id: id }, { $inc: { views: 1 } });

        return new NextResponse(null, { status: 204 });
    } catch {
        // counting must never surface errors to the client
        return new NextResponse(null, { status: 204 });
    }
}

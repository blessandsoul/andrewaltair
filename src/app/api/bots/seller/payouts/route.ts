import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PayoutRequest from "@/models/PayoutRequest";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/server-auth";

// GET - List user's payout history
export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const payouts = await PayoutRequest.find({ userId: user._id })
            .sort({ createdAt: -1 });

        return NextResponse.json({ payouts });
    } catch (error) {
        console.error("Payout list error:", error);
        return NextResponse.json({ error: "Failed to fetch payouts" }, { status: 500 });
    }
}

// POST - Request a new payout
export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Re-fetch user to get latest earnings
        const userData = await User.findById(user._id);
        const availableBalance = userData?.sellerInfo?.totalEarnings || 0; // In a real app, calculate 'withdrawable' separately from 'total'

        const { amount, method, details } = await request.json();

        if (amount < 50) {
            return NextResponse.json({ error: "Minimum withdrawal is ₾50" }, { status: 400 });
        }

        if (amount > availableBalance) {
            return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
        }

        // Check for pending requests
        const existingPending = await PayoutRequest.findOne({
            userId: user._id,
            status: 'pending'
        });

        if (existingPending) {
            return NextResponse.json({ error: "You already have a pending request" }, { status: 400 });
        }

        const payout = await PayoutRequest.create({
            userId: user._id,
            amount,
            method,
            details
        });

        return NextResponse.json({ payout }, { status: 201 });

    } catch (error) {
        console.error("Payout request error:", error);
        return NextResponse.json({ error: "Failed to request payout" }, { status: 500 });
    }
}

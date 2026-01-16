export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import SubscriptionPlan from "@/models/SubscriptionPlan";
import { getUserFromRequest } from "@/lib/server-auth";

export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { planId } = await request.json();

        await dbConnect();

        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) {
            return NextResponse.json({ error: "Plan not found" }, { status: 404 });
        }

        // Mock Payment Logic here (Integration with Stripe/Paddle would go here)
        // For now, we instantly activate subscription

        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1); // +1 Month default

        user.subscription = {
            planId: plan._id,
            status: 'active',
            expiresAt,
            autoRenew: true
        };

        // If Pro plan, grant verified status automatically?
        if (plan.slug === 'pro') {
            user.isVerifiedSeller = true;
        }

        await user.save();

        return NextResponse.json({
            success: true,
            subscription: user.subscription
        });

    } catch (error) {
        console.error("Subscribe error:", error);
        return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
    }
}


export const dynamic = 'force-dynamic'
import { NextRequest } from "next/server";
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from "@/lib/db";
import User from "@/models/User";
import SubscriptionPlan from "@/models/SubscriptionPlan";
import { getUserFromRequest } from "@/lib/server-auth";

export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Unauthorized', 401);
        }

        const { planId } = await request.json();

        await dbConnect();

        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) {
            return apiError(ERROR_CODES.NOT_FOUND, 'Plan not found', 404);
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

        return apiSuccess({ subscription: user.subscription }, 'Subscription activated successfully');

    } catch (error) {
        console.error("Subscribe error:", error);
        return apiError(ERROR_CODES.SUBSCRIPTION_FAILED, 'Subscription failed', 500);
    }
}


export const dynamic = 'force-dynamic'
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from "@/lib/db";
import SubscriptionPlan from "@/models/SubscriptionPlan";

// Seed default plans if they don't exist
const seedPlans = async () => {
    const plans = [
        {
            name: 'Basic',
            slug: 'basic',
            price: 0,
            interval: 'month',
            features: ['5 Free Bot Downloads/mo', 'Basic Support', 'Access to Free Bots'],
            isActive: true
        },
        {
            name: 'Pro',
            slug: 'pro',
            price: 29,
            interval: 'month',
            features: ['Unlimited Downloads', 'Priority Support', 'Access to Premium Bots', 'Verified Seller Badge'],
            isActive: true
        },
        {
            name: 'Enterprise',
            slug: 'enterprise',
            price: 99,
            interval: 'month',
            features: ['API Access', 'Custom Bot Development', 'Dedicated Manager'],
            isActive: true
        }
    ];

    for (const plan of plans) {
        await SubscriptionPlan.findOneAndUpdate(
            { slug: plan.slug },
            plan,
            { upsert: true, new: true }
        );
    }
};

export async function GET() {
    try {
        await dbConnect();

        // Check count to seed
        const count = await SubscriptionPlan.countDocuments();
        if (count === 0) {
            await seedPlans();
        }

        const plans = await SubscriptionPlan.find({ isActive: true }).sort({ price: 1 });
        return apiSuccess({ plans }, 'Plans fetched successfully');
    } catch (error) {
        console.error("Get plans error:", error);
        return apiError(ERROR_CODES.SUBSCRIPTION_FETCH_FAILED, 'Failed to fetch plans', 500);
    }
}


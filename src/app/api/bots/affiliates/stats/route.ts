export const dynamic = 'force-dynamic'
import { NextRequest } from "next/server";
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from "@/lib/db";
import AffiliateLink from "@/models/AffiliateLink";
import Purchase from "@/models/Purchase";
import { getUserFromRequest } from "@/lib/server-auth";

// GET - Affiliate Dashboard Stats
export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Unauthorized', 401);
        }

        await dbConnect();

        // 1. Overall Stats Aggregation from Links
        const stats = await AffiliateLink.aggregate([
            { $match: { userId: user._id } },
            {
                $group: {
                    _id: null,
                    totalClicks: { $sum: "$clicks" },
                    totalConversions: { $sum: "$conversions" },
                    totalRevenue: { $sum: "$totalRevenue" },
                    activeLinks: { $sum: 1 }
                }
            }
        ]);

        const overall = stats[0] || { totalClicks: 0, totalConversions: 0, totalRevenue: 0, activeLinks: 0 };

        // 2. Recent Transactions (Commissions)
        // Find links first to get IDs
        const userLinks = await AffiliateLink.find({ userId: user._id }).select('_id');
        const linkIds = userLinks.map(l => l._id);

        const recentSales = await Purchase.find({
            affiliateLinkId: { $in: linkIds },
            status: 'completed'
        })
            .sort({ purchasedAt: -1 })
            .limit(10)
            .populate('affiliateLinkId', 'code campaign')
            .lean();

        // Map sales to clean format
        const recentActivity = recentSales.map((sale: any) => ({
            id: sale._id,
            amount: sale.amount,
            commission: sale.affiliateCommission || 0,
            code: sale.affiliateLinkId?.code || 'Unknown',
            campaign: sale.affiliateLinkId?.campaign,
            date: sale.purchasedAt
        }));

        return apiSuccess({ stats: overall, recentActivity }, 'Affiliate stats fetched successfully');

    } catch (error) {
        console.error("Affiliate stats error:", error);
        return apiError(ERROR_CODES.BOT_FETCH_FAILED, 'Failed to fetch stats', 500);
    }
}

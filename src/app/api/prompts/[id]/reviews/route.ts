import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from '@/lib/db';
import MarketplacePrompt from '@/models/MarketplacePrompt';
import PromptPurchase from '@/models/PromptPurchase';
import MarketplacePromptReview, { IMarketplacePromptReview } from '@/models/MarketplacePromptReview';

interface Params {
    params: Promise<{ id: string }>;
}

// GET - Get reviews for prompt
export async function GET(request: NextRequest, { params }: Params) {
    try {
        await dbConnect();
        const { id } = await params;

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Find prompt
        const query = id.match(/^[0-9a-fA-F]{24}$/)
            ? { _id: id }
            : { slug: id };

        const prompt = await MarketplacePrompt.findOne(query);

        if (!prompt) {
            return apiError(ERROR_CODES.PROMPT_NOT_FOUND, 'Prompt not found', 404);
        }

        const reviews = await MarketplacePromptReview.find({
            promptId: prompt._id,
            status: 'approved',
        })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const total = await MarketplacePromptReview.countDocuments({
            promptId: prompt._id,
            status: 'approved',
        });

        // Calculate rating distribution
        const ratingStats = await MarketplacePromptReview.aggregate([
            { $match: { promptId: prompt._id, status: 'approved' } },
            { $group: { _id: '$rating', count: { $sum: 1 } } },
        ]);

        const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratingStats.forEach((stat: { _id: number; count: number }) => {
            ratingDistribution[stat._id] = stat.count;
        });

        return apiSuccess({
            reviews: reviews.map((r) => ({
                ...r,
                id: (r as IMarketplacePromptReview & { _id: { toString: () => string } })._id.toString(),
                _id: undefined,
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            stats: {
                averageRating: prompt.rating,
                totalReviews: prompt.reviewsCount,
                ratingDistribution,
            },
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        return apiError(ERROR_CODES.PROMPT_FETCH_FAILED, 'Failed to fetch reviews', 500);
    }
}

// POST - Add review (requires purchase)
export async function POST(request: NextRequest, { params }: Params) {
    try {
        await dbConnect();
        const { id } = await params;

        const body = await request.json();
        const { accessToken, rating, content, authorName } = body;

        if (!accessToken) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Access token required to leave a review', 400);
        }

        if (!rating || rating < 1 || rating > 5) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Rating must be between 1 and 5', 400);
        }

        // Find prompt
        const query = id.match(/^[0-9a-fA-F]{24}$/)
            ? { _id: id }
            : { slug: id };

        const prompt = await MarketplacePrompt.findOne(query);

        if (!prompt) {
            return apiError(ERROR_CODES.PROMPT_NOT_FOUND, 'Prompt not found', 404);
        }

        // Verify purchase
        const purchase = await PromptPurchase.findOne({
            promptId: prompt._id,
            accessToken,
            status: 'completed',
        });

        if (!purchase) {
            return apiError(ERROR_CODES.FORBIDDEN, 'You must purchase this prompt to leave a review', 403);
        }

        // Check if user already reviewed
        const existingReview = await MarketplacePromptReview.findOne({
            promptId: prompt._id,
            purchaseId: purchase._id,
        });

        if (existingReview) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'You have already reviewed this prompt', 400);
        }

        // Create review
        const review = await MarketplacePromptReview.create({
            promptId: prompt._id,
            purchaseId: purchase._id,
            authorName: authorName || purchase.userName || 'Anonymous',
            authorEmail: purchase.userEmail,
            rating,
            content: content || '',
            status: 'approved', // Auto-approve for now
        });

        // Update prompt rating
        const allReviews = await MarketplacePromptReview.find({
            promptId: prompt._id,
            status: 'approved',
        });

        const totalRating = allReviews.reduce((sum: number, r: IMarketplacePromptReview) => sum + r.rating, 0);
        const avgRating = totalRating / allReviews.length;

        await MarketplacePrompt.updateOne(
            { _id: prompt._id },
            {
                rating: Math.round(avgRating * 10) / 10,
                reviewsCount: allReviews.length,
            }
        );

        return apiSuccess({
            reviewId: review._id.toString(),
        }, 'Review added successfully', 201);
    } catch (error) {
        console.error('Add review error:', error);
        return apiError(ERROR_CODES.PROMPT_REVIEW_FAILED, 'Failed to add review', 500);
    }
}

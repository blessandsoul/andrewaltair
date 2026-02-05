export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from '@/lib/db';
import BotComment from '@/models/BotComment';
import { getUserFromRequest } from '@/lib/server-auth';

// GET - Fetch comments for a bot
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const botId = searchParams.get('botId');

        if (!botId) {
            return apiError(ERROR_CODES.BAD_REQUEST, 'Bot ID is required', 400);
        }

        const comments = await BotComment.find({
            botId,
            status: 'approved'
        })
            .sort({ createdAt: -1 })
            .lean();

        const transformedComments = comments.map(comment => ({
            id: comment._id.toString(),
            botId: comment.botId.toString(),
            userId: comment.userId?.toString(),
            userName: comment.userName,
            userAvatar: comment.userAvatar,
            text: comment.text,
            rating: comment.rating,
            likes: comment.likes,
            createdAt: comment.createdAt.toISOString(),
        }));

        return apiSuccess({
            comments: transformedComments,
            total: transformedComments.length
        }, 'Comments fetched successfully');
    } catch (error) {
        console.error('Get bot comments error:', error);
        return apiError(ERROR_CODES.BOT_COMMENT_FETCH_FAILED, 'Failed to fetch comments', 500);
    }
}

// POST - Create a new comment
export async function POST(request: NextRequest) {
    try {
        // 🛡️ AUTHENTICATION REQUIRED
        const user = await getUserFromRequest(request);
        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'ავტორიზაცია აუცილებელია კომენტარის დასატოვებლად', 401);
        }

        await dbConnect();

        const { botId, text, rating } = await request.json();

        // Validate required fields
        if (!botId || !text) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Bot ID და text აუცილებელია', 400);
        }

        // Validate text length
        if (text.length < 2 || text.length > 1000) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'კომენტარი უნდა იყოს 2-1000 სიმბოლო', 400);
        }

        // Validate rating
        if (rating && (rating < 1 || rating > 5)) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'რეიტინგი უნდა იყოს 1-დან 5-მდე', 400);
        }

        // Create comment with authenticated user data
        const comment = new BotComment({
            botId,
            userId: user._id,
            userName: user.fullName,
            userAvatar: user.avatar || '/images/default-avatar.jpg',
            text: text.trim(),
            rating: rating || 5,
            status: 'pending' // Require moderation
        });

        await comment.save();

        return apiSuccess({
            comment: {
                id: comment._id.toString(),
                botId: comment.botId.toString(),
                userName: comment.userName,
                userAvatar: comment.userAvatar,
                text: comment.text,
                rating: comment.rating,
                likes: comment.likes,
                createdAt: comment.createdAt.toISOString(),
            }
        }, 'Comment created successfully', 201);
    } catch (error) {
        console.error('Create bot comment error:', error);
        return apiError(ERROR_CODES.BOT_COMMENT_CREATE_FAILED, 'კომენტარის შექმნა ვერ მოხერხდა', 500);
    }
}



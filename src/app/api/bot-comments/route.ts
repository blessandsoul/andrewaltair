import { NextRequest, NextResponse } from 'next/server';
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
            return NextResponse.json(
                { error: 'Bot ID is required' },
                { status: 400 }
            );
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

        return NextResponse.json({ 
            comments: transformedComments,
            total: transformedComments.length
        });
    } catch (error) {
        console.error('Get bot comments error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch comments' },
            { status: 500 }
        );
    }
}

// POST - Create a new comment
export async function POST(request: NextRequest) {
    try {
        // 🛡️ AUTHENTICATION REQUIRED
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'ავტორიზაცია აუცილებელია კომენტარის დასატოვებლად' },
                { status: 401 }
            );
        }

        await dbConnect();

        const { botId, text, rating } = await request.json();

        // 🛡️ Validate required fields
        if (!botId || !text) {
            return NextResponse.json(
                { error: 'Bot ID და text აუცილებელია' },
                { status: 400 }
            );
        }

        // 🛡️ Validate text length
        if (text.length < 2 || text.length > 1000) {
            return NextResponse.json(
                { error: 'კომენტარი უნდა იყოს 2-1000 სიმბოლო' },
                { status: 400 }
            );
        }

        // 🛡️ Validate rating
        if (rating && (rating < 1 || rating > 5)) {
            return NextResponse.json(
                { error: 'რეიტინგი უნდა იყოს 1-დან 5-მდე' },
                { status: 400 }
            );
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

        return NextResponse.json({
            success: true,
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
        });
    } catch (error) {
        console.error('Create bot comment error:', error);
        return NextResponse.json(
            { error: 'კომენტარის შექმნა ვერ მოხერხდა' },
            { status: 500 }
        );
    }
}


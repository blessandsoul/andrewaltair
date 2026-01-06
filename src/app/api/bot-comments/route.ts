import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BotComment from '@/models/BotComment';

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
        await dbConnect();

        const data = await request.json();
        const { botId, text, rating } = data;

        if (!botId || !text) {
            return NextResponse.json(
                { error: 'Bot ID and text are required' },
                { status: 400 }
            );
        }

        // For now, use guest user. In production, get from auth session
        const comment = new BotComment({
            botId,
            userName: 'სტუმარი',
            userAvatar: '/images/default-avatar.jpg',
            text,
            rating: rating || 5,
            status: 'approved'
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
            { error: 'Failed to create comment' },
            { status: 500 }
        );
    }
}


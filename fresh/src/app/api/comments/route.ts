import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';

// GET - List all comments with filtering
export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('postId');
        const status = searchParams.get('status'); // pending, approved, rejected
        const limit = parseInt(searchParams.get('limit') || '50');
        const page = parseInt(searchParams.get('page') || '1');

        // Build query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (postId) {
            query.postId = postId;
        }

        if (status) {
            query.status = status;
        }

        const total = await Comment.countDocuments(query);

        const comments = await Comment.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('postId', 'title slug')
            .lean();

        const transformedComments = comments.map(comment => ({
            ...comment,
            id: comment._id.toString(),
            postId: comment.postId?._id?.toString() || comment.postId,
            postTitle: (comment.postId as { title?: string })?.title || 'Unknown Post',
            _id: undefined,
        }));

        return NextResponse.json({
            comments: transformedComments,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        console.error('Get comments error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch comments' },
            { status: 500 }
        );
    }
}

// POST - Create a new comment
export async function POST(request: Request) {
    try {
        await dbConnect();

        const data = await request.json();

        const comment = new Comment({
            ...data,
            status: 'pending', // Default to pending for moderation
        });
        await comment.save();

        return NextResponse.json({
            success: true,
            comment: {
                ...comment.toObject(),
                id: comment._id.toString(),
            },
        });
    } catch (error) {
        console.error('Create comment error:', error);
        return NextResponse.json(
            { error: 'Failed to create comment' },
            { status: 500 }
        );
    }
}

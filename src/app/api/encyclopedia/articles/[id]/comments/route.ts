import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';

// GET comments for encyclopedia article
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        // Use article ID as postId with encyclopedia prefix
        const postId = `encyclopedia-${params.id}`;

        const comments = await Comment.find({
            postId,
            parentId: null // Only top-level comments
        })
            .sort({ createdAt: -1 })
            .lean();

        // Get replies for each comment
        const commentsWithReplies = await Promise.all(
            comments.map(async (comment) => {
                const replies = await Comment.find({ parentId: comment._id })
                    .sort({ createdAt: 1 })
                    .lean();
                return { ...comment, replies };
            })
        );

        return NextResponse.json({ comments: commentsWithReplies });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

// POST new comment
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const body = await request.json();

        const postId = `encyclopedia-${params.id}`;

        const comment = await Comment.create({
            postId,
            postTitle: body.postTitle,
            author: {
                name: body.name || 'Anonymous',
                avatar: body.avatar,
            },
            content: body.content,
            parentId: body.parentId || null,
        });

        return NextResponse.json({ comment }, { status: 201 });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}

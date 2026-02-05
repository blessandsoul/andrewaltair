import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

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

        return apiSuccess(commentsWithReplies, 'Comments fetched successfully');
    } catch (error) {
        console.error('Error fetching comments:', error);
        return apiError(ERROR_CODES.COMMENT_FETCH_FAILED, 'Failed to fetch comments', 500);
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

        return apiSuccess(comment, 'Comment created successfully', 201);
    } catch (error) {
        console.error('Error creating comment:', error);
        return apiError(ERROR_CODES.COMMENT_CREATE_FAILED, 'Failed to create comment', 500);
    }
}

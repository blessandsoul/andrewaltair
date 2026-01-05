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
            // Support both ObjectId and string postId (for tools, posts, etc.)
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
            .lean();

        // Get post/tool titles for each comment
        const Tool = (await import('@/models/Tool')).default;
        const Post = (await import('@/models/Post')).default;

        const transformedComments = await Promise.all(comments.map(async (comment) => {
            let postTitle = 'Unknown Post';
            
            // Check if postId starts with "tool-" (for tools)
            if (comment.postId && typeof comment.postId === 'string' && comment.postId.startsWith('tool-')) {
                const toolId = comment.postId.replace('tool-', '');
                try {
                    const tool = await Tool.findById(toolId).select('name').lean();
                    if (tool) {
                        postTitle = `Tool: ${tool.name}`;
                    }
                } catch (err) {
                    console.error('Error fetching tool:', err);
                }
            } else {
                // Try to find post
                try {
                    const post = await Post.findById(comment.postId).select('title').lean();
                    if (post) {
                        postTitle = `Post: ${post.title}`;
                    }
                } catch (err) {
                    console.error('Error fetching post:', err);
                }
            }

            return {
                ...comment,
                id: comment._id.toString(),
                postId: comment.postId,
                postTitle,
                author: comment.author,
                _id: undefined,
            };
        }));

        return NextResponse.json({
            comments: transformedComments,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        console.error('Get comments error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return NextResponse.json(
            { error: 'Failed to fetch comments', details: error instanceof Error ? error.message : String(error) },
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
        console.error('Error details:', JSON.stringify(error, null, 2));
        return NextResponse.json(
            { error: 'Failed to create comment', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

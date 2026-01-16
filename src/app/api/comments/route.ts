export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';
import { getUserFromRequest } from '@/lib/server-auth';

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

        // 🚀 FIX N+1: Import models once, outside loop
        const Tool = (await import('@/models/Tool')).default;
        const Post = (await import('@/models/Post')).default;

        // 🚀 FIX N+1: Collect all IDs and batch fetch
        const toolIds: string[] = [];
        const postIds: string[] = [];

        comments.forEach(comment => {
            if (comment.postId && typeof comment.postId === 'string') {
                if (comment.postId.startsWith('tool-')) {
                    toolIds.push(comment.postId.replace('tool-', ''));
                } else {
                    postIds.push(comment.postId);
                }
            }
        });

        // Batch fetch tools and posts
        const [tools, posts] = await Promise.all([
            toolIds.length > 0 ? Tool.find({ _id: { $in: toolIds } }).select('_id name').lean() : Promise.resolve([]),
            postIds.length > 0 ? Post.find({ _id: { $in: postIds } }).select('_id title').lean() : Promise.resolve([])
        ]);

        // Create lookup maps
        const toolMap = new Map(tools.map(t => [t._id.toString(), t.name]));
        const postMap = new Map(posts.map(p => [p._id.toString(), p.title]));

        // Transform comments using lookup maps
        const transformedComments = comments.map(comment => {
            let postTitle = 'Unknown Post';
            
            if (comment.postId && typeof comment.postId === 'string') {
                if (comment.postId.startsWith('tool-')) {
                    const toolId = comment.postId.replace('tool-', '');
                    const toolName = toolMap.get(toolId);
                    if (toolName) {
                        postTitle = `Tool: ${toolName}`;
                    }
                } else {
                    const title = postMap.get(comment.postId);
                    if (title) {
                        postTitle = `Post: ${title}`;
                    }
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
        });

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
        // 🛡️ AUTHENTICATION REQUIRED
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'ავტორიზაცია აუცილებელია კომენტარის დასატოვებლად' },
                { status: 401 }
            );
        }

        await dbConnect();

        const { postId, text, parentId } = await request.json();

        // 🛡️ Validate required fields
        if (!postId || !text) {
            return NextResponse.json(
                { error: 'postId და text აუცილებელია' },
                { status: 400 }
            );
        }

        // 🛡️ Validate text length
        if (text.length < 2 || text.length > 2000) {
            return NextResponse.json(
                { error: 'კომენტარი უნდა იყოს 2-2000 სიმბოლო' },
                { status: 400 }
            );
        }

        // Create comment with authenticated user data
        const comment = new Comment({
            postId,
            text: text.trim(),
            parentId: parentId || null,
            author: {
                userId: user._id.toString(),
                name: user.fullName,
                avatar: user.avatar,
            },
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
            { error: 'კომენტარის შექმნა ვერ მოხერხდა' },
            { status: 500 }
        );
    }
}


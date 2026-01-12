import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import mongoose from 'mongoose';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get a single post by ID or slug
export async function GET(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();

        const { id } = await params;

        let post;

        // Check if id is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            post = await Post.findById(id).lean();
        }

        // If not found by ID, try slug
        if (!post) {
            post = await Post.findOne({ slug: id }).lean();
        }

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }


        // Backfill numericId if missing
        if (!post.numericId) {
            const numericId = await generateUniqueId();
            await Post.updateOne({ _id: post._id }, { numericId });
            // @ts-ignore
            post.numericId = numericId;
        }

        // Increment views
        await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });

        // Get previous and next posts for navigation
        const [prevPost, nextPost] = await Promise.all([
            Post.findOne({
                status: 'published',
                $or: [
                    { order: { $lt: post.order } },
                    { order: post.order, createdAt: { $gt: post.createdAt } }
                ]
            })
                .sort({ order: -1, createdAt: 1 })
                .select('slug title')
                .lean(),
            Post.findOne({
                status: 'published',
                $or: [
                    { order: { $gt: post.order } },
                    { order: post.order, createdAt: { $lt: post.createdAt } }
                ]
            })
                .sort({ order: 1, createdAt: -1 })
                .select('slug title')
                .lean()
        ]);

        return NextResponse.json({
            post: {
                ...post,
                id: post._id.toString(),
                views: post.views + 1,
            },
            prevPost: prevPost ? { slug: prevPost.slug, title: prevPost.title } : null,
            nextPost: nextPost ? { slug: nextPost.slug, title: nextPost.title } : null,
        });
    } catch (error) {
        console.error('Get post error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch post' },
            { status: 500 }
        );
    }
}

// PUT - Update a post
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();

        const { id } = await params;
        const data = await request.json();

        // Remove id from data if present
        delete data.id;
        delete data._id;

        const post = await Post.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).lean();

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        // 🔄 Revalidate caches
        revalidatePath('/blog');
        revalidatePath(`/blog/${post.slug}`);
        revalidatePath('/');

        return NextResponse.json({
            success: true,
            post: {
                ...post,
                id: post._id.toString(),
            },
        });
    } catch (error) {
        console.error('Update post error:', error);
        return NextResponse.json(
            { error: 'Failed to update post' },
            { status: 500 }
        );
    }
}

// DELETE - Delete a post
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();

        const { id } = await params;

        const post = await Post.findByIdAndDelete(id);

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        // 🔄 Revalidate caches
        revalidatePath('/blog');
        revalidatePath('/');

        return NextResponse.json({
            success: true,
            message: 'Post deleted successfully',
        });
    } catch (error) {
        console.error('Delete post error:', error);
        return NextResponse.json(
            { error: 'Failed to delete post' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import MarketplacePrompt from '@/models/MarketplacePrompt';
import { normalizeId } from '@/lib/id-system';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();

        const { id } = await params;

        // Clean ID (allow 123-456 format in URL)
        const numericId = normalizeId(id);

        // 1. Try finding a Post
        const post = await Post.findOne({ numericId }).select('slug').lean();
        if (post) {
            return redirect(`/blog/${post.slug}`);
        }

        // 2. Try finding a Prompt
        const prompt = await MarketplacePrompt.findOne({ numericId }).select('slug').lean();
        if (prompt) {
            return redirect(`/prompts/${prompt.slug}`);
        }

        // 3. Not found
        return NextResponse.json(
            { error: 'Content not found' },
            { status: 404 }
        );

    } catch (error) {
        // Handle redirect error (next/navigation throws an error that should be re-thrown)
        // @ts-ignore
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        console.error('Short link error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

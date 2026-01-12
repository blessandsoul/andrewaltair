import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import MarketplacePrompt from '@/models/MarketplacePrompt';
import { generateUniqueId } from '@/lib/id-system';
import { verifyAdmin } from '@/lib/admin-auth';

export async function POST(request: Request) {
    try {
        await verifyAdmin();
        await dbConnect();

        // 1. Backfill Posts
        const postsWithoutId = await Post.find({ numericId: { $exists: false } });
        let postsUpdated = 0;
        for (const post of postsWithoutId) {
            const numericId = await generateUniqueId();
            await Post.updateOne({ _id: post._id }, { numericId });
            postsUpdated++;
        }

        // 2. Backfill Prompts
        const promptsWithoutId = await MarketplacePrompt.find({ numericId: { $exists: false } });
        let promptsUpdated = 0;
        for (const prompt of promptsWithoutId) {
            const numericId = await generateUniqueId();
            await MarketplacePrompt.updateOne({ _id: prompt._id }, { numericId });
            promptsUpdated++;
        }

        return NextResponse.json({
            success: true,
            postsUpdated,
            promptsUpdated,
            message: `Backfill complete. Updated ${postsUpdated} posts and ${promptsUpdated} prompts.`
        });
    } catch (error) {
        console.error('Backfill error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

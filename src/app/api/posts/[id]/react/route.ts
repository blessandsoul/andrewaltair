import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";

// Valid reaction types
const VALID_REACTIONS = [
    'fire', 'love', 'mindblown', 'applause', 'insightful',
    'rocket', 'like', 'star', 'smile', 'crown'
];

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const body = await req.json();
        const { type, action } = body;

        // Validate reaction type
        if (!type || !VALID_REACTIONS.includes(type)) {
            return NextResponse.json(
                { error: "Invalid reaction type" },
                { status: 400 }
            );
        }

        // Determine increment (add or remove)
        const increment = action === 'remove' ? -1 : 1;

        // Update the specific reaction field
        const updateField = `reactions.${type}`;
        const post = await Post.findByIdAndUpdate(
            id,
            { $inc: { [updateField]: increment } },
            { new: true }
        );

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Ensure no negative values
        if (post.reactions[type] < 0) {
            await Post.findByIdAndUpdate(id, { $set: { [updateField]: 0 } });
            post.reactions[type] = 0;
        }

        return NextResponse.json({
            success: true,
            reactions: post.reactions,
            type,
            newCount: post.reactions[type]
        });
    } catch (error) {
        console.error("Error updating reaction:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// GET current reactions
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const post = await Post.findById(id).select('reactions');

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            reactions: post.reactions
        });
    } catch (error) {
        console.error("Error fetching reactions:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

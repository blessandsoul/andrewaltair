import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const { id } = params;

        // In a real app, strict validation of 'id' and body 'type'

        const { type } = await req.json();
        const increment = type === 'unlike' ? -1 : 1;

        const post = await Post.findByIdAndUpdate(
            id,
            { $inc: { "reactions.like": increment } },
            { new: true }
        );

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            reactions: post.reactions
        });
    } catch (error) {
        console.error("Error updating reaction:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

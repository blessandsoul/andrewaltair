import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

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
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Invalid reaction type', 400);
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
            return apiError(ERROR_CODES.POST_NOT_FOUND, 'Post not found', 404);
        }

        // Ensure no negative values
        if (post.reactions[type] < 0) {
            await Post.findByIdAndUpdate(id, { $set: { [updateField]: 0 } });
            post.reactions[type] = 0;
        }

        return apiSuccess({
            reactions: post.reactions,
            type,
            newCount: post.reactions[type]
        }, 'Reaction updated');
    } catch (error) {
        console.error("Error updating reaction:", error);
        return apiError(ERROR_CODES.POST_UPDATE_FAILED, 'Failed to update reaction', 500);
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
            return apiError(ERROR_CODES.POST_NOT_FOUND, 'Post not found', 404);
        }

        return apiSuccess({ reactions: post.reactions }, 'Reactions fetched');
    } catch (error) {
        console.error("Error fetching reactions:", error);
        return apiError(ERROR_CODES.POST_FETCH_FAILED, 'Failed to fetch reactions', 500);
    }
}

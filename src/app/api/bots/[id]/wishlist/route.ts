import { NextRequest } from "next/server";
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/server-auth";
import mongoose from "mongoose";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// POST - Toggle Wishlist
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Unauthorized', 401);
        }

        await dbConnect();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return apiError(ERROR_CODES.BAD_REQUEST, 'Invalid bot ID', 400);
        }

        const isWishlisted = user.wishlist?.includes(new mongoose.Types.ObjectId(id));

        let updatedUser;
        if (isWishlisted) {
            updatedUser = await User.findByIdAndUpdate(
                user._id,
                { $pull: { wishlist: id } },
                { new: true }
            );
        } else {
            updatedUser = await User.findByIdAndUpdate(
                user._id,
                { $addToSet: { wishlist: id } },
                { new: true }
            );
        }

        return apiSuccess(
            { isWishlisted: !isWishlisted },
            isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist'
        );

    } catch (error) {
        console.error("Wishlist toggle error:", error);
        return apiError(ERROR_CODES.BOT_UPDATE_FAILED, 'Failed to update wishlist', 500);
    }
}

// GET - Check if wishlisted
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return apiSuccess({ isWishlisted: false });
        }

        await dbConnect();
        const { id } = await params;

        // Reload user to get fresh wishlist
        const freshUser = await User.findById(user._id).select('wishlist');
        const isWishlisted = freshUser?.wishlist?.includes(new mongoose.Types.ObjectId(id)) || false;

        return apiSuccess({ isWishlisted });
    } catch (error) {
        return apiSuccess({ isWishlisted: false });
    }
}

import { NextRequest, NextResponse } from "next/server";
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
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid bot ID" }, { status: 400 });
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

        return NextResponse.json({
            isWishlisted: !isWishlisted,
            message: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist"
        });

    } catch (error) {
        console.error("Wishlist toggle error:", error);
        return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
    }
}

// GET - Check if wishlisted
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ isWishlisted: false });
        }

        await dbConnect();
        const { id } = await params;

        // Reload user to get fresh wishlist
        const freshUser = await User.findById(user._id).select('wishlist');
        const isWishlisted = freshUser?.wishlist?.includes(new mongoose.Types.ObjectId(id)) || false;

        return NextResponse.json({ isWishlisted });
    } catch (error) {
        return NextResponse.json({ isWishlisted: false });
    }
}

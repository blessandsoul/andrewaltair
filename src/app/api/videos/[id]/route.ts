import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Video from '@/models/Video';
import mongoose from 'mongoose';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get a single video by ID or youtubeId
export async function GET(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();

        const { id } = await params;

        let video;

        // Check if id is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            video = await Video.findById(id).lean();
        }

        // If not found by ID, try youtubeId
        if (!video) {
            video = await Video.findOne({ youtubeId: id }).lean();
        }

        if (!video) {
            return NextResponse.json(
                { error: 'Video not found' },
                { status: 404 }
            );
        }

        // Increment views
        await Video.findByIdAndUpdate(video._id, { $inc: { views: 1 } });

        return NextResponse.json({
            video: {
                ...video,
                id: video._id.toString(),
                views: video.views + 1,
            },
        });
    } catch (error) {
        console.error('Get video error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch video' },
            { status: 500 }
        );
    }
}

// PUT - Update a video
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();

        const { id } = await params;
        const data = await request.json();

        // Remove id from data if present
        delete data.id;
        delete data._id;

        const video = await Video.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).lean();

        if (!video) {
            return NextResponse.json(
                { error: 'Video not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            video: {
                ...video,
                id: video._id.toString(),
            },
        });
    } catch (error) {
        console.error('Update video error:', error);
        return NextResponse.json(
            { error: 'Failed to update video' },
            { status: 500 }
        );
    }
}

// DELETE - Delete a video
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();

        const { id } = await params;

        const video = await Video.findByIdAndDelete(id);

        if (!video) {
            return NextResponse.json(
                { error: 'Video not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Video deleted successfully',
        });
    } catch (error) {
        console.error('Delete video error:', error);
        return NextResponse.json(
            { error: 'Failed to delete video' },
            { status: 500 }
        );
    }
}

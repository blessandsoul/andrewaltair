import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tool from '@/models/Tool';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const toolId = params.id;

        // Increment views count
        const tool = await Tool.findByIdAndUpdate(
            toolId,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!tool) {
            return NextResponse.json(
                { error: 'Tool not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            views: tool.views
        });
    } catch (error) {
        console.error('Increment views error:', error);
        return NextResponse.json(
            { error: 'Failed to increment views' },
            { status: 500 }
        );
    }
}

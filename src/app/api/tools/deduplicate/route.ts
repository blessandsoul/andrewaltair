export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tool from '@/models/Tool';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        console.log('🔍 Starting deduplication process...');

        // Get all tools
        const allTools = await Tool.find({}).lean();
        console.log(`📊 Total tools in database: ${allTools.length}`);

        // Find duplicates by name (case-insensitive)
        const seen = new Map();
        const duplicateIds: string[] = [];

        for (const tool of allTools) {
            const key = tool.name.toLowerCase().trim();

            if (seen.has(key)) {
                // This is a duplicate - mark for deletion
                duplicateIds.push(tool._id.toString());
                console.log(`🔄 Duplicate found: ${tool.name}`);
            } else {
                seen.set(key, tool);
            }
        }

        console.log(`🗑️ Found ${duplicateIds.length} duplicates to remove`);

        // Delete all duplicates
        if (duplicateIds.length > 0) {
            const result = await Tool.deleteMany({ _id: { $in: duplicateIds } });
            console.log(`✅ Deleted ${result.deletedCount} duplicate tools`);
        }

        const finalCount = await Tool.countDocuments();

        return NextResponse.json({
            success: true,
            message: 'Deduplication completed',
            stats: {
                before: allTools.length,
                duplicatesRemoved: duplicateIds.length,
                after: finalCount,
            }
        });
    } catch (error) {
        console.error('Deduplication error:', error);
        return NextResponse.json(
            { error: 'Failed to deduplicate tools' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // Get all tools
        const allTools = await Tool.find({}).lean();

        // Find duplicates by name (case-insensitive)
        const nameCount = new Map();

        for (const tool of allTools) {
            const key = tool.name.toLowerCase().trim();
            nameCount.set(key, (nameCount.get(key) || 0) + 1);
        }

        const duplicates = Array.from(nameCount.entries())
            .filter(([_, count]) => count > 1)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        return NextResponse.json({
            totalTools: allTools.length,
            uniqueNames: nameCount.size,
            duplicateCount: allTools.length - nameCount.size,
            duplicates: duplicates.slice(0, 50),
        });
    } catch (error) {
        console.error('Error checking duplicates:', error);
        return NextResponse.json(
            { error: 'Failed to check duplicates' },
            { status: 500 }
        );
    }
}


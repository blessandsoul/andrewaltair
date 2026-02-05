export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Tool from '@/models/Tool';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        // console.log('🔍 Starting deduplication process...');

        // Get all tools
        const allTools = await Tool.find({}).lean();
        // console.log(`📊 Total tools in database: ${allTools.length}`);

        // Find duplicates by name (case-insensitive)
        const seen = new Map();
        const duplicateIds: string[] = [];

        for (const tool of allTools) {
            const key = tool.name.toLowerCase().trim();

            if (seen.has(key)) {
                // This is a duplicate - mark for deletion
                duplicateIds.push(tool._id.toString());
                // console.log(`🔄 Duplicate found: ${tool.name}`);
            } else {
                seen.set(key, tool);
            }
        }

        // console.log(`🗑️ Found ${duplicateIds.length} duplicates to remove`);

        // Delete all duplicates
        if (duplicateIds.length > 0) {
            const result = await Tool.deleteMany({ _id: { $in: duplicateIds } });
            // console.log(`✅ Deleted ${result.deletedCount} duplicate tools`);
        }

        const finalCount = await Tool.countDocuments();

        return apiSuccess({
            stats: {
                before: allTools.length,
                duplicatesRemoved: duplicateIds.length,
                after: finalCount,
            }
        }, 'Deduplication completed');
    } catch (error) {
        console.error('Deduplication error:', error);
        return apiError(ERROR_CODES.TOOL_FETCH_FAILED, 'Failed to deduplicate tools', 500);
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

        return apiSuccess({
            totalTools: allTools.length,
            uniqueNames: nameCount.size,
            duplicateCount: allTools.length - nameCount.size,
            duplicates: duplicates.slice(0, 50),
        }, 'Duplicate check completed');
    } catch (error) {
        console.error('Error checking duplicates:', error);
        return apiError(ERROR_CODES.TOOL_FETCH_FAILED, 'Failed to check duplicates', 500);
    }
}


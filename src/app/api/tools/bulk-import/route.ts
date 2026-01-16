export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tool from '@/models/Tool';
import newTools1 from '@/data/new-tools.json';
import newTools2 from '@/data/new-tools-2.json';
import newTools3 from '@/data/new-tools-3.json';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        // Combine all new tools
        const allNewTools = [...newTools1, ...newTools2, ...newTools3];

        console.log(`📦 Starting bulk import of ${allNewTools.length} tools...`);

        let imported = 0;
        let skipped = 0;
        let errors = 0;

        for (const tool of allNewTools) {
            try {
                // Check if tool already exists by name
                const existing = await Tool.findOne({ name: tool.name });
                
                if (existing) {
                    console.log(`⏭️  Skipping ${tool.name} - already exists`);
                    skipped++;
                    continue;
                }

                // Generate unique toolId
                const timestamp = Date.now();
                const random = Math.random().toString(36).substring(2, 9);
                const uniqueToolId = `${tool.id || `tool-${timestamp}-${random}`}`;

                // Create new tool
                await Tool.create({
                    toolId: uniqueToolId,
                    name: tool.name,
                    description: tool.description,
                    url: tool.url,
                    logo: tool.logo,
                    category: tool.category,
                    pricing: tool.pricing,
                    rating: tool.rating,
                    featured: tool.featured || false,
                    views: 0,
                    clicks: 0,
                    bookmarks: 0,
                });

                console.log(`✅ Imported ${tool.name}`);
                imported++;
            } catch (error) {
                console.error(`❌ Error importing ${tool.name}:`, error);
                errors++;
            }
        }

        const total = await Tool.countDocuments();

        return NextResponse.json({
            success: true,
            message: `Bulk import completed`,
            stats: {
                attempted: allNewTools.length,
                imported,
                skipped,
                errors,
                totalInDatabase: total,
            }
        });
    } catch (error) {
        console.error('Bulk import error:', error);
        return NextResponse.json(
            { error: 'Failed to import tools' },
            { status: 500 }
        );
    }
}


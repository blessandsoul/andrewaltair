// Add new tools script - run with: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/add-new-tools.ts

import mongoose from 'mongoose';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://andr3waltair:4wAfUCxaaepTKC8T@andrew.swnob77.mongodb.net/andrewaltair?retryWrites=true&w=majority';

// Import new tools
import newTools1 from '../src/data/new-tools.json';
import newTools2 from '../src/data/new-tools-2.json';
import newTools3 from '../src/data/new-tools-3.json';

async function addNewTools() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db!;

        // Combine all new tools
        const allNewTools = [...newTools1, ...newTools2, ...newTools3];
        console.log(`📦 Processing ${allNewTools.length} new tools...`);

        let added = 0;
        let skipped = 0;

        for (const tool of allNewTools) {
            // Check if tool already exists by name
            const existing = await db.collection('tools').findOne({ name: tool.name });
            
            if (existing) {
                console.log(`⏭️  Skipping ${tool.name} - already exists`);
                skipped++;
                continue;
            }

            // Generate unique toolId
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 9);
            const uniqueToolId = `${tool.id || `tool-${timestamp}-${random}`}`;

            // Add new tool
            await db.collection('tools').insertOne({
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
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            console.log(`✅ Added ${tool.name}`);
            added++;

            // Small delay to avoid overwhelming the database
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        const total = await db.collection('tools').countDocuments();

        console.log('');
        console.log('🎉 Import complete!');
        console.log('');
        console.log(`📊 Statistics:`);
        console.log(`  ✅ Added: ${added}`);
        console.log(`  ⏭️  Skipped: ${skipped}`);
        console.log(`  📦 Total in database: ${total}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Import error:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

addNewTools();

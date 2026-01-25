
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Post from '../models/Post';

// 1. Load Environment Variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is missing in .env.local');
    process.exit(1);
}

async function checkLinks() {
    console.log('🚀 Starting Link Check...');

    try {
        if (!mongoose.connection.readyState) {
            await mongoose.connect(MONGODB_URI as string);
            console.log('✅ Connected to MongoDB');
        }

        // 2. Find Posts with Broken Links
        // We look for: 'andrewaltair.ge/tag/' OR 'encyclopedia?q='
        // In fields: content, sections.content

        const regex1 = /andrewaltair\.ge\/tag\//;
        const regex2 = /encyclopedia\?q=/;

        const posts = await Post.find({
            $or: [
                { content: { $regex: regex1 } },
                { content: { $regex: regex2 } },
                { "sections.content": { $regex: regex1 } },
                { "sections.content": { $regex: regex2 } }
            ]
        });

        console.log(`\n🔍 Found ${posts.length} posts with potential broken links.\n`);

        let brokenCount = 0;

        for (const post of posts) {
            let hasIssues = false;
            const issues: string[] = [];

            // Check Content
            if (post.content && (post.content.match(regex1) || post.content.match(regex2))) {
                hasIssues = true;
                issues.push('Main Content');
            }

            // Check Sections
            if (post.sections && post.sections.length > 0) {
                post.sections.forEach((sec: any, idx: number) => {
                    if (sec.content && (sec.content.match(regex1) || sec.content.match(regex2))) {
                        hasIssues = true;
                        issues.push(`Section ${idx} (${sec.type}): ${sec.content.substring(0, 50)}...`);
                    }
                });
            }

            if (hasIssues) {
                brokenCount++;
                console.log(`❌ [BROKEN] Slug: ${post.slug}`);
                console.log(`   ID: ${post._id}`);
                console.log(`   Issues found in: ${issues.join(', ')}`);
                console.log('---------------------------------------------------');
            }
        }

        if (brokenCount === 0) {
            console.log('✨ No broken links found! All clean.');
        } else {
            console.log(`\n⚠️ Total Broken Posts: ${brokenCount}`);
        }

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error checking links:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

checkLinks();


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

async function fixLinks() {
    console.log('🚀 Starting Link Fixer...');

    try {
        if (!mongoose.connection.readyState) {
            await mongoose.connect(MONGODB_URI as string);
            console.log('✅ Connected to MongoDB');
        }

        const regexOld = /andrewaltair\.ge\/tag\//g;
        const regexEncyclopedia = /encyclopedia\?q=/g;
        const replacement = 'andrewaltair.ge/blog?tag=';
        const replacementEnc = 'blog?tag=';

        const posts = await Post.find({
            $or: [
                { content: { $regex: /andrewaltair\.ge\/tag\// } },
                { content: { $regex: /encyclopedia\?q=/ } },
                { "sections.content": { $regex: /andrewaltair\.ge\/tag\// } },
                { "sections.content": { $regex: /encyclopedia\?q=/ } }
            ]
        });

        console.log(`\n🔍 Found ${posts.length} posts to fix.\n`);

        for (const post of posts) {
            let modified = false;

            // Fix Content
            if (post.content) {
                if (post.content.match(regexOld)) {
                    post.content = post.content.replace(regexOld, replacement);
                    modified = true;
                }
                if (post.content.match(regexEncyclopedia)) {
                    post.content = post.content.replace(regexEncyclopedia, replacementEnc);
                    modified = true;
                }
            }

            // Fix Sections
            if (post.sections && post.sections.length > 0) {
                post.sections.forEach((sec: any) => {
                    if (sec.content) {
                        if (sec.content.match(regexOld)) {
                            sec.content = sec.content.replace(regexOld, replacement);
                            modified = true;
                        }
                        if (sec.content.match(regexEncyclopedia)) {
                            sec.content = sec.content.replace(regexEncyclopedia, replacementEnc);
                            modified = true;
                        }
                    }
                });
                post.markModified('sections');
            }

            if (modified) {
                await post.save();
                console.log(`✅ FIXED Post: ${post.slug}`);
            } else {
                console.log(`⚠️ Post ${post.slug} matched query but no replacement made (check regex).`);
            }
        }

        console.log('\n🎉 Fix Complete!');
        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error fixing links:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

fixLinks();

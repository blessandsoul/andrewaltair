
// Simulation of the check since I cannot fetch localhost directly in this env without running server
// Use this to manually check if needed.

import Post from '@/models/Post';
import dbConnect from '@/lib/db';

async function verifySorting() {
    await dbConnect();
    const posts = await Post.find({}).sort({ publishedAt: -1 }).limit(5).lean();
    console.log('Posts sorted by date desc:');
    posts.forEach(p => console.log(`${p.title} - ${p.publishedAt}`));
}

verifySorting().catch(console.error);

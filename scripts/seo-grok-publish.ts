#!/usr/bin/env node
/**
 * Flip the 2 Grok cluster drafts to status='published' and bump publishedAt.
 * Run once after seo-grok-cluster.ts has inserted them as drafts.
 *
 *   npx tsx scripts/seo-grok-publish.ts
 */
import { config as dotenvConfig } from 'dotenv';
import path from 'path';
dotenvConfig({ path: path.resolve(process.cwd(), '.env.local') });
dotenvConfig();
import mongoose from 'mongoose';
import Post from '../src/models/Post';

const SLUGS = [
    'grokis-akhali-shesadzleblobebi-2026',
    'grok-vs-claude-vs-chatgpt-shedareba',
];

async function main() {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI not set');
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI, { family: 4, serverSelectionTimeoutMS: 5000 });
    console.log('Connected.');

    for (const slug of SLUGS) {
        const r = await Post.findOneAndUpdate(
            { slug },
            { $set: { status: 'published', publishedAt: new Date() } },
            { new: true }
        );
        if (!r) {
            console.log(`[skip] ${slug} — not found`);
            continue;
        }
        console.log(`[publish] ${slug} → status=${r.status} publishedAt=${r.publishedAt?.toISOString()}`);
    }

    await mongoose.disconnect();
    console.log('Done.');
}

main().catch((e) => {
    console.error('FATAL', e);
    process.exit(1);
});

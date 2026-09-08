import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function stripHash(str?: string): string | undefined {
    if (!str) return str;
    return str.replace(/^#+\s*/, '').trim();
}

async function run() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('No MONGODB_URI found in env');
        process.exit(1);
    }
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    if (!db) {
        console.error('No db instance');
        process.exit(1);
    }
    const col = db.collection('insights');

    const docs = await col.find({
        $or: [
            { sourceTitle: { $regex: '^#+\\s*' } },
            { title: { $regex: '^#+\\s*' } },
            { 'seo.metaTitle': { $regex: '^#+\\s*' } },
            { content: { $regex: '^#+\\s*' } },
            { excerpt: { $regex: '^#+\\s*' } },
        ]
    }).toArray();

    console.log(`Found ${docs.length} insights with leading # in MongoDB`);

    let updatedCount = 0;
    for (const doc of docs) {
        const updateFields: Record<string, any> = {};

        if (doc.sourceTitle && /^#+\s*/.test(doc.sourceTitle)) {
            updateFields.sourceTitle = stripHash(doc.sourceTitle);
        }
        if (doc.title && /^#+\s*/.test(doc.title)) {
            updateFields.title = stripHash(doc.title);
        }
        if (doc.seo?.metaTitle && /^#+\s*/.test(doc.seo.metaTitle)) {
            updateFields['seo.metaTitle'] = stripHash(doc.seo.metaTitle);
        }
        if (doc.content && /^#+\s*/.test(doc.content)) {
            updateFields.content = doc.content.replace(/^#+\s*/, '');
        }
        if (doc.excerpt && /^#+\s*/.test(doc.excerpt)) {
            updateFields.excerpt = stripHash(doc.excerpt);
        }

        if (Object.keys(updateFields).length > 0) {
            await col.updateOne({ _id: doc._id }, { $set: updateFields });
            updatedCount++;
            console.log(`Cleaned [${doc.slug}]:`, Object.keys(updateFields).join(', '));
        }
    }

    console.log(`Finished: successfully cleaned ${updatedCount} documents in MongoDB.`);
    await mongoose.disconnect();
}

run().catch(console.error);

// Find remaining version 1 articles
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || '';

const articleSchema = new mongoose.Schema({
    slug: String,
    title: String,
    content: String,
    version: Number,
}, { timestamps: true });

const Article = mongoose.models.EncyclopediaArticle || mongoose.model('EncyclopediaArticle', articleSchema, 'encyclopediaarticles');

async function findMissing() {
    await mongoose.connect(MONGODB_URI);

    // Find articles that don't have version 2 (or are missing version field)
    const missing = await Article.find({
        $or: [
            { version: { $ne: 2 } },
            { version: { $exists: false } }
        ]
    }, { slug: 1, title: 1 }).lean();

    console.log('Missing Premium Content:', JSON.stringify(missing, null, 2));
    await mongoose.disconnect();
}

findMissing().catch(console.error);

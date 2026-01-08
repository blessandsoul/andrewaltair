// Query all articles to get slugs
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || '';

const articleSchema = new mongoose.Schema({
    slug: String,
    title: String,
    content: String,
}, { timestamps: true });

const Article = mongoose.models.EncyclopediaArticle || mongoose.model('EncyclopediaArticle', articleSchema, 'encyclopediaarticles');

async function listArticles() {
    await mongoose.connect(MONGODB_URI);
    const articles = await Article.find({}, { slug: 1, title: 1, _id: 0 }).lean();
    console.log(JSON.stringify(articles, null, 2));
    await mongoose.disconnect();
}

listArticles().catch(console.error);

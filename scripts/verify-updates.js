
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const articleSchema = new mongoose.Schema({
    slug: String,
    title: String,
    version: Number,
    content: String
}, { timestamps: true });

const Article = mongoose.models.EncyclopediaArticle || mongoose.model('EncyclopediaArticle', articleSchema, 'encyclopediaarticles');

async function verify() {
    await mongoose.connect(MONGODB_URI);
    const articles = await Article.find({
        slug: { $in: ['system-prompts', 'prompt-templates'] }
    }).lean();

    articles.forEach(a => {
        console.log(`\nID: ${a._id}`);
        console.log(`Slug: ${a.slug}`);
        console.log(`Updated At: ${a.updatedAt}`);
        console.log(`Content length: ${a.content ? a.content.length : 0}`);
        console.log(`First 50 chars: ${a.content ? a.content.substring(0, 50) : 'N/A'}`);
    });

    await mongoose.disconnect();
}

verify().catch(console.error);

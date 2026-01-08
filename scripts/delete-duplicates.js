
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const articleSchema = new mongoose.Schema({
    slug: String,
    title: String,
}, { timestamps: true });

const Article = mongoose.models.EncyclopediaArticle || mongoose.model('EncyclopediaArticle', articleSchema, 'encyclopediaarticles');

const IDS_TO_DELETE = [
    '695f80879fa8d4b860abdf88', // Old system-prompts
    '695f80879fa8d4b860abdf86'  // Old prompt-templates
];

async function cleanup() {
    await mongoose.connect(MONGODB_URI);

    for (const id of IDS_TO_DELETE) {
        const res = await Article.findByIdAndDelete(id);
        if (res) {
            console.log(`✅ Deleted old duplicate: ${id} (${res.slug})`);
        } else {
            console.log(`⚠️ ID not found (already deleted?): ${id}`);
        }
    }

    await mongoose.disconnect();
}

cleanup().catch(console.error);

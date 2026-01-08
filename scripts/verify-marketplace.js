const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const promptSchema = new mongoose.Schema({
    title: String,
    slug: String,
    category: String,
    price: Number,
    isFree: Boolean,
}, { timestamps: true });

const Prompt = mongoose.models.MarketplacePrompt || mongoose.model('MarketplacePrompt', promptSchema, 'marketplaceprompts');

async function verify() {
    await mongoose.connect(MONGODB_URI);

    const prompts = await Prompt.find({}).lean();

    console.log(`\n📊 Total Prompts: ${prompts.length}\n`);

    const byCategory = {};
    prompts.forEach(p => {
        if (!byCategory[p.category]) byCategory[p.category] = [];
        byCategory[p.category].push({ title: p.title, price: p.isFree ? 'FREE' : `$${p.price}` });
    });

    Object.keys(byCategory).forEach(cat => {
        console.log(`\n🏷️ ${cat} (${byCategory[cat].length}):`);
        byCategory[cat].forEach(p => console.log(`   - ${p.title} [${p.price}]`));
    });

    await mongoose.disconnect();
}

verify().catch(console.error);

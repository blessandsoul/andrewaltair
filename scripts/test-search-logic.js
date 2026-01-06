
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Schema } = mongoose;

dotenv.config({ path: '.env.local' });

// Define minimal schema matching the app
const PostSchema = new Schema({
    title: String,
    slug: String,
    excerpt: String,
    content: String,
    tags: [String],
    numericId: String,
    status: String,
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

async function testSearch(query) {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI not found');
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI);

        const regex = new RegExp(query, "i");

        console.log(`Searching for query: "${query}"`);

        const posts = await Post.find({
            status: "published",
            $or: [
                { title: regex },
                { excerpt: regex },
                { content: regex },
                { tags: regex },
                { numericId: { $regex: `^${query}`, $options: 'i' } }
            ]
        })
            .select("title numericId slug")
            .lean();

        console.log(`Found ${posts.length} posts`);
        posts.forEach(p => console.log(`- [${p.numericId}] ${p.title} (${p.slug})`));

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

testSearch('182872');

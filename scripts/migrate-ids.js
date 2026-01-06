
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

// Define minimal Post schema for this script
const PostSchema = new mongoose.Schema({
    numericId: { type: String, unique: true, sparse: true },
    title: { type: String }
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

async function generateUniqueId() {
    let id;
    let exists = true;
    while (exists) {
        id = Math.floor(100000 + Math.random() * 900000).toString();
        exists = await Post.findOne({ numericId: id });
    }
    return id;
}

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const posts = await Post.find({ numericId: { $exists: false } });
        console.log(`Found ${posts.length} posts without numericId`);

        for (const post of posts) {
            const newId = await generateUniqueId();
            post.numericId = newId;
            await post.save();
            console.log(`Updated post "${post.title}" with ID: ${newId}`);
        }

        console.log('Migration complete');
    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();

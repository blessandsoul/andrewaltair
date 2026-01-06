
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Schema } = mongoose;

dotenv.config({ path: '.env.local' });

const PostSchema = new Schema({
    title: String,
    slug: String,
    numericId: String,
    status: String,
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

async function checkPost() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI not found');
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI);
        const post = await Post.findOne({ numericId: '182872' });
        if (post) {
            console.log('Status:', post.status);
            console.log('NumericId:', post.numericId);
        } else {
            console.log('Not found');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

checkPost();

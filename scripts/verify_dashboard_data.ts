
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

// Define schemas locally to avoid import issues if paths are aliased
const ReactionsSchema = new mongoose.Schema(
    {
        fire: { type: Number, default: 0 },
        love: { type: Number, default: 0 },
        mindblown: { type: Number, default: 0 },
        applause: { type: Number, default: 0 },
        insightful: { type: Number, default: 0 },
    },
    { _id: false }
);

const PostSchema = new mongoose.Schema(
    {
        status: { type: String, default: 'draft' },
        views: { type: Number, default: 0 },
        reactions: { type: ReactionsSchema, default: {} },
        categories: [String],
        trending: { type: Boolean, default: false },
        featured: { type: Boolean, default: false },
    },
    { collection: 'posts' } // Use explicit collection name if known, usually lowercase plural
);

const VideoSchema = new mongoose.Schema(
    {
        type: { type: String, default: 'long' },
        views: { type: Number, default: 0 },
    },
    { collection: 'videos' }
);

const Post = mongoose.model('Post', PostSchema);
const Video = mongoose.model('Video', VideoSchema);

async function verifyData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected!');

        // 1. Posts
        const totalPosts = await Post.countDocuments();
        const publishedPosts = await Post.countDocuments({ status: 'published' });
        const draftPosts = await Post.countDocuments({ status: 'draft' });
        const scheduledPosts = await Post.countDocuments({ status: 'scheduled' });
        const archivedPosts = await Post.countDocuments({ status: 'archived' });
        const featuredPosts = await Post.countDocuments({ featured: true });

        // 2. Videos
        const totalVideos = await Video.countDocuments();
        const shortVideos = await Video.countDocuments({ type: 'short' });
        const longVideos = await Video.countDocuments({ type: 'long' });

        // 3. Views
        // Sum views from Posts
        const postViewsResult = await Post.aggregate([
            { $group: { _id: null, totalViews: { $sum: '$views' } } }
        ]);
        const postViews = postViewsResult.length > 0 ? postViewsResult[0].totalViews : 0;

        // Sum views from Videos
        const videoViewsResult = await Video.aggregate([
            { $group: { _id: null, totalViews: { $sum: '$views' } } }
        ]);
        const videoViews = videoViewsResult.length > 0 ? videoViewsResult[0].totalViews : 0;

        const totalViews = postViews + videoViews;

        // 4. Reactions
        // Sum all reactions from Posts
        const reactionsResult = await Post.aggregate([
            {
                $group: {
                    _id: null,
                    totalFire: { $sum: '$reactions.fire' },
                    totalLove: { $sum: '$reactions.love' },
                    totalMindblown: { $sum: '$reactions.mindblown' },
                    totalApplause: { $sum: '$reactions.applause' },
                    totalInsightful: { $sum: '$reactions.insightful' }
                }
            }
        ]);

        let totalReactions = 0;
        if (reactionsResult.length > 0) {
            const r = reactionsResult[0];
            totalReactions = (r.totalFire || 0) + (r.totalLove || 0) + (r.totalMindblown || 0) + (r.totalApplause || 0) + (r.totalInsightful || 0);
        }

        // 5. Trending
        const trendingPosts = await Post.countDocuments({ trending: true });


        console.log('\n--- VERIFICATION RESULTS ---');
        console.log(`\nPOSTS:`);
        console.log(`Total: ${totalPosts}`);
        console.log(`Published: ${publishedPosts}`);
        console.log(`Drafts: ${draftPosts}`);
        console.log(`Featured: ${featuredPosts}`);

        console.log(`\nVIDEOS:`);
        console.log(`Total: ${totalVideos}`);
        console.log(`Shorts: ${shortVideos}`);
        console.log(`Long: ${longVideos}`);

        console.log(`\nVIEWS:`);
        console.log(`Total: ${totalViews}`);
        console.log(`From Posts: ${postViews}`);
        console.log(`From Videos: ${videoViews}`);

        console.log(`\nREACTIONS:`);
        console.log(`Total: ${totalReactions}`);
        console.log(`Trending Posts: ${trendingPosts}`);


    } catch (error) {
        console.error('Error during verification:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB.');
    }
}

verifyData();

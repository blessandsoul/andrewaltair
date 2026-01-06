// Seed script - run with: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed.ts
// Or add to package.json: "seed": "ts-node scripts/seed.ts"

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://andr3waltair:4wAfUCxaaepTKC8T@andrew.swnob77.mongodb.net/andrewaltair?retryWrites=true&w=majority';

// Import data from JSON files
import postsData from '../src/data/posts.json';
import videosData from '../src/data/videos.json';
import toolsData from '../src/data/tools.json';
import newTools1 from '../src/data/new-tools.json';
import newTools2 from '../src/data/new-tools-2.json';
import newTools3 from '../src/data/new-tools-3.json';

async function seed() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db!;

        // Clear existing data
        console.log('🗑️ Clearing existing data...');
        await db.collection('users').deleteMany({});
        await db.collection('posts').deleteMany({});
        await db.collection('videos').deleteMany({});

        // Create users
        console.log('👤 Creating users...');
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'change-me-immediately', 10);

        await db.collection('users').insertMany([
            {
                username: 'andrew',
                email: 'andrew@altair.ge',
                password: hashedPassword,
                fullName: 'Andrew Altair',
                avatar: '/avatars/andrew.jpg',
                role: 'god',
                badge: '👑 საიტის შემქმნელი',
                isBlocked: false,
                twoFactorEnabled: false,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date(),
            },
            {
                username: 'editor',
                email: 'editor@example.com',
                password: await bcrypt.hash('editor123', 10),
                fullName: 'Editor User',
                role: 'editor',
                isBlocked: false,
                twoFactorEnabled: false,
                createdAt: new Date('2024-06-15'),
                updatedAt: new Date(),
            },
            {
                username: 'viewer',
                email: 'viewer@example.com',
                password: await bcrypt.hash('viewer123', 10),
                fullName: 'Viewer User',
                role: 'viewer',
                isBlocked: false,
                twoFactorEnabled: false,
                createdAt: new Date('2024-12-01'),
                updatedAt: new Date(),
            }
        ]);
        console.log('✅ Created 3 users');

        // Create posts from JSON data
        console.log('📝 Creating posts...');
        const posts = postsData.map(post => ({
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: '',
            coverImage: post.coverImage,
            category: post.category,
            tags: post.tags,
            author: post.author,
            publishedAt: new Date(post.publishedAt),
            readingTime: post.readingTime,
            views: post.views,
            comments: post.comments || 0,
            shares: post.shares || 0,
            reactions: post.reactions,
            featured: post.featured || false,
            trending: post.trending || false,
            status: post.status || 'published',
            scheduledFor: post.scheduledFor ? new Date(post.scheduledFor) : null,
            order: post.order || 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        await db.collection('posts').insertMany(posts);
        console.log(`✅ Created ${posts.length} posts`);

        // Create videos from JSON data
        console.log('🎬 Creating videos...');
        const videos = videosData.map(video => ({
            title: video.title,
            description: video.description,
            youtubeId: video.youtubeId,
            category: video.category,
            publishedAt: new Date(video.publishedAt),
            views: video.views,
            duration: video.duration,
            type: video.type,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        await db.collection('videos').insertMany(videos);
        console.log(`✅ Created ${videos.length} videos`);

        // Create indexes
        console.log('📇 Creating indexes...');
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        await db.collection('users').createIndex({ username: 1 }, { unique: true });
        await db.collection('posts').createIndex({ slug: 1 }, { unique: true });
        await db.collection('posts').createIndex({ category: 1 });
        await db.collection('posts').createIndex({ status: 1 });
        await db.collection('videos').createIndex({ category: 1 });
        await db.collection('videos').createIndex({ type: 1 });
        console.log('✅ Indexes created');

        console.log('');
        console.log('🎉 Seed complete!');
        console.log('');
        console.log('You can now login with username: andrew');
        console.log('Password is set from ADMIN_PASSWORD environment variable');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

seed();

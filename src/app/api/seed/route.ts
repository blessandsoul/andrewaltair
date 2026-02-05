export const dynamic = 'force-dynamic'
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Post from '@/models/Post';
import Video from '@/models/Video';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// Import data
import postsData from '@/data/posts.json';
import videosData from '@/data/videos.json';

// POST - Run seed (protected by secret)
export async function POST(request: Request) {
    try {
        // 🛡️ SECURITY: Disable in production
        if (process.env.NODE_ENV === 'production') {
            return apiError(ERROR_CODES.FORBIDDEN, 'Seed disabled in production', 403);
        }

        const { secret } = await request.json();

        // 🛡️ SECURITY: Use env variable
        if (secret !== process.env.SEED_SECRET) {
            return apiError(ERROR_CODES.ADMIN_UNAUTHORIZED, 'Invalid seed secret', 403);
        }

        await dbConnect();

        const results = {
            users: { deleted: 0, created: 0 },
            posts: { deleted: 0, created: 0 },
            videos: { deleted: 0, created: 0 },
        };

        // Clear and seed users
        const deletedUsers = await User.deleteMany({});
        results.users.deleted = deletedUsers.deletedCount;

        const users = await User.insertMany([
            {
                username: 'andrew',
                email: 'andrew@altair.ge',
                password: await bcrypt.hash('andrew', 10),
                fullName: 'Andrew Altair',
                avatar: '/avatars/andrew.jpg',
                role: 'god',
                badge: '👑 საიტის შემქმნელი',
            },
            {
                username: 'editor',
                email: 'editor@example.com',
                password: await bcrypt.hash('editor123', 10),
                fullName: 'Editor User',
                role: 'editor',
            },
            {
                username: 'viewer',
                email: 'viewer@example.com',
                password: await bcrypt.hash('viewer123', 10),
                fullName: 'Viewer User',
                role: 'viewer',
            }
        ]);
        results.users.created = users.length;

        // Clear and seed posts
        const deletedPosts = await Post.deleteMany({});
        results.posts.deleted = deletedPosts.deletedCount;

        const posts = await Post.insertMany(
            postsData.map(post => ({
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
                scheduledFor: post.scheduledFor ? new Date(post.scheduledFor) : undefined,
                order: post.order || 0,
            }))
        );
        results.posts.created = posts.length;

        // Clear and seed videos
        const deletedVideos = await Video.deleteMany({});
        results.videos.deleted = deletedVideos.deletedCount;

        const videos = await Video.insertMany(
            videosData.map(video => ({
                title: video.title,
                description: video.description,
                youtubeId: video.youtubeId,
                category: video.category,
                publishedAt: new Date(video.publishedAt),
                views: video.views,
                duration: video.duration,
                type: video.type,
            }))
        );
        results.videos.created = videos.length;

        return apiSuccess({
            results,
            credentials: {
                message: "Check server logs or database for credentials. Not returning them in response for security."
            }
        }, 'Database seeded successfully!');
    } catch (error) {
        console.error('Seed error:', error);
        return apiError(ERROR_CODES.SEED_FAILED, 'Database seed failed', 500);
    }
}


import dbConnect from '@/lib/db';
import User from '@/models/User';
import Post from '@/models/Post';
import Comment from '@/models/Comment';

export interface UserQueryOptions {
    role?: string | null;
    search?: string | null;
    page?: number;
    limit?: number;
}

export class UserService {
    /**
     * Get User Profile (with stats)
     */
    static async getProfile(userId: string) {
        await dbConnect();

        const user = await User.findById(userId).lean();
        if (!user) return null;

        // Get user's comments
        const userComments = await Comment.find({ email: user.email })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        // Get recent posts interactions (mock-ish in original code)
        const recentPosts = await Post.find({ status: "published" })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title slug views createdAt")
            .lean();

        // Build activity log
        const activity = [
            {
                id: "login-1",
                type: "login",
                description: "სისტემაში შესვლა",
                time: new Date().toISOString(),
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...userComments.slice(0, 5).map((comment: any, i: number) => ({
                id: `comment-${i}`,
                type: "comment",
                description: `კომენტარი: "${comment.content?.substring(0, 50)}..."`,
                time: comment.createdAt,
            })),
        ];

        // Build stats
        const stats = {
            totalTimeSpent: `${Math.floor(Math.random() * 24) + 1} საათი`,
            sessionsCount: Math.floor(Math.random() * 50) + 10,
            lastActive: new Date().toISOString(),
            pagesVisited: Math.floor(Math.random() * 200) + 50,
            toolsUsed: Math.floor(Math.random() * 30) + 5,
            commentsPosted: userComments.length,
            likesGiven: Math.floor(Math.random() * 50) + 10,
            topSections: [
                { name: "ბლოგი", visits: Math.floor(Math.random() * 100) + 30 },
                { name: "ინსტრუმენტები", visits: Math.floor(Math.random() * 80) + 20 },
                { name: "ვიდეოები", visits: Math.floor(Math.random() * 60) + 15 },
            ],
        };

        // Social accounts
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userAny = user as any;
        const socialAccounts = [
            { id: "google", name: "Google", connected: !!userAny.googleId, icon: "Chrome", color: "bg-red-500" },
            { id: "facebook", name: "Facebook", connected: !!userAny.facebookId, icon: "Facebook", color: "bg-blue-600" },
            { id: "telegram", name: "Telegram", connected: !!userAny.telegramId, icon: "Send", color: "bg-sky-500" },
        ];

        // Subscriptions
        const subscriptions = [
            { id: 1, name: "ChatGPT", type: "tool", subscribed: true },
            { id: 2, name: "Midjourney", type: "tool", subscribed: true },
            { id: 3, name: "AI News", type: "topic", subscribed: true },
            { id: 4, name: "Gemini", type: "tool", subscribed: false },
        ];

        return {
            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                avatar: user.avatar,
                coverImage: user.coverImage,
                coverOffsetY: user.coverOffsetY,
                role: user.role,
                badge: user.badge,
                createdAt: user.createdAt,
            },
            activity,
            stats,
            socialAccounts,
            subscriptions,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recentPosts: recentPosts.map((p: any) => ({
                id: p._id.toString(),
                title: p.title,
                slug: p.slug,
                views: p.views,
                createdAt: p.createdAt,
            })),
        };
    }

    /**
     * Update User Profile
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async updateProfile(userId: string, data: any) {
        await dbConnect();

        const updateFields: Record<string, unknown> = {};
        if (data.fullName !== undefined) updateFields.fullName = data.fullName;
        if (data.avatar !== undefined) updateFields.avatar = data.avatar;
        if (data.coverImage !== undefined) updateFields.coverImage = data.coverImage;
        if (data.coverOffsetY !== undefined) updateFields.coverOffsetY = data.coverOffsetY;
        if (data.bio !== undefined) updateFields.bio = data.bio;
        if (data.website !== undefined) updateFields.website = data.website;
        if (data.publicProfile !== undefined) updateFields.publicProfile = data.publicProfile;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).lean();

        if (!user) return null;

        return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            avatar: user.avatar,
            coverImage: user.coverImage,
            coverOffsetY: user.coverOffsetY,
            role: user.role,
            badge: user.badge,
        };
    }

    /**
     * Get All Users (Admin)
     */
    static async getAllUsers(options: UserQueryOptions) {
        await dbConnect();

        const { role, search, page = 1, limit = 20 } = options;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { fullName: { $regex: search, $options: 'i' } },
            ];
        }

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select('username email role status lastLogin createdAt sessions fullName')
            .sort({ _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedUsers = users.map((user: any) => ({
            ...user,
            id: user._id.toString(),
            _id: undefined,
        }));

        return {
            users: transformedUsers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Create User (Admin)
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async createUser(data: any) {
        await dbConnect();

        const existingUser = await User.findOne({
            $or: [{ email: data.email }, { username: data.username }]
        });

        if (existingUser) {
            throw new Error('მომხმარებელი უკვე არსებობს');
        }

        const user = new User(data);
        await user.save();

        return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
        };
    }
}

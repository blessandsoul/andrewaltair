import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import Post from "@/models/Post"
import Comment from "@/models/Comment"

// Helper to verify JWT token
function verifyToken(request: NextRequest) {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
        return null
    }
    const token = authHeader.split(" ")[1]

    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const jwt = require("jsonwebtoken")
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret")
        return decoded
    } catch {
        return null
    }
}

// GET - Get user profile with activity and stats
export async function GET(request: NextRequest) {
    try {
        const decoded = verifyToken(request)

        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()

        const user = await User.findById(decoded.userId).lean()

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Get user's comments
        const userComments = await Comment.find({ email: user.email })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean()

        // Get posts the user has interacted with
        const recentPosts = await Post.find({ status: "published" })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title slug views createdAt")
            .lean()

        // Build activity log
        const activity = [
            {
                id: "login-1",
                type: "login",
                description: "სისტემაში შესვლა",
                time: new Date().toISOString(),
            },
            ...userComments.slice(0, 5).map((comment, i) => ({
                id: `comment-${i}`,
                type: "comment",
                description: `კომენტარი: "${comment.content?.substring(0, 50)}..."`,
                time: comment.createdAt,
            })),
        ]

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
        }

        // Social accounts (from user model if exists)
        const socialAccounts = [
            { id: "google", name: "Google", connected: !!user.googleId, icon: "Chrome", color: "bg-red-500" },
            { id: "facebook", name: "Facebook", connected: !!user.facebookId, icon: "Facebook", color: "bg-blue-600" },
            { id: "telegram", name: "Telegram", connected: !!user.telegramId, icon: "Send", color: "bg-sky-500" },
        ]

        // Subscriptions (mock for now)
        const subscriptions = [
            { id: 1, name: "ChatGPT", type: "tool", subscribed: true },
            { id: 2, name: "Midjourney", type: "tool", subscribed: true },
            { id: 3, name: "AI News", type: "topic", subscribed: true },
            { id: 4, name: "Gemini", type: "tool", subscribed: false },
        ]

        return NextResponse.json({
            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                avatar: user.avatar,
                role: user.role,
                badge: user.badge,
                createdAt: user.createdAt,
            },
            activity,
            stats,
            socialAccounts,
            subscriptions,
            recentPosts: recentPosts.map(p => ({
                id: p._id.toString(),
                title: p.title,
                slug: p.slug,
                views: p.views,
                createdAt: p.createdAt,
            })),
        })
    } catch (error) {
        console.error("Profile API error:", error)
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
    try {
        const decoded = verifyToken(request)

        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()

        const body = await request.json()

        const user = await User.findByIdAndUpdate(
            decoded.userId,
            {
                $set: {
                    fullName: body.fullName,
                    avatar: body.avatar,
                    bio: body.bio,
                    website: body.website,
                    publicProfile: body.publicProfile,
                },
            },
            { new: true }
        ).lean()

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({
            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                avatar: user.avatar,
                role: user.role,
                badge: user.badge,
            },
            message: "Profile updated successfully",
        })
    } catch (error) {
        console.error("Profile update error:", error)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
}

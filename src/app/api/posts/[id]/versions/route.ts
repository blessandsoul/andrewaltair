import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/db'
import Post from '@/models/Post'
import PostVersion from '@/models/PostVersion'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

interface RouteParams {
    params: Promise<{ id: string }>
}

// Helper to get user from token
async function getUserFromToken(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
        return null
    }
    try {
        const token = authHeader.substring(7)
        return jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    } catch {
        return null
    }
}

// GET - List all versions for a post
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect()
        const { id } = await params

        const versions = await PostVersion.find({ postId: id })
            .sort({ version: -1 })
            .lean()

        return NextResponse.json({
            versions: versions.map(v => ({
                id: v._id.toString(),
                version: v.version,
                title: v.title,
                excerpt: v.excerpt,
                changedBy: v.changedBy,
                changeReason: v.changeReason,
                createdAt: v.createdAt,
            })),
        })
    } catch (error) {
        console.error('Get versions error:', error)
        return NextResponse.json({ error: 'Failed to get versions' }, { status: 500 })
    }
}

// POST - Create a new version (snapshot current state)
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect()
        const { id } = await params

        const user = await getUserFromToken(request)
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { changeReason } = await request.json()

        const post = await Post.findById(id)
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        // Get latest version number
        const latestVersion = await PostVersion.findOne({ postId: id })
            .sort({ version: -1 })
            .select('version')
            .lean()

        const newVersionNumber = (latestVersion?.version || 0) + 1

        // Create version snapshot
        const version = await PostVersion.create({
            postId: id,
            version: newVersionNumber,
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            coverImage: post.coverImage,
            category: post.category,
            tags: post.tags,
            author: post.author,
            changedBy: {
                id: user.userId,
                name: 'User', // Would get from user lookup
            },
            changeReason,
        })

        return NextResponse.json({
            success: true,
            version: {
                id: version._id.toString(),
                version: version.version,
            },
        })
    } catch (error) {
        console.error('Create version error:', error)
        return NextResponse.json({ error: 'Failed to create version' }, { status: 500 })
    }
}

// PUT - Restore a specific version
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect()
        const { id } = await params

        const user = await getUserFromToken(request)
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { versionId } = await request.json()

        const version = await PostVersion.findById(versionId)
        if (!version || version.postId.toString() !== id) {
            return NextResponse.json({ error: 'Version not found' }, { status: 404 })
        }

        // First, save current state as a new version
        const post = await Post.findById(id)
        if (post) {
            const latestVersion = await PostVersion.findOne({ postId: id })
                .sort({ version: -1 })
                .select('version')
                .lean()

            await PostVersion.create({
                postId: id,
                version: (latestVersion?.version || 0) + 1,
                title: post.title,
                content: post.content,
                excerpt: post.excerpt,
                coverImage: post.coverImage,
                category: post.category,
                tags: post.tags,
                author: post.author,
                changedBy: {
                    id: user.userId,
                    name: 'User',
                },
                changeReason: `Auto-saved before restoring to v${version.version}`,
            })
        }

        // Restore the selected version
        await Post.findByIdAndUpdate(id, {
            title: version.title,
            content: version.content,
            excerpt: version.excerpt,
            coverImage: version.coverImage,
            category: version.category,
            tags: version.tags,
        })

        return NextResponse.json({
            success: true,
            message: `Restored to version ${version.version}`,
        })
    } catch (error) {
        console.error('Restore version error:', error)
        return NextResponse.json({ error: 'Failed to restore version' }, { status: 500 })
    }
}

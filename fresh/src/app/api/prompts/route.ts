import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Prompt from '@/models/Prompt'
import { nanoid } from 'nanoid'

// Helper to get session ID from cookies or create new
function getSessionId(request: NextRequest): string {
    const sessionId = request.cookies.get('prompt_session_id')?.value
    return sessionId || nanoid()
}

// Helper to estimate token count (rough approximation)
function estimateTokens(text: string): number {
    // Roughly 4 characters per token for English, 2 for non-Latin
    const hasNonLatin = /[^\x00-\x7F]/.test(text)
    const charsPerToken = hasNonLatin ? 2 : 4
    return Math.ceil(text.length / charsPerToken)
}

// GET - List prompts (with filters)
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') || 'history' // history, favorites, templates, gallery
        const sessionId = getSessionId(request)
        const category = searchParams.get('category')
        const search = searchParams.get('search')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const sort = searchParams.get('sort') || 'createdAt' // createdAt, likes, uses

        let query: Record<string, any> = {}

        switch (type) {
            case 'history':
                query = { sessionId, isTemplate: false }
                break
            case 'favorites':
                query = { sessionId, isFavorite: true }
                break
            case 'templates':
                query = { isTemplate: true }
                break
            case 'gallery':
                query = { isPublic: true, isTemplate: false }
                break
        }

        if (category) {
            query.category = category
        }

        if (search) {
            query.$text = { $search: search }
        }

        const sortOrder: Record<string, any> = {}
        sortOrder[sort] = sort === 'createdAt' ? -1 : -1

        const prompts = await Prompt.find(query)
            .sort(sortOrder)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const total = await Prompt.countDocuments(query)

        // Transform for response
        const data = prompts.map(p => ({
            ...p,
            id: p._id.toString(),
            _id: undefined,
        }))

        const response = NextResponse.json({
            prompts: data,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })

        // Set session cookie if new
        if (!request.cookies.get('prompt_session_id')) {
            response.cookies.set('prompt_session_id', sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 365, // 1 year
            })
        }

        return response

    } catch (error) {
        console.error('Get prompts error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch prompts' },
            { status: 500 }
        )
    }
}

// POST - Create new prompt
export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const body = await request.json()
        const sessionId = getSessionId(request)

        const {
            content,
            formData,
            title,
            description,
            category,
            tags,
            isTemplate,
            isPublic,
        } = body

        if (!content || !formData?.role || !formData?.task) {
            return NextResponse.json(
                { error: 'Content, role, and task are required' },
                { status: 400 }
            )
        }

        const tokenCount = estimateTokens(content)
        const shareToken = nanoid(10)

        const prompt = await Prompt.create({
            content,
            formData,
            sessionId,
            title,
            description,
            category,
            tags: tags || [],
            isTemplate: isTemplate || false,
            isPublic: isPublic || false,
            tokenCount,
            shareToken,
            versions: [{
                content,
                formData,
                createdAt: new Date(),
                changeNote: 'პირველი ვერსია'
            }],
        })

        const response = NextResponse.json({
            id: prompt._id.toString(),
            shareToken: prompt.shareToken,
            tokenCount,
        })

        // Set session cookie if new
        if (!request.cookies.get('prompt_session_id')) {
            response.cookies.set('prompt_session_id', sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 365,
            })
        }

        return response

    } catch (error) {
        console.error('Create prompt error:', error)
        return NextResponse.json(
            { error: 'Failed to create prompt' },
            { status: 500 }
        )
    }
}


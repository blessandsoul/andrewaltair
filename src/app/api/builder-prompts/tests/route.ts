export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import dbConnect from '@/lib/db'
import PromptTest from '@/models/PromptTest'
import Prompt from '@/models/Prompt'

// GET - List all A/B tests
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') || 'active'

        const tests = await PromptTest.find({ status })
            .populate('promptIds', 'content formData qualityScore uses')
            .sort({ createdAt: -1 })
            .lean()

        return apiSuccess({ tests }, 'Tests fetched successfully')

    } catch (error) {
        console.error('Get tests error:', error)
        return apiError(ERROR_CODES.PROMPT_FETCH_FAILED, 'Failed to fetch tests', 500)
    }
}

// POST - Create new A/B test
export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const { name, description, promptIds } = await request.json()

        if (!name || !promptIds || promptIds.length < 2) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Name and at least 2 prompts are required', 400)
        }

        // Verify all prompts exist
        const prompts = await Prompt.find({ _id: { $in: promptIds } })
        if (prompts.length !== promptIds.length) {
            return apiError(ERROR_CODES.PROMPT_NOT_FOUND, 'Some prompts not found', 404)
        }

        // Initialize results for each prompt
        const results = promptIds.map((id: string) => ({
            promptId: id,
            uses: 0,
            avgRating: 0,
            conversions: 0
        }))

        const test = await PromptTest.create({
            name,
            description,
            promptIds,
            results,
            status: 'active',
            startedAt: new Date()
        })

        return apiSuccess({
            id: test._id.toString(),
        }, 'A/B test created successfully', 201)

    } catch (error) {
        console.error('Create test error:', error)
        return apiError(ERROR_CODES.PROMPT_CREATE_FAILED, 'Failed to create test', 500)
    }
}



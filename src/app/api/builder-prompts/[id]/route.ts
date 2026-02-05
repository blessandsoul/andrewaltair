import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import dbConnect from '@/lib/db'
import Prompt from '@/models/Prompt'
import { nanoid } from 'nanoid'

interface RouteParams {
    params: Promise<{ id: string }>
}

// GET - Get single prompt
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect()
        const { id } = await params

        const prompt = await Prompt.findById(id).lean()

        if (!prompt) {
            return apiError(ERROR_CODES.PROMPT_NOT_FOUND, 'Prompt not found', 404)
        }

        // Increment views
        await Prompt.findByIdAndUpdate(id, { $inc: { views: 1 } })

        return apiSuccess({
            ...prompt,
            id: prompt._id.toString(),
            _id: undefined,
        }, 'Prompt fetched successfully')

    } catch (error) {
        console.error('Get prompt error:', error)
        return apiError(ERROR_CODES.PROMPT_FETCH_FAILED, 'Failed to fetch prompt', 500)
    }
}

// PUT - Update prompt
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect()
        const { id } = await params
        const body = await request.json()

        const sessionId = request.cookies.get('prompt_session_id')?.value

        // Check ownership
        const prompt = await Prompt.findById(id)
        if (!prompt) {
            return apiError(ERROR_CODES.PROMPT_NOT_FOUND, 'Prompt not found', 404)
        }

        if (prompt.sessionId !== sessionId && !prompt.isTemplate) {
            return apiError(ERROR_CODES.FORBIDDEN, 'Not authorized', 403)
        }

        const {
            isFavorite,
            isPublic,
            title,
            description,
            category,
            tags,
            qualityScore,
            qualityFeedback,
            translations,
            variations,
            lastTestResponse,
            content,
            formData,
        } = body

        const updateData: Record<string, any> = {}
        const pushData: Record<string, any> = {}

        // If content is being updated, save current version to history
        if (content && content !== prompt.content) {
            pushData.versions = {
                content: prompt.content,
                formData: prompt.formData,
                createdAt: new Date()
            }
            updateData.content = content
            if (formData) {
                updateData.formData = formData
            }
        }

        if (typeof isFavorite === 'boolean') updateData.isFavorite = isFavorite
        if (typeof isPublic === 'boolean') updateData.isPublic = isPublic
        if (title !== undefined) updateData.title = title
        if (description !== undefined) updateData.description = description
        if (category !== undefined) updateData.category = category
        if (tags !== undefined) updateData.tags = tags
        if (qualityScore !== undefined) updateData.qualityScore = qualityScore
        if (qualityFeedback !== undefined) updateData.qualityFeedback = qualityFeedback
        if (translations !== undefined) updateData.translations = translations
        if (variations !== undefined) updateData.variations = variations
        if (lastTestResponse !== undefined) {
            updateData.lastTestResponse = lastTestResponse
            updateData.lastTestedAt = new Date()
        }

        // Generate share token if making public
        if (isPublic && !prompt.shareToken) {
            updateData.shareToken = nanoid(10)
        }

        const updateQuery: Record<string, any> = { $set: updateData }
        if (Object.keys(pushData).length > 0) {
            updateQuery.$push = pushData
        }

        const updated = await Prompt.findByIdAndUpdate(
            id,
            updateQuery,
            { new: true, lean: true }
        )

        return apiSuccess({
            ...updated,
            id: updated._id.toString(),
            _id: undefined,
        }, 'Prompt updated successfully')

    } catch (error) {
        console.error('Update prompt error:', error)
        return apiError(ERROR_CODES.PROMPT_UPDATE_FAILED, 'Failed to update prompt', 500)
    }
}

// DELETE - Delete prompt
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect()
        const { id } = await params

        const sessionId = request.cookies.get('prompt_session_id')?.value

        // Check ownership
        const prompt = await Prompt.findById(id)
        if (!prompt) {
            return apiError(ERROR_CODES.PROMPT_NOT_FOUND, 'Prompt not found', 404)
        }

        if (prompt.sessionId !== sessionId) {
            return apiError(ERROR_CODES.FORBIDDEN, 'Not authorized', 403)
        }

        await Prompt.findByIdAndDelete(id)

        return apiSuccess(null, 'Prompt deleted successfully')

    } catch (error) {
        console.error('Delete prompt error:', error)
        return apiError(ERROR_CODES.PROMPT_DELETE_FAILED, 'Failed to delete prompt', 500)
    }
}

// PATCH - Increment counters (uses, copies, likes)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect()
        const { id } = await params
        const { action } = await request.json()

        const incrementField: Record<string, any> = {}

        switch (action) {
            case 'use':
                incrementField.uses = 1
                break
            case 'copy':
                incrementField.copies = 1
                break
            case 'like':
                incrementField.likes = 1
                break
            default:
                return apiError(ERROR_CODES.BAD_REQUEST, 'Invalid action', 400)
        }

        await Prompt.findByIdAndUpdate(id, { $inc: incrementField })

        return apiSuccess(null, 'Prompt updated successfully')

    } catch (error) {
        console.error('Patch prompt error:', error)
        return apiError(ERROR_CODES.PROMPT_UPDATE_FAILED, 'Failed to update prompt', 500)
    }
}

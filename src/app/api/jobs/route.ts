export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import dbConnect from '@/lib/db'
import ScheduledJob from '@/models/ScheduledJob'

// GET - List all jobs with filtering
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const type = searchParams.get('type')
        const limit = parseInt(searchParams.get('limit') || '50')

        const filter: Record<string, string> = {}
        if (status) filter.status = status
        if (type) filter.type = type

        const jobs = await ScheduledJob.find(filter)
            .sort({ updatedAt: -1 })
            .limit(limit)
            .lean()

        const stats = {
            total: await ScheduledJob.countDocuments(),
            pending: await ScheduledJob.countDocuments({ status: 'pending' }),
            running: await ScheduledJob.countDocuments({ status: 'running' }),
            completed: await ScheduledJob.countDocuments({ status: 'completed' }),
            failed: await ScheduledJob.countDocuments({ status: 'failed' }),
        }

        return apiSuccess({
            jobs: jobs.map(j => ({
                id: j._id.toString(),
                name: j.name,
                type: j.type,
                status: j.status,
                schedule: j.schedule,
                lastRun: j.lastRun,
                nextRun: j.nextRun,
                result: j.result,
                retryCount: j.retryCount,
                createdAt: j.createdAt,
                updatedAt: j.updatedAt,
            })),
            stats,
        }, 'Jobs fetched successfully')
    } catch (error) {
        console.error('Get jobs error:', error)
        return apiError(ERROR_CODES.JOB_FETCH_FAILED, 'Failed to get jobs', 500)
    }
}

// POST - Create a new scheduled job
export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const data = await request.json()

        if (!data.name) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Job name is required', 400)
        }

        const job = await ScheduledJob.create({
            name: data.name,
            type: data.type || 'other',
            status: 'pending',
            schedule: data.schedule,
            nextRun: data.nextRun,
            maxRetries: data.maxRetries || 3,
        })

        return apiSuccess({
            job: {
                id: job._id.toString(),
                name: job.name,
                status: job.status,
            },
        }, 'Job created', 201)
    } catch (error) {
        console.error('Create job error:', error)
        return apiError(ERROR_CODES.JOB_CREATE_FAILED, 'Failed to create job', 500)
    }
}

// PUT - Update job status (for job runners)
export async function PUT(request: NextRequest) {
    try {
        await dbConnect()

        const { id, status, result } = await request.json()

        if (!id) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Job ID is required', 400)
        }

        const updateData: Record<string, unknown> = {}
        if (status) {
            updateData.status = status
            if (status === 'running') {
                updateData.lastRun = new Date()
            }
        }
        if (result) {
            updateData.result = result
        }

        const job = await ScheduledJob.findByIdAndUpdate(id, updateData, { new: true })

        if (!job) {
            return apiError(ERROR_CODES.JOB_NOT_FOUND, 'Job not found', 404)
        }

        return apiSuccess({
            job: {
                id: job._id.toString(),
                status: job.status,
            },
        }, 'Job updated')
    } catch (error) {
        console.error('Update job error:', error)
        return apiError(ERROR_CODES.JOB_UPDATE_FAILED, 'Failed to update job', 500)
    }
}

// DELETE - Cancel/remove a job
export async function DELETE(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Job ID is required', 400)
        }

        const job = await ScheduledJob.findByIdAndDelete(id)

        if (!job) {
            return apiError(ERROR_CODES.JOB_NOT_FOUND, 'Job not found', 404)
        }

        return apiSuccess(null, 'Job deleted')
    } catch (error) {
        console.error('Delete job error:', error)
        return apiError(ERROR_CODES.JOB_DELETE_FAILED, 'Failed to delete job', 500)
    }
}


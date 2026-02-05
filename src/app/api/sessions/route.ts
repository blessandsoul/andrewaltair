export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/db'
import Session from '@/models/Session'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

// GET - List all sessions for current user
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        // Get token from header
        const authHeader = request.headers.get('authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Authorization required', 401)
        }

        const token = authHeader.substring(7)
        const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string }

        // Get all active sessions for this user
        const sessions = await Session.find({
            userId: decoded.userId,
            isActive: true,
            expiresAt: { $gt: new Date() },
        })
            .sort({ lastActivity: -1 })
            .lean()

        return apiSuccess({
            sessions: sessions.map(s => ({
                id: s._id.toString(),
                deviceInfo: s.deviceInfo,
                lastActivity: s.lastActivity,
                createdAt: s.createdAt,
                isCurrent: s.token === token,
            })),
        }, 'Sessions fetched successfully')
    } catch (error) {
        console.error('Get sessions error:', error)
        return apiError(ERROR_CODES.SESSION_FETCH_FAILED, 'Failed to get sessions', 500)
    }
}

// DELETE - Revoke a specific session or all sessions
export async function DELETE(request: NextRequest) {
    try {
        await dbConnect()

        // Get token from header
        const authHeader = request.headers.get('authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Authorization required', 401)
        }

        const token = authHeader.substring(7)
        const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string }

        const { searchParams } = new URL(request.url)
        const sessionId = searchParams.get('id')
        const revokeAll = searchParams.get('all') === 'true'
        const exceptCurrent = searchParams.get('exceptCurrent') === 'true'

        if (revokeAll) {
            // Revoke all sessions (optionally except current)
            const filter: { userId: string; token?: { $ne: string } } = { userId: decoded.userId }
            if (exceptCurrent) {
                filter.token = { $ne: token }
            }

            const result = await Session.updateMany(filter, { isActive: false })

            return apiSuccess(null, `Revoked ${result.modifiedCount} sessions`)
        }

        if (sessionId) {
            // Revoke specific session
            const session = await Session.findOneAndUpdate(
                { _id: sessionId, userId: decoded.userId },
                { isActive: false },
                { new: true }
            )

            if (!session) {
                return apiError(ERROR_CODES.SESSION_NOT_FOUND, 'Session not found', 404)
            }

            return apiSuccess(null, 'Session revoked')
        }

        return apiError(ERROR_CODES.BAD_REQUEST, 'Specify session ID or all=true', 400)
    } catch (error) {
        console.error('Delete session error:', error)
        return apiError(ERROR_CODES.SESSION_REVOKE_FAILED, 'Failed to revoke session', 500)
    }
}


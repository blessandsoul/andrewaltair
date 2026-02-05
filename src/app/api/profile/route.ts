export const dynamic = 'force-dynamic'
import { NextRequest } from "next/server"
import { UserService } from "@/services/user.service"
import { verifyToken } from "@/lib/jwt-config"
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'

// Helper to verify JWT token and get userId
function getAuth(request: NextRequest) {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) return null

    try {
        const token = authHeader.split(" ")[1]
        const decoded = verifyToken(token) as { userId: string }
        return decoded
    } catch {
        return null
    }
}

// GET - Get user profile
export async function GET(request: NextRequest) {
    try {
        const decoded = getAuth(request)

        if (!decoded) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Authentication required', 401)
        }

        const data = await UserService.getProfile(decoded.userId)

        if (!data) {
            return apiError(ERROR_CODES.USER_NOT_FOUND, 'User not found', 404)
        }

        return apiSuccess(data, 'Profile fetched successfully')
    } catch (error) {
        console.error("Profile API error:", error)
        return apiError(ERROR_CODES.PROFILE_FETCH_FAILED, 'Failed to fetch profile', 500)
    }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
    try {
        const decoded = getAuth(request)

        if (!decoded) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Authentication required', 401)
        }

        const body = await request.json()

        const updatedUser = await UserService.updateProfile(decoded.userId, body)

        if (!updatedUser) {
            return apiError(ERROR_CODES.USER_NOT_FOUND, 'User not found', 404)
        }

        return apiSuccess({ user: updatedUser }, 'Profile updated successfully')
    } catch (error) {
        console.error("Profile update error:", error)
        return apiError(ERROR_CODES.PROFILE_UPDATE_FAILED, 'Failed to update profile', 500)
    }
}

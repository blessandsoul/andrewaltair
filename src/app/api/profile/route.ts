export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server"
import { UserService } from "@/services/user.service"
import { verifyToken } from "@/lib/jwt-config"

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
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const data = await UserService.getProfile(decoded.userId)

        if (!data) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Profile API error:", error)
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
    try {
        const decoded = getAuth(request)

        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()

        const updatedUser = await UserService.updateProfile(decoded.userId, body)

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({
            user: updatedUser,
            message: "Profile updated successfully",
        })
    } catch (error) {
        console.error("Profile update error:", error)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
}

import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import {
    generateTOTPSecret,
    generateOTPAuthURL,
    generateQRCode,
    verifyTOTP,
    generateBackupCodes,
    hashBackupCode,
    verifyBackupCode,
} from '@/lib/totp'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

// Helper to get user from token
async function getUserFromToken(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
        return null
    }
    const token = authHeader.substring(7)
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
        return decoded.userId
    } catch {
        return null
    }
}

// POST - Setup 2FA (generate secret and QR code)
export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const userId = await getUserFromToken(request)
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await User.findById(userId).select('+twoFactorSecret')
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        if (user.twoFactorEnabled) {
            return NextResponse.json({ error: '2FA is already enabled' }, { status: 400 })
        }

        // Generate new secret
        const secret = generateTOTPSecret()
        const otpAuthURL = generateOTPAuthURL(user.email, secret)
        const qrCode = await generateQRCode(otpAuthURL)

        // Store secret temporarily (not enabled yet)
        user.twoFactorSecret = secret
        await user.save()

        return NextResponse.json({
            success: true,
            secret, // Show to user for manual entry
            qrCode, // Data URL for QR code image
        })
    } catch (error) {
        console.error('2FA setup error:', error)
        return NextResponse.json({ error: 'Failed to setup 2FA' }, { status: 500 })
    }
}

// PUT - Enable/Verify 2FA with token
export async function PUT(request: NextRequest) {
    try {
        await dbConnect()

        const userId = await getUserFromToken(request)
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { token, action } = await request.json()

        const user = await User.findById(userId).select('+twoFactorSecret +backupCodes')
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        if (action === 'enable') {
            // Verify the token before enabling
            if (!user.twoFactorSecret) {
                return NextResponse.json({ error: 'Run setup first' }, { status: 400 })
            }

            const isValid = verifyTOTP(token, user.twoFactorSecret)
            if (!isValid) {
                return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
            }

            // Generate backup codes
            const backupCodes = generateBackupCodes()
            const hashedCodes = backupCodes.map(hashBackupCode)

            user.twoFactorEnabled = true
            user.backupCodes = hashedCodes
            await user.save()

            return NextResponse.json({
                success: true,
                message: '2FA enabled successfully',
                backupCodes, // Show once to user
            })
        }

        if (action === 'disable') {
            // Verify token before disabling
            if (!user.twoFactorSecret) {
                return NextResponse.json({ error: '2FA not enabled' }, { status: 400 })
            }

            const isValid = verifyTOTP(token, user.twoFactorSecret)
            if (!isValid) {
                return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
            }

            user.twoFactorEnabled = false
            user.twoFactorSecret = undefined
            user.backupCodes = undefined
            await user.save()

            return NextResponse.json({
                success: true,
                message: '2FA disabled successfully',
            })
        }

        if (action === 'verify') {
            // Verify token (for login flow)
            if (!user.twoFactorSecret) {
                return NextResponse.json({ error: '2FA not enabled' }, { status: 400 })
            }

            // First try TOTP
            let isValid = verifyTOTP(token, user.twoFactorSecret)

            // If not valid, try backup codes
            if (!isValid && user.backupCodes) {
                const backupResult = verifyBackupCode(token, user.backupCodes)
                if (backupResult.valid) {
                    // Remove used backup code
                    user.backupCodes.splice(backupResult.index, 1)
                    await user.save()
                    isValid = true
                }
            }

            return NextResponse.json({
                success: isValid,
                message: isValid ? 'Code verified' : 'Invalid code',
            })
        }

        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    } catch (error) {
        console.error('2FA verification error:', error)
        return NextResponse.json({ error: 'Failed to verify 2FA' }, { status: 500 })
    }
}

// GET - Check 2FA status
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const userId = await getUserFromToken(request)
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await User.findById(userId).select('twoFactorEnabled')
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            enabled: user.twoFactorEnabled,
        })
    } catch (error) {
        console.error('2FA status error:', error)
        return NextResponse.json({ error: 'Failed to get 2FA status' }, { status: 500 })
    }
}

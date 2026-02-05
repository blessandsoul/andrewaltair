export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import {
    generateTOTPSecret,
    generateOTPAuthURL,
    generateQRCode,
    verifyTOTP,
    generateBackupCodes,
    hashBackupCode,
    verifyBackupCode,
} from '@/lib/totp'

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

// Helper to get user from token
async function getUserFromToken(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
        return null
    }
    const token = authHeader.substring(7)
    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string }
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
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Authentication required', 401)
        }

        const user = await User.findById(userId).select('+twoFactorSecret')
        if (!user) {
            return apiError(ERROR_CODES.USER_NOT_FOUND, 'User not found', 404)
        }

        if (user.twoFactorEnabled) {
            return apiError(ERROR_CODES.AUTH_2FA_INVALID, '2FA is already enabled', 400)
        }

        // Generate new secret
        const secret = generateTOTPSecret()
        const otpAuthURL = generateOTPAuthURL(user.email, secret)
        const qrCode = await generateQRCode(otpAuthURL)

        // Store secret temporarily (not enabled yet)
        user.twoFactorSecret = secret
        await user.save()

        return apiSuccess({ secret, qrCode }, '2FA setup initiated')
    } catch (error) {
        console.error('2FA setup error:', error)
        return apiError(ERROR_CODES.AUTH_2FA_INVALID, 'Failed to setup 2FA', 500)
    }
}

// PUT - Enable/Verify 2FA with token
export async function PUT(request: NextRequest) {
    try {
        await dbConnect()

        const userId = await getUserFromToken(request)
        if (!userId) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Authentication required', 401)
        }

        const { token, action } = await request.json()

        const user = await User.findById(userId).select('+twoFactorSecret +backupCodes')
        if (!user) {
            return apiError(ERROR_CODES.USER_NOT_FOUND, 'User not found', 404)
        }

        if (action === 'enable') {
            // Verify the token before enabling
            if (!user.twoFactorSecret) {
                return apiError(ERROR_CODES.AUTH_2FA_REQUIRED, 'Run setup first', 400)
            }

            const isValid = verifyTOTP(token, user.twoFactorSecret)
            if (!isValid) {
                return apiError(ERROR_CODES.AUTH_2FA_INVALID, 'Invalid code', 400)
            }

            // Generate backup codes
            const backupCodes = generateBackupCodes()
            const hashedCodes = await Promise.all(backupCodes.map(code => hashBackupCode(code)))

            user.twoFactorEnabled = true
            user.backupCodes = hashedCodes
            await user.save()

            return apiSuccess({ backupCodes }, '2FA enabled successfully')
        }

        if (action === 'disable') {
            // Verify token before disabling
            if (!user.twoFactorSecret) {
                return apiError(ERROR_CODES.AUTH_2FA_INVALID, '2FA not enabled', 400)
            }

            const isValid = verifyTOTP(token, user.twoFactorSecret)
            if (!isValid) {
                return apiError(ERROR_CODES.AUTH_2FA_INVALID, 'Invalid code', 400)
            }

            user.twoFactorEnabled = false
            user.twoFactorSecret = undefined
            user.backupCodes = undefined
            await user.save()

            return apiSuccess(null, '2FA disabled successfully')
        }

        if (action === 'verify') {
            // Verify token (for login flow)
            if (!user.twoFactorSecret) {
                return apiError(ERROR_CODES.AUTH_2FA_INVALID, '2FA not enabled', 400)
            }

            // First try TOTP
            let isValid = verifyTOTP(token, user.twoFactorSecret)

            // If not valid, try backup codes
            if (!isValid && user.backupCodes) {
                const backupResult = await verifyBackupCode(token, user.backupCodes)
                if (backupResult.valid) {
                    // Remove used backup code
                    user.backupCodes.splice(backupResult.index, 1)
                    await user.save()
                    isValid = true
                }
            }

            if (!isValid) {
                return apiError(ERROR_CODES.AUTH_2FA_INVALID, 'Invalid code', 400)
            }

            return apiSuccess({ verified: true }, 'Code verified')
        }

        return apiError(ERROR_CODES.BAD_REQUEST, 'Unknown action', 400)
    } catch (error) {
        console.error('2FA verification error:', error)
        return apiError(ERROR_CODES.AUTH_2FA_INVALID, 'Failed to verify 2FA', 500)
    }
}

// GET - Check 2FA status
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const userId = await getUserFromToken(request)
        if (!userId) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Authentication required', 401)
        }

        const user = await User.findById(userId).select('twoFactorEnabled')
        if (!user) {
            return apiError(ERROR_CODES.USER_NOT_FOUND, 'User not found', 404)
        }

        return apiSuccess({ enabled: user.twoFactorEnabled }, '2FA status fetched')
    } catch (error) {
        console.error('2FA status error:', error)
        return apiError(ERROR_CODES.AUTH_2FA_INVALID, 'Failed to get 2FA status', 500)
    }
}


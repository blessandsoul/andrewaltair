import { authenticator } from 'otplib'
import * as QRCode from 'qrcode'

// Configure authenticator
authenticator.options = {
    window: 1, // Allow 1 step before/after for clock drift
}

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Fresh Platform'

/**
 * Generate a new TOTP secret for a user
 */
export function generateTOTPSecret(): string {
    return authenticator.generateSecret()
}

/**
 * Generate OTP Auth URL for authenticator apps
 */
export function generateOTPAuthURL(email: string, secret: string): string {
    return authenticator.keyuri(email, APP_NAME, secret)
}

/**
 * Generate QR code as data URL for scanning with authenticator app
 */
export async function generateQRCode(otpAuthURL: string): Promise<string> {
    try {
        return await QRCode.toDataURL(otpAuthURL, {
            width: 256,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        })
    } catch (error) {
        console.error('QR code generation error:', error)
        throw new Error('Failed to generate QR code')
    }
}

/**
 * Verify a TOTP token
 */
export function verifyTOTP(token: string, secret: string): boolean {
    try {
        return authenticator.verify({ token, secret })
    } catch (error) {
        console.error('TOTP verification error:', error)
        return false
    }
}

/**
 * Generate backup codes (one-time use)
 */
export function generateBackupCodes(count: number = 8): string[] {
    const codes: string[] = []
    for (let i = 0; i < count; i++) {
        // Generate 8-character alphanumeric codes
        const code = Array.from({ length: 8 }, () =>
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
        ).join('')
        codes.push(code)
    }
    return codes
}

/**
 * Hash backup codes for storage (simple hash for now)
 */
export function hashBackupCode(code: string): string {
    // In production, use bcrypt or similar
    return Buffer.from(code).toString('base64')
}

/**
 * Verify a backup code against stored hashes
 */
export function verifyBackupCode(code: string, hashedCodes: string[]): { valid: boolean; index: number } {
    const hashedInput = hashBackupCode(code.toUpperCase().replace(/\s/g, ''))
    const index = hashedCodes.indexOf(hashedInput)
    return {
        valid: index !== -1,
        index,
    }
}

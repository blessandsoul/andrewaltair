import { authenticator } from 'otplib'
import * as QRCode from 'qrcode'
import bcrypt from 'bcryptjs'

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
 * Format: XXXX-XXXX (8 characters with dash for readability)
 */
export function generateBackupCodes(count: number = 8): string[] {
    const codes: string[] = [];
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars like I, O, 0, 1

    for (let i = 0; i < count; i++) {
        const code = Array.from({ length: 8 }, () =>
            chars[Math.floor(Math.random() * chars.length)]
        ).join('');

        // Format as XXXX-XXXX for readability
        const formatted = `${code.slice(0, 4)}-${code.slice(4)}`;
        codes.push(formatted);
    }

    return codes;
}

/**
 * Hash backup codes for secure storage
 * Uses bcrypt with salt rounds of 10
 */
export async function hashBackupCode(code: string): Promise<string> {
    const normalizedCode = code.toUpperCase().replace(/\s/g, '');
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(normalizedCode, salt);
}

/**
 * Verify a backup code against stored hashes
 * Returns the index of the matched code for removal
 */
export async function verifyBackupCode(
    code: string,
    hashedCodes: string[]
): Promise<{ valid: boolean; index: number }> {
    const normalizedCode = code.toUpperCase().replace(/\s/g, '');

    for (let i = 0; i < hashedCodes.length; i++) {
        try {
            const isMatch = await bcrypt.compare(normalizedCode, hashedCodes[i]);
            if (isMatch) {
                return { valid: true, index: i };
            }
        } catch (error) {
            console.error('Backup code verification error:', error);
            continue;
        }
    }

    return { valid: false, index: -1 };
}

export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// In-memory store for verification codes (in production, use Redis or database)
// Format: { code: { userId: string, expiresAt: number, used: boolean } }
const verificationCodes = new Map<string, { userId: string; expiresAt: number; used: boolean }>();

// Free bots that users get after verification
const FREE_BOTS = ['bot-content-writer', 'bot-social-media', 'bot-email-writer'];

export async function POST(request: NextRequest) {
    try {
        const { code } = await request.json();

        if (!code || typeof code !== 'string') {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'კოდი არ არის მითითებული', 400);
        }

        const normalizedCode = code.trim().toUpperCase();

        // Check if code exists
        const codeData = verificationCodes.get(normalizedCode);

        if (!codeData) {
            return apiError(ERROR_CODES.TELEGRAM_VERIFICATION_FAILED, 'არასწორი კოდი', 404);
        }

        // Check if code is expired
        if (Date.now() > codeData.expiresAt) {
            verificationCodes.delete(normalizedCode);
            return apiError(ERROR_CODES.TELEGRAM_VERIFICATION_FAILED, 'კოდის ვადა გაუვიდა', 410);
        }

        // Check if code was already used
        if (codeData.used) {
            return apiError(ERROR_CODES.TELEGRAM_VERIFICATION_FAILED, 'კოდი უკვე გამოყენებულია', 409);
        }

        // Mark code as used
        codeData.used = true;
        verificationCodes.set(normalizedCode, codeData);

        return apiSuccess({ freeBots: FREE_BOTS, userId: codeData.userId }, 'კოდი დადასტურებულია');

    } catch (error) {
        console.error('Telegram code verification error:', error);
        return apiError(ERROR_CODES.TELEGRAM_VERIFICATION_FAILED, 'სერვერის შეცდომა', 500);
    }
}

// Helper function to generate and store verification code (called by Telegram bot)
export async function PUT(request: NextRequest) {
    try {
        const { userId, telegramUsername } = await request.json();

        if (!userId) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'userId is required', 400);
        }

        // Generate random 6-character code
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Code expires in 24 hours
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

        // Store code
        verificationCodes.set(code, {
            userId,
            expiresAt,
            used: false
        });

        // Clean up expired codes
        for (const [key, value] of verificationCodes.entries()) {
            if (Date.now() > value.expiresAt) {
                verificationCodes.delete(key);
            }
        }

        return apiSuccess({ code, expiresAt }, `Your verification code is: ${code}\nValid for 24 hours.`);

    } catch (error) {
        console.error('Code generation error:', error);
        return apiError(ERROR_CODES.TELEGRAM_VERIFICATION_FAILED, 'Server error', 500);
    }
}



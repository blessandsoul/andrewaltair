export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';

// In-memory store for verification codes (in production, use Redis or database)
// Format: { code: { userId: string, expiresAt: number, used: boolean } }
const verificationCodes = new Map<string, { userId: string; expiresAt: number; used: boolean }>();

// Free bots that users get after verification
const FREE_BOTS = ['bot-content-writer', 'bot-social-media', 'bot-email-writer'];

export async function POST(request: NextRequest) {
    try {
        const { code } = await request.json();

        if (!code || typeof code !== 'string') {
            return NextResponse.json(
                { success: false, message: 'კოდი არ არის მითითებული' },
                { status: 400 }
            );
        }

        const normalizedCode = code.trim().toUpperCase();

        // Check if code exists
        const codeData = verificationCodes.get(normalizedCode);

        if (!codeData) {
            return NextResponse.json(
                { success: false, message: 'არასწორი კოდი' },
                { status: 404 }
            );
        }

        // Check if code is expired
        if (Date.now() > codeData.expiresAt) {
            verificationCodes.delete(normalizedCode);
            return NextResponse.json(
                { success: false, message: 'კოდის ვადა გაუვიდა' },
                { status: 410 }
            );
        }

        // Check if code was already used
        if (codeData.used) {
            return NextResponse.json(
                { success: false, message: 'კოდი უკვე გამოყენებულია' },
                { status: 409 }
            );
        }

        // Mark code as used
        codeData.used = true;
        verificationCodes.set(normalizedCode, codeData);

        return NextResponse.json({
            success: true,
            message: 'კოდი დადასტურებულია',
            freeBots: FREE_BOTS,
            userId: codeData.userId
        });

    } catch (error) {
        console.error('Telegram code verification error:', error);
        return NextResponse.json(
            { success: false, message: 'სერვერის შეცდომა' },
            { status: 500 }
        );
    }
}

// Helper function to generate and store verification code (called by Telegram bot)
export async function PUT(request: NextRequest) {
    try {
        const { userId, telegramUsername } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'userId is required' },
                { status: 400 }
            );
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

        return NextResponse.json({
            success: true,
            code,
            expiresAt,
            message: `Your verification code is: ${code}\nValid for 24 hours.`
        });

    } catch (error) {
        console.error('Code generation error:', error);
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        );
    }
}



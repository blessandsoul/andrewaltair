export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import PromptSubmission from '@/models/PromptSubmission';
import { getUserFromRequest } from '@/lib/server-auth';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// 🛡️ Rate limiting for submissions
const submissionAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_SUBMISSIONS_PER_DAY = 3;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

function checkSubmissionRateLimit(userId: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const userLimit = submissionAttempts.get(userId);

    if (userLimit) {
        if (now < userLimit.resetAt) {
            if (userLimit.count >= MAX_SUBMISSIONS_PER_DAY) {
                return { allowed: false, remaining: 0 };
            }
            userLimit.count++;
            return { allowed: true, remaining: MAX_SUBMISSIONS_PER_DAY - userLimit.count };
        }
        submissionAttempts.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
        return { allowed: true, remaining: MAX_SUBMISSIONS_PER_DAY - 1 };
    }

    submissionAttempts.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: MAX_SUBMISSIONS_PER_DAY - 1 };
}

export async function POST(request: NextRequest) {
    try {
        // 🛡️ AUTHENTICATION REQUIRED
        const user = await getUserFromRequest(request);
        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'ავტორიზაცია აუცილებელია', 401);
        }

        // 🛡️ RATE LIMITING
        const rateLimit = checkSubmissionRateLimit(user._id.toString());
        if (!rateLimit.allowed) {
            return apiError(ERROR_CODES.RATE_LIMITED, 'ლიმიტი ამოიწურა. შეგიძლიათ გაგზავნოთ მაქსიმუმ 3 პრომპტი დღეში.', 429);
        }

        await dbConnect();

        const { promptName, category, description, masterPrompt } = await request.json();

        // 🛡️ Validation
        if (!promptName || !description || !masterPrompt) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'ყველა ველი აუცილებელია', 400);
        }

        // 🛡️ Validate lengths
        if (promptName.length < 3 || promptName.length > 100) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'პრომპტის სახელი უნდა იყოს 3-100 სიმბოლო', 400);
        }

        if (description.length < 10 || description.length > 500) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'აღწერა უნდა იყოს 10-500 სიმბოლო', 400);
        }

        if (masterPrompt.length < 50 || masterPrompt.length > 5000) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'მასტერ პრომპტი უნდა იყოს 50-5000 სიმბოლო', 400);
        }

        // Create submission with authenticated user data
        const submission = await PromptSubmission.create({
            name: user.fullName,
            email: user.email,
            userId: user._id,
            promptName: promptName.trim(),
            category,
            description: description.trim(),
            masterPrompt: masterPrompt.trim(),
            status: 'pending',
            submittedAt: new Date()
        });

        return apiSuccess({
            id: submission._id
        }, 'პრომპტი წარმატებით გაიგზავნა', 201);
    } catch (error) {
        console.error('Error submitting prompt:', error);
        return apiError(ERROR_CODES.BOT_SUBMIT_FAILED, 'პრომპტის გაგზავნა ვერ მოხერხდა', 500);
    }
}



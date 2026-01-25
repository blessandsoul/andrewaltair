/**
 * Mystic AI Tools Authentication & Rate Limiting
 * Централизованная защита для всех мистических инструментов
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/server-auth';

// 🛡️ Rate limiting storage
const mysticRequests = new Map<string, { count: number; resetAt: number }>();

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

// Rate limit configurations for different tools
export const MYSTIC_RATE_LIMITS: Record<string, RateLimitConfig> = {
    chat: { maxRequests: 20, windowMs: 60 * 60 * 1000 }, // 20/hour
    dream: { maxRequests: 10, windowMs: 24 * 60 * 60 * 1000 }, // 10/day
    fortune: { maxRequests: 15, windowMs: 24 * 60 * 60 * 1000 }, // 15/day
    horoscope: { maxRequests: 5, windowMs: 24 * 60 * 60 * 1000 }, // 5/day
    love: { maxRequests: 10, windowMs: 24 * 60 * 60 * 1000 }, // 10/day
    numerology: { maxRequests: 10, windowMs: 24 * 60 * 60 * 1000 }, // 10/day
    tarot: { maxRequests: 5, windowMs: 24 * 60 * 60 * 1000 }, // 5/day
};

/**
 * Check rate limit for a specific tool and user
 */
function checkRateLimit(
    userId: string,
    tool: string,
    config: RateLimitConfig
): { allowed: boolean; remaining: number; resetIn?: number } {
    const key = `${tool}:${userId}`;
    const now = Date.now();
    const userLimit = mysticRequests.get(key);

    if (userLimit) {
        if (now < userLimit.resetAt) {
            if (userLimit.count >= config.maxRequests) {
                return {
                    allowed: false,
                    remaining: 0,
                    resetIn: Math.ceil((userLimit.resetAt - now) / 1000)
                };
            }
            userLimit.count++;
            return { allowed: true, remaining: config.maxRequests - userLimit.count };
        }
        // Reset window
        mysticRequests.set(key, { count: 1, resetAt: now + config.windowMs });
        return { allowed: true, remaining: config.maxRequests - 1 };
    }

    mysticRequests.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1 };
}

/**
 * Middleware для защиты Mystic AI endpoints
 * Проверяет аутентификацию и rate limiting
 */
import { IUser } from '@/models/User';

export async function protectMysticEndpoint(
    request: NextRequest,
    toolName: string
): Promise<{ user: IUser | null; error?: NextResponse }> {
    // 🛡️ AUTHENTICATION REQUIRED
    const user = await getUserFromRequest(request);
    if (!user) {
        return {
            user: null,
            error: NextResponse.json(
                { error: 'ავტორიზაცია აუცილებელია მისტიკური ინსტრუმენტების გამოსაყენებლად' },
                { status: 401 }
            )
        };
    }

    // 🛡️ RATE LIMITING
    const config = MYSTIC_RATE_LIMITS[toolName] || MYSTIC_RATE_LIMITS.chat;
    const rateLimit = checkRateLimit(user._id.toString(), toolName, config);

    if (!rateLimit.allowed) {
        const timeUnit = config.windowMs >= 24 * 60 * 60 * 1000 ? 'დღეში' : 'საათში';
        const resetTime = rateLimit.resetIn
            ? config.windowMs >= 24 * 60 * 60 * 1000
                ? `${Math.ceil((rateLimit.resetIn || 0) / 3600)} საათში`
                : `${Math.ceil((rateLimit.resetIn || 0) / 60)} წუთში`
            : '';

        return {
            user: null,
            error: NextResponse.json(
                {
                    error: `ლიმიტი ამოიწურა. შეგიძლიათ გამოიყენოთ ${config.maxRequests} ჯერ ${timeUnit}. სცადეთ ${resetTime}.`,
                    remaining: 0,
                    resetIn: rateLimit.resetIn
                },
                { status: 429 }
            )
        };
    }

    return { user };
}

/**
 * Validate input length
 */
export function validateInputLength(
    input: string,
    fieldName: string,
    min: number,
    max: number
): NextResponse | null {
    if (input.length < min || input.length > max) {
        return NextResponse.json(
            { error: `${fieldName} უნდა იყოს ${min}-${max} სიმბოლო` },
            { status: 400 }
        );
    }
    return null;
}

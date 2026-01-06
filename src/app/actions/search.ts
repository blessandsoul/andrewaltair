'use server'

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { VIBE_CODING_DATA } from '@/data/vibeCodingContent';

// 🛡️ Rate Limiting - Prevent ID scraping/brute force
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS = 20; // Max requests per window
const WINDOW_MS = 60 * 1000; // 1 minute window

async function checkRateLimit(): Promise<{ allowed: boolean; remaining: number }> {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] ||
        headersList.get('x-real-ip') ||
        'unknown';

    const now = Date.now();
    const record = rateLimitMap.get(ip);

    // Clean up old entries periodically
    if (rateLimitMap.size > 10000) {
        for (const [key, value] of rateLimitMap.entries()) {
            if (now > value.resetTime) {
                rateLimitMap.delete(key);
            }
        }
    }

    if (!record || now > record.resetTime) {
        // New window
        rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
        return { allowed: true, remaining: MAX_REQUESTS - 1 };
    }

    if (record.count >= MAX_REQUESTS) {
        return { allowed: false, remaining: 0 };
    }

    record.count++;
    rateLimitMap.set(ip, record);
    return { allowed: true, remaining: MAX_REQUESTS - record.count };
}

export async function handleSmartSearch(formData: FormData) {
    const query = formData.get('query')?.toString().trim();
    if (!query) return;

    // 🛡️ Rate limit check
    const rateLimit = await checkRateLimit();
    if (!rateLimit.allowed) {
        throw new Error("ძალიან ბევრი მოთხოვნა. სცადეთ 1 წუთში.");
    }

    // REGEX: Detects 6-digit number (with optional #)
    // Matches: "928341", "#928341", " 123456 "
    const isIdCode = /^#?\d{6}$/.test(query);

    if (isIdCode) {
        const cleanId = query.replace('#', '');
        const targetSlug = await findContentSlugById(cleanId);

        if (targetSlug) {
            redirect(targetSlug); // Instant Teleport 🚀
        }
    }

    // Fallback: Standard Search via API
    redirect(`/blog?search=${encodeURIComponent(query)}`);
}

async function findContentSlugById(id: string): Promise<string | null> {
    // 1. Search in Blog Posts (MongoDB)
    try {
        await dbConnect();
        // Check for exact slug match, or tag match #ID or ID
        const post = await Post.findOne({
            $or: [
                { numericId: id }, // Check the new numericId field
                { slug: id },
                { tags: id },
                { tags: `#${id}` },
            ]
        }).select('slug').lean();

        if (post) {
            return `/blog/${post.slug}`;
        }
    } catch (error) {
        console.error('Error searching posts by ID:', error);
    }

    // 2. Search in Library (Static Data)
    for (const category of VIBE_CODING_DATA.categories) {
        for (const article of category.articles) {
            // Check if article ID matches or contains the ID
            if (article.id === id || article.id.endsWith(`-${id}`)) {
                return `/encyclopedia/vibe-coding/${article.id}`;
            }
        }
    }

    return null;
}

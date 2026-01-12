import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import MarketplacePrompt from '@/models/MarketplacePrompt';

/**
 * Formats a 6-digit ID into a readable string (e.g., "123-456").
 * @param id The numeric ID string.
 * @returns The formatted ID string.
 */
export function formatId(id: string | undefined | null): string {
    if (!id) return '---';
    return id.toString();
}

/**
 * Generates a globally unique 6-digit ID.
 * Checks both Post and MarketplacePrompt collections to ensure no collisions.
 * @returns A unique 6-digit ID string.
 */
export async function generateUniqueId(): Promise<string> {
    await dbConnect();

    let numericId: string | undefined;
    let attempts = 0;
    const MAX_ATTEMPTS = 20;

    while (!numericId && attempts < MAX_ATTEMPTS) {
        // Generate random 6-digit number (100000 - 999999)
        const potentialId = Math.floor(100000 + Math.random() * 900000).toString();

        // Check availability in ALL collections
        const [existingPost, existingPrompt] = await Promise.all([
            Post.findOne({ numericId: potentialId }).select('_id').lean(),
            MarketplacePrompt.findOne({ numericId: potentialId }).select('_id').lean()
        ]);

        if (!existingPost && !existingPrompt) {
            numericId = potentialId;
        }

        attempts++;
    }

    if (!numericId) {
        throw new Error('Failed to generate unique ID after multiple attempts');
    }

    return numericId;
}

/**
 * Checks if an ID string matches the expected 6-digit format.
 * @param query The string to check.
 * @returns True if it looks like an ID.
 */
export function isIdFormat(query: string): boolean {
    // Check for "123456"
    return /^\d{6}$/.test(query);
}

/**
 * Cleans an ID string for database lookup (just trim).
 * @param query The string to clean.
 * @returns The raw 6-digit ID.
 */
export function normalizeId(query: string): string {
    return query.trim();
}

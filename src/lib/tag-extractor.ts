import { TAG_DICTIONARY, GEORGIAN_STOP_WORDS, ENGLISH_STOP_WORDS } from '@/data/tag-dictionary';
import dbConnect from '@/lib/db';
import Tag from '@/models/Tag';

interface TagExtractionResult {
    tags: string[];
    autoTags: string[];
}

/**
 * Extract tags from content using hybrid approach:
 * 1. Dictionary scan for known keywords
 * 2. TF scoring for remaining words
 * 3. Match against existing Tag collection
 */
export async function extractTags(content: string): Promise<TagExtractionResult> {
    const lowerContent = content.toLowerCase();
    const allAutoTags: string[] = [];

    // --- Phase 1: Dictionary scan ---
    const dictionaryTags: string[] = [];
    for (const [keyword, tagSlugs] of Object.entries(TAG_DICTIONARY)) {
        if (lowerContent.includes(keyword.toLowerCase())) {
            dictionaryTags.push(...tagSlugs);
            allAutoTags.push(keyword);
        }
    }

    // --- Phase 2: TF scoring ---
    const tokens = tokenize(content);
    const filteredTokens = tokens.filter(
        (t) => t.length > 2 && !GEORGIAN_STOP_WORDS.has(t) && !ENGLISH_STOP_WORDS.has(t)
    );

    const frequency: Record<string, number> = {};
    for (const token of filteredTokens) {
        frequency[token] = (frequency[token] || 0) + 1;
    }

    const topWords = Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([word]) => word);

    allAutoTags.push(...topWords);

    // --- Phase 3: Match against existing tags in DB ---
    await dbConnect();
    const existingTags = await Tag.find({}).select('slug name').lean();
    const matchedFromTF: string[] = [];

    for (const word of topWords) {
        const match = existingTags.find(
            (tag) =>
                tag.slug.includes(word) ||
                word.includes(tag.slug) ||
                tag.name.toLowerCase().includes(word) ||
                word.includes(tag.name.toLowerCase())
        );
        if (match) {
            matchedFromTF.push(match.slug);
        }
    }

    // --- Merge & dedupe ---
    const merged = [...new Set([...dictionaryTags, ...matchedFromTF])];
    const tags = merged.slice(0, 15);
    const autoTags = [...new Set(allAutoTags)];

    return { tags, autoTags };
}

/**
 * Tokenize text into words. Handles both Georgian and Latin scripts.
 */
function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/https?:\/\/\S+/g, '')        // Remove URLs
        .replace(/[^\p{L}\p{N}\s-]/gu, ' ')    // Keep letters, numbers, spaces, hyphens
        .split(/\s+/)
        .filter((t) => t.length > 0);
}

/**
 * Post Content Parser
 * Parses raw post content from Andrew's master prompt output into structured sections
 */

export interface ParsedSection {
    icon?: string;  // lucide icon name (e.g., 'Brain', 'Factory', 'AlertTriangle')
    title?: string;
    content: string;
    type: 'intro' | 'section' | 'sarcasm' | 'warning' | 'tip' | 'fact' | 'opinion' | 'cta' | 'hashtags' | 'author-comment';
}

// Emoji to section type mapping
const EMOJI_TYPE_MAP: Record<string, ParsedSection['type']> = {
    '🎭': 'sarcasm',
    '🔴': 'warning',
    '🟢': 'tip',
    '👁️': 'fact',
    '👁': 'fact',  // Sometimes rendered differently
    '👇': 'cta',
};

// Emoji to Lucide icon name mapping
const EMOJI_TO_ICON: Record<string, string> = {
    '📉': 'TrendingDown',
    '📈': 'TrendingUp',
    '📊': 'BarChart3',
    '🏭': 'Factory',
    '🤖': 'Bot',
    '⚙️': 'Cog',
    '🔧': 'Wrench',
    '🛠️': 'Hammer',
    '🌍': 'Globe',
    '🌐': 'Globe2',
    '🔴': 'AlertTriangle',
    '🟢': 'Lightbulb',
    '👁️': 'Eye',
    '👁': 'Eye',
    '👇': 'ArrowDown',
    '🎭': 'Theater',
    '🧠': 'Brain',
    '💰': 'Coins',
    '💎': 'Gem',
    '🔹': 'ChevronRight',
    '💧': 'Droplet',
    '⚡': 'Zap',
    '🔥': 'Flame',
    '💡': 'Lightbulb',
    '🎯': 'Target',
    '📌': 'Pin',
    '✨': 'Sparkles',
};

// Section marker emojis (generic sections)
const SECTION_EMOJIS = ['🔹', '💧', '💰', '💎', '⚡', '🔥', '💡', '🎯', '📌', '✨'];

// Opinion detection patterns
const OPINION_PATTERNS = [
    /^მე ვფიქრობ/,
    /^ჩემი აზრით/,
    /^მე მჯერა/,
];

// Clean content from ** markers
function cleanContent(text: string): string {
    return text
        .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove ** markers, keep content
        .replace(/^\*\*|\*\*$/g, '')
        .trim();
}

/**
 * Parse raw post content into structured sections
 */
export function parsePostContent(rawContent: string): ParsedSection[] {
    if (!rawContent || !rawContent.trim()) {
        return [];
    }

    const sections: ParsedSection[] = [];
    const lines = rawContent.split('\n');

    let currentSection: ParsedSection | null = null;
    let introComplete = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Skip empty lines
        if (!line) {
            if (currentSection) {
                currentSection.content += '\n';
            }
            continue;
        }

        // Check for hashtag line
        if (line.startsWith('#') && line.includes('#') && !line.startsWith('##')) {
            // This is a hashtag line
            if (currentSection) {
                sections.push(currentSection);
            }
            sections.push({
                content: line,
                type: 'hashtags',
            });
            currentSection = null;
            continue;
        }

        // Check for emoji-prefixed section
        const emojiMatch = line.match(/^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/u);

        if (emojiMatch) {
            const emoji = emojiMatch[0];

            // Save current section
            if (currentSection) {
                sections.push(currentSection);
            }

            // Determine section type
            let type: ParsedSection['type'] = 'section';
            if (EMOJI_TYPE_MAP[emoji]) {
                type = EMOJI_TYPE_MAP[emoji];
            } else if (SECTION_EMOJIS.includes(emoji)) {
                type = 'section';
            }

            // Get icon from emoji
            const icon = EMOJI_TO_ICON[emoji] || 'ChevronRight';

            // Extract title if present (bold text after emoji) and clean it
            const titleMatch = line.match(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+\s*\*\*([^*]+)\*\*:?\s*(.*)/u);

            if (titleMatch) {
                currentSection = {
                    icon,
                    title: cleanContent(titleMatch[1]),
                    content: cleanContent(titleMatch[2]),
                    type,
                };
            } else {
                // No title, just content
                const contentAfterEmoji = line.slice(emoji.length).trim();
                currentSection = {
                    icon,
                    content: cleanContent(contentAfterEmoji),
                    type,
                };
            }

            introComplete = true;
            continue;
        }

        // Check for opinion block
        if (OPINION_PATTERNS.some(pattern => pattern.test(line))) {
            if (currentSection) {
                sections.push(currentSection);
            }
            currentSection = {
                icon: 'Quote',
                content: cleanContent(line),
                type: 'opinion',
            };
            introComplete = true;
            continue;
        }

        // Regular content
        if (!introComplete && !currentSection) {
            // This is intro content
            currentSection = {
                content: cleanContent(line),
                type: 'intro',
            };
        } else if (currentSection) {
            // Append to current section
            currentSection.content += '\n' + cleanContent(line);
        } else {
            // Start new generic section
            currentSection = {
                content: cleanContent(line),
                type: 'section',
            };
        }
    }

    // Save last section
    if (currentSection) {
        sections.push(currentSection);
    }

    // Clean up sections
    return sections.map(section => ({
        ...section,
        content: section.content.trim(),
    })).filter(section => section.content);
}

/**
 * Extract hashtags from content
 */
export function extractHashtags(content: string): string[] {
    const hashtagRegex = /#[\u10A0-\u10FFa-zA-Z0-9_]+/g;
    const matches = content.match(hashtagRegex);
    return matches ? [...new Set(matches)] : [];
}

/**
 * Extract title from first line (usually ends with emoji)
 */
export function extractTitle(content: string): string {
    const firstLine = content.split('\n')[0].trim();
    // Remove trailing emoji if present
    return firstLine.replace(/[\u{1F300}-\u{1F9FF}]+$/u, '').trim();
}

/**
 * Extract excerpt from content (first paragraph after title)
 */
export function extractExcerpt(content: string, maxLength: number = 200): string {
    const lines = content.split('\n').filter(l => l.trim());
    if (lines.length < 2) return '';

    // Skip title line, get next meaningful paragraph
    let excerpt = '';
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        // Skip emoji-prefixed lines
        if (/^[\u{1F300}-\u{1F9FF}]/u.test(line)) continue;
        // Skip hashtag lines
        if (line.startsWith('#')) continue;

        excerpt = line;
        break;
    }

    if (excerpt.length > maxLength) {
        return excerpt.slice(0, maxLength) + '...';
    }
    return excerpt;
}

/**
 * Calculate reading time based on content
 */
export function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

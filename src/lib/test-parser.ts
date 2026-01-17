
// MOCKING THE PARSER FUNCTION HERE FOR TESTING
function parsePostContent(rawContent: string): any[] {
    // ... (simplified structure for test) ...
    // Copying the loop logic with IMPROVED regex
    const sections: any[] = [];
    // ...
    const lines = rawContent.split('\n');
    let currentSection: any = null;
    let introComplete = false;

    // Mapping mocks
    const EMOJI_TYPE_MAP: any = { '🎭': 'sarcasm' };
    const SECTION_EMOJIS = ['⚡'];
    const EMOJI_TO_ICON: any = { '👁': 'Eye', '👁️': 'Eye', '⚡': 'Zap', '🎭': 'Theater', '📊': 'BarChart' };

    for (const line of lines) {
        // ... (skip TLDR checks for brevity as they passed) ...
        if (line.startsWith('>')) {
            const content = line.replace(/^>\s*/, '').replace(/TL;DR:?/i, '').trim();
            sections.push({ icon: 'Zap', title: 'მოკლედ', content, type: 'section' });
            continue;
        }

        // IMPROVED REGEX: matches emojis AND Variation Selector 16
        const emojiRegex = /^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|\u{FE0F}| )/u;

        // Check initial match (looking for "real" emoji to determine type)
        // We use the original broad regex for detection, but the new one for cleaning
        const detectionRegex = /^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/u;
        const emojiMatch = line.match(detectionRegex);

        if (emojiMatch) {
            const firstEmoji = emojiMatch[0];
            const type = EMOJI_TYPE_MAP[firstEmoji] || 'section';
            const icon = EMOJI_TO_ICON[firstEmoji] || EMOJI_TO_ICON[firstEmoji.replace(/\uFE0F/g, '')] || 'ChevronRight'; // Handle VS16 in lookup

            let cleanLine = line;
            // Loop until no more emoji/space/VS16 at start
            while (emojiRegex.test(cleanLine)) {
                cleanLine = cleanLine.replace(emojiRegex, '').trim();
            }

            sections.push({ icon, content: cleanLine, type });
            continue;
        }

        sections.push({ content: line, type: 'intro' });
    }
    return sections;
}

const testCases = [
    "⚡ Title - Content",
    "👁️ 📊 Double Emoji Title",
    "> TL;DR Summary text",
    "> tl;dr Lowercase summary",
    "Just text",
    "🎭 **Sarcastic Title** - content",
    "⚡⚡⚡ Triple zap",
    "No emojis here"
];

console.log("Starting Parser Tests...");

testCases.forEach((text, i) => {
    console.log(`\nTest Case ${i + 1}: "${text}"`);
    try {
        const sections = parsePostContent(text);
        console.log("Result:", JSON.stringify(sections, null, 2));
    } catch (e) {
        console.error("Error/Hang:", e);
    }
});

console.log("\nTests Completed.");

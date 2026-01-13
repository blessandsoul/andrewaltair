
export interface ParsedTutorial {
    title: string;
    intro: string;
    tools: string;
    modules: Array<{
        title: string;
        quote: string;
        explanation: string;
    }>;
    conclusion: string;
    metaAdvice: string;
    tags: string[];
    themeColor: string;
    songTrack: string;
    character: string;
    prompts: {
        vertical: string;
        horizontal: string;
    };
    success: boolean;
    error?: string;
}

export function parseTutorialPost(text: string): ParsedTutorial {
    try {
        const result: ParsedTutorial = {
            title: '',
            intro: '',
            tools: '',
            modules: [],
            conclusion: '',
            metaAdvice: '',
            tags: [],
            themeColor: '',
            songTrack: '',
            character: '',
            prompts: { vertical: '', horizontal: '' },
            success: true
        };

        // 1. Title (Extract from [Emoji] **Title**)
        // Looking for the pattern: [Emoji based on {THEME_COLOR}] **{HEADLINE}**
        // Or sometimes just strict "**Headline**" 
        // Example input: "🔵 **7 აკრძალული პრომპტი**"
        const titleMatch = text.match(/(?:\[.*?\]\s*)?\*\*(.*?)\*\*/);
        if (titleMatch) {
            result.title = titleMatch[1].trim();
        }

        // 2. Intro
        // Just after title, usually [Intro: ...] or just text
        // But often in the "output" part it's "Intro: Simple analogy..."
        // The user's example:
        // "🔵 **7 აკრძალული პრომპტი** ... 
        //  წარმოიდგინე, რომ ხელში გიჭირავს..."
        // Let's try to grab text between title and "🛠"
        const toolsIndex = text.indexOf('🛠');
        if (titleMatch && toolsIndex > 0) {
            const introPart = text.substring(text.indexOf(titleMatch[0]) + titleMatch[0].length, toolsIndex).trim();
            result.intro = introPart.replace(/^Intro:\s*/i, '').trim();
        }

        // 3. Tools ("🛠 **რა დაგჭირდება**:")
        // Extract content between 🛠 and 🏗
        const constructionIndex = text.indexOf('🏗');
        if (toolsIndex > -1 && constructionIndex > -1) {
            let toolsText = text.substring(toolsIndex, constructionIndex).trim();
            // Remove the header "🛠 **...**:"
            toolsText = toolsText.replace(/🛠\s*\*\*.*?\*\*:\s*/, '').trim();
            result.tools = toolsText;
        }

        // 4. Modules
        // Loop through "1. Title", "> Quote", "ℹ️ *Explanation*"
        // Regex to find blocks: "**\d+\. (.*?)**"
        const moduleHeaderRegex = /\*\*\d+\.\s+(.*?)\*\*/g;
        let match;
        const moduleIndices: { index: number, title: string }[] = [];

        while ((match = moduleHeaderRegex.exec(text)) !== null) {
            moduleIndices.push({ index: match.index, title: match[1] });
        }

        for (let i = 0; i < moduleIndices.length; i++) {
            const current = moduleIndices[i];
            const next = moduleIndices[i + 1];

            // Extract the chunk for this module
            // End is either next module start, or end of modules section (marked by "🏁" or loop end)
            let chunkEnd = next ? next.index : text.indexOf('🏁');
            if (chunkEnd === -1) chunkEnd = text.length; // fallback

            const chunk = text.substring(current.index, chunkEnd);

            // Extract Quote: "> " to newline or ℹ️
            const quoteMatch = chunk.match(/>\s"([\s\S]*?)"/) || chunk.match(/>\s([\s\S]*?)(?=\n|ℹ️)/);
            const quote = quoteMatch ? quoteMatch[1].trim() : '';

            // Extract Explanation: "ℹ️ *...*"
            const infoMatch = chunk.match(/ℹ️\s*\*\[?([\s\S]*?)\]?\*/);
            const explanation = infoMatch ? infoMatch[1].trim() : '';

            result.modules.push({
                title: current.title,
                quote,
                explanation
            });
        }

        // 5. Conclusion & Meta Advice
        // Everything after 🏁
        const finishIndex = text.indexOf('🏁');
        if (finishIndex > -1) {
            const footerText = text.substring(finishIndex).replace('🏁', '').trim();

            // Extract hashtags
            const tagsMatch = footerText.match(/#\S+/g);
            if (tagsMatch) {
                result.tags = tagsMatch.map(t => t.replace('#', ''));
            }

            // Extract Meta Advice: 🏴‍☠️
            const pirateIndex = footerText.indexOf('🏴‍☠️');
            if (pirateIndex > -1) {
                const metaPart = footerText.substring(pirateIndex).replace('🏴‍☠️', '').trim();
                // Clean up comments like [Write ONE paragraph...]
                result.metaAdvice = metaPart.split('\n')[0]; // Take first paragraph usually
            }
        }

        // 6. Theme and others (Parsing the variables block if present)
        // VAR {THEME_COLOR}: ...
        const themeMatch = text.match(/VAR {THEME_COLOR}:\s*"?(.*?)"?\n/);
        if (themeMatch) result.themeColor = themeMatch[1];

        // 7. Prompts
        // Find "Format: Vertical 9:16" section
        const verticalMatch = text.match(/Format: Vertical 9:16[\s\S]*?Prompt:\s([\s\S]*?)---/);
        if (verticalMatch) result.prompts.vertical = verticalMatch[1].trim();

        const horizontalMatch = text.match(/Format: Horizontal 16:9[\s\S]*?Prompt:\s([\s\S]*?)---/);
        if (horizontalMatch) result.prompts.horizontal = horizontalMatch[1].trim();

        return result;

    } catch (e: any) {
        return {
            success: false,
            error: e.message,
            title: '',
            intro: '',
            tools: '',
            modules: [],
            conclusion: '',
            metaAdvice: '',
            tags: [],
            themeColor: '',
            songTrack: '',
            character: '',
            prompts: { vertical: '', horizontal: '' }
        };
    }
}

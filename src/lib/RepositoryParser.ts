
// Local interface definition to avoid importing from component files with aliases
export interface ParsedRepoData {
    success: boolean;
    error?: string;
    title?: string;
    excerpt?: string;
    tags?: string[];
    repository?: {
        type: 'github' | 'gitlab' | 'other';
        url: string;
        name: string;
        description: string;
        stars: number;
        forks: number;
        language: string;
        topics: string[];
        license?: string;
    };
    sections?: any[]; // Keep sections loose or define strict if needed
}

/**
 * Parses a raw Georgian repository post into a structured PostData object
 */
export function parseRepositoryPost(text: string): ParsedRepoData {
    try {
        const data: Partial<ParsedRepoData> = {
            repository: {
                type: 'other',
                url: '',
                name: '',
                description: '',
                stars: 0,
                forks: 0,
                language: '',
                topics: [],
                license: ''
            },
            tags: [],
            sections: []
        };

        // 1. EXTRACT TITLE
        // Look for the first bold line or the first line if it's not a prompt
        const titleMatch = text.match(/\*\*([^*]+)\*\*/);
        if (titleMatch) {
            data.title = titleMatch[1].trim();
            if (data.repository) data.repository.name = data.title;
        }

        // 2. EXTRACT REPO URL
        const urlMatch = text.match(/https:\/\/github\.com\/[\w-]+\/[\w-._]+/);
        if (urlMatch) {
            if (data.repository) {
                data.repository.url = urlMatch[0];
                data.repository.type = 'github';
            }
        }

        // 3. EXTRACT DESCRIPTION
        // Look for text after the title or "Raa?" headers
        const descMatch = text.match(/GitHub-ზე შემთხვევით აღმოვაჩინე ([^—]+—)?\s*([\s\S]+?)(?:🛠|\n\n)/);
        if (descMatch) {
            if (data.repository) data.repository.description = descMatch[2].trim().replace(/\n/g, ' ');
            data.excerpt = data.repository?.description.slice(0, 160) + '...';
        }

        // 4. EXTRACT STATS
        const langMatch = text.match(/Language: #(\w+)/i);
        if (langMatch && data.repository) {
            data.repository.language = langMatch[1];
        }

        const starsMatch = text.match(/Stars: ([\d.]+)k?/i);
        if (starsMatch && data.repository) {
            let stars = parseFloat(starsMatch[1]);
            if (starsMatch[0].toLowerCase().includes('k')) stars *= 1000;
            data.repository.stars = Math.floor(stars);
        }

        // 5. EXTRACT TAGS
        const hashtagRegex = /#([\w\u10A0-\u10FF]+)/g;
        const tags = [...text.matchAll(hashtagRegex)].map(m => m[1]);
        if (tags.length > 0) {
            data.tags = [...new Set(tags)];
            if (data.repository) data.repository.topics = tags.slice(0, 5); // Use first 5 as topics
        }

        // 6. EXTRACT PROMPTS
        // Vertical
        const verticalMatch = text.match(/Format: Vertical 9:16[\s\S]+?Negative Prompt: [^\n]+/);
        if (verticalMatch) {
            data.sections?.push({
                type: 'prompt',
                icon: 'TbDeviceMobile',
                title: 'Vertical Prompt (9:16)',
                content: verticalMatch[0].trim()
            });
        }

        // Horizontal
        const horizontalMatch = text.match(/Format: Horizontal 16:9[\s\S]+?Negative Prompt: [^\n]+/);
        if (horizontalMatch) {
            data.sections?.push({
                type: 'prompt',
                icon: 'TbDeviceDesktop',
                title: 'Horizontal Prompt (16:9)',
                content: horizontalMatch[0].trim()
            });
        }

        // 7. BODY CONTENT (Features)
        // Extract the bullet points section "🛠"
        const featuresMatch = text.match(/🛠 \*\*[^]*?\*\*:\s*([\s\S]*?)📊/);
        if (featuresMatch) {
            data.sections?.unshift({
                type: 'section',
                icon: 'TbListCheck',
                title: 'Features',
                content: featuresMatch[1].trim()
            });
        }

        return { ...data, success: true } as ParsedRepoData;

    } catch (error: any) {
        return { success: false, error: error.message } as ParsedRepoData;
    }
}

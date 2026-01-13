
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

        const cleanText = text.trim();

        // 1. EXTRACT TITLE
        // First line typically: **Title**
        const titleMatch = cleanText.match(/^\*\*([^*]+)\*\*/);
        if (titleMatch) {
            data.title = titleMatch[1].trim();
            if (data.repository) data.repository.name = data.title;
        } else {
            // Fallback: look for the first bolded text anywhere early in the string
            const firstBold = cleanText.match(/^\s*\*\*([^*]+)\*\*/);
            if (firstBold) {
                data.title = firstBold[1].trim();
                if (data.repository) data.repository.name = data.title;
            }
        }

        // 2. EXTRACT DESCRIPTION
        // Text between specific markers. 
        // Strategy: 
        // Start: After the title (or beginning)
        // End: Before "🛠" (Tools/Features) 

        let descText = cleanText;
        const featuresIndex = cleanText.indexOf('🛠');
        if (featuresIndex !== -1) {
            descText = cleanText.substring(0, featuresIndex);
        }

        // Remove title line if it exists at the start
        descText = descText.replace(/^\*\*([^*]+)\*\*/, '');

        // Remove typical "intro" emojis or bolded query headers like "☁️ **Text?**"
        // We want to keep the text but remove the "header-like" formatting if possible, 
        // OR just treat the whole block as description.
        // User wants the emoji line to be part of the description usually, but maybe cleaned up?

        // Remove leading emojis and whitespace
        descText = descText.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/gmu, '');
        // Remove ALL ** markers from description (not just at start)
        descText = descText.replace(/\*\*/g, '');
        // Remove leading emojis again after cleanup
        descText = descText.replace(/^[☁️\s]+/u, '');

        descText = descText.trim();

        // Store clean description (no markdown)
        if (data.repository) data.repository.description = descText;
        // Strip any remaining special chars for excerpt
        const plainDesc = descText.replace(/[☁️]/gu, '').trim();
        data.excerpt = plainDesc.slice(0, 160) + '...';


        // 3. EXTRACT FEATURES (Body Content)
        // Content under 🛠 until 📊
        const featuresMatch = cleanText.match(/🛠\s*\*\*[^]*?\*\*:\s*([\s\S]*?)📊/);
        // Fallback: 🛠 ... up to next section or end if no stats
        const featuresMatchGeneric = cleanText.match(/🛠([\s\S]*?)(?:📊|🔗|Prompt:|--)/);

        let featuresContent = '';
        if (featuresMatch) {
            featuresContent = featuresMatch[1].trim();
        } else if (featuresMatchGeneric) {
            featuresContent = featuresMatchGeneric[1].trim();
        }
        // Remove all ** markers from features content
        featuresContent = featuresContent.replace(/\*\*/g, '');

        // Remove the header line like "რას გთავაზობს:"
        featuresContent = featuresContent.replace(/^[^\n]*გთავაზობს[^\n]*:?\s*/i, '');

        // Parse features into individual items with icons
        if (featuresContent) {
            // Split by lines starting with * or bullet points
            const featureLines = featuresContent
                .split(/\n/)
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .map(line => {
                    // Remove leading asterisks, bullets, dashes
                    return line.replace(/^[\*\-•]\s*/, '').trim();
                })
                .filter(line => line.length > 0);

            // Map features to icons based on content keywords
            const getFeatureIcon = (text: string): string => {
                const lower = text.toLowerCase();
                if (lower.includes('python') || lower.includes('დაწერილ') || lower.includes('script')) return 'TbBrandPython';
                if (lower.includes('download') || lower.includes('ჩამოტვირთ') || lower.includes('გადმოწერ')) return 'TbDownload';
                if (lower.includes('filter') || lower.includes('გაფილტვრა') || lower.includes('ფილტრ')) return 'TbFilter';
                if (lower.includes('folder') || lower.includes('დირექტორია') || lower.includes('დახარისხება')) return 'TbFolderOpen';
                if (lower.includes('cron') || lower.includes('scheduler') || lower.includes('დამგეგმავ') || lower.includes('ავტომატ')) return 'TbClock';
                if (lower.includes('docker') || lower.includes('container') || lower.includes('სერვერ')) return 'TbBrandDocker';
                if (lower.includes('2fa') || lower.includes('ავტორიზაცია') || lower.includes('auth')) return 'TbShieldCheck';
                if (lower.includes('photo') || lower.includes('ფოტო') || lower.includes('image') || lower.includes('სურათ')) return 'TbPhoto';
                if (lower.includes('video') || lower.includes('ვიდეო')) return 'TbVideo';
                if (lower.includes('backup') || lower.includes('ბექაპ')) return 'TbDatabaseExport';
                if (lower.includes('metadata') || lower.includes('მეტამონაცემ')) return 'TbFileInfo';
                if (lower.includes('album') || lower.includes('ალბომ')) return 'TbAlbum';
                if (lower.includes('face') || lower.includes('სახ')) return 'TbMoodSmile';
                if (lower.includes('date') || lower.includes('თარიღ') || lower.includes('წელი') || lower.includes('თვე')) return 'TbCalendar';
                if (lower.includes('resume') || lower.includes('გაგრძელება') || lower.includes('შეჩერება')) return 'TbPlayerPlay';
                return 'TbCheck'; // Default icon
            };

            // Create structured features array
            const featuresArray = featureLines.map(line => ({
                icon: getFeatureIcon(line),
                text: line
            }));

            data.sections?.push({
                type: 'section',
                icon: 'TbListCheck',
                title: 'Features',
                content: featuresContent, // Keep raw for backward compat
                features: featuresArray // New structured format
            });
        }

        // 4. EXTRACT STATS
        // 📊 **სტატისტიკა:**
        const langMatch = cleanText.match(/Language: #?([\w]+)/i);
        if (langMatch && data.repository) {
            data.repository.language = langMatch[1];
        }

        // Handle "Stars: 9.7k"
        const starsMatch = cleanText.match(/Stars: ([\d.]+)k?/i);
        if (starsMatch && data.repository) {
            let stars = parseFloat(starsMatch[1]);
            if (starsMatch[0].toLowerCase().includes('k')) stars *= 1000;
            data.repository.stars = Math.floor(stars);
        }

        // 5. EXTRACT REPO URL
        // 🔗 **GitHub რეპოზიტორი:**
        // [link](link) or just link
        const urlRegex = /https:\/\/github\.com\/[\w-]+\/[\w-._]+/;
        const urlMatch = cleanText.match(urlRegex);
        if (urlMatch) {
            if (data.repository) {
                data.repository.url = urlMatch[0];
                data.repository.type = 'github';
            }
        }

        // 6. EXTRACT TAGS
        // Hashtags at the end or typically in the text. 
        // Support Georgian characters with extended Unicode range (Mkhedruli + Asomtavruli)
        // Georgian: \u10A0-\u10FF (main), \u1C90-\u1CBF (extended), \u2D00-\u2D2F (supplement)
        const hashtagRegex = /#([\w\u10A0-\u10FF\u1C90-\u1CBF\u2D00-\u2D2F]+)/gu;
        const tags = [...cleanText.matchAll(hashtagRegex)].map(m => m[1]);
        if (tags.length > 0) {
            // Filter out common metadata tags if needed, or keep all
            data.tags = [...new Set(tags)];
            if (data.repository) {
                // Use first 5 unique tags as topics
                data.repository.topics = [...new Set(tags)].slice(0, 5);
            }
        }

        // 7. EXTRACT PROMPTS
        // User format:
        // Prompt:
        // Format: Vertical 9:16
        // ...
        // [SYSTEM END MARKER] or ---

        // Strategy: Split by "Prompt:" and parse chunks
        const promptBlocks = cleanText.split(/Prompt:\s*/i);

        // Skip the first block (main content)
        for (let i = 1; i < promptBlocks.length; i++) {
            const block = promptBlocks[i];

            // Determine format
            const isVertical = /Format: Vertical 9:16/i.test(block);
            const isHorizontal = /Format: Horizontal 16:9/i.test(block);

            // Clean up the block content
            // We want the text inside the block, including "Title Text", "Subject", etc.
            // Stop at [SYSTEM END MARKER] or --- if present
            let content = block.split('[SYSTEM END MARKER]')[0].split('---')[0].trim();

            if (content) {
                data.sections?.push({
                    type: 'prompt',
                    icon: isVertical ? 'TbDeviceMobile' : 'TbDeviceDesktop',
                    title: isVertical ? 'Vertical Prompt (9:16)' : (isHorizontal ? 'Horizontal Prompt (16:9)' : 'Image Prompt'),
                    content: content
                });
            }
        }

        return { ...data, success: true } as ParsedRepoData;

    } catch (error: any) {
        return { success: false, error: error.message } as ParsedRepoData;
    }
}

import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

interface ParsedSection {
    icon?: string  // lucide icon name (e.g., 'TrendingDown', 'Factory', 'Globe')
    title?: string
    content: string
    type: 'intro' | 'section' | 'sarcasm' | 'warning' | 'tip' | 'fact' | 'opinion' | 'cta' | 'hashtags' | 'prompt' | 'author-comment'
}

interface ParseResult {
    title: string
    excerpt: string
    sections: ParsedSection[]
    tags: string[]
    focusKeyword?: string  // From ⭐️ Text line
    telegramContent?: string  // Extracted PART 2 content for Telegram channel
    readingTime: number
}

// Emoji to Lucide icon mapping - for thematic sections
const EMOJI_TO_ICON: Record<string, string> = {
    // Analytics & Charts
    '📉': 'TrendingDown',
    '📈': 'TrendingUp',
    '📊': 'BarChart3',
    // Industry & Tech
    '🏭': 'Factory',
    '🤖': 'Bot',
    '⚙️': 'Cog',
    '🔧': 'Wrench',
    '🛠️': 'Hammer',
    // Global & Location
    '🌍': 'Globe',
    '🌐': 'Globe2',
    '🗺️': 'Map',
    // Warning & Status
    '🔴': 'AlertTriangle',
    '🟢': 'Lightbulb',
    '🟡': 'AlertCircle',
    '⚠️': 'AlertTriangle',
    // Facts & Vision
    '👁️': 'Eye',
    '👁': 'Eye',
    '👀': 'Eye',
    // Actions & CTA
    '👇': 'ArrowDown',
    '👆': 'ArrowUp',
    '👉': 'ArrowRight',
    // Creative & Entertainment
    '🎭': 'Theater',
    '🎬': 'Clapperboard',
    '🎥': 'Video',
    // Medical & Health
    '🧠': 'Brain',
    '💊': 'Pill',
    '🏥': 'Hospital',
    '❤️': 'Heart',
    // Money & Business
    '💰': 'Coins',
    '💵': 'DollarSign',
    '💎': 'Gem',
    '📦': 'Package',
    // Communication
    '💬': 'MessageCircle',
    '📢': 'Megaphone',
    '📣': 'Bell',
    // General markers
    '🔹': 'ChevronRight',
    '💧': 'Droplet',
    '⚡': 'Zap',
    '🔥': 'Flame',
    '💡': 'Lightbulb',
    '🎯': 'Target',
    '📌': 'Pin',
    '✨': 'Sparkles',
    '🧬': 'Dna',
    '🔗': 'Link',
    '📝': 'FileText',
    '🏆': 'Trophy',
}

// Function to get thematic icon based on content keywords
function getThematicIcon(content: string, title?: string): string {
    const text = (title || '') + ' ' + content.toLowerCase()

    // Medical/Health
    if (text.includes('ტვინ') || text.includes('ნეირო') || text.includes('brain') || text.includes('neuralink')) return 'Brain'
    if (text.includes('ქირურგ') || text.includes('ოპერაცი') || text.includes('surgery')) return 'Stethoscope'
    if (text.includes('სამკურნალო') || text.includes('medical')) return 'Heart'

    // Technology
    if (text.includes('რობოტ') || text.includes('ავტომატიზ') || text.includes('robot')) return 'Bot'
    if (text.includes('ხელოვნური ინტელექტ') || text.includes('ai ') || text.includes('ჩიპ')) return 'Cpu'
    if (text.includes('პროგრამა') || text.includes('software') || text.includes('კოდ')) return 'Code'

    // Business & Finance
    if (text.includes('ბიზნეს') || text.includes('მოგება') || text.includes('ფული') || text.includes('ტრილიონ')) return 'DollarSign'
    if (text.includes('ბაზარ') || text.includes('market')) return 'TrendingUp'
    if (text.includes('წარმოება') || text.includes('production') || text.includes('ინდუსტრი')) return 'Factory'

    // Global & Expansion
    if (text.includes('გლობალ') || text.includes('global') || text.includes('მსოფლიო') || text.includes('ქვეყან')) return 'Globe'
    if (text.includes('ექსპანსია') || text.includes('expansion') || text.includes('გაფართოება')) return 'TrendingUp'

    // Science
    if (text.includes('ფიზიკ') || text.includes('მეცნიერ') || text.includes('კანონ')) return 'Atom'
    if (text.includes('ფაქტ') || text.includes('fact')) return 'CheckCircle'

    // Default
    return 'ChevronRight'
}

// Strip bold markers (**) and clean content
function cleanContent(text: string): string {
    return text
        .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove ** markers, keep content
        .replace(/^\*\*|\*\*$/g, '')         // Remove orphan **
        .trim()
}

const SYSTEM_PROMPT = `შენ ხარ კონტენტ სტრუქტურატორი. შენი ამოცანაა ტექსტის დაყოფა სექციებად.

🚨🚨🚨 ᲧᲕᲔᲚᲐᲖᲔ ᲛᲜᲘᲨᲕᲜᲔᲚᲝᲕᲐᲜᲘ ᲬᲔᲡᲘ - INTRO ᲡᲔᲥᲪᲘᲐ:
intro = ყველაფერი სათაურის შემდეგ პირველ emoji-სექციამდე (🤯, 💀, 📉, 🔮 და ა.შ.)

❗❗❗ INTRO-ს ᲡᲘᲢᲧᲕᲐ-ᲡᲘᲢᲧᲕᲘᲗ უნდა დააკოპირო! არაფერი გამოტოვო!
- თუ intro-ში 2 პარაგრაფია = ორივე ჩართე
- თუ intro-ში 3 პარაგრაფია = სამივე ჩართე  
- თუ intro-ში 500 სიტყვაა = 500 სიტყვა ჩართე
- არ შეზღუდო სიგრძით! intro შეიძლება იყოს 1000+ სიმბოლო!

მაგალითი:
INPUT:
🐷 **ბოსი კოდს წერს?!**

**პირველი პარაგრაფი ბოლდით.**

მეორე პარაგრაფი გრძელი ტექსტით რომელიც აღწერს სიტუაციას დეტალურად.

🤯 **სექცია** - ტექსტი

ᲡᲬᲝᲠᲘ OUTPUT intro:
"content": "პირველი პარაგრაფი ბოლდით.\\n\\nმეორე პარაგრაფი გრძელი ტექსტით რომელიც აღწერს სიტუაციას დეტალურად."

❌ ᲐᲠᲐᲡᲬᲝᲠᲘ: "content": "პირველი პარაგრაფი ბოლდით." (მეორე გამოტოვებულია!)

სხვა წესები:
1. ტექსტი უნდა დარჩეს 100% ორიგინალი
2. წაშალე **bold მარკერები** - დატოვე მხოლოდ ტექსტი შიგნით
3. emoji-ები გადააკეთე icon სახელებად (📉→TrendingDown, 🏭→Factory)
4. გამოტოვე: www.ANDREWALTAIR.ge, Prompt:, 🎶, ⭐️, 🫣

მრავალნაწილიანი კონტენტი:
- PART 1 = მთავარი სტატია - დააპარსე
- PART 2 = telegram - გამოტოვე
- #hashtag ჯგუფის შემდეგ → SKIP_PART2
- მეორე #hashtag + --- → ავტორის კომენტარი

სექციების ტიპები:
- "intro" - შესავალი (სრული!)
- "section" - ჩვეულებრივი
- "warning" - 🔴
- "tip" - 🟢  
- "author-comment" - --- შემდეგ

JSON:
{
    "title": "სათაური (გაწმენდილი)",
    "excerpt": "პირველი 200 სიმბოლო intro-დან",
    "sections": [
        {"type": "intro", "content": "ᲡᲠᲣᲚᲘ INTRO - ᲧᲕᲔᲚᲐ ᲞᲐᲠᲐᲒᲠᲐᲤᲘ!"},
        {"type": "section", "icon": "IconName", "title": "სათაური", "content": "ტექსტი"}
    ],
    "tags": ["tag1"],
    "readingTime": 5
}

არ დაამატო არაფერი JSON-ის გარდა.`


async function callGroq(rawContent: string, apiKey: string): Promise<ParseResult> {
    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `გააანალიზე და დააპარსე ეს კონტენტი:\n\n${rawContent}` }
            ],
            temperature: 0.1,
            max_tokens: 8000,
        }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        console.error('Groq API error:', errorText)
        throw new Error('Groq API error')
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    // Parse JSON from response
    try {
        // Remove any markdown code blocks if present
        const cleanContent = content
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim()

        return JSON.parse(cleanContent)
    } catch (e) {
        console.error('Failed to parse AI response:', content)
        throw new Error('Failed to parse AI response as JSON')
    }
}

// Improved fallback parser with multi-part content handling
// Structure: PART1 (main) → hashtags → PART2 (skip telegram mirror) → hashtags → author comment
function fallbackParse(rawContent: string): ParseResult {
    const lines = rawContent.split('\n')
    const sections: ParsedSection[] = []
    let extractedTags: string[] = []

    // Find title - first non-empty, non-header line
    let title = 'პოსტი'
    let titleLineIndex = 0
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line && !line.startsWith('===') && !line.startsWith('---') && !line.startsWith('[PART')) {
            title = cleanContent(line.replace(/[\u{1F300}-\u{1F9FF}]+$/u, ''))
            titleLineIndex = i
            break
        }
    }

    let currentSection: ParsedSection | null = null
    let focusKeyword = '' // Extract from ⭐️ line
    let telegramLines: string[] = []  // Accumulate Telegram content

    // State machine for multi-part parsing
    // PART1 → after 1st hashtags → EXTRACT_PART2 → after 2nd hashtags+--- → AUTHOR_COMMENT → after --- → SKIP_PROMPTS
    type ParseState = 'PART1' | 'EXTRACT_PART2' | 'AUTHOR_COMMENT' | 'SKIP_PROMPTS'
    let state: ParseState = 'PART1'
    let hashtagCount = 0  // Track hashtag sections seen

    // Patterns
    const PROMPT_STARTERS = /^(Prompt:|Format:|Branding:|Quality:|Subject:|Composition:|Lighting:|Camera:|Environment:|Style:|Negative Prompt:|Role:|You are|Act as|System:)/i
    const SKIP_PATTERNS = /www\.ANDREWALTAIR\.ge|ANDREWALTAIR\.ge|შემოდით:|მეტი რესურსი:|🔗|🫣|გსურთ რაღაც.*Google-ში|იპოვეთ Andrew Altair/i
    const MUSIC_TEXT_SKIP = /^(🎶|⭐️|⭐|🫣)/
    const PART_HEADER = /^===.*\[PART\s*\d+/i
    const HASHTAG_LINE = /^#[\w\u10A0-\u10FF]+(\s+#[\w\u10A0-\u10FF]+)+/

    for (let i = titleLineIndex + 1; i < lines.length; i++) {
        const line = lines[i]
        const trimmed = line.trim()

        // Extract focusKeyword from ⭐️ line but don't skip yet
        if (trimmed.startsWith('⭐️') || trimmed.startsWith('⭐')) {
            const match = trimmed.match(/^[⭐️⭐]+\s*(?:Text:)?\s*['"]?(.+?)['"]?\s*$/i)
            if (match && match[1] && !focusKeyword) {
                focusKeyword = match[1].trim()
            }
        }

        // Skip patterns AFTER extracting focusKeyword
        if (SKIP_PATTERNS.test(trimmed) || MUSIC_TEXT_SKIP.test(trimmed)) {
            continue
        }
        
        // Handle empty lines - preserve them in intro and other sections
        if (!trimmed) {
            if (currentSection && state === 'PART1') {
                currentSection.content += '\n\n'
            }
            continue
        }

        // Skip PART headers (=== [PART 1: ...] ===)
        if (PART_HEADER.test(trimmed) || /^===/.test(trimmed)) {
            continue
        }

        // Detect hashtag lines - use for state transitions but DON'T add as section
        if (HASHTAG_LINE.test(trimmed) || (trimmed.startsWith('#') && trimmed.split('#').length > 2)) {
            hashtagCount++

            if (state === 'PART1') {
                // First hashtags - switch to extract PART 2 mode
                if (currentSection) sections.push(currentSection)
                // Extract tags for internal use
                extractedTags = (trimmed.match(/#[\u10A0-\u10FFa-zA-Z0-9_]+/g) || []).map(t => t.slice(1))
                currentSection = null
                state = 'EXTRACT_PART2'
            } else if (state === 'EXTRACT_PART2') {
                // Second hashtags in PART 2 - will transition to author comment on ---
                hashtagCount++
            }
            continue
        }

        // Detect --- separator (potential author comment start or section end)
        if (trimmed === '---') {
            // When in AUTHOR_COMMENT and we see ---, stop the author comment
            if (state === 'AUTHOR_COMMENT') {
                if (currentSection) {
                    sections.push(currentSection)
                    currentSection = null
                }
                state = 'SKIP_PROMPTS' // After author comment, skip everything else (prompts)
                continue
            }

            // After second hashtags + --- = author comment section starts
            if (state === 'EXTRACT_PART2' && hashtagCount >= 2) {
                state = 'AUTHOR_COMMENT'
                currentSection = null
            }
            continue
        }

        // Detect prompt sections - switch to skip mode
        if (PROMPT_STARTERS.test(trimmed)) {
            if (currentSection) {
                sections.push(currentSection)
                currentSection = null
            }
            state = 'SKIP_PROMPTS'
            continue
        }

        // Skip prompt content - once in SKIP_PROMPTS, stay there forever
        if (state === 'SKIP_PROMPTS') {
            continue
        }

        // Handle based on state
        if (state === 'EXTRACT_PART2') {
            // Extract Telegram content instead of skipping
            telegramLines.push(cleanContent(trimmed))
            continue
        }

        if (state === 'AUTHOR_COMMENT') {
            // Parse author comment section
            if (!currentSection) {
                currentSection = {
                    type: 'author-comment',
                    icon: 'MessageCircle',
                    title: 'ავტორის კომენტარი',
                    content: cleanContent(trimmed)
                }
            } else {
                currentSection.content += '\n' + cleanContent(trimmed)
            }
            continue
        }

        // PART1 - normal parsing
        if (state === 'PART1') {
            // Detect emoji-prefixed sections - FIRST check if line starts with emoji
            const emojiMatch = trimmed.match(/^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/u)
            if (emojiMatch) {
                // Save current intro section before starting new emoji section
                if (currentSection) {
                    sections.push(currentSection)
                    console.log('📝 Intro completed - final length:', currentSection.content.length, 'chars')
                }
                
                const emoji = emojiMatch[0]
                const restOfLine = trimmed.slice(emoji.length).trim()

                let sectionTitle: string | undefined
                let sectionContent = restOfLine
                const boldMatch = restOfLine.match(/^\*\*([^*]+)\*\*:?\s*(.*)/)
                if (boldMatch) {
                    sectionTitle = cleanContent(boldMatch[1])
                    sectionContent = cleanContent(boldMatch[2]) || ''
                } else {
                    sectionContent = cleanContent(restOfLine)
                }

                let type: ParsedSection['type'] = 'section'
                const iconFromEmoji = EMOJI_TO_ICON[emoji]
                let icon = iconFromEmoji || getThematicIcon(sectionContent, sectionTitle)

                if (emoji === '🔴') { type = 'warning'; icon = 'AlertTriangle' }
                else if (emoji === '🟢') { type = 'tip'; icon = 'Lightbulb' }
                else if (emoji === '👁️' || emoji === '👁') { type = 'fact'; icon = 'Eye' }
                else if (emoji === '👇') { type = 'cta'; icon = 'ArrowDown' }
                else if (emoji === '🎭') { type = 'sarcasm'; icon = 'Theater' }

                currentSection = { type, icon, title: sectionTitle, content: sectionContent }
                continue
            }

            // Handle opinion
            if (/^(მე ვფიქრობ|ჩემი აზრით|მე მჯერა)/u.test(trimmed)) {
                if (currentSection) sections.push(currentSection)
                currentSection = { type: 'opinion', icon: 'Quote', content: cleanContent(trimmed) }
                continue
            }

            // Regular content - accumulate into intro or current section
            // IMPORTANT: Don't use cleanContent here to avoid any text manipulation
            if (currentSection) {
                // Append to existing section (intro or regular)
                currentSection.content += '\n' + trimmed
                if (currentSection.type === 'intro') {
                    console.log('📝 Appending to intro:', trimmed.slice(0, 80), '... (total:', currentSection.content.length, 'chars)')
                }
            } else {
                // Create intro section - will accumulate all content until first emoji
                currentSection = { type: 'intro', content: trimmed }
                console.log('📝 Starting intro:', trimmed.slice(0, 80), '...')
            }
        }
    }

    if (currentSection) sections.push(currentSection)

    // Clean up sections
    const cleanSections = sections
        .map(s => ({ ...s, content: s.content.trim() }))
        .filter(s => s.content)

    // Debug: Log intro content length
    const introSection = cleanSections.find(s => s.type === 'intro')
    if (introSection) {
        console.log('📝 Intro parsed - length:', introSection.content.length, 'chars')
        console.log('📝 Intro first 100 chars:', introSection.content.slice(0, 100))
        console.log('📝 Intro last 100 chars:', introSection.content.slice(-100))
    }

    return {
        title: cleanContent(title),
        excerpt: cleanContent(introSection?.content || ''), // Use FULL intro as excerpt
        sections: cleanSections,
        tags: extractedTags,
        focusKeyword: focusKeyword || '', // From ⭐️ Text line
        telegramContent: telegramLines.join('\n\n').trim(), // Extracted PART 2 content
        readingTime: Math.max(1, Math.ceil(rawContent.split(/\s+/).length / 200))
    }
}


export async function POST(request: NextRequest) {
    try {
        const GROQ_API_KEY = process.env.GROQ_API_KEY
        if (!GROQ_API_KEY) {
            return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 })
        }

        const { rawContent } = await request.json()

        if (!rawContent || typeof rawContent !== 'string') {
            return NextResponse.json(
                { error: 'rawContent is required' },
                { status: 400 }
            )
        }

        let result: ParseResult

        // Using fallback regex parser - Groq AI was truncating intro content
        result = fallbackParse(rawContent)
        console.log('Parsed with fallback - intro length:', result.sections?.find(s => s.type === 'intro')?.content.length)

        return NextResponse.json({
            success: true,
            ...result
        })

    } catch (error) {
        console.error('Parse API error:', error)
        return NextResponse.json(
            { error: 'Failed to parse content' },
            { status: 500 }
        )
    }
}

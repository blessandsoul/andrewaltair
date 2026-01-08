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

const SYSTEM_PROMPT = `შენ ხარ კონტენტ სტრუქტურატორი. შენი ამოცანაა ტექსტის დაყოფა სექციებად და გაწმენდა.

⚠️ მთავარი წესები:
1. ტექსტი უნდა დარჩეს 100% ორიგინალი, სიტყვა-სიტყვით
2. წაშალე ყველა **bold მარკერი** - დატოვე მხოლოდ ტექსტი შიგნით
3. არ გამოიყენო emoji - გამოიყენე icon სახელები (lucide)

⚠️ მნიშვნელოვანი: მრავალნაწილიანი კონტენტი
- თუ ტექსტში არის === [PART 1: ...] და === [PART 2: ...] მარკერები:
  - PART 1 (FACEBOOK) = მთავარი სტატია - ეს უნდა დააპარსო
  - PART 2 (TELEGRAM) = შემოკლებული ვერსია - ეს უნდა გამოტოვო!
- პირველი #hashtag ჯგუფის შემდეგ ყველაფერი გამოტოვე, სანამ მეორე #hashtag ჯგუფს და --- მარკერს არ ნახავ
- --- მარკერის შემდეგ (თუ Prompt:-ით არ იწყება) = ავტორის ტექნიკური კომენტარი

როგორ მუშაობ:
1. იპოვე PART 1 (მთავარი სტატია) - ეს დააპარსე
2. გამოტოვე PART 2 (telegram mirror) მთლიანად  
3. emoji-ები გადააკეთე icon სახელებად (მაგ: 📉→TrendingDown, 🏭→Factory)
4. წაშალე **bold** მარკერები content-იდან და title-იდან
5. გამოტოვე www.ANDREWALTAIR.ge ლინკები, Prompt: სექციები, 🎶, ⭐️ და 🫣 ხაზები (რეკლამა)

სექციების ტიპები:
- "intro" - შესავალი
- "section" - ჩვეულებრივი სექცია
- "warning" - გაფრთხილება (🔴 → icon: AlertTriangle)
- "tip" - რჩევა (🟢 → icon: Lightbulb)
- "fact" - ფაქტი (👁️ → icon: Eye)
- "opinion" - პირადი მოსაზრება
- "author-comment" - ავტორის ტექნიკური კომენტარი (--- მარკერით გამოყოფილი)

Icon მაგალითები:
📉→TrendingDown, 🏭→Factory, 🌍→Globe, 🔴→AlertTriangle, 🟢→Lightbulb, 👁️→Eye, 🎭→Theater, 🧠→Brain, 🤖→Bot

JSON ფორმატი:
{
    "title": "სათაური emoji-ს და **-ს გარეშე",
    "excerpt": "შესავალი 200 სიმბოლომდე (გაწმენდილი)",
    "sections": [
        {"type": "intro", "content": "გაწმენდილი ტექსტი **-ს გარეშე"},
        {"type": "section", "icon": "TrendingDown", "title": "სათაური", "content": "გაწმენდილი ტექსტი"},
        {"type": "author-comment", "icon": "MessageCircle", "content": "ტექნიკური კომენტარი"}
    ],
    "tags": ["tag1", "tag2"],
    "readingTime": 5
}

❌ არასწორი: PART 2-ის კონტენტის ჩართვა, **bold** მარკერების დატოვება
✅ სწორი: მხოლოდ PART 1, გაწმენდილი ტექსტი + lucide icon სახელები

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

    // State machine for multi-part parsing
    // PART1 → after 1st hashtags → SKIP_PART2 → after 2nd hashtags+--- → AUTHOR_COMMENT → after --- → SKIP_PROMPTS
    type ParseState = 'PART1' | 'SKIP_PART2' | 'AUTHOR_COMMENT' | 'SKIP_PROMPTS'
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

        // Always skip these regardless of state - but extract focusKeyword from ⭐️ line first
        if (!trimmed || SKIP_PATTERNS.test(trimmed)) {
            if (!trimmed && currentSection && state === 'PART1') {
                currentSection.content += '\n'
            }
            continue
        }

        // Extract focusKeyword ONLY from ⭐️ Text line (not 🎶 music line)
        if (MUSIC_TEXT_SKIP.test(trimmed)) {
            // Only extract from ⭐️ lines, not 🎶 (music) lines
            if (trimmed.startsWith('⭐️') || trimmed.startsWith('⭐')) {
                // Extract text after ⭐️ or ⭐️ Text:
                const match = trimmed.match(/^[⭐️⭐]+\s*(?:Text:)?\s*['"]?(.+?)['"]?\s*$/i)
                if (match && match[1] && !focusKeyword) {
                    focusKeyword = match[1].trim()
                }
            }
            // Skip both ⭐️ and 🎶 lines from content
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
                // First hashtags - switch to skip mode, but don't add hashtags to sections
                if (currentSection) sections.push(currentSection)
                // Extract tags for internal use but don't add hashtags section to content
                extractedTags = (trimmed.match(/#[\u10A0-\u10FFa-zA-Z0-9_]+/g) || []).map(t => t.slice(1))
                currentSection = null
                state = 'SKIP_PART2'
            } else if (state === 'SKIP_PART2') {
                // Second hashtags - prepare for author comment
                // Look ahead for --- which signals author comment
                state = 'SKIP_PART2' // Stay in skip until we see ---
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
            if (state === 'SKIP_PART2' && hashtagCount >= 2) {
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
        if (state === 'SKIP_PART2') {
            continue // Skip all PART2 content
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
            // Detect emoji-prefixed sections
            const emojiMatch = trimmed.match(/^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/u)
            if (emojiMatch) {
                if (currentSection) sections.push(currentSection)
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

            // Regular content
            if (currentSection) {
                currentSection.content += '\n' + cleanContent(trimmed)
            } else {
                currentSection = { type: 'intro', content: cleanContent(trimmed) }
            }
        }
    }

    if (currentSection) sections.push(currentSection)

    // Clean up sections
    const cleanSections = sections
        .map(s => ({ ...s, content: s.content.trim() }))
        .filter(s => s.content)

    return {
        title: cleanContent(title),
        excerpt: cleanContent(cleanSections.find(s => s.type === 'intro')?.content.slice(0, 200) || ''),
        sections: cleanSections,
        tags: extractedTags,
        focusKeyword: focusKeyword || '', // From ⭐️ Text line
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

        try {
            // Try AI parsing first
            result = await callGroq(rawContent, GROQ_API_KEY)
        } catch (aiError) {
            console.error('AI parsing failed, using fallback:', aiError)
            // Use fallback regex parser
            result = fallbackParse(rawContent)
        }

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

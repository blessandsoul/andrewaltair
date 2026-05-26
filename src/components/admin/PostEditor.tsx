"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TbDeviceFloppy, TbEye, TbX, TbPlus, TbPhoto, TbFileText, TbTag, TbFolder, TbClock, TbStar, TbFlame, TbWorld, TbArrowLeft, TbWand, TbDeviceDesktop, TbDeviceMobile, TbTrash, TbChevronDown, TbChevronUp, TbSparkles, TbUpload, TbLoader2, TbFileCheck, TbLayout, TbCheck, TbArrowUp, TbArrowDown, TbRobot, TbAtom, TbBrandTelegram, TbBrandGithub, TbBrandGitlab, TbGitFork, TbCode, TbUsers, TbBook, TbGlobe, TbRefresh, TbHash } from "react-icons/tb"

import { parsePostContent, extractTitle, extractExcerpt, calculateReadingTime, parseMultiChannelContent } from "@/lib/PostContentParser"
import { RichPostContent } from "@/components/blog/RichPostContent"
import { useAutosave, formatTimeSince } from "@/hooks/useAutosave"
import { POST_TEMPLATES, type PostTemplate } from "@/lib/postTemplates"
import { VideoEmbed, type VideoData } from "@/components/admin/VideoEmbed"
import { RelatedPostsSuggestions } from "@/components/admin/RelatedPostsSuggestions"

// Categories available
// Categories available
const CATEGORIES = [
    { value: "technology", label: "ტექნოლოგიები", icon: TbDeviceDesktop },
    { value: "economy", label: "ეკონომიკა", icon: TbClock },
    { value: "politics", label: "პოლიტიკა", icon: TbWorld },
    { value: "business", label: "ბიზნესი", icon: TbFolder },
    { value: "science", label: "მეცნიერება", icon: TbAtom },
    { value: "society", label: "საზოგადოება", icon: TbUsers },
    { value: "education", label: "განათლება", icon: TbBook },
    { value: "world", label: "მსოფლიო", icon: TbGlobe },
]

interface Section {
    icon?: string;
    title?: string;
    content: string;
    type: 'intro' | 'section' | 'sarcasm' | 'warning' | 'tip' | 'fact' | 'opinion' | 'cta' | 'hashtags' | 'author-comment' | 'image' | 'prompt' | 'quote' | 'graph';
}

interface GalleryImage {
    src: string;
    alt?: string;
    caption?: string;
}

interface CoverImages {
    horizontal?: string;
    vertical?: string;
}

export interface PostData {
    id?: string
    numericId?: string
    slug: string
    title: string
    type: "library" | "news" | "tutorial" | "insight"
    excerpt: string
    content: string
    rawContent: string
    categories: string[]
    tags: string[]
    coverImage: string
    coverImages: CoverImages
    gallery: GalleryImage[]
    sections: Section[]
    author: {
        name: string
        avatar: string
        role: string
    }
    publishedAt: string
    readingTime: number
    views: number
    reactions: {
        fire: number
        love: number
        mindblown: number
        applause: number
        insightful: number
    }
    featured: boolean
    trending: boolean
    status: "draft" | "published" | "scheduled"
    scheduledFor?: string
    relatedPosts?: string[]
    videos?: { url: string; platform: 'youtube' | 'vimeo'; thumbnailUrl?: string }[]
    seo: {
        metaTitle: string
        metaDescription: string
        keywords: string
        canonicalUrl: string
        focusKeyword: string
        seoScore: number
        ogImage: string
    }
    prompts?: {
        photoPrompt: string
        photoResult: string
        videoPrompt: string
        videoResult: string
        music: string
    }
    telegramContent?: string
    telegramButtonText?: string
    postToTelegram?: boolean
    repository?: {
        type: 'github' | 'gitlab' | 'other'
        url: string
        name: string
        description: string
        stars: number
        forks: number
        language: string
        topics: string[]
        license?: string
    }
    keyPoints?: string[]
    faq?: { question: string, answer: string }[]
    entities?: string[]
    sources?: ParsedSource[]
    wordCount?: number
    // Tutorial Specific
    intro?: string
    tools?: string
    modules?: { title: string; quote: string; explanation: string }[]
    conclusion?: string
    metaAdvice?: string
    character?: string
    songTrack?: string
    // Insight specific
    sourceUrl?: string
}

const DEFAULT_POST: PostData = {
    numericId: "",
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    rawContent: "",
    categories: ["technology"],
    tags: [],
    coverImage: "",
    coverImages: {},
    gallery: [],
    sections: [],
    author: {
        name: "Andrew Altair",
        avatar: "/images/avatar.jpg",
        role: "AI ინოვატორი"
    },
    publishedAt: new Date().toISOString().split("T")[0],
    readingTime: 1,
    views: 0,
    reactions: { fire: 0, love: 0, mindblown: 0, applause: 0, insightful: 0 },
    featured: false,
    trending: false,

    type: "news",
    status: "published",
    scheduledFor: undefined,
    relatedPosts: [],
    videos: [],
    seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: "",
        canonicalUrl: "",
        focusKeyword: "",
        seoScore: 0,
        ogImage: ""
    },
    prompts: {
        photoPrompt: "",
        photoResult: "",
        videoPrompt: "",
        videoResult: "",
        music: ""
    },
    telegramContent: "",
    telegramButtonText: "",
    postToTelegram: true,
    keyPoints: [],
    faq: [],
    entities: []
}

function generateSlug(title: string): string {
    const geo: Record<string, string> = {
        'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v', 'ზ': 'z',
        'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o',
        'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's', 'ტ': 't', 'უ': 'u', 'ფ': 'p',
        'ქ': 'q', 'ღ': 'gh', 'ყ': 'y', 'შ': 'sh', 'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz',
        'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h'
    }

    let slug = title.toLowerCase()
    for (const [char, lat] of Object.entries(geo)) {
        slug = slug.replace(new RegExp(char, 'g'), lat)
    }

    return slug
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
}

// ─── Sources Interpreter ─────────────────────────────────────────────────────

interface ParsedSource {
    index: number
    outlet: string
    title: string
    url: string
    keyFact: string
    context: string
}

function serializeSources(sources: ParsedSource[] | undefined): string {
    if (!sources || sources.length === 0) return ''
    return sources.map(s =>
        `${s.index}. ${s.outlet}: "${s.title}"\n   - URL: ${s.url}${s.keyFact ? `\n   - Key Fact: ${s.keyFact}` : ''}${s.context ? `\n   - Context: ${s.context}` : ''}`
    ).join('\n\n')
}

function parseSources(raw: string): ParsedSource[] {
    const sources: ParsedSource[] = []
    const blocks = raw.split(/\n(?=\d+\.\s)/).filter(Boolean)

    for (const block of blocks) {
        const lines = block.trim().split('\n').map(l => l.trim())
        const headerMatch = lines[0]?.match(/^(\d+)\.\s+(.+?):\s+"(.+)"$/)
        if (!headerMatch) continue

        const index = parseInt(headerMatch[1], 10)
        const outlet = headerMatch[2].trim()
        const title = headerMatch[3].trim()

        let url = ''
        let keyFact = ''
        let context = ''

        for (const line of lines.slice(1)) {
            if (line.startsWith('- URL:')) url = line.replace('- URL:', '').trim()
            else if (line.startsWith('- Key Fact:')) keyFact = line.replace('- Key Fact:', '').trim()
            else if (line.startsWith('- Context:')) context = line.replace('- Context:', '').trim()
        }

        sources.push({ index, outlet, title, url, keyFact, context })
    }

    return sources
}

function SourcesInterpreter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const sources = React.useMemo(() => parseSources(value), [value])

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-xs font-medium flex items-center gap-1">
                    <TbBook className="w-3 h-3" />
                    Sources (links.md)
                </label>
                {sources.length > 0 && (
                    <span className="text-xs text-muted-foreground">{sources.length} parsed</span>
                )}
            </div>

            <textarea
                className="w-full min-h-40 p-4 font-mono text-sm bg-zinc-950 text-zinc-100 rounded-lg resize-y"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={"# Sources\n\n1. Outlet Name: \"Article Title\"\n   - URL: https://example.com\n   - Key Fact: ...\n   - Context: ..."}
            />

            {sources.length === 0 && value.trim() && (
                <p className="text-xs text-destructive px-1">
                    Could not parse. Expected format: <code className="font-mono">1. Outlet: "Title"</code>
                </p>
            )}

            {sources.length > 0 && (
                <div className="space-y-2">
                {sources.map((src) => (
                    <Card key={src.index} className="overflow-hidden">
                        <div className="flex items-stretch">
                            {/* Index badge */}
                            <div className="w-12 shrink-0 bg-primary/10 flex items-center justify-center">
                                <span className="text-xl font-bold text-primary">{src.index}</span>
                            </div>

                            <CardContent className="p-4 flex-1 min-w-0 space-y-2">
                                {/* Outlet + Title */}
                                <div>
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                        {src.outlet}
                                    </span>
                                    <p className="font-semibold text-sm leading-snug">{src.title}</p>
                                </div>

                                {/* URL */}
                                {src.url && (
                                    <a
                                        href={src.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs text-primary hover:underline truncate"
                                    >
                                        <TbWorld className="w-3 h-3 shrink-0" />
                                        <span className="truncate">{src.url}</span>
                                    </a>
                                )}

                                {/* Key Fact */}
                                {src.keyFact && (
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-md px-3 py-2">
                                        <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-600 mb-0.5">Key Fact</p>
                                        <p className="text-xs text-foreground/80">{src.keyFact}</p>
                                    </div>
                                )}

                                {/* Context */}
                                {src.context && (
                                    <p className="text-xs text-muted-foreground italic">{src.context}</p>
                                )}
                            </CardContent>
                        </div>
                    </Card>
                ))}
                </div>
            )}
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────

interface PostEditorProps {
    initialData?: Partial<PostData>
    onSave: (data: PostData) => Promise<void> | void
    onCancel: () => void
    isEditing?: boolean
}

export function PostEditor({ initialData, onSave, onCancel, isEditing = false }: PostEditorProps) {
    const [post, setPost] = React.useState<PostData>({
        ...DEFAULT_POST,
        ...initialData
    })

    // Editor Mode State
    const [editorMode, setEditorMode] = React.useState<'visual' | 'json'>('json')
    const [jsonInput, setJsonInput] = React.useState('')
    const [parsedSections, setParsedSections] = React.useState<Section[]>([])
    const [sourcesInput, setSourcesInput] = React.useState(() => serializeSources(initialData?.sources))

    // Upload States
    const [isUploadingH, setIsUploadingH] = React.useState(false)
    const [isUploadingV, setIsUploadingV] = React.useState(false)
    const [isGeneratingCode, setIsGeneratingCode] = React.useState(false)
    const [isSaving, setIsSaving] = React.useState(false)
    const [jsonError, setJsonError] = React.useState<string | null>(null)

    // Safe save handler to prevent double submission
    const handleSaveClick = async () => {
        if (isSaving) return // Prevent double click
        setIsSaving(true)
        try {
            await onSave(post)
        } finally {
            setIsSaving(false)
        }
    }

    // File Upload Handler
    const handleFileUpload = async (file: File, type: 'horizontal' | 'vertical') => {
        if (type === 'horizontal') setIsUploadingH(true)
        else setIsUploadingV(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || errorData.message || 'Upload failed')
            }

            const result = await response.json()

            setPost(prev => ({
                ...prev,
                coverImages: { ...prev.coverImages, [type]: result.data.url } // Fix: access data.url since apiSuccess wraps it
            }))
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'ატვირთვა ვერ მოხერხდა'
            alert(message)
        } finally {
            if (type === 'horizontal') setIsUploadingH(false)
            else setIsUploadingV(false)
        }
    }

    // Generate unique numericId code
    const handleGenerateCode = async () => {
        if (isGeneratingCode) return
        setIsGeneratingCode(true)
        try {
            const res = await fetch('/api/posts/generate-code')
            if (!res.ok) throw new Error('კოდის გენერაცია ვერ მოხერხდა')
            const data = await res.json()
            if (data.code) {
                setPost(prev => ({ ...prev, numericId: data.code }))
            }
        } catch (error: unknown) {
            alert(error instanceof Error ? error.message : 'კოდის გენერაცია ვერ მოხერხდა')
        } finally {
            setIsGeneratingCode(false)
        }
    }

    // Sync parsed sources → post.sources.
    // Only wipe sources when textarea is fully empty — partial / malformed text keeps previous sources
    // intact (Gemini already populated them via JSON paste, don't lose data on a bad keystroke).
    React.useEffect(() => {
        const trimmed = sourcesInput.trim()
        if (!trimmed) {
            setPost(prev => (prev.sources && prev.sources.length > 0 ? { ...prev, sources: [] } : prev))
            return
        }
        const parsed = parseSources(sourcesInput)
        if (parsed.length === 0) return // bad parse — keep previous sources
        setPost(prev => ({ ...prev, sources: parsed }))
    }, [sourcesInput])

    // JSON Sync Logic
    React.useEffect(() => {
        if (editorMode === 'json' && !jsonInput && post.sections.length > 0) {
            setJsonInput(JSON.stringify(post.sections, null, 2))
            setParsedSections(post.sections)
        }
    }, [editorMode, post.sections])

    React.useEffect(() => {
        try {
            setJsonError(null) // Clear previous error
            if (jsonInput) {
                const parsed = JSON.parse(jsonInput)

                // 0. Auto-detect Type
                if (parsed.type === 'tutorial' || parsed.meta?.type === 'tutorial') {
                    setPost(prev => ({ ...prev, type: 'tutorial' }))
                }
                if (parsed.type === 'insight' || parsed.sourceUrl) {
                    setPost(prev => ({
                        ...prev,
                        type: 'insight' as const,
                        sourceUrl: parsed.sourceUrl || '',
                        rawContent: parsed.content || prev.rawContent,
                    }))
                }

                // Helper to sanitize sections
                const sanitizeSections = (sections: Section[]) => {
                    const extractedTags: string[] = []
                    const cleaned = sections.map((s: Section) => {
                        let newTitle = s.title
                        let newContent = s.content

                        // 1. Rename TL;DR
                        if (newTitle === 'TL;DR' || newTitle === 'tl;dr') {
                            newTitle = 'მოკლედ'
                        }

                        // 2. Strip leading emojis/VS16 from content
                        const cleaningRegex = /^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|\u{FE0F}| )/u
                        while (newContent && cleaningRegex.test(newContent)) {
                            newContent = newContent.replace(cleaningRegex, '').trim()
                        }

                        // 3. Extract Hashtags (and don't render them)
                        if (s.type === 'hashtags' || (newContent && newContent.includes('#') && newContent.split(' ').every(w => w.startsWith('#')))) {
                            const tags = newContent.match(/#[\w\u10A0-\u10FF]+/g) || []
                            tags.forEach(t => extractedTags.push(t.replace('#', '')))
                            return null // Filter out this section
                        }

                        return { ...s, title: newTitle, content: newContent }
                    }).filter(Boolean) as Section[]

                    return { cleaned, extractedTags }
                }

                if (Array.isArray(parsed)) {
                    // LEGACY: Just sections
                    const { cleaned, extractedTags } = sanitizeSections(parsed)
                    setParsedSections(cleaned)
                    setPost(prev => ({
                        ...prev,
                        sections: cleaned,
                        tags: extractedTags.length > 0 ? Array.from(new Set([...(prev.tags || []), ...extractedTags])) : prev.tags
                    }))
                } else if (typeof parsed === 'object' && parsed !== null) {
                    // NEW: Full Article Object — accepts BOTH formats:
                    //   - Legacy meta-wrapped: { meta: {title, slug, category, tags, author}, seo: {excerpt, key_points, faq, entities}, content: [...], telegram: {...} }
                    //   - Flat (Alpha gem 2026-05): { title, slug, excerpt, author, categories, tags, seo: {metaTitle, metaDescription, keywords, focusKeyword, canonicalUrl, ogImage}, keyPoints, faq, entities, sources, sections, readingTime, wordCount, publishedAt }
                    setPost(prev => {
                        const newData = { ...prev }
                        const meta = parsed.meta || {}

                        // Category normalization map — shared by both formats
                        const catMap: Record<string, string> = {
                            'technology': 'technology', 'tehnologia': 'technology', 'tech': 'technology',
                            'economy': 'economy', 'politics': 'politics', 'business': 'business',
                            'science': 'science', 'society': 'society', 'education': 'education', 'world': 'world',
                            'ტექნოლოგიები': 'technology', 'ტექნოლოგია': 'technology',
                            'ეკონომიკა': 'economy', 'პოლიტიკა': 'politics', 'ბიზნესი': 'business',
                            'მეცნიერება': 'science', 'საზოგადოება': 'society',
                            'განათლება': 'education', 'მსოფლიო': 'world',
                            'ai': 'technology', 'news': 'world', 'articles': 'technology'
                        }
                        const normalizeCategory = (c: string) => catMap[c.toLowerCase()] || 'technology'

                        // 1. Title / Slug — top-level OR meta-nested
                        const title = parsed.title || meta.title
                        const slug = parsed.slug || meta.slug
                        if (title) newData.title = title
                        if (slug) newData.slug = slug

                        // 2. Category — accept string (legacy meta.category) OR array (flat categories[])
                        if (Array.isArray(parsed.categories) && parsed.categories.length > 0) {
                            newData.categories = parsed.categories.map((c: string) => normalizeCategory(c))
                        } else if (meta.category) {
                            newData.categories = [normalizeCategory(meta.category)]
                        }

                        // 3. Tags
                        const tagsSource = (Array.isArray(parsed.tags) && parsed.tags) || (Array.isArray(meta.tags) && meta.tags)
                        if (tagsSource) newData.tags = tagsSource as string[]

                        // 4. Author
                        const author = parsed.author || meta.author
                        if (author) {
                            newData.author = { ...prev.author, ...author }
                            if (author.name === 'ალფა' && !author.avatar) {
                                newData.author.avatar = '/images/authors/alpha.png'
                                newData.author.role = newData.author.role || 'AI ანალიტიკოსი'
                            }
                        }

                        // 5. Excerpt — top-level wins, fallback seo.excerpt / meta.excerpt
                        const excerpt = parsed.excerpt || parsed.seo?.excerpt || meta.excerpt
                        if (excerpt) newData.excerpt = excerpt

                        // 6. SEO subdoc — flat new format (metaTitle/metaDescription/keywords/...)
                        if (parsed.seo && typeof parsed.seo === 'object') {
                            newData.seo = {
                                ...prev.seo,
                                metaTitle: parsed.seo.metaTitle || prev.seo.metaTitle,
                                metaDescription: parsed.seo.metaDescription || prev.seo.metaDescription,
                                keywords: parsed.seo.keywords || prev.seo.keywords,
                                focusKeyword: parsed.seo.focusKeyword || prev.seo.focusKeyword,
                                canonicalUrl: parsed.seo.canonicalUrl || prev.seo.canonicalUrl,
                                ogImage: parsed.seo.ogImage || prev.seo.ogImage,
                                seoScore: prev.seo.seoScore,
                            }
                        }

                        // 7. keyPoints / faq / entities — top-level wins (flat), fallback seo.* (legacy)
                        const keyPointsSrc = parsed.keyPoints || parsed.seo?.key_points || meta.key_points
                        if (Array.isArray(keyPointsSrc)) newData.keyPoints = keyPointsSrc

                        const faqSrc = parsed.faq || parsed.seo?.faq || meta.faq
                        if (Array.isArray(faqSrc)) {
                            newData.faq = faqSrc.map((item: any) => ({
                                question: item.question || item.q || '',
                                answer: item.answer || item.a || '',
                            }))
                        }

                        const entitiesSrc = parsed.entities || parsed.seo?.entities || meta.entities
                        if (Array.isArray(entitiesSrc)) newData.entities = entitiesSrc

                        // 8. Sources — flat top-level. Auto-fill the links.md textarea so the visual
                        // card view + downstream effect stay in sync. Gem already structured them — no
                        // separate paste needed.
                        if (Array.isArray(parsed.sources) && parsed.sources.length > 0) {
                            newData.sources = parsed.sources
                            setSourcesInput(serializeSources(parsed.sources as ParsedSource[]))
                        }

                        // 9. readingTime / wordCount / publishedAt
                        if (typeof parsed.readingTime === 'number') newData.readingTime = parsed.readingTime
                        if (typeof parsed.wordCount === 'number') newData.wordCount = parsed.wordCount
                        if (parsed.publishedAt) newData.publishedAt = parsed.publishedAt

                        // 10. Sections — flat `sections[]` wins, fallback legacy `content[]`
                        const sectionsSrc = Array.isArray(parsed.sections) ? parsed.sections
                            : Array.isArray(parsed.content) ? parsed.content
                            : null
                        if (sectionsSrc) {
                            const { cleaned, extractedTags } = sanitizeSections(sectionsSrc)
                            newData.sections = cleaned
                            setParsedSections(cleaned)
                            if (extractedTags.length > 0) {
                                newData.tags = Array.from(new Set([...(newData.tags || []), ...extractedTags]))
                            }
                        }

                        // 11. Telegram — legacy only (Alpha gem 2026-05+ no longer emits this)
                        if (parsed.telegram) {
                            newData.telegramContent = parsed.telegram.text || ''
                            newData.telegramButtonText = parsed.telegram.button_text || ''
                            newData.postToTelegram = true
                        }

                        // 5. Tutorial Specifics (If detected)
                        if (newData.type === 'tutorial' || parsed.type === 'tutorial') {
                            if (parsed.intro) newData.intro = parsed.intro
                            if (parsed.tools) newData.tools = parsed.tools
                            if (parsed.modules) newData.modules = parsed.modules
                            if (parsed.conclusion) newData.conclusion = parsed.conclusion
                            if (parsed.meta_advice) newData.metaAdvice = parsed.meta_advice
                            if (parsed.meta?.character) newData.author.role = parsed.meta.character // Fun hack: put character in role
                            if (parsed.song_track) newData.songTrack = parsed.song_track

                            // GENERATE PREVIEW SECTIONS FOR TUTORIAL
                            const tutorialSections: Section[] = []

                            // 1. Intro
                            if (parsed.intro) {
                                tutorialSections.push({ type: 'intro', content: parsed.intro })
                            }

                            // 2. Tools
                            if (parsed.tools) {
                                tutorialSections.push({
                                    type: 'tip',
                                    title: '🛠️ საჭირო ინსტრუმენტები',
                                    content: parsed.tools
                                })
                            }

                            // 3. Modules
                            if (parsed.modules && Array.isArray(parsed.modules)) {
                                parsed.modules.forEach((mod: any) => {
                                    if (mod.quote) {
                                        tutorialSections.push({
                                            type: 'quote',
                                            content: `**${mod.quote}**`
                                        })
                                    }
                                    tutorialSections.push({
                                        type: 'section',
                                        title: mod.title,
                                        content: mod.explanation
                                    })
                                })
                            }

                            // 4. Conclusion
                            if (parsed.conclusion) {
                                tutorialSections.push({
                                    type: 'fact',
                                    title: '🏁 დასკვნა',
                                    content: parsed.conclusion
                                })
                            }

                            // 5. Meta Advice
                            if (parsed.meta_advice) {
                                tutorialSections.push({
                                    type: 'author-comment',
                                    content: parsed.meta_advice
                                })
                            }

                            setParsedSections(tutorialSections)
                            newData.sections = tutorialSections
                        }

                        return newData
                    })
                }
            }
        } catch (e: unknown) {
            // Auto-detect plain text insight: contains წყარო: (source) with URL
            const sourceMatch = jsonInput.match(/წყარო:\s*(https?:\/\/\S+)/i)
                || jsonInput.match(/Source:\s*(https?:\/\/\S+)/i)
            if (sourceMatch) {
                setJsonError(null)
                const sourceUrl = sourceMatch[1]
                const content = jsonInput
                    .replace(/წყარო:\s*https?:\/\/\S+/i, '')
                    .replace(/Source:\s*https?:\/\/\S+/i, '')
                    .trim()
                setPost(prev => ({
                    ...prev,
                    type: 'insight' as const,
                    sourceUrl,
                    rawContent: content,
                    content: content,
                    title: content.slice(0, 60).replace(/\n/g, ' '),
                    excerpt: content.slice(0, 160).replace(/\n/g, ' '),
                }))
            } else {
                setJsonError(e instanceof Error ? e.message : 'Invalid JSON')
            }
        }
    }, [jsonInput])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Post Editor (Skeleton)</h1>
                <div className="flex gap-2">
                    <div className="flex bg-muted p-1 rounded-lg">
                        <Button
                            variant={editorMode === 'visual' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setEditorMode('visual')}
                            className="text-xs"
                        >
                            <TbLayout className="w-3 h-3 mr-1" />
                            Visual
                        </Button>
                        <Button
                            variant={editorMode === 'json' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setEditorMode('json')}
                            className="text-xs"
                        >
                            <TbCode className="w-3 h-3 mr-1" />
                            JSON
                        </Button>
                    </div>
                </div>
            </div>

            {editorMode === 'json' ? (
                <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader><CardTitle>JSON Input & Assets</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            {/* Cover Images */}
                            <div className="flex gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Cover (16:9)</label>
                                    <div className="relative w-32 aspect-video bg-muted rounded overflow-hidden border group">
                                        {post.coverImages?.horizontal ? (
                                            <img src={post.coverImages.horizontal} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-muted-foreground text-[10px]">No Image</div>
                                        )}
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'horizontal')} />
                                            <TbUpload className="w-5 h-5 text-white" />
                                        </label>
                                        {isUploadingH && <div className="absolute inset-0 flex items-center justify-center bg-black/50"><TbLoader2 className="w-5 h-5 animate-spin text-white" /></div>}
                                    </div>
                                    <Input value={post.coverImages?.horizontal || ''} onChange={(e) => setPost(prev => ({ ...prev, coverImages: { ...prev.coverImages, horizontal: e.target.value } }))} placeholder="URL..." className="text-[10px] w-32 h-6 font-mono" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Vertical (9:16)</label>
                                    <div className="relative w-16 aspect-9/16 bg-muted rounded overflow-hidden border group">
                                        {post.coverImages?.vertical ? (
                                            <img src={post.coverImages.vertical} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-muted-foreground text-[10px]">No Image</div>
                                        )}
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'vertical')} />
                                            <TbUpload className="w-4 h-4 text-white" />
                                        </label>
                                        {isUploadingV && <div className="absolute inset-0 flex items-center justify-center bg-black/50"><TbLoader2 className="w-4 h-4 animate-spin text-white" /></div>}
                                    </div>
                                    <Input value={post.coverImages?.vertical || ''} onChange={(e) => setPost(prev => ({ ...prev, coverImages: { ...prev.coverImages, vertical: e.target.value } }))} placeholder="URL..." className="text-[10px] w-16 h-6 font-mono" />
                                </div>
                            </div>

                            {/* Metadata Inputs */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Title</label>
                                    <Input value={post.title} onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value, slug: generateSlug(e.target.value) }))} placeholder="Post Title" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Slug</label>
                                    <Input value={post.slug} onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))} placeholder="post-slug" className="font-mono text-xs" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium flex items-center gap-1">
                                        <TbHash className="w-3 h-3" />
                                        კოდი (6 ციფრი)
                                    </label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={post.numericId || ''}
                                            onChange={(e) => setPost(prev => ({ ...prev, numericId: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                                            placeholder="123456"
                                            className="font-mono text-sm tracking-widest w-28"
                                            maxLength={6}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleGenerateCode}
                                            disabled={isGeneratingCode}
                                            className="flex items-center gap-1"
                                        >
                                            {isGeneratingCode ? (
                                                <TbLoader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <TbRefresh className="w-4 h-4" />
                                            )}
                                            <span className="hidden sm:inline">{isGeneratingCode ? '...' : 'დააგენერირე'}</span>
                                        </Button>
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-xs font-medium">Excerpt (SEO Description)</label>
                                    <Textarea value={post.excerpt} onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))} rows={2} className="text-xs" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Tags (Comma or space separated)</label>
                                    <Input value={post.tags?.join(', ')} onChange={(e) => setPost(prev => ({ ...prev, tags: e.target.value.split(/[, ]+/).filter(Boolean) }))} placeholder="ai, tech, news" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Category</label>
                                    <Select value={post.categories[0]} onValueChange={(v: string) => setPost(prev => ({ ...prev, categories: [v] }))}>
                                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map(cat => (
                                                <SelectItem key={cat.value} value={cat.value}>
                                                    <span className="flex items-center gap-2">
                                                        <cat.icon className="w-3 h-3" />
                                                        {cat.label}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Type</label>
                                    <Select value={post.type} onValueChange={(v: any) => setPost(prev => ({ ...prev, type: v }))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="news">News / Article</SelectItem>
                                            <SelectItem value="tutorial">Blueprint (Tutorial)</SelectItem>
                                            <SelectItem value="library">Library Resource</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* JSON Editor */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium">Content JSON</label>
                                <textarea
                                    className={`w-full min-h-125 p-4 font-mono text-sm bg-zinc-950 text-zinc-100 rounded-lg resize-y ${jsonError ? 'border-2 border-red-500' : ''}`}
                                    value={jsonInput}
                                    onChange={(e) => setJsonInput(e.target.value)}
                                    placeholder='[{"type":"intro","content":"..."}]'
                                />
                                {jsonError && (
                                    <div className="text-red-500 text-sm p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                                        <span className="font-semibold">JSON Error:</span> {jsonError}
                                    </div>
                                )}
                                {post.type === 'insight' && (
                                    <div className="text-emerald-400 text-sm p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex items-center gap-2">
                                        <TbSparkles className="w-4 h-4" />
                                        <span><span className="font-semibold">Insight detected</span> — {post.sourceUrl ? `Source: ${post.sourceUrl.slice(0, 60)}...` : 'will auto-extract tags, OG image, and cross-links'}</span>
                                    </div>
                                )}
                            </div>

                            {/* Sources Interpreter */}
                            <SourcesInterpreter value={sourcesInput} onChange={setSourcesInput} />
                        </CardContent>
                    </Card>
                    <Card className="h-fit sticky top-6">
                        <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
                        <CardContent>
                            <RichPostContent sections={parsedSections} />
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="p-10 text-center border-2 border-dashed rounded-lg">
                    Visual Mode Not Implemented in Skeleton
                </div>
            )}

            <div className="flex justify-end gap-2 fixed bottom-0 right-0 p-4 bg-background border-t w-full z-50">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>Cancel</Button>
                <Button type="button" onClick={handleSaveClick} disabled={isSaving}>
                    {isSaving ? 'იტვირთება...' : 'Save'}
                </Button>
            </div>
        </div>
    )
}

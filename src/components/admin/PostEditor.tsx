"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TbDeviceFloppy, TbEye, TbX, TbPlus, TbPhoto, TbFileText, TbTag, TbFolder, TbClock, TbStar, TbFlame, TbWorld, TbArrowLeft, TbWand, TbDeviceDesktop, TbDeviceMobile, TbTrash, TbChevronDown, TbChevronUp, TbSparkles, TbUpload, TbLoader2, TbFileCheck, TbLayout, TbCheck, TbArrowUp, TbArrowDown, TbRobot, TbAtom, TbBrandTelegram, TbBrandGithub, TbBrandGitlab, TbGitFork, TbCode, TbUsers, TbBook, TbGlobe } from "react-icons/tb"

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
    type: 'intro' | 'section' | 'sarcasm' | 'warning' | 'tip' | 'fact' | 'opinion' | 'cta' | 'hashtags' | 'author-comment' | 'image' | 'prompt' | 'quote';
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
    slug: string
    title: string
    type: "library" | "news" | "tutorial"
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
}

const DEFAULT_POST: PostData = {
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

    // Upload States
    const [isUploadingH, setIsUploadingH] = React.useState(false)
    const [isUploadingV, setIsUploadingV] = React.useState(false)

    // File Upload Handler
    const handleFileUpload = async (file: File, type: 'horizontal' | 'vertical') => {
        if (type === 'horizontal') setIsUploadingH(true)
        else setIsUploadingV(true)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('title', post.title || post.slug || 'cover')
            formData.append('type', type)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || 'Upload failed')
            }

            const result = await response.json()

            setPost(prev => ({
                ...prev,
                coverImages: { ...prev.coverImages, [type]: result.url }
            }))
        } catch (error: any) {
            console.error('Upload error:', error)
            alert(error.message || 'ატვირთვა ვერ მოხერხდა')
        } finally {
            if (type === 'horizontal') setIsUploadingH(false)
            else setIsUploadingV(false)
        }
    }

    // JSON Sync Logic
    React.useEffect(() => {
        if (editorMode === 'json' && !jsonInput && post.sections.length > 0) {
            setJsonInput(JSON.stringify(post.sections, null, 2))
            setParsedSections(post.sections)
        }
    }, [editorMode, post.sections])

    React.useEffect(() => {
        try {
            if (jsonInput) {
                const parsed = JSON.parse(jsonInput)

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
                    // NEW: Full Article Object ({ meta, seo, content })
                    setPost(prev => {
                        const newData = { ...prev }

                        // 1. Meta
                        if (parsed.meta) {
                            if (parsed.meta.title) newData.title = parsed.meta.title
                            if (parsed.meta.slug) newData.slug = parsed.meta.slug

                            // Category Normalization
                            if (parsed.meta.category) {
                                const catMap: Record<string, string> = {
                                    'technology': 'technology',
                                    'tehnologia': 'technology',
                                    'tech': 'technology',
                                    'economy': 'economy',
                                    'politics': 'politics',
                                    'business': 'business',
                                    'science': 'science',
                                    'society': 'society',
                                    'education': 'education',
                                    'world': 'world',
                                    // Legacy mappings
                                    'ai': 'technology',
                                    'news': 'world',
                                    'articles': 'technology'
                                }
                                const normalized = catMap[parsed.meta.category.toLowerCase()] || 'technology'
                                newData.categories = [normalized]
                            }

                            if (parsed.meta.tags && Array.isArray(parsed.meta.tags)) newData.tags = parsed.meta.tags
                            if (parsed.meta.author) {
                                newData.author = { ...prev.author, ...parsed.meta.author }
                                // Auto-assign avatar for known AI authors
                                if (parsed.meta.author.name === 'ალფა' && !parsed.meta.author.avatar) {
                                    newData.author.avatar = '/images/authors/alpha.png'
                                    newData.author.role = newData.author.role || 'AI ანალიტიკოსი'
                                }
                            }
                        }

                        // 2. SEO
                        if (parsed.seo) {
                            if (parsed.seo.excerpt) newData.excerpt = parsed.seo.excerpt
                            if (parsed.seo.key_points) newData.keyPoints = parsed.seo.key_points
                            if (parsed.seo.faq) newData.faq = parsed.seo.faq
                            if (parsed.seo.entities) newData.entities = parsed.seo.entities
                        }

                        // 3. Content
                        if (parsed.content && Array.isArray(parsed.content)) {
                            const { cleaned, extractedTags } = sanitizeSections(parsed.content)
                            newData.sections = cleaned
                            setParsedSections(cleaned)

                            // Merge extracted tags if content had hashtags section
                            if (extractedTags.length > 0) {
                                newData.tags = Array.from(new Set([...(newData.tags || []), ...extractedTags]))
                            }
                        }

                        return newData
                    })
                }
            }
        } catch (e) {
            // Ignore
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
                                    <div className="relative w-16 aspect-[9/16] bg-muted rounded overflow-hidden border group">
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
                            </div>

                            {/* JSON Editor */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium">Content JSON</label>
                                <textarea
                                    className="w-full min-h-[500px] p-4 font-mono text-sm bg-zinc-950 text-zinc-100 rounded-lg resize-y"
                                    value={jsonInput}
                                    onChange={(e) => setJsonInput(e.target.value)}
                                    placeholder='[{"type":"intro","content":"..."}]'
                                />
                            </div>
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
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="button" onClick={() => onSave(post)}>Save</Button>
            </div>
        </div>
    )
}

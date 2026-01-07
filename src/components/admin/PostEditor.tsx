"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TbDeviceFloppy, TbEye, TbX, TbPlus, TbPhoto, TbFileText, TbTag, TbFolder, TbClock, TbStar, TbFlame, TbWorld, TbArrowLeft, TbWand, TbDeviceDesktop, TbDeviceMobile, TbTrash, TbChevronDown, TbChevronUp, TbSparkles, TbUpload, TbLoader2, TbFileCheck, TbLayout, TbCheck, TbArrowUp, TbArrowDown } from "react-icons/tb"
// ... (imports remain the same logic, I need to match the line) 

// ...


import { parsePostContent, extractTitle, extractExcerpt, calculateReadingTime } from "@/lib/PostContentParser"
import { RichPostContent } from "@/components/blog/RichPostContent"
import { useAutosave, formatTimeSince } from "@/hooks/useAutosave"
import { POST_TEMPLATES, type PostTemplate } from "@/lib/postTemplates"
import { VideoEmbed, type VideoData } from "@/components/admin/VideoEmbed"
import { RelatedPostsSuggestions } from "@/components/admin/RelatedPostsSuggestions"

// Categories available (hierarchical order)
const CATEGORIES = [
    { value: "news", label: "სიახლეები", emoji: "📰" },
    { value: "videos", label: "ვიდეო", emoji: "🎬" },
    { value: "prompts", label: "პრომპტები", emoji: "✨" },
    { value: "tutorials", label: "ტუტორიალები", emoji: "📚" },
    { value: "business", label: "ბიზნესი", emoji: "💼" },
    { value: "automation", label: "ავტომატიზაცია", emoji: "⚡" },
]

// Section interface
interface Section {
    icon?: string;  // lucide icon name
    title?: string;
    content: string;
    type: 'intro' | 'section' | 'sarcasm' | 'warning' | 'tip' | 'fact' | 'opinion' | 'cta' | 'hashtags' | 'author-comment' | 'image';
}

// Gallery image
interface GalleryImage {
    src: string;
    alt?: string;
    caption?: string;
}

// Cover images
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
    category: string
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
}

const DEFAULT_POST: PostData = {
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    rawContent: "",
    category: "news",
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
    }
}

// Generate slug from title
function generateSlug(title: string): string {
    // Transliterate Georgian characters
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
        .slice(0, 60)
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
    const [newTag, setNewTag] = React.useState("")
    const [previewMode, setPreviewMode] = React.useState(false)
    const [showGallery, setShowGallery] = React.useState(false)
    const [newGalleryUrl, setNewGalleryUrl] = React.useState("")
    const [isParsing, setIsParsing] = React.useState(false)

    // Universal ID Logic
    React.useEffect(() => {
        if (!post.id && !isEditing) {
            // Generate random 6-digit ID
            const generateId = () => Math.floor(100000 + Math.random() * 900000).toString()
            const newId = generateId()
            setPost(prev => ({ ...prev, id: newId }))
        }
    }, [])


    // Upload and AI suggestion states
    const [isUploadingH, setIsUploadingH] = React.useState(false)
    const [isUploadingV, setIsUploadingV] = React.useState(false)
    const [isLoadingAiSuggestions, setIsLoadingAiSuggestions] = React.useState(false)
    const [aiSuggestions, setAiSuggestions] = React.useState<{
        focusKeyword?: string
        metaTitle?: string
        metaDescription?: string
        keywords?: string
        tags?: string[]
    } | null>(null)

    // Template selector state
    const [showTemplateSelector, setShowTemplateSelector] = React.useState(false)

    // Autosave hook
    const { isSaving: isAutoSaving, lastSaved, recoveredData, clearRecovery } = useAutosave(post, {
        key: `post_${post.id || 'new'}`,
        delay: 30000,
        enabled: post.status === 'draft'
    })

    // Show recovery modal if there's recovered data
    const [showRecoveryModal, setShowRecoveryModal] = React.useState(false)
    React.useEffect(() => {
        if (recoveredData && !isEditing) {
            setShowRecoveryModal(true)
        }
    }, [recoveredData, isEditing])

    // Apply recovered data
    const handleApplyRecovery = () => {
        if (recoveredData) {
            setPost(recoveredData as PostData)
            clearRecovery()
            setShowRecoveryModal(false)
        }
    }

    // Dismiss recovery
    const handleDismissRecovery = () => {
        clearRecovery()
        setShowRecoveryModal(false)
    }

    // Apply template
    const handleApplyTemplate = (template: PostTemplate) => {
        setPost(prev => ({
            ...prev,
            rawContent: template.rawContent,
            category: template.category,
            tags: [...new Set([...prev.tags, ...template.tags])]
        }))
        setShowTemplateSelector(false)
    }

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

    // Section Image Upload
    const [isUploadingSectionImage, setIsUploadingSectionImage] = React.useState(false)
    const handleSectionImageUpload = async (file: File) => {
        setIsUploadingSectionImage(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('title', `section-${post.id}-${Date.now()}`)
            formData.append('type', 'section')

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) throw new Error('Upload failed')
            const result = await response.json()

            // Add new section
            const newSection: Section = {
                type: 'image',
                content: result.url,
                title: '' // Optional caption
            }

            setPost(prev => ({
                ...prev,
                sections: [...prev.sections, newSection]
            }))
        } catch (error) {
            console.error('Section Image Upload Error:', error)
            alert('სურათის ატვირთვა ვერ მოხერხდა')
        } finally {
            setIsUploadingSectionImage(false)
        }
    }

    // AI Suggestions handler
    const handleGetAiSuggestions = async () => {
        if (!post.title && !post.rawContent && !post.excerpt) {
            alert('გთხოვთ ჯერ შეავსოთ სათაური ან კონტენტი')
            return
        }

        setIsLoadingAiSuggestions(true)
        setAiSuggestions(null)

        try {
            const response = await fetch('/api/posts/ai-suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: post.title,
                    excerpt: post.excerpt,
                    rawContent: post.rawContent
                })
            })

            const result = await response.json()

            // Use result or fallback
            setAiSuggestions({
                focusKeyword: result.focusKeyword || '',
                metaTitle: result.metaTitle || post.title?.slice(0, 60) || '',
                metaDescription: result.metaDescription || post.excerpt?.slice(0, 160) || 'AI ინოვაციები - AndrewAltair.ge',
                keywords: result.keywords || post.tags?.join(', ') || 'AI, ტექნოლოგიები',
                tags: result.tags || ['ტექნოლოგიები', 'AI', 'ინოვაცია']
            })
        } catch (error) {
            console.error('AI suggestion error:', error)
            // Show fallback suggestions
            setAiSuggestions({
                focusKeyword: post.title?.split(' ').slice(0, 3).join(' ') || 'AI ინოვაციები',
                metaTitle: post.title?.slice(0, 60) || '',
                metaDescription: post.excerpt?.slice(0, 160) || 'AI ინოვაციები და ტექნოლოგიები - AndrewAltair.ge',
                keywords: post.tags?.join(', ') || 'AI, ტექნოლოგიები, ინოვაცია',
                tags: ['ტექნოლოგიები', 'AI', 'ინოვაცია', 'AndrewAltair', 'სიახლეები']
            })
        } finally {
            setIsLoadingAiSuggestions(false)
        }
    }

    // Apply AI suggestion - fills ALL SEO fields at once
    const applyAiSeoSuggestion = () => {
        if (!aiSuggestions) return
        setPost(prev => ({
            ...prev,
            seo: {
                ...prev.seo,
                focusKeyword: aiSuggestions.focusKeyword || prev.seo.focusKeyword,
                metaTitle: aiSuggestions.metaTitle || prev.seo.metaTitle,
                metaDescription: aiSuggestions.metaDescription || prev.seo.metaDescription,
                keywords: aiSuggestions.keywords || prev.seo.keywords
            }
        }))
        setAiSuggestions(null)
    }

    const addAiTag = (tag: string) => {
        if (!post.tags.includes(tag)) {
            setPost(prev => ({ ...prev, tags: [...prev.tags, tag] }))
        }
        // Remove from suggestions
        if (aiSuggestions?.tags) {
            setAiSuggestions(prev => prev ? ({
                ...prev,
                tags: prev.tags?.filter(t => t !== tag)
            }) : null)
        }
    }

    // Gallery upload state and handler
    const [isUploadingGallery, setIsUploadingGallery] = React.useState(false)

    const handleGalleryUpload = async (file: File) => {
        setIsUploadingGallery(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('title', `${post.title || post.slug || 'gallery'}-${post.gallery.length + 1}`)
            formData.append('type', 'gallery')

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) throw new Error('Upload failed')

            const result = await response.json()

            setPost(prev => ({
                ...prev,
                gallery: [...prev.gallery, { src: result.url, alt: '', caption: '' }]
            }))
        } catch (error) {
            console.error('Gallery upload error:', error)
            alert('ატვირთვა ვერ მოხერხდა')
        } finally {
            setIsUploadingGallery(false)
        }
    }

    // Auto-parse raw content using AI
    const handleAutoparse = async () => {
        if (!post.rawContent.trim()) return

        setIsParsing(true)

        try {
            // Call AI parsing API
            const response = await fetch('/api/posts/parse-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rawContent: post.rawContent })
            })

            if (!response.ok) {
                throw new Error('AI parsing failed')
            }

            const result = await response.json()

            // Generate tags from content
            let generatedTags: string[] = result.tags || []
            try {
                const tagsResponse = await fetch('/api/posts/generate-tags', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: result.title || post.title,
                        excerpt: result.excerpt || post.excerpt,
                        content: post.rawContent,
                        category: post.category
                    })
                })

                if (tagsResponse.ok) {
                    const tagsResult = await tagsResponse.json()
                    if (tagsResult.tags) {
                        generatedTags = [...new Set([...generatedTags, ...tagsResult.tags])].slice(0, 30)
                    }
                }
            } catch (tagError) {
                console.error('Tag generation failed:', tagError)
            }

            // Generate SEO fields using AI
            let seoData = {
                focusKeyword: '',
                metaTitle: '',
                metaDescription: '',
                keywords: ''
            }
            try {
                const seoResponse = await fetch('/api/posts/ai-suggest', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: result.title || post.title,
                        excerpt: result.excerpt || post.excerpt,
                        rawContent: post.rawContent
                    })
                })

                if (seoResponse.ok) {
                    const seoResult = await seoResponse.json()
                    seoData = {
                        // Use parse-ai focusKeyword (from ⭐️ Text) as primary, then AI suggestion
                        focusKeyword: result.focusKeyword || seoResult.focusKeyword || '',
                        metaTitle: seoResult.metaTitle || (result.title || post.title)?.slice(0, 60) || '',
                        metaDescription: seoResult.metaDescription || (result.excerpt || post.excerpt)?.slice(0, 160) || '',
                        keywords: seoResult.keywords || generatedTags.slice(0, 7).join(', ')
                    }
                }
            } catch (seoError) {
                console.error('SEO generation failed:', seoError)
                // Use focusKeyword from parse-ai (⭐️ Text), then fallback to title words
                const titleWords = (result.title || post.title || '').split(' ').filter((w: string) => w.length > 3).slice(0, 3)
                seoData = {
                    focusKeyword: result.focusKeyword || titleWords.join(' ') || '',
                    metaTitle: (result.title || post.title)?.slice(0, 60) || '',
                    metaDescription: (result.excerpt || post.excerpt)?.slice(0, 160) || '',
                    keywords: generatedTags.slice(0, 10).join(', ')
                }
            }

            // Update post with AI-parsed data, generated tags, and SEO
            setPost(prev => ({
                ...prev,
                title: prev.title || result.title,
                excerpt: prev.excerpt || result.excerpt,
                sections: result.sections || [],
                tags: generatedTags,
                readingTime: result.readingTime || 5,
                slug: prev.slug || generateSlug(result.title || prev.title),
                seo: {
                    ...prev.seo,
                    focusKeyword: seoData.focusKeyword || prev.seo.focusKeyword,
                    metaTitle: seoData.metaTitle || prev.seo.metaTitle,
                    metaDescription: seoData.metaDescription || prev.seo.metaDescription,
                    keywords: seoData.keywords || prev.seo.keywords,
                    canonicalUrl: prev.seo.canonicalUrl || `https://andrewaltair.ge/blog/${prev.slug || generateSlug(result.title || prev.title)}`
                }
            }))

            // Show preview
            setPreviewMode(true)
        } catch (error) {
            console.error('AI Parse error:', error)
            // Fallback to local parsing if AI fails
            try {
                const sections = parsePostContent(post.rawContent)
                const title = extractTitle(post.rawContent)
                const excerpt = extractExcerpt(post.rawContent, 200)
                const readingTime = calculateReadingTime(post.rawContent)

                setPost(prev => ({
                    ...prev,
                    title: prev.title || title,
                    excerpt: prev.excerpt || excerpt,
                    sections,
                    // Don't parse hashtags - only use AI generated tags
                    readingTime,
                    slug: prev.slug || generateSlug(title),
                }))
                setPreviewMode(true)
            } catch (fallbackError) {
                console.error('Fallback parse error:', fallbackError)
            }
        } finally {
            setIsParsing(false)
        }
    }


    // Handle title change and auto-generate slug
    const handleTitleChange = (title: string) => {
        setPost(prev => ({
            ...prev,
            title,
            slug: prev.slug || generateSlug(title)
        }))
    }

    // Add tag
    const addTag = (tag: string) => {
        const trimmedTag = tag.trim().replace('#', '')
        if (trimmedTag && !post.tags.includes(trimmedTag)) {
            setPost(prev => ({ ...prev, tags: [...prev.tags, trimmedTag] }))
        }
        setNewTag("")
    }

    // Remove tag
    const removeTag = (tagToRemove: string) => {
        setPost(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tagToRemove)
        }))
    }

    // Add gallery image
    const addGalleryTbPhoto = () => {
        if (!newGalleryUrl.trim()) return
        setPost(prev => ({
            ...prev,
            gallery: [...prev.gallery, { src: newGalleryUrl, alt: '', caption: '' }]
        }))
        setNewGalleryUrl("")
    }

    // Remove gallery image
    const removeGalleryTbPhoto = (index: number) => {
        setPost(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }))
    }

    // Success Modal State
    const [showSuccessModal, setShowSuccessModal] = React.useState(false)

    // Handle save with auto-generated viral tags
    const [isSaving, setIsSaving] = React.useState(false)

    const handleSave = async () => {
        setIsSaving(true)

        try {
            // Auto-generate 20 viral SEO tags
            let finalTags = [...post.tags]

            if (finalTags.length < 20) {
                try {
                    const tagsResponse = await fetch('/api/posts/generate-tags', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: post.title,
                            excerpt: post.excerpt,
                            content: post.rawContent || post.sections.map(s => s.content).join(' '),
                            category: post.category
                        })
                    })

                    if (tagsResponse.ok) {
                        const tagsResult = await tagsResponse.json()
                        if (tagsResult.tags) {
                            // TbGitMerge existing tags with generated ones, keeping unique
                            finalTags = [...new Set([...post.tags, ...tagsResult.tags])].slice(0, 20)
                        }
                    }
                } catch (tagError) {
                    console.error('Auto-tag generation failed:', tagError)
                    // Continue with existing tags
                }
            }

            // Calculate SEO Score
            let seoScore = post.seo.seoScore
            try {
                const seoResponse = await fetch('/api/posts/seo-analysis', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: post.title,
                        metaTitle: post.seo.metaTitle,
                        metaDescription: post.seo.metaDescription,
                        focusKeyword: post.seo.focusKeyword,
                        excerpt: post.excerpt,
                        content: post.rawContent || post.sections.map(s => s.content).join(' '),
                        hasImages: !!post.coverImages?.horizontal || post.gallery.length > 0,
                        tags: finalTags
                    })
                })

                if (seoResponse.ok) {
                    const seoResult = await seoResponse.json()
                    seoScore = seoResult.score || 0
                }
            } catch (seoError) {
                console.error('SEO analysis failed:', seoError)
            }

            const finalPost: PostData = {
                ...post,
                id: post.id || Date.now().toString(),
                slug: post.slug || generateSlug(post.title),
                tags: finalTags,
                seo: {
                    ...post.seo,
                    metaTitle: post.seo.metaTitle || post.title,
                    metaDescription: post.seo.metaDescription || post.excerpt,
                    keywords: post.seo.keywords || finalTags.join(", "),
                    seoScore
                }
            }

            // Wait for save to complete
            await onSave(finalPost)

            // Show success modal
            setShowSuccessModal(true)
        } catch (error) {
            console.error('Save failed:', error)
            // Error handling should be done by onSave or here if onSave throws
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Recovery Modal */}
            {showRecoveryModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TbFileCheck className="w-5 h-5 text-yellow-500" />
                                აღდგენილი დრაფტი ნაპოვნია
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                ნაპოვნია შენახული დრაფტი წინა სესიიდან. გსურთ აღადგინოთ?
                            </p>
                            <div className="flex gap-2">
                                <Button onClick={handleApplyRecovery} className="flex-1">
                                    აღდგენა
                                </Button>
                                <Button variant="outline" onClick={handleDismissRecovery} className="flex-1">
                                    უარყოფა
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <Card className="w-full max-w-sm relative overflow-hidden text-center border-0 shadow-2xl">
                        {/* Decoration */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />

                        <CardContent className="pt-10 pb-8 px-6 space-y-6">
                            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                                <TbCheck className="w-8 h-8 text-green-500" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold">წარმატება!</h2>
                                <p className="text-muted-foreground">
                                    {isEditing ? "პოსტი წარმატებით განახლდა." : "პოსტი წარმატებით გამოქვეყნდა."}
                                </p>
                            </div>

                            <div className="grid gap-3 pt-2">
                                <Button
                                    onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                                >
                                    <TbEye className="w-4 h-4 mr-2" />
                                    პოსტის ნახვა
                                </Button>
                                <div className="grid grid-cols-2 gap-3">
                                    {!isEditing && (
                                        <Button variant="outline" onClick={() => {
                                            setPost({ ...DEFAULT_POST, id: Math.floor(100000 + Math.random() * 900000).toString() })
                                            setShowSuccessModal(false)
                                            window.scrollTo(0, 0)
                                        }}>
                                            <TbPlus className="w-4 h-4 mr-2" />
                                            ახალი
                                        </Button>
                                    )}
                                    <Button variant="outline" onClick={onCancel} className={isEditing ? "col-span-2" : ""}>
                                        <TbArrowLeft className="w-4 h-4 mr-2" />
                                        სიაში
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Template Selector Modal */}
            {showTemplateSelector && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="max-w-2xl w-full max-h-[80vh] flex flex-col">
                        <CardHeader className="flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <TbLayout className="w-5 h-5" />
                                    აირჩიეთ შაბლონი
                                </CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setShowTemplateSelector(false)}>
                                    <TbX className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-y-auto">
                            <div className="grid gap-3">
                                {POST_TEMPLATES.map(template => (
                                    <button
                                        key={template.id}
                                        onClick={() => handleApplyTemplate(template)}
                                        className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
                                    >
                                        <span className="text-2xl">{template.emoji}</span>
                                        <div>
                                            <p className="font-medium">{template.name}</p>
                                            <p className="text-xs text-muted-foreground">{template.description}</p>
                                            <div className="flex gap-1 mt-1">
                                                {template.tags.slice(0, 3).map(tag => (
                                                    <Badge key={tag} variant="secondary" className="text-[10px]">
                                                        #{tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                        <TbArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {isEditing ? "პოსტის რედაქტირება" : "ახალი პოსტი"}
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>
                                {post.status === "draft" && "📝 დრაფტი"}
                                {post.status === "published" && "✅ გამოქვეყნებული"}
                                {post.status === "scheduled" && `⏰ დაგეგმილია: ${post.scheduledFor ? new Date(post.scheduledFor).toLocaleDateString('ka-GE') : ''}`}
                            </span>
                            {/* Autosave indicator */}
                            {post.status === 'draft' && (
                                <span className="flex items-center gap-1 text-xs">
                                    {isAutoSaving ? (
                                        <>
                                            <TbLoader2 className="w-3 h-3 animate-spin" />
                                            <span>ინახება...</span>
                                        </>
                                    ) : lastSaved ? (
                                        <>
                                            <TbFileCheck className="w-3 h-3 text-green-500" />
                                            <span className="text-green-500">{formatTimeSince(lastSaved)}</span>
                                        </>
                                    ) : null}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {/* Template button */}
                    <Button variant="outline" size="sm" onClick={() => setShowTemplateSelector(true)}>
                        <TbLayout className="w-4 h-4 mr-1" />
                        შაბლონი
                    </Button>
                    <Button variant="outline" onClick={onCancel}>
                        გაუქმება
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setPost(prev => ({ ...prev, status: "draft" }))}
                    >
                        შენახვა დრაფტად
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <TbLoader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <TbDeviceFloppy className="w-4 h-4 mr-2" />
                        )}
                        {isSaving ? "თეგები იგენერირდება..." : (post.status === "published" ? "განახლება" : "გამოქვეყნება")}
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title & Slug */}
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <TbFileText className="w-4 h-4" />
                                    სათაური
                                </label>
                                <Input
                                    placeholder="შეიყვანეთ სათაური..."
                                    value={post.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className="text-lg font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <TbWorld className="w-4 h-4" />
                                    Slug (URL)
                                </label>
                                <div className="flex gap-2">
                                    <span className="text-muted-foreground text-sm flex items-center">/blog/</span>
                                    <Input
                                        placeholder="url-slug"
                                        value={post.slug}
                                        onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Excerpt */}
                    <Card>
                        <CardContent className="pt-6">
                            <label className="text-sm font-medium mb-2 block">მოკლე აღწერა</label>
                            <textarea
                                placeholder="სტატიის მოკლე აღწერა..."
                                value={post.excerpt}
                                onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                                className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background resize-none"
                            />
                        </CardContent>
                    </Card>

                    {/* Raw Content Paste Area */}
                    <Card className="border-2 border-dashed border-primary/30">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TbWand className="w-5 h-5 text-primary" />
                                    AI კონტენტი (Raw Paste)
                                </CardTitle>
                                <Button
                                    onClick={handleAutoparse}
                                    disabled={isParsing || !post.rawContent.trim()}
                                    className="gap-2"
                                >
                                    <TbSparkles className="w-4 h-4" />
                                    {isParsing ? "მუშავდება..." : "ავტო-პარსინგი"}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                ჩასვით AI-ით გენერირებული კონტენტი და დააჭირეთ ავტო-პარსინგს
                            </p>
                        </CardHeader>
                        <CardContent>
                            <textarea
                                placeholder="ჩასვით თქვენი AI output აქ...

მაგალითი:
იდენტობის კრიზისი დასრულდა 🧬

დაივიწყეთ 'პლასტიკური' სახეები...

🔹 **Identity Lock**: პრომპტი იწყება...

🔴 მთავარი რისკი არის...

🟢 ეს არის იდეალური შანსი...

👇 გინდათ ეს პრომპტი?

#ხელოვნურიინტელექტი #AndrewAltair"
                                value={post.rawContent}
                                onChange={(e) => setPost(prev => ({ ...prev, rawContent: e.target.value }))}
                                className="w-full min-h-[300px] px-3 py-2 rounded-md border border-input bg-background font-mono text-sm resize-y"
                            />

                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <TbClock className="w-3 h-3" />
                                    ~{post.readingTime} წთ კითხვა
                                </span>
                                <span>{post.rawContent.length} სიმბოლო</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Manage Sections (Manual Edit) */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TbLayout className="w-5 h-5 text-primary" />
                                    სექციების მართვა ({post.sections.length})
                                </CardTitle>
                                <div className="flex gap-2">
                                    <label className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) handleSectionImageUpload(file)
                                            }}
                                            disabled={isUploadingSectionImage}
                                        />
                                        {isUploadingSectionImage ? <TbLoader2 className="w-4 h-4 animate-spin mr-2" /> : <TbPhoto className="w-4 h-4 mr-2" />}
                                        სურათის დამატება
                                    </label>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                დაამატეთ სურათები ან შეცვალეთ სექციების თანმიმდევრობა
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {post.sections.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                                    ჯერ არ არის სექციები. გამოიყენეთ "ავტო-პარსინგი" ან დაამატეთ ხელით.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {post.sections.map((section, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border group">
                                            {/* Section Type Icon */}
                                            <div className="mt-1">
                                                {section.type === 'image' ? (
                                                    <img src={section.content} alt="section" className="w-10 h-10 object-cover rounded" />
                                                ) : (
                                                    <Badge variant="outline">{section.type.slice(0, 3)}</Badge>
                                                )}
                                            </div>

                                            {/* Content Preview */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{section.title || section.type}</p>
                                                <p className="text-xs text-muted-foreground truncate">{section.type === 'image' ? section.content : section.content.slice(0, 50)}</p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        disabled={idx === 0}
                                                        onClick={() => {
                                                            const newSections = [...post.sections]
                                                                ;[newSections[idx - 1], newSections[idx]] = [newSections[idx], newSections[idx - 1]]
                                                            setPost(prev => ({ ...prev, sections: newSections }))
                                                        }}
                                                    >
                                                        <TbArrowUp className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        disabled={idx === post.sections.length - 1}
                                                        onClick={() => {
                                                            const newSections = [...post.sections]
                                                                ;[newSections[idx + 1], newSections[idx]] = [newSections[idx], newSections[idx + 1]]
                                                            setPost(prev => ({ ...prev, sections: newSections }))
                                                        }}
                                                    >
                                                        <TbArrowDown className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-destructive hover:text-destructive/90"
                                                    onClick={() => {
                                                        const newSections = [...post.sections]
                                                        newSections.splice(idx, 1)
                                                        setPost(prev => ({ ...prev, sections: newSections }))
                                                    }}
                                                >
                                                    <TbTrash className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Preview */}
                    {post.sections.length > 0 && (
                        <Card>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <TbEye className="w-5 h-5" />
                                        პრევიუ ({post.sections.length} სექცია)
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setPreviewMode(!previewMode)}
                                    >
                                        {previewMode ? <TbChevronUp className="w-4 h-4" /> : <TbChevronDown className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </CardHeader>
                            {previewMode && (
                                <CardContent className="border-t">
                                    <div className="p-4 bg-muted/20 rounded-lg max-h-[500px] overflow-y-auto">
                                        <RichPostContent sections={post.sections} />
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Content Identity (ID & Type) */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <TbFileCheck className="w-4 h-4" />
                                იდენტიფიკატორი & ტიპი
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Universal ID */}
                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground flex items-center justify-between">
                                    Universal ID (6-Digit)
                                    <Badge variant="outline" className="text-[10px] h-5">Read-Only</Badge>
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        value={post.id || "Generating..."}
                                        readOnly
                                        className="font-mono text-center tracking-widest bg-muted/50 font-bold"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                            if (post.id) {
                                                navigator.clipboard.writeText(post.id)
                                                // alert("ID დაკოპირდა!") // Optional: remove alert to avoid blocking
                                            }
                                        }}
                                        title="Copy ID"
                                    >
                                        <TbFileText className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground">კატეგორია</label>
                                <select
                                    value={post.category}
                                    onChange={(e) => setPost(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.emoji} {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Responsive Cover TbPhoto */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <TbPhoto className="w-4 h-4" />
                                Cover სურათები
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Horizontal (Desktop) */}
                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground flex items-center gap-1">
                                    <TbDeviceDesktop className="w-3 h-3" />
                                    Desktop (16:9)
                                </label>
                                {post.coverImages.horizontal ? (
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <img
                                                src={post.coverImages.horizontal}
                                                alt="Horizontal Cover"
                                                className="w-full aspect-video object-cover rounded-md"
                                            />
                                            <div className="absolute top-2 right-2 flex gap-1">
                                                {/* Replace Button */}
                                                <label className="h-6 w-6 rounded-md bg-primary hover:bg-primary/90 flex items-center justify-center cursor-pointer">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0]
                                                            if (file) handleFileUpload(file, 'horizontal')
                                                        }}
                                                        disabled={isUploadingH}
                                                    />
                                                    {isUploadingH ? (
                                                        <TbLoader2 className="w-3 h-3 animate-spin text-primary-foreground" />
                                                    ) : (
                                                        <TbUpload className="w-3 h-3 text-primary-foreground" />
                                                    )}
                                                </label>
                                                {/* Delete Button */}
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => setPost(prev => ({
                                                        ...prev,
                                                        coverImages: { ...prev.coverImages, horizontal: undefined }
                                                    }))}
                                                >
                                                    <TbTrash className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        {/* URL Input for replacing via URL */}
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="ან ჩასვით URL..."
                                                className="text-xs h-7"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const url = (e.target as HTMLInputElement).value.trim()
                                                        if (url) {
                                                            setPost(prev => ({
                                                                ...prev,
                                                                coverImages: { ...prev.coverImages, horizontal: url }
                                                            }))
                                                                ; (e.target as HTMLInputElement).value = ''
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="border-2 border-dashed rounded-md p-4 text-center aspect-video flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) handleFileUpload(file, 'horizontal')
                                                }}
                                                disabled={isUploadingH}
                                            />
                                            {isUploadingH ? (
                                                <TbLoader2 className="w-6 h-6 animate-spin text-primary" />
                                            ) : (
                                                <div>
                                                    <TbUpload className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                                                    <p className="text-xs text-muted-foreground">16:9 ატვირთვა</p>
                                                </div>
                                            )}
                                        </label>
                                        {/* URL Input for adding via URL */}
                                        <Input
                                            placeholder="ან ჩასვით სურათის URL..."
                                            className="text-xs h-7"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const url = (e.target as HTMLInputElement).value.trim()
                                                    if (url) {
                                                        setPost(prev => ({
                                                            ...prev,
                                                            coverImages: { ...prev.coverImages, horizontal: url }
                                                        }))
                                                            ; (e.target as HTMLInputElement).value = ''
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Vertical (Mobile) */}
                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground flex items-center gap-1">
                                    <TbDeviceMobile className="w-3 h-3" />
                                    Mobile (9:16)
                                </label>
                                {post.coverImages.vertical ? (
                                    <div className="space-y-2">
                                        <div className="relative max-w-[120px]">
                                            <img
                                                src={post.coverImages.vertical}
                                                alt="Vertical Cover"
                                                className="w-full aspect-[9/16] object-cover rounded-md"
                                            />
                                            <div className="absolute top-1 right-1 flex gap-1">
                                                {/* Replace Button */}
                                                <label className="h-5 w-5 rounded-md bg-primary hover:bg-primary/90 flex items-center justify-center cursor-pointer">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0]
                                                            if (file) handleFileUpload(file, 'vertical')
                                                        }}
                                                        disabled={isUploadingV}
                                                    />
                                                    {isUploadingV ? (
                                                        <TbLoader2 className="w-2.5 h-2.5 animate-spin text-primary-foreground" />
                                                    ) : (
                                                        <TbUpload className="w-2.5 h-2.5 text-primary-foreground" />
                                                    )}
                                                </label>
                                                {/* Delete Button */}
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="h-5 w-5"
                                                    onClick={() => setPost(prev => ({
                                                        ...prev,
                                                        coverImages: { ...prev.coverImages, vertical: undefined }
                                                    }))}
                                                >
                                                    <TbTrash className="w-2.5 h-2.5" />
                                                </Button>
                                            </div>
                                        </div>
                                        {/* URL Input for replacing via URL */}
                                        <Input
                                            placeholder="ან ჩასვით URL..."
                                            className="text-xs h-7 max-w-[200px]"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const url = (e.target as HTMLInputElement).value.trim()
                                                    if (url) {
                                                        setPost(prev => ({
                                                            ...prev,
                                                            coverImages: { ...prev.coverImages, vertical: url }
                                                        }))
                                                            ; (e.target as HTMLInputElement).value = ''
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="border-2 border-dashed rounded-md p-4 text-center max-w-[120px] aspect-[9/16] flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) handleFileUpload(file, 'vertical')
                                                }}
                                                disabled={isUploadingV}
                                            />
                                            {isUploadingV ? (
                                                <TbLoader2 className="w-5 h-5 animate-spin text-primary" />
                                            ) : (
                                                <div>
                                                    <TbUpload className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                                                    <p className="text-xs text-muted-foreground">9:16</p>
                                                </div>
                                            )}
                                        </label>
                                        {/* URL Input for adding via URL */}
                                        <Input
                                            placeholder="ან ჩასვით URL..."
                                            className="text-xs h-7 max-w-[200px]"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const url = (e.target as HTMLInputElement).value.trim()
                                                    if (url) {
                                                        setPost(prev => ({
                                                            ...prev,
                                                            coverImages: { ...prev.coverImages, vertical: url }
                                                        }))
                                                            ; (e.target as HTMLInputElement).value = ''
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Gallery */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <TbPhoto className="w-4 h-4" />
                                    გალერეა ({post.gallery.length})
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowGallery(!showGallery)}
                                >
                                    {showGallery ? <TbChevronUp className="w-4 h-4" /> : <TbChevronDown className="w-4 h-4" />}
                                </Button>
                            </div>
                        </CardHeader>
                        {showGallery && (
                            <CardContent className="space-y-3">
                                {/* Multi-file upload for gallery */}
                                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-md cursor-pointer hover:border-primary/50 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={async (e) => {
                                            const files = Array.from(e.target.files || [])
                                            for (const file of files) {
                                                await handleGalleryUpload(file)
                                            }
                                        }}
                                        disabled={isUploadingGallery}
                                    />
                                    {isUploadingGallery ? (
                                        <TbLoader2 className="w-4 h-4 animate-spin text-primary" />
                                    ) : (
                                        <>
                                            <TbUpload className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">სურათების ატვირთვა (რამდენიმე)</span>
                                        </>
                                    )}
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {post.gallery.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="relative group cursor-move"
                                            draggable
                                            onDragStart={(e) => e.dataTransfer.setData('text/plain', idx.toString())}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => {
                                                e.preventDefault()
                                                const fromIdx = parseInt(e.dataTransfer.getData('text/plain'))
                                                if (fromIdx !== idx) {
                                                    setPost(prev => {
                                                        const newGallery = [...prev.gallery]
                                                        const [item] = newGallery.splice(fromIdx, 1)
                                                        newGallery.splice(idx, 0, item)
                                                        return { ...prev, gallery: newGallery }
                                                    })
                                                }
                                            }}
                                        >
                                            <img
                                                src={img.src}
                                                alt={img.alt || `Gallery ${idx + 1}`}
                                                className="w-full aspect-square object-cover rounded-md"
                                            />
                                            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {idx > 0 && (
                                                    <Button
                                                        variant="secondary"
                                                        size="icon"
                                                        className="h-5 w-5"
                                                        onClick={() => setPost(prev => {
                                                            const g = [...prev.gallery]
                                                                ;[g[idx - 1], g[idx]] = [g[idx], g[idx - 1]]
                                                            return { ...prev, gallery: g }
                                                        })}
                                                    >
                                                        <TbChevronUp className="w-3 h-3" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="h-5 w-5"
                                                    onClick={() => removeGalleryTbPhoto(idx)}
                                                >
                                                    <TbTrash className="w-3 h-3" />
                                                </Button>
                                            </div>
                                            <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1 rounded">{idx + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        )}
                    </Card>



                    {/* TbVideo Embed */}
                    <VideoEmbed
                        videos={post.videos || []}
                        onChange={(videos) => setPost(prev => ({ ...prev, videos }))}
                    />

                    {/* Related Posts Suggestions */}
                    <RelatedPostsSuggestions
                        title={post.title}
                        tags={post.tags}
                        category={post.category}
                        currentSlug={post.slug}
                        selectedPosts={post.relatedPosts || []}
                        onAddPost={(slug) => setPost(prev => ({
                            ...prev,
                            relatedPosts: [...(prev.relatedPosts || []), slug]
                        }))}
                        onRemovePost={(slug) => setPost(prev => ({
                            ...prev,
                            relatedPosts: (prev.relatedPosts || []).filter(s => s !== slug)
                        }))}
                    />

                    {/* Tags */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <TbTag className="w-4 h-4" />
                                თეგები ({post.tags.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto">
                                {post.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="gap-1">
                                        #{tag}
                                        <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                                            <TbX className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="ახალი თეგი..."
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag(newTag))}
                                    className="text-xs"
                                />
                                <Button size="sm" variant="outline" onClick={() => addTag(newTag)}>
                                    <TbPlus className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">სტატუსი</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex flex-wrap gap-3">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="radio"
                                        checked={post.status === "draft"}
                                        onChange={() => setPost(prev => ({ ...prev, status: "draft", scheduledFor: undefined }))}
                                        className="accent-primary"
                                    />
                                    📝 Draft
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="radio"
                                        checked={post.status === "published"}
                                        onChange={() => setPost(prev => ({ ...prev, status: "published", scheduledFor: undefined }))}
                                        className="accent-primary"
                                    />
                                    ✅ Published
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="radio"
                                        checked={post.status === "scheduled"}
                                        onChange={() => setPost(prev => ({
                                            ...prev,
                                            status: "scheduled",
                                            scheduledFor: prev.scheduledFor || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
                                        }))}
                                        className="accent-blue-500"
                                    />
                                    ⏰ Scheduled
                                </label>
                            </div>
                            {post.status === "scheduled" && (
                                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                                    <label className="text-xs text-muted-foreground block mb-2">📅 გამოქვეყნების დრო</label>
                                    <Input
                                        type="datetime-local"
                                        value={post.scheduledFor || ''}
                                        onChange={(e) => setPost(prev => ({ ...prev, scheduledFor: e.target.value }))}
                                        className="text-sm"
                                        min={new Date().toISOString().slice(0, 16)}
                                    />
                                    {post.scheduledFor && (
                                        <p className="text-xs text-blue-400 mt-2">
                                            გამოქვეყნდება: {new Date(post.scheduledFor).toLocaleString('ka-GE')}
                                        </p>
                                    )}
                                </div>
                            )}
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={post.featured}
                                        onChange={(e) => setPost(prev => ({ ...prev, featured: e.target.checked }))}
                                        className="accent-yellow-500"
                                    />
                                    <TbStar className="w-4 h-4 text-yellow-500" />
                                    Featured
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={post.trending}
                                        onChange={(e) => setPost(prev => ({ ...prev, trending: e.target.checked }))}
                                        className="accent-orange-500"
                                    />
                                    <TbFlame className="w-4 h-4 text-orange-500" />
                                    Trending
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SEO */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <TbWorld className="w-4 h-4" />
                                SEO
                                <span className="text-[10px] text-muted-foreground font-normal">(ავტო-გენერაცია)</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* SEO Score */}
                            {post.seo.seoScore > 0 && (
                                <div className="p-3 rounded-lg border" style={{
                                    borderColor: post.seo.seoScore >= 70 ? 'rgb(34 197 94)' : post.seo.seoScore >= 50 ? 'rgb(234 179 8)' : 'rgb(239 68 68)'
                                }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium">SEO Score</span>
                                        <span className="text-lg font-bold" style={{
                                            color: post.seo.seoScore >= 70 ? 'rgb(34 197 94)' : post.seo.seoScore >= 50 ? 'rgb(234 179 8)' : 'rgb(239 68 68)'
                                        }}>{post.seo.seoScore}/100</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all"
                                            style={{
                                                width: `${post.seo.seoScore}%`,
                                                backgroundColor: post.seo.seoScore >= 70 ? 'rgb(34 197 94)' : post.seo.seoScore >= 50 ? 'rgb(234 179 8)' : 'rgb(239 68 68)'
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Focus Keyword */}
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground flex items-center gap-1">
                                    🎯 Focus Keyword
                                </label>
                                <Input
                                    placeholder="მთავარი საკვანძო სიტყვა..."
                                    value={post.seo.focusKeyword}
                                    onChange={(e) => setPost(prev => ({
                                        ...prev,
                                        seo: { ...prev.seo, focusKeyword: e.target.value }
                                    }))}
                                    className="text-xs"
                                />
                            </div>

                            {/* Meta Title with character counter */}
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs text-muted-foreground">SEO სათაური</label>
                                    <span className={`text-xs ${post.seo.metaTitle.length > 60 ? 'text-red-500' : post.seo.metaTitle.length > 50 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                                        {post.seo.metaTitle.length}/60
                                    </span>
                                </div>
                                <Input
                                    placeholder={post.title || "SEO სათაური (60 სიმბოლო max)..."}
                                    value={post.seo.metaTitle}
                                    onChange={(e) => setPost(prev => ({
                                        ...prev,
                                        seo: { ...prev.seo, metaTitle: e.target.value.slice(0, 70) }
                                    }))}
                                    className="text-xs"
                                />
                            </div>

                            {/* Meta Description with counter */}
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs text-muted-foreground">Meta Description</label>
                                    <span className={`text-xs ${post.seo.metaDescription.length > 160 ? 'text-red-500' : post.seo.metaDescription.length > 140 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                                        {post.seo.metaDescription.length}/160
                                    </span>
                                </div>
                                <textarea
                                    placeholder={post.excerpt || "SEO აღწერა (160 სიმბოლო max)..."}
                                    value={post.seo.metaDescription}
                                    onChange={(e) => setPost(prev => ({
                                        ...prev,
                                        seo: { ...prev.seo, metaDescription: e.target.value }
                                    }))}
                                    className="w-full min-h-[60px] px-2 py-1 rounded-md border border-input bg-background text-xs resize-none"
                                />
                            </div>

                            {/* Keywords */}
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Keywords</label>
                                <Input
                                    placeholder={post.tags.join(", ") || "keyword1, keyword2..."}
                                    value={post.seo.keywords}
                                    onChange={(e) => setPost(prev => ({
                                        ...prev,
                                        seo: { ...prev.seo, keywords: e.target.value }
                                    }))}
                                    className="text-xs"
                                />
                            </div>

                            {/* Canonical URL */}
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Canonical URL</label>
                                <Input
                                    placeholder={`https://andrewaltair.ge/blog/${post.slug || 'post-slug'}`}
                                    value={post.seo.canonicalUrl}
                                    onChange={(e) => setPost(prev => ({
                                        ...prev,
                                        seo: { ...prev.seo, canonicalUrl: e.target.value }
                                    }))}
                                    className="text-xs"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default PostEditor

"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Save,
    Eye,
    X,
    Plus,
    Image as ImageIcon,
    FileText,
    Tag,
    Folder,
    Clock,
    Star,
    Flame,
    Globe,
    ArrowLeft,
    Bold,
    Italic,
    List,
    ListOrdered,
    Link,
    Code,
    Quote,
    Heading1,
    Heading2,
    Heading3
} from "lucide-react"

// Categories available
const CATEGORIES = [
    { value: "ai-tips", label: "AI Tips", emoji: "💡" },
    { value: "tutorials", label: "ტუტორიალები", emoji: "📚" },
    { value: "reviews", label: "მიმოხილვები", emoji: "⚔️" },
    { value: "tools", label: "ინსტრუმენტები", emoji: "🛠️" },
    { value: "opinion", label: "მოსაზრებები", emoji: "💭" },
    { value: "news", label: "სიახლეები", emoji: "📰" },
]

// Popular tags
const POPULAR_TAGS = [
    "ChatGPT", "AI", "Midjourney", "DALL-E", "Claude", "Gemini",
    "პროდუქტიულობა", "ავტომატიზაცია", "Prompt Engineering", "უფასო"
]

export interface PostData {
    id?: string
    slug: string
    title: string
    excerpt: string
    content: string
    category: string
    tags: string[]
    coverImage: string
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
    status: "draft" | "published"
    seo: {
        metaDescription: string
        keywords: string
    }
}

const DEFAULT_POST: PostData = {
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    category: "ai-tips",
    tags: [],
    coverImage: "",
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
    status: "draft",
    seo: {
        metaDescription: "",
        keywords: ""
    }
}

// Calculate reading time from content
function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    return Math.max(1, Math.ceil(words / wordsPerMinute))
}

// Generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
}

// Markdown toolbar button
function ToolbarButton({
    icon: Icon,
    label,
    onClick
}: {
    icon: React.ElementType
    label: string
    onClick: () => void
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="p-2 rounded hover:bg-muted transition-colors"
            title={label}
        >
            <Icon className="w-4 h-4" />
        </button>
    )
}

interface PostEditorProps {
    initialData?: Partial<PostData>
    onSave: (data: PostData) => void
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
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    // Update reading time when content changes
    React.useEffect(() => {
        const time = calculateReadingTime(post.content)
        if (time !== post.readingTime) {
            setPost(prev => ({ ...prev, readingTime: time }))
        }
    }, [post.content, post.readingTime])

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
        const trimmedTag = tag.trim()
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

    // Insert markdown at cursor
    const insertMarkdown = (before: string, after: string = "") => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = post.content.substring(start, end)
        const newContent =
            post.content.substring(0, start) +
            before + selectedText + after +
            post.content.substring(end)

        setPost(prev => ({ ...prev, content: newContent }))

        // Restore cursor position
        setTimeout(() => {
            textarea.focus()
            textarea.selectionStart = start + before.length
            textarea.selectionEnd = start + before.length + selectedText.length
        }, 0)
    }

    // Handle save
    const handleSave = () => {
        const finalPost: PostData = {
            ...post,
            id: post.id || Date.now().toString(),
            slug: post.slug || generateSlug(post.title),
            seo: {
                metaDescription: post.seo.metaDescription || post.excerpt,
                keywords: post.seo.keywords || post.tags.join(", ")
            }
        }
        onSave(finalPost)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {isEditing ? "პოსტის რედაქტირება" : "ახალი პოსტი"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {post.status === "draft" ? "📝 დრაფტი" : "✅ გამოქვეყნებული"}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onCancel}>
                        გაუქმება
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setPost(prev => ({ ...prev, status: "draft" }))}
                    >
                        შენახვა დრაფტად
                    </Button>
                    <Button onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        {post.status === "published" ? "განახლება" : "გამოქვეყნება"}
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
                                    <FileText className="w-4 h-4" />
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
                                    <Globe className="w-4 h-4" />
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
                                placeholder="სტატიის მოკლე აღწერა (გამოჩნდება კარტებზე და SEO-ში)..."
                                value={post.excerpt}
                                onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                                className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background resize-none"
                            />
                        </CardContent>
                    </Card>

                    {/* Content Editor */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">კონტენტი</CardTitle>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPreviewMode(false)}
                                        className={`px-3 py-1 text-xs rounded-md transition-colors ${!previewMode ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                            }`}
                                    >
                                        Write
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewMode(true)}
                                        className={`px-3 py-1 text-xs rounded-md transition-colors ${previewMode ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                            }`}
                                    >
                                        Preview
                                    </button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {!previewMode && (
                                <div className="border-b mb-2 pb-2 flex flex-wrap gap-1">
                                    <ToolbarButton icon={Bold} label="Bold" onClick={() => insertMarkdown("**", "**")} />
                                    <ToolbarButton icon={Italic} label="Italic" onClick={() => insertMarkdown("*", "*")} />
                                    <div className="w-px bg-border mx-1" />
                                    <ToolbarButton icon={Heading1} label="H1" onClick={() => insertMarkdown("# ")} />
                                    <ToolbarButton icon={Heading2} label="H2" onClick={() => insertMarkdown("## ")} />
                                    <ToolbarButton icon={Heading3} label="H3" onClick={() => insertMarkdown("### ")} />
                                    <div className="w-px bg-border mx-1" />
                                    <ToolbarButton icon={List} label="Bullet List" onClick={() => insertMarkdown("- ")} />
                                    <ToolbarButton icon={ListOrdered} label="Numbered List" onClick={() => insertMarkdown("1. ")} />
                                    <div className="w-px bg-border mx-1" />
                                    <ToolbarButton icon={Link} label="Link" onClick={() => insertMarkdown("[", "](url)")} />
                                    <ToolbarButton icon={Code} label="Code" onClick={() => insertMarkdown("`", "`")} />
                                    <ToolbarButton icon={Quote} label="Quote" onClick={() => insertMarkdown("> ")} />
                                </div>
                            )}

                            {previewMode ? (
                                <div className="min-h-[400px] p-4 border rounded-md bg-muted/20 prose prose-sm dark:prose-invert max-w-none">
                                    {post.content ? (
                                        <div dangerouslySetInnerHTML={{
                                            __html: post.content
                                                .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                                                .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                                                .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                                .replace(/`(.*?)`/g, '<code>$1</code>')
                                                .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
                                                .replace(/^- (.*$)/gm, '<li>$1</li>')
                                                .replace(/\n/g, '<br/>')
                                        }} />
                                    ) : (
                                        <p className="text-muted-foreground">პრევიუ ცარიელია</p>
                                    )}
                                </div>
                            ) : (
                                <textarea
                                    ref={textareaRef}
                                    placeholder="დაწერეთ კონტენტი Markdown ფორმატში..."
                                    value={post.content}
                                    onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
                                    className="w-full min-h-[400px] px-3 py-2 rounded-md border border-input bg-background font-mono text-sm resize-y"
                                />
                            )}

                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    ~{post.readingTime} წთ კითხვა
                                </span>
                                <span>{post.content.length} სიმბოლო</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Cover Image */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                Cover სურათი
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {post.coverImage ? (
                                <div className="relative">
                                    <img
                                        src={post.coverImage}
                                        alt="Cover"
                                        className="w-full h-32 object-cover rounded-md"
                                    />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-6 w-6"
                                        onClick={() => setPost(prev => ({ ...prev, coverImage: "" }))}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed rounded-md p-6 text-center">
                                    <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-xs text-muted-foreground mb-2">Drag & Drop ან URL</p>
                                </div>
                            )}
                            <Input
                                placeholder="სურათის URL..."
                                value={post.coverImage}
                                onChange={(e) => setPost(prev => ({ ...prev, coverImage: e.target.value }))}
                                className="mt-2 text-xs"
                            />
                        </CardContent>
                    </Card>

                    {/* Category */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Folder className="w-4 h-4" />
                                კატეგორია
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
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
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                თეგები
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex flex-wrap gap-1">
                                {post.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="gap-1">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                                            <X className="w-3 h-3" />
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
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {POPULAR_TAGS.filter(t => !post.tags.includes(t)).slice(0, 6).map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => addTag(tag)}
                                        className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 transition-colors"
                                    >
                                        + {tag}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">სტატუსი</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="radio"
                                        checked={post.status === "draft"}
                                        onChange={() => setPost(prev => ({ ...prev, status: "draft" }))}
                                        className="accent-primary"
                                    />
                                    📝 Draft
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="radio"
                                        checked={post.status === "published"}
                                        onChange={() => setPost(prev => ({ ...prev, status: "published" }))}
                                        className="accent-primary"
                                    />
                                    ✅ Published
                                </label>
                            </div>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={post.featured}
                                        onChange={(e) => setPost(prev => ({ ...prev, featured: e.target.checked }))}
                                        className="accent-yellow-500"
                                    />
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    Featured
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={post.trending}
                                        onChange={(e) => setPost(prev => ({ ...prev, trending: e.target.checked }))}
                                        className="accent-orange-500"
                                    />
                                    <Flame className="w-4 h-4 text-orange-500" />
                                    Trending
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SEO */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                SEO
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Meta Description</label>
                                <textarea
                                    placeholder={post.excerpt || "SEO აღწერა..."}
                                    value={post.seo.metaDescription}
                                    onChange={(e) => setPost(prev => ({
                                        ...prev,
                                        seo: { ...prev.seo, metaDescription: e.target.value }
                                    }))}
                                    className="w-full min-h-[60px] px-2 py-1 rounded-md border border-input bg-background text-xs resize-none"
                                />
                            </div>
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default PostEditor

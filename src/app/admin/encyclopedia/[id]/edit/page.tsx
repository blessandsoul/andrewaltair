"use client"

export const dynamic = 'force-dynamic'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TbArrowLeft, TbDeviceFloppy, TbEye, TbBrandYoutube, TbUser, TbBook, TbLoader } from "react-icons/tb"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Section {
    _id: string
    slug: string
    title: string
}

interface Category {
    _id: string
    slug: string
    title: string
    icon: string
    sectionId: string | { _id: string }
}

interface ArticleData {
    _id: string
    title: string
    slug: string
    content: string
    excerpt: string
    sectionId: string | { _id: string }
    categoryId: string | { _id: string }
    isPublished: boolean
    isFree: boolean
    difficulty: string
    estimatedMinutes: number
    videoUrl?: string
    author: {
        name: string
        avatar?: string
        role?: string
    }
}

export default function EditArticlePage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(true)
    const [isSaving, setIsSaving] = React.useState(false)
    const [isPreview, setIsPreview] = React.useState(false)
    const [sections, setSections] = React.useState<Section[]>([])
    const [categories, setCategories] = React.useState<Category[]>([])

    const [article, setArticle] = React.useState<ArticleData | null>(null)
    const [title, setTitle] = React.useState("")
    const [slug, setSlug] = React.useState("")
    const [content, setContent] = React.useState("")
    const [sectionId, setSectionId] = React.useState("")
    const [categoryId, setCategoryId] = React.useState("")
    const [isPublished, setIsPublished] = React.useState(false)
    const [isFree, setIsFree] = React.useState(true)
    const [difficulty, setDifficulty] = React.useState("beginner")
    const [videoUrl, setVideoUrl] = React.useState("")
    const [authorName, setAuthorName] = React.useState("Andrew Altair")
    const [authorRole, setAuthorRole] = React.useState("AI Expert")

    // Fetch article and data
    React.useEffect(() => {
        async function fetchData() {
            try {
                const [sectionsRes, categoriesRes, articleRes] = await Promise.all([
                    fetch('/api/encyclopedia/sections'),
                    fetch('/api/encyclopedia/categories'),
                    fetch(`/api/encyclopedia/articles/${params.id}`)
                ])

                if (sectionsRes.ok) {
                    const data = await sectionsRes.json()
                    setSections(data.sections || [])
                }

                if (categoriesRes.ok) {
                    const data = await categoriesRes.json()
                    setCategories(data.categories || [])
                }

                if (articleRes.ok) {
                    const data = await articleRes.json()
                    const art = data.article
                    setArticle(art)
                    setTitle(art.title)
                    setSlug(art.slug)
                    setContent(art.content)
                    setSectionId(typeof art.sectionId === 'object' ? art.sectionId._id : art.sectionId)
                    setCategoryId(typeof art.categoryId === 'object' ? art.categoryId._id : art.categoryId)
                    setIsPublished(art.isPublished)
                    setIsFree(art.isFree)
                    setDifficulty(art.difficulty || 'beginner')
                    setVideoUrl(art.videoUrl || '')
                    setAuthorName(art.author?.name || 'Andrew Altair')
                    setAuthorRole(art.author?.role || 'AI Expert')
                } else {
                    alert('სტატია ვერ მოიძებნა')
                    router.push('/admin/encyclopedia')
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [params.id, router])

    const filteredCategories = categories.filter(cat => {
        const secId = typeof cat.sectionId === 'object' ? cat.sectionId._id : cat.sectionId
        return secId === sectionId
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !content || !sectionId) {
            alert('შეავსე სათაური, კონტენტი და სექცია')
            return
        }

        setIsSaving(true)
        try {
            const res = await fetch(`/api/encyclopedia/articles/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    content,
                    sectionId,
                    categoryId: categoryId || undefined,
                    isPublished,
                    isFree,
                    difficulty,
                    videoUrl: videoUrl || undefined,
                    author: {
                        name: authorName,
                        role: authorRole,
                    },
                }),
            })

            if (res.ok) {
                router.push('/admin/encyclopedia')
            } else {
                const error = await res.json()
                alert(error.error || 'შეცდომა შენახვისას')
            }
        } catch (error) {
            console.error('Error saving:', error)
            alert('შეცდომა შენახვისას')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <TbLoader className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <TbArrowLeft className="w-5 h-5 mr-2" />
                        უკან
                    </Button>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <TbBook className="w-6 h-6" />
                        სტატიის რედაქტირება
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsPreview(!isPreview)}
                    >
                        <TbEye className="w-4 h-4 mr-2" />
                        {isPreview ? 'რედაქტირება' : 'Preview'}
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSaving}>
                        <TbDeviceFloppy className="w-4 h-4 mr-2" />
                        {isSaving ? 'ინახება...' : 'შენახვა'}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title & Slug */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">სათაური *</label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="სტატიის სათაური"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Slug</label>
                            <Input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="article-slug"
                            />
                        </div>
                    </div>

                    {/* Content Editor / Preview */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">კონტენტი (Markdown) *</label>
                        {isPreview ? (
                            <div className="prose prose-lg dark:prose-invert max-w-none p-4 border rounded-lg min-h-[400px] bg-card">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {content}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="# სათაური..."
                                className="min-h-[400px] font-mono"
                            />
                        )}
                    </div>

                    {/* Video URL */}
                    <div>
                        <label className="text-sm font-medium mb-2 flex items-center gap-2">
                            <TbBrandYoutube className="w-4 h-4 text-red-500" />
                            YouTube ვიდეო (optional)
                        </label>
                        <Input
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Section & Category */}
                    <div className="p-4 border rounded-lg space-y-4">
                        <h3 className="font-semibold">კატეგორიზაცია</h3>

                        <div>
                            <label className="text-sm font-medium mb-2 block">სექცია *</label>
                            <Select value={sectionId} onValueChange={setSectionId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="აირჩიე სექცია" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sections.map((section) => (
                                        <SelectItem key={section._id} value={section._id}>
                                            {section.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">კატეგორია</label>
                            <Select value={categoryId} onValueChange={setCategoryId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="აირჩიე კატეგორია" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredCategories.map((cat) => (
                                        <SelectItem key={cat._id} value={cat._id}>
                                            {cat.icon} {cat.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="p-4 border rounded-lg space-y-4">
                        <h3 className="font-semibold">პარამეტრები</h3>

                        <div className="flex items-center justify-between">
                            <label className="text-sm">გამოქვეყნებული</label>
                            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm">უფასო კონტენტი</label>
                            <Switch checked={isFree} onCheckedChange={setIsFree} />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">სირთულე</label>
                            <Select value={difficulty} onValueChange={setDifficulty}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="beginner">დამწყები</SelectItem>
                                    <SelectItem value="intermediate">საშუალო</SelectItem>
                                    <SelectItem value="advanced">მოწინავე</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Author */}
                    <div className="p-4 border rounded-lg space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <TbUser className="w-4 h-4" />
                            ავტორი
                        </h3>

                        <div>
                            <label className="text-sm font-medium mb-2 block">სახელი</label>
                            <Input
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">როლი</label>
                            <Input
                                value={authorRole}
                                onChange={(e) => setAuthorRole(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

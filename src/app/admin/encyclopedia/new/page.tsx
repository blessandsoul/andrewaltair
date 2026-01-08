"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TbArrowLeft, TbDeviceFloppy, TbEye, TbBrandYoutube, TbUser, TbBook } from "react-icons/tb"
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

export default function NewArticlePage() {
    const router = useRouter()
    const [sections, setSections] = React.useState<Section[]>([])
    const [categories, setCategories] = React.useState<Category[]>([])
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [showPreview, setShowPreview] = React.useState(false)

    // Form state
    const [formData, setFormData] = React.useState({
        title: "",
        slug: "",
        content: "",
        sectionId: "",
        categoryId: "",
        isFree: false,
        isPublished: false,
        difficulty: "beginner",
        videoUrl: "",
        authorName: "Andrew Altair",
        authorRole: "AI Expert",
    })

    // Fetch sections and categories
    React.useEffect(() => {
        async function fetchData() {
            const [sectionsRes, categoriesRes] = await Promise.all([
                fetch('/api/encyclopedia/sections'),
                fetch('/api/encyclopedia/categories'),
            ])
            if (sectionsRes.ok) {
                const data = await sectionsRes.json()
                setSections(data.sections || [])
            }
            if (categoriesRes.ok) {
                const data = await categoriesRes.json()
                setCategories(data.categories || [])
            }
        }
        fetchData()
    }, [])

    // Auto-generate slug from title
    React.useEffect(() => {
        if (formData.title && !formData.slug) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-zა-ჰ0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .slice(0, 60)
            setFormData(prev => ({ ...prev, slug }))
        }
    }, [formData.title, formData.slug])

    // Filter categories by selected section
    const filteredCategories = React.useMemo(() => {
        if (!formData.sectionId) return []
        return categories.filter(c => {
            const sectionId = typeof c.sectionId === 'object' ? c.sectionId._id : c.sectionId
            return sectionId === formData.sectionId
        })
    }, [categories, formData.sectionId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch('/api/encyclopedia/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    author: {
                        name: formData.authorName,
                        role: formData.authorRole,
                        avatar: '/images/andrew-avatar.jpg',
                    },
                }),
            })

            if (res.ok) {
                router.push('/admin/encyclopedia')
            } else {
                const error = await res.json()
                alert('შეცდომა: ' + (error.error || 'Unknown error'))
            }
        } catch (error) {
            console.error('Error creating article:', error)
            alert('შეცდომა შენახვისას')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <TbArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">ახალი სტატია</h1>
                        <p className="text-muted-foreground">შექმენი ენციკლოპედიის სტატია</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                        <TbEye className="w-4 h-4 mr-2" />
                        {showPreview ? 'ედიტორი' : 'პრევიუ'}
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        <TbDeviceFloppy className="w-4 h-4 mr-2" />
                        {isSubmitting ? 'ინახება...' : 'შენახვა'}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>ძირითადი ინფორმაცია</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">სათაური</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="სტატიის სათაური"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="article-slug"
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Editor */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>კონტენტი (Markdown)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {showPreview ? (
                                <div className="prose prose-sm dark:prose-invert max-w-none min-h-[400px] p-4 border rounded-lg bg-muted/20">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {formData.content || '*კონტენტი ცარიელია*'}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <Textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="# სათაური

## სექცია 1

ტექსტი აქ...

### ქვესექცია

- პუნქტი 1
- პუნქტი 2

```javascript
// კოდის მაგალითი
console.log('Hello');
```"
                                    className="min-h-[400px] font-mono text-sm"
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Section & Category */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TbBook className="w-5 h-5" />
                                სექცია და კატეგორია
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>სექცია</Label>
                                <Select
                                    value={formData.sectionId}
                                    onValueChange={(val) => setFormData({ ...formData, sectionId: val, categoryId: '' })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="აირჩიე სექცია" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sections.map(s => (
                                            <SelectItem key={s._id} value={s._id}>{s.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>კატეგორია</Label>
                                <Select
                                    value={formData.categoryId}
                                    onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                                    disabled={!formData.sectionId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="აირჩიე კატეგორია" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredCategories.map(c => (
                                            <SelectItem key={c._id} value={c._id}>
                                                {c.icon} {c.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>პარამეტრები</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="published">გამოქვეყნებული</Label>
                                <Switch
                                    id="published"
                                    checked={formData.isPublished}
                                    onCheckedChange={(val) => setFormData({ ...formData, isPublished: val })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="free">უფასო სტატია</Label>
                                <Switch
                                    id="free"
                                    checked={formData.isFree}
                                    onCheckedChange={(val) => setFormData({ ...formData, isFree: val })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>სირთულე</Label>
                                <Select
                                    value={formData.difficulty}
                                    onValueChange={(val) => setFormData({ ...formData, difficulty: val })}
                                >
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
                        </CardContent>
                    </Card>

                    {/* Video */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TbBrandYoutube className="w-5 h-5 text-red-500" />
                                ვიდეო
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Input
                                value={formData.videoUrl}
                                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                placeholder="https://youtube.com/watch?v=..."
                            />
                        </CardContent>
                    </Card>

                    {/* Author */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TbUser className="w-5 h-5" />
                                ავტორი
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>სახელი</Label>
                                <Input
                                    value={formData.authorName}
                                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>როლი</Label>
                                <Input
                                    value={formData.authorRole}
                                    onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    )
}

"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TbBook, TbSearch, TbEdit, TbTrash, TbPlus, TbFolderOpen, TbArticle, TbEye, TbLock, TbLockOpen, TbGripVertical, TbRefresh } from "react-icons/tb"

interface Section {
    _id: string
    slug: string
    title: string
    description: string
    gradientFrom: string
    gradientTo: string
    icon: string
    order: number
    isActive: boolean
    articleCount: number
    createdAt: string
    updatedAt: string
}

interface Category {
    _id: string
    slug: string
    title: string
    icon: string
    sectionId: { _id: string; title: string; slug: string } | string
    order: number
    isActive: boolean
}

interface Article {
    _id: string
    slug: string
    title: string
    excerpt: string
    sectionId: { _id: string; title: string; slug: string } | string
    categoryId: { _id: string; title: string; slug: string; icon: string } | string
    isFree: boolean
    isPublished: boolean
    order: number
    difficulty: string
    estimatedMinutes: number
    views: number
    version: number
    updatedAt: string
}

export default function EncyclopediaAdminPage() {
    const [sections, setSections] = React.useState<Section[]>([])
    const [categories, setCategories] = React.useState<Category[]>([])
    const [articles, setArticles] = React.useState<Article[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [activeTab, setActiveTab] = React.useState("articles")
    const [sectionFilter, setSectionFilter] = React.useState("all")

    // Fetch data
    const fetchData = React.useCallback(async () => {
        setIsLoading(true)
        try {
            const [sectionsRes, categoriesRes, articlesRes] = await Promise.all([
                fetch('/api/encyclopedia/sections'),
                fetch('/api/encyclopedia/categories'),
                fetch('/api/encyclopedia/articles'),
            ])

            if (sectionsRes.ok) {
                const data = await sectionsRes.json()
                setSections(data.sections || [])
            }
            if (categoriesRes.ok) {
                const data = await categoriesRes.json()
                setCategories(data.categories || [])
            }
            if (articlesRes.ok) {
                const data = await articlesRes.json()
                setArticles(data.articles || [])
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    // Filter articles
    const filteredArticles = React.useMemo(() => {
        let result = [...articles]

        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            result = result.filter(a =>
                a.title.toLowerCase().includes(q) ||
                a.excerpt.toLowerCase().includes(q)
            )
        }

        if (sectionFilter !== "all") {
            result = result.filter(a => {
                const sectionId = typeof a.sectionId === 'object' ? a.sectionId._id : a.sectionId
                return sectionId === sectionFilter
            })
        }

        return result.sort((a, b) => a.order - b.order)
    }, [articles, searchQuery, sectionFilter])

    // Delete handlers
    const handleDeleteSection = async (id: string) => {
        if (!confirm('წაშალოთ ეს სექცია?')) return
        await fetch(`/api/encyclopedia/sections/${id}`, { method: 'DELETE' })
        fetchData()
    }

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('წაშალოთ ეს კატეგორია?')) return
        await fetch(`/api/encyclopedia/categories/${id}`, { method: 'DELETE' })
        fetchData()
    }

    const handleDeleteArticle = async (id: string) => {
        if (!confirm('წაშალოთ ეს სტატია?')) return
        await fetch(`/api/encyclopedia/articles/${id}`, { method: 'DELETE' })
        fetchData()
    }

    // Toggle publish
    const togglePublish = async (id: string, current: boolean) => {
        await fetch(`/api/encyclopedia/articles/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isPublished: !current })
        })
        fetchData()
    }

    // Toggle free
    const toggleFree = async (id: string, current: boolean) => {
        await fetch(`/api/encyclopedia/articles/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isFree: !current })
        })
        fetchData()
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <TbBook className="w-8 h-8 text-primary" />
                        ენციკლოპედიის მართვა
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {sections.length} სექცია • {categories.length} კატეგორია • {articles.length} სტატია
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
                        <TbRefresh className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                        განახლება
                    </Button>
                    <Link href="/admin/encyclopedia/new">
                        <Button className="gap-2">
                            <TbPlus className="w-4 h-4" />
                            ახალი სტატია
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 max-w-md">
                    <TabsTrigger value="articles" className="gap-2">
                        <TbArticle className="w-4 h-4" />
                        სტატიები
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="gap-2">
                        <TbFolderOpen className="w-4 h-4" />
                        კატეგორიები
                    </TabsTrigger>
                    <TabsTrigger value="sections" className="gap-2">
                        <TbBook className="w-4 h-4" />
                        სექციები
                    </TabsTrigger>
                </TabsList>

                {/* Articles Tab */}
                <TabsContent value="articles" className="space-y-4">
                    {/* Filters */}
                    <Card>
                        <CardContent className="p-4 flex flex-wrap gap-3">
                            <div className="relative flex-1 min-w-[200px]">
                                <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="ძიება..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={sectionFilter} onValueChange={setSectionFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="სექცია" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">ყველა სექცია</SelectItem>
                                    {sections.map(s => (
                                        <SelectItem key={s._id} value={s._id}>{s.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Articles Table */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50 border-b">
                                        <tr>
                                            <th className="px-2 py-3 w-8"><TbGripVertical className="w-4 h-4 mx-auto opacity-30" /></th>
                                            <th className="text-left px-4 py-3 font-medium">სათაური</th>
                                            <th className="text-left px-4 py-3 font-medium hidden md:table-cell">სექცია</th>
                                            <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">სტატუსი</th>
                                            <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">ნახვები</th>
                                            <th className="text-right px-4 py-3 font-medium">მოქმედება</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {filteredArticles.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                                    {isLoading ? 'იტვირთება...' : 'სტატიები არ მოიძებნა'}
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredArticles.map((article) => (
                                                <tr key={article._id} className="hover:bg-muted/30">
                                                    <td className="px-2 py-4">
                                                        <TbGripVertical className="w-4 h-4 mx-auto text-muted-foreground cursor-grab" />
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="max-w-sm">
                                                            <p className="font-medium truncate">{article.title}</p>
                                                            <p className="text-sm text-muted-foreground truncate mt-1">
                                                                {article.excerpt}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 hidden md:table-cell">
                                                        <Badge variant="outline">
                                                            {typeof article.sectionId === 'object' ? article.sectionId.title : '-'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-4 hidden lg:table-cell">
                                                        <div className="flex gap-1">
                                                            <Badge variant={article.isPublished ? "default" : "secondary"}>
                                                                {article.isPublished ? 'გამოქ.' : 'დრაფტი'}
                                                            </Badge>
                                                            <Badge variant={article.isFree ? "outline" : "secondary"}>
                                                                {article.isFree ? 'უფასო' : 'პრემიუმ'}
                                                            </Badge>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 hidden sm:table-cell text-sm text-muted-foreground">
                                                        {article.views}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => togglePublish(article._id, article.isPublished)}
                                                                title={article.isPublished ? 'გამოუქვეყნებელი გახდეს' : 'გამოქვეყნდეს'}
                                                            >
                                                                {article.isPublished ? <TbEye className="w-4 h-4" /> : <TbEye className="w-4 h-4 opacity-30" />}
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => toggleFree(article._id, article.isFree)}
                                                                title={article.isFree ? 'პრემიუმ გახდეს' : 'უფასო გახდეს'}
                                                            >
                                                                {article.isFree ? <TbLockOpen className="w-4 h-4" /> : <TbLock className="w-4 h-4" />}
                                                            </Button>
                                                            <Link href={`/admin/encyclopedia/${article._id}/edit`}>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <TbEdit className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-red-500"
                                                                onClick={() => handleDeleteArticle(article._id)}
                                                            >
                                                                <TbTrash className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Categories Tab */}
                <TabsContent value="categories" className="space-y-4">
                    <div className="flex justify-end">
                        <Link href="/admin/encyclopedia/categories/new">
                            <Button size="sm" className="gap-2">
                                <TbPlus className="w-4 h-4" />
                                ახალი კატეგორია
                            </Button>
                        </Link>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map(cat => (
                            <Card key={cat._id}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <span>{cat.icon}</span>
                                        {cat.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {typeof cat.sectionId === 'object' ? cat.sectionId.title : '-'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex justify-end gap-2">
                                    <Button variant="ghost" size="sm">
                                        <TbEdit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteCategory(cat._id)}>
                                        <TbTrash className="w-4 h-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                        {categories.length === 0 && (
                            <Card className="col-span-full">
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    კატეგორიები არ მოიძებნა
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                {/* Sections Tab */}
                <TabsContent value="sections" className="space-y-4">
                    <div className="flex justify-end">
                        <Link href="/admin/encyclopedia/sections/new">
                            <Button size="sm" className="gap-2">
                                <TbPlus className="w-4 h-4" />
                                ახალი სექცია
                            </Button>
                        </Link>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {sections.map(section => (
                            <Card key={section._id} className="overflow-hidden">
                                <div className={`h-2 bg-gradient-to-r from-${section.gradientFrom} to-${section.gradientTo}`} />
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">{section.title}</CardTitle>
                                    <CardDescription>{section.description || 'აღწერა არ არის'}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline">{section.articleCount} სტატია</Badge>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm">
                                                <TbEdit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteSection(section._id)}>
                                                <TbTrash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {sections.length === 0 && (
                            <Card className="col-span-full">
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    სექციები არ მოიძებნა
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

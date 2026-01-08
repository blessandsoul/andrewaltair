"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TbFileText, TbSearch, TbEdit, TbTrash, TbEye, TbStar, TbFlame, TbX, TbDeviceFloppy, TbSquareCheck, TbSquare, TbPlus, TbMessage, TbShare, TbHeart, TbCalendar, TbChevronUp, TbChevronDown, TbChevronLeft, TbChevronRight, TbCopy, TbDownload, TbUpload, TbGripVertical, TbClock, TbFileCheck, TbFilePencil, TbArrowsSort, TbRobot, TbAtom, TbBook, TbNews, TbCheck } from "react-icons/tb"
import { brand } from "@/lib/brand"
// Posts fetched from MongoDB API

const ICON_MAP: Record<string, any> = {
    FileText: TbFileText,
    Bot: TbRobot,
    Atom: TbAtom,
    Book: TbBook,
    News: TbNews
}

interface Post {
    id: string
    slug: string
    title: string
    excerpt: string
    category: string
    tags: string[]
    author: {
        name: string
        avatar: string
        role: string
    }
    publishedAt: string
    readingTime: number
    views: number
    comments: number
    shares: number
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
    scheduledFor: string | null
    order: number
}

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
}

type SortKey = "title" | "publishedAt" | "views" | "comments" | "order"
type SortDirection = "asc" | "desc"

export default function PostsPage() {
    const [posts, setPosts] = React.useState<Post[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [isSaving, setIsSaving] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [editingPost, setEditingPost] = React.useState<Post | null>(null)
    const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null)
    const [selectedIds, setSelectedIds] = React.useState<string[]>([])
    const [previewPost, setPreviewPost] = React.useState<Post | null>(null)

    // Fetch posts from MongoDB API
    React.useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch('/api/posts?limit=100')
                if (res.ok) {
                    const data = await res.json()
                    const formattedPosts = (data.posts || []).map((p: Post, i: number) => ({
                        ...p,
                        id: p.id || p.slug,
                        order: p.order || i + 1,
                        status: p.status || 'published',
                        scheduledFor: p.scheduledFor || null,
                        reactions: p.reactions || { fire: 0, love: 0, mindblown: 0, applause: 0, insightful: 0 },
                        comments: p.comments || 0,
                        shares: p.shares || 0
                    }))
                    setPosts(formattedPosts)
                }
            } catch (error) {
                console.error('Error fetching posts:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPosts()
    }, [])

    // Filtering & Sorting states
    const [dateFrom, setDateFrom] = React.useState("")
    const [dateTo, setDateTo] = React.useState("")
    const [categoryFilter, setCategoryFilter] = React.useState("all")
    const [tagFilter, setTagFilter] = React.useState("all")
    const [statusFilter, setStatusFilter] = React.useState("all")
    const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: SortDirection }>({
        key: "order",
        direction: "asc"
    })

    // Pagination states
    const [currentPage, setCurrentPage] = React.useState(1)
    const [itemsPerPage, setItemsPerPage] = React.useState(10)

    // Drag & Drop state
    const [draggedId, setDraggedId] = React.useState<string | null>(null)

    // Export/Import modals
    const [showExportModal, setShowExportModal] = React.useState(false)
    const [showImportModal, setShowImportModal] = React.useState(false)
    const [importData, setImportData] = React.useState("")

    // Get unique categories and tags for filtering
    const allCategories = React.useMemo(() =>
        [...new Set(posts.map(p => p.category))], [posts]
    )
    const allTags = React.useMemo(() =>
        [...new Set(posts.flatMap(p => p.tags))], [posts]
    )

    // Filter and sort posts
    const filteredPosts = React.useMemo(() => {
        let result = [...posts]

        // TbSearch filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            result = result.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.excerpt.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            )
        }

        // Date range filter
        if (dateFrom) {
            result = result.filter(p => p.publishedAt >= dateFrom)
        }
        if (dateTo) {
            result = result.filter(p => p.publishedAt <= dateTo)
        }

        // Category filter
        if (categoryFilter !== "all") {
            result = result.filter(p => p.category === categoryFilter)
        }

        // Tag filter
        if (tagFilter !== "all") {
            result = result.filter(p => p.tags.includes(tagFilter))
        }

        // Status filter
        if (statusFilter !== "all") {
            result = result.filter(p => p.status === statusFilter)
        }

        // Sorting
        result.sort((a, b) => {
            const key = sortConfig.key
            let comparison = 0

            if (key === "title") {
                comparison = a.title.localeCompare(b.title)
            } else if (key === "publishedAt") {
                comparison = a.publishedAt.localeCompare(b.publishedAt)
            } else if (key === "views") {
                comparison = a.views - b.views
            } else if (key === "comments") {
                comparison = a.comments - b.comments
            } else if (key === "order") {
                comparison = a.order - b.order
            }

            return sortConfig.direction === "asc" ? comparison : -comparison
        })

        return result
    }, [posts, searchQuery, dateFrom, dateTo, categoryFilter, tagFilter, statusFilter, sortConfig])

    // Pagination
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
    const paginatedPosts = React.useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredPosts.slice(start, start + itemsPerPage)
    }, [filteredPosts, currentPage, itemsPerPage])

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, dateFrom, dateTo, categoryFilter, tagFilter, statusFilter, itemsPerPage])

    // Sorting handler
    const handleSort = (key: SortKey) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
        }))
    }

    // Sort indicator component
    const SortIndicator = ({ columnKey }: { columnKey: SortKey }) => {
        if (sortConfig.key !== columnKey) {
            return <TbArrowsSort className="w-3.5 h-3.5 ml-1 opacity-30" />
        }
        return sortConfig.direction === "asc"
            ? <TbChevronUp className="w-3.5 h-3.5 ml-1 text-primary" />
            : <TbChevronDown className="w-3.5 h-3.5 ml-1 text-primary" />
    }

    // Select all toggle
    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedPosts.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(paginatedPosts.map(p => p.id))
        }
    }

    // Toggle single selection
    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    // Bulk delete with API
    const bulkDelete = async () => {
        setIsSaving(true)
        try {
            await Promise.all(selectedIds.map(id =>
                fetch(`/api/posts/${id}`, { method: 'DELETE' })
            ))
            setPosts(posts.filter(p => !selectedIds.includes(p.id)))
            setSelectedIds([])
        } catch (error) {
            console.error('Bulk delete error:', error)
            alert('შეცდომა წაშლისას')
        } finally {
            setIsSaving(false)
        }
    }

    // Bulk feature with API
    const bulkFeature = async () => {
        setIsSaving(true)
        try {
            await Promise.all(selectedIds.map(id =>
                fetch(`/api/posts/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ featured: true })
                })
            ))
            setPosts(posts.map(p =>
                selectedIds.includes(p.id) ? { ...p, featured: true } : p
            ))
            setSelectedIds([])
        } catch (error) {
            console.error('Bulk feature error:', error)
        } finally {
            setIsSaving(false)
        }
    }

    // Bulk unfeature with API
    const bulkUnfeature = async () => {
        setIsSaving(true)
        try {
            await Promise.all(selectedIds.map(id =>
                fetch(`/api/posts/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ featured: false })
                })
            ))
            setPosts(posts.map(p =>
                selectedIds.includes(p.id) ? { ...p, featured: false } : p
            ))
            setSelectedIds([])
        } catch (error) {
            console.error('Bulk unfeature error:', error)
        } finally {
            setIsSaving(false)
        }
    }

    // Toggle featured with API
    const toggleFeatured = async (id: string) => {
        const post = posts.find(p => p.id === id)
        if (!post) return

        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featured: !post.featured })
            })
            if (res.ok) {
                setPosts(posts.map(p =>
                    p.id === id ? { ...p, featured: !p.featured } : p
                ))
            }
        } catch (error) {
            console.error('Toggle featured error:', error)
        }
    }

    // Toggle trending with API
    const toggleTrending = async (id: string) => {
        const post = posts.find(p => p.id === id)
        if (!post) return

        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trending: !post.trending })
            })
            if (res.ok) {
                setPosts(posts.map(p =>
                    p.id === id ? { ...p, trending: !p.trending } : p
                ))
            }
        } catch (error) {
            console.error('Toggle trending error:', error)
        }
    }

    // Delete post with API
    const handleDelete = async (id: string) => {
        setIsSaving(true)
        try {
            const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setPosts(posts.filter(p => p.id !== id))
            } else {
                alert('შეცდომა წაშლისას')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('შეცდომა წაშლისას')
        } finally {
            setIsSaving(false)
            setDeleteConfirm(null)
        }
    }

    // Save edit with API
    const handleSaveEdit = async (updatedPost: Post) => {
        setIsSaving(true)
        try {
            const res = await fetch(`/api/posts/${updatedPost.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPost)
            })
            if (res.ok) {
                const data = await res.json()
                setPosts(posts.map(p =>
                    p.id === updatedPost.id ? { ...updatedPost, ...data.post } : p
                ))
                setEditingPost(null)
            } else {
                alert('შეცდომა შენახვისას')
            }
        } catch (error) {
            console.error('Save error:', error)
            alert('შეცდომა შენახვისას')
        } finally {
            setIsSaving(false)
        }
    }

    // Duplicate post with API
    const handleDuplicate = async (post: Post) => {
        setIsSaving(true)
        try {
            const newPost = {
                ...post,
                title: `${post.title} (ასლი)`,
                slug: `${post.slug}-copy-${Date.now()}`,
                status: "draft" as const,
                scheduledFor: null,
                order: posts.length + 1,
                views: 0,
                comments: 0,
                shares: 0,
                reactions: { fire: 0, love: 0, mindblown: 0, applause: 0, insightful: 0 }
            }
            // Remove id to create new
            delete (newPost as Partial<Post>).id

            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPost)
            })
            if (res.ok) {
                const data = await res.json()
                setPosts([{ ...newPost, id: data.post.id }, ...posts])
            } else {
                alert('შეცდომა დუბლირებისას')
            }
        } catch (error) {
            console.error('Duplicate error:', error)
            alert('შეცდომა დუბლირებისას')
        } finally {
            setIsSaving(false)
        }
    }

    // Drag & Drop handlers
    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id)
        e.dataTransfer.effectAllowed = "move"
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault()
        if (!draggedId || draggedId === targetId) return

        const draggedIndex = posts.findIndex(p => p.id === draggedId)
        const targetIndex = posts.findIndex(p => p.id === targetId)

        const newPosts = [...posts]
        const [draggedItem] = newPosts.splice(draggedIndex, 1)
        newPosts.splice(targetIndex, 0, draggedItem)

        // Update order values
        const reorderedPosts = newPosts.map((p, i) => ({ ...p, order: i + 1 }))
        setPosts(reorderedPosts)
        setDraggedId(null)
    }

    // Export functions
    const exportToJSON = () => {
        const dataStr = JSON.stringify(posts, null, 2)
        const blob = new Blob([dataStr], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "posts-export.json"
        a.click()
        URL.revokeObjectURL(url)
        setShowExportModal(false)
    }

    const exportToCSV = () => {
        const headers = ["id", "title", "slug", "category", "status", "publishedAt", "views", "comments", "featured", "trending"]
        const csvRows = [
            headers.join(","),
            ...posts.map(p =>
                [p.id, `"${p.title}"`, p.slug, p.category, p.status, p.publishedAt, p.views, p.comments, p.featured, p.trending].join(",")
            )
        ]
        const csvStr = csvRows.join("\n")
        const blob = new Blob([csvStr], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "posts-export.csv"
        a.click()
        URL.revokeObjectURL(url)
        setShowExportModal(false)
    }

    // Import function
    const handleImport = () => {
        try {
            const imported = JSON.parse(importData)
            if (Array.isArray(imported)) {
                const newPosts = imported.map((p, i) => ({
                    ...p,
                    id: p.id || Date.now().toString() + i,
                    order: posts.length + i + 1
                }))
                setPosts([...posts, ...newPosts])
                setShowImportModal(false)
                setImportData("")
            }
        } catch {
            alert("შეცდომა JSON-ის წაკითხვისას")
        }
    }

    // Quick date filters
    const setQuickDateFilter = (period: "today" | "week" | "month" | "all") => {
        const today = new Date().toISOString().split("T")[0]
        if (period === "all") {
            setDateFrom("")
            setDateTo("")
        } else if (period === "today") {
            setDateFrom(today)
            setDateTo(today)
        } else if (period === "week") {
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
            setDateFrom(weekAgo)
            setDateTo(today)
        } else if (period === "month") {
            const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
            setDateFrom(monthAgo)
            setDateTo(today)
        }
    }

    // Status badge component
    const StatusBadge = ({ status }: { status: Post["status"] }) => {
        const config = {
            draft: { icon: TbFilePencil, label: "დრაფტი", class: "bg-gray-500/20 text-gray-400" },
            published: { icon: TbFileCheck, label: "გამოქვეყნებული", class: "bg-green-500/20 text-green-500" },
            scheduled: { icon: TbClock, label: "დაგეგმილი", class: "bg-blue-500/20 text-blue-400" }
        }
        const { icon: Icon, label, class: className } = config[status]
        return (
            <Badge variant="outline" className={`${className} gap-1`}>
                <Icon className="w-3 h-3" />
                {label}
            </Badge>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <TbFileText className="w-8 h-8 text-primary" />
                        პოსტების მართვა
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {filteredPosts.length} პოსტი (სულ: {posts.length})
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Export Button */}
                    <Button variant="outline" size="sm" onClick={() => setShowExportModal(true)}>
                        <TbDownload className="w-4 h-4 mr-1" />
                        ექსპორტი
                    </Button>

                    {/* Import Button */}
                    <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)}>
                        <TbUpload className="w-4 h-4 mr-1" />
                        იმპორტი
                    </Button>

                    {/* New Post Button */}
                    <Link href="/admin/posts/new">
                        <Button className="gap-2 whitespace-nowrap">
                            <TbPlus className="w-4 h-4" />
                            ახალი პოსტი
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Filters Section */}
            <Card>
                <CardContent className="p-4 space-y-4">
                    {/* TbSearch Row */}
                    <div className="flex flex-wrap gap-3">
                        <div className="relative flex-1 min-w-[200px]">
                            <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="ძიება..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Category Filter */}
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="კატეგორია" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">ყველა კატეგორია</SelectItem>
                                {allCategories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Tag Filter */}
                        <Select value={tagFilter} onValueChange={setTagFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="თეგი" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">ყველა თეგი</SelectItem>
                                {allTags.map(tag => (
                                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Status Filter */}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="სტატუსი" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">ყველა სტატუსი</SelectItem>
                                <SelectItem value="published">გამოქვეყნებული</SelectItem>
                                <SelectItem value="draft">დრაფტი</SelectItem>
                                <SelectItem value="scheduled">დაგეგმილი</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date Filters Row */}
                    <div className="flex flex-wrap gap-3 items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <TbCalendar className="w-4 h-4" />
                            თარიღი:
                        </span>

                        {/* Quick date buttons */}
                        <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => setQuickDateFilter("today")}>
                                დღეს
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setQuickDateFilter("week")}>
                                კვირა
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setQuickDateFilter("month")}>
                                თვე
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setQuickDateFilter("all")}>
                                ყველა
                            </Button>
                        </div>

                        <span className="text-muted-foreground">ან</span>

                        {/* Custom date range */}
                        <Input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="w-[150px]"
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="w-[150px]"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Bulk Actions Toolbar */}
            {selectedIds.length > 0 && (
                <Card className="border-indigo-500/20 bg-indigo-500/5">
                    <CardContent className="p-3 flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <TbSquareCheck className="w-5 h-5 text-indigo-500" />
                            <span className="font-medium">{selectedIds.length} არჩეული</span>
                        </div>
                        <div className="flex-1" />
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={bulkFeature}>
                                <TbStar className="w-4 h-4 mr-1" />
                                Featured
                            </Button>
                            <Button size="sm" variant="outline" onClick={bulkUnfeature}>
                                Unfeature
                            </Button>
                            <Button size="sm" variant="destructive" onClick={bulkDelete}>
                                <TbTrash className="w-4 h-4 mr-1" />
                                წაშლა
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
                                <TbX className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Posts Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-2 py-3 w-8">
                                        <TbGripVertical className="w-4 h-4 text-muted-foreground mx-auto" />
                                    </th>
                                    <th className="px-2 py-3 w-10">
                                        <button
                                            onClick={toggleSelectAll}
                                            className="p-1 hover:bg-muted rounded"
                                        >
                                            {selectedIds.length === paginatedPosts.length && paginatedPosts.length > 0 ? (
                                                <TbSquareCheck className="w-5 h-5 text-indigo-500" />
                                            ) : (
                                                <TbSquare className="w-5 h-5 text-muted-foreground" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="text-left px-4 py-3">
                                        <button
                                            onClick={() => handleSort("title")}
                                            className="font-medium flex items-center hover:text-primary"
                                        >
                                            სათაური
                                            <SortIndicator columnKey="title" />
                                        </button>
                                    </th>
                                    <th className="text-left px-4 py-3 hidden md:table-cell font-medium">კატეგორია</th>
                                    <th className="text-left px-4 py-3 hidden md:table-cell">
                                        <button
                                            onClick={() => handleSort("publishedAt")}
                                            className="font-medium flex items-center hover:text-primary"
                                        >
                                            თარიღი
                                            <SortIndicator columnKey="publishedAt" />
                                        </button>
                                    </th>
                                    <th className="text-left px-4 py-3 hidden lg:table-cell">
                                        <button
                                            onClick={() => handleSort("views")}
                                            className="font-medium flex items-center hover:text-primary"
                                        >
                                            ნახვები
                                            <SortIndicator columnKey="views" />
                                        </button>
                                    </th>
                                    <th className="text-left px-4 py-3 hidden sm:table-cell font-medium">სტატუსი</th>
                                    <th className="text-right px-4 py-3 font-medium">მოქმედება</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {paginatedPosts.map((post) => (
                                    <tr
                                        key={post.id}
                                        className={`hover:bg-muted/30 transition-colors ${selectedIds.includes(post.id) ? "bg-indigo-500/5" : ""
                                            } ${draggedId === post.id ? "opacity-50" : ""}`}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, post.id)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, post.id)}
                                    >
                                        <td className="px-2 py-4 cursor-grab active:cursor-grabbing">
                                            <TbGripVertical className="w-4 h-4 text-muted-foreground mx-auto" />
                                        </td>
                                        <td className="px-2 py-4">
                                            <button
                                                onClick={() => toggleSelect(post.id)}
                                                className="p-1 hover:bg-muted rounded"
                                            >
                                                {selectedIds.includes(post.id) ? (
                                                    <TbSquareCheck className="w-5 h-5 text-indigo-500" />
                                                ) : (
                                                    <TbSquare className="w-5 h-5 text-muted-foreground" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="max-w-sm">
                                                <p className="font-medium truncate">{post.title}</p>
                                                <p className="text-sm text-muted-foreground truncate mt-1">
                                                    {post.excerpt}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 hidden md:table-cell">
                                            <Badge variant="outline">{post.category}</Badge>
                                        </td>
                                        <td className="px-4 py-4 hidden md:table-cell text-sm text-muted-foreground">
                                            {post.publishedAt}
                                            {post.scheduledFor && (
                                                <span className="block text-xs text-blue-400">
                                                    📅 {new Date(post.scheduledFor).toLocaleString("ka-GE")}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 hidden lg:table-cell">
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <TbEye className="w-3.5 h-3.5" />
                                                    {formatNumber(post.views)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <TbMessage className="w-3.5 h-3.5" />
                                                    {formatNumber(post.comments)}
                                                </span>
                                                <span className="flex items-center gap-1 text-red-500">
                                                    <TbHeart className="w-3.5 h-3.5" />
                                                    {formatNumber(Object.values(post.reactions).reduce((a, b) => a + b, 0))}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <TbShare className="w-3.5 h-3.5" />
                                                    {formatNumber(post.shares)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 hidden sm:table-cell">
                                            <div className="flex flex-col gap-1">
                                                <StatusBadge status={post.status} />
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => toggleFeatured(post.id)}
                                                        className={`p-1 rounded-md transition-colors ${post.featured
                                                            ? "bg-yellow-500/20 text-yellow-500"
                                                            : "bg-muted text-muted-foreground hover:text-yellow-500"
                                                            }`}
                                                        title="Featured"
                                                    >
                                                        <TbStar className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => toggleTrending(post.id)}
                                                        className={`p-1 rounded-md transition-colors ${post.trending
                                                            ? "bg-orange-500/20 text-orange-500"
                                                            : "bg-muted text-muted-foreground hover:text-orange-500"
                                                            }`}
                                                        title="Trending"
                                                    >
                                                        <TbFlame className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setPreviewPost(post)}
                                                    title="პრევიუ"
                                                >
                                                    <TbEye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDuplicate(post)}
                                                    title="დუბლირება"
                                                >
                                                    <TbCopy className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setEditingPost(post)}
                                                    title="რედაქტირება"
                                                >
                                                    <TbEdit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => setDeleteConfirm(post.id)}
                                                    title="წაშლა"
                                                >
                                                    <TbTrash className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-4 py-3 border-t">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">გვერდზე:</span>
                            <Select
                                value={itemsPerPage.toString()}
                                onValueChange={(v) => setItemsPerPage(Number(v))}
                            >
                                <SelectTrigger className="w-[70px] h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                გვერდი {currentPage} / {totalPages || 1}
                            </span>
                            <div className="flex gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                >
                                    <TbChevronLeft className="w-4 h-4" />
                                    <TbChevronLeft className="w-4 h-4 -ml-2" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <TbChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                >
                                    <TbChevronRight className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                >
                                    <TbChevronRight className="w-4 h-4" />
                                    <TbChevronRight className="w-4 h-4 -ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Preview Modal */}
            {previewPost && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={() => setPreviewPost(null)}
                >
                    <Card
                        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex gap-2 flex-wrap">
                                    <StatusBadge status={previewPost.status} />
                                    <Badge variant="outline">{previewPost.category}</Badge>
                                    {previewPost.featured && <Badge className="bg-yellow-500/20 text-yellow-500">Featured</Badge>}
                                    {previewPost.trending && <Badge className="bg-orange-500/20 text-orange-500">Trending</Badge>}
                                </div>
                                <CardTitle className="text-xl">{previewPost.title}</CardTitle>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setPreviewPost(null)}>
                                <TbX className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>📅 {previewPost.publishedAt}</span>
                                <span>⏱️ {previewPost.readingTime} წთ</span>
                                <span>👁️ {formatNumber(previewPost.views)}</span>
                                <span>💬 {formatNumber(previewPost.comments)}</span>
                            </div>

                            <p className="text-muted-foreground leading-relaxed">
                                {previewPost.excerpt}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {previewPost.tags.map(tag => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-medium mb-2">რეაქციები</h4>
                                <div className="flex gap-4">
                                    <span>🔥 {previewPost.reactions.fire}</span>
                                    <span>❤️ {previewPost.reactions.love}</span>
                                    <span>🤯 {previewPost.reactions.mindblown}</span>
                                    <span>👏 {previewPost.reactions.applause}</span>
                                    <span>💡 {previewPost.reactions.insightful}</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <Button variant="outline" onClick={() => handleDuplicate(previewPost)}>
                                    <TbCopy className="w-4 h-4 mr-2" />
                                    დუბლირება
                                </Button>
                                <Button onClick={() => { setPreviewPost(null); setEditingPost(previewPost) }}>
                                    <TbEdit className="w-4 h-4 mr-2" />
                                    რედაქტირება
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Edit Modal */}
            {editingPost && (
                <EditPostModal
                    post={editingPost}
                    onSave={handleSaveEdit}
                    onClose={() => setEditingPost(null)}
                />
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={() => setDeleteConfirm(null)}
                >
                    <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <CardHeader>
                            <CardTitle className="text-destructive">წაშლის დადასტურება</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>ნამდვილად გსურთ ამ პოსტის წაშლა?</p>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                                    გაუქმება
                                </Button>
                                <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>
                                    წაშლა
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Export Modal */}
            {showExportModal && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowExportModal(false)}
                >
                    <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>ექსპორტი</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setShowExportModal(false)}>
                                <TbX className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                აირჩიეთ ექსპორტის ფორმატი ({posts.length} პოსტი)
                            </p>
                            <div className="flex gap-3">
                                <Button onClick={exportToJSON} className="flex-1">
                                    <TbDownload className="w-4 h-4 mr-2" />
                                    JSON
                                </Button>
                                <Button onClick={exportToCSV} variant="outline" className="flex-1">
                                    <TbDownload className="w-4 h-4 mr-2" />
                                    CSV
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Import Modal */}
            {showImportModal && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowImportModal(false)}
                >
                    <Card className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>იმპორტი (JSON)</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setShowImportModal(false)}>
                                <TbX className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                ჩასვით JSON მასივი პოსტების იმპორტისთვის
                            </p>
                            <textarea
                                className="w-full min-h-[200px] p-3 rounded-md border border-input bg-background font-mono text-sm"
                                placeholder='[{"title": "პოსტის სათაური", "excerpt": "აღწერა", ...}]'
                                value={importData}
                                onChange={(e) => setImportData(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowImportModal(false)}>
                                    გაუქმება
                                </Button>
                                <Button onClick={handleImport} disabled={!importData.trim()}>
                                    <TbUpload className="w-4 h-4 mr-2" />
                                    იმპორტი
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

// Edit Modal Component
function EditPostModal({
    post,
    onSave,
    onClose
}: {
    post: Post
    onSave: (post: Post) => void
    onClose: () => void
}) {
    const [formData, setFormData] = React.useState({
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        tags: post.tags.join(", "),
        status: post.status,
        scheduledFor: post.scheduledFor || ""
    })

    // Cover images state
    const [coverImages, setCoverImages] = React.useState<{
        horizontal?: string
        vertical?: string
    }>((post as any).coverImages || {})
    const [isUploadingH, setIsUploadingH] = React.useState(false)
    const [isUploadingV, setIsUploadingV] = React.useState(false)

    // File upload handler
    const handleFileUpload = async (file: File, type: 'horizontal' | 'vertical') => {
        if (type === 'horizontal') setIsUploadingH(true)
        else setIsUploadingV(true)

        try {
            const formDataUpload = new FormData()
            formDataUpload.append('file', file)
            formDataUpload.append('title', formData.title || post.slug || 'cover')
            formDataUpload.append('type', type)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || 'Upload failed')
            }

            const result = await response.json()
            setCoverImages(prev => ({ ...prev, [type]: result.url }))
        } catch (error: any) {
            console.error('Upload error:', error)
            alert(error.message || 'ატვირთვა ვერ მოხერხდა')
        } finally {
            if (type === 'horizontal') setIsUploadingH(false)
            else setIsUploadingV(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            ...post,
            title: formData.title,
            excerpt: formData.excerpt,
            category: formData.category,
            tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
            status: formData.status as Post["status"],
            scheduledFor: formData.status === "scheduled" ? formData.scheduledFor : null,
            coverImages
        } as any)
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <Card
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>პოსტის რედაქტირება</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <TbX className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">სათაური</label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">აღწერა</label>
                            <textarea
                                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            />
                        </div>

                        {/* Cover Images Section */}
                        <div className="space-y-3 p-3 rounded-lg border bg-muted/20">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <TbUpload className="w-4 h-4" />
                                Cover სურათები
                            </label>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Horizontal (Desktop) */}
                                <div className="space-y-2">
                                    <span className="text-xs text-muted-foreground">Desktop (16:9)</span>
                                    {coverImages.horizontal ? (
                                        <div className="relative">
                                            <img
                                                src={coverImages.horizontal}
                                                alt="Horizontal Cover"
                                                className="w-full aspect-video object-cover rounded-md border"
                                            />
                                            <div className="absolute top-1 right-1 flex gap-1">
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
                                                        <TbClock className="w-3 h-3 animate-spin text-primary-foreground" />
                                                    ) : (
                                                        <TbUpload className="w-3 h-3 text-primary-foreground" />
                                                    )}
                                                </label>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => setCoverImages(prev => ({ ...prev, horizontal: undefined }))}
                                                >
                                                    <TbTrash className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="border-2 border-dashed rounded-md p-3 text-center aspect-video flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
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
                                                <TbClock className="w-5 h-5 animate-spin text-primary" />
                                            ) : (
                                                <div className="text-center">
                                                    <TbUpload className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                                                    <p className="text-xs text-muted-foreground">ატვირთვა</p>
                                                </div>
                                            )}
                                        </label>
                                    )}
                                    <Input
                                        placeholder="ან ჩასვით URL..."
                                        className="text-xs h-7"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                const url = (e.target as HTMLInputElement).value.trim()
                                                if (url) {
                                                    setCoverImages(prev => ({ ...prev, horizontal: url }))
                                                        ; (e.target as HTMLInputElement).value = ''
                                                }
                                            }
                                        }}
                                    />
                                </div>

                                {/* Vertical (Mobile) */}
                                <div className="space-y-2">
                                    <span className="text-xs text-muted-foreground">Mobile (9:16)</span>
                                    {coverImages.vertical ? (
                                        <div className="relative max-w-[80px]">
                                            <img
                                                src={coverImages.vertical}
                                                alt="Vertical Cover"
                                                className="w-full aspect-[9/16] object-cover rounded-md border"
                                            />
                                            <div className="absolute top-1 right-1 flex flex-col gap-1">
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
                                                        <TbClock className="w-2.5 h-2.5 animate-spin text-primary-foreground" />
                                                    ) : (
                                                        <TbUpload className="w-2.5 h-2.5 text-primary-foreground" />
                                                    )}
                                                </label>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="h-5 w-5"
                                                    onClick={() => setCoverImages(prev => ({ ...prev, vertical: undefined }))}
                                                >
                                                    <TbTrash className="w-2.5 h-2.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="border-2 border-dashed rounded-md p-2 text-center max-w-[80px] aspect-[9/16] flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
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
                                                <TbClock className="w-4 h-4 animate-spin text-primary" />
                                            ) : (
                                                <div className="text-center">
                                                    <TbUpload className="w-4 h-4 mx-auto text-muted-foreground" />
                                                    <p className="text-[10px] text-muted-foreground">9:16</p>
                                                </div>
                                            )}
                                        </label>
                                    )}
                                    <Input
                                        placeholder="ან URL..."
                                        className="text-xs h-7 max-w-[120px]"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                const url = (e.target as HTMLInputElement).value.trim()
                                                if (url) {
                                                    setCoverImages(prev => ({ ...prev, vertical: url }))
                                                        ; (e.target as HTMLInputElement).value = ''
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">კატეგორია</label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="აირჩიეთ კატეგორია" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {brand.categories.map(cat => {
                                            const IconComponent = ICON_MAP[cat.icon] || TbFileText;
                                            return (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    <div className="flex items-center gap-2">
                                                        <IconComponent className="w-4 h-4" />
                                                        <span>{cat.name}</span>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">სტატუსი</label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(v) => setFormData({ ...formData, status: v as Post["status"] })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">დრაფტი</SelectItem>
                                        <SelectItem value="published">გამოქვეყნებული</SelectItem>
                                        <SelectItem value="scheduled">დაგეგმილი</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Scheduled date picker */}
                        {formData.status === "scheduled" && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">გამოქვეყნების დრო</label>
                                <Input
                                    type="datetime-local"
                                    value={formData.scheduledFor}
                                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">თეგები (მძიმით გამოყოფილი)</label>
                            <Input
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={onClose}>
                                გაუქმება
                            </Button>
                            <Button type="submit">
                                <TbDeviceFloppy className="w-4 h-4 mr-2" />
                                შენახვა
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

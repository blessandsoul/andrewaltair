"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    FileText,
    Search,
    Edit,
    Trash2,
    Eye,
    Star,
    Flame,
    Filter,
    X,
    Save,
    CheckSquare,
    Square,
    MoreHorizontal,
    Plus,
    MessageCircle,
    Share2,
    Heart
} from "lucide-react"
import postsData from "@/data/posts.json"

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
}

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
}

export default function PostsPage() {
    const [posts, setPosts] = React.useState<Post[]>(postsData as Post[])
    const [searchQuery, setSearchQuery] = React.useState("")
    const [editingPost, setEditingPost] = React.useState<Post | null>(null)
    const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null)
    const [selectedIds, setSelectedIds] = React.useState<string[]>([])

    // Filter posts by search
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Select all toggle
    const toggleSelectAll = () => {
        if (selectedIds.length === filteredPosts.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(filteredPosts.map(p => p.id))
        }
    }

    // Toggle single selection
    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    // Bulk delete
    const bulkDelete = () => {
        setPosts(posts.filter(p => !selectedIds.includes(p.id)))
        setSelectedIds([])
    }

    // Bulk feature
    const bulkFeature = () => {
        setPosts(posts.map(p =>
            selectedIds.includes(p.id) ? { ...p, featured: true } : p
        ))
        setSelectedIds([])
    }

    // Bulk unfeature
    const bulkUnfeature = () => {
        setPosts(posts.map(p =>
            selectedIds.includes(p.id) ? { ...p, featured: false } : p
        ))
        setSelectedIds([])
    }

    // Toggle featured
    const toggleFeatured = (id: string) => {
        setPosts(posts.map(p =>
            p.id === id ? { ...p, featured: !p.featured } : p
        ))
    }

    // Toggle trending
    const toggleTrending = (id: string) => {
        setPosts(posts.map(p =>
            p.id === id ? { ...p, trending: !p.trending } : p
        ))
    }

    // Delete post
    const handleDelete = (id: string) => {
        setPosts(posts.filter(p => p.id !== id))
        setDeleteConfirm(null)
    }

    // Save edit
    const handleSaveEdit = (updatedPost: Post) => {
        setPosts(posts.map(p =>
            p.id === updatedPost.id ? updatedPost : p
        ))
        setEditingPost(null)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary" />
                        პოსტების მართვა
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {filteredPosts.length} პოსტი
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="ძიება..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* New Post Button */}
                    <Link href="/admin/posts/new">
                        <Button className="gap-2 whitespace-nowrap">
                            <Plus className="w-4 h-4" />
                            ახალი პოსტი
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Bulk Actions Toolbar */}
            {selectedIds.length > 0 && (
                <Card className="border-indigo-500/20 bg-indigo-500/5">
                    <CardContent className="p-3 flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <CheckSquare className="w-5 h-5 text-indigo-500" />
                            <span className="font-medium">{selectedIds.length} არჩეული</span>
                        </div>
                        <div className="flex-1" />
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={bulkFeature}>
                                <Star className="w-4 h-4 mr-1" />
                                Featured
                            </Button>
                            <Button size="sm" variant="outline" onClick={bulkUnfeature}>
                                Unfeature
                            </Button>
                            <Button size="sm" variant="destructive" onClick={bulkDelete}>
                                <Trash2 className="w-4 h-4 mr-1" />
                                წაშლა
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
                                <X className="w-4 h-4" />
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
                                    <th className="px-4 py-3 w-10">
                                        <button
                                            onClick={toggleSelectAll}
                                            className="p-1 hover:bg-muted rounded"
                                        >
                                            {selectedIds.length === filteredPosts.length && filteredPosts.length > 0 ? (
                                                <CheckSquare className="w-5 h-5 text-indigo-500" />
                                            ) : (
                                                <Square className="w-5 h-5 text-muted-foreground" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="text-left px-4 py-3 font-medium">სათაური</th>
                                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">კატეგორია</th>
                                    <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">ნახვები</th>
                                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">სტატუსი</th>
                                    <th className="text-right px-4 py-3 font-medium">მოქმედება</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredPosts.map((post) => (
                                    <tr
                                        key={post.id}
                                        className={`hover:bg-muted/30 transition-colors ${selectedIds.includes(post.id) ? "bg-indigo-500/5" : ""
                                            }`}
                                    >
                                        <td className="px-4 py-4">
                                            <button
                                                onClick={() => toggleSelect(post.id)}
                                                className="p-1 hover:bg-muted rounded"
                                            >
                                                {selectedIds.includes(post.id) ? (
                                                    <CheckSquare className="w-5 h-5 text-indigo-500" />
                                                ) : (
                                                    <Square className="w-5 h-5 text-muted-foreground" />
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
                                        <td className="px-4 py-4 hidden lg:table-cell">
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    {formatNumber(post.views)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageCircle className="w-3.5 h-3.5" />
                                                    {formatNumber(post.comments)}
                                                </span>
                                                <span className="flex items-center gap-1 text-red-500">
                                                    <Heart className="w-3.5 h-3.5" />
                                                    {formatNumber(Object.values(post.reactions).reduce((a, b) => a + b, 0))}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Share2 className="w-3.5 h-3.5" />
                                                    {formatNumber(post.shares)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 hidden sm:table-cell">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => toggleFeatured(post.id)}
                                                    className={`p-1.5 rounded-md transition-colors ${post.featured
                                                        ? "bg-yellow-500/20 text-yellow-500"
                                                        : "bg-muted text-muted-foreground hover:text-yellow-500"
                                                        }`}
                                                    title="Featured"
                                                >
                                                    <Star className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => toggleTrending(post.id)}
                                                    className={`p-1.5 rounded-md transition-colors ${post.trending
                                                        ? "bg-orange-500/20 text-orange-500"
                                                        : "bg-muted text-muted-foreground hover:text-orange-500"
                                                        }`}
                                                    title="Trending"
                                                >
                                                    <Flame className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setEditingPost(post)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => setDeleteConfirm(post.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

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
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md">
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
        tags: post.tags.join(", ")
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            ...post,
            title: formData.title,
            excerpt: formData.excerpt,
            category: formData.category,
            tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean)
        })
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>პოსტის რედაქტირება</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-4 h-4" />
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
                        <div className="space-y-2">
                            <label className="text-sm font-medium">კატეგორია</label>
                            <Input
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>
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
                                <Save className="w-4 h-4 mr-2" />
                                შენახვა
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

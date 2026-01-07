"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TbSparkles, TbSearch, TbEdit, TbTrash, TbEye, TbPlus, TbChevronLeft, TbChevronRight, TbCurrencyDollar, TbDownload, TbStar, TbSquareCheck, TbSquare, TbX } from "react-icons/tb"

interface MarketplacePrompt {
    id: string
    slug: string
    title: string
    excerpt?: string
    coverImage: string
    price: number
    currency: 'GEL' | 'USD'
    isFree: boolean
    category: string
    aiModel: string
    status: 'draft' | 'published' | 'archived'
    views: number
    purchases: number
    downloads: number
    rating: number
    reviewsCount: number
    createdAt: string
}

export default function MarketplacePromptsPage() {
    const [prompts, setPrompts] = React.useState<MarketplacePrompt[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [categoryFilter, setCategoryFilter] = React.useState("all")
    const [statusFilter, setStatusFilter] = React.useState("all")
    const [selectedIds, setSelectedIds] = React.useState<string[]>([])
    const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null)

    // Pagination
    const [currentPage, setCurrentPage] = React.useState(1)
    const itemsPerPage = 12

    // Fetch prompts
    React.useEffect(() => {
        async function fetchPrompts() {
            try {
                const res = await fetch('/api/marketplace-prompts?limit=100&status=all')
                if (res.ok) {
                    const data = await res.json()
                    setPrompts(data.prompts || [])
                }
            } catch (error) {
                console.error('Error fetching prompts:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPrompts()
    }, [])

    // Get unique categories
    const allCategories = React.useMemo(() =>
        [...new Set(prompts.map(p => p.category))], [prompts]
    )

    // Filter prompts
    const filteredPrompts = React.useMemo(() => {
        let result = [...prompts]

        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            result = result.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.category?.toLowerCase().includes(q)
            )
        }

        if (categoryFilter !== "all") {
            result = result.filter(p => p.category === categoryFilter)
        }

        if (statusFilter !== "all") {
            result = result.filter(p => p.status === statusFilter)
        }

        return result
    }, [prompts, searchQuery, categoryFilter, statusFilter])

    // Pagination
    const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage)
    const paginatedPrompts = React.useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredPrompts.slice(start, start + itemsPerPage)
    }, [filteredPrompts, currentPage])

    // Reset page on filter change
    React.useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, categoryFilter, statusFilter])

    // Selection handlers
    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedPrompts.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(paginatedPrompts.map(p => p.id))
        }
    }

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    // Delete handler
    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/marketplace-prompts/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setPrompts(prompts.filter(p => p.id !== id))
                setDeleteConfirm(null)
            }
        } catch (error) {
            console.error('Delete error:', error)
        }
    }

    // Bulk delete
    const bulkDelete = async () => {
        try {
            await Promise.all(selectedIds.map(id =>
                fetch(`/api/marketplace-prompts/${id}`, { method: 'DELETE' })
            ))
            setPrompts(prompts.filter(p => !selectedIds.includes(p.id)))
            setSelectedIds([])
        } catch (error) {
            console.error('Bulk delete error:', error)
        }
    }

    // Status badge
    const StatusBadge = ({ status }: { status: MarketplacePrompt['status'] }) => {
        const config = {
            draft: { label: "დრაფტი", class: "bg-gray-500/20 text-gray-400" },
            published: { label: "გამოქვეყნებული", class: "bg-green-500/20 text-green-500" },
            archived: { label: "დაარქივებული", class: "bg-yellow-500/20 text-yellow-500" }
        }
        const { label, class: className } = config[status]
        return <Badge variant="outline" className={className}>{label}</Badge>
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <TbSparkles className="w-8 h-8 text-primary" />
                        მარკეტპლეის პრომპტები
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {filteredPrompts.length} პრომპტი (სულ: {prompts.length})
                    </p>
                </div>

                <Link href="/admin/marketplace-prompts/new">
                    <Button className="gap-2">
                        <TbPlus className="w-4 h-4" />
                        ახალი პრომპტი
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
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

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="სტატუსი" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">ყველა სტატუსი</SelectItem>
                                <SelectItem value="published">გამოქვეყნებული</SelectItem>
                                <SelectItem value="draft">დრაფტი</SelectItem>
                                <SelectItem value="archived">დაარქივებული</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
                <Card className="border-red-500/20 bg-red-500/5">
                    <CardContent className="p-3 flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <TbSquareCheck className="w-5 h-5 text-red-500" />
                            <span className="font-medium">{selectedIds.length} არჩეული</span>
                        </div>
                        <div className="flex-1" />
                        <Button size="sm" variant="destructive" onClick={bulkDelete}>
                            <TbTrash className="w-4 h-4 mr-1" />
                            წაშლა
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
                            <TbX className="w-4 h-4" />
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Prompts Grid */}
            {paginatedPrompts.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <TbSparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">პრომპტები არ მოიძებნა</h3>
                        <p className="text-muted-foreground mb-4">შექმენით პირველი პრომპტი მარკეტპლეისისთვის</p>
                        <Link href="/admin/marketplace-prompts/new">
                            <Button>
                                <TbPlus className="w-4 h-4 mr-2" />
                                ახალი პრომპტი
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Select All */}
                    <div className="flex items-center gap-2 px-2">
                        <button onClick={toggleSelectAll} className="p-1 hover:bg-muted rounded">
                            {selectedIds.length === paginatedPrompts.length && paginatedPrompts.length > 0 ? (
                                <TbSquareCheck className="w-5 h-5 text-primary" />
                            ) : (
                                <TbSquare className="w-5 h-5 text-muted-foreground" />
                            )}
                        </button>
                        <span className="text-sm text-muted-foreground">აირჩიეთ ყველა</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {paginatedPrompts.map((prompt) => (
                            <Card
                                key={prompt.id}
                                className={`overflow-hidden hover:border-primary/50 transition-colors ${selectedIds.includes(prompt.id) ? 'border-primary ring-1 ring-primary' : ''
                                    }`}
                            >
                                <div className="relative aspect-video bg-muted">
                                    {prompt.coverImage ? (
                                        <Image
                                            src={prompt.coverImage}
                                            alt={prompt.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <TbSparkles className="w-12 h-12 text-muted-foreground" />
                                        </div>
                                    )}

                                    {/* Select checkbox */}
                                    <button
                                        onClick={() => toggleSelect(prompt.id)}
                                        className="absolute top-2 left-2 p-1 bg-black/50 rounded hover:bg-black/70"
                                    >
                                        {selectedIds.includes(prompt.id) ? (
                                            <TbSquareCheck className="w-5 h-5 text-primary" />
                                        ) : (
                                            <TbSquare className="w-5 h-5 text-white" />
                                        )}
                                    </button>

                                    {/* Price badge */}
                                    <div className="absolute top-2 right-2">
                                        {prompt.isFree ? (
                                            <Badge className="bg-green-500 text-white">უფასო</Badge>
                                        ) : (
                                            <Badge className="bg-primary text-white">
                                                {prompt.price} {prompt.currency}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <CardContent className="p-4 space-y-3">
                                    <div>
                                        <h3 className="font-semibold truncate">{prompt.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs">{prompt.category}</Badge>
                                            <Badge variant="outline" className="text-xs">{prompt.aiModel}</Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1">
                                                <TbEye className="w-3.5 h-3.5" />
                                                {prompt.views}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <TbDownload className="w-3.5 h-3.5" />
                                                {prompt.isFree ? prompt.downloads : prompt.purchases}
                                            </span>
                                            {prompt.rating > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <TbStar className="w-3.5 h-3.5 text-yellow-500" />
                                                    {prompt.rating.toFixed(1)}
                                                </span>
                                            )}
                                        </div>
                                        <StatusBadge status={prompt.status} />
                                    </div>

                                    <div className="flex items-center gap-2 pt-2 border-t">
                                        <Link href={`/admin/marketplace-prompts/${prompt.id}/edit`} className="flex-1">
                                            <Button size="sm" variant="outline" className="w-full gap-1">
                                                <TbEdit className="w-4 h-4" />
                                                რედაქტირება
                                            </Button>
                                        </Link>
                                        <Link href={`/prompts/${prompt.slug}`} target="_blank">
                                            <Button size="sm" variant="ghost">
                                                <TbEye className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        {deleteConfirm === prompt.id ? (
                                            <div className="flex gap-1">
                                                <Button size="sm" variant="destructive" onClick={() => handleDelete(prompt.id)}>
                                                    დადასტურება
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(null)}>
                                                    <TbX className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(prompt.id)}>
                                                <TbTrash className="w-4 h-4 text-red-500" />
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                <TbChevronLeft className="w-4 h-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                {currentPage} / {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <TbChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

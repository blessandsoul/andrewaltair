"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Video,
    Search,
    Edit,
    Trash2,
    Eye,
    Clock,
    Play,
    X,
    Save,
    Youtube,
    Plus,
    Download,
    Upload,
    BarChart3,
    RefreshCcw,
    Calendar,
    Tag,
    GripVertical,
    Check,
    FileJson,
    FileSpreadsheet,
    TrendingUp,
    Users,
    Timer,
    ExternalLink,
    CheckSquare,
    Square,
    Layers
} from "lucide-react"
// Videos fetched from MongoDB API

interface VideoItem {
    id: string
    title: string
    description: string
    youtubeId: string
    category: string
    publishedAt: string
    views: number
    duration: string
    type: "long" | "short"
    tags?: string[]
    status?: "published" | "draft" | "scheduled"
    scheduledAt?: string
    order?: number
    lastSynced?: string
}

const CATEGORIES = ["ტუტორიალი", "მიმოხილვა", "ხრიკები", "ინტერვიუ", "პოდკასტი", "ვლოგი"]
const AVAILABLE_TAGS = ["AI", "ChatGPT", "Gemini", "DALL-E", "Automation", "Make.com", "Prompts", "Tutorial", "Beginner", "Advanced"]

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("ka-GE", {
        year: "numeric",
        month: "short",
        day: "numeric"
    })
}

function extractYouTubeId(url: string): string {
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/)
    return match ? match[1] : url
}

export default function VideosPage() {
    const [videos, setVideos] = React.useState<VideoItem[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [editingVideo, setEditingVideo] = React.useState<VideoItem | null>(null)
    const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null)
    const [typeFilter, setTypeFilter] = React.useState<"all" | "long" | "short">("all")
    const [tagFilter, setTagFilter] = React.useState<string>("")

    // New states for 10 features
    const [addingVideo, setAddingVideo] = React.useState(false)
    const [previewVideo, setPreviewVideo] = React.useState<VideoItem | null>(null)
    const [selectedVideos, setSelectedVideos] = React.useState<Set<string>>(new Set())
    const [showBulkActions, setShowBulkActions] = React.useState(false)
    const [bulkDeleteConfirm, setBulkDeleteConfirm] = React.useState(false)
    const [showAnalytics, setShowAnalytics] = React.useState(false)
    const [showImportExport, setShowImportExport] = React.useState(false)
    const [syncing, setSyncing] = React.useState(false)
    const [draggedItem, setDraggedItem] = React.useState<string | null>(null)

    // Fetch videos from MongoDB API
    React.useEffect(() => {
        async function fetchVideos() {
            try {
                const res = await fetch('/api/videos?limit=100')
                if (res.ok) {
                    const data = await res.json()
                    const formattedVideos = (data.videos || []).map((v: VideoItem, i: number) => ({
                        ...v,
                        id: v.id || v.youtubeId,
                        tags: v.tags || [],
                        status: v.status || 'published',
                        order: v.order ?? i,
                        lastSynced: null
                    }))
                    setVideos(formattedVideos)
                }
            } catch (error) {
                console.error('Error fetching videos:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchVideos()
    }, [])

    // Filter videos
    const filteredVideos = videos
        .filter(video => {
            const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                video.category.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesType = typeFilter === "all" || video.type === typeFilter
            const matchesTags = !tagFilter || (video.tags && video.tags.includes(tagFilter))
            return matchesSearch && matchesType && matchesTags
        })
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

    // Analytics calculations
    const totalViews = videos.reduce((sum, v) => sum + v.views, 0)
    const avgViews = Math.round(totalViews / videos.length)
    const longVideos = videos.filter(v => v.type === "long").length
    const shortVideos = videos.filter(v => v.type === "short").length
    const topVideos = [...videos].sort((a, b) => b.views - a.views).slice(0, 5)

    // Delete video with API
    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/videos/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setVideos(videos.filter(v => v.id !== id))
            } else {
                alert('შეცდომა წაშლისას')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('შეცდომა წაშლისას')
        }
        setDeleteConfirm(null)
    }

    // Bulk delete with API
    const handleBulkDelete = async () => {
        try {
            await Promise.all(Array.from(selectedVideos).map(id =>
                fetch(`/api/videos/${id}`, { method: 'DELETE' })
            ))
            setVideos(videos.filter(v => !selectedVideos.has(v.id)))
            setSelectedVideos(new Set())
        } catch (error) {
            console.error('Bulk delete error:', error)
            alert('შეცდომა წაშლისას')
        }
        setBulkDeleteConfirm(false)
    }

    // Save edit with API
    const handleSaveEdit = async (updatedVideo: VideoItem) => {
        try {
            const res = await fetch(`/api/videos/${updatedVideo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedVideo)
            })
            if (res.ok) {
                const data = await res.json()
                setVideos(videos.map(v =>
                    v.id === updatedVideo.id ? { ...updatedVideo, ...data.video } : v
                ))
                setEditingVideo(null)
            } else {
                alert('შეცდომა შენახვისას')
            }
        } catch (error) {
            console.error('Save error:', error)
            alert('შეცდომა შენახვისას')
        }
    }

    // Add new video with API
    const handleAddVideo = async (newVideo: Omit<VideoItem, "id">) => {
        try {
            const res = await fetch('/api/videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newVideo, order: videos.length })
            })
            if (res.ok) {
                const data = await res.json()
                setVideos([{ ...newVideo, id: data.video.id, order: videos.length }, ...videos])
                setAddingVideo(false)
            } else {
                alert('შეცდომა დამატებისას')
            }
        } catch (error) {
            console.error('Add error:', error)
            alert('შეცდომა დამატებისას')
        }
    }

    // Toggle video selection
    const toggleSelection = (id: string) => {
        const newSelection = new Set(selectedVideos)
        if (newSelection.has(id)) {
            newSelection.delete(id)
        } else {
            newSelection.add(id)
        }
        setSelectedVideos(newSelection)
    }

    // Select all
    const selectAll = () => {
        if (selectedVideos.size === filteredVideos.length) {
            setSelectedVideos(new Set())
        } else {
            setSelectedVideos(new Set(filteredVideos.map(v => v.id)))
        }
    }

    // Sync with YouTube (mock)
    const syncWithYouTube = async () => {
        setSyncing(true)
        await new Promise(resolve => setTimeout(resolve, 2000))
        setVideos(videos.map(v => ({
            ...v,
            views: v.views + Math.floor(Math.random() * 500),
            lastSynced: new Date().toISOString()
        })))
        setSyncing(false)
    }

    // Export videos
    const exportVideos = (format: "json" | "csv") => {
        const data = format === "json"
            ? JSON.stringify(videos, null, 2)
            : "id,title,youtubeId,category,views,type,publishedAt\n" +
            videos.map(v => `${v.id},"${v.title}",${v.youtubeId},${v.category},${v.views},${v.type},${v.publishedAt}`).join("\n")

        const blob = new Blob([data], { type: format === "json" ? "application/json" : "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `videos.${format}`
        a.click()
        URL.revokeObjectURL(url)
    }

    // Drag and drop handlers
    const handleDragStart = (id: string) => {
        setDraggedItem(id)
    }

    const handleDragOver = (e: React.DragEvent, targetId: string) => {
        e.preventDefault()
        if (draggedItem && draggedItem !== targetId) {
            const draggedIndex = videos.findIndex(v => v.id === draggedItem)
            const targetIndex = videos.findIndex(v => v.id === targetId)

            const newVideos = [...videos]
            const [removed] = newVideos.splice(draggedIndex, 1)
            newVideos.splice(targetIndex, 0, removed)

            // Update order
            setVideos(newVideos.map((v, i) => ({ ...v, order: i })))
        }
    }

    const handleDragEnd = () => {
        setDraggedItem(null)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Video className="w-8 h-8 text-primary" />
                        ვიდეოების მართვა
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {filteredVideos.length} ვიდეო • {formatNumber(totalViews)} ნახვა
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {/* Analytics Toggle */}
                    <Button
                        variant={showAnalytics ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowAnalytics(!showAnalytics)}
                    >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        ანალიტიკა
                    </Button>

                    {/* Sync Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={syncWithYouTube}
                        disabled={syncing}
                    >
                        <RefreshCcw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
                        {syncing ? "სინქრონიზაცია..." : "YouTube Sync"}
                    </Button>

                    {/* Import/Export */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowImportExport(!showImportExport)}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Import/Export
                    </Button>

                    {/* Add Video */}
                    <Button onClick={() => setAddingVideo(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        ვიდეოს დამატება
                    </Button>
                </div>
            </div>

            {/* Import/Export Panel */}
            {showImportExport && (
                <Card className="border-dashed">
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-3">
                            <Button variant="outline" size="sm" onClick={() => exportVideos("json")}>
                                <FileJson className="w-4 h-4 mr-2" />
                                Export JSON
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => exportVideos("csv")}>
                                <FileSpreadsheet className="w-4 h-4 mr-2" />
                                Export CSV
                            </Button>
                            <div className="border-l mx-2" />
                            <Button variant="outline" size="sm">
                                <Upload className="w-4 h-4 mr-2" />
                                Import CSV
                            </Button>
                            <Button variant="outline" size="sm">
                                <Youtube className="w-4 h-4 mr-2" />
                                Import from YouTube Playlist
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Analytics Dashboard */}
            {showAnalytics && (
                <div className="space-y-4">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Video className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{videos.length}</p>
                                        <p className="text-sm text-muted-foreground">სულ ვიდეო</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                        <Eye className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{formatNumber(totalViews)}</p>
                                        <p className="text-sm text-muted-foreground">სულ ნახვა</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{formatNumber(avgViews)}</p>
                                        <p className="text-sm text-muted-foreground">საშუალო ნახვა</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <Layers className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{longVideos}/{shortVideos}</p>
                                        <p className="text-sm text-muted-foreground">Long/Short</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Top Videos */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">ტოპ 5 პოპულარული ვიდეო</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {topVideos.map((video, index) => (
                                    <div key={video.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </span>
                                        <img
                                            src={`https://img.youtube.com/vi/${video.youtubeId}/default.jpg`}
                                            alt={video.title}
                                            className="w-16 h-9 rounded object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{video.title}</p>
                                        </div>
                                        <Badge variant="secondary">{formatNumber(video.views)} ნახვა</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters & Bulk Actions Bar */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Select All Checkbox */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={selectAll}
                    className="gap-2"
                >
                    {selectedVideos.size === filteredVideos.length && filteredVideos.length > 0 ? (
                        <CheckSquare className="w-4 h-4" />
                    ) : (
                        <Square className="w-4 h-4" />
                    )}
                    {selectedVideos.size > 0 ? `${selectedVideos.size} არჩეული` : "აირჩიე"}
                </Button>

                {/* Bulk Actions */}
                {selectedVideos.size > 0 && (
                    <div className="flex gap-2">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setBulkDeleteConfirm(true)}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            წაშლა ({selectedVideos.size})
                        </Button>
                    </div>
                )}

                <div className="flex-1" />

                {/* Tag Filter */}
                <select
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                >
                    <option value="">ყველა თეგი</option>
                    {AVAILABLE_TAGS.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>

                {/* Type Filter */}
                <div className="flex rounded-lg border overflow-hidden">
                    {(["all", "long", "short"] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setTypeFilter(type)}
                            className={`px-3 py-2 text-sm font-medium transition-colors ${typeFilter === type
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                                }`}
                        >
                            {type === "all" ? "ყველა" : type === "long" ? "Long" : "Short"}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-60">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="ძიება..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Videos Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVideos.map((video) => (
                    <Card
                        key={video.id}
                        className={`group hover:shadow-lg transition-all overflow-hidden ${selectedVideos.has(video.id) ? "ring-2 ring-primary" : ""
                            } ${draggedItem === video.id ? "opacity-50" : ""}`}
                        draggable
                        onDragStart={() => handleDragStart(video.id)}
                        onDragOver={(e) => handleDragOver(e, video.id)}
                        onDragEnd={handleDragEnd}
                    >
                        {/* Thumbnail with Real YouTube Preview */}
                        <div className="relative aspect-video bg-muted">
                            <img
                                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/placeholder-video.jpg"
                                }}
                            />

                            {/* Selection Checkbox */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    toggleSelection(video.id)
                                }}
                                className="absolute top-2 left-2 p-1 bg-black/60 rounded hover:bg-black/80 transition-colors"
                            >
                                {selectedVideos.has(video.id) ? (
                                    <CheckSquare className="w-5 h-5 text-primary" />
                                ) : (
                                    <Square className="w-5 h-5 text-white" />
                                )}
                            </button>

                            {/* Drag Handle */}
                            <div className="absolute top-2 left-10 p-1 bg-black/60 rounded cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                                <GripVertical className="w-5 h-5 text-white" />
                            </div>

                            {/* Play Button */}
                            <button
                                onClick={() => setPreviewVideo(video)}
                                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center">
                                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                                </div>
                            </button>

                            {/* Badges */}
                            <Badge
                                className="absolute top-2 right-2"
                                variant={video.type === "short" ? "default" : "secondary"}
                            >
                                {video.type === "short" ? "Short" : "Long"}
                            </Badge>

                            {/* Status Badge */}
                            {video.status && video.status !== "published" && (
                                <Badge
                                    className="absolute top-9 right-2"
                                    variant={video.status === "scheduled" ? "outline" : "secondary"}
                                >
                                    {video.status === "scheduled" ? (
                                        <><Calendar className="w-3 h-3 mr-1" />Scheduled</>
                                    ) : "Draft"}
                                </Badge>
                            )}

                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                {video.duration}
                            </div>
                        </div>

                        <CardContent className="p-4">
                            <h3 className="font-semibold truncate">{video.title}</h3>
                            <p className="text-sm text-muted-foreground truncate mt-1">
                                {video.description}
                            </p>

                            {/* Tags */}
                            {video.tags && video.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {video.tags.slice(0, 3).map(tag => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                            <Tag className="w-2.5 h-2.5 mr-1" />
                                            {tag}
                                        </Badge>
                                    ))}
                                    {video.tags.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{video.tags.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    {formatNumber(video.views)}
                                </span>
                                <Badge variant="outline">{video.category}</Badge>
                                {video.scheduledAt && (
                                    <span className="flex items-center gap-1 text-xs">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(video.scheduledAt)}
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => setEditingVideo(video)}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    რედაქტირება
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => window.open(`https://youtube.com/watch?v=${video.youtubeId}`, "_blank")}
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => setDeleteConfirm(video.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Add Video Modal */}
            {addingVideo && (
                <AddVideoModal
                    onSave={handleAddVideo}
                    onClose={() => setAddingVideo(false)}
                />
            )}

            {/* Edit Modal */}
            {editingVideo && (
                <EditVideoModal
                    video={editingVideo}
                    onSave={handleSaveEdit}
                    onClose={() => setEditingVideo(null)}
                />
            )}

            {/* Preview Modal */}
            {previewVideo && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-4xl">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-12 right-0 text-white hover:bg-white/20"
                            onClick={() => setPreviewVideo(null)}
                        >
                            <X className="w-6 h-6" />
                        </Button>
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                            <iframe
                                src={`https://www.youtube.com/embed/${previewVideo.youtubeId}?autoplay=1`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <p className="text-white text-center mt-4 font-medium">{previewVideo.title}</p>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-destructive">წაშლის დადასტურება</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>ნამდვილად გსურთ ამ ვიდეოს წაშლა?</p>
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

            {/* Bulk Delete Confirmation */}
            {bulkDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-destructive">მასობრივი წაშლა</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>ნამდვილად გსურთ {selectedVideos.size} ვიდეოს წაშლა?</p>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setBulkDeleteConfirm(false)}>
                                    გაუქმება
                                </Button>
                                <Button variant="destructive" onClick={handleBulkDelete}>
                                    წაშლა ({selectedVideos.size})
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

// Add Video Modal Component
function AddVideoModal({
    onSave,
    onClose
}: {
    onSave: (video: Omit<VideoItem, "id">) => void
    onClose: () => void
}) {
    const [formData, setFormData] = React.useState({
        title: "",
        description: "",
        youtubeId: "",
        category: CATEGORIES[0],
        duration: "",
        type: "long" as "long" | "short",
        tags: [] as string[],
        status: "published" as "published" | "draft" | "scheduled",
        scheduledAt: "",
        views: 0,
        publishedAt: new Date().toISOString().split("T")[0]
    })
    const [tagInput, setTagInput] = React.useState("")

    const handleYouTubeUrl = (url: string) => {
        const id = extractYouTubeId(url)
        setFormData({ ...formData, youtubeId: id })
    }

    const addTag = (tag: string) => {
        if (tag && !formData.tags.includes(tag)) {
            setFormData({ ...formData, tags: [...formData.tags, tag] })
            setTagInput("")
        }
    }

    const removeTag = (tag: string) => {
        setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        ახალი ვიდეოს დამატება
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">სათაური *</label>
                            <Input
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="ვიდეოს სათაური"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">აღწერა</label>
                            <textarea
                                className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="ვიდეოს აღწერა"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">YouTube URL ან ID *</label>
                                <Input
                                    required
                                    value={formData.youtubeId}
                                    onChange={(e) => handleYouTubeUrl(e.target.value)}
                                    placeholder="https://youtube.com/watch?v=... ან ID"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">კატეგორია</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ხანგრძლივობა</label>
                                <Input
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    placeholder="12:34"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ტიპი</label>
                                <div className="flex gap-2">
                                    {(["long", "short"] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type })}
                                            className={`flex-1 px-3 py-2 rounded-md border text-sm font-medium transition-colors ${formData.type === type
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "border-input hover:bg-muted"
                                                }`}
                                        >
                                            {type === "long" ? "Long" : "Short"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">თეგები</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="gap-1">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag(tagInput))}
                                    placeholder="თეგის დამატება..."
                                    className="flex-1"
                                />
                                <Button type="button" variant="outline" onClick={() => addTag(tagInput)}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {AVAILABLE_TAGS.filter(t => !formData.tags.includes(t)).slice(0, 5).map(tag => (
                                    <Badge
                                        key={tag}
                                        variant="outline"
                                        className="cursor-pointer hover:bg-muted"
                                        onClick={() => addTag(tag)}
                                    >
                                        + {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Status & Scheduling */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">სტატუსი</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                >
                                    <option value="published">გამოქვეყნებული</option>
                                    <option value="draft">დრაფტი</option>
                                    <option value="scheduled">დაგეგმილი</option>
                                </select>
                            </div>
                            {formData.status === "scheduled" && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">გამოქვეყნების თარიღი</label>
                                    <Input
                                        type="datetime-local"
                                        value={formData.scheduledAt}
                                        onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={onClose}>
                                გაუქმება
                            </Button>
                            <Button type="submit">
                                <Plus className="w-4 h-4 mr-2" />
                                დამატება
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

// Edit Modal Component
function EditVideoModal({
    video,
    onSave,
    onClose
}: {
    video: VideoItem
    onSave: (video: VideoItem) => void
    onClose: () => void
}) {
    const [formData, setFormData] = React.useState({
        title: video.title,
        description: video.description,
        youtubeId: video.youtubeId,
        category: video.category,
        duration: video.duration,
        type: video.type,
        tags: video.tags || [],
        status: video.status || "published",
        scheduledAt: video.scheduledAt || ""
    })
    const [tagInput, setTagInput] = React.useState("")

    const addTag = (tag: string) => {
        if (tag && !formData.tags.includes(tag)) {
            setFormData({ ...formData, tags: [...formData.tags, tag] })
            setTagInput("")
        }
    }

    const removeTag = (tag: string) => {
        setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            ...video,
            ...formData
        })
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>ვიდეოს რედაქტირება</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Preview */}
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                            <img
                                src={`https://img.youtube.com/vi/${formData.youtubeId}/mqdefault.jpg`}
                                alt={formData.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

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
                                className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">YouTube ID</label>
                                <Input
                                    value={formData.youtubeId}
                                    onChange={(e) => setFormData({ ...formData, youtubeId: extractYouTubeId(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">კატეგორია</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ხანგრძლივობა</label>
                                <Input
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    placeholder="12:34"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ტიპი</label>
                                <div className="flex gap-2">
                                    {(["long", "short"] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type })}
                                            className={`flex-1 px-3 py-2 rounded-md border text-sm font-medium transition-colors ${formData.type === type
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "border-input hover:bg-muted"
                                                }`}
                                        >
                                            {type === "long" ? "Long" : "Short"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">თეგები</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="gap-1">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag(tagInput))}
                                    placeholder="თეგის დამატება..."
                                    className="flex-1"
                                />
                                <Button type="button" variant="outline" onClick={() => addTag(tagInput)}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {AVAILABLE_TAGS.filter(t => !formData.tags.includes(t)).slice(0, 5).map(tag => (
                                    <Badge
                                        key={tag}
                                        variant="outline"
                                        className="cursor-pointer hover:bg-muted"
                                        onClick={() => addTag(tag)}
                                    >
                                        + {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Status & Scheduling */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">სტატუსი</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                >
                                    <option value="published">გამოქვეყნებული</option>
                                    <option value="draft">დრაფტი</option>
                                    <option value="scheduled">დაგეგმილი</option>
                                </select>
                            </div>
                            {formData.status === "scheduled" && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">გამოქვეყნების თარიღი</label>
                                    <Input
                                        type="datetime-local"
                                        value={formData.scheduledAt}
                                        onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                                    />
                                </div>
                            )}
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

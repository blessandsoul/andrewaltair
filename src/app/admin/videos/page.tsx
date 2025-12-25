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
    Youtube
} from "lucide-react"
import videosData from "@/data/videos.json"

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
}

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
}

export default function VideosPage() {
    const [videos, setVideos] = React.useState<VideoItem[]>(videosData as VideoItem[])
    const [searchQuery, setSearchQuery] = React.useState("")
    const [editingVideo, setEditingVideo] = React.useState<VideoItem | null>(null)
    const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null)
    const [typeFilter, setTypeFilter] = React.useState<"all" | "long" | "short">("all")

    // Filter videos
    const filteredVideos = videos.filter(video => {
        const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            video.category.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = typeFilter === "all" || video.type === typeFilter
        return matchesSearch && matchesType
    })

    // Delete video
    const handleDelete = (id: string) => {
        setVideos(videos.filter(v => v.id !== id))
        setDeleteConfirm(null)
    }

    // Save edit
    const handleSaveEdit = (updatedVideo: VideoItem) => {
        setVideos(videos.map(v =>
            v.id === updatedVideo.id ? updatedVideo : v
        ))
        setEditingVideo(null)
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
                        {filteredVideos.length} ვიდეო
                    </p>
                </div>

                <div className="flex gap-2">
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
            </div>

            {/* Videos Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVideos.map((video) => (
                    <Card key={video.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                        {/* Thumbnail Placeholder */}
                        <div className="relative aspect-video bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
                            <Youtube className="w-12 h-12 text-red-500" />
                            <Badge
                                className="absolute top-2 right-2"
                                variant={video.type === "short" ? "default" : "secondary"}
                            >
                                {video.type === "short" ? "Short" : "Long"}
                            </Badge>
                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                {video.duration}
                            </div>
                        </div>

                        <CardContent className="p-4">
                            <h3 className="font-semibold truncate">{video.title}</h3>
                            <p className="text-sm text-muted-foreground truncate mt-1">
                                {video.description}
                            </p>

                            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    {formatNumber(video.views)}
                                </span>
                                <Badge variant="outline">{video.category}</Badge>
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

            {/* Edit Modal */}
            {editingVideo && (
                <EditVideoModal
                    video={editingVideo}
                    onSave={handleSaveEdit}
                    onClose={() => setEditingVideo(null)}
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
        type: video.type
    })

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
                                    onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">კატეგორია</label>
                                <Input
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                />
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

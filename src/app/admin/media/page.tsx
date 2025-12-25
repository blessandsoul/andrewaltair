"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Image,
    Upload,
    Trash2,
    Copy,
    Check,
    Grid,
    List,
    Search,
    X,
    Download,
    Folder,
    ImagePlus
} from "lucide-react"

interface MediaItem {
    id: string
    name: string
    url: string
    type: "image" | "video"
    size: string
    uploadedAt: string
}

// Sample media for demo
const sampleMedia: MediaItem[] = [
    {
        id: "1",
        name: "hero-image.jpg",
        url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
        type: "image",
        size: "2.4 MB",
        uploadedAt: "2024-12-25"
    },
    {
        id: "2",
        name: "ai-robot.png",
        url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400",
        type: "image",
        size: "1.8 MB",
        uploadedAt: "2024-12-24"
    },
    {
        id: "3",
        name: "tech-bg.jpg",
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
        type: "image",
        size: "3.1 MB",
        uploadedAt: "2024-12-23"
    },
    {
        id: "4",
        name: "neural-network.png",
        url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400",
        type: "image",
        size: "1.2 MB",
        uploadedAt: "2024-12-22"
    }
]

export default function MediaPage() {
    const [media, setMedia] = React.useState<MediaItem[]>(sampleMedia)
    const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
    const [searchQuery, setSearchQuery] = React.useState("")
    const [selectedItems, setSelectedItems] = React.useState<string[]>([])
    const [copiedId, setCopiedId] = React.useState<string | null>(null)
    const [isDragging, setIsDragging] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const filteredMedia = media.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        // In real app, handle file upload here
        const files = Array.from(e.dataTransfer.files)
        console.log("Dropped files:", files)
    }

    const copyUrl = (url: string, id: string) => {
        navigator.clipboard.writeText(url)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const toggleSelect = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        )
    }

    const deleteSelected = () => {
        setMedia(media.filter(m => !selectedItems.includes(m.id)))
        setSelectedItems([])
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Image className="w-8 h-8 text-indigo-500" />
                        მედია ბიბლიოთეკა
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {media.length} ფაილი
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        ატვირთვა
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        className="hidden"
                    />
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="ძიება..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="flex items-center gap-1 border rounded-lg p-1">
                    <Button
                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setViewMode("grid")}
                    >
                        <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "secondary" : "ghost"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setViewMode("list")}
                    >
                        <List className="w-4 h-4" />
                    </Button>
                </div>

                {selectedItems.length > 0 && (
                    <Button variant="destructive" size="sm" onClick={deleteSelected} className="gap-2">
                        <Trash2 className="w-4 h-4" />
                        წაშლა ({selectedItems.length})
                    </Button>
                )}
            </div>

            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-muted-foreground/20 hover:border-muted-foreground/40"
                    }`}
            >
                <ImagePlus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                    გადმოათრიეთ ფაილები აქ ან{" "}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-indigo-500 hover:underline"
                    >
                        აირჩიეთ
                    </button>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                    PNG, JPG, GIF, WebP, MP4 (max 10MB)
                </p>
            </div>

            {/* Media Grid/List */}
            {viewMode === "grid" ? (
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {filteredMedia.map((item) => (
                        <Card
                            key={item.id}
                            className={`group overflow-hidden cursor-pointer transition-all ${selectedItems.includes(item.id)
                                    ? "ring-2 ring-indigo-500"
                                    : ""
                                }`}
                            onClick={() => toggleSelect(item.id)}
                        >
                            <div className="aspect-square relative overflow-hidden bg-muted">
                                <img
                                    src={item.url}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                {selectedItems.includes(item.id) && (
                                    <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                                        <Check className="w-8 h-8 text-white" />
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-3">
                                <p className="font-medium text-sm truncate">{item.name}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-muted-foreground">{item.size}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            copyUrl(item.url, item.id)
                                        }}
                                    >
                                        {copiedId === item.id ? (
                                            <Check className="w-3 h-3 text-green-500" />
                                        ) : (
                                            <Copy className="w-3 h-3" />
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium w-12"></th>
                                    <th className="text-left px-4 py-3 font-medium">ფაილი</th>
                                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">ზომა</th>
                                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">თარიღი</th>
                                    <th className="text-right px-4 py-3 font-medium">მოქმედება</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredMedia.map((item) => (
                                    <tr
                                        key={item.id}
                                        className={`hover:bg-muted/30 transition-colors ${selectedItems.includes(item.id) ? "bg-indigo-500/10" : ""
                                            }`}
                                    >
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => toggleSelect(item.id)}
                                                className="rounded"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={item.url}
                                                    alt={item.name}
                                                    className="w-10 h-10 rounded object-cover"
                                                />
                                                <span className="font-medium">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                                            {item.size}
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                                            {item.uploadedAt}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => copyUrl(item.url, item.id)}
                                                >
                                                    {copiedId === item.id ? (
                                                        <Check className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

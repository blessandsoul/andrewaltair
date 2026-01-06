"use client"

import * as React from "react"
import { useToast } from "@/components/ui/toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TbPhoto, TbUpload, TbTrash, TbCopy, TbCheck, TbLayoutGrid, TbList, TbSearch, TbX, TbDownload, TbFolder, TbPhotoPlus, TbFolderPlus, TbEdit, TbEye, TbArrowsUpDown, TbChevronUp, TbChevronDown, TbVideo, TbInfoCircle, TbRefresh, TbCrop, TbZoomIn, TbChevronLeft, TbChevronRight, TbExternalLink, TbFolderOpen, TbLink } from "react-icons/tb"
import Link from "next/link"

interface MediaItem {
    id: string
    name: string
    url: string
    type: "image" | "video"
    size: string
    sizeBytes: number
    uploadedAt: string
    width?: number
    height?: number
    altText: string
    caption: string
    folder: string
    usedIn: { id: string; title: string; type: string }[]
}

interface FolderItem {
    id: string
    name: string
    count: number
    color: string
}

// Sample folders
const sampleFolders: FolderItem[] = [
    { id: "all", name: "ყველა ფაილი", count: 8, color: "bg-gray-500" },
    { id: "blog", name: "ბლოგი", count: 4, color: "bg-blue-500" },
    { id: "products", name: "პროდუქტები", count: 2, color: "bg-green-500" },
    { id: "avatars", name: "ავატარები", count: 1, color: "bg-purple-500" },
    { id: "videos", name: "ვიდეოები", count: 1, color: "bg-red-500" },
]

// Sample media for demo
const sampleMedia: MediaItem[] = [
    {
        id: "1",
        name: "hero-image.jpg",
        url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
        type: "image",
        size: "2.4 MB",
        sizeBytes: 2516582,
        uploadedAt: "2024-12-25",
        width: 1920,
        height: 1080,
        altText: "AI ტექნოლოგია ჰერო სურათი",
        caption: "თანამედროვე AI ინტერფეისი",
        folder: "blog",
        usedIn: [
            { id: "1", title: "ChatGPT-ს ღმერთის რეჟიმი", type: "პოსტი" },
            { id: "2", title: "მთავარი გვერდი", type: "გვერდი" }
        ]
    },
    {
        id: "2",
        name: "ai-robot.png",
        url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
        type: "image",
        size: "1.8 MB",
        sizeBytes: 1887436,
        uploadedAt: "2024-12-24",
        width: 1600,
        height: 900,
        altText: "AI რობოტი",
        caption: "ხელოვნური ინტელექტის რობოტი",
        folder: "blog",
        usedIn: [{ id: "3", title: "AI ინსტრუმენტები 2024", type: "პოსტი" }]
    },
    {
        id: "3",
        name: "tech-bg.jpg",
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
        type: "image",
        size: "3.1 MB",
        sizeBytes: 3250585,
        uploadedAt: "2024-12-23",
        width: 2560,
        height: 1440,
        altText: "ტექნოლოგიური ფონი",
        caption: "",
        folder: "blog",
        usedIn: []
    },
    {
        id: "4",
        name: "neural-network.png",
        url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
        type: "image",
        size: "1.2 MB",
        sizeBytes: 1258291,
        uploadedAt: "2024-12-22",
        width: 1200,
        height: 800,
        altText: "ნეირონული ქსელი",
        caption: "Deep Learning ვიზუალიზაცია",
        folder: "blog",
        usedIn: [{ id: "4", title: "Machine Learning გაიდი", type: "პოსტი" }]
    },
    {
        id: "5",
        name: "product-ai-tool.jpg",
        url: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800",
        type: "image",
        size: "890 KB",
        sizeBytes: 911360,
        uploadedAt: "2024-12-21",
        width: 1000,
        height: 1000,
        altText: "AI პროდუქტი",
        caption: "",
        folder: "products",
        usedIn: []
    },
    {
        id: "6",
        name: "chatbot-interface.png",
        url: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800",
        type: "image",
        size: "1.5 MB",
        sizeBytes: 1572864,
        uploadedAt: "2024-12-20",
        width: 1400,
        height: 900,
        altText: "ჩატბოტის ინტერფეისი",
        caption: "AI ჩატბოტი",
        folder: "products",
        usedIn: [{ id: "5", title: "პროდუქტების გვერდი", type: "გვერდი" }]
    },
    {
        id: "7",
        name: "avatar-andrew.jpg",
        url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        type: "image",
        size: "245 KB",
        sizeBytes: 250880,
        uploadedAt: "2024-12-19",
        width: 400,
        height: 400,
        altText: "Andrew Altair ავატარი",
        caption: "",
        folder: "avatars",
        usedIn: [{ id: "6", title: "ავტორის პროფილი", type: "გვერდი" }]
    },
    {
        id: "8",
        name: "ai-tutorial.mp4",
        url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        type: "video",
        size: "15.2 MB",
        sizeBytes: 15938355,
        uploadedAt: "2024-12-18",
        width: 1920,
        height: 1080,
        altText: "AI ტუტორიალი ვიდეო",
        caption: "როგორ გამოვიყენოთ AI",
        folder: "videos",
        usedIn: [{ id: "7", title: "ვიდეო ტუტორიალი", type: "პოსტი" }]
    }
]

export default function MediaPage() {
    // Core state
    const [media, setMedia] = React.useState<MediaItem[]>([])
    const [folders, setFolders] = React.useState<FolderItem[]>(sampleFolders)
    const [isLoading, setIsLoading] = React.useState(true)
    const toast = useToast()

    // Fetch media from MongoDB API
    React.useEffect(() => {
        async function fetchMedia() {
            try {
                const res = await fetch('/api/media')
                if (res.ok) {
                    const data = await res.json()
                    setMedia(data.media || [])
                }
            } catch (error) {
                console.error('Error fetching media:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchMedia()
    }, [])

    // View state
    const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
    const [searchQuery, setSearchQuery] = React.useState("")
    const [selectedItems, setSelectedItems] = React.useState<string[]>([])
    const [copiedId, setCopiedId] = React.useState<string | null>(null)
    const [isDragging, setIsDragging] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // TbFolder state
    const [currentFolder, setCurrentFolder] = React.useState("all")
    const [showNewFolder, setShowNewFolder] = React.useState(false)
    const [newFolderName, setNewFolderName] = React.useState("")

    // Filter & Sort
    const [typeFilter, setTypeFilter] = React.useState<"all" | "image" | "video">("all")
    const [sortBy, setSortBy] = React.useState<"name" | "size" | "date">("date")
    const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc")

    // Detail/Preview Modal
    const [viewingMedia, setViewingMedia] = React.useState<string | null>(null)

    // Edit Modal
    const [editingMedia, setEditingMedia] = React.useState<string | null>(null)
    const [editName, setEditName] = React.useState("")
    const [editAlt, setEditAlt] = React.useState("")
    const [editCaption, setEditCaption] = React.useState("")

    // Delete confirmation
    const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null)

    // Upload progress simulation
    const [uploadProgress, setUploadProgress] = React.useState<{ name: string; progress: number }[]>([])

    // Get current media item for viewing
    const currentMedia = viewingMedia ? media.find(m => m.id === viewingMedia) : null
    const editingItem = editingMedia ? media.find(m => m.id === editingMedia) : null

    // Filter and sort media
    const filteredMedia = media
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesFolder = currentFolder === "all" || item.folder === currentFolder
            const matchesType = typeFilter === "all" || item.type === typeFilter
            return matchesSearch && matchesFolder && matchesType
        })
        .sort((a, b) => {
            let comparison = 0
            switch (sortBy) {
                case "name":
                    comparison = a.name.localeCompare(b.name)
                    break
                case "size":
                    comparison = a.sizeBytes - b.sizeBytes
                    break
                case "date":
                    comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
                    break
            }
            return sortOrder === "asc" ? comparison : -comparison
        })

    // Handlers
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
        const files = Array.from(e.dataTransfer.files)
        simulateUpload(files)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        simulateUpload(files)
        e.target.value = ""
    }

    // Upload files to API
    const uploadFiles = async (files: File[]) => {
        const uploads = files.map(file => ({ name: file.name, progress: 0 }))
        setUploadProgress(uploads)

        for (let i = 0; i < files.length; i++) {
            const file = files[i]

            try {
                // Update progress to show starting
                setUploadProgress(prev => prev.map((u, idx) =>
                    idx === i ? { ...u, progress: 20 } : u
                ))

                // Convert file to base64
                const base64 = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onload = () => resolve(reader.result as string)
                    reader.onerror = reject
                    reader.readAsDataURL(file)
                })

                // Update progress
                setUploadProgress(prev => prev.map((u, idx) =>
                    idx === i ? { ...u, progress: 50 } : u
                ))

                // Upload to API
                const res = await fetch('/api/media', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: file.name,
                        url: base64,
                        type: file.type.startsWith('video') ? 'video' : 'image',
                        size: formatBytes(file.size),
                        sizeBytes: file.size,
                        folder: currentFolder === 'all' ? 'blog' : currentFolder,
                        altText: '',
                        caption: '',
                    })
                })

                // Update progress
                setUploadProgress(prev => prev.map((u, idx) =>
                    idx === i ? { ...u, progress: 90 } : u
                ))

                if (res.ok) {
                    const data = await res.json()
                    // Add new media to state
                    setMedia(prev => [{
                        ...data.media,
                        id: data.media.id || data.media._id,
                        uploadedAt: new Date().toISOString().split('T')[0],
                        usedIn: []
                    }, ...prev])
                    toast.success('ატვირთულია', file.name)
                } else {
                    toast.error('შეცდომა', `${file.name} - ვერ აიტვირთა`)
                }

                // Complete this file
                setUploadProgress(prev => prev.map((u, idx) =>
                    idx === i ? { ...u, progress: 100 } : u
                ))
            } catch (error) {
                console.error('Upload error:', error)
                toast.error('შეცდომა', `${file.name} - ატვირთვა ვერ მოხერხდა`)
                setUploadProgress(prev => prev.map((u, idx) =>
                    idx === i ? { ...u, progress: -1 } : u
                ))
            }
        }

        // Clear progress after short delay
        setTimeout(() => {
            setUploadProgress([])
        }, 1000)
    }

    // Legacy alias for compatibility
    const simulateUpload = uploadFiles

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return bytes + " B"
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
        return (bytes / 1048576).toFixed(1) + " MB"
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

    const selectAll = () => {
        if (selectedItems.length === filteredMedia.length) {
            setSelectedItems([])
        } else {
            setSelectedItems(filteredMedia.map(m => m.id))
        }
    }

    const deleteSelected = async () => {
        try {
            await Promise.all(selectedItems.map(id =>
                fetch(`/api/media/${id}`, { method: 'DELETE' })
            ))
            setMedia(media.filter(m => !selectedItems.includes(m.id)))
            toast.success('წაშლილია', `${selectedItems.length} ფაილი`)
            setSelectedItems([])
        } catch (error) {
            console.error('Delete selected error:', error)
            toast.error('შეცდომა', 'წაშლა ვერ მოხერხდა')
        }
    }

    const deleteItem = async (id: string) => {
        try {
            const res = await fetch(`/api/media/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setMedia(media.filter(m => m.id !== id))
                toast.success('წაშლილია', 'ფაილი წარმატებით წაიშალა')
                setDeleteConfirm(null)
                setViewingMedia(null)
            }
        } catch (error) {
            console.error('Delete media error:', error)
            toast.error('შეცდომა', 'წაშლა ვერ მოხერხდა')
        }
    }

    // Add folder
    const addFolder = () => {
        if (!newFolderName.trim()) return
        const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", "bg-yellow-500", "bg-pink-500"]
        const newFolder: FolderItem = {
            id: newFolderName.toLowerCase().replace(/\s+/g, "-"),
            name: newFolderName,
            count: 0,
            color: colors[Math.floor(Math.random() * colors.length)]
        }
        setFolders([...folders, newFolder])
        setNewFolderName("")
        setShowNewFolder(false)
    }

    // Start editing
    const startEdit = (item: MediaItem) => {
        setEditingMedia(item.id)
        setEditName(item.name)
        setEditAlt(item.altText)
        setEditCaption(item.caption)
    }

    // Save edit with API
    const saveEdit = async () => {
        if (!editingMedia) return
        try {
            const res = await fetch(`/api/media/${editingMedia}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName, altText: editAlt, caption: editCaption })
            })
            if (res.ok) {
                setMedia(media.map(m =>
                    m.id === editingMedia
                        ? { ...m, name: editName, altText: editAlt, caption: editCaption }
                        : m
                ))
                setEditingMedia(null)
            }
        } catch (error) {
            console.error('Save media error:', error)
        }
    }

    // Navigate preview
    const navigatePreview = (direction: "prev" | "next") => {
        const currentIndex = filteredMedia.findIndex(m => m.id === viewingMedia)
        if (direction === "prev" && currentIndex > 0) {
            setViewingMedia(filteredMedia[currentIndex - 1].id)
        } else if (direction === "next" && currentIndex < filteredMedia.length - 1) {
            setViewingMedia(filteredMedia[currentIndex + 1].id)
        }
    }

    // Update folder counts
    React.useEffect(() => {
        setFolders(folders.map(f => ({
            ...f,
            count: f.id === "all" ? media.length : media.filter(m => m.folder === f.id).length
        })))
    }, [media])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <TbPhoto className="w-8 h-8 text-indigo-500" />
                        მედია ბიბლიოთეკა
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {media.length} ფაილი • {formatBytes(media.reduce((sum, m) => sum + m.sizeBytes, 0))}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowNewFolder(true)}
                        className="gap-2"
                    >
                        <TbFolderPlus className="w-4 h-4" />
                        ფოლდერი
                    </Button>
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2"
                    >
                        <TbUpload className="w-4 h-4" />
                        ატვირთვა
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                </div>
            </div>

            {/* Upload Progress */}
            {uploadProgress.length > 0 && (
                <Card className="border-primary/50">
                    <CardContent className="p-4 space-y-3">
                        <p className="font-medium flex items-center gap-2">
                            <TbUpload className="w-4 h-4 animate-pulse" />
                            იტვირთება...
                        </p>
                        {uploadProgress.map((upload, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="truncate">{upload.name}</span>
                                    <span>{Math.round(upload.progress)}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-200"
                                        style={{ width: `${upload.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            <div className="flex gap-6">
                {/* Folders Sidebar */}
                <div className="w-48 flex-shrink-0 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground px-2">ფოლდერები</p>
                    {folders.map(folder => (
                        <button
                            key={folder.id}
                            onClick={() => setCurrentFolder(folder.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${currentFolder === folder.id
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                                }`}
                        >
                            <div className={`w-3 h-3 rounded ${folder.color}`} />
                            <span className="flex-1 truncate text-sm">{folder.name}</span>
                            <Badge variant="secondary" className="text-xs">{folder.count}</Badge>
                        </button>
                    ))}

                    {showNewFolder && (
                        <div className="flex gap-1 px-2">
                            <Input
                                placeholder="ფოლდერის სახელი"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addFolder()}
                                className="h-8 text-sm"
                                autoFocus
                            />
                            <Button size="icon" className="h-8 w-8" onClick={addFolder}>
                                <TbCheck className="w-3 h-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setShowNewFolder(false)}>
                                <TbX className="w-3 h-3" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-4">
                    {/* Toolbar */}
                    <div className="flex items-center gap-4 flex-wrap">
                        {/* TbSearch */}
                        <div className="relative flex-1 max-w-sm">
                            <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="ძიება..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Type Filter */}
                        <div className="flex rounded-lg border overflow-hidden">
                            {([
                                { value: "all", label: "ყველა", icon: TbLayoutGrid },
                                { value: "image", label: "სურათები", icon: TbPhoto },
                                { value: "video", label: "ვიდეო", icon: TbVideo }
                            ] as const).map((item) => (
                                <button
                                    key={item.value}
                                    onClick={() => setTypeFilter(item.value)}
                                    className={`px-3 py-1.5 text-sm flex items-center gap-1 transition-colors ${typeFilter === item.value
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted"
                                        }`}
                                >
                                    <item.icon className="w-3 h-3" />
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-1">
                            <Select value={sortBy} onValueChange={(v: "name" | "size" | "date") => setSortBy(v)}>
                                <SelectTrigger className="w-[120px] h-9">
                                    <TbArrowsUpDown className="w-3 h-3 mr-1" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="date">თარიღი</SelectItem>
                                    <SelectItem value="name">სახელი</SelectItem>
                                    <SelectItem value="size">ზომა</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                            >
                                {sortOrder === "asc" ? <TbChevronUp className="w-4 h-4" /> : <TbChevronDown className="w-4 h-4" />}
                            </Button>
                        </div>

                        {/* View Mode */}
                        <div className="flex items-center gap-1 border rounded-lg p-1">
                            <Button
                                variant={viewMode === "grid" ? "secondary" : "ghost"}
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => setViewMode("grid")}
                            >
                                <TbLayoutGrid className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "secondary" : "ghost"}
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => setViewMode("list")}
                            >
                                <TbList className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Bulk Delete */}
                        {selectedItems.length > 0 && (
                            <Button variant="destructive" size="sm" onClick={deleteSelected} className="gap-2">
                                <TbTrash className="w-4 h-4" />
                                წაშლა ({selectedItems.length})
                            </Button>
                        )}
                    </div>

                    {/* Select All */}
                    {filteredMedia.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={selectedItems.length === filteredMedia.length && filteredMedia.length > 0}
                                onCheckedChange={selectAll}
                            />
                            <span className="text-sm text-muted-foreground">ყველას მონიშვნა</span>
                        </div>
                    )}

                    {/* Drop Zone */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${isDragging
                            ? "border-indigo-500 bg-indigo-500/10"
                            : "border-muted-foreground/20 hover:border-muted-foreground/40"
                            }`}
                    >
                        <TbPhotoPlus className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">
                            გადმოათრიეთ ფაილები აქ ან{" "}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-indigo-500 hover:underline"
                            >
                                აირჩიეთ
                            </button>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, GIF, WebP, MP4 (max 10MB)
                        </p>
                    </div>

                    {/* Media Grid */}
                    {viewMode === "grid" ? (
                        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                            {filteredMedia.map((item) => (
                                <Card
                                    key={item.id}
                                    className={`group overflow-hidden cursor-pointer transition-all ${selectedItems.includes(item.id)
                                        ? "ring-2 ring-indigo-500"
                                        : ""
                                        }`}
                                >
                                    <div
                                        className="aspect-square relative overflow-hidden bg-muted"
                                        onClick={() => setViewingMedia(item.id)}
                                    >
                                        {item.type === "video" ? (
                                            <div className="w-full h-full flex items-center justify-center bg-black/80">
                                                <TbVideo className="w-12 h-12 text-white/70" />
                                            </div>
                                        ) : (
                                            <img
                                                src={item.url}
                                                alt={item.altText || item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        )}
                                        {selectedItems.includes(item.id) && (
                                            <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                                                <TbCheck className="w-8 h-8 text-white" />
                                            </div>
                                        )}
                                        {/* Overlay actions */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button size="icon" variant="secondary" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setViewingMedia(item.id) }}>
                                                <TbEye className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="secondary" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); startEdit(item) }}>
                                                <TbEdit className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="secondary" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); copyUrl(item.url, item.id) }}>
                                                {copiedId === item.id ? <TbCheck className="w-4 h-4 text-green-500" /> : <TbCopy className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                    <CardContent className="p-3">
                                        <div className="flex items-start gap-2">
                                            <Checkbox
                                                checked={selectedItems.includes(item.id)}
                                                onCheckedChange={() => toggleSelect(item.id)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{item.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-muted-foreground">{item.size}</span>
                                                    {item.usedIn.length > 0 && (
                                                        <Badge variant="secondary" className="text-xs gap-1">
                                                            <TbLink className="w-2 h-2" />
                                                            {item.usedIn.length}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
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
                                            <th className="text-left px-4 py-3 font-medium hidden md:table-cell">გამოყენება</th>
                                            <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">თარიღი</th>
                                            <th className="text-right px-4 py-3 font-medium">მოქმედება</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {filteredMedia.map((item) => (
                                            <tr
                                                key={item.id}
                                                className={`hover:bg-muted/30 transition-colors ${selectedItems.includes(item.id) ? "bg-indigo-500/10" : ""}`}
                                            >
                                                <td className="px-4 py-3">
                                                    <Checkbox
                                                        checked={selectedItems.includes(item.id)}
                                                        onCheckedChange={() => toggleSelect(item.id)}
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        {item.type === "video" ? (
                                                            <div className="w-10 h-10 rounded bg-black flex items-center justify-center">
                                                                <TbVideo className="w-5 h-5 text-white/70" />
                                                            </div>
                                                        ) : (
                                                            <img
                                                                src={item.url}
                                                                alt={item.altText || item.name}
                                                                className="w-10 h-10 rounded object-cover"
                                                            />
                                                        )}
                                                        <div>
                                                            <span className="font-medium">{item.name}</span>
                                                            {item.altText && (
                                                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">{item.altText}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                                                    <div>
                                                        <p>{item.size}</p>
                                                        <p className="text-xs">{item.width}×{item.height}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 hidden md:table-cell">
                                                    {item.usedIn.length > 0 ? (
                                                        <Badge variant="secondary" className="gap-1">
                                                            <TbLink className="w-3 h-3" />
                                                            {item.usedIn.length} ადგილი
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">არ გამოიყენება</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-sm">
                                                    {item.uploadedAt}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewingMedia(item.id)}>
                                                            <TbEye className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(item)}>
                                                            <TbEdit className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyUrl(item.url, item.id)}>
                                                            {copiedId === item.id ? <TbCheck className="w-4 h-4 text-green-500" /> : <TbCopy className="w-4 h-4" />}
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteConfirm(item.id)}>
                                                            <TbTrash className="w-4 h-4" />
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

                    {filteredMedia.length === 0 && (
                        <Card>
                            <CardContent className="p-12 text-center text-muted-foreground">
                                <TbFolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>ფაილები ვერ მოიძებნა</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Preview Modal */}
            {viewingMedia && currentMedia && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex"
                    onClick={() => setViewingMedia(null)}
                >
                    {/* Close */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white hover:bg-white/20"
                        onClick={(e) => {
                            e.stopPropagation()
                            setViewingMedia(null)
                        }}
                    >
                        <TbX className="w-6 h-6" />
                    </Button>

                    {/* Navigation */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                        onClick={(e) => {
                            e.stopPropagation()
                            navigatePreview("prev")
                        }}
                        disabled={filteredMedia.findIndex(m => m.id === viewingMedia) === 0}
                    >
                        <TbChevronLeft className="w-8 h-8" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                        onClick={(e) => {
                            e.stopPropagation()
                            navigatePreview("next")
                        }}
                        disabled={filteredMedia.findIndex(m => m.id === viewingMedia) === filteredMedia.length - 1}
                    >
                        <TbChevronRight className="w-8 h-8" />
                    </Button>

                    {/* Image/TbVideo */}
                    <div className="flex-1 flex items-center justify-center p-16">
                        {currentMedia.type === "video" ? (
                            <video
                                controls
                                className="max-w-full max-h-full rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <source src={currentMedia.url} type="video/mp4" />
                            </video>
                        ) : (
                            <img
                                src={currentMedia.url}
                                alt={currentMedia.altText || currentMedia.name}
                                className="max-w-full max-h-full object-contain rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}
                    </div>

                    {/* Sidebar */}
                    <div
                        className="w-80 bg-card p-6 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="font-bold text-lg mb-4">{currentMedia.name}</h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">ზომა</p>
                                <p>{currentMedia.size} ({currentMedia.width}×{currentMedia.height})</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">ატვირთვის თარიღი</p>
                                <p>{currentMedia.uploadedAt}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">ფოლდერი</p>
                                <Badge variant="secondary">{folders.find(f => f.id === currentMedia.folder)?.name || currentMedia.folder}</Badge>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Alt Text</p>
                                <p className="text-sm">{currentMedia.altText || <span className="italic text-muted-foreground">არ არის მითითებული</span>}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Caption</p>
                                <p className="text-sm">{currentMedia.caption || <span className="italic text-muted-foreground">არ არის მითითებული</span>}</p>
                            </div>

                            {/* Usage */}
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">გამოყენება ({currentMedia.usedIn.length})</p>
                                {currentMedia.usedIn.length > 0 ? (
                                    <div className="space-y-2">
                                        {currentMedia.usedIn.map(usage => (
                                            <div key={usage.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                                <div>
                                                    <p className="text-sm font-medium">{usage.title}</p>
                                                    <p className="text-xs text-muted-foreground">{usage.type}</p>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                                    <TbExternalLink className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">არსად არ გამოიყენება</p>
                                )}
                            </div>

                            <div className="pt-4 border-t space-y-2">
                                <Button className="w-full gap-2" onClick={() => startEdit(currentMedia)}>
                                    <TbEdit className="w-4 h-4" />
                                    რედაქტირება
                                </Button>
                                <Button variant="outline" className="w-full gap-2" onClick={() => copyUrl(currentMedia.url, currentMedia.id)}>
                                    <TbCopy className="w-4 h-4" />
                                    URL-ის კოპირება
                                </Button>
                                <Button variant="outline" className="w-full gap-2" asChild>
                                    <a href={currentMedia.url} download>
                                        <TbDownload className="w-4 h-4" />
                                        ჩამოტვირთვა
                                    </a>
                                </Button>
                                <Button variant="destructive" className="w-full gap-2" onClick={() => setDeleteConfirm(currentMedia.id)}>
                                    <TbTrash className="w-4 h-4" />
                                    წაშლა
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingMedia && editingItem && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <TbEdit className="w-5 h-5" />
                                ფაილის რედაქტირება
                            </CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setEditingMedia(null)}>
                                <TbX className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Preview */}
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                                {editingItem.type === "video" ? (
                                    <div className="w-full h-full flex items-center justify-center bg-black/80">
                                        <TbVideo className="w-12 h-12 text-white/70" />
                                    </div>
                                ) : (
                                    <img
                                        src={editingItem.url}
                                        alt={editingItem.name}
                                        className="w-full h-full object-contain"
                                    />
                                )}
                            </div>

                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ფაილის სახელი</label>
                                <Input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                            </div>

                            {/* Alt Text */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Alt Text (SEO)</label>
                                <Input
                                    value={editAlt}
                                    onChange={(e) => setEditAlt(e.target.value)}
                                    placeholder="სურათის აღწერა ხელმისაწვდომობისთვის..."
                                />
                                <p className="text-xs text-muted-foreground">
                                    მოკლე აღწერა სურათის შესახებ - მნიშვნელოვანია SEO-სთვის და ხელმისაწვდომობისთვის.
                                </p>
                            </div>

                            {/* Caption */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Caption</label>
                                <Textarea
                                    value={editCaption}
                                    onChange={(e) => setEditCaption(e.target.value)}
                                    placeholder="წარწერა სურათის ქვეშ..."
                                    rows={2}
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" onClick={() => setEditingMedia(null)}>
                                    გაუქმება
                                </Button>
                                <Button onClick={saveEdit}>
                                    <TbCheck className="w-4 h-4 mr-1" />
                                    შენახვა
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-destructive flex items-center gap-2">
                                <TbTrash className="w-5 h-5" />
                                წაშლის დადასტურება
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>ნამდვილად გსურთ ამ ფაილის წაშლა?</p>
                            {(() => {
                                const item = media.find(m => m.id === deleteConfirm)
                                return item?.usedIn && item.usedIn.length > 0 ? (
                                    <div className="p-3 bg-destructive/10 rounded-lg text-sm">
                                        <p className="font-medium text-destructive">⚠️ ეს ფაილი გამოიყენება {item.usedIn.length} ადგილას!</p>
                                        <p className="text-muted-foreground mt-1">წაშლის შემთხვევაში ეს ადგილები დარჩება სურათის გარეშე.</p>
                                    </div>
                                ) : null
                            })()}
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                                    გაუქმება
                                </Button>
                                <Button variant="destructive" onClick={() => deleteItem(deleteConfirm)}>
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

"use client"

import * as React from "react"
import { useToast } from "@/components/ui/toast"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    TbPhoto, TbUpload, TbTrash, TbCopy, TbCheck, TbLayoutGrid, TbList,
    TbSearch, TbX, TbFolder, TbFolderPlus, TbEdit, TbEye,
    TbChevronUp, TbChevronDown, TbVideo, TbRefresh, TbChevronLeft,
    TbChevronRight, TbFolderOpen, TbArrowRight, TbHome, TbLoader2
} from "react-icons/tb"

interface FileInfo {
    name: string
    path: string
    url: string
    size: number
    sizeFormatted: string
    type: "image" | "video"
    extension: string
    modifiedAt: string
    folder: string
}

interface FolderInfo {
    name: string
    path: string
    fileCount: number
}

export default function MediaPage() {
    const toast = useToast()

    // State
    const [files, setFiles] = React.useState<FileInfo[]>([])
    const [folders, setFolders] = React.useState<FolderInfo[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [currentFolder, setCurrentFolder] = React.useState("")
    const [totalSize, setTotalSize] = React.useState("0 B")

    // View state
    const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
    const [searchQuery, setSearchQuery] = React.useState("")
    const [selectedItems, setSelectedItems] = React.useState<string[]>([])
    const [copiedPath, setCopiedPath] = React.useState<string | null>(null)
    const [isDragging, setIsDragging] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // Filter & Sort
    const [typeFilter, setTypeFilter] = React.useState<"all" | "image" | "video">("all")
    const [sortBy, setSortBy] = React.useState<"name" | "size" | "date">("date")
    const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc")

    // Modals
    const [viewingFile, setViewingFile] = React.useState<FileInfo | null>(null)
    const [renamingFile, setRenamingFile] = React.useState<FileInfo | null>(null)
    const [newFileName, setNewFileName] = React.useState("")
    const [movingFile, setMovingFile] = React.useState<FileInfo | null>(null)
    const [targetFolder, setTargetFolder] = React.useState("")
    const [showNewFolder, setShowNewFolder] = React.useState(false)
    const [newFolderName, setNewFolderName] = React.useState("")
    const [deleteConfirm, setDeleteConfirm] = React.useState<FileInfo | null>(null)

    // Upload progress
    const [uploadProgress, setUploadProgress] = React.useState<{ name: string; progress: number }[]>([])

    // Get admin token
    const getToken = () => localStorage.getItem('admin_token') || ''

    // Fetch files from disk
    const fetchFiles = React.useCallback(async () => {
        setIsLoading(true)
        try {
            const url = currentFolder
                ? `/api/media/disk?folder=${encodeURIComponent(currentFolder)}`
                : '/api/media/disk'

            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            })

            if (res.ok) {
                const data = await res.json()
                setFiles(data.files || [])
                setFolders(data.folders || [])
                setTotalSize(data.totalSize || "0 B")
            } else {
                toast.error('შეცდომა', 'ფაილების ჩატვირთვა ვერ მოხერხდა')
            }
        } catch (error) {
            console.error('Fetch error:', error)
            toast.error('შეცდომა', 'სერვერთან კავშირი ვერ მოხერხდა')
        } finally {
            setIsLoading(false)
        }
    }, [currentFolder, toast])

    React.useEffect(() => {
        fetchFiles()
    }, [fetchFiles])

    // Filter and sort
    const filteredFiles = files
        .filter(file => {
            const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesType = typeFilter === "all" || file.type === typeFilter
            const matchesFolder = currentFolder
                ? file.folder === currentFolder || file.folder.startsWith(currentFolder + '/')
                : true
            return matchesSearch && matchesType && matchesFolder
        })
        .sort((a, b) => {
            let comparison = 0
            switch (sortBy) {
                case "name":
                    comparison = a.name.localeCompare(b.name)
                    break
                case "size":
                    comparison = a.size - b.size
                    break
                case "date":
                    comparison = new Date(a.modifiedAt).getTime() - new Date(b.modifiedAt).getTime()
                    break
            }
            return sortOrder === "asc" ? comparison : -comparison
        })

    // Get current folder's direct subfolders
    const currentFolders = folders.filter(f => {
        if (!currentFolder) return !f.path.includes('/')
        return f.path.startsWith(currentFolder + '/') && !f.path.slice(currentFolder.length + 1).includes('/')
    })

    // Upload handler
    const handleUpload = async (fileList: File[]) => {
        const uploads = fileList.map(f => ({ name: f.name, progress: 0 }))
        setUploadProgress(uploads)

        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i]
            try {
                setUploadProgress(prev => prev.map((u, idx) =>
                    idx === i ? { ...u, progress: 30 } : u
                ))

                const formData = new FormData()
                formData.append('file', file)
                formData.append('folder', currentFolder)

                const res = await fetch('/api/media/disk', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${getToken()}` },
                    body: formData
                })

                setUploadProgress(prev => prev.map((u, idx) =>
                    idx === i ? { ...u, progress: 90 } : u
                ))

                if (res.ok) {
                    toast.success('ატვირთულია', file.name)
                    setUploadProgress(prev => prev.map((u, idx) =>
                        idx === i ? { ...u, progress: 100 } : u
                    ))
                } else {
                    const error = await res.json()
                    toast.error('შეცდომა', error.error || 'ატვირთვა ვერ მოხერხდა')
                }
            } catch {
                toast.error('შეცდომა', `${file.name} - ატვირთვა ვერ მოხერხდა`)
            }
        }

        setTimeout(() => {
            setUploadProgress([])
            fetchFiles()
        }, 1000)
    }

    // Drag & Drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => setIsDragging(false)

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const fileList = Array.from(e.dataTransfer.files)
        handleUpload(fileList)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = Array.from(e.target.files || [])
        handleUpload(fileList)
        e.target.value = ""
    }

    // Delete file
    const handleDelete = async (file: FileInfo) => {
        try {
            const res = await fetch(`/api/media/disk/${file.path}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${getToken()}` }
            })

            if (res.ok) {
                toast.success('წაშლილია', file.name)
                setFiles(files.filter(f => f.path !== file.path))
                setDeleteConfirm(null)
                setViewingFile(null)
            } else {
                toast.error('შეცდომა', 'წაშლა ვერ მოხერხდა')
            }
        } catch {
            toast.error('შეცდომა', 'წაშლა ვერ მოხერხდა')
        }
    }

    // Delete selected
    const deleteSelected = async () => {
        for (const path of selectedItems) {
            await fetch(`/api/media/disk/${path}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${getToken()}` }
            })
        }
        toast.success('წაშლილია', `${selectedItems.length} ფაილი`)
        setSelectedItems([])
        fetchFiles()
    }

    // Rename file
    const handleRename = async () => {
        if (!renamingFile || !newFileName.trim()) return

        try {
            const res = await fetch(`/api/media/disk/${renamingFile.path}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ newName: newFileName })
            })

            if (res.ok) {
                toast.success('გადარქმეულია', newFileName)
                setRenamingFile(null)
                fetchFiles()
            } else {
                toast.error('შეცდომა', 'გადარქმევა ვერ მოხერხდა')
            }
        } catch {
            toast.error('შეცდომა', 'გადარქმევა ვერ მოხერხდა')
        }
    }

    // Move file
    const handleMove = async () => {
        if (!movingFile) return

        try {
            const res = await fetch(`/api/media/disk/${movingFile.path}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ newFolder: targetFolder })
            })

            if (res.ok) {
                toast.success('გადატანილია', movingFile.name)
                setMovingFile(null)
                fetchFiles()
            } else {
                toast.error('შეცდომა', 'გადატანა ვერ მოხერხდა')
            }
        } catch {
            toast.error('შეცდომა', 'გადატანა ვერ მოხერხდა')
        }
    }

    // Create folder
    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return

        try {
            const res = await fetch('/api/media/disk/folder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    name: newFolderName,
                    parent: currentFolder
                })
            })

            if (res.ok) {
                toast.success('შექმნილია', newFolderName)
                setNewFolderName("")
                setShowNewFolder(false)
                fetchFiles()
            } else {
                toast.error('შეცდომა', 'ფოლდერის შექმნა ვერ მოხერხდა')
            }
        } catch {
            toast.error('შეცდომა', 'ფოლდერის შექმნა ვერ მოხერხდა')
        }
    }

    // Copy URL
    const copyUrl = (url: string, path: string) => {
        navigator.clipboard.writeText(window.location.origin + url)
        setCopiedPath(path)
        toast.success('დაკოპირებულია', 'URL დაკოპირებულია')
        setTimeout(() => setCopiedPath(null), 2000)
    }

    // Toggle selection
    const toggleSelect = (path: string) => {
        setSelectedItems(prev =>
            prev.includes(path)
                ? prev.filter(p => p !== path)
                : [...prev, path]
        )
    }

    // Select all
    const selectAll = () => {
        if (selectedItems.length === filteredFiles.length) {
            setSelectedItems([])
        } else {
            setSelectedItems(filteredFiles.map(f => f.path))
        }
    }

    // Navigate preview
    const navigatePreview = (direction: "prev" | "next") => {
        if (!viewingFile) return
        const currentIndex = filteredFiles.findIndex(f => f.path === viewingFile.path)
        if (direction === "prev" && currentIndex > 0) {
            setViewingFile(filteredFiles[currentIndex - 1])
        } else if (direction === "next" && currentIndex < filteredFiles.length - 1) {
            setViewingFile(filteredFiles[currentIndex + 1])
        }
    }

    // Breadcrumb navigation
    const breadcrumbs = currentFolder ? currentFolder.split('/') : []

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <TbPhoto className="w-8 h-8 text-indigo-500" />
                        მედია მენეჯერი
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {files.length} ფაილი • {totalSize}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchFiles} disabled={isLoading}>
                        <TbRefresh className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        განახლება
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewFolder(true)}>
                        <TbFolderPlus className="w-4 h-4 mr-2" />
                        ფოლდერი
                    </Button>
                    <Button onClick={() => fileInputRef.current?.click()}>
                        <TbUpload className="w-4 h-4 mr-2" />
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

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
                <button
                    onClick={() => setCurrentFolder("")}
                    className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-muted ${!currentFolder ? 'text-primary font-medium' : ''}`}
                >
                    <TbHome className="w-4 h-4" />
                    uploads
                </button>
                {breadcrumbs.map((crumb, i) => (
                    <React.Fragment key={i}>
                        <TbChevronRight className="w-4 h-4 text-muted-foreground" />
                        <button
                            onClick={() => setCurrentFolder(breadcrumbs.slice(0, i + 1).join('/'))}
                            className={`px-2 py-1 rounded hover:bg-muted ${i === breadcrumbs.length - 1 ? 'text-primary font-medium' : ''}`}
                        >
                            {crumb}
                        </button>
                    </React.Fragment>
                ))}
            </div>

            {/* Upload Progress */}
            {uploadProgress.length > 0 && (
                <Card className="border-primary/50">
                    <CardContent className="p-4 space-y-3">
                        <p className="font-medium flex items-center gap-2">
                            <TbLoader2 className="w-4 h-4 animate-spin" />
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

            {/* Folders */}
            {currentFolders.length > 0 && (
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
                    {currentFolders.map(folder => (
                        <button
                            key={folder.path}
                            onClick={() => setCurrentFolder(folder.path)}
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors text-left"
                        >
                            <TbFolder className="w-8 h-8 text-yellow-500" />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{folder.name}</p>
                                <p className="text-xs text-muted-foreground">{folder.fileCount} ფაილი</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center gap-4 flex-wrap">
                {/* Search */}
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
                    <Button variant="destructive" size="sm" onClick={deleteSelected}>
                        <TbTrash className="w-4 h-4 mr-2" />
                        წაშლა ({selectedItems.length})
                    </Button>
                )}
            </div>

            {/* Select All */}
            {filteredFiles.length > 0 && (
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={selectedItems.length === filteredFiles.length && filteredFiles.length > 0}
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
                <TbUpload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                    გადმოათრიეთ ფაილები აქ ან{" "}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-indigo-500 hover:underline"
                    >
                        აირჩიეთ
                    </button>
                </p>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <TbLoader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredFiles.length === 0 && (
                <div className="text-center py-12">
                    <TbFolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">ფოლდერი ცარიელია</p>
                </div>
            )}

            {/* Grid View */}
            {!isLoading && viewMode === "grid" && filteredFiles.length > 0 && (
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {filteredFiles.map((file) => (
                        <Card
                            key={file.path}
                            className={`group overflow-hidden cursor-pointer transition-all ${selectedItems.includes(file.path) ? "ring-2 ring-indigo-500" : ""
                                }`}
                        >
                            <div
                                className="aspect-square relative overflow-hidden bg-muted"
                                onClick={() => setViewingFile(file)}
                            >
                                {file.type === "video" ? (
                                    <div className="w-full h-full flex items-center justify-center bg-black/80">
                                        <TbVideo className="w-12 h-12 text-white/70" />
                                    </div>
                                ) : (
                                    <img
                                        src={file.url}
                                        alt={file.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                )}
                                {selectedItems.includes(file.path) && (
                                    <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                                        <TbCheck className="w-8 h-8 text-white" />
                                    </div>
                                )}
                                {/* Overlay actions */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button size="icon" variant="secondary" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setViewingFile(file) }}>
                                        <TbEye className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="secondary" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setRenamingFile(file); setNewFileName(file.name) }}>
                                        <TbEdit className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="secondary" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); copyUrl(file.url, file.path) }}>
                                        {copiedPath === file.path ? <TbCheck className="w-4 h-4 text-green-500" /> : <TbCopy className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="p-3">
                                <div className="flex items-start gap-2">
                                    <Checkbox
                                        checked={selectedItems.includes(file.path)}
                                        onCheckedChange={() => toggleSelect(file.path)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{file.sizeFormatted}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* List View */}
            {!isLoading && viewMode === "list" && filteredFiles.length > 0 && (
                <Card>
                    <CardContent className="p-0">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium w-12"></th>
                                    <th className="text-left px-4 py-3 font-medium">ფაილი</th>
                                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">ზომა</th>
                                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">თარიღი</th>
                                    <th className="text-right px-4 py-3 font-medium">მოქმედებები</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFiles.map((file) => (
                                    <tr key={file.path} className="border-b hover:bg-muted/30">
                                        <td className="px-4 py-3">
                                            <Checkbox
                                                checked={selectedItems.includes(file.path)}
                                                onCheckedChange={() => toggleSelect(file.path)}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded overflow-hidden bg-muted flex-shrink-0">
                                                    {file.type === "video" ? (
                                                        <div className="w-full h-full flex items-center justify-center bg-black">
                                                            <TbVideo className="w-5 h-5 text-white/70" />
                                                        </div>
                                                    ) : (
                                                        <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium truncate">{file.name}</p>
                                                    <p className="text-xs text-muted-foreground">{file.folder || 'root'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{file.sizeFormatted}</td>
                                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                                            {new Date(file.modifiedAt).toLocaleDateString('ka-GE')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setViewingFile(file)}>
                                                    <TbEye className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setRenamingFile(file); setNewFileName(file.name) }}>
                                                    <TbEdit className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setMovingFile(file); setTargetFolder(file.folder) }}>
                                                    <TbArrowRight className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => copyUrl(file.url, file.path)}>
                                                    {copiedPath === file.path ? <TbCheck className="w-4 h-4 text-green-500" /> : <TbCopy className="w-4 h-4" />}
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setDeleteConfirm(file)}>
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

            {/* Preview Modal */}
            {viewingFile && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setViewingFile(null)}>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-4 right-4 text-white hover:bg-white/20"
                        onClick={() => setViewingFile(null)}
                    >
                        <TbX className="w-6 h-6" />
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                        onClick={(e) => { e.stopPropagation(); navigatePreview("prev") }}
                    >
                        <TbChevronLeft className="w-8 h-8" />
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                        onClick={(e) => { e.stopPropagation(); navigatePreview("next") }}
                    >
                        <TbChevronRight className="w-8 h-8" />
                    </Button>

                    <div className="max-w-4xl max-h-[80vh] p-4" onClick={(e) => e.stopPropagation()}>
                        {viewingFile.type === "video" ? (
                            <video src={viewingFile.url} controls className="max-w-full max-h-[70vh]" />
                        ) : (
                            <img src={viewingFile.url} alt={viewingFile.name} className="max-w-full max-h-[70vh] object-contain" />
                        )}
                        <div className="mt-4 flex items-center justify-between text-white">
                            <div>
                                <p className="font-medium">{viewingFile.name}</p>
                                <p className="text-sm text-white/70">{viewingFile.sizeFormatted}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" size="sm" onClick={() => copyUrl(viewingFile.url, viewingFile.path)}>
                                    <TbCopy className="w-4 h-4 mr-2" />
                                    URL კოპირება
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => setDeleteConfirm(viewingFile)}>
                                    <TbTrash className="w-4 h-4 mr-2" />
                                    წაშლა
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rename Modal */}
            {renamingFile && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setRenamingFile(null)}>
                    <Card className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4">ფაილის გადარქმევა</h3>
                            <Input
                                value={newFileName}
                                onChange={(e) => setNewFileName(e.target.value)}
                                placeholder="ახალი სახელი"
                                className="mb-4"
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setRenamingFile(null)}>გაუქმება</Button>
                                <Button onClick={handleRename}>შენახვა</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Move Modal */}
            {movingFile && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setMovingFile(null)}>
                    <Card className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4">ფაილის გადატანა</h3>
                            <p className="text-sm text-muted-foreground mb-4">{movingFile.name}</p>
                            <Select value={targetFolder} onValueChange={setTargetFolder}>
                                <SelectTrigger>
                                    <SelectValue placeholder="აირჩიეთ ფოლდერი" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">uploads (root)</SelectItem>
                                    {folders.map(f => (
                                        <SelectItem key={f.path} value={f.path}>{f.path}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => setMovingFile(null)}>გაუქმება</Button>
                                <Button onClick={handleMove}>გადატანა</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* New Folder Modal */}
            {showNewFolder && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowNewFolder(false)}>
                    <Card className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4">ახალი ფოლდერი</h3>
                            <Input
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                placeholder="ფოლდერის სახელი"
                                className="mb-4"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowNewFolder(false)}>გაუქმება</Button>
                                <Button onClick={handleCreateFolder}>შექმნა</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
                    <Card className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-2">ფაილის წაშლა</h3>
                            <p className="text-muted-foreground mb-4">
                                დარწმუნებული ხართ, რომ გსურთ <strong>{deleteConfirm.name}</strong>-ის წაშლა?
                            </p>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>გაუქმება</Button>
                                <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>წაშლა</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

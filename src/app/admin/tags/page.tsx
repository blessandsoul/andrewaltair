"use client"

import * as React from "react"
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
import { TbTag, TbPlus, TbTrash, TbEdit, TbCheck, TbX, TbSearch, TbHash, TbTrendingUp, TbTrendingDown, TbArrowsUpDown, TbChevronDown, TbChevronUp, TbPalette, TbFileText, TbGitMerge, TbChartBar, TbEye, TbDownload, TbUpload, TbSparkles, TbCalendar, TbExternalLink } from "react-icons/tb"

interface TagItem {
    id: string
    name: string
    slug: string
    count: number
    color: string
    description: string
    icon: string
    createdAt: string
    lastUsed: string
    trend: "up" | "down" | "stable"
    posts: { id: string; title: string }[]
}

const colors = [
    { name: "წითელი", value: "bg-red-500" },
    { name: "ნარინჯისფერი", value: "bg-orange-500" },
    { name: "ყვითელი", value: "bg-yellow-500" },
    { name: "მწვანე", value: "bg-green-500" },
    { name: "ცისფერი", value: "bg-teal-500" },
    { name: "ლურჯი", value: "bg-blue-500" },
    { name: "იასამნისფერი", value: "bg-indigo-500" },
    { name: "იისფერი", value: "bg-purple-500" },
    { name: "ვარდისფერი", value: "bg-pink-500" },
    { name: "ნაცრისფერი", value: "bg-gray-500" },
]

const tagIcons = [
    "🏷️", "📌", "⭐", "🔥", "💡", "🎯", "🚀", "💎", "🌟", "⚡",
    "🎨", "🤖", "💻", "📱", "🛠️", "📊", "📈", "🎓", "🔮", "🧠",
    "✨", "🎪", "🎭", "🌈", "🔗", "📚", "🎬", "🎮", "🎵", "🌍"
]

const sampleTags: TagItem[] = [
    {
        id: "1",
        name: "ChatGPT",
        slug: "chatgpt",
        count: 12,
        color: "bg-green-500",
        description: "OpenAI-ს ჩატბოტი და AI ასისტენტი",
        icon: "🤖",
        createdAt: "2024-01-15",
        lastUsed: "2024-12-28",
        trend: "up",
        posts: [
            { id: "1", title: "ChatGPT-ს ღმერთის რეჟიმი" },
            { id: "2", title: "10 საუკეთესო ChatGPT პრომპტი" },
            { id: "3", title: "ChatGPT vs Claude შედარება" }
        ]
    },
    {
        id: "2",
        name: "AI Tools",
        slug: "ai-tools",
        count: 8,
        color: "bg-blue-500",
        description: "ხელოვნური ინტელექტის ინსტრუმენტები",
        icon: "🛠️",
        createdAt: "2024-02-10",
        lastUsed: "2024-12-27",
        trend: "up",
        posts: [
            { id: "4", title: "2024 წლის საუკეთესო AI ინსტრუმენტები" },
            { id: "5", title: "უფასო AI ინსტრუმენტები" }
        ]
    },
    {
        id: "3",
        name: "ტუტორიალი",
        slug: "tutorial",
        count: 15,
        color: "bg-purple-500",
        description: "სასწავლო მასალები და გაიდები",
        icon: "🎓",
        createdAt: "2024-01-01",
        lastUsed: "2024-12-28",
        trend: "stable",
        posts: [
            { id: "6", title: "Midjourney-ს დაწყება" },
            { id: "7", title: "Prompt Engineering გაიდი" }
        ]
    },
    {
        id: "4",
        name: "Midjourney",
        slug: "midjourney",
        count: 5,
        color: "bg-pink-500",
        description: "AI გამოსახულებების გენერატორი",
        icon: "🎨",
        createdAt: "2024-03-20",
        lastUsed: "2024-12-20",
        trend: "down",
        posts: [
            { id: "8", title: "Midjourney v6 სიახლეები" }
        ]
    },
    {
        id: "5",
        name: "Prompt Engineering",
        slug: "prompt-engineering",
        count: 7,
        color: "bg-indigo-500",
        description: "AI-სთვის ეფექტური პრომპტების წერა",
        icon: "💡",
        createdAt: "2024-04-05",
        lastUsed: "2024-12-25",
        trend: "up",
        posts: [
            { id: "9", title: "პრომპტების საიდუმლოები" }
        ]
    },
    {
        id: "6",
        name: "DALL-E",
        slug: "dall-e",
        count: 4,
        color: "bg-orange-500",
        description: "OpenAI-ს გამოსახულებების AI",
        icon: "🖼️",
        createdAt: "2024-05-12",
        lastUsed: "2024-12-15",
        trend: "stable",
        posts: [
            { id: "10", title: "DALL-E 3 გაიდი" }
        ]
    },
]

export default function TagsPage() {
    // Core state
    const [tags, setTags] = React.useState<TagItem[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [searchQuery, setSearchQuery] = React.useState("")

    // Fetch tags from MongoDB API
    React.useEffect(() => {
        async function fetchTags() {
            try {
                const res = await fetch('/api/tags')
                if (res.ok) {
                    const data = await res.json()
                    const formattedTags = (data.tags || []).map((t: Partial<TagItem>) => ({
                        id: t.id || '',
                        name: t.name || '',
                        slug: t.slug || '',
                        count: t.count || 0,
                        color: t.color || 'bg-blue-500',
                        description: t.description || '',
                        icon: t.icon || '🏷️',
                        createdAt: (t.createdAt as string)?.split?.('T')?.[0] || t.createdAt || '',
                        lastUsed: '-',
                        trend: 'stable' as const,
                        posts: []
                    }))
                    setTags(formattedTags)
                }
            } catch (error) {
                console.error('Error fetching tags:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchTags()
    }, [])

    // New tag form
    const [newTagName, setNewTagName] = React.useState("")
    const [newTagDescription, setNewTagDescription] = React.useState("")
    const [newTagColor, setNewTagColor] = React.useState("bg-blue-500")
    const [newTagIcon, setNewTagIcon] = React.useState("🏷️")
    const [showNewTagForm, setShowNewTagForm] = React.useState(false)

    // Edit state
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [editValue, setEditValue] = React.useState("")
    const [editDescription, setEditDescription] = React.useState("")
    const [editColor, setEditColor] = React.useState("")
    const [editIcon, setEditIcon] = React.useState("")

    // Delete confirmation
    const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null)

    // Bulk actions
    const [selectedTags, setSelectedTags] = React.useState<Set<string>>(new Set())

    // Sorting
    const [sortBy, setSortBy] = React.useState<"name" | "count" | "date">("count")
    const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc")

    // TbGitMerge
    const [mergeMode, setTbGitMergeMode] = React.useState(false)
    const [mergeTarget, setTbGitMergeTarget] = React.useState<string | null>(null)

    // Stats modal
    const [viewingStats, setViewingStats] = React.useState<string | null>(null)

    // Posts modal
    const [viewingPosts, setViewingPosts] = React.useState<string | null>(null)

    // Icon picker
    const [showIconPicker, setShowIconPicker] = React.useState<"new" | "edit" | null>(null)

    // Color picker
    const [showColorPicker, setShowColorPicker] = React.useState<"new" | "edit" | null>(null)

    // Filter and sort tags
    const filteredTags = tags
        .filter(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            let comparison = 0
            switch (sortBy) {
                case "name":
                    comparison = a.name.localeCompare(b.name)
                    break
                case "count":
                    comparison = a.count - b.count
                    break
                case "date":
                    comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    break
            }
            return sortOrder === "asc" ? comparison : -comparison
        })

    // Add tag with API
    const addTag = async () => {
        if (!newTagName.trim()) return
        try {
            const res = await fetch('/api/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newTagName,
                    slug: newTagName.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]/g, ""),
                    description: newTagDescription,
                    color: newTagColor,
                    icon: newTagIcon
                })
            })
            if (res.ok) {
                const data = await res.json()
                const newTag: TagItem = {
                    id: data.tag.id,
                    name: newTagName,
                    slug: newTagName.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]/g, ""),
                    count: 0,
                    color: newTagColor,
                    description: newTagDescription,
                    icon: newTagIcon,
                    createdAt: new Date().toISOString().split("T")[0],
                    lastUsed: "-",
                    trend: "stable",
                    posts: []
                }
                setTags([...tags, newTag])
                setNewTagName("")
                setNewTagDescription("")
                setNewTagColor("bg-blue-500")
                setNewTagIcon("🏷️")
                setShowNewTagForm(false)
            }
        } catch (error) {
            console.error('Add tag error:', error)
        }
    }

    // Delete tag with API
    const deleteTag = async (id: string) => {
        try {
            const res = await fetch(`/api/tags/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setTags(tags.filter(t => t.id !== id))
                setDeleteConfirm(null)
                setSelectedTags(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(id)
                    return newSet
                })
            }
        } catch (error) {
            console.error('Delete tag error:', error)
        }
    }

    // Start edit
    const startEdit = (tag: TagItem) => {
        setEditingId(tag.id)
        setEditValue(tag.name)
        setEditDescription(tag.description)
        setEditColor(tag.color)
        setEditIcon(tag.icon)
    }

    // Save edit with API
    const saveEdit = async (id: string) => {
        try {
            const res = await fetch(`/api/tags/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editValue,
                    slug: editValue.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]/g, ""),
                    description: editDescription,
                    color: editColor,
                    icon: editIcon
                })
            })
            if (res.ok) {
                setTags(tags.map(t =>
                    t.id === id
                        ? {
                            ...t,
                            name: editValue,
                            slug: editValue.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]/g, ""),
                            description: editDescription,
                            color: editColor,
                            icon: editIcon
                        }
                        : t
                ))
                setEditingId(null)
            }
        } catch (error) {
            console.error('Save edit error:', error)
        }
    }

    // Bulk delete with API
    const handleBulkDelete = async () => {
        try {
            await Promise.all(Array.from(selectedTags).map(id =>
                fetch(`/api/tags/${id}`, { method: 'DELETE' })
            ))
            setTags(tags.filter(t => !selectedTags.has(t.id)))
            setSelectedTags(new Set())
        } catch (error) {
            console.error('Bulk delete error:', error)
        }
    }

    // Select all
    const handleSelectAll = () => {
        if (selectedTags.size === filteredTags.length) {
            setSelectedTags(new Set())
        } else {
            setSelectedTags(new Set(filteredTags.map(t => t.id)))
        }
    }

    // TbGitMerge tags
    const handleTbGitMerge = () => {
        if (!mergeTarget || selectedTags.size < 2) return

        const targetTag = tags.find(t => t.id === mergeTarget)
        if (!targetTag) return

        // Combine counts and posts from selected tags
        let totalCount = 0
        let allPosts: { id: string; title: string }[] = []

        selectedTags.forEach(id => {
            const tag = tags.find(t => t.id === id)
            if (tag) {
                totalCount += tag.count
                allPosts = [...allPosts, ...tag.posts]
            }
        })

        // Update target tag and remove others
        setTags(tags
            .map(t => t.id === mergeTarget ? { ...t, count: totalCount, posts: allPosts } : t)
            .filter(t => t.id === mergeTarget || !selectedTags.has(t.id))
        )

        setSelectedTags(new Set())
        setTbGitMergeMode(false)
        setTbGitMergeTarget(null)
    }

    // Export tags
    const handleExport = () => {
        const dataStr = JSON.stringify(tags, null, 2)
        const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
        const exportName = `tags_export_${new Date().toISOString().split("T")[0]}.json`

        const linkElement = document.createElement("a")
        linkElement.setAttribute("href", dataUri)
        linkElement.setAttribute("download", exportName)
        linkElement.click()
    }

    // Import tags
    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const importedTags = JSON.parse(event.target?.result as string)
                if (Array.isArray(importedTags)) {
                    // Give new IDs to prevent conflicts
                    const newTags = importedTags.map((tag: TagItem) => ({
                        ...tag,
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
                    }))
                    setTags([...tags, ...newTags])
                }
            } catch (error) {
                console.error("Import error:", error)
            }
        }
        reader.readAsText(file)
        e.target.value = "" // Reset input
    }

    const totalUsage = tags.reduce((sum, t) => sum + t.count, 0)
    const viewingTag = viewingStats ? tags.find(t => t.id === viewingStats) : null
    const viewingPostsTag = viewingPosts ? tags.find(t => t.id === viewingPosts) : null

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <TbTag className="w-8 h-8 text-indigo-500" />
                        თეგები
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {tags.length} თეგი • {totalUsage} გამოყენება
                    </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                    {/* Export Button */}
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <TbDownload className="w-4 h-4 mr-1" />
                        ექსპორტი
                    </Button>

                    {/* Import Button */}
                    <label>
                        <Button variant="outline" size="sm" asChild>
                            <span>
                                <TbUpload className="w-4 h-4 mr-1" />
                                იმპორტი
                            </span>
                        </Button>
                        <input
                            type="file"
                            accept=".json"
                            className="hidden"
                            onChange={handleImport}
                        />
                    </label>

                    {/* Add Tag Button */}
                    <Button onClick={() => setShowNewTagForm(true)}>
                        <TbPlus className="w-4 h-4 mr-1" />
                        ახალი თეგი
                    </Button>
                </div>
            </div>

            {/* New Tag Form Modal */}
            {showNewTagForm && (
                <Card className="border-primary/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TbSparkles className="w-5 h-5" />
                            ახალი თეგის დამატება
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">სახელი</label>
                                <div className="relative">
                                    <TbHash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="თეგის სახელი..."
                                        value={newTagName}
                                        onChange={(e) => setNewTagName(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            {/* Icon & Color */}
                            <div className="flex gap-2">
                                {/* Icon */}
                                <div className="space-y-2 flex-1">
                                    <label className="text-sm font-medium">იკონი</label>
                                    <Button
                                        variant="outline"
                                        className="w-full text-2xl h-10"
                                        onClick={() => setShowIconPicker(showIconPicker === "new" ? null : "new")}
                                    >
                                        {newTagIcon}
                                    </Button>
                                    {showIconPicker === "new" && (
                                        <div className="absolute z-50 bg-card border rounded-lg p-2 shadow-lg grid grid-cols-10 gap-1">
                                            {tagIcons.map(icon => (
                                                <button
                                                    key={icon}
                                                    className="text-xl p-1 hover:bg-muted rounded"
                                                    onClick={() => {
                                                        setNewTagIcon(icon)
                                                        setShowIconPicker(null)
                                                    }}
                                                >
                                                    {icon}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Color */}
                                <div className="space-y-2 flex-1">
                                    <label className="text-sm font-medium">ფერი</label>
                                    <Button
                                        variant="outline"
                                        className="w-full h-10 flex items-center gap-2"
                                        onClick={() => setShowColorPicker(showColorPicker === "new" ? null : "new")}
                                    >
                                        <div className={`w-4 h-4 rounded-full ${newTagColor}`} />
                                        <TbPalette className="w-4 h-4" />
                                    </Button>
                                    {showColorPicker === "new" && (
                                        <div className="absolute z-50 bg-card border rounded-lg p-2 shadow-lg">
                                            <div className="grid grid-cols-5 gap-1">
                                                {colors.map(c => (
                                                    <button
                                                        key={c.value}
                                                        className={`w-8 h-8 rounded-full ${c.value} hover:ring-2 ring-offset-2`}
                                                        title={c.name}
                                                        onClick={() => {
                                                            setNewTagColor(c.value)
                                                            setShowColorPicker(null)
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">აღწერა</label>
                            <Textarea
                                placeholder="თეგის აღწერა (სურვილისამებრ)..."
                                value={newTagDescription}
                                onChange={(e) => setNewTagDescription(e.target.value)}
                                rows={2}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowNewTagForm(false)}>
                                გაუქმება
                            </Button>
                            <Button onClick={addTag} disabled={!newTagName.trim()}>
                                <TbPlus className="w-4 h-4 mr-1" />
                                დამატება
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filters & Sort */}
            <div className="flex flex-col sm:flex-row gap-4">
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

                {/* Sort */}
                <div className="flex items-center gap-2">
                    <Select value={sortBy} onValueChange={(value: "name" | "count" | "date") => setSortBy(value)}>
                        <SelectTrigger className="w-[140px]">
                            <TbArrowsUpDown className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="დალაგება" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">სახელი</SelectItem>
                            <SelectItem value="count">გამოყენება</SelectItem>
                            <SelectItem value="date">თარიღი</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    >
                        {sortOrder === "asc" ? <TbChevronUp className="w-4 h-4" /> : <TbChevronDown className="w-4 h-4" />}
                    </Button>
                </div>

                {/* TbGitMerge Button */}
                {selectedTags.size >= 2 && (
                    <Button
                        variant="outline"
                        onClick={() => setTbGitMergeMode(true)}
                        className="text-indigo-500"
                    >
                        <TbGitMerge className="w-4 h-4 mr-1" />
                        გაერთიანება ({selectedTags.size})
                    </Button>
                )}
            </div>

            {/* Bulk Actions Bar */}
            {selectedTags.size > 0 && !mergeMode && (
                <Card className="bg-primary/10 border-primary/30">
                    <CardContent className="py-3 flex items-center justify-between">
                        <span className="font-medium">
                            {selectedTags.size} თეგი მონიშნულია
                        </span>
                        <div className="flex gap-2">
                            <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                                <TbTrash className="w-4 h-4 mr-1" />
                                წაშლა
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* TbGitMerge Mode */}
            {mergeMode && (
                <Card className="bg-indigo-500/10 border-indigo-500/30">
                    <CardContent className="py-4 space-y-3">
                        <p className="font-medium flex items-center gap-2">
                            <TbGitMerge className="w-5 h-5" />
                            აირჩიეთ სამიზნე თეგი (დანარჩენები გაერთიანდება მასში):
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {Array.from(selectedTags).map(id => {
                                const tag = tags.find(t => t.id === id)
                                return tag ? (
                                    <Button
                                        key={id}
                                        variant={mergeTarget === id ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setTbGitMergeTarget(id)}
                                    >
                                        <span className="mr-1">{tag.icon}</span>
                                        {tag.name}
                                    </Button>
                                ) : null
                            })}
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleTbGitMerge} disabled={!mergeTarget}>
                                გაერთიანება
                            </Button>
                            <Button variant="outline" onClick={() => { setTbGitMergeMode(false); setTbGitMergeTarget(null) }}>
                                გაუქმება
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Select All */}
            {filteredTags.length > 0 && (
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={selectedTags.size === filteredTags.length && filteredTags.length > 0}
                        onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm text-muted-foreground">ყველას მონიშვნა</span>
                </div>
            )}

            {/* Tags Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTags.map((tag) => (
                    <Card key={tag.id} className={`group transition-all ${selectedTags.has(tag.id) ? "ring-2 ring-primary" : ""}`}>
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                {/* Checkbox */}
                                <Checkbox
                                    checked={selectedTags.has(tag.id)}
                                    onCheckedChange={(checked) => {
                                        setSelectedTags(prev => {
                                            const newSet = new Set(prev)
                                            if (checked) {
                                                newSet.add(tag.id)
                                            } else {
                                                newSet.delete(tag.id)
                                            }
                                            return newSet
                                        })
                                    }}
                                    className="mt-1"
                                />

                                {/* Icon */}
                                <div className={`w-10 h-10 rounded-lg ${tag.color} flex items-center justify-center text-xl flex-shrink-0`}>
                                    {tag.icon}
                                </div>

                                {editingId === tag.id ? (
                                    <div className="flex-1 space-y-2">
                                        <Input
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="h-8"
                                            autoFocus
                                        />
                                        <Textarea
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            rows={2}
                                            placeholder="აღწერა..."
                                            className="text-sm"
                                        />
                                        <div className="flex gap-2">
                                            {/* Edit Color */}
                                            <div className="relative">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setShowColorPicker(showColorPicker === "edit" ? null : "edit")}
                                                >
                                                    <div className={`w-4 h-4 rounded-full ${editColor}`} />
                                                </Button>
                                                {showColorPicker === "edit" && (
                                                    <div className="absolute z-50 bg-card border rounded-lg p-2 shadow-lg top-full mt-1">
                                                        <div className="grid grid-cols-5 gap-1">
                                                            {colors.map(c => (
                                                                <button
                                                                    key={c.value}
                                                                    className={`w-6 h-6 rounded-full ${c.value} hover:ring-2 ring-offset-1`}
                                                                    onClick={() => {
                                                                        setEditColor(c.value)
                                                                        setShowColorPicker(null)
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Edit Icon */}
                                            <div className="relative">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setShowIconPicker(showIconPicker === "edit" ? null : "edit")}
                                                >
                                                    {editIcon}
                                                </Button>
                                                {showIconPicker === "edit" && (
                                                    <div className="absolute z-50 bg-card border rounded-lg p-2 shadow-lg top-full mt-1">
                                                        <div className="grid grid-cols-6 gap-1">
                                                            {tagIcons.map(icon => (
                                                                <button
                                                                    key={icon}
                                                                    className="text-lg p-1 hover:bg-muted rounded"
                                                                    onClick={() => {
                                                                        setEditIcon(icon)
                                                                        setShowIconPicker(null)
                                                                    }}
                                                                >
                                                                    {icon}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => saveEdit(tag.id)}
                                            >
                                                <TbCheck className="w-4 h-4 text-green-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setEditingId(null)}
                                            >
                                                <TbX className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium truncate">{tag.name}</p>
                                                {tag.trend === "up" && <TbTrendingUp className="w-3 h-3 text-green-500" />}
                                                {tag.trend === "down" && <TbTrendingDown className="w-3 h-3 text-red-500" />}
                                            </div>
                                            <p className="text-xs text-muted-foreground">/{tag.slug}</p>
                                            {tag.description && (
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                    {tag.description}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-3 mt-2">
                                                <Badge variant="secondary" className="gap-1">
                                                    <TbTrendingUp className="w-3 h-3" />
                                                    {tag.count}
                                                </Badge>
                                                <button
                                                    onClick={() => setViewingPosts(tag.id)}
                                                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                                                >
                                                    <TbFileText className="w-3 h-3" />
                                                    {tag.posts.length} პოსტი
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => setViewingStats(tag.id)}
                                                title="სტატისტიკა"
                                            >
                                                <TbChartBar className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => startEdit(tag)}
                                                title="რედაქტირება"
                                            >
                                                <TbEdit className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-destructive"
                                                onClick={() => setDeleteConfirm(tag.id)}
                                                title="წაშლა"
                                            >
                                                <TbTrash className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredTags.length === 0 && (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        <TbTag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        თეგები ვერ მოიძებნა
                    </CardContent>
                </Card>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-destructive flex items-center gap-2">
                                <TbTrash className="w-5 h-5" />
                                წაშლის დადასტურება
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>ნამდვილად გსურთ ამ თეგის წაშლა?</p>
                            <p className="text-sm text-muted-foreground">
                                ეს მოქმედება წაშლის თეგს ყველა პოსტიდან.
                            </p>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                                    გაუქმება
                                </Button>
                                <Button variant="destructive" onClick={() => deleteTag(deleteConfirm)}>
                                    წაშლა
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Stats Modal */}
            {viewingStats && viewingTag && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <TbChartBar className="w-5 h-5" />
                                სტატისტიკა: {viewingTag.name}
                            </CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setViewingStats(null)}>
                                <TbX className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-muted/50 rounded-lg text-center">
                                    <p className="text-2xl font-bold">{viewingTag.count}</p>
                                    <p className="text-sm text-muted-foreground">გამოყენება</p>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg text-center">
                                    <p className="text-2xl font-bold">{viewingTag.posts.length}</p>
                                    <p className="text-sm text-muted-foreground">პოსტი</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">შექმნის თარიღი:</span>
                                    <span className="flex items-center gap-1">
                                        <TbCalendar className="w-3 h-3" />
                                        {viewingTag.createdAt}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">ბოლო გამოყენება:</span>
                                    <span>{viewingTag.lastUsed}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">ტრენდი:</span>
                                    <span className="flex items-center gap-1">
                                        {viewingTag.trend === "up" && <><TbTrendingUp className="w-4 h-4 text-green-500" /> იზრდება</>}
                                        {viewingTag.trend === "down" && <><TbTrendingDown className="w-4 h-4 text-red-500" /> მცირდება</>}
                                        {viewingTag.trend === "stable" && <>სტაბილური</>}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Posts Modal */}
            {viewingPosts && viewingPostsTag && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <TbFileText className="w-5 h-5" />
                                პოსტები: {viewingPostsTag.name}
                            </CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setViewingPosts(null)}>
                                <TbX className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto space-y-2">
                            {viewingPostsTag.posts.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">
                                    ამ თეგს პოსტები არ აქვს
                                </p>
                            ) : (
                                viewingPostsTag.posts.map(post => (
                                    <div key={post.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <span className="text-sm">{post.title}</span>
                                        <Button variant="ghost" size="sm">
                                            <TbExternalLink className="w-3 h-3 mr-1" />
                                            ნახვა
                                        </Button>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

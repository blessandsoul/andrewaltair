"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Tag,
    Plus,
    Trash2,
    Edit2,
    Check,
    X,
    Search,
    Hash,
    TrendingUp
} from "lucide-react"

interface TagItem {
    id: string
    name: string
    slug: string
    count: number
    color: string
}

const colors = [
    "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500",
    "bg-teal-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500"
]

const sampleTags: TagItem[] = [
    { id: "1", name: "ChatGPT", slug: "chatgpt", count: 12, color: "bg-green-500" },
    { id: "2", name: "AI Tools", slug: "ai-tools", count: 8, color: "bg-blue-500" },
    { id: "3", name: "ტუტორიალი", slug: "tutorial", count: 15, color: "bg-purple-500" },
    { id: "4", name: "Midjourney", slug: "midjourney", count: 5, color: "bg-pink-500" },
    { id: "5", name: "Prompt Engineering", slug: "prompt-engineering", count: 7, color: "bg-indigo-500" },
    { id: "6", name: "DALL-E", slug: "dall-e", count: 4, color: "bg-orange-500" },
]

export default function TagsPage() {
    const [tags, setTags] = React.useState<TagItem[]>(sampleTags)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [newTagName, setNewTagName] = React.useState("")
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [editValue, setEditValue] = React.useState("")

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const addTag = () => {
        if (!newTagName.trim()) return

        const newTag: TagItem = {
            id: Date.now().toString(),
            name: newTagName,
            slug: newTagName.toLowerCase().replace(/\s+/g, "-"),
            count: 0,
            color: colors[Math.floor(Math.random() * colors.length)]
        }

        setTags([...tags, newTag])
        setNewTagName("")
    }

    const deleteTag = (id: string) => {
        setTags(tags.filter(t => t.id !== id))
    }

    const startEdit = (tag: TagItem) => {
        setEditingId(tag.id)
        setEditValue(tag.name)
    }

    const saveEdit = (id: string) => {
        setTags(tags.map(t =>
            t.id === id
                ? { ...t, name: editValue, slug: editValue.toLowerCase().replace(/\s+/g, "-") }
                : t
        ))
        setEditingId(null)
    }

    const totalUsage = tags.reduce((sum, t) => sum + t.count, 0)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Tag className="w-8 h-8 text-indigo-500" />
                        თეგები
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {tags.length} თეგი • {totalUsage} გამოყენება
                    </p>
                </div>
            </div>

            {/* Add Tag */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="ახალი თეგი..."
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addTag()}
                                className="pl-9"
                            />
                        </div>
                        <Button onClick={addTag} className="gap-2">
                            <Plus className="w-4 h-4" />
                            დამატება
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="ძიება..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Tags Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTags.map((tag) => (
                    <Card key={tag.id} className="group">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${tag.color}`} />

                                {editingId === tag.id ? (
                                    <div className="flex-1 flex items-center gap-2">
                                        <Input
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="h-8"
                                            autoFocus
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => saveEdit(tag.id)}
                                        >
                                            <Check className="w-4 h-4 text-green-500" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => setEditingId(null)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex-1">
                                            <p className="font-medium">{tag.name}</p>
                                            <p className="text-xs text-muted-foreground">/{tag.slug}</p>
                                        </div>
                                        <Badge variant="secondary" className="gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            {tag.count}
                                        </Badge>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => startEdit(tag)}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive"
                                                onClick={() => deleteTag(tag.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
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
                        თეგები ვერ მოიძებნა
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

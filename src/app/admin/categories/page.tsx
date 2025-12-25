"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    FolderOpen,
    Plus,
    Trash2,
    Edit2,
    Check,
    X,
    Search,
    Palette,
    FileText,
    GripVertical
} from "lucide-react"

interface Category {
    id: string
    name: string
    slug: string
    description: string
    count: number
    color: string
    icon: string
}

const colorOptions = [
    { name: "Red", value: "#ef4444" },
    { name: "Orange", value: "#f97316" },
    { name: "Yellow", value: "#eab308" },
    { name: "Green", value: "#22c55e" },
    { name: "Teal", value: "#14b8a6" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Indigo", value: "#6366f1" },
    { name: "Purple", value: "#a855f7" },
    { name: "Pink", value: "#ec4899" },
]

const sampleCategories: Category[] = [
    { id: "1", name: "AI Tools", slug: "ai-tools", description: "ხელოვნური ინტელექტის ინსტრუმენტები", count: 15, color: "#6366f1", icon: "🤖" },
    { id: "2", name: "ტუტორიალები", slug: "tutorials", description: "სასწავლო მასალები", count: 12, color: "#22c55e", icon: "📚" },
    { id: "3", name: "სიახლეები", slug: "news", description: "AI სფეროს სიახლეები", count: 8, color: "#3b82f6", icon: "📰" },
    { id: "4", name: "რჩევები", slug: "tips", description: "პრაქტიკული რჩევები", count: 10, color: "#f97316", icon: "💡" },
    { id: "5", name: "მიმოხილვები", slug: "reviews", description: "პროდუქტების მიმოხილვები", count: 6, color: "#a855f7", icon: "⭐" },
]

export default function CategoriesPage() {
    const [categories, setCategories] = React.useState<Category[]>(sampleCategories)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [showAddForm, setShowAddForm] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [formData, setFormData] = React.useState({
        name: "",
        description: "",
        color: "#6366f1",
        icon: "📁"
    })

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAdd = () => {
        if (!formData.name.trim()) return

        const newCategory: Category = {
            id: Date.now().toString(),
            name: formData.name,
            slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
            description: formData.description,
            count: 0,
            color: formData.color,
            icon: formData.icon
        }

        setCategories([...categories, newCategory])
        setFormData({ name: "", description: "", color: "#6366f1", icon: "📁" })
        setShowAddForm(false)
    }

    const handleDelete = (id: string) => {
        setCategories(categories.filter(c => c.id !== id))
    }

    const startEdit = (cat: Category) => {
        setEditingId(cat.id)
        setFormData({
            name: cat.name,
            description: cat.description,
            color: cat.color,
            icon: cat.icon
        })
    }

    const saveEdit = (id: string) => {
        setCategories(categories.map(c =>
            c.id === id
                ? {
                    ...c,
                    name: formData.name,
                    slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
                    description: formData.description,
                    color: formData.color,
                    icon: formData.icon
                }
                : c
        ))
        setEditingId(null)
        setFormData({ name: "", description: "", color: "#6366f1", icon: "📁" })
    }

    const totalPosts = categories.reduce((sum, c) => sum + c.count, 0)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FolderOpen className="w-8 h-8 text-indigo-500" />
                        კატეგორიები
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {categories.length} კატეგორია • {totalPosts} პოსტი
                    </p>
                </div>
                <Button onClick={() => setShowAddForm(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    ახალი კატეგორია
                </Button>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <Card className="border-indigo-500/20 bg-indigo-500/5">
                    <CardContent className="p-4 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">სახელი</label>
                                <Input
                                    placeholder="კატეგორიის სახელი"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">აღწერა</label>
                                <Input
                                    placeholder="მოკლე აღწერა"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ფერი</label>
                                <div className="flex gap-2">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color.value}
                                            onClick={() => setFormData({ ...formData, color: color.value })}
                                            className={`w-6 h-6 rounded-full transition-transform ${formData.color === color.value ? "ring-2 ring-offset-2 ring-indigo-500 scale-110" : ""
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Icon</label>
                                <Input
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-20 text-center text-xl"
                                />
                            </div>
                            <div className="flex-1" />
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                                    გაუქმება
                                </Button>
                                <Button onClick={handleAdd}>
                                    დამატება
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

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

            {/* Categories List */}
            <div className="grid gap-4">
                {filteredCategories.map((cat) => (
                    <Card key={cat.id} className="group">
                        <CardContent className="p-4">
                            {editingId === cat.id ? (
                                <div className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="სახელი"
                                        />
                                        <Input
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="აღწერა"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-2">
                                            {colorOptions.map((color) => (
                                                <button
                                                    key={color.value}
                                                    onClick={() => setFormData({ ...formData, color: color.value })}
                                                    className={`w-5 h-5 rounded-full ${formData.color === color.value ? "ring-2 ring-offset-1 ring-indigo-500" : ""
                                                        }`}
                                                    style={{ backgroundColor: color.value }}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex-1" />
                                        <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                                            გაუქმება
                                        </Button>
                                        <Button size="sm" onClick={() => saveEdit(cat.id)}>
                                            შენახვა
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                                        style={{ backgroundColor: cat.color + "20" }}
                                    >
                                        {cat.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold">{cat.name}</p>
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: cat.color }}
                                            />
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{cat.description}</p>
                                    </div>
                                    <Badge variant="secondary" className="gap-1">
                                        <FileText className="w-3 h-3" />
                                        {cat.count} პოსტი
                                    </Badge>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => startEdit(cat)}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive"
                                            onClick={() => handleDelete(cat.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredCategories.length === 0 && (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        კატეგორიები ვერ მოიძებნა
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

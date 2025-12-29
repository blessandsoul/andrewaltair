"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
    GripVertical,
    Download,
    Upload,
    AlertTriangle,
    Calendar,
    Link2,
    ChevronDown,
    ChevronRight,
    Eye,
    BarChart3,
    // Icons for picker
    Sparkles,
    Zap,
    Brain,
    Bot,
    Cpu,
    Code,
    Terminal,
    Lightbulb,
    BookOpen,
    GraduationCap,
    Newspaper,
    Megaphone,
    Star,
    Heart,
    Trophy,
    Target,
    Rocket,
    Wand2,
    Layers,
    Settings,
    Globe,
    Shield,
    Lock,
    Key,
    Users,
    MessageSquare,
    Mail,
    Bell,
    Camera,
    Image,
    Video,
    Music,
    Headphones,
    Gamepad2,
    Smartphone,
    Laptop,
    Monitor,
    Wifi,
    Cloud,
    Database,
    Server,
    HardDrive,
    Folder,
    File,
    FileCode,
    FileImage,
    FileVideo,
    Palette as PaletteIcon,
    Brush,
    PenTool,
    Wrench
} from "lucide-react"

// Icon options with Lucide icons - comprehensive list
const iconOptions = [
    // AI & Tech
    { name: "Sparkles", icon: Sparkles },
    { name: "Zap", icon: Zap },
    { name: "Brain", icon: Brain },
    { name: "Bot", icon: Bot },
    { name: "Cpu", icon: Cpu },
    { name: "Code", icon: Code },
    { name: "Terminal", icon: Terminal },
    { name: "Wand2", icon: Wand2 },
    // Education
    { name: "Lightbulb", icon: Lightbulb },
    { name: "BookOpen", icon: BookOpen },
    { name: "GraduationCap", icon: GraduationCap },
    // Content
    { name: "Newspaper", icon: Newspaper },
    { name: "Megaphone", icon: Megaphone },
    { name: "FileText", icon: FileText },
    { name: "File", icon: File },
    { name: "FileCode", icon: FileCode },
    { name: "FileImage", icon: FileImage },
    { name: "FileVideo", icon: FileVideo },
    // Social
    { name: "Star", icon: Star },
    { name: "Heart", icon: Heart },
    { name: "Trophy", icon: Trophy },
    { name: "Target", icon: Target },
    { name: "Rocket", icon: Rocket },
    { name: "Users", icon: Users },
    { name: "MessageSquare", icon: MessageSquare },
    { name: "Mail", icon: Mail },
    { name: "Bell", icon: Bell },
    // Media
    { name: "Camera", icon: Camera },
    { name: "Image", icon: Image },
    { name: "Video", icon: Video },
    { name: "Music", icon: Music },
    { name: "Headphones", icon: Headphones },
    { name: "Gamepad2", icon: Gamepad2 },
    // Devices
    { name: "Laptop", icon: Laptop },
    { name: "Monitor", icon: Monitor },
    { name: "Smartphone", icon: Smartphone },
    // Cloud & Data
    { name: "Cloud", icon: Cloud },
    { name: "Database", icon: Database },
    { name: "Server", icon: Server },
    { name: "HardDrive", icon: HardDrive },
    { name: "Wifi", icon: Wifi },
    // Files & Folders
    { name: "Folder", icon: Folder },
    { name: "FolderOpen", icon: FolderOpen },
    { name: "Layers", icon: Layers },
    // Settings & Tools
    { name: "Settings", icon: Settings },
    { name: "Wrench", icon: Wrench },
    { name: "PenTool", icon: PenTool },
    { name: "Brush", icon: Brush },
    { name: "Palette", icon: PaletteIcon },
    // Security
    { name: "Shield", icon: Shield },
    { name: "Lock", icon: Lock },
    { name: "Key", icon: Key },
    // Web
    { name: "Globe", icon: Globe },
    // UI
    { name: "Search", icon: Search },
    { name: "Eye", icon: Eye },
    { name: "Calendar", icon: Calendar },
    { name: "Download", icon: Download },
    { name: "Upload", icon: Upload },
    { name: "Link2", icon: Link2 },
    { name: "BarChart3", icon: BarChart3 },
    { name: "AlertTriangle", icon: AlertTriangle },
    { name: "Plus", icon: Plus },
    { name: "Check", icon: Check },
    { name: "X", icon: X },
    { name: "Edit2", icon: Edit2 },
    { name: "Trash2", icon: Trash2 },
]

interface Category {
    id: string
    name: string
    slug: string
    description: string
    count: number
    color: string
    icon: string
    parentId?: string
    createdAt: string
    updatedAt: string
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
    { id: "1", name: "AI Tools", slug: "ai-tools", description: "ხელოვნური ინტელექტის ინსტრუმენტები", count: 15, color: "#6366f1", icon: "Bot", createdAt: "2024-12-01", updatedAt: "2024-12-20" },
    { id: "2", name: "ტუტორიალები", slug: "tutorials", description: "სასწავლო მასალები", count: 12, color: "#22c55e", icon: "BookOpen", createdAt: "2024-12-05", updatedAt: "2024-12-18" },
    { id: "3", name: "სიახლეები", slug: "news", description: "AI სფეროს სიახლეები", count: 8, color: "#3b82f6", icon: "Newspaper", createdAt: "2024-12-10", updatedAt: "2024-12-25" },
    { id: "4", name: "რჩევები", slug: "tips", description: "პრაქტიკული რჩევები", count: 10, color: "#f97316", icon: "Lightbulb", createdAt: "2024-12-12", updatedAt: "2024-12-22" },
    { id: "5", name: "მიმოხილვები", slug: "reviews", description: "პროდუქტების მიმოხილვები", count: 6, color: "#a855f7", icon: "Star", createdAt: "2024-12-15", updatedAt: "2024-12-27" },
]

// Get icon component by name
function getIconComponent(iconName: string) {
    const found = iconOptions.find(i => i.name === iconName)
    return found ? found.icon : Folder
}

export default function CategoriesPage() {
    const [categories, setCategories] = React.useState<Category[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [showAddForm, setShowAddForm] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [showIconPicker, setShowIconPicker] = React.useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState<string | null>(null)
    const [selectedCategories, setSelectedCategories] = React.useState<string[]>([])
    const [showStats, setShowStats] = React.useState(true)
    const [formData, setFormData] = React.useState({
        name: "",
        slug: "",
        description: "",
        color: "#6366f1",
        icon: "Folder",
        parentId: ""
    })

    // Fetch categories from MongoDB API
    React.useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch('/api/categories')
                if (res.ok) {
                    const data = await res.json()
                    const formattedCategories = (data.categories || []).map((c: Category) => ({
                        ...c,
                        createdAt: c.createdAt?.split?.('T')?.[0] || c.createdAt,
                        updatedAt: c.updatedAt?.split?.('T')?.[0] || c.updatedAt
                    }))
                    setCategories(formattedCategories)
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCategories()
    }, [])

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Auto-generate slug from name
    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        })
    }

    const handleAdd = async () => {
        if (!formData.name.trim()) return
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
                    description: formData.description,
                    color: formData.color,
                    icon: formData.icon,
                    parentId: formData.parentId || undefined
                })
            })
            if (res.ok) {
                const data = await res.json()
                const now = new Date().toISOString().split('T')[0]
                const newCategory: Category = {
                    ...data.category,
                    createdAt: now,
                    updatedAt: now
                }
                setCategories([...categories, newCategory])
                setFormData({ name: "", slug: "", description: "", color: "#6366f1", icon: "Folder", parentId: "" })
                setShowAddForm(false)
            }
        } catch (error) {
            console.error('Add category error:', error)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setCategories(categories.filter(c => c.id !== id))
                setShowDeleteConfirm(null)
            }
        } catch (error) {
            console.error('Delete category error:', error)
        }
    }

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectedCategories.map(id =>
                fetch(`/api/categories/${id}`, { method: 'DELETE' })
            ))
            setCategories(categories.filter(c => !selectedCategories.includes(c.id)))
            setSelectedCategories([])
        } catch (error) {
            console.error('Bulk delete error:', error)
        }
    }

    const startEdit = (cat: Category) => {
        setEditingId(cat.id)
        setFormData({
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            color: cat.color,
            icon: cat.icon,
            parentId: cat.parentId || ""
        })
    }

    const saveEdit = async (id: string) => {
        const now = new Date().toISOString().split('T')[0]
        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    slug: formData.slug,
                    description: formData.description,
                    color: formData.color,
                    icon: formData.icon,
                    parentId: formData.parentId || undefined
                })
            })
            if (res.ok) {
                setCategories(categories.map(c =>
                    c.id === id
                        ? {
                            ...c,
                            name: formData.name,
                            slug: formData.slug,
                            description: formData.description,
                            color: formData.color,
                            icon: formData.icon,
                            parentId: formData.parentId || undefined,
                            updatedAt: now
                        }
                        : c
                ))
                setEditingId(null)
                setFormData({ name: "", slug: "", description: "", color: "#6366f1", icon: "Folder", parentId: "" })
            }
        } catch (error) {
            console.error('Save edit error:', error)
        }
    }

    const toggleSelect = (id: string) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const exportCategories = () => {
        const data = JSON.stringify(categories, null, 2)
        const blob = new Blob([data], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "categories.json"
        a.click()
        URL.revokeObjectURL(url)
    }

    const totalPosts = categories.reduce((sum, c) => sum + c.count, 0)
    const topCategory = categories.reduce((max, c) => c.count > max.count ? c : max, categories[0])

    // Icon Picker Modal Component
    const IconPickerModal = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" onClick={() => setShowIconPicker(false)}>
            <Card className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">აირჩიე Icon</h3>
                        <Button variant="ghost" size="icon" onClick={() => setShowIconPicker(false)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                        {iconOptions.map(({ name, icon: Icon }) => (
                            <button
                                key={name}
                                onClick={() => {
                                    setFormData({ ...formData, icon: name })
                                    setShowIconPicker(false)
                                }}
                                className={`p-3 rounded-lg hover:bg-muted transition-colors ${formData.icon === name ? "bg-primary/10 text-primary ring-2 ring-primary" : ""
                                    }`}
                                title={name}
                            >
                                <Icon className="w-5 h-5" />
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )

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
                <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={() => setShowStats(!showStats)} className="gap-2">
                        <BarChart3 className="w-4 h-4" />
                        სტატისტიკა
                    </Button>

                    {selectedCategories.length > 0 && (
                        <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="gap-2">
                            <Trash2 className="w-4 h-4" />
                            წაშლა ({selectedCategories.length})
                        </Button>
                    )}
                    <Button onClick={() => {
                        setFormData({ name: "", slug: "", description: "", color: "#6366f1", icon: "Folder", parentId: "" })
                        setShowAddForm(true)
                    }} className="gap-2">
                        <Plus className="w-4 h-4" />
                        ახალი
                    </Button>
                </div>
            </div>

            {/* Stats Panel */}
            {showStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-primary">{categories.length}</div>
                            <div className="text-sm text-muted-foreground">კატეგორია</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-green-500">{totalPosts}</div>
                            <div className="text-sm text-muted-foreground">პოსტი</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-orange-500">{Math.round(totalPosts / categories.length)}</div>
                            <div className="text-sm text-muted-foreground">საშუალო პოსტი</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-xl font-bold text-purple-500 truncate">{topCategory?.name}</div>
                            <div className="text-sm text-muted-foreground">ტოპ კატეგორია</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Add Form */}
            {showAddForm && (
                <Card className="border-indigo-500/20 bg-indigo-500/5">
                    <CardContent className="p-4 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">სახელი</label>
                                <Input
                                    placeholder="კატეგორიის სახელი"
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-1">
                                    <Link2 className="w-3 h-3" />
                                    Slug
                                </label>
                                <Input
                                    placeholder="category-slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="font-mono text-sm"
                                />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-sm font-medium">აღწერა</label>
                                <Input
                                    placeholder="მოკლე აღწერა"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-6 flex-wrap">
                            {/* Color Picker */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ფერი</label>
                                <div className="flex gap-2">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color.value}
                                            onClick={() => setFormData({ ...formData, color: color.value })}
                                            className={`w-7 h-7 rounded-full transition-all ${formData.color === color.value ? "ring-2 ring-offset-2 ring-indigo-500 scale-110" : "hover:scale-105"
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Icon Picker */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Icon</label>
                                <button
                                    type="button"
                                    onClick={() => setShowIconPicker(true)}
                                    className="flex items-center gap-2 px-3 py-2 h-10 rounded-lg border border-border bg-card hover:bg-muted transition-colors cursor-pointer"
                                >
                                    {React.createElement(getIconComponent(formData.icon), { className: "w-5 h-5" })}
                                    <span className="text-sm">{formData.icon}</span>
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>

                            {/* Parent Category */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">მშობელი კატეგორია</label>
                                <Select
                                    value={formData.parentId}
                                    onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="არცერთი" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">არცერთი</SelectItem>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex-1" />
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => {
                                    setShowAddForm(false)
                                    setShowIconPicker(false)
                                }}>
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
            <div className="grid gap-3">
                {filteredCategories.map((cat) => {
                    const IconComponent = getIconComponent(cat.icon)
                    const isSelected = selectedCategories.includes(cat.id)

                    return (
                        <Card key={cat.id} className={`group transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleSelect(cat.id)}
                                        className="w-4 h-4 rounded border-border"
                                    />
                                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: cat.color + "20" }}
                                    >
                                        <IconComponent className="w-5 h-5" style={{ color: cat.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold">{cat.name}</p>
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: cat.color }}
                                            />
                                            <span className="text-xs text-muted-foreground font-mono">/{cat.slug}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{cat.description}</p>
                                    </div>
                                    <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        {cat.updatedAt}
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
                                            onClick={() => setShowDeleteConfirm(cat.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {filteredCategories.length === 0 && (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        კატეგორიები ვერ მოიძებნა
                    </CardContent>
                </Card>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
                    <Card className="w-full max-w-md mx-4">
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold">წაშლის დადასტურება</h3>
                            <p className="text-muted-foreground">
                                დარწმუნებული ხართ რომ გსურთ ამ კატეგორიის წაშლა? ეს მოქმედება შეუქცევადია.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
                                    გაუქმება
                                </Button>
                                <Button variant="destructive" onClick={() => handleDelete(showDeleteConfirm)}>
                                    წაშლა
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Edit Category Modal */}
            {editingId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" onClick={() => setEditingId(null)}>
                    <Card className="w-full max-w-xl mx-4" onClick={(e) => e.stopPropagation()}>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Edit2 className="w-5 h-5 text-primary" />
                                    კატეგორიის რედაქტირება
                                </h3>
                                <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">სახელი</label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="კატეგორიის სახელი"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-1">
                                        <Link2 className="w-3 h-3" />
                                        Slug
                                    </label>
                                    <Input
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="category-slug"
                                        className="font-mono text-sm"
                                    />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-sm font-medium">აღწერა</label>
                                    <Input
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="მოკლე აღწერა"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-6 flex-wrap">
                                {/* Color Picker */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">ფერი</label>
                                    <div className="flex gap-2">
                                        {colorOptions.map((color) => (
                                            <button
                                                key={color.value}
                                                onClick={() => setFormData({ ...formData, color: color.value })}
                                                className={`w-7 h-7 rounded-full transition-all ${formData.color === color.value ? "ring-2 ring-offset-2 ring-indigo-500 scale-110" : "hover:scale-105"
                                                    }`}
                                                style={{ backgroundColor: color.value }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Icon Picker Button */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Icon</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowIconPicker(true)}
                                        className="flex items-center gap-2 px-3 py-2 h-10 rounded-lg border border-border bg-card hover:bg-muted transition-colors cursor-pointer"
                                    >
                                        {React.createElement(getIconComponent(formData.icon), { className: "w-5 h-5" })}
                                        <span className="text-sm">{formData.icon}</span>
                                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                </div>

                                {/* Parent Category */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">მშობელი კატეგორია</label>
                                    <Select
                                        value={formData.parentId}
                                        onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="არცერთი" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">არცერთი</SelectItem>
                                            {categories.filter(c => c.id !== editingId).map(cat => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end pt-4 border-t">
                                <Button variant="outline" onClick={() => setEditingId(null)}>
                                    გაუქმება
                                </Button>
                                <Button onClick={() => saveEdit(editingId)}>
                                    შენახვა
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Icon Picker Modal */}
            {showIconPicker && <IconPickerModal />}
        </div>
    )
}

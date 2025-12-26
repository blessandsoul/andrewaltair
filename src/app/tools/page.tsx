"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    MessageSquare,
    Image as ImageIcon,
    Video,
    Music,
    Code,
    Search,
    Zap,
    Sparkles,
    Star,
    ExternalLink,
    Wrench,
    Presentation,
    Palette,
    FileText,
    TrendingUp,
    Languages,
    Mic,
    FileSearch,
    Mail,
    Headphones,
    DollarSign,
    Camera,
    Globe,
    BarChart3,
    GraduationCap,
    Terminal,
    BookOpen,
    User,
    Bookmark,
    Crown,
    Compass,
    Scale,
    Wallet,
    Blocks,
    Gamepad2,
    Box,
    Wand2,
    Filter,
    Shuffle,
    Heart,
    TrendingDown,
    Clock,
    ChevronDown,
    X,
    Flame,
    Award,
    Target,
    LayoutGrid,
    List,
    ArrowUpRight
} from "lucide-react"
import toolsData from "@/data/tools.json"

// Category icons mapping
const categoryIcons: Record<string, any> = {
    "ჩატბოტები": MessageSquare,
    "სურათები": ImageIcon,
    "ვიდეო": Video,
    "აუდიო": Music,
    "კოდი": Code,
    "ძებნა": Search,
    "ავტომატიზაცია": Zap,
    "პროდუქტიულობა": Sparkles,
    "პრეზენტაცია": Presentation,
    "დიზაინი": Palette,
    "კონტენტი": FileText,
    "SEO": TrendingUp,
    "წერა": FileText,
    "თარგმანი": Languages,
    "ტრანსკრიფცია": Mic,
    "დოკუმენტები": FileSearch,
    "ელფოსტა": Mail,
    "მომხმარებელი": Headphones,
    "გაყიდვები": DollarSign,
    "ფოტო რედაქცია": Camera,
    "ვებსაიტი": Globe,
    "ანალიტიკა": BarChart3,
    "განათლება": GraduationCap,
    "დეველოპერი": Terminal,
    "კვლევა": BookOpen,
    "ავატარი": User,
    "ბრაუზერი": Compass,
    "სამართალი": Scale,
    "ფინანსები": Wallet,
    "No-Code": Blocks,
    "თამაშები": Gamepad2,
    "3D": Box,
    "VFX": Wand2,
    "მარკეტინგი": TrendingUp,
    "სუბტიტრები": Mic,
    "კალენდარი": Clock,
    "ჩატბოტი": MessageSquare,
    "AI აგენტები": Zap,
    "AI Labs": Terminal,
    "რეკლამა": DollarSign,
    "ML პლატფორმა": Terminal,
    "HR": User,
}

// Category colors
const categoryColors: Record<string, string> = {
    "ჩატბოტები": "#6366f1",
    "სურათები": "#ec4899",
    "ვიდეო": "#f43f5e",
    "აუდიო": "#8b5cf6",
    "კოდი": "#22d3ee",
    "ძებნა": "#10b981",
    "ავტომატიზაცია": "#f59e0b",
    "პროდუქტიულობა": "#6366f1",
    "პრეზენტაცია": "#f97316",
    "დიზაინი": "#a855f7",
    "კონტენტი": "#14b8a6",
    "SEO": "#84cc16",
    "წერა": "#0ea5e9",
    "თარგმანი": "#06b6d4",
    "ტრანსკრიფცია": "#d946ef",
    "დოკუმენტები": "#64748b",
    "ელფოსტა": "#ef4444",
    "მომხმარებელი": "#22c55e",
    "გაყიდვები": "#eab308",
    "ფოტო რედაქცია": "#f472b6",
    "ვებსაიტი": "#3b82f6",
    "ანალიტიკა": "#10b981",
    "განათლება": "#8b5cf6",
    "დეველოპერი": "#0891b2",
    "კვლევა": "#7c3aed",
    "ავატარი": "#ec4899",
    "ბრაუზერი": "#f97316",
    "სამართალი": "#78716c",
    "ფინანსები": "#059669",
    "No-Code": "#8b5cf6",
    "თამაშები": "#dc2626",
    "3D": "#0ea5e9",
    "VFX": "#f472b6",
    "მარკეტინგი": "#f59e0b",
    "სუბტიტრები": "#a855f7",
    "კალენდარი": "#10b981",
    "ჩატბოტი": "#6366f1",
    "AI აგენტები": "#f43f5e",
    "AI Labs": "#22d3ee",
    "რეკლამა": "#eab308",
    "ML პლატფორმა": "#0891b2",
    "HR": "#7c3aed",
}

// Pricing labels
const pricingLabels: Record<string, { label: string; color: string }> = {
    "free": { label: "უფასო", color: "bg-green-500/10 text-green-600 dark:text-green-400" },
    "freemium": { label: "Freemium", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
    "paid": { label: "ფასიანი", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
}

// Get logo URL - use stored logo or DuckDuckGo icons for favicons
const getLogoUrl = (tool: any) => {
    // If it's a favicon.ico, use DuckDuckGo icons service instead (more reliable, high quality)
    if (tool.logo && tool.logo.includes('favicon.ico')) {
        try {
            const url = new URL(tool.url)
            return `https://icons.duckduckgo.com/ip3/${url.hostname}.ico`
        } catch {
            return tool.logo
        }
    }
    // For other logos (SVG, PNG from CDNs), use directly
    return tool.logo
}

// Get fallback logo URL using Google's favicon service
const getFallbackLogoUrl = (tool: any) => {
    try {
        const url = new URL(tool.url)
        return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`
    } catch {
        return tool.logo
    }
}

// Get DuckDuckGo icon URL
const getDuckDuckGoIcon = (tool: any) => {
    try {
        const url = new URL(tool.url)
        return `https://icons.duckduckgo.com/ip3/${url.hostname}.ico`
    } catch {
        return null
    }
}

// ToolLogo component with fallback handling
const ToolLogo = ({ tool, size = 48, className = "" }: { tool: any, size?: number, className?: string }) => {
    const [imgSrc, setImgSrc] = useState(getLogoUrl(tool))
    const [fallbackLevel, setFallbackLevel] = useState(0)

    const handleError = () => {
        if (fallbackLevel === 0) {
            // Try DuckDuckGo icons
            const ddgIcon = getDuckDuckGoIcon(tool)
            if (ddgIcon) {
                setImgSrc(ddgIcon)
                setFallbackLevel(1)
                return
            }
        }
        if (fallbackLevel <= 1) {
            // Try Google favicon service
            setImgSrc(getFallbackLogoUrl(tool))
            setFallbackLevel(2)
            return
        }
        // Final fallback - show letter placeholder
        setFallbackLevel(3)
    }

    if (fallbackLevel === 3) {
        // Letter-based placeholder
        const initial = tool.name.charAt(0).toUpperCase()
        const color = categoryColors[tool.category] || '#6366f1'
        return (
            <div
                className={`flex items-center justify-center font-bold text-white ${className}`}
                style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                    fontSize: size * 0.4
                }}
            >
                {initial}
            </div>
        )
    }

    return (
        <img
            src={imgSrc}
            alt={tool.name}
            width={size}
            height={size}
            className={`object-contain ${className}`}
            onError={handleError}
        />
    )
}

export default function ToolsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedPricing, setSelectedPricing] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [favorites, setFavorites] = useState<string[]>([])
    const [showFavorites, setShowFavorites] = useState(false)
    const [randomTool, setRandomTool] = useState<any>(null)
    const [showFilters, setShowFilters] = useState(false)

    // Load favorites from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("ai-tool-favorites")
        if (saved) setFavorites(JSON.parse(saved))
    }, [])

    // Save favorites to localStorage
    const toggleFavorite = (id: string) => {
        const newFavorites = favorites.includes(id)
            ? favorites.filter(f => f !== id)
            : [...favorites, id]
        setFavorites(newFavorites)
        localStorage.setItem("ai-tool-favorites", JSON.stringify(newFavorites))
    }

    const featuredTools = toolsData.filter(t => t.featured)
    const categories = [...new Set(toolsData.map(t => t.category))]

    // Filter tools
    const filteredTools = useMemo(() => {
        let tools = [...toolsData]

        if (showFavorites) {
            tools = tools.filter(t => favorites.includes(t.id))
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            tools = tools.filter(t =>
                t.name.toLowerCase().includes(query) ||
                t.description.toLowerCase().includes(query) ||
                t.category.toLowerCase().includes(query)
            )
        }

        if (selectedCategory) {
            tools = tools.filter(t => t.category === selectedCategory)
        }

        if (selectedPricing) {
            tools = tools.filter(t => t.pricing === selectedPricing)
        }

        return tools
    }, [searchQuery, selectedCategory, selectedPricing, showFavorites, favorites])

    // Random tool discovery
    const discoverRandomTool = () => {
        const random = toolsData[Math.floor(Math.random() * toolsData.length)]
        setRandomTool(random)
    }

    // Stats
    const stats = useMemo(() => ({
        total: toolsData.length,
        free: toolsData.filter(t => t.pricing === "free").length,
        freemium: toolsData.filter(t => t.pricing === "freemium").length,
        paid: toolsData.filter(t => t.pricing === "paid").length,
        categories: categories.length,
        topRated: toolsData.filter(t => t.rating === 5).length,
    }), [categories.length])

    const clearFilters = () => {
        setSearchQuery("")
        setSelectedCategory(null)
        setSelectedPricing(null)
        setShowFavorites(false)
    }

    return (
        <div className="min-h-screen">
            {/* Hero with Stats */}
            <section className="relative py-16 lg:py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
                    <div className="absolute inset-0 noise-overlay"></div>
                </div>

                {/* Animated Background Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <Badge variant="secondary" className="px-4 py-2 animate-bounce-slow">
                            <Flame className="w-3 h-3 mr-2 text-orange-500" />
                            {stats.total}+ AI ინსტრუმენტი
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            <span className="text-gradient">უდიდესი AI კატალოგი</span>
                            <br />
                            <span className="text-2xl sm:text-3xl text-muted-foreground font-normal">საქართველოში</span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            აღმოაჩინე საუკეთესო AI ინსტრუმენტები შენი მუშაობისთვის, კრეატიულობისთვის და პროდუქტიულობისთვის
                        </p>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 text-center">
                                <div className="text-3xl font-bold text-primary">{stats.total}</div>
                                <div className="text-sm text-muted-foreground">სერვისი</div>
                            </div>
                            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 text-center">
                                <div className="text-3xl font-bold text-green-500">{stats.free}</div>
                                <div className="text-sm text-muted-foreground">უფასო</div>
                            </div>
                            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 text-center">
                                <div className="text-3xl font-bold text-accent">{stats.categories}</div>
                                <div className="text-sm text-muted-foreground">კატეგორია</div>
                            </div>
                            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 text-center">
                                <div className="text-3xl font-bold text-yellow-500">{stats.topRated}</div>
                                <div className="text-sm text-muted-foreground">⭐ 5 ვარსკვლავი</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search & Filters */}
            <section className="sticky top-16 z-40 py-4 bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="მოძებნე AI ინსტრუმენტი..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 text-lg bg-card border-border/50"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                >
                                    <X className="w-4 h-4 text-muted-foreground" />
                                </button>
                            )}
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant={showFilters ? "secondary" : "outline"}
                                onClick={() => setShowFilters(!showFilters)}
                                className="gap-2"
                            >
                                <Filter className="w-4 h-4" />
                                ფილტრები
                                {(selectedCategory || selectedPricing) && (
                                    <Badge className="ml-1 bg-primary text-primary-foreground">
                                        {[selectedCategory, selectedPricing].filter(Boolean).length}
                                    </Badge>
                                )}
                            </Button>

                            <Button
                                variant={showFavorites ? "default" : "outline"}
                                onClick={() => setShowFavorites(!showFavorites)}
                                className="gap-2"
                            >
                                <Heart className={`w-4 h-4 ${showFavorites ? "fill-current" : ""}`} />
                                ფავორიტები
                                {favorites.length > 0 && (
                                    <Badge variant="secondary" className="ml-1">{favorites.length}</Badge>
                                )}
                            </Button>

                            <Button
                                variant="outline"
                                onClick={discoverRandomTool}
                                className="gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/40"
                            >
                                <Shuffle className="w-4 h-4" />
                                შემთხვევითი
                            </Button>

                            <div className="flex border border-border rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card"}`}
                                >
                                    <LayoutGrid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card"}`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Expanded Filters */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-card rounded-xl border border-border animate-in slide-in-from-top-2">
                            <div className="flex flex-wrap gap-4">
                                {/* Category Filter */}
                                <div className="flex-1 min-w-[200px]">
                                    <label className="text-sm font-medium mb-2 block">კატეგორია</label>
                                    <select
                                        value={selectedCategory || ""}
                                        onChange={(e) => setSelectedCategory(e.target.value || null)}
                                        className="w-full p-2 rounded-lg bg-background border border-border"
                                    >
                                        <option value="">ყველა კატეგორია</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Pricing Filter */}
                                <div className="flex-1 min-w-[200px]">
                                    <label className="text-sm font-medium mb-2 block">ფასი</label>
                                    <div className="flex gap-2">
                                        {Object.entries(pricingLabels).map(([key, { label }]) => (
                                            <Button
                                                key={key}
                                                variant={selectedPricing === key ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setSelectedPricing(selectedPricing === key ? null : key)}
                                            >
                                                {label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Clear Filters */}
                                {(selectedCategory || selectedPricing || searchQuery) && (
                                    <div className="flex items-end">
                                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                                            <X className="w-4 h-4 mr-1" />
                                            გასუფთავება
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Active Filters Badge */}
                    {(selectedCategory || selectedPricing || searchQuery) && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                            <span>ნაპოვნია:</span>
                            <Badge variant="secondary">{filteredTools.length} ინსტრუმენტი</Badge>
                        </div>
                    )}
                </div>
            </section>

            {/* Random Tool Modal */}
            {randomTool && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setRandomTool(null)}>
                    <div className="bg-card rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                                <Shuffle className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold">შემთხვევითი აღმოჩენა! 🎲</h3>

                            <Card className="text-left">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                                            <ToolLogo tool={randomTool} size={64} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-xl">{randomTool.name}</h4>
                                            <p className="text-muted-foreground mt-1">{randomTool.description}</p>
                                            <div className="flex gap-2 mt-3">
                                                <Badge style={{ backgroundColor: `${categoryColors[randomTool.category]}20`, color: categoryColors[randomTool.category] }}>
                                                    {randomTool.category}
                                                </Badge>
                                                <Badge className={pricingLabels[randomTool.pricing].color}>
                                                    {pricingLabels[randomTool.pricing].label}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex gap-3 justify-center">
                                <Button variant="outline" onClick={() => setRandomTool(null)}>
                                    დახურვა
                                </Button>
                                <Button variant="outline" onClick={discoverRandomTool}>
                                    <Shuffle className="w-4 h-4 mr-2" />
                                    სხვა
                                </Button>
                                <Button asChild>
                                    <Link href={randomTool.url} target="_blank">
                                        გახსნა
                                        <ArrowUpRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Featured Tools */}
            {!searchQuery && !selectedCategory && !showFavorites && (
                <section className="py-12 bg-card/50 border-y border-border">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <Crown className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">🔥 ტოპ ინსტრუმენტები</h2>
                                    <p className="text-muted-foreground">რეკომენდებული და ყველაზე პოპულარული</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {featuredTools.slice(0, 8).map((tool) => {
                                const Icon = categoryIcons[tool.category] || Sparkles
                                const pricing = pricingLabels[tool.pricing]
                                const isFavorite = favorites.includes(tool.id)

                                return (
                                    <Card key={tool.id} className="group relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                        {/* Glow Effect */}
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{ background: `radial-gradient(circle at 50% 0%, ${categoryColors[tool.category]}20, transparent 70%)` }}
                                        />

                                        <CardContent className="relative p-6 space-y-4">
                                            {/* Header */}
                                            <div className="flex items-start justify-between">
                                                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-muted flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                                                    <ToolLogo tool={tool} size={56} className="p-1" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs shadow-md">
                                                        <Award className="w-3 h-3 mr-1" />
                                                        ტოპ
                                                    </Badge>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            toggleFavorite(tool.id)
                                                        }}
                                                        className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-primary/10 transition-colors"
                                                    >
                                                        <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Title & Rating */}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                                        {tool.name}
                                                    </h3>
                                                    <div className="flex items-center gap-0.5 text-yellow-500">
                                                        <Star className="w-4 h-4 fill-current" />
                                                        <span className="text-sm font-medium">{tool.rating}</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                    {tool.description}
                                                </p>
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                        style={{
                                                            backgroundColor: `${categoryColors[tool.category]}15`,
                                                            color: categoryColors[tool.category]
                                                        }}
                                                    >
                                                        {tool.category}
                                                    </Badge>
                                                    <Badge className={`text-xs ${pricing.color}`}>
                                                        {pricing.label}
                                                    </Badge>
                                                </div>
                                                <Link
                                                    href={tool.url}
                                                    target="_blank"
                                                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                                                >
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Category Quick Access */}
            {!searchQuery && !selectedCategory && !showFavorites && (
                <section className="py-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <h2 className="text-xl font-bold mb-6">🗂️ კატეგორიები</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {categories.slice(0, 12).map((cat) => {
                                const Icon = categoryIcons[cat] || Sparkles
                                const count = toolsData.filter(t => t.category === cat).length
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className="group p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg text-left"
                                    >
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                                            style={{ backgroundColor: `${categoryColors[cat]}15` }}
                                        >
                                            <Icon className="w-5 h-5" style={{ color: categoryColors[cat] }} />
                                        </div>
                                        <div className="font-medium text-sm group-hover:text-primary transition-colors">{cat}</div>
                                        <div className="text-xs text-muted-foreground">{count} ინსტრუმენტი</div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* All Tools */}
            <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                                <Target className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">
                                    {selectedCategory || (showFavorites ? "ჩემი ფავორიტები" : "ყველა ინსტრუმენტი")}
                                </h2>
                                <p className="text-sm text-muted-foreground">{filteredTools.length} ინსტრუმენტი</p>
                            </div>
                        </div>
                    </div>

                    {filteredTools.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                                <Search className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">ვერაფერი მოიძებნა</h3>
                            <p className="text-muted-foreground mb-6">სცადე სხვა საძიებო სიტყვა ან ფილტრი</p>
                            <Button onClick={clearFilters}>
                                ფილტრების გასუფთავება
                            </Button>
                        </div>
                    ) : viewMode === "grid" ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredTools.map((tool) => {
                                const Icon = categoryIcons[tool.category] || Sparkles
                                const pricing = pricingLabels[tool.pricing]
                                const isFavorite = favorites.includes(tool.id)

                                return (
                                    <Card key={tool.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                                        <CardContent className="p-5">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                                                    <ToolLogo tool={tool} size={48} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-semibold group-hover:text-primary transition-colors truncate">
                                                            {tool.name}
                                                        </h4>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                toggleFavorite(tool.id)
                                                            }}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500"}`} />
                                                        </button>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                        {tool.description}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <Badge className={`text-xs ${pricing.color}`}>
                                                            {pricing.label}
                                                        </Badge>
                                                        <div className="flex items-center gap-0.5">
                                                            {[...Array(tool.rating)].map((_, i) => (
                                                                <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                            ))}
                                                        </div>
                                                        <Link
                                                            href={tool.url}
                                                            target="_blank"
                                                            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <ArrowUpRight className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredTools.map((tool) => {
                                const pricing = pricingLabels[tool.pricing]
                                const isFavorite = favorites.includes(tool.id)

                                return (
                                    <div key={tool.id} className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                                            <ToolLogo tool={tool} size={40} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium group-hover:text-primary transition-colors">{tool.name}</div>
                                            <div className="text-sm text-muted-foreground truncate">{tool.description}</div>
                                        </div>
                                        <Badge variant="outline" className="hidden sm:inline-flex">{tool.category}</Badge>
                                        <Badge className={`text-xs ${pricing.color}`}>{pricing.label}</Badge>
                                        <button onClick={() => toggleFavorite(tool.id)}>
                                            <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                                        </button>
                                        <Link href={tool.url} target="_blank">
                                            <ArrowUpRight className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 animated-gradient opacity-90"></div>
                <div className="absolute inset-0 noise-overlay"></div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center text-white">
                    <div className="space-y-6">
                        <h2 className="text-3xl sm:text-4xl font-bold">
                            გაქვს რეკომენდაცია? 💡
                        </h2>
                        <p className="text-xl text-white/80">
                            თუ იცი კარგი AI ინსტრუმენტი რომელიც აქ არ არის, გამომიგზავნე!
                        </p>
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                            ინსტრუმენტის შეთავაზება
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

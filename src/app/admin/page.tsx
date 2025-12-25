"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    FileText,
    Video,
    Eye,
    TrendingUp,
    Flame,
    Heart,
    MessageSquare,
    Zap,
    Plus,
    ArrowRight,
    Clock,
    BarChart3,
    Sparkles,
    Calendar,
    GripVertical,
    X,
    RotateCcw,
    Settings2
} from "lucide-react"
import postsData from "@/data/posts.json"
import videosData from "@/data/videos.json"

// Calculate statistics
function getStats() {
    const totalPosts = postsData.length
    const totalVideos = videosData.length

    const totalPostViews = postsData.reduce((sum, post) => sum + post.views, 0)
    const totalVideoViews = videosData.reduce((sum, video) => sum + video.views, 0)
    const totalViews = totalPostViews + totalVideoViews

    const totalReactions = postsData.reduce((sum, post) => {
        return sum + Object.values(post.reactions).reduce((a, b) => a + b, 0)
    }, 0)

    const featuredPosts = postsData.filter(p => p.featured).length
    const trendingPosts = postsData.filter(p => p.trending).length

    return {
        totalPosts,
        totalVideos,
        totalViews,
        totalReactions,
        featuredPosts,
        trendingPosts
    }
}

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
}

// Widget types
type WidgetType = "stats" | "posts" | "videos" | "activity" | "analytics"

interface Widget {
    id: string
    type: WidgetType
    title: string
    visible: boolean
    order: number
}

const defaultWidgets: Widget[] = [
    { id: "stats", type: "stats", title: "სტატისტიკა", visible: true, order: 0 },
    { id: "posts", type: "posts", title: "ბოლო პოსტები", visible: true, order: 1 },
    { id: "activity", type: "activity", title: "აქტივობა", visible: true, order: 2 },
    { id: "videos", type: "videos", title: "ბოლო ვიდეოები", visible: true, order: 3 },
    { id: "analytics", type: "analytics", title: "ანალიტიკა", visible: true, order: 4 },
]

// Mock activity data
const recentActivity = [
    { type: "comment", message: "ახალი კომენტარი პოსტზე", time: "5 წთ წინ", icon: MessageSquare },
    { type: "view", message: "+500 ნახვა ბოლო საათში", time: "1 სთ წინ", icon: Eye },
    { type: "trending", message: "პოსტი გახდა trending", time: "2 სთ წინ", icon: Flame },
    { type: "reaction", message: "+50 ახალი რეაქცია", time: "3 სთ წინ", icon: Heart },
]

export default function AdminDashboard() {
    const stats = getStats()
    const [widgets, setWidgets] = React.useState<Widget[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("admin_dashboard_widgets")
            if (saved) return JSON.parse(saved)
        }
        return defaultWidgets
    })
    const [draggedWidget, setDraggedWidget] = React.useState<string | null>(null)
    const [isCustomizing, setIsCustomizing] = React.useState(false)

    // Save widgets to localStorage
    React.useEffect(() => {
        localStorage.setItem("admin_dashboard_widgets", JSON.stringify(widgets))
    }, [widgets])

    const handleDragStart = (e: React.DragEvent, widgetId: string) => {
        setDraggedWidget(widgetId)
        e.dataTransfer.effectAllowed = "move"
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault()
        if (!draggedWidget || draggedWidget === targetId) return

        const newWidgets = [...widgets]
        const draggedIndex = newWidgets.findIndex(w => w.id === draggedWidget)
        const targetIndex = newWidgets.findIndex(w => w.id === targetId)

        const [removed] = newWidgets.splice(draggedIndex, 1)
        newWidgets.splice(targetIndex, 0, removed)

        // Update order
        newWidgets.forEach((w, i) => w.order = i)
        setWidgets(newWidgets)
        setDraggedWidget(null)
    }

    const toggleWidget = (id: string) => {
        setWidgets(widgets.map(w =>
            w.id === id ? { ...w, visible: !w.visible } : w
        ))
    }

    const resetWidgets = () => {
        setWidgets(defaultWidgets)
    }

    const visibleWidgets = widgets.filter(w => w.visible).sort((a, b) => a.order - b.order)

    const statCards = [
        {
            title: "პოსტები",
            value: stats.totalPosts,
            icon: <FileText className="w-5 h-5" />,
            color: "from-blue-500 to-indigo-500",
            bgColor: "bg-blue-500",
            badge: `${stats.featuredPosts} featured`,
            href: "/admin/posts"
        },
        {
            title: "ვიდეოები",
            value: stats.totalVideos,
            icon: <Video className="w-5 h-5" />,
            color: "from-red-500 to-pink-500",
            bgColor: "bg-red-500",
            badge: `${videosData.filter(v => v.type === "short").length} shorts`,
            href: "/admin/videos"
        },
        {
            title: "ნახვები",
            value: formatNumber(stats.totalViews),
            icon: <Eye className="w-5 h-5" />,
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-500",
            badge: "ჯამური",
            href: "/admin/analytics"
        },
        {
            title: "რეაქციები",
            value: formatNumber(stats.totalReactions),
            icon: <Heart className="w-5 h-5" />,
            color: "from-orange-500 to-amber-500",
            bgColor: "bg-orange-500",
            badge: `${stats.trendingPosts} trending`,
            href: "/admin/analytics"
        }
    ]

    // Render widget content based on type
    const renderWidget = (widget: Widget) => {
        switch (widget.type) {
            case "stats":
                return (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {statCards.map((stat, i) => (
                            <Link key={i} href={stat.href}>
                                <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-muted-foreground">{stat.title}</p>
                                                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                            </div>
                                            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} text-white flex items-center justify-center`}>
                                                {stat.icon}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )

            case "posts":
                return (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-500" />
                                ბოლო პოსტები
                            </CardTitle>
                            <Link href="/admin/posts">
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                    ყველა <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {postsData.slice(0, 3).map((post) => (
                                <div key={post.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{post.title}</p>
                                        <p className="text-xs text-muted-foreground">{formatNumber(post.views)} ნახვა</p>
                                    </div>
                                    {post.trending && <Badge variant="secondary" className="text-xs">🔥</Badge>}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )

            case "activity":
                return (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                აქტივობა
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentActivity.slice(0, 3).map((activity, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                        <activity.icon className="w-3 h-3" />
                                    </div>
                                    <div>
                                        <p className="text-sm">{activity.message}</p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )

            case "videos":
                return (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Video className="w-4 h-4 text-red-500" />
                                ბოლო ვიდეოები
                            </CardTitle>
                            <Link href="/admin/videos">
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                    ყველა <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2 grid-cols-2">
                                {videosData.slice(0, 4).map((video) => (
                                    <div key={video.id} className="p-2 rounded-lg bg-muted/30">
                                        <p className="text-sm font-medium truncate">{video.title}</p>
                                        <p className="text-xs text-muted-foreground">{formatNumber(video.views)} ნახვა</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )

            case "analytics":
                return (
                    <Card className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">დეტალური ანალიტიკა</p>
                                <p className="text-sm text-muted-foreground">ნახეთ სრული სტატისტიკა</p>
                            </div>
                            <Link href="/admin/analytics">
                                <Button size="sm">გახსნა</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )

            default:
                return null
        }
    }

    return (
        <div className="space-y-6" data-tour="dashboard">
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        მოგესალმებით!
                    </h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date().toLocaleDateString('ka-GE', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCustomizing(!isCustomizing)}
                        className="gap-2"
                    >
                        <Settings2 className="w-4 h-4" />
                        {isCustomizing ? "დასრულება" : "მორგება"}
                    </Button>
                    <Link href="/admin/content">
                        <Button className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600">
                            <Plus className="w-4 h-4" />
                            ახალი პოსტი
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Customization Panel */}
            {isCustomizing && (
                <Card className="border-dashed border-2 border-indigo-500/30 bg-indigo-500/5">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="font-medium">ვიჯეტების მართვა</p>
                            <Button variant="ghost" size="sm" onClick={resetWidgets} className="gap-1 text-xs">
                                <RotateCcw className="w-3 h-3" />
                                აღდგენა
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {widgets.map((widget) => (
                                <button
                                    key={widget.id}
                                    onClick={() => toggleWidget(widget.id)}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${widget.visible
                                            ? "bg-indigo-500 text-white"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {widget.title}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                            💡 გადმოათრიეთ ვიჯეტები თანმიმდევრობის შესაცვლელად
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Draggable Widgets */}
            <div className="space-y-4">
                {visibleWidgets.map((widget) => (
                    <div
                        key={widget.id}
                        draggable={isCustomizing}
                        onDragStart={(e) => handleDragStart(e, widget.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, widget.id)}
                        className={`transition-all ${isCustomizing ? "cursor-grab active:cursor-grabbing" : ""
                            } ${draggedWidget === widget.id ? "opacity-50" : ""
                            }`}
                    >
                        {isCustomizing && (
                            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                <GripVertical className="w-4 h-4" />
                                <span className="text-xs">{widget.title}</span>
                            </div>
                        )}
                        {renderWidget(widget)}
                    </div>
                ))}
            </div>
        </div>
    )
}

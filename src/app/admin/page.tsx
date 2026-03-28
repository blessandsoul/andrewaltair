"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { TbFileText, TbVideo, TbEye, TbTrendingUp, TbFlame, TbHeart, TbMessage, TbBolt, TbPlus, TbArrowRight, TbClock, TbChartBar, TbSparkles, TbCalendar, TbGripVertical, TbX, TbRefresh, TbSettings, TbShare, TbSearch, TbBell, TbDatabase, TbServer, TbActivity, TbDeviceSdCard, TbWifi, TbWifiOff, TbCircleCheck, TbAlertTriangle, TbCircleX, TbTrash, TbDownload, TbUpload, TbWorld, TbUsers, TbPhoto, TbStack2, TbListCheck, TbCalendarEvent, TbStar, TbChartPie, TbChartLine, TbLayoutGrid, TbLayoutList, TbColumns, TbMaximize, TbMinimize, TbCommand, TbFilter, TbMapPin } from "react-icons/tb"
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    BarChart as RechartsBarChart,
    Bar,
    Legend
} from "recharts"
// Posts and videos are now fetched from MongoDB API via useEffect


// Post/TbVideo interfaces for MongoDB data
interface Post {
    id: string
    title: string
    slug: string
    views: number
    featured?: boolean
    trending?: boolean
    reactions?: Record<string, number>
    category?: string
    createdAt?: string
    comments?: number
    shares?: number
}

interface VideoData {
    id: string
    title: string
    views: number
    type: string
    youtubeId?: string
}

interface ActivityItem {
    type: string
    targetTitle: string
    createdAt: string
}

interface ReferrerSource {
    source: string
    visitors: number
    percentage: number
}

interface ContentDistributionItem {
    name: string
    value: number
}

interface AnalyticsData {
    stats: {
        posts: number
        videos: number
        users: number
        comments: number
        totalViews: number
        totalReactions: number
    }
    weeklyData: Array<{ day: string; views: number; reactions: number }>
    topPosts: Array<{ title: string; slug: string; views: number }>
    topVideos: Array<{ title: string; youtubeId: string; views: number }>
    recentActivity: ActivityItem[]
    contentDistribution: ContentDistributionItem[]
    referrerSources: ReferrerSource[]
}

// Calculate statistics from real data
function getStats(postsData: Post[], videosData: VideoData[]) {
    const totalPosts = postsData.length
    const totalVideos = videosData.length
    const featuredPosts = postsData.filter(p => p.featured).length
    const trendingPosts = postsData.filter(p => p.trending).length

    return {
        totalPosts,
        totalVideos,
        featuredPosts,
        trendingPosts,
    }
}

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
}

// Widget types - EXTENDED
type WidgetType = "stats" | "posts" | "videos" | "activity" | "analytics" |
    "dateFilter" | "charts" | "quickActions" | "notifications" |
    "search" | "topContent" | "tasks" | "layoutSettings"

// Widget size types
type WidgetSize = "small" | "medium" | "large" | "full"

interface Widget {
    id: string
    type: WidgetType
    title: string
    visible: boolean
    order: number
    size?: WidgetSize
}

// Task interface
interface Task {
    id: string
    text: string
    completed: boolean
    priority: "high" | "medium" | "low"
    dueDate?: string
}

// Notification interface
interface Notification {
    id: string
    type: "comment" | "user" | "system" | "alert"
    message: string
    time: string
    read: boolean
}

const defaultWidgets: Widget[] = [
    { id: "dateFilter", type: "dateFilter", title: "თარიღის ფილტრი", visible: true, order: 0, size: "full" },
    { id: "stats", type: "stats", title: "სტატისტიკა", visible: true, order: 1, size: "full" },
    { id: "search", type: "search", title: "ძებნა", visible: true, order: 2, size: "full" },
    { id: "quickActions", type: "quickActions", title: "სწრაფი მოქმედებები", visible: true, order: 3, size: "full" },
    { id: "charts", type: "charts", title: "გრაფიკები", visible: true, order: 4, size: "full" },
    { id: "notifications", type: "notifications", title: "შეტყობინებები", visible: true, order: 5, size: "medium" },
    { id: "posts", type: "posts", title: "ბოლო პოსტები", visible: true, order: 7, size: "medium" },
    { id: "activity", type: "activity", title: "აქტივობა", visible: true, order: 8, size: "medium" },
    { id: "topContent", type: "topContent", title: "ტოპ კონტენტი", visible: true, order: 9, size: "medium" },
    { id: "tasks", type: "tasks", title: "დავალებები", visible: true, order: 10, size: "medium" },
    { id: "videos", type: "videos", title: "ბოლო ვიდეოები", visible: true, order: 11, size: "medium" },
    { id: "analytics", type: "analytics", title: "ანალიტიკა", visible: true, order: 12, size: "full" },
    { id: "layoutSettings", type: "layoutSettings", title: "განლაგების პარამეტრები", visible: true, order: 13, size: "full" },
]

// Mock notifications
const defaultNotifications: Notification[] = [
    { id: "1", type: "comment", message: "ახალი კომენტარი: 'მშვენიერი სტატია!'", time: "2 წთ წინ", read: false },
    { id: "2", type: "user", message: "ახალი მომხმარებელი დარეგისტრირდა", time: "15 წთ წინ", read: false },
    { id: "3", type: "system", message: "ბექაპი წარმატებით დასრულდა", time: "1 სთ წინ", read: true },
    { id: "4", type: "alert", message: "სერვერის დატვირთვა მაღალია", time: "2 სთ წინ", read: true },
    { id: "5", type: "comment", message: "5 ახალი კომენტარი მოდერაციას ელოდება", time: "3 სთ წინ", read: false },
]


export default function AdminDashboard() {
    // MongoDB data state
    const [postsData, setPostsData] = React.useState<Post[]>([])
    const [videosData, setVideosData] = React.useState<VideoData[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [analyticsData, setAnalyticsData] = React.useState<AnalyticsData | null>(null)

    // Fetch data from MongoDB API
    React.useEffect(() => {
        async function fetchData() {
            try {
                const [postsRes, videosRes, analyticsRes] = await Promise.all([
                    fetch('/api/posts?limit=1000'),
                    fetch('/api/videos?limit=1000'),
                    fetch('/api/analytics'),
                ])

                if (postsRes.ok) {
                    const postsJson = await postsRes.json()
                    setPostsData(postsJson.posts || [])
                }

                if (videosRes.ok) {
                    const videosJson = await videosRes.json()
                    setVideosData(videosJson.videos || [])
                }

                if (analyticsRes.ok) {
                    const analyticsJson = await analyticsRes.json()
                    setAnalyticsData(analyticsJson.data || null)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

const stats = getStats(postsData, videosData)

    // Widgets state
    const [widgets, setWidgets] = React.useState<Widget[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("admin_dashboard_widgets_v2")
            if (saved) return JSON.parse(saved)
        }
        return defaultWidgets
    })
    const [draggedWidget, setDraggedWidget] = React.useState<string | null>(null)
    const [isCustomizing, setIsCustomizing] = React.useState(false)

    // Layout settings
    const [columns, setColumns] = React.useState<1 | 2 | 3>(2)
    const [compactView, setCompactView] = React.useState(false)

    // Real-time update simulation
    const [isLive, setIsLive] = React.useState(true)

    // Notifications - fetched from API
    const [notifications, setNotifications] = React.useState<Notification[]>([])

    // Tasks - fetched from API
    const [tasks, setTasks] = React.useState<Task[]>([])

    // Fetch tasks and notifications from API
    React.useEffect(() => {
        async function fetchTasksAndNotifications() {
            try {
                const [tasksRes, notifRes] = await Promise.all([
                    fetch('/api/tasks'),
                    fetch('/api/notifications')
                ])
                if (tasksRes.ok) {
                    const data = await tasksRes.json()
                    setTasks((data.tasks || []).map((t: { id?: string; title?: string; text?: string; completed?: boolean; priority?: string; dueDate?: string }) => ({
                        id: t.id || '',
                        text: t.title || t.text || '',
                        completed: t.completed || false,
                        priority: (t.priority as 'high' | 'medium' | 'low') || 'medium',
                        dueDate: t.dueDate
                    })))
                }
                if (notifRes.ok) {
                    const data = await notifRes.json()
                    setNotifications((data.notifications || []).map((n: { id?: string; type?: string; message?: string; time?: string; createdAt?: string; read?: boolean }) => ({
                        id: n.id || '',
                        type: (n.type as 'comment' | 'user' | 'system' | 'alert') || 'info',
                        message: n.message || '',
                        time: n.time || n.createdAt || '',
                        read: n.read || false
                    })))
                }
            } catch (error) {
                console.error('Error fetching tasks/notifications:', error)
            }
        }
        fetchTasksAndNotifications()
    }, [])
    const [newTaskText, setNewTaskText] = React.useState("")

    // TbSearch
    const [searchQuery, setSearchQuery] = React.useState("")
    const [searchResults, setSearchResults] = React.useState<any[]>([])
    const [isSearching, setIsSearching] = React.useState(false)


    // Save widgets to localStorage
    React.useEffect(() => {
        localStorage.setItem("admin_dashboard_widgets_v2", JSON.stringify(widgets))
    }, [widgets])

    // Save tasks to localStorage
    React.useEffect(() => {
        localStorage.setItem("admin_dashboard_tasks", JSON.stringify(tasks))
    }, [tasks])


    // TbKeyboard shortcut for search (Ctrl+K)
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "k") {
                e.preventDefault()
                document.getElementById("global-search")?.focus()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    // TbSearch function
    const handleSearch = (query: string) => {
        setSearchQuery(query)
        if (query.length < 2) {
            setSearchResults([])
            return
        }
        setIsSearching(true)
        // Simulate search
        setTimeout(() => {
            const postResults = postsData.filter(p =>
                p.title.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 3).map(p => ({ ...p, type: "post" }))
            const videoResults = videosData.filter(v =>
                v.title.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 3).map(v => ({ ...v, type: "video" }))
            setSearchResults([...postResults, ...videoResults])
            setIsSearching(false)
        }, 300)
    }

    // Task functions - with API
    const addTask = async () => {
        if (!newTaskText.trim()) return
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTaskText, priority: 'medium' })
            })
            if (res.ok) {
                const data = await res.json()
                setTasks([...tasks, {
                    id: data.task.id,
                    text: newTaskText,
                    completed: false,
                    priority: 'medium'
                }])
                setNewTaskText('')
            }
        } catch (error) {
            console.error('Add task error:', error)
        }
    }

    const toggleTask = async (id: string) => {
        const task = tasks.find(t => t.id === id)
        if (!task) return
        try {
            await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !task.completed })
            })
            setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
        } catch (error) {
            console.error('Toggle task error:', error)
        }
    }

    const deleteTask = async (id: string) => {
        try {
            await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
            setTasks(tasks.filter(t => t.id !== id))
        } catch (error) {
            console.error('Delete task error:', error)
        }
    }

    // Notification functions - with API
    const markNotificationRead = async (id: string) => {
        try {
            await fetch(`/api/notifications/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ read: true })
            })
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
        } catch (error) {
            console.error('Mark notification read error:', error)
        }
    }

    const clearAllNotifications = async () => {
        try {
            await Promise.all(notifications.map(n => fetch(`/api/notifications/${n.id}`, { method: 'DELETE' })))
            setNotifications([])
        } catch (error) {
            console.error('Clear notifications error:', error)
        }
    }

    const unreadCount = notifications.filter(n => !n.read).length

    // Drag and drop handlers
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

        newWidgets.forEach((w, i) => w.order = i)
        setWidgets(newWidgets)
        setDraggedWidget(null)
    }

    const toggleWidget = (id: string) => {
        setWidgets(widgets.map(w =>
            w.id === id ? { ...w, visible: !w.visible } : w
        ))
    }

    const setWidgetSize = (id: string, size: WidgetSize) => {
        setWidgets(widgets.map(w =>
            w.id === id ? { ...w, size } : w
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
            icon: <TbFileText className="w-5 h-5" />,
            color: "from-blue-500 to-indigo-500",
            bgColor: "bg-blue-500",
            badge: `${stats.featuredPosts} featured`,
            href: "/admin/posts"
        },
        {
            title: "ვიდეოები",
            value: stats.totalVideos,
            icon: <TbVideo className="w-5 h-5" />,
            color: "from-red-500 to-pink-500",
            bgColor: "bg-red-500",
            badge: `${videosData.filter(v => v.type === "short").length} shorts`,
            href: "/admin/videos"
        },
        {
            title: "ნახვები",
            value: formatNumber(analyticsData?.stats.totalViews || 0),
            icon: <TbEye className="w-5 h-5" />,
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-500",
            badge: isLive ? "🔴 Live" : "ჯამური",
            href: "/admin/analytics"
        },
        {
            title: "რეაქციები",
            value: formatNumber(analyticsData?.stats.totalReactions || 0),
            icon: <TbHeart className="w-5 h-5" />,
            color: "from-orange-500 to-amber-500",
            bgColor: "bg-orange-500",
            badge: `${stats.trendingPosts} trending`,
            href: "/admin/analytics"
        }
    ]

    // Quick actions
    const quickActions = [
        { icon: TbTrash, label: "ქეშის გასუფთავება", color: "bg-red-500" },
        { icon: TbRefresh, label: "სოციალური სინქრონ.", color: "bg-blue-500" },
        { icon: TbDatabase, label: "ბექაპი", color: "bg-green-500" },
        { icon: TbMessage, label: "მოდერაცია", color: "bg-yellow-500", badge: 5 },
        { icon: TbDownload, label: "რეპორტი", color: "bg-purple-500" },
        { icon: TbWorld, label: "SEO შემოწმება", color: "bg-indigo-500" },
    ]

    // Get widget size class
    const getWidgetSizeClass = (size?: WidgetSize) => {
        if (columns === 1) return "col-span-1"
        if (columns === 3) {
            switch (size) {
                case "small": return "col-span-1"
                case "large": return "col-span-2"
                case "full": return "col-span-3"
                default: return "col-span-1"
            }
        }
        switch (size) {
            case "small": return "col-span-1"
            case "full": return "col-span-2"
            default: return "col-span-1"
        }
    }

    // Render widget content based on type
    const renderWidget = (widget: Widget) => {
        switch (widget.type) {
            // Feature 1: Date Range Filter
            case "dateFilter":
                return (
                    <Card className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border-indigo-500/20">
                        <CardContent className="p-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <TbFilter className="w-4 h-4 text-indigo-500" />
                                <div className="ml-auto flex items-center gap-2">
                                    <button
                                        onClick={() => setIsLive(!isLive)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${isLive
                                            ? "bg-red-500/20 text-red-500"
                                            : "bg-muted text-muted-foreground"
                                            }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${isLive ? "bg-red-500 animate-pulse" : "bg-muted-foreground"}`} />
                                        {isLive ? "Live" : "Paused"}
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )

            // Stats widget
            case "stats":
                return (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {statCards.map((stat, i) => (
                            <Link key={i} href={stat.href}>
                                <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
                                    <CardContent className={`${compactView ? "p-3" : "p-4"}`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-muted-foreground">{stat.title}</p>
                                                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                                {stat.badge && (
                                                    <Badge variant="secondary" className="mt-1 text-xs">
                                                        {stat.badge}
                                                    </Badge>
                                                )}
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

            // Feature 6: Global TbSearch
            case "search":
                return (
                    <Card>
                        <CardContent className="p-4">
                            <div className="relative">
                                <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="global-search"
                                    placeholder="მოძებნე კონტენტი... (Ctrl+K)"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-10 pr-10"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => { setSearchQuery(""); setSearchResults([]) }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                    >
                                        <TbX className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                )}
                            </div>
                            {searchResults.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {searchResults.map((result, i) => (
                                        <Link
                                            key={i}
                                            href={result.type === "post" ? `/blog/${result.slug}` : `/videos/${result.id}`}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                                        >
                                            {result.type === "post" ? (
                                                <TbFileText className="w-4 h-4 text-indigo-500" />
                                            ) : (
                                                <TbVideo className="w-4 h-4 text-red-500" />
                                            )}
                                            <span className="text-sm truncate">{result.title}</span>
                                            <Badge variant="outline" className="ml-auto text-xs">
                                                {result.type === "post" ? "პოსტი" : "ვიდეო"}
                                            </Badge>
                                        </Link>
                                    ))}
                                </div>
                            )}
                            {isSearching && (
                                <div className="mt-3 text-center text-sm text-muted-foreground">
                                    <TbRefresh className="w-4 h-4 animate-spin inline mr-2" />
                                    იძებნება...
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )

            // Feature 4: Quick Actions
            case "quickActions":
                return (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <TbBolt className="w-4 h-4 text-yellow-500" />
                                სწრაფი მოქმედებები
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                                {quickActions.map((action, i) => (
                                    <button
                                        key={i}
                                        className="relative flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                                    >
                                        <div className={`w-10 h-10 rounded-lg ${action.color} text-white flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <action.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs text-center">{action.label}</span>
                                        {action.badge && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                                {action.badge}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )

            // Feature 3: Charts
            case "charts":
                return (
                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* Line Chart */}
                        <Card className="lg:col-span-2">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <TbChartLine className="w-4 h-4 text-indigo-500" />
                                    ნახვები & რეაქციები
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <ResponsiveContainer width="100%" height={200}>
                                    <RechartsLineChart data={viewsData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                        <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                                        <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "hsl(var(--popover))",
                                                border: "1px solid hsl(var(--border))",
                                                borderRadius: "8px"
                                            }}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2} name="ნახვები" />
                                        <Line type="monotone" dataKey="reactions" stroke="#22c55e" strokeWidth={2} name="რეაქციები" />
                                    </RechartsLineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Pie Chart */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <TbChartPie className="w-4 h-4 text-purple-500" />
                                    კონტენტის განაწილება
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <ResponsiveContainer width="100%" height={200}>
                                    <RechartsPieChart>
                                        <Pie
                                            data={contentDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={70}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {contentDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                )

            // Feature 5: Notifications
            case "notifications":
                return (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <TbBell className="w-4 h-4 text-blue-500" />
                                შეტყობინებები
                                {unreadCount > 0 && (
                                    <Badge variant="destructive" className="ml-1">{unreadCount}</Badge>
                                )}
                            </CardTitle>
                            {notifications.length > 0 && (
                                <Button variant="ghost" size="sm" onClick={clearAllNotifications} className="h-7 text-xs">
                                    გასუფთავება
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className={`${compactView ? "p-3" : "p-4"} space-y-2 max-h-64 overflow-y-auto`}>
                            {notifications.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">შეტყობინებები არ არის</p>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => markNotificationRead(notification.id)}
                                        className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors ${notification.read ? "opacity-60" : "bg-muted/30"
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${notification.type === "alert" ? "bg-red-500/20 text-red-500" :
                                            notification.type === "comment" ? "bg-blue-500/20 text-blue-500" :
                                                notification.type === "user" ? "bg-green-500/20 text-green-500" :
                                                    "bg-purple-500/20 text-purple-500"
                                            }`}>
                                            {notification.type === "alert" ? <TbAlertTriangle className="w-3 h-3" /> :
                                                notification.type === "comment" ? <TbMessage className="w-3 h-3" /> :
                                                    notification.type === "user" ? <TbUsers className="w-3 h-3" /> :
                                                        <TbServer className="w-3 h-3" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm truncate">{notification.message}</p>
                                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                                        </div>
                                        {!notification.read && (
                                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                        )}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                )

            // Feature 8: Top Content
            case "topContent":
                return (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <TbStar className="w-4 h-4 text-yellow-500" />
                                ტოპ კონტენტი
                            </CardTitle>
                        </CardHeader>
                        <CardContent className={`${compactView ? "p-3" : "p-4"}`}>
                            {/* Top Posts */}
                            <div className="space-y-2 mb-4">
                                <p className="text-xs font-medium text-muted-foreground uppercase">ტოპ პოსტები</p>
                                {postsData.sort((a, b) => b.views - a.views).slice(0, 3).map((post, i) => (
                                    <div key={post.id} className="flex items-center gap-2">
                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-yellow-500 text-white" :
                                            i === 1 ? "bg-gray-400 text-white" :
                                                "bg-amber-700 text-white"
                                            }`}>
                                            {i + 1}
                                        </span>
                                        <span className="text-sm truncate flex-1">{post.title}</span>
                                        <span className="text-xs text-muted-foreground">{formatNumber(post.views)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Traffic Sources */}
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-muted-foreground uppercase">ტრაფიკის წყაროები</p>
                                {trafficSources.map((source, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="flex items-center gap-1">
                                                <TbMapPin className="w-3 h-3" />
                                                {source.source}
                                            </span>
                                            <span>{source.percentage}%</span>
                                        </div>
                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                                style={{ width: `${source.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )

            // Feature 9: Tasks
            case "tasks":
                return (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <TbListCheck className="w-4 h-4 text-purple-500" />
                                დავალებები
                                <Badge variant="secondary">{tasks.filter(t => !t.completed).length}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className={`${compactView ? "p-3" : "p-4"} space-y-3`}>
                            {/* Add Task */}
                            <div className="flex gap-2">
                                <Input
                                    placeholder="ახალი დავალება..."
                                    value={newTaskText}
                                    onChange={(e) => setNewTaskText(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && addTask()}
                                    className="h-8 text-sm"
                                />
                                <Button size="sm" onClick={addTask} className="h-8">
                                    <TbPlus className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Task List */}
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className={`flex items-center gap-2 p-2 rounded-lg border ${task.completed ? "opacity-50" : ""}`}
                                    >
                                        <Checkbox
                                            checked={task.completed}
                                            onCheckedChange={() => toggleTask(task.id)}
                                        />
                                        <span className={`text-sm flex-1 ${task.completed ? "line-through" : ""}`}>
                                            {task.text}
                                        </span>
                                        <Badge variant="outline" className={`text-xs ${task.priority === "high" ? "border-red-500 text-red-500" :
                                            task.priority === "medium" ? "border-yellow-500 text-yellow-500" :
                                                "border-green-500 text-green-500"
                                            }`}>
                                            {task.priority === "high" ? "მაღალი" :
                                                task.priority === "medium" ? "საშუალო" : "დაბალი"}
                                        </Badge>
                                        <button onClick={() => deleteTask(task.id)}>
                                            <TbX className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )

            case "posts":
                return (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <TbFileText className="w-4 h-4 text-indigo-500" />
                                ბოლო პოსტები
                            </CardTitle>
                            <Link href="/admin/posts">
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                    ყველა <TbArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className={`${compactView ? "p-3" : "p-6"} space-y-3`}>
                            {postsData.slice(0, 3).map((post) => (
                                <div key={post.id} className="flex items-center gap-3 p-4 rounded-lg hover:bg-muted/50 border border-border/50">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{post.title}</p>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                            <span className="flex items-center gap-1">
                                                <TbEye className="w-3 h-3" />
                                                {formatNumber(post.views)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <TbMessage className="w-3 h-3" />
                                                {formatNumber(post.comments || 0)}
                                            </span>
                                            <span className="flex items-center gap-1 text-red-500">
                                                <TbHeart className="w-3 h-3" />
                                                {formatNumber(Object.values(post.reactions || {}).reduce((a, b) => a + b, 0))}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <TbShare className="w-3 h-3" />
                                                {formatNumber(post.shares || 0)}
                                            </span>
                                        </div>
                                    </div>
                                    {post.trending && <Badge variant="secondary" className="text-xs"><TbFlame className="w-3 h-3" /></Badge>}
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
                                <TbTrendingUp className="w-4 h-4 text-green-500" />
                                აქტივობა
                            </CardTitle>
                        </CardHeader>
                        <CardContent className={`${compactView ? "p-3" : "p-6"} space-y-4`}>
                            {recentActivity.slice(0, 4).map((activity, i) => (
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
                                <TbVideo className="w-4 h-4 text-red-500" />
                                ბოლო ვიდეოები
                            </CardTitle>
                            <Link href="/admin/videos">
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                    ყველა <TbArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className={`${compactView ? "p-3" : "p-6"}`}>
                            <div className="grid gap-2 grid-cols-2">
                                {videosData.slice(0, 4).map((video) => (
                                    <div key={video.id} className="p-4 rounded-lg bg-muted/30 border border-border/50">
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
                                <TbChartBar className="w-5 h-5 text-white" />
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

            // Feature 10: Layout Settings
            case "layoutSettings":
                return (
                    <Card className="border-dashed">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <TbLayoutGrid className="w-4 h-4 text-indigo-500" />
                                განლაგების პარამეტრები
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="flex flex-wrap items-center gap-4">
                                {/* Columns */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">სვეტები:</span>
                                    {[1, 2, 3].map((col) => (
                                        <Button
                                            key={col}
                                            variant={columns === col ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setColumns(col as 1 | 2 | 3)}
                                            className="w-8 h-8 p-0"
                                        >
                                            {col}
                                        </Button>
                                    ))}
                                </div>

                                {/* Compact View */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">კომპაქტური:</span>
                                    <Button
                                        variant={compactView ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCompactView(!compactView)}
                                        className="h-8"
                                    >
                                        {compactView ? <TbMinimize className="w-4 h-4" /> : <TbMaximize className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>
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
                            <TbSparkles className="w-5 h-5 text-white" />
                        </div>
                        მოგესალმებით!
                    </h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        <TbCalendar className="w-4 h-4" />
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
                        <TbSettings className="w-4 h-4" />
                        {isCustomizing ? "დასრულება" : "მორგება"}
                    </Button>
                    <Link href="/admin/content">
                        <Button className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600">
                            <TbPlus className="w-4 h-4" />
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
                                <TbRefresh className="w-3 h-3" />
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
            <div className={`grid gap-4 ${columns === 1 ? "grid-cols-1" :
                columns === 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" :
                    "grid-cols-1 md:grid-cols-2"
                }`}>
                {visibleWidgets.map((widget) => (
                    <div
                        key={widget.id}
                        draggable={isCustomizing}
                        onDragStart={(e) => handleDragStart(e, widget.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, widget.id)}
                        className={`transition-all ${getWidgetSizeClass(widget.size)} ${isCustomizing ? "cursor-grab active:cursor-grabbing" : ""
                            } ${draggedWidget === widget.id ? "opacity-50" : ""
                            }`}
                    >
                        {isCustomizing && (
                            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                <TbGripVertical className="w-4 h-4" />
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


"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    User,
    Mail,
    Calendar,
    Shield,
    Settings,
    LogOut,
    Sparkles,
    Camera,
    Edit2,
    Save,
    X,
    Eye,
    EyeOff,
    Lock,
    Bell,
    Palette,
    Globe,
    History,
    BarChart3,
    Link2,
    Users,
    Image,
    Bookmark,
    Clock,
    MousePointerClick,
    FileText,
    MessageSquare,
    Heart,
    CheckCircle2,
    XCircle,
    Upload,
    Crop,
    Github,
    Chrome,
    Facebook,
    Send,
    EyeIcon,
    TrendingUp,
    Zap,
    Star,
    Wrench,
    Bot,
    Cpu,
    ImageIcon,
    Video,
    Trash2
} from "lucide-react"
import { useAuth, ROLE_CONFIG } from "@/lib/auth"

// Icon mapping for activity types
const activityIcons: Record<string, { icon: typeof User; color: string }> = {
    login: { icon: User, color: "text-green-500" },
    profile_update: { icon: Edit2, color: "text-blue-500" },
    comment: { icon: MessageSquare, color: "text-purple-500" },
    like: { icon: Heart, color: "text-red-500" },
    view: { icon: Eye, color: "text-gray-500" },
    subscription: { icon: Bell, color: "text-yellow-500" },
    password_change: { icon: Lock, color: "text-orange-500" },
}

// Subscription icon mapping
const subscriptionIcons: Record<string, typeof Bot> = {
    "ChatGPT": Bot,
    "Midjourney": ImageIcon,
    "DALL-E 3": ImageIcon,
    "AI News": FileText,
    "Tutorials": Video,
    "Claude": Cpu,
    "Stable Diffusion": Zap,
    "Gemini": Cpu,
    "Product Updates": TrendingUp,
}

// Social providers config
const SOCIAL_PROVIDERS_CONFIG = [
    { id: "google", name: "Google", icon: Chrome, color: "bg-red-500" },
    { id: "github", name: "GitHub", icon: Github, color: "bg-gray-800" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600" },
    { id: "telegram", name: "Telegram", icon: Send, color: "bg-sky-500" },
]

// Types for API data
interface ActivityItem {
    id: string
    type: string
    description: string
    time: string
}

interface UserStats {
    totalTimeSpent: string
    sessionsCount: number
    lastActive: string
    pagesVisited: number
    toolsUsed: number
    commentsPosted: number
    likesGiven: number
    topSections: { name: string; visits: number }[]
}

interface SubscriptionItem {
    id: number
    name: string
    type: string
    subscribed: boolean
}

interface SocialAccountItem {
    id: string
    name: string
    connected: boolean
}

type TabType = "profile" | "activity" | "stats" | "social" | "privacy" | "media" | "subscriptions" | "security" | "preferences"

export default function ProfilePage() {
    const router = useRouter()
    const { user, logout, isGod, isAdmin, isLoading } = useAuth()
    const [isEditing, setIsEditing] = React.useState(false)
    const [activeTab, setActiveTab] = React.useState<TabType>("profile")
    const [formData, setFormData] = React.useState({
        fullName: "",
        email: "",
        username: "",
        bio: ""
    })
    const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
    const [showNewPassword, setShowNewPassword] = React.useState(false)
    const [passwordData, setPasswordData] = React.useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })

    // Privacy settings
    const [privacySettings, setPrivacySettings] = React.useState({
        profileVisible: true,
        showEmail: false,
        showActivity: true,
        showSubscriptions: true,
        allowMessages: true
    })

    // Avatar/Cover upload states
    const [showAvatarModal, setShowAvatarModal] = React.useState(false)
    const [showCoverModal, setShowCoverModal] = React.useState(false)
    const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null)
    const [coverPreview, setCoverPreview] = React.useState<string | null>(null)
    const [coverImage, setCoverImage] = React.useState<string | null>(null)
    const avatarInputRef = React.useRef<HTMLInputElement>(null)
    const coverInputRef = React.useRef<HTMLInputElement>(null)

    // API data states
    const [activity, setActivity] = React.useState<ActivityItem[]>([])
    const [stats, setStats] = React.useState<UserStats | null>(null)
    const [subscriptions, setSubscriptions] = React.useState<SubscriptionItem[]>([])
    const [socialAccounts, setSocialAccounts] = React.useState<SocialAccountItem[]>([])
    const [isProfileLoading, setIsProfileLoading] = React.useState(true)

    // Redirect if not logged in
    React.useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login")
        }
    }, [user, isLoading, router])

    // Set form data when user loads
    React.useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName,
                email: user.email,
                username: user.username,
                bio: "AI ენთუზიასტი და ტექნოლოგიების მოყვარული 🚀"
            })
        }
    }, [user])

    // Fetch profile data from API
    React.useEffect(() => {
        async function fetchProfileData() {
            if (!user) return

            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    setIsProfileLoading(false)
                    return
                }

                const res = await fetch("/api/profile", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (res.ok) {
                    const data = await res.json()

                    // Set activity data
                    if (data.activity) {
                        setActivity(data.activity.map((a: { id: string; type: string; description: string; time: string }, i: number) => ({
                            id: a.id || `activity-${i}`,
                            type: a.type || "login",
                            description: a.description,
                            time: formatTimeAgo(a.time)
                        })))
                    }

                    // Set stats data
                    if (data.stats) {
                        const topSections = data.stats.topSections || []
                        const totalVisits = topSections.reduce((sum: number, s: { visits: number }) => sum + s.visits, 0) || 1
                        setStats({
                            ...data.stats,
                            topSections: topSections.map((s: { name: string; visits: number }) => ({
                                ...s,
                                percentage: Math.round((s.visits / totalVisits) * 100)
                            }))
                        })
                    }

                    // Set subscriptions
                    if (data.subscriptions) {
                        setSubscriptions(data.subscriptions)
                    }

                    // Set social accounts
                    if (data.socialAccounts) {
                        setSocialAccounts(data.socialAccounts)
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile data:", error)
            } finally {
                setIsProfileLoading(false)
            }
        }

        fetchProfileData()
    }, [user])

    // Helper to format time ago
    function formatTimeAgo(dateString: string): string {
        try {
            const date = new Date(dateString)
            const now = new Date()
            const diffMs = now.getTime() - date.getTime()
            const diffMins = Math.floor(diffMs / 60000)
            const diffHours = Math.floor(diffMs / 3600000)
            const diffDays = Math.floor(diffMs / 86400000)

            if (diffMins < 60) return `${diffMins} წთ წინ`
            if (diffHours < 24) return `${diffHours} სთ წინ`
            if (diffDays === 0) return "დღეს"
            if (diffDays === 1) return "გუშინ"
            if (diffDays < 7) return `${diffDays} დღის წინ`
            if (diffDays < 30) return `${Math.floor(diffDays / 7)} კვირის წინ`
            return date.toLocaleDateString("ka-GE")
        } catch {
            return dateString
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    if (!user) {
        return null
    }

    const roleConfig = ROLE_CONFIG[user.role]

    const handleSave = () => {
        setIsEditing(false)
    }

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
                setShowAvatarModal(true)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setCoverPreview(reader.result as string)
                setShowCoverModal(true)
            }
            reader.readAsDataURL(file)
        }
    }

    const saveAvatar = () => {
        // In real app, would upload to server
        setShowAvatarModal(false)
        setAvatarPreview(null)
    }

    const saveCover = () => {
        if (coverPreview) {
            setCoverImage(coverPreview)
        }
        setShowCoverModal(false)
        setCoverPreview(null)
    }

    const toggleSubscription = (id: number) => {
        setSubscriptions(prev =>
            prev.map(sub =>
                sub.id === id ? { ...sub, subscribed: !sub.subscribed } : sub
            )
        )
    }

    const tabs = [
        { id: "profile" as const, label: "პროფილი", icon: User },
        { id: "activity" as const, label: "აქტივობა", icon: History },
        { id: "stats" as const, label: "სტატისტიკა", icon: BarChart3 },
        { id: "social" as const, label: "სოც. ქსელები", icon: Link2 },
        { id: "privacy" as const, label: "კონფიდენციალურობა", icon: Users },
        { id: "media" as const, label: "მედია", icon: Image },
        { id: "subscriptions" as const, label: "გამოწერები", icon: Bookmark },
        { id: "security" as const, label: "უსაფრთხოება", icon: Shield },
        { id: "preferences" as const, label: "პარამეტრები", icon: Settings }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            </div>

            {/* Cover Image */}
            <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary via-accent to-primary overflow-hidden">
                {coverImage ? (
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-80" />
                )}
                <div className="absolute inset-0 bg-black/20" />
                <button
                    onClick={() => coverInputRef.current?.click()}
                    className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-colors"
                >
                    <Camera className="w-4 h-4" />
                    ფონის შეცვლა
                </button>
                <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverChange}
                />

                {/* Logo link */}
                <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-xl blur-md" />
                        <div className="relative w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Sparkles className="w-5 h-5" />
                        </div>
                    </div>
                    <span className="font-bold text-xl text-white drop-shadow-lg">Andrew Altair</span>
                </Link>
            </div>

            <div className="max-w-4xl mx-auto px-4 relative z-10 -mt-20">
                {/* Profile Header Card */}
                <Card className="border-border/50 shadow-xl backdrop-blur-sm mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Avatar with upload */}
                            <div className="relative group -mt-20 md:-mt-16">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent p-1 shadow-xl">
                                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                                        {avatarPreview || user.avatar ? (
                                            <img src={avatarPreview || user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-16 h-16 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                                <input
                                    ref={avatarInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                                {isGod && (
                                    <div className="absolute -top-2 -right-2 text-3xl animate-bounce">
                                        👑
                                    </div>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
                                <p className="text-muted-foreground mb-3">@{user.username}</p>

                                {/* Role Badge */}
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${roleConfig.color} text-white text-sm font-medium`}>
                                    <span>{roleConfig.icon}</span>
                                    <span>{roleConfig.label}</span>
                                </div>

                                {user.badge && (
                                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-sm ml-2">
                                        {user.badge}
                                    </div>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-col gap-2">
                                {(isGod || isAdmin) && (
                                    <Button asChild variant="outline" className="gap-2">
                                        <Link href="/admin">
                                            <Shield className="w-4 h-4" />
                                            ადმინ პანელი
                                        </Link>
                                    </Button>
                                )}
                                <Button variant="outline" className="gap-2" onClick={handleLogout}>
                                    <LogOut className="w-4 h-4" />
                                    გასვლა
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                ? "bg-primary text-white"
                                : "bg-card border border-border hover:bg-accent/10"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <Card className="border-border/50 shadow-xl backdrop-blur-sm mb-12">
                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5 text-primary" />
                                        პროფილის ინფორმაცია
                                    </CardTitle>
                                    <CardDescription>მართეთ თქვენი პირადი მონაცემები</CardDescription>
                                </div>
                                <Button
                                    variant={isEditing ? "outline" : "default"}
                                    size="sm"
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="gap-2"
                                >
                                    {isEditing ? (
                                        <>
                                            <X className="w-4 h-4" />
                                            გაუქმება
                                        </>
                                    ) : (
                                        <>
                                            <Edit2 className="w-4 h-4" />
                                            რედაქტირება
                                        </>
                                    )}
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                            სრული სახელი
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            />
                                        ) : (
                                            <p className="px-3 py-2 bg-muted/50 rounded-md">{user.fullName}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <span className="text-muted-foreground">@</span>
                                            მომხმარებლის სახელი
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            />
                                        ) : (
                                            <p className="px-3 py-2 bg-muted/50 rounded-md">{user.username}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            ელ. ფოსტა
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        ) : (
                                            <p className="px-3 py-2 bg-muted/50 rounded-md">{user.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            რეგისტრაციის თარიღი
                                        </label>
                                        <p className="px-3 py-2 bg-muted/50 rounded-md">
                                            {new Date(user.createdAt).toLocaleDateString("ka-GE", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-muted-foreground" />
                                        ბიო
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            className="w-full px-3 py-2 bg-background border border-border rounded-md resize-none h-24"
                                            placeholder="მოყევით თქვენ შესახებ..."
                                        />
                                    ) : (
                                        <p className="px-3 py-2 bg-muted/50 rounded-md">{formData.bio}</p>
                                    )}
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end pt-4 border-t">
                                        <Button onClick={handleSave} className="gap-2">
                                            <Save className="w-4 h-4" />
                                            შენახვა
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </>
                    )}

                    {/* Activity Tab */}
                    {activeTab === "activity" && (
                        <>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="w-5 h-5 text-primary" />
                                    აქტივობის ისტორია
                                </CardTitle>
                                <CardDescription>თქვენი ბოლო მოქმედებები პლატფორმაზე</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isProfileLoading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                    </div>
                                ) : activity.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">აქტივობა არ არის</p>
                                ) : (
                                    <div className="space-y-4">
                                        {activity.map((item) => {
                                            const iconConfig = activityIcons[item.type] || activityIcons.login
                                            const IconComponent = iconConfig.icon
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className={`w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center ${iconConfig.color}`}>
                                                        <IconComponent className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{item.description}</p>
                                                        <p className="text-sm text-muted-foreground">{item.time}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                                <div className="mt-6 text-center">
                                    <Button variant="outline" className="gap-2">
                                        <History className="w-4 h-4" />
                                        მეტის ნახვა
                                    </Button>
                                </div>
                            </CardContent>
                        </>
                    )}

                    {/* Stats Tab */}
                    {activeTab === "stats" && (
                        <>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-primary" />
                                    სტატისტიკა
                                </CardTitle>
                                <CardDescription>თქვენი გამოყენების სტატისტიკა</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {isProfileLoading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                    </div>
                                ) : !stats ? (
                                    <p className="text-center text-muted-foreground py-8">სტატისტიკა არ არის</p>
                                ) : (
                                    <>
                                        {/* Quick Stats */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                                                <Clock className="w-6 h-6 text-blue-500 mb-2" />
                                                <p className="text-2xl font-bold">{stats.totalTimeSpent}</p>
                                                <p className="text-sm text-muted-foreground">ჯამური დრო</p>
                                            </div>
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                                                <MousePointerClick className="w-6 h-6 text-green-500 mb-2" />
                                                <p className="text-2xl font-bold">{stats.sessionsCount}</p>
                                                <p className="text-sm text-muted-foreground">სესიები</p>
                                            </div>
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                                                <Wrench className="w-6 h-6 text-purple-500 mb-2" />
                                                <p className="text-2xl font-bold">{stats.toolsUsed}</p>
                                                <p className="text-sm text-muted-foreground">ინსტრუმენტი</p>
                                            </div>
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
                                                <Heart className="w-6 h-6 text-red-500 mb-2" />
                                                <p className="text-2xl font-bold">{stats.likesGiven}</p>
                                                <p className="text-sm text-muted-foreground">მოწონება</p>
                                            </div>
                                        </div>

                                        {/* Top Sections */}
                                        <div className="p-4 rounded-lg border border-border">
                                            <h3 className="font-medium mb-4 flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4" />
                                                ტოპ სექციები
                                            </h3>
                                            <div className="space-y-3">
                                                {stats.topSections.map((section: { name: string; visits: number; percentage?: number }) => (
                                                    <div key={section.name}>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span>{section.name}</span>
                                                            <span className="text-muted-foreground">{section.visits} ნახვა</span>
                                                        </div>
                                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                                                                style={{ width: `${section.percentage || 0}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Activity Summary */}
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-lg border border-border">
                                                <h3 className="font-medium mb-3">ბოლო აქტივობა</h3>
                                                <p className="text-sm text-muted-foreground">{formatTimeAgo(stats.lastActive)}</p>
                                            </div>
                                            <div className="p-4 rounded-lg border border-border">
                                                <h3 className="font-medium mb-3">ნანახი გვერდები</h3>
                                                <p className="text-2xl font-bold text-primary">{stats.pagesVisited}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </>
                    )}

                    {/* Social Tab */}
                    {activeTab === "social" && (
                        <>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Link2 className="w-5 h-5 text-primary" />
                                    დაკავშირებული ანგარიშები
                                </CardTitle>
                                <CardDescription>მართეთ სოციალური ქსელების კავშირები</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {SOCIAL_PROVIDERS_CONFIG.map((providerConfig) => {
                                    const apiAccount = socialAccounts.find(a => a.id === providerConfig.id)
                                    const isConnected = apiAccount?.connected || false
                                    const IconComponent = providerConfig.icon
                                    return (
                                        <div
                                            key={providerConfig.id}
                                            className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 ${providerConfig.color} rounded-xl flex items-center justify-center text-white`}>
                                                    <IconComponent className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{providerConfig.name}</p>
                                                    {isConnected ? (
                                                        <p className="text-sm text-muted-foreground">დაკავშირებულია</p>
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground">არ არის დაკავშირებული</p>
                                                    )}
                                                </div>
                                            </div>
                                            {isConnected ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="flex items-center gap-1 text-green-500 text-sm">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        დაკავშირებულია
                                                    </span>
                                                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                                        გათიშვა
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <Link2 className="w-4 h-4" />
                                                    დაკავშირება
                                                </Button>
                                            )}
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </>
                    )}

                    {/* Privacy Tab */}
                    {activeTab === "privacy" && (
                        <>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    პროფილის ხილვადობა
                                </CardTitle>
                                <CardDescription>მართეთ ვინ ხედავს თქვენს ინფორმაციას</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Profile Visibility Toggle */}
                                <div className="p-4 rounded-lg border border-border">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="font-medium flex items-center gap-2">
                                                <EyeIcon className="w-4 h-4" />
                                                საჯარო პროფილი
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                სხვა მომხმარებლებს შეუძლიათ თქვენი პროფილის ნახვა
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setPrivacySettings({ ...privacySettings, profileVisible: !privacySettings.profileVisible })}
                                            className={`w-14 h-7 rounded-full relative transition-colors ${privacySettings.profileVisible ? "bg-primary" : "bg-muted"}`}
                                        >
                                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${privacySettings.profileVisible ? "right-1" : "left-1"}`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Privacy Settings */}
                                <div className="space-y-4">
                                    {[
                                        { key: "showEmail", label: "ელ. ფოსტის ჩვენება", description: "აჩვენეთ თქვენი ელ. ფოსტა პროფილზე" },
                                        { key: "showActivity", label: "აქტივობის ჩვენება", description: "სხვებმა დაინახონ თქვენი აქტივობა" },
                                        { key: "showSubscriptions", label: "გამოწერების ჩვენება", description: "აჩვენეთ თქვენი გამოწერები" },
                                        { key: "allowMessages", label: "პირადი შეტყობინებები", description: "მიიღეთ შეტყობინებები სხვა მომხმარებლებისგან" }
                                    ].map((setting) => (
                                        <div key={setting.key} className="flex items-center justify-between p-4 rounded-lg border border-border">
                                            <div>
                                                <p className="font-medium">{setting.label}</p>
                                                <p className="text-sm text-muted-foreground">{setting.description}</p>
                                            </div>
                                            <button
                                                onClick={() => setPrivacySettings({ ...privacySettings, [setting.key]: !privacySettings[setting.key as keyof typeof privacySettings] })}
                                                className={`w-12 h-6 rounded-full relative transition-colors ${privacySettings[setting.key as keyof typeof privacySettings] ? "bg-primary" : "bg-muted"}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${privacySettings[setting.key as keyof typeof privacySettings] ? "right-1" : "left-1"}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Public Profile Preview */}
                                {privacySettings.profileVisible && (
                                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                        <p className="text-sm text-primary flex items-center gap-2">
                                            <EyeIcon className="w-4 h-4" />
                                            თქვენი პროფილი ხელმისაწვდომია: altair.ge/@{user.username}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </>
                    )}

                    {/* Media Tab */}
                    {activeTab === "media" && (
                        <>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Image className="w-5 h-5 text-primary" />
                                    მედია პარამეტრები
                                </CardTitle>
                                <CardDescription>მართეთ თქვენი ავატარი და ფონი</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Avatar Section */}
                                <div className="p-4 rounded-lg border border-border">
                                    <h3 className="font-medium mb-4 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        ავატარი
                                    </h3>
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent p-1">
                                            <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-12 h-12 text-muted-foreground" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Button onClick={() => avatarInputRef.current?.click()} className="gap-2">
                                                <Upload className="w-4 h-4" />
                                                ატვირთვა
                                            </Button>
                                            <p className="text-xs text-muted-foreground">
                                                რეკომენდებული: 400x400px, JPG ან PNG
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Cover Section */}
                                <div className="p-4 rounded-lg border border-border">
                                    <h3 className="font-medium mb-4 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" />
                                        ფონის სურათი
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="aspect-[3/1] rounded-lg overflow-hidden bg-gradient-to-r from-primary via-accent to-primary">
                                            {coverImage ? (
                                                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/50">
                                                    <ImageIcon className="w-12 h-12" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button onClick={() => coverInputRef.current?.click()} className="gap-2">
                                                <Upload className="w-4 h-4" />
                                                ატვირთვა
                                            </Button>
                                            {coverImage && (
                                                <Button
                                                    variant="outline"
                                                    className="gap-2 text-destructive hover:text-destructive"
                                                    onClick={() => setCoverImage(null)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    წაშლა
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            რეკომენდებული: 1500x500px, JPG ან PNG
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </>
                    )}

                    {/* Subscriptions Tab */}
                    {activeTab === "subscriptions" && (
                        <>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bookmark className="w-5 h-5 text-primary" />
                                    გამოწერები
                                </CardTitle>
                                <CardDescription>მართეთ თქვენი გამოწერები</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {isProfileLoading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                    </div>
                                ) : subscriptions.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">გამოწერები არ არის</p>
                                ) : (
                                    <>
                                        {/* Tools Subscriptions */}
                                        <div>
                                            <h3 className="font-medium mb-4 flex items-center gap-2">
                                                <Wrench className="w-4 h-4" />
                                                ინსტრუმენტები
                                            </h3>
                                            <div className="grid gap-3">
                                                {subscriptions.filter(s => s.type === "tool").map((sub) => {
                                                    const IconComponent = subscriptionIcons[sub.name] || Bot
                                                    return (
                                                        <div
                                                            key={sub.id}
                                                            className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${sub.subscribed ? "border-primary bg-primary/5" : "border-border"}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sub.subscribed ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                                                                    <IconComponent className="w-5 h-5" />
                                                                </div>
                                                                <span className="font-medium">{sub.name}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => toggleSubscription(sub.id)}
                                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sub.subscribed
                                                                    ? "bg-primary text-white hover:bg-primary/90"
                                                                    : "bg-muted hover:bg-muted/80"
                                                                    }`}
                                                            >
                                                                {sub.subscribed ? "გამოწერილია" : "გამოწერა"}
                                                            </button>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Topics Subscriptions */}
                                        <div>
                                            <h3 className="font-medium mb-4 flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                თემები
                                            </h3>
                                            <div className="grid gap-3">
                                                {subscriptions.filter(s => s.type === "topic").map((sub) => {
                                                    const IconComponent = subscriptionIcons[sub.name] || FileText
                                                    return (
                                                        <div
                                                            key={sub.id}
                                                            className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${sub.subscribed ? "border-primary bg-primary/5" : "border-border"}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sub.subscribed ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                                                                    <IconComponent className="w-5 h-5" />
                                                                </div>
                                                                <span className="font-medium">{sub.name}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => toggleSubscription(sub.id)}
                                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sub.subscribed
                                                                    ? "bg-primary text-white hover:bg-primary/90"
                                                                    : "bg-muted hover:bg-muted/80"
                                                                    }`}
                                                            >
                                                                {sub.subscribed ? "გამოწერილია" : "გამოწერა"}
                                                            </button>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Subscription Stats */}
                                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                            <p className="text-sm">
                                                <span className="font-medium text-primary">{subscriptions.filter(s => s.subscribed).length}</span>
                                                <span className="text-muted-foreground"> აქტიური გამოწერა</span>
                                            </p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </>
                    )}

                    {/* Security Tab */}
                    {activeTab === "security" && (
                        <>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-primary" />
                                    უსაფრთხოება
                                </CardTitle>
                                <CardDescription>მართეთ თქვენი პაროლი და უსაფრთხოების პარამეტრები</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 rounded-lg border border-border">
                                    <h3 className="font-medium mb-4 flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        პაროლის შეცვლა
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">მიმდინარე პაროლი</label>
                                            <div className="relative">
                                                <Input
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                >
                                                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">ახალი პაროლი</label>
                                            <div className="relative">
                                                <Input
                                                    type={showNewPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                >
                                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">დაადასტურეთ პაროლი</label>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            />
                                        </div>
                                        <Button className="gap-2">
                                            <Lock className="w-4 h-4" />
                                            პაროლის შეცვლა
                                        </Button>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg border border-border">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium flex items-center gap-2">
                                                <Shield className="w-4 h-4" />
                                                ორფაქტორიანი ავთენტიფიკაცია
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                დაიცავით თქვენი ანგარიში დამატებითი დაცვით
                                            </p>
                                        </div>
                                        <Button variant="outline">ჩართვა</Button>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg border border-border">
                                    <h3 className="font-medium mb-4">აქტიური სესიები</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                                <div>
                                                    <p className="font-medium text-sm">Windows • Chrome</p>
                                                    <p className="text-xs text-muted-foreground">თბილისი, საქართველო • ახლა</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-green-500 font-medium">მიმდინარე</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === "preferences" && (
                        <>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-primary" />
                                    პარამეტრები
                                </CardTitle>
                                <CardDescription>მორგეთ თქვენი გამოცდილება</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 rounded-lg border border-border">
                                    <h3 className="font-medium mb-4 flex items-center gap-2">
                                        <Bell className="w-4 h-4" />
                                        შეტყობინებები
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: "ელ. ფოსტის შეტყობინებები", description: "მიიღეთ განახლებები ელ. ფოსტით" },
                                            { label: "Push შეტყობინებები", description: "მიიღეთ მყისიერი შეტყობინებები" },
                                            { label: "მარკეტინგული წერილები", description: "მიიღეთ ინფორმაცია ახალი ფუნქციების შესახებ" }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-sm">{item.label}</p>
                                                    <p className="text-xs text-muted-foreground">{item.description}</p>
                                                </div>
                                                <button className="w-12 h-6 bg-primary rounded-full relative">
                                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg border border-border">
                                    <h3 className="font-medium mb-4 flex items-center gap-2">
                                        <Palette className="w-4 h-4" />
                                        გარეგნობა
                                    </h3>
                                    <div className="flex gap-3">
                                        {["მუქი", "ღია", "სისტემური"].map((theme, i) => (
                                            <button
                                                key={theme}
                                                className={`px-4 py-2 rounded-lg border transition-all ${i === 0 ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                                                    }`}
                                            >
                                                {theme}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg border border-border">
                                    <h3 className="font-medium mb-4 flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        ენა
                                    </h3>
                                    <select className="w-full px-3 py-2 rounded-lg border border-border bg-background">
                                        <option value="ka">ქართული</option>
                                        <option value="en">English</option>
                                        <option value="ru">Русский</option>
                                    </select>
                                </div>
                            </CardContent>
                        </>
                    )}
                </Card>
            </div>

            {/* Avatar Upload Modal */}
            {showAvatarModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Crop className="w-5 h-5" />
                                ავატარის რედაქტირება
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {avatarPreview && (
                                <div className="aspect-square max-w-xs mx-auto rounded-full overflow-hidden border-4 border-primary">
                                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => { setShowAvatarModal(false); setAvatarPreview(null) }}>
                                    გაუქმება
                                </Button>
                                <Button onClick={saveAvatar} className="gap-2">
                                    <Save className="w-4 h-4" />
                                    შენახვა
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Cover Upload Modal */}
            {showCoverModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Card className="w-full max-w-2xl mx-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Crop className="w-5 h-5" />
                                ფონის რედაქტირება
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {coverPreview && (
                                <div className="aspect-[3/1] rounded-lg overflow-hidden border-2 border-primary">
                                    <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => { setShowCoverModal(false); setCoverPreview(null) }}>
                                    გაუქმება
                                </Button>
                                <Button onClick={saveCover} className="gap-2">
                                    <Save className="w-4 h-4" />
                                    შენახვა
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

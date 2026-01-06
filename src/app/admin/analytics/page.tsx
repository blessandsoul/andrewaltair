"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
    TbTrendingUp, TbTrendingDown, TbEye, TbUsers, TbChartBar,
    TbArrowUpRight, TbArrowDownRight, TbWorld, TbDeviceMobile,
    TbDeviceDesktop, TbDeviceTablet, TbDownload, TbFileText,
    TbFileSpreadsheet, TbTarget, TbPointer, TbAlertTriangle,
    TbBolt, TbSearch, TbRoute, TbActivity, TbBell, TbSettings, TbClock,
    TbRefresh, TbChevronRight, TbGauge, TbMessage, TbHeart,
    TbMail, TbUserPlus, TbShare, TbCrown
} from "react-icons/tb"
import { FunnelChart } from "@/components/admin/FunnelChart"
import { AlertsWidget } from "@/components/admin/AlertsWidget"
import { RealtimeWidget } from "@/components/admin/RealtimeWidget"
import { ContentPerformanceWidget } from "@/components/admin/ContentPerformanceWidget"

// ============================================
// TYPES
// ============================================

interface StatsData {
    online: number
    totalVisitors: number
    totalPageViews: number
    totalActivities: number
    devices: {
        desktop: number
        mobile: number
        tablet: number
        desktopPercentage: number
        mobilePercentage: number
        tabletPercentage: number
    }
    countries: Array<{ code: string; count: number; percentage: number }>
    cities: Array<{ name: string; count: number; percentage: number }>
    browsers: Array<{ name: string; count: number; percentage: number }>
    activities: Array<{ type: string; count: number }>
    dailyData: Array<{ date: string; visitors: number; pageViews: number }>
    bounceRate: number
    avgSessionDuration: number
    trafficSources: Array<{ source: string; count: number; percentage: number }>
    recentActivities: Array<{
        id: string
        type: string
        displayName: string
        city?: string
        targetTitle?: string
        createdAt: string
    }>
    topSearches: Array<{ term: string; count: number }>
}

interface Post {
    title: string
    views: number
    slug?: string
    id?: string
}

interface Video {
    title: string
    views: number
    youtubeId?: string
    id?: string
    duration?: string
    type?: string
}

// ============================================
// CONSTANTS
// ============================================

const periods = [
    { value: "today", label: "დღეს" },
    { value: "week", label: "კვირა" },
    { value: "month", label: "თვე" },
    { value: "year", label: "წელი" },
    { value: "all", label: "ყველა" }
]

const countryFlags: Record<string, string> = {
    GE: "🇬🇪", US: "🇺🇸", RU: "🇷🇺", TR: "🇹🇷", DE: "🇩🇪", GB: "🇬🇧",
    FR: "🇫🇷", IT: "🇮🇹", ES: "🇪🇸", NL: "🇳🇱", PL: "🇵🇱", UA: "🇺🇦",
    AZ: "🇦🇿", AM: "🇦🇲", BY: "🇧🇾", KZ: "🇰🇿", XX: "🌍"
}

const countryNames: Record<string, string> = {
    GE: "საქართველო", US: "აშშ", RU: "რუსეთი", TR: "თურქეთი",
    DE: "გერმანია", GB: "გაერთ. სამეფო", FR: "საფრანგეთი",
    IT: "იტალია", ES: "ესპანეთი", NL: "ნიდერლანდები",
    PL: "პოლონეთი", UA: "უკრაინა", AZ: "აზერბაიჯანი",
    AM: "სომხეთი", BY: "ბელარუსი", KZ: "ყაზახეთი", XX: "უცნობი"
}

const activityIcons: Record<string, typeof TbUsers> = {
    subscribe: TbMail,
    comment: TbMessage,
    reaction: TbHeart,
    share: TbShare,
    purchase: TbCrown,
    signup: TbUserPlus,
    page_view: TbEye
}

const activityLabels: Record<string, string> = {
    subscribe: "გამოწერები",
    comment: "კომენტარები",
    reaction: "რეაქციები",
    share: "გაზიარებები",
    purchase: "შეძენები",
    signup: "რეგისტრაციები",
    page_view: "გვერდის ნახვები"
}

// ============================================
// HELPERS
// ============================================

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
}

function formatTimeAgo(dateString: string): string {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMinutes / 60)

    if (diffMinutes < 1) return "ახლახანს"
    if (diffMinutes < 60) return `${diffMinutes} წუთის წინ`
    if (diffHours < 24) return `${diffHours} საათის წინ`
    return `${Math.floor(diffHours / 24)} დღის წინ`
}

// ============================================
// MAIN PAGE
// ============================================

export default function AnalyticsPage() {
    const [period, setPeriod] = useState("week")
    const [data, setData] = useState<StatsData | null>(null)
    const [topPostsData, setTopPostsData] = useState<Post[]>([])
    const [topVideosData, setTopVideosData] = useState<Video[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
    const [comparisonEnabled, setComparisonEnabled] = useState(false)

    // Fetch all data
    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [statsRes, postsRes, videosRes] = await Promise.all([
                fetch(`/api/tracking/stats?period=${period}`),
                fetch('/api/posts?limit=5&sort=popular'),
                fetch('/api/videos?limit=5&sort=popular')
            ])

            if (statsRes.ok) {
                const json = await statsRes.json()
                setData(json)
                setLastUpdated(new Date())
            }
            if (postsRes.ok) {
                const json = await postsRes.json()
                setTopPostsData((json.posts || []).slice(0, 5))
            }
            if (videosRes.ok) {
                const json = await videosRes.json()
                setTopVideosData((json.videos || []).slice(0, 5))
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 30000)
        return () => clearInterval(interval)
    }, [period])

    // Export to CSV
    const exportToCSV = () => {
        if (!data) return
        const rows = [
            ['Metric', 'Value'],
            ['Online Now', data.online],
            ['Total Visitors', data.totalVisitors],
            ['Total Page Views', data.totalPageViews],
            ['Total Activities', data.totalActivities],
            ['Desktop', data.devices.desktop],
            ['Mobile', data.devices.mobile],
            ['Tablet', data.devices.tablet],
            [''],
            ['Country', 'Count', 'Percentage'],
            ...data.countries.map(c => [countryNames[c.code] || c.code, c.count, `${c.percentage}%`]),
            [''],
            ['City', 'Count', 'Percentage'],
            ...(data.cities || []).map(c => [c.name, c.count, `${c.percentage}%`]),
            [''],
            ['Activity Type', 'Count'],
            ...data.activities.map(a => [activityLabels[a.type] || a.type, a.count]),
        ]
        const csvContent = rows.map(row => Array.isArray(row) ? row.join(',') : row).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `analytics_${period}_${new Date().toISOString().split('T')[0]}.csv`
        link.click()
        URL.revokeObjectURL(url)
    }

    if (isLoading && !data) {
        return (
            <div className="flex items-center justify-center h-64">
                <TbRefresh className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <TbChartBar className="w-8 h-8 text-indigo-500" />
                        რეალ-ტაიმ ანალიტიკა
                    </h1>
                    {lastUpdated && (
                        <p className="text-muted-foreground mt-1">
                            განახლებულია: {lastUpdated.toLocaleTimeString("ka-GE")}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {periods.map(p => (
                        <Button
                            key={p.value}
                            variant={period === p.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPeriod(p.value)}
                        >
                            {p.label}
                        </Button>
                    ))}

                    {/* Export Dropdown */}
                    <div className="relative group">
                        <Button variant="outline" size="sm" className="gap-1">
                            <TbDownload className="w-4 h-4" />
                            Export
                        </Button>
                        <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            <div className="p-1">
                                {[
                                    { type: 'visitors', label: 'Visitors', icon: TbUsers },
                                    { type: 'activities', label: 'Activities', icon: TbActivity },
                                    { type: 'searches', label: 'Searches', icon: TbSearch },
                                    { type: 'clicks', label: 'Clicks', icon: TbPointer },
                                ].map(item => (
                                    <a
                                        key={item.type}
                                        href={`/api/tracking/export?type=${item.type}`}
                                        download
                                        className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-muted transition-colors"
                                    >
                                        <item.icon className="w-4 h-4 text-muted-foreground" />
                                        {item.label} (.csv)
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Button variant="ghost" size="sm" onClick={fetchData} disabled={isLoading}>
                        <TbRefresh className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                    </Button>

                    {/* Settings */}
                    <a href="/admin/settings">
                        <Button variant="ghost" size="sm">
                            <TbSettings className="w-4 h-4" />
                        </Button>
                    </a>
                </div>
            </div>

            {/* Main Stats */}
            <div className="grid gap-6 lg:grid-cols-4">
                {/* Metric Cards (First 3 cols) */}
                <div className="lg:col-span-3 grid gap-6 md:grid-cols-3">
                    <Card className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-medium text-green-500">LIVE</span>
                            </div>
                            <div className="text-5xl font-bold">{data?.online || 0}</div>
                            <p className="text-sm text-muted-foreground mt-1">ონლაინ ახლა</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">ვიზიტორები</p>
                                    <p className="text-3xl font-bold mt-1">{formatNumber(data?.totalVisitors || 0)}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <TbUsers className="w-6 h-6 text-blue-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">ნახვები</p>
                                    <p className="text-3xl font-bold mt-1">{formatNumber(data?.totalPageViews || 0)}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                    <TbEye className="w-6 h-6 text-purple-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Alerts Widget (Right col) */}
                <div className="lg:col-span-1">
                    <AlertsWidget />
                </div>
            </div>

            {/* Second Row: Devices & Geography */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Device Breakdown */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <TbDeviceDesktop className="w-4 h-4 text-blue-500" />
                            მოწყობილობები
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { icon: TbDeviceDesktop, label: "Desktop", pct: data?.devices.desktopPercentage || 0, color: "bg-blue-500" },
                            { icon: TbDeviceMobile, label: "Mobile", pct: data?.devices.mobilePercentage || 0, color: "bg-purple-500" },
                            { icon: TbDeviceTablet, label: "Tablet", pct: data?.devices.tabletPercentage || 0, color: "bg-pink-500" }
                        ].map((device, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg ${device.color} text-white flex items-center justify-center`}>
                                    <device.icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm">{device.label}</span>
                                        <span className="text-sm font-bold">{device.pct}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                                        <div className={`h-full ${device.color} transition-all`} style={{ width: `${device.pct}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Geography - Real Data */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <TbWorld className="w-4 h-4 text-green-500" />
                            გეოგრაფია
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {(data?.countries || []).length > 0 ? (
                            data?.countries.slice(0, 6).map((country, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-2xl">{countryFlags[country.code] || "🌍"}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium">{countryNames[country.code] || country.code}</span>
                                            <span className="text-sm text-muted-foreground">{formatNumber(country.count)}</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                                            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${country.percentage}%` }} />
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium w-10 text-right">{country.percentage}%</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">მონაცემები არ არის</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Third Row: Traffic Sources & Activities */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Traffic Sources */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <TbRoute className="w-4 h-4 text-orange-500" />
                            ტრაფიკის წყაროები
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(data?.trafficSources || []).length > 0 ? (
                            data?.trafficSources.map((source, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-xs uppercase">
                                        {source.source.slice(0, 2)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm capitalize">{source.source}</span>
                                            <span className="text-sm font-bold">{source.percentage}%</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                                            <div className="h-full bg-orange-500" style={{ width: `${source.percentage}%` }} />
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground min-w-[30px] text-right">{source.count}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">მონაცემები არ არის</p>
                        )}
                    </CardContent>
                </Card>

                {/* Activity Breakdown */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <TbChartBar className="w-4 h-4 text-indigo-500" />
                            აქტივობების ტიპები
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {(data?.activities || []).length > 0 ? (
                            data?.activities.slice(0, 5).map((activity, i) => {
                                const Icon = activityIcons[activity.type] || TbActivity
                                return (
                                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                                        <Icon className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm flex-1">{activityLabels[activity.type] || activity.type}</span>
                                        <Badge variant="secondary">{activity.count}</Badge>
                                    </div>
                                )
                            })
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">აქტივობები არ არის</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Cities Section */}
            {
                data?.cities && data.cities.length > 0 && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                📍 ქალაქები
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                                {data.cities.slice(0, 10).map((city, i) => (
                                    <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                                        <span className="text-sm font-medium flex-1">{city.name}</span>
                                        <Badge variant="outline">{city.count}</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )
            }

            {/* Recent Activity Feed */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <TbActivity className="w-4 h-4 text-green-500" />
                        ბოლო აქტივობები
                        {data?.recentActivities && data.recentActivities.length > 0 && (
                            <Badge variant="outline" className="ml-2">{data.recentActivities.length}</Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {data?.recentActivities && data.recentActivities.length > 0 ? (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {data.recentActivities.map((activity) => {
                                const Icon = activityIcons[activity.type] || TbActivity
                                return (
                                    <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Icon className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {activity.displayName}
                                                <span className="text-muted-foreground font-normal">
                                                    {" — "}{activityLabels[activity.type] || activity.type}
                                                </span>
                                            </p>
                                            {activity.targetTitle && (
                                                <p className="text-xs text-muted-foreground truncate">{activity.targetTitle}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            {activity.city && activity.city !== "Unknown" && (
                                                <p className="text-xs text-muted-foreground">📍 {activity.city}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.createdAt)}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            ბოლო აქტივობები არ არის
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Browsers */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            🌐 ბრაუზერები
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {(data?.browsers || []).map((browser, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-sm flex-1">{browser.name}</span>
                                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${browser.percentage}%` }} />
                                </div>
                                <span className="text-sm font-bold w-12 text-right">{browser.percentage}%</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Daily Chart */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            📊 დღიური სტატისტიკა
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(data?.dailyData || []).length > 0 ? (
                            <div className="h-32 flex items-end gap-2">
                                {data?.dailyData.map((day, i) => {
                                    const maxViews = Math.max(...(data?.dailyData || []).map(d => d.pageViews))
                                    const height = maxViews > 0 ? (day.pageViews / maxViews) * 100 : 0
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                            <div
                                                className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t transition-all"
                                                style={{ height: `${height}%`, minHeight: '4px' }}
                                            />
                                            <span className="text-xs text-muted-foreground">{day.date.split('-')[2]}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">მონაცემები არ არის</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Export & Performance */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Export */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TbDownload className="w-5 h-5 text-indigo-500" />
                            ექსპორტი
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-3">
                            <Button variant="outline" className="flex-col h-20 gap-2" onClick={() => alert("PDF ექსპორტი მალე!")}>
                                <TbFileText className="w-6 h-6 text-red-500" />
                                <span className="text-xs">PDF</span>
                            </Button>
                            <Button variant="outline" className="flex-col h-20 gap-2" onClick={exportToCSV}>
                                <TbFileSpreadsheet className="w-6 h-6 text-green-500" />
                                <span className="text-xs">CSV</span>
                            </Button>
                            <Button variant="outline" className="flex-col h-20 gap-2" onClick={exportToCSV}>
                                <TbFileSpreadsheet className="w-6 h-6 text-emerald-600" />
                                <span className="text-xs">Excel</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Core Web Vitals - Requires PageSpeed API integration */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TbGauge className="w-5 h-5 text-cyan-500" />
                            Core Web Vitals
                            <Badge variant="outline" className="text-xs">მალე</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground text-center py-8">
                            PageSpeed API ინტეგრაცია მალე დაემატება
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Top Content */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Top Posts */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TbTrendingUp className="w-5 h-5 text-green-500" />
                            ტოპ პოსტები
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {topPostsData.length === 0 ? (
                            <p className="text-muted-foreground text-sm">იტვირთება...</p>
                        ) : topPostsData.map((post, i) => (
                            <div key={post.slug || post.id || i} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate text-sm">{post.title}</p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                        <span className="flex items-center gap-1">
                                            <TbEye className="w-3 h-3" />
                                            {formatNumber(post.views || 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card >

                {/* Top Videos */}
                < Card >
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TbTrendingUp className="w-5 h-5 text-green-500" />
                            ტოპ ვიდეოები
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {topVideosData.length === 0 ? (
                            <p className="text-muted-foreground text-sm">იტვირთება...</p>
                        ) : topVideosData.map((video, i) => (
                            <div key={video.youtubeId || video.id || i} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate text-sm">{video.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatNumber(video.views || 0)} ნახვა {video.duration ? `• ${video.duration}` : ''}
                                    </p>
                                </div>
                                <Badge variant={video.type === "short" ? "default" : "secondary"}>
                                    {video.type === "short" ? "Short" : "Long"}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Top Searches */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <TbSearch className="w-4 h-4 text-pink-500" />
                            პოპულარული ძიებები
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(data?.topSearches || []).length > 0 ? (
                            data?.topSearches.map((s, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center font-bold text-xs">
                                            #{i + 1}
                                        </div>
                                        <span className="text-sm font-medium">{s.term}</span>
                                    </div>
                                    <Badge variant="secondary">{s.count}</Badge>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">მონაცემები არ არის</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Fourth Row: Advanced Analytics (Heatmap & Funnel) */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Heatmap Launcher */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TbTarget className="w-5 h-5 text-red-500" />
                            Heatmap Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                                <TbPointer className="w-8 h-8 text-red-500" />
                            </div>
                            <div>
                                <h3 className="font-bold">ვიზუალური ანალიტიკა</h3>
                                <p className="text-sm text-muted-foreground mt-1 mb-4">
                                    ნახეთ სად აჭერენ მომხმარებლები და როგორ მოძრაობენ საიტზე
                                </p>
                                <Button
                                    onClick={() => window.open('/?heatmap=true', '_blank')}
                                    className="gap-2"
                                >
                                    <TbEye className="w-4 h-4" />
                                    Heatmap-ის გახსნა
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Funnel Chart */}
                <FunnelChart />
            </div>

            {/* Fifth Row: Real-time & Content Performance */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Real-time Widget */}
                <div className="lg:col-span-1">
                    <RealtimeWidget />
                </div>

                {/* Content Performance */}
                <div className="lg:col-span-2">
                    <ContentPerformanceWidget />
                </div>
            </div>
        </div >
    )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    TbUsers, TbEye, TbDeviceDesktop, TbDeviceMobile, TbDeviceTablet,
    TbWorld, TbRefresh, TbActivity, TbChartBar, TbMessage, TbHeart,
    TbMail, TbUserPlus, TbShare, TbCrown, TbDownload
} from "react-icons/tb"

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
    browsers: Array<{ name: string; count: number; percentage: number }>
    activities: Array<{ type: string; count: number }>
    dailyData: Array<{ date: string; visitors: number; pageViews: number }>
    recentActivities: Array<{
        id: string
        type: string
        displayName: string
        city?: string
        targetTitle?: string
        createdAt: string
    }>
    period: string
    generatedAt: string
}

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

export function RealTimeAnalytics() {
    const [data, setData] = useState<StatsData | null>(null)
    const [period, setPeriod] = useState("week")
    const [isLoading, setIsLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

    const fetchStats = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/tracking/stats?period=${period}`)
            if (res.ok) {
                const json = await res.json()
                setData(json)
                setLastUpdated(new Date())
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000)
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
            ...data.countries.map(c => [c.code, c.count, `${c.percentage}%`]),
            [''],
            ['Activity Type', 'Count'],
            ...data.activities.map(a => [a.type, a.count]),
            [''],
            ['Date', 'Visitors', 'Page Views'],
            ...data.dailyData.map(d => [d.date, d.visitors, d.pageViews])
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

    if (!data && isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <TbRefresh className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header with period selector */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <TbActivity className="w-6 h-6 text-green-500" />
                        რეალ-ტაიმ ანალიტიკა
                    </h2>
                    {lastUpdated && (
                        <p className="text-sm text-muted-foreground mt-1">
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
                    <Button variant="outline" size="sm" onClick={exportToCSV} disabled={!data}>
                        <TbDownload className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={fetchStats} disabled={isLoading}>
                        <TbRefresh className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {/* Main stats cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Online Now */}
                <Card className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-sm text-green-500 font-medium">LIVE</span>
                                </div>
                                <p className="text-4xl font-bold">{data?.online || 0}</p>
                                <p className="text-sm text-muted-foreground mt-1">ონლაინ ახლა</p>
                            </div>
                            <TbUsers className="w-10 h-10 text-green-500/50" />
                        </div>
                    </CardContent>
                </Card>

                {/* Total Visitors */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">მომხმარებლები</p>
                                <p className="text-3xl font-bold mt-1">{formatNumber(data?.totalVisitors || 0)}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <TbUsers className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Page Views */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">გვერდის ნახვები</p>
                                <p className="text-3xl font-bold mt-1">{formatNumber(data?.totalPageViews || 0)}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <TbEye className="w-6 h-6 text-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Activities */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">აქტივობები</p>
                                <p className="text-3xl font-bold mt-1">{formatNumber(data?.totalActivities || 0)}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                <TbActivity className="w-6 h-6 text-orange-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Second row */}
            <div className="grid gap-6 lg:grid-cols-3">
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
                            { icon: TbDeviceDesktop, label: "Desktop", value: data?.devices.desktop || 0, pct: data?.devices.desktopPercentage || 0, color: "bg-blue-500" },
                            { icon: TbDeviceMobile, label: "Mobile", value: data?.devices.mobile || 0, pct: data?.devices.mobilePercentage || 0, color: "bg-purple-500" },
                            { icon: TbDeviceTablet, label: "Tablet", value: data?.devices.tablet || 0, pct: data?.devices.tabletPercentage || 0, color: "bg-pink-500" }
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

                {/* Geographic Distribution */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <TbWorld className="w-4 h-4 text-green-500" />
                            გეოგრაფია
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {(data?.countries || []).slice(0, 5).map((country, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-xl">{countryFlags[country.code] || "🌍"}</span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">{countryNames[country.code] || country.code}</span>
                                        <span className="text-sm text-muted-foreground">{country.count}</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: `${country.percentage}%` }} />
                                    </div>
                                </div>
                                <span className="text-sm font-medium w-10 text-right">{country.percentage}%</span>
                            </div>
                        ))}
                        {(!data?.countries || data.countries.length === 0) && (
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
                        {(data?.activities || []).slice(0, 5).map((activity, i) => {
                            const Icon = activityIcons[activity.type] || TbActivity
                            return (
                                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                                    <Icon className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm flex-1">{activityLabels[activity.type] || activity.type}</span>
                                    <Badge variant="secondary">{activity.count}</Badge>
                                </div>
                            )
                        })}
                        {(!data?.activities || data.activities.length === 0) && (
                            <p className="text-sm text-muted-foreground text-center py-4">აქტივობები არ არის</p>
                        )}
                    </CardContent>
                </Card>
            </div>

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
        </div>
    )
}

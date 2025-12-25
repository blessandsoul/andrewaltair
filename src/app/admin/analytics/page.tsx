"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    TrendingUp,
    TrendingDown,
    Eye,
    Users,
    Clock,
    BarChart3,
    LineChart,
    PieChart,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Flame
} from "lucide-react"
import postsData from "@/data/posts.json"
import videosData from "@/data/videos.json"

// Mock analytics data
const weeklyData = [
    { day: "ორშ", views: 1200, reactions: 45 },
    { day: "სამ", views: 1800, reactions: 67 },
    { day: "ოთხ", views: 2100, reactions: 89 },
    { day: "ხუთ", views: 1600, reactions: 54 },
    { day: "პარ", views: 2400, reactions: 102 },
    { day: "შაბ", views: 2800, reactions: 134 },
    { day: "კვი", views: 2200, reactions: 98 }
]

const topPosts = postsData
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

const topVideos = videosData
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
}

export default function AnalyticsPage() {
    const maxViews = Math.max(...weeklyData.map(d => d.views))

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-indigo-500" />
                        ანალიტიკა
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        კონტენტის შესრულების მეტრიკები
                    </p>
                </div>
                <Badge variant="outline" className="gap-1">
                    <Calendar className="w-3 h-3" />
                    ბოლო 7 დღე
                </Badge>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">ჯამური ნახვები</p>
                                <p className="text-3xl font-bold mt-1">14.1K</p>
                                <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                                    <ArrowUpRight className="w-4 h-4" />
                                    +12.5%
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Eye className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">უნიკ. ვიზიტორები</p>
                                <p className="text-3xl font-bold mt-1">3.2K</p>
                                <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                                    <ArrowUpRight className="w-4 h-4" />
                                    +8.2%
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <Users className="w-6 h-6 text-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">საშ. დრო</p>
                                <p className="text-3xl font-bold mt-1">4:32</p>
                                <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
                                    <ArrowDownRight className="w-4 h-4" />
                                    -2.1%
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-orange-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">რეაქციები</p>
                                <p className="text-3xl font-bold mt-1">589</p>
                                <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                                    <ArrowUpRight className="w-4 h-4" />
                                    +23.7%
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                                <Flame className="w-6 h-6 text-pink-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Weekly Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LineChart className="w-5 h-5 text-indigo-500" />
                        კვირის სტატისტიკა
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-end gap-2">
                        {weeklyData.map((day, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex flex-col items-center gap-1">
                                    <span className="text-xs text-muted-foreground">
                                        {formatNumber(day.views)}
                                    </span>
                                    <div
                                        className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-purple-500 transition-all duration-500 hover:opacity-80"
                                        style={{
                                            height: `${(day.views / maxViews) * 180}px`,
                                        }}
                                    />
                                </div>
                                <span className="text-xs font-medium">{day.day}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Top Content */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Top Posts */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            ტოპ პოსტები
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {topPosts.map((post, i) => (
                            <div key={post.id} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate text-sm">{post.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatNumber(post.views)} ნახვა
                                    </p>
                                </div>
                                <Badge variant={post.trending ? "default" : "secondary"}>
                                    {post.trending ? "Trending" : post.category}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Top Videos */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            ტოპ ვიდეოები
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {topVideos.map((video, i) => (
                            <div key={video.id} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate text-sm">{video.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatNumber(video.views)} ნახვა • {video.duration}
                                    </p>
                                </div>
                                <Badge variant={video.type === "short" ? "default" : "secondary"}>
                                    {video.type === "short" ? "Short" : "Long"}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

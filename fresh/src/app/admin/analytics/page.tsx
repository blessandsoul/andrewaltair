"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { TbTrendingUp, TbTrendingDown, TbEye, TbUsers, TbClock, TbChartBar, TbChartLine, TbChartPie, TbCalendar, TbArrowUpRight, TbArrowDownRight, TbFlame, TbMessage, TbShare, TbHeart, TbWorld, TbDeviceMobile, TbDeviceDesktop, TbDeviceTablet, TbDownload, TbFileText, TbFileSpreadsheet, TbTarget, TbPointer, TbAlertTriangle, TbBolt, TbSearch, TbRoute, TbActivity, TbBell, TbSettings, TbRefresh, TbChevronRight, TbMapPin, TbBrandChrome, TbBrandApple, TbGauge } from "react-icons/tb"
// Data fetched from MongoDB API

// ============================================
// MOCK DATA
// ============================================

const dateRanges = [
    { label: "დღეს", value: "today" },
    { label: "7 დღე", value: "7days" },
    { label: "30 დღე", value: "30days" },
    { label: "90 დღე", value: "90days" },
    { label: "წელი", value: "year" }
]

const weeklyData = [
    { day: "ორშ", views: 1200, reactions: 45 },
    { day: "სამ", views: 1800, reactions: 67 },
    { day: "ოთხ", views: 2100, reactions: 89 },
    { day: "ხუთ", views: 1600, reactions: 54 },
    { day: "პარ", views: 2400, reactions: 102 },
    { day: "შაბ", views: 2800, reactions: 134 },
    { day: "კვი", views: 2200, reactions: 98 }
]

const geoData = [
    { country: "საქართველო", code: "GE", flag: "🇬🇪", visitors: 8450, percentage: 52 },
    { country: "აშშ", code: "US", flag: "🇺🇸", visitors: 2840, percentage: 17 },
    { country: "რუსეთი", code: "RU", flag: "🇷🇺", visitors: 1920, percentage: 12 },
    { country: "თურქეთი", code: "TR", flag: "🇹🇷", visitors: 1280, percentage: 8 },
    { country: "გერმანია", code: "DE", flag: "🇩🇪", visitors: 980, percentage: 6 },
    { country: "დიდი ბრიტანეთი", code: "GB", flag: "🇬🇧", visitors: 820, percentage: 5 }
]

const deviceData = [
    { type: "Desktop", icon: TbDeviceDesktop, percentage: 65, color: "from-blue-500 to-blue-600" },
    { type: "Mobile", icon: TbDeviceMobile, percentage: 28, color: "from-purple-500 to-purple-600" },
    { type: "Tablet", icon: TbDeviceTablet, percentage: 7, color: "from-pink-500 to-pink-600" }
]

const browserData = [
    { name: "TbBrandChrome", percentage: 62, color: "#4285F4" },
    { name: "Safari", percentage: 18, color: "#000000" },
    { name: "Firefox", percentage: 12, color: "#FF7139" },
    { name: "Edge", percentage: 5, color: "#0078D7" },
    { name: "სხვა", percentage: 3, color: "#9CA3AF" }
]

const trafficSources = [
    { source: "Direct", visitors: 5200, percentage: 40, color: "bg-blue-500" },
    { source: "Organic TbSearch", visitors: 3900, percentage: 30, color: "bg-green-500" },
    { source: "Social Media", visitors: 1950, percentage: 15, color: "bg-purple-500" },
    { source: "Referral", visitors: 1300, percentage: 10, color: "bg-orange-500" },
    { source: "Email", visitors: 650, percentage: 5, color: "bg-pink-500" }
]

const funnelData = [
    { stage: "გვერდის ნახვა", count: 14100, percentage: 100 },
    { stage: "ჩართულობა", count: 8460, percentage: 60 },
    { stage: "რეგისტრაცია", count: 1410, percentage: 10 },
    { stage: "კონვერსია", count: 423, percentage: 3 }
]

const goalsData = [
    { name: "ნიუსლეტერზე გამოწერა", target: 500, current: 342, color: "from-green-500 to-emerald-500" },
    { name: "CTA-ზე დაკლიკება", target: 1000, current: 876, color: "from-blue-500 to-cyan-500" },
    { name: ">2 წთ დარჩენა", target: 2000, current: 1654, color: "from-purple-500 to-pink-500" }
]

const anomalies = [
    { type: "spike", message: "ტრაფიკის მკვეთრი ზრდა (+156%)", time: "დღეს, 14:30", severity: "positive" },
    { type: "drop", message: "Bounce Rate-ის გაზრდა (+12%)", time: "გუშინ, 09:15", severity: "warning" },
    { type: "spike", message: "Social-დან ტრაფიკი x3", time: "2 დღის წინ", severity: "positive" }
]

const searchQueries = [
    { query: "chatgpt ხრიკები", clicks: 245, impressions: 1230 },
    { query: "AI ინსტრუმენტები", clicks: 189, impressions: 980 },
    { query: "prompt engineering", clicks: 156, impressions: 720 },
    { query: "DALL-E 3", clicks: 134, impressions: 590 },
    { query: "Gemini vs ChatGPT", clicks: 112, impressions: 480 }
]

const userFlowData = [
    { from: "მთავარი", to: "AI ინსტრუმენტები", count: 2340 },
    { from: "AI ინსტრუმენტები", to: "ბლოგი", count: 1560 },
    { from: "ბლოგი", to: "ვიდეოები", count: 890 },
    { from: "მთავარი", to: "შესვლა", count: 670 }
]

// Top content will be fetched dynamically
let topPosts: { title: string; views: number; slug: string }[] = []
let topVideos: { title: string; views: number; youtubeId: string }[] = []

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
}

// ============================================
// COMPONENTS
// ============================================

// 1. Date Range Picker
function DateRangePicker({ selected, onSelect }: { selected: string; onSelect: (v: string) => void }) {
    return (
        <div className="flex items-center gap-2 flex-wrap">
            {dateRanges.map((range) => (
                <Button
                    key={range.value}
                    variant={selected === range.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelect(range.value)}
                    className="text-xs"
                >
                    {range.label}
                </Button>
            ))}
            <Button variant="outline" size="sm" className="text-xs gap-1">
                <TbCalendar className="w-3 h-3" />
                Custom
            </Button>
        </div>
    )
}

// 2. Real-time Analytics
function RealTimeCard() {
    const [liveVisitors, setLiveVisitors] = useState(47)
    const [sparkline] = useState([12, 18, 25, 22, 35, 42, 38, 45, 52, 47])

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveVisitors(prev => prev + Math.floor(Math.random() * 11) - 5)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    const maxSparkline = Math.max(...sparkline)

    return (
        <Card className="relative overflow-hidden border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-medium text-green-500">LIVE</span>
                    </div>
                    <TbRefresh className="w-4 h-4 text-muted-foreground animate-spin" style={{ animationDuration: "3s" }} />
                </div>
                <div className="text-5xl font-bold mb-2">{liveVisitors}</div>
                <p className="text-sm text-muted-foreground mb-4">აქტიური მომხმარებელი</p>

                {/* Mini Sparkline */}
                <div className="h-12 flex items-end gap-1">
                    {sparkline.map((val, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-green-500/60 rounded-t transition-all"
                            style={{ height: `${(val / maxSparkline) * 100}%` }}
                        />
                    ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">ბოლო 30 წუთი</p>
            </CardContent>
        </Card>
    )
}

// 3. Geographic Data
function GeoSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TbWorld className="w-5 h-5 text-blue-500" />
                    გეოგრაფია
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {geoData.map((country, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <span className="text-2xl">{country.flag}</span>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">{country.country}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {formatNumber(country.visitors)}
                                    </span>
                                </div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                                        style={{ width: `${country.percentage}%` }}
                                    />
                                </div>
                            </div>
                            <span className="text-sm font-medium w-10 text-right">{country.percentage}%</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

// 4. Device & Browser Stats
function DeviceBrowserSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TbDeviceMobile className="w-5 h-5 text-purple-500" />
                    მოწყობილობები & ბრაუზერები
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="devices">
                    <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="devices">მოწყობილობები</TabsTrigger>
                        <TabsTrigger value="browsers">ბრაუზერები</TabsTrigger>
                    </TabsList>

                    <TabsContent value="devices">
                        <div className="space-y-4">
                            {deviceData.map((device, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${device.color} flex items-center justify-center`}>
                                        <device.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium">{device.type}</span>
                                            <span className="text-sm font-bold">{device.percentage}%</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                                            <div
                                                className={`h-full rounded-full bg-gradient-to-r ${device.color} transition-all duration-500`}
                                                style={{ width: `${device.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="browsers">
                        <div className="space-y-3">
                            {browserData.map((browser, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: browser.color }}
                                    />
                                    <span className="text-sm flex-1">{browser.name}</span>
                                    <span className="text-sm font-bold">{browser.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

// 5. Traffic Sources
function TrafficSourcesSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TbRoute className="w-5 h-5 text-orange-500" />
                    ტრაფიკის წყაროები
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {trafficSources.map((source, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{source.source}</span>
                                <span className="text-sm text-muted-foreground">
                                    {formatNumber(source.visitors)} • {source.percentage}%
                                </span>
                            </div>
                            <div className="h-3 rounded-full bg-muted overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${source.color} transition-all duration-700`}
                                    style={{ width: `${source.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

// 6. Export Buttons
function ExportSection() {
    const handleExport = (type: string) => {
        alert(`ექსპორტი ${type} ფორმატში დაიწყო...`)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TbDownload className="w-5 h-5 text-indigo-500" />
                    ანგარიშის ექსპორტი
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="flex-col h-20 gap-2" onClick={() => handleExport("PDF")}>
                        <TbFileText className="w-6 h-6 text-red-500" />
                        <span className="text-xs">PDF</span>
                    </Button>
                    <Button variant="outline" className="flex-col h-20 gap-2" onClick={() => handleExport("CSV")}>
                        <TbFileSpreadsheet className="w-6 h-6 text-green-500" />
                        <span className="text-xs">CSV</span>
                    </Button>
                    <Button variant="outline" className="flex-col h-20 gap-2" onClick={() => handleExport("Excel")}>
                        <TbFileSpreadsheet className="w-6 h-6 text-emerald-600" />
                        <span className="text-xs">Excel</span>
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3">
                    ექსპორტი მოიცავს არჩეულ პერიოდს
                </p>
            </CardContent>
        </Card>
    )
}

// 7. Goals & Conversions
function GoalsSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TbTarget className="w-5 h-5 text-green-500" />
                    მიზნები & კონვერსია
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Funnel */}
                <div className="mb-6">
                    <p className="text-sm font-medium mb-3">კონვერსიის ფანელი</p>
                    <div className="space-y-2">
                        {funnelData.map((stage, i) => (
                            <div key={i} className="relative">
                                <div
                                    className="h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-between px-4 text-white text-sm transition-all"
                                    style={{ width: `${stage.percentage}%`, minWidth: "120px" }}
                                >
                                    <span className="font-medium truncate">{stage.stage}</span>
                                    <span className="font-bold">{formatNumber(stage.count)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Goals Progress */}
                <div className="space-y-4">
                    <p className="text-sm font-medium">მიზნების პროგრესი</p>
                    {goalsData.map((goal, i) => (
                        <div key={i}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">{goal.name}</span>
                                <span className="text-sm font-medium">
                                    {goal.current}/{goal.target}
                                </span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div
                                    className={`h-full rounded-full bg-gradient-to-r ${goal.color} transition-all duration-500`}
                                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

// 8. Heatmap Preview
function HeatmapSection() {
    return (
        <Card className="relative overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TbPointer className="w-5 h-5 text-red-500" />
                    ჰითმეპი
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg relative overflow-hidden">
                    {/* Mock heatmap visualization */}
                    <div className="absolute top-1/4 left-1/3 w-20 h-20 rounded-full bg-red-500/60 blur-xl" />
                    <div className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-orange-500/50 blur-lg" />
                    <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-yellow-500/40 blur-md" />
                    <div className="absolute bottom-1/4 left-1/4 w-10 h-10 rounded-full bg-red-400/30 blur-md" />

                    {/* Overlay message */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="text-center">
                            <TbPointer className="w-8 h-8 mx-auto mb-2 text-white" />
                            <p className="text-white text-sm font-medium">დაკლიკებების რუკა</p>
                        </div>
                    </div>
                </div>
                <Button variant="outline" className="w-full mt-4 gap-2">
                    <TbChevronRight className="w-4 h-4" />
                    სრული ჰითმეპის ნახვა
                </Button>
            </CardContent>
        </Card>
    )
}

// 9. Comparison Mode
function ComparisonSection({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
    return (
        <Card className={enabled ? "border-indigo-500/50" : ""}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <TbChartBar className="w-5 h-5 text-indigo-500" />
                        პერიოდების შედარება
                    </CardTitle>
                    <Button variant={enabled ? "default" : "outline"} size="sm" onClick={onToggle}>
                        {enabled ? "ჩართულია" : "გამორთულია"}
                    </Button>
                </div>
            </CardHeader>
            {enabled && (
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-xs text-muted-foreground mb-1">ეს პერიოდი</p>
                            <p className="text-2xl font-bold">14.1K</p>
                            <p className="text-xs text-green-500">+12.5%</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-xs text-muted-foreground mb-1">წინა პერიოდი</p>
                            <p className="text-2xl font-bold">12.5K</p>
                            <p className="text-xs text-muted-foreground">baseline</p>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}

// 10. Alerts & Anomaly Detection
function AlertsSection() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <TbBell className="w-5 h-5 text-yellow-500" />
                        შეტყობინებები
                    </CardTitle>
                    <Button variant="ghost" size="sm">
                        <TbSettings className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {anomalies.map((anomaly, i) => (
                        <div
                            key={i}
                            className={`p-3 rounded-lg border ${anomaly.severity === "positive"
                                ? "border-green-500/30 bg-green-500/5"
                                : "border-yellow-500/30 bg-yellow-500/5"
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                {anomaly.severity === "positive" ? (
                                    <TbTrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                                ) : (
                                    <TbAlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                                )}
                                <div>
                                    <p className="text-sm font-medium">{anomaly.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{anomaly.time}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

// 11. Engagement Rate
function EngagementCard() {
    const engagementRate = 32.4
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Engagement Rate</p>
                        <p className="text-3xl font-bold mt-1">{engagementRate}%</p>
                        <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                            <TbArrowUpRight className="w-4 h-4" />
                            +5.2%
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        <TbActivity className="w-6 h-6 text-indigo-500" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// 12. Bounce Rate
function BounceRateCard() {
    const bounceRate = 42.8
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Bounce Rate</p>
                        <p className="text-3xl font-bold mt-1">{bounceRate}%</p>
                        <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
                            <TbArrowDownRight className="w-4 h-4" />
                            +3.1%
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <TbTrendingDown className="w-6 h-6 text-red-500" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// 13. Page Speed Metrics
function PageSpeedSection() {
    const metrics = [
        { name: "LCP", value: "1.8s", status: "good", description: "Largest Contentful Paint" },
        { name: "FID", value: "45ms", status: "good", description: "First Input Delay" },
        { name: "CLS", value: "0.08", status: "good", description: "Cumulative Layout Shift" }
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case "good": return "text-green-500 bg-green-500/10"
            case "needs-improvement": return "text-yellow-500 bg-yellow-500/10"
            case "poor": return "text-red-500 bg-red-500/10"
            default: return "text-muted-foreground bg-muted"
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TbGauge className="w-5 h-5 text-cyan-500" />
                    Core Web Vitals
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4">
                    {metrics.map((metric, i) => (
                        <div key={i} className={`p-4 rounded-lg ${getStatusColor(metric.status)}`}>
                            <p className="text-2xl font-bold">{metric.value}</p>
                            <p className="text-sm font-medium mt-1">{metric.name}</p>
                            <p className="text-xs opacity-70 mt-1">{metric.description}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2">
                        <TbBolt className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-green-500">Performance Score: 94</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// 14. TbSearch Analytics
function SearchAnalyticsSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TbSearch className="w-5 h-5 text-amber-500" />
                    ძებნის ანალიტიკა
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {searchQueries.map((query, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium w-6">{i + 1}.</span>
                                <span className="text-sm">{query.query}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{query.clicks} კლიკი</span>
                                <span>{query.impressions} შთაბეჭდ.</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

// 15. User Journey/Flow
function UserFlowSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TbRoute className="w-5 h-5 text-teal-500" />
                    მომხმარებლის მარშრუტი
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {userFlowData.map((flow, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <div className="flex-1 flex items-center gap-2">
                                <Badge variant="secondary">{flow.from}</Badge>
                                <TbChevronRight className="w-4 h-4 text-muted-foreground" />
                                <Badge variant="outline">{flow.to}</Badge>
                            </div>
                            <span className="text-sm font-medium">{formatNumber(flow.count)}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-2xl font-bold">3.2</p>
                        <p className="text-xs text-muted-foreground">საშ. გვერდი/სესია</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-2xl font-bold">4:32</p>
                        <p className="text-xs text-muted-foreground">საშ. სესიის დრო</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// ============================================
// MAIN PAGE
// ============================================

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState("7days")
    const [comparisonEnabled, setComparisonEnabled] = useState(false)
    const [topPostsData, setTopPostsData] = useState<typeof topPosts>([])
    const [topVideosData, setTopVideosData] = useState<typeof topVideos>([])
    const [analyticsData, setAnalyticsData] = useState<{
        stats: { posts: number; videos: number; users: number; comments: number; totalViews: number; totalReactions: number };
        weeklyData: { day: string; views: number; reactions: number }[];
    } | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const maxViews = analyticsData?.weeklyData ? Math.max(...analyticsData.weeklyData.map(d => d.views)) : Math.max(...weeklyData.map(d => d.views))

    // Fetch analytics data from MongoDB
    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const [analyticsRes, postsRes, videosRes] = await Promise.all([
                    fetch('/api/analytics'),
                    fetch('/api/posts?limit=5&sort=popular'),
                    fetch('/api/videos?limit=5&sort=popular')
                ])
                if (analyticsRes.ok) {
                    const data = await analyticsRes.json()
                    setAnalyticsData(data)
                    if (data.topPosts) setTopPostsData(data.topPosts)
                    if (data.topVideos) setTopVideosData(data.topVideos)
                }
                if (postsRes.ok && !analyticsData?.stats) {
                    const data = await postsRes.json()
                    setTopPostsData((data.posts || []).slice(0, 5))
                }
                if (videosRes.ok && !analyticsData?.stats) {
                    const data = await videosRes.json()
                    setTopVideosData((data.videos || []).slice(0, 5))
                }
            } catch (error) {
                console.error('Error fetching analytics data:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchAnalytics()
    }, [])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <TbChartBar className="w-8 h-8 text-indigo-500" />
                        ანალიტიკა
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        კონტენტის შესრულების მეტრიკები
                    </p>
                </div>
                <DateRangePicker selected={dateRange} onSelect={setDateRange} />
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <RealTimeCard />

                <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">ჯამური ნახვები</p>
                                <p className="text-3xl font-bold mt-1">{formatNumber(analyticsData?.stats?.totalViews || 14100)}</p>
                                <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                                    <TbArrowUpRight className="w-4 h-4" />
                                    +12.5%
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <TbEye className="w-6 h-6 text-blue-500" />
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
                                    <TbArrowUpRight className="w-4 h-4" />
                                    +8.2%
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <TbUsers className="w-6 h-6 text-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <EngagementCard />
                <BounceRateCard />
            </div>

            {/* Weekly Chart + Comparison */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TbChartLine className="w-5 h-5 text-indigo-500" />
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
                                            className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-purple-500 transition-all duration-500 hover:opacity-80 cursor-pointer"
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

                <ComparisonSection enabled={comparisonEnabled} onToggle={() => setComparisonEnabled(!comparisonEnabled)} />
            </div>

            {/* Geographic + Device/Browser */}
            <div className="grid gap-6 lg:grid-cols-2">
                <GeoSection />
                <DeviceBrowserSection />
            </div>

            {/* Traffic Sources + Goals */}
            <div className="grid gap-6 lg:grid-cols-2">
                <TrafficSourcesSection />
                <GoalsSection />
            </div>

            {/* Page Speed + Alerts */}
            <div className="grid gap-6 lg:grid-cols-2">
                <PageSpeedSection />
                <AlertsSection />
            </div>

            {/* Heatmap + Export */}
            <div className="grid gap-6 lg:grid-cols-2">
                <HeatmapSection />
                <ExportSection />
            </div>

            {/* TbSearch Analytics + User Flow */}
            <div className="grid gap-6 lg:grid-cols-2">
                <SearchAnalyticsSection />
                <UserFlowSection />
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
                        ) : topPostsData.map((post: { title: string; views: number; slug?: string; id?: string }, i: number) => (
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
                </Card>

                {/* Top Videos */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TbTrendingUp className="w-5 h-5 text-green-500" />
                            ტოპ ვიდეოები
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {topVideosData.length === 0 ? (
                            <p className="text-muted-foreground text-sm">იტვირთება...</p>
                        ) : topVideosData.map((video: { title: string; views: number; youtubeId?: string; id?: string; duration?: string; type?: string }, i: number) => (
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
            </div>
        </div>
    )
}

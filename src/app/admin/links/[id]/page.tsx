"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    TbArrowLeft,
    TbClick,
    TbUsers,
    TbCalendar,
    TbClock,
    TbCopy,
    TbQrcode,
    TbDownload,
    TbExternalLink,
    TbWorld,
    TbDeviceDesktop,
    TbBrowser,
    TbLink,
    TbFileExport,
} from "react-icons/tb"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from "recharts"
import { toast } from "sonner"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://andrewaltair.ge"

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"]

interface ShortLink {
    _id: string
    slug: string
    originalUrl: string
    fallbackUrl: string
    title?: string
    expiresAt?: string
    maxClicks?: number
    totalClicks: number
    uniqueClicks: number
    isActive: boolean
    lastClickedAt?: string
    createdAt: string
}

interface GroupCount {
    _id: string
    count: number
    [key: string]: string | number
}

interface ClicksByDay {
    date: string
    total: number
    unique: number
}

interface LinkStats {
    clicksByDay: ClicksByDay[]
    geoBreakdown: GroupCount[]
    deviceBreakdown: GroupCount[]
    browserBreakdown: GroupCount[]
    osBreakdown: GroupCount[]
    referrerBreakdown: GroupCount[]
    utmSources: GroupCount[]
    utmMediums: GroupCount[]
    utmCampaigns: GroupCount[]
}

export default function LinkStatsPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [link, setLink] = React.useState<ShortLink | null>(null)
    const [stats, setStats] = React.useState<LinkStats | null>(null)
    const [period, setPeriod] = React.useState("30d")
    const [isLoading, setIsLoading] = React.useState(true)
    const [qrData, setQrData] = React.useState<string | null>(null)

    const fetchData = React.useCallback(async () => {
        setIsLoading(true)
        try {
            const [linkRes, statsRes] = await Promise.all([
                fetch(`/api/admin/links/${id}`),
                fetch(`/api/admin/links/${id}/stats?period=${period}`),
            ])
            const [linkJson, statsJson] = await Promise.all([linkRes.json(), statsRes.json()])
            if (linkJson.success) setLink(linkJson.data)
            if (statsJson.success) setStats(statsJson.data)
        } catch {
            toast.error("მონაცემების ჩატვირთვა ვერ მოხერხდა")
        } finally {
            setIsLoading(false)
        }
    }, [id, period])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleCopy = () => {
        if (!link) return
        navigator.clipboard.writeText(`${BASE_URL}/link/${link.slug}`)
        toast.success("დაკოპირდა!")
    }

    const handleQR = async () => {
        try {
            const res = await fetch(`/api/admin/links/${id}/qr`)
            const json = await res.json()
            if (json.success) setQrData(json.data.qrDataUrl)
        } catch {
            toast.error("QR კოდის გენერაცია ვერ მოხერხდა")
        }
    }

    if (isLoading && !link) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 animate-pulse bg-muted rounded" />
                <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}><CardContent className="p-6"><div className="h-16 animate-pulse bg-muted rounded" /></CardContent></Card>
                    ))}
                </div>
                <Card><CardContent className="p-6"><div className="h-64 animate-pulse bg-muted rounded" /></CardContent></Card>
            </div>
        )
    }

    if (!link) return null

    const shortUrl = `${BASE_URL}/link/${link.slug}`
    const daysSinceCreation = Math.floor((Date.now() - new Date(link.createdAt).getTime()) / (1000 * 60 * 60 * 24))

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/admin/links")}>
                        <TbArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <TbLink className="w-5 h-5 text-indigo-500" />
                            {link.title || link.slug}
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                            <code className="text-indigo-500 font-mono">{shortUrl}</code>
                            <TbExternalLink className="w-3 h-3" />
                            <span className="truncate max-w-xs">{link.originalUrl}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
                        <TbCopy className="w-4 h-4" />
                        კოპირება
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleQR} className="gap-1.5">
                        <TbQrcode className="w-4 h-4" />
                        QR
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                            try {
                                const res = await fetch(`/api/admin/links/${id}/export`)
                                if (!res.ok) throw new Error()
                                const blob = await res.blob()
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement("a")
                                a.href = url
                                a.download = `clicks-${link.slug}.csv`
                                a.click()
                                URL.revokeObjectURL(url)
                                toast.success("ექსპორტი წარმატებულია")
                            } catch { toast.error("ექსპორტი ვერ მოხერხდა") }
                        }}
                        className="gap-1.5"
                    >
                        <TbFileExport className="w-4 h-4" />
                        CSV
                    </Button>
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-28">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">7 დღე</SelectItem>
                            <SelectItem value="30d">30 დღე</SelectItem>
                            <SelectItem value="90d">90 დღე</SelectItem>
                            <SelectItem value="all">ყველა</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                            <TbClick className="w-4 h-4" />
                            სულ კლიკები
                        </div>
                        <div className="text-2xl font-bold">{link.totalClicks}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                            <TbUsers className="w-4 h-4" />
                            უნიკალური
                        </div>
                        <div className="text-2xl font-bold">{link.uniqueClicks}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                            <TbClock className="w-4 h-4" />
                            ბოლო კლიკი
                        </div>
                        <div className="text-lg font-bold">
                            {link.lastClickedAt
                                ? new Date(link.lastClickedAt).toLocaleDateString("ka-GE")
                                : "—"}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                            <TbCalendar className="w-4 h-4" />
                            დღეების რაოდენობა
                        </div>
                        <div className="text-2xl font-bold">{daysSinceCreation}</div>
                    </CardContent>
                </Card>
            </div>

            {stats && (
                <>
                    {/* Clicks Over Time */}
                    {stats.clicksByDay.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">კლიკები დღეების მიხედვით</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={stats.clicksByDay}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                        <XAxis dataKey="date" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                                        <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "hsl(var(--card))",
                                                border: "1px solid hsl(var(--border))",
                                                borderRadius: "8px",
                                            }}
                                        />
                                        <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} name="სულ" dot={false} />
                                        <Line type="monotone" dataKey="unique" stroke="#a78bfa" strokeWidth={2} name="უნიკალური" dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Devices */}
                        {stats.deviceBreakdown.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <TbDeviceDesktop className="w-4 h-4" />
                                        მოწყობილობები
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={stats.deviceBreakdown}
                                                dataKey="count"
                                                nameKey="_id"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={70}
                                                paddingAngle={2}
                                            >
                                                {stats.deviceBreakdown.map((_, i) => (
                                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex justify-center gap-4 mt-2">
                                        {stats.deviceBreakdown.map((d, i) => (
                                            <div key={d._id} className="flex items-center gap-1.5 text-xs">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                                {d._id} ({d.count})
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Countries */}
                        {stats.geoBreakdown.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <TbWorld className="w-4 h-4" />
                                        ქვეყნები
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={stats.geoBreakdown.slice(0, 6)} layout="vertical">
                                            <XAxis type="number" tick={{ fontSize: 11 }} />
                                            <YAxis dataKey="_id" type="category" tick={{ fontSize: 11 }} width={80} />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )}

                        {/* Browsers */}
                        {stats.browserBreakdown.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <TbBrowser className="w-4 h-4" />
                                        ბრაუზერები
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={stats.browserBreakdown.slice(0, 6)} layout="vertical">
                                            <XAxis type="number" tick={{ fontSize: 11 }} />
                                            <YAxis dataKey="_id" type="category" tick={{ fontSize: 11 }} width={80} />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Referrers */}
                    {stats.referrerBreakdown.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">ტოპ რეფერერები</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {stats.referrerBreakdown.slice(0, 10).map((r) => (
                                        <div key={r._id} className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground truncate max-w-md">{r._id}</span>
                                            <Badge variant="secondary">{r.count}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* UTM Breakdown */}
                    {(stats.utmSources.length > 0 || stats.utmMediums.length > 0 || stats.utmCampaigns.length > 0) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">UTM პარამეტრები</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {stats.utmSources.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Source</h4>
                                            {stats.utmSources.map((s) => (
                                                <div key={s._id} className="flex justify-between text-sm py-1">
                                                    <span>{s._id}</span>
                                                    <span className="text-muted-foreground">{s.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {stats.utmMediums.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Medium</h4>
                                            {stats.utmMediums.map((m) => (
                                                <div key={m._id} className="flex justify-between text-sm py-1">
                                                    <span>{m._id}</span>
                                                    <span className="text-muted-foreground">{m.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {stats.utmCampaigns.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Campaign</h4>
                                            {stats.utmCampaigns.map((c) => (
                                                <div key={c._id} className="flex justify-between text-sm py-1">
                                                    <span>{c._id}</span>
                                                    <span className="text-muted-foreground">{c.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}

            {/* QR Modal */}
            {qrData && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
                    <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center">
                        <h3 className="text-lg font-bold mb-4">QR კოდი</h3>
                        <img src={qrData} alt="QR Code" className="mx-auto mb-3 rounded-lg" width={256} height={256} />
                        <p className="text-sm text-muted-foreground mb-4 font-mono">{shortUrl}</p>
                        <div className="flex justify-center gap-2">
                            <Button variant="outline" onClick={() => setQrData(null)}>დახურვა</Button>
                            <Button
                                onClick={() => {
                                    const a = document.createElement("a")
                                    a.href = qrData
                                    a.download = `qr-${link.slug}.png`
                                    a.click()
                                }}
                                className="gap-2"
                            >
                                <TbDownload className="w-4 h-4" />
                                ჩამოტვირთვა
                            </Button>
                        </div>
                    </div>
                    <div className="fixed inset-0 -z-10" onClick={() => setQrData(null)} />
                </div>
            )}
        </div>
    )
}

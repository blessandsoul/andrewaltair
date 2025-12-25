"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Wrench,
    Database,
    Download,
    Upload,
    RefreshCw,
    Trash2,
    Link as LinkIcon,
    AlertTriangle,
    CheckCircle,
    Clock,
    HardDrive,
    Zap,
    Shield
} from "lucide-react"

interface BackupItem {
    id: string
    date: string
    size: string
    type: "auto" | "manual"
}

interface BrokenLink {
    id: string
    page: string
    url: string
    status: number
    lastChecked: string
}

const sampleBackups: BackupItem[] = [
    { id: "1", date: "2024-12-25 14:30", size: "2.4 MB", type: "manual" },
    { id: "2", date: "2024-12-24 00:00", size: "2.3 MB", type: "auto" },
    { id: "3", date: "2024-12-23 00:00", size: "2.2 MB", type: "auto" },
]

const sampleBrokenLinks: BrokenLink[] = [
    { id: "1", page: "/blog/chatgpt-tips", url: "https://example.com/broken", status: 404, lastChecked: "2024-12-25" },
    { id: "2", page: "/resources", url: "https://oldsite.com/page", status: 500, lastChecked: "2024-12-25" },
]

export default function ToolsPage() {
    const [isBackingUp, setIsBackingUp] = React.useState(false)
    const [isCheckingLinks, setIsCheckingLinks] = React.useState(false)
    const [isClearingCache, setIsClearingCache] = React.useState(false)

    const createBackup = () => {
        setIsBackingUp(true)
        setTimeout(() => setIsBackingUp(false), 3000)
    }

    const checkLinks = () => {
        setIsCheckingLinks(true)
        setTimeout(() => setIsCheckingLinks(false), 4000)
    }

    const clearCache = () => {
        setIsClearingCache(true)
        setTimeout(() => setIsClearingCache(false), 1500)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Wrench className="w-8 h-8 text-indigo-500" />
                    სისტემური ინსტრუმენტები
                </h1>
                <p className="text-muted-foreground mt-1">
                    Backup, cache, და სხვა ინსტრუმენტები
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={createBackup}>
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
                            <Database className={`w-6 h-6 text-blue-500 ${isBackingUp ? "animate-pulse" : ""}`} />
                        </div>
                        <p className="font-semibold">Backup შექმნა</p>
                        <p className="text-sm text-muted-foreground">მონაცემთა სარეზერვო ასლი</p>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={checkLinks}>
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-3">
                            <LinkIcon className={`w-6 h-6 text-orange-500 ${isCheckingLinks ? "animate-pulse" : ""}`} />
                        </div>
                        <p className="font-semibold">ლინკების შემოწმება</p>
                        <p className="text-sm text-muted-foreground">გატეხილი ლინკების პოვნა</p>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={clearCache}>
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-3">
                            <Zap className={`w-6 h-6 text-red-500 ${isClearingCache ? "animate-spin" : ""}`} />
                        </div>
                        <p className="font-semibold">ქეშის გასუფთავება</p>
                        <p className="text-sm text-muted-foreground">ბრაუზერისა და სერვერის cache</p>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-3">
                            <Shield className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="font-semibold">უსაფრთხოების სკანი</p>
                        <p className="text-sm text-muted-foreground">მავნე კოდის შემოწმება</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Backups */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Database className="w-5 h-5 text-blue-500" />
                            სარეზერვო ასლები
                        </CardTitle>
                        <Button size="sm" variant="outline" onClick={createBackup} disabled={isBackingUp}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${isBackingUp ? "animate-spin" : ""}`} />
                            ახალი
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {isBackingUp && (
                            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <div className="flex items-center gap-3">
                                    <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                                    <div className="flex-1">
                                        <p className="font-medium">Backup იქმნება...</p>
                                        <div className="h-2 rounded-full bg-muted mt-2 overflow-hidden">
                                            <div className="h-full w-3/4 bg-blue-500 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {sampleBackups.map((backup) => (
                            <div key={backup.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                <HardDrive className="w-5 h-5 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">{backup.date}</p>
                                    <p className="text-xs text-muted-foreground">{backup.size}</p>
                                </div>
                                <Badge variant={backup.type === "auto" ? "secondary" : "default"}>
                                    {backup.type === "auto" ? "ავტო" : "manual"}
                                </Badge>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Broken Links */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <LinkIcon className="w-5 h-5 text-orange-500" />
                            გატეხილი ლინკები
                            {sampleBrokenLinks.length > 0 && (
                                <Badge variant="destructive">{sampleBrokenLinks.length}</Badge>
                            )}
                        </CardTitle>
                        <Button size="sm" variant="outline" onClick={checkLinks} disabled={isCheckingLinks}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${isCheckingLinks ? "animate-spin" : ""}`} />
                            სკანირება
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {isCheckingLinks && (
                            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                <div className="flex items-center gap-3">
                                    <RefreshCw className="w-5 h-5 text-orange-500 animate-spin" />
                                    <p className="font-medium">ლინკების შემოწმება...</p>
                                </div>
                            </div>
                        )}

                        {sampleBrokenLinks.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
                                <p>გატეხილი ლინკები არ მოიძებნა!</p>
                            </div>
                        ) : (
                            sampleBrokenLinks.map((link) => (
                                <div key={link.id} className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">{link.page}</p>
                                            <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="destructive">{link.status}</Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    შემოწმდა: {link.lastChecked}
                                                </span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-xs">
                                            გასწორება
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* System Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-indigo-500" />
                        სისტემის ინფორმაცია
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { label: "Next.js Version", value: "16.1.1" },
                            { label: "Node.js", value: "20.x" },
                            { label: "სისტემის თემა", value: "Light/Dark" },
                            { label: "ბოლო Deploy", value: "Dec 25, 2024" },
                        ].map((item) => (
                            <div key={item.label} className="p-4 rounded-lg bg-muted/30">
                                <p className="text-sm text-muted-foreground">{item.label}</p>
                                <p className="font-semibold mt-1">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Wrench, Database, Download, Upload, RefreshCw, Trash2, Link as LinkIcon,
    AlertTriangle, CheckCircle, Clock, HardDrive, Zap, Shield, FileJson,
    Calendar, Image, AlertCircle, Settings, Globe, Mail, ArrowRightLeft,
    Search, Play, Pause, Eye, EyeOff, Copy, Send, FileText, X, Plus
} from "lucide-react"

// === TYPES ===
interface BackupItem { id: string; date: string; size: string; type: "auto" | "manual" }
interface BrokenLink { id: string; page: string; url: string; status: number; lastChecked: string }
interface DBTable { name: string; rows: number; size: string }
interface CronJob { id: string; name: string; schedule: string; status: "active" | "paused"; lastRun: string; nextRun: string }
interface ErrorLog { id: string; level: "error" | "warning" | "info"; message: string; timestamp: string; file: string }
interface EnvVar { key: string; value: string; isSecret: boolean }
interface Redirect { id: string; from: string; to: string; type: 301 | 302; hits: number }
interface ImageItem { id: string; name: string; size: string; optimized: boolean }

// === SAMPLE DATA ===
const sampleBackups: BackupItem[] = [
    { id: "1", date: "2024-12-25 14:30", size: "2.4 MB", type: "manual" },
    { id: "2", date: "2024-12-24 00:00", size: "2.3 MB", type: "auto" },
]
const sampleBrokenLinks: BrokenLink[] = [
    { id: "1", page: "/blog/chatgpt-tips", url: "https://example.com/broken", status: 404, lastChecked: "2024-12-25" },
]
const sampleTables: DBTable[] = [
    { name: "users", rows: 1234, size: "2.1 MB" },
    { name: "posts", rows: 567, size: "8.4 MB" },
    { name: "comments", rows: 3456, size: "1.2 MB" },
    { name: "media", rows: 890, size: "156 MB" },
]
const sampleCronJobs: CronJob[] = [
    { id: "1", name: "Auto Backup", schedule: "0 0 * * *", status: "active", lastRun: "2024-12-28 00:00", nextRun: "2024-12-29 00:00" },
    { id: "2", name: "Sitemap Update", schedule: "0 */6 * * *", status: "active", lastRun: "2024-12-28 06:00", nextRun: "2024-12-28 12:00" },
    { id: "3", name: "Cache Cleanup", schedule: "0 3 * * 0", status: "paused", lastRun: "2024-12-22 03:00", nextRun: "-" },
]
const sampleErrorLogs: ErrorLog[] = [
    { id: "1", level: "error", message: "Failed to connect to database", timestamp: "2024-12-28 12:34:56", file: "db/connection.ts" },
    { id: "2", level: "warning", message: "Deprecated API endpoint called", timestamp: "2024-12-28 11:22:33", file: "api/legacy.ts" },
    { id: "3", level: "info", message: "User session expired", timestamp: "2024-12-28 10:11:22", file: "auth/session.ts" },
]
const sampleEnvVars: EnvVar[] = [
    { key: "DATABASE_URL", value: "postgresql://localhost:5432/db", isSecret: true },
    { key: "NEXT_PUBLIC_API_URL", value: "https://api.example.com", isSecret: false },
    { key: "JWT_SECRET", value: "super-secret-key-12345", isSecret: true },
]
const sampleRedirects: Redirect[] = [
    { id: "1", from: "/old-page", to: "/new-page", type: 301, hits: 234 },
    { id: "2", from: "/blog/old-post", to: "/articles/new-post", type: 301, hits: 567 },
    { id: "3", from: "/promo", to: "/sale", type: 302, hits: 89 },
]
const sampleImages: ImageItem[] = [
    { id: "1", name: "hero-banner.jpg", size: "2.4 MB", optimized: false },
    { id: "2", name: "product-1.png", size: "1.8 MB", optimized: false },
    { id: "3", name: "avatar.jpg", size: "856 KB", optimized: true },
]

export default function ToolsPage() {
    const [activeTab, setActiveTab] = React.useState("overview")
    const [isBackingUp, setIsBackingUp] = React.useState(false)
    const [isCheckingLinks, setIsCheckingLinks] = React.useState(false)
    const [isClearingCache, setIsClearingCache] = React.useState(false)
    const [isOptimizing, setIsOptimizing] = React.useState(false)
    const [isGeneratingSitemap, setIsGeneratingSitemap] = React.useState(false)
    const [isSendingEmail, setIsSendingEmail] = React.useState(false)
    const [showSecrets, setShowSecrets] = React.useState<Record<string, boolean>>({})
    const [searchQuery, setSearchQuery] = React.useState("")
    const [replaceQuery, setReplaceQuery] = React.useState("")
    const [logFilter, setLogFilter] = React.useState<"all" | "error" | "warning" | "info">("all")
    const [testEmail, setTestEmail] = React.useState("")
    const [newRedirect, setNewRedirect] = React.useState({ from: "", to: "", type: 301 as 301 | 302 })

    // Data from MongoDB
    const [backups, setBackups] = React.useState<BackupItem[]>([])
    const [redirects, setRedirects] = React.useState<Redirect[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    // Fetch backups and redirects from MongoDB
    React.useEffect(() => {
        async function fetchData() {
            try {
                const [backupsRes, redirectsRes] = await Promise.all([
                    fetch('/api/backups'),
                    fetch('/api/redirects')
                ])
                if (backupsRes.ok) {
                    const data = await backupsRes.json()
                    setBackups((data.backups || []).map((b: { id?: string; date?: string; size?: string; type?: string }) => ({
                        id: b.id || '',
                        date: b.date ? new Date(b.date).toLocaleString('ka-GE') : '',
                        size: b.size || '0 MB',
                        type: (b.type as 'auto' | 'manual') || 'manual'
                    })))
                }
                if (redirectsRes.ok) {
                    const data = await redirectsRes.json()
                    setRedirects((data.redirects || []).map((r: { id?: string; from?: string; to?: string; type?: number; hits?: number }) => ({
                        id: r.id || '',
                        from: r.from || '',
                        to: r.to || '',
                        type: (r.type as 301 | 302) || 301,
                        hits: r.hits || 0
                    })))
                }
            } catch (error) {
                console.error('Error fetching tools data:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    // Create backup via API
    const createBackup = async () => {
        setIsBackingUp(true)
        try {
            const res = await fetch('/api/backups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'manual', size: '2.5 MB', sizeBytes: 2621440 })
            })
            if (res.ok) {
                const data = await res.json()
                setBackups([{
                    id: data.backup.id,
                    date: new Date().toLocaleString('ka-GE'),
                    size: '2.5 MB',
                    type: 'manual'
                }, ...backups])
            }
        } catch (error) {
            console.error('Create backup error:', error)
        } finally {
            setIsBackingUp(false)
        }
    }

    // Delete backup via API
    const deleteBackup = async (id: string) => {
        try {
            const res = await fetch(`/api/backups/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setBackups(backups.filter(b => b.id !== id))
            }
        } catch (error) {
            console.error('Delete backup error:', error)
        }
    }

    // Add redirect via API
    const addRedirect = async () => {
        if (!newRedirect.from || !newRedirect.to) return
        try {
            const res = await fetch('/api/redirects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRedirect)
            })
            if (res.ok) {
                const data = await res.json()
                setRedirects([...redirects, { ...newRedirect, id: data.redirect.id, hits: 0 }])
                setNewRedirect({ from: "", to: "", type: 301 })
            }
        } catch (error) {
            console.error('Add redirect error:', error)
        }
    }

    // Delete redirect via API
    const deleteRedirect = async (id: string) => {
        try {
            const res = await fetch(`/api/redirects/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setRedirects(redirects.filter(r => r.id !== id))
            }
        } catch (error) {
            console.error('Delete redirect error:', error)
        }
    }

    const checkLinks = () => { setIsCheckingLinks(true); setTimeout(() => setIsCheckingLinks(false), 4000) }
    const clearCache = () => { setIsClearingCache(true); setTimeout(() => setIsClearingCache(false), 1500) }
    const optimizeImages = () => { setIsOptimizing(true); setTimeout(() => setIsOptimizing(false), 5000) }
    const generateSitemap = () => { setIsGeneratingSitemap(true); setTimeout(() => setIsGeneratingSitemap(false), 2000) }
    const sendTestEmail = () => { setIsSendingEmail(true); setTimeout(() => setIsSendingEmail(false), 2000) }

    const toggleSecret = (key: string) => setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }))

    // Additional state from API
    const [cronJobs, setCronJobs] = React.useState<CronJob[]>([])
    const [errorLogs, setErrorLogs] = React.useState<ErrorLog[]>([])

    // Fetch cron jobs and error logs from API
    React.useEffect(() => {
        async function fetchToolsData() {
            try {
                const [cronRes, logsRes] = await Promise.all([
                    fetch('/api/cron-jobs'),
                    fetch('/api/error-logs')
                ])
                if (cronRes.ok) {
                    const data = await cronRes.json()
                    setCronJobs((data.jobs || []).map((j: { id?: string; name?: string; schedule?: string; lastRun?: string; status?: string }) => ({
                        id: j.id || '',
                        name: j.name || '',
                        schedule: j.schedule || '',
                        lastRun: j.lastRun || '',
                        status: (j.status as 'active' | 'paused') || 'active'
                    })))
                }
                if (logsRes.ok) {
                    const data = await logsRes.json()
                    setErrorLogs((data.logs || []).map((l: { id?: string; level?: string; message?: string; time?: string; source?: string }) => ({
                        id: l.id || '',
                        level: (l.level as 'error' | 'warning' | 'info') || 'info',
                        message: l.message || '',
                        time: l.time || '',
                        source: l.source || 'system'
                    })))
                }
            } catch (error) {
                console.error('Error fetching tools data:', error)
            }
        }
        fetchToolsData()
    }, [])

    // Use API data if available, fallback to sample
    const displayCronJobs = cronJobs.length > 0 ? cronJobs : sampleCronJobs
    const displayErrorLogs = errorLogs.length > 0 ? errorLogs : sampleErrorLogs
    const filteredLogs = displayErrorLogs.filter(log => logFilter === "all" || log.level === logFilter)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Wrench className="w-8 h-8 text-indigo-500" />
                    სისტემური ინსტრუმენტები
                </h1>
                <p className="text-muted-foreground mt-1">Backup, cache, და სხვა ინსტრუმენტები</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="flex flex-wrap h-auto gap-1">
                    <TabsTrigger value="overview">მიმოხილვა</TabsTrigger>
                    <TabsTrigger value="database">Database</TabsTrigger>
                    <TabsTrigger value="import-export">Import/Export</TabsTrigger>
                    <TabsTrigger value="cron">Cron Jobs</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                    <TabsTrigger value="logs">Error Logs</TabsTrigger>
                    <TabsTrigger value="env">Environment</TabsTrigger>
                    <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
                    <TabsTrigger value="email">Email Test</TabsTrigger>
                    <TabsTrigger value="redirects">Redirects</TabsTrigger>
                    <TabsTrigger value="search-replace">Search/Replace</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-6">
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
                                {backups.map((backup) => (
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
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteBackup(backup.id)}><Trash2 className="w-4 h-4" /></Button>
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
                                    {sampleBrokenLinks.length > 0 && <Badge variant="destructive">{sampleBrokenLinks.length}</Badge>}
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
                                {sampleBrokenLinks.map((link) => (
                                    <div key={link.id} className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm">{link.page}</p>
                                                <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge variant="destructive">{link.status}</Badge>
                                                    <span className="text-xs text-muted-foreground">შემოწმდა: {link.lastChecked}</span>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="text-xs">გასწორება</Button>
                                        </div>
                                    </div>
                                ))}
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
                </TabsContent>

                {/* DATABASE TAB */}
                <TabsContent value="database" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="w-5 h-5 text-blue-500" />
                                Database Tables
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {sampleTables.map((table) => (
                                    <div key={table.name} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                            <Database className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">{table.name}</p>
                                            <p className="text-sm text-muted-foreground">{table.rows.toLocaleString()} rows • {table.size}</p>
                                        </div>
                                        <Button variant="outline" size="sm">Optimize</Button>
                                        <Button variant="outline" size="sm">Export</Button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex gap-3">
                                <Button><RefreshCw className="w-4 h-4 mr-2" />Optimize All</Button>
                                <Button variant="outline"><Trash2 className="w-4 h-4 mr-2" />Clear Orphaned Data</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* IMPORT/EXPORT TAB */}
                <TabsContent value="import-export" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Download className="w-5 h-5 text-green-500" />
                                    Export
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {["Posts", "Users", "Media", "Comments", "Settings"].map((item) => (
                                    <div key={item} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                        <span className="font-medium">{item}</span>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline"><FileJson className="w-4 h-4 mr-1" />JSON</Button>
                                            <Button size="sm" variant="outline"><FileText className="w-4 h-4 mr-1" />CSV</Button>
                                        </div>
                                    </div>
                                ))}
                                <Button className="w-full"><Download className="w-4 h-4 mr-2" />Export All Data</Button>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Upload className="w-5 h-5 text-orange-500" />
                                    Import
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                    <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                    <p className="font-medium">ფაილის ატვირთვა</p>
                                    <p className="text-sm text-muted-foreground mb-4">JSON ან CSV ფორმატი</p>
                                    <Button variant="outline">აირჩიეთ ფაილი</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* CRON JOBS TAB */}
                <TabsContent value="cron" className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-purple-500" />
                                Scheduled Tasks
                            </CardTitle>
                            <Button size="sm"><Plus className="w-4 h-4 mr-2" />Add Task</Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {sampleCronJobs.map((job) => (
                                <div key={job.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${job.status === "active" ? "bg-green-500/10" : "bg-gray-500/10"}`}>
                                        <Clock className={`w-5 h-5 ${job.status === "active" ? "text-green-500" : "text-gray-500"}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold">{job.name}</p>
                                            <Badge variant={job.status === "active" ? "default" : "secondary"}>{job.status}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-mono">{job.schedule}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Last: {job.lastRun} • Next: {job.nextRun}</p>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        {job.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    </Button>
                                    <Button variant="ghost" size="icon"><Settings className="w-4 h-4" /></Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* IMAGE OPTIMIZATION TAB */}
                <TabsContent value="images" className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Image className="w-5 h-5 text-pink-500" />
                                Image Optimization
                            </CardTitle>
                            <Button onClick={optimizeImages} disabled={isOptimizing}>
                                <RefreshCw className={`w-4 h-4 mr-2 ${isOptimizing ? "animate-spin" : ""}`} />
                                Optimize All
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {isOptimizing && (
                                <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
                                    <div className="flex items-center gap-3">
                                        <RefreshCw className="w-5 h-5 text-pink-500 animate-spin" />
                                        <div className="flex-1">
                                            <p className="font-medium">Optimizing images...</p>
                                            <div className="h-2 rounded-full bg-muted mt-2 overflow-hidden">
                                                <div className="h-full w-1/2 bg-pink-500 animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {sampleImages.map((img) => (
                                <div key={img.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                                        <Image className="w-6 h-6 text-pink-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{img.name}</p>
                                        <p className="text-sm text-muted-foreground">{img.size}</p>
                                    </div>
                                    {img.optimized ? (
                                        <Badge className="bg-green-500/10 text-green-500">Optimized</Badge>
                                    ) : (
                                        <Button size="sm" variant="outline">Optimize</Button>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ERROR LOGS TAB */}
                <TabsContent value="logs" className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                Error Logs
                            </CardTitle>
                            <div className="flex gap-2">
                                {(["all", "error", "warning", "info"] as const).map((level) => (
                                    <Button key={level} size="sm" variant={logFilter === level ? "default" : "outline"} onClick={() => setLogFilter(level)}>
                                        {level.charAt(0).toUpperCase() + level.slice(1)}
                                    </Button>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {filteredLogs.map((log) => (
                                <div key={log.id} className={`p-4 rounded-lg border ${log.level === "error" ? "bg-red-500/5 border-red-500/20" : log.level === "warning" ? "bg-yellow-500/5 border-yellow-500/20" : "bg-blue-500/5 border-blue-500/20"}`}>
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className={`w-5 h-5 flex-shrink-0 ${log.level === "error" ? "text-red-500" : log.level === "warning" ? "text-yellow-500" : "text-blue-500"}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium">{log.message}</p>
                                            <p className="text-sm text-muted-foreground mt-1">{log.file}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{log.timestamp}</p>
                                        </div>
                                        <Badge variant={log.level === "error" ? "destructive" : log.level === "warning" ? "outline" : "secondary"}>{log.level}</Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ENVIRONMENT VARIABLES TAB */}
                <TabsContent value="env" className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5 text-gray-500" />
                                Environment Variables
                            </CardTitle>
                            <Button size="sm"><Plus className="w-4 h-4 mr-2" />Add Variable</Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {sampleEnvVars.map((envVar) => (
                                <div key={envVar.key} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono font-semibold text-sm">{envVar.key}</p>
                                        <p className="font-mono text-sm text-muted-foreground truncate">
                                            {envVar.isSecret && !showSecrets[envVar.key] ? "••••••••••••" : envVar.value}
                                        </p>
                                    </div>
                                    {envVar.isSecret && (
                                        <Button variant="ghost" size="icon" onClick={() => toggleSecret(envVar.key)}>
                                            {showSecrets[envVar.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="icon"><Copy className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon"><Settings className="w-4 h-4" /></Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SITEMAP TAB */}
                <TabsContent value="sitemap" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-blue-500" />
                                    Sitemap.xml
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-lg bg-muted/30">
                                    <p className="text-sm text-muted-foreground">Last Generated</p>
                                    <p className="font-semibold">Dec 28, 2024 10:00</p>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/30">
                                    <p className="text-sm text-muted-foreground">Total URLs</p>
                                    <p className="font-semibold">156 pages</p>
                                </div>
                                <Button className="w-full" onClick={generateSitemap} disabled={isGeneratingSitemap}>
                                    <RefreshCw className={`w-4 h-4 mr-2 ${isGeneratingSitemap ? "animate-spin" : ""}`} />
                                    Regenerate Sitemap
                                </Button>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-green-500" />
                                    Robots.txt
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <textarea className="w-full h-48 p-3 rounded-lg bg-muted/30 font-mono text-sm resize-none" defaultValue={`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://example.com/sitemap.xml`} />
                                <Button className="w-full mt-4">Save Changes</Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* EMAIL TEST TAB */}
                <TabsContent value="email" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-cyan-500" />
                                Email Testing
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="p-4 rounded-lg bg-muted/30">
                                    <p className="text-sm text-muted-foreground">SMTP Status</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <p className="font-semibold text-green-500">Connected</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/30">
                                    <p className="text-sm text-muted-foreground">SMTP Server</p>
                                    <p className="font-semibold">smtp.gmail.com:587</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Send Test Email To:</label>
                                <div className="flex gap-2">
                                    <Input placeholder="email@example.com" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} />
                                    <Button onClick={sendTestEmail} disabled={isSendingEmail || !testEmail}>
                                        <Send className={`w-4 h-4 mr-2 ${isSendingEmail ? "animate-pulse" : ""}`} />
                                        Send
                                    </Button>
                                </div>
                            </div>
                            {isSendingEmail && (
                                <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                                    <div className="flex items-center gap-3">
                                        <RefreshCw className="w-5 h-5 text-cyan-500 animate-spin" />
                                        <p className="font-medium">Sending test email...</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* REDIRECTS TAB */}
                <TabsContent value="redirects" className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <ArrowRightLeft className="w-5 h-5 text-violet-500" />
                                URL Redirects
                            </CardTitle>
                            <Badge>{redirects.length} active</Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input placeholder="/old-url" value={newRedirect.from} onChange={(e) => setNewRedirect(prev => ({ ...prev, from: e.target.value }))} />
                                <ArrowRightLeft className="w-6 h-6 text-muted-foreground flex-shrink-0 self-center" />
                                <Input placeholder="/new-url" value={newRedirect.to} onChange={(e) => setNewRedirect(prev => ({ ...prev, to: e.target.value }))} />
                                <Button size="sm" variant={newRedirect.type === 301 ? "default" : "outline"} onClick={() => setNewRedirect(prev => ({ ...prev, type: 301 }))}>301</Button>
                                <Button size="sm" variant={newRedirect.type === 302 ? "default" : "outline"} onClick={() => setNewRedirect(prev => ({ ...prev, type: 302 }))}>302</Button>
                                <Button onClick={addRedirect}><Plus className="w-4 h-4" /></Button>
                            </div>
                            <div className="space-y-3">
                                {redirects.map((redirect) => (
                                    <div key={redirect.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-mono truncate">{redirect.from}</span>
                                                <ArrowRightLeft className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                <span className="font-mono truncate">{redirect.to}</span>
                                            </div>
                                        </div>
                                        <Badge variant="outline">{redirect.type}</Badge>
                                        <span className="text-sm text-muted-foreground">{redirect.hits} hits</span>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteRedirect(redirect.id)}><X className="w-4 h-4" /></Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SEARCH & REPLACE TAB */}
                <TabsContent value="search-replace" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="w-5 h-5 text-amber-500" />
                                Search & Replace
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Search for:</label>
                                    <Input placeholder="Text to find..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Replace with:</label>
                                    <Input placeholder="Replacement text..." value={replaceQuery} onChange={(e) => setReplaceQuery(e.target.value)} />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm">Posts</Button>
                                <Button variant="outline" size="sm">Pages</Button>
                                <Button variant="outline" size="sm">Comments</Button>
                                <Button variant="outline" size="sm">Media Titles</Button>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" disabled={!searchQuery}><Search className="w-4 h-4 mr-2" />Preview Results</Button>
                                <Button disabled={!searchQuery || !replaceQuery}><RefreshCw className="w-4 h-4 mr-2" />Replace All</Button>
                            </div>
                            {searchQuery && (
                                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                    <p className="font-medium">Preview: 23 matches found</p>
                                    <p className="text-sm text-muted-foreground mt-1">In 12 posts, 8 pages, 3 comments</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Search as SearchIcon,
    Globe,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ExternalLink,
    RefreshCw,
    TrendingUp,
    TrendingDown,
    FileText,
    Eye,
    Link as LinkIcon,
    Share2,
    Twitter,
    Facebook,
    Linkedin,
    FileCode,
    Image as ImageIcon,
    History,
    Settings,
    Plus,
    Trash2,
    Edit3,
    Save,
    RotateCcw,
    Copy,
    ArrowUp,
    ArrowDown,
    Minus,
    X
} from "lucide-react"
// Posts fetched from MongoDB API
import seoData from "@/data/seo-data.json"
import type {
    MetaTags,
    SitemapEntry,
    RobotsRule,
    KeywordTracking,
    CanonicalUrl,
    SchemaTemplate,
    BrokenLink,
    ImageAltIssue,
    SeoHistoryEntry
} from "@/types/seo-types"

interface SeoScore {
    title: number
    description: number
    keywords: number
    readability: number
    overall: number
}

interface PostData {
    id: string
    title: string
    slug: string
    excerpt: string
    tags: string[]
    featured: boolean
    readingTime: number
}

interface PostSeo {
    id: string
    title: string
    slug: string
    score: SeoScore
    issues: string[]
    suggestions: string[]
}

function calculateSeoScore(post: PostData): SeoScore {
    let titleScore = 100
    let descriptionScore = 100
    let keywordsScore = 100
    let readabilityScore = 100

    if (post.title.length < 30) titleScore -= 20
    if (post.title.length > 60) titleScore -= 15
    if (post.excerpt.length < 100) descriptionScore -= 25
    if (post.excerpt.length > 160) descriptionScore -= 10
    if (post.tags.length < 3) keywordsScore -= 30
    if (post.tags.length > 10) keywordsScore -= 10
    if (post.readingTime > 15) readabilityScore -= 20
    if (post.readingTime < 3) readabilityScore -= 15

    const overall = Math.round((titleScore + descriptionScore + keywordsScore + readabilityScore) / 4)
    return { title: titleScore, description: descriptionScore, keywords: keywordsScore, readability: readabilityScore, overall }
}

function getIssues(post: PostData): string[] {
    const issues: string[] = []
    if (post.title.length < 30) issues.push("სათაური ძალიან მოკლეა")
    if (post.title.length > 60) issues.push("სათაური ძალიან გრძელია")
    if (post.excerpt.length < 100) issues.push("აღწერა ძალიან მოკლეა")
    if (post.tags.length < 3) issues.push("ცოტა თეგია")
    return issues
}

function getSuggestions(post: PostData): string[] {
    const suggestions: string[] = []
    if (post.title.length < 50) suggestions.push("დაამატეთ მეტი კეყორდი სათაურში")
    if (!post.featured) suggestions.push("განიხილეთ featured სტატუსი")
    if (post.readingTime > 10) suggestions.push("განიხილეთ სტატიის დაყოფა")
    return suggestions
}

export default function SeoPage() {
    const [postsData, setPostsData] = React.useState<PostData[]>([])
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isAnalyzing, setIsAnalyzing] = React.useState(false)
    const [activeTab, setActiveTab] = React.useState("overview")

    // Fetch posts from MongoDB API
    React.useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch('/api/posts?limit=100')
                if (res.ok) {
                    const data = await res.json()
                    setPostsData((data.posts || []).map((p: PostData) => ({
                        id: p.id || p.slug,
                        title: p.title || '',
                        slug: p.slug || '',
                        excerpt: p.excerpt || '',
                        tags: p.tags || [],
                        featured: p.featured || false,
                        readingTime: p.readingTime || 5
                    })))
                }
            } catch (error) {
                console.error('Error fetching posts:', error)
            }
        }
        fetchPosts()
    }, [])

    // Fetch SEO settings from MongoDB API
    React.useEffect(() => {
        async function fetchSeoSettings() {
            try {
                const res = await fetch('/api/seo')
                if (res.ok) {
                    const data = await res.json()
                    const settings = data.settings || []
                    settings.forEach((s: { key: string; value: unknown }) => {
                        if (s.key === 'robotsRules' && Array.isArray(s.value)) setRobotsRules(s.value as RobotsRule[])
                        if (s.key === 'keywords' && Array.isArray(s.value)) setKeywords(s.value as KeywordTracking[])
                        if (s.key === 'metaTags' && Array.isArray(s.value)) setMetaTags(s.value as MetaTags[])
                    })
                }
            } catch (error) {
                console.error('Error fetching SEO settings:', error)
            }
        }
        fetchSeoSettings()
    }, [])

    // Meta Tags State
    const [metaTags, setMetaTags] = React.useState<MetaTags[]>(seoData.metaTags as MetaTags[])
    const [editingMeta, setEditingMeta] = React.useState<string | null>(null)

    // Sitemap State
    const [sitemapEntries, setSitemapEntries] = React.useState<SitemapEntry[]>(seoData.sitemap as SitemapEntry[])

    // Robots State
    const [robotsRules, setRobotsRules] = React.useState<RobotsRule[]>(seoData.robotsRules as RobotsRule[])
    const [newRobotRule, setNewRobotRule] = React.useState<{ userAgent: string; type: "allow" | "disallow"; path: string }>({ userAgent: "*", type: "disallow", path: "" })

    // Keywords State
    const [keywords, setKeywords] = React.useState<KeywordTracking[]>(seoData.keywords as KeywordTracking[])
    const [newKeyword, setNewKeyword] = React.useState("")

    // Canonical URLs State
    const [canonicalUrls] = React.useState<CanonicalUrl[]>(seoData.canonicalUrls as CanonicalUrl[])

    // Schema State
    const [schemaTemplates, setSchemaTemplates] = React.useState<SchemaTemplate[]>(seoData.schemaTemplates as unknown as SchemaTemplate[])
    const [selectedSchema, setSelectedSchema] = React.useState<string | null>(null)

    // Broken Links State
    const [brokenLinks, setBrokenLinks] = React.useState<BrokenLink[]>(seoData.brokenLinks as BrokenLink[])
    const [isScanning, setIsScanning] = React.useState(false)

    // Image Alt State
    const [imageAltIssues, setImageAltIssues] = React.useState<ImageAltIssue[]>(seoData.imageAltIssues as ImageAltIssue[])

    // History State
    const [seoHistory] = React.useState<SeoHistoryEntry[]>(seoData.seoHistory as SeoHistoryEntry[])

    // Social Preview State
    const [socialPlatform, setSocialPlatform] = React.useState<"facebook" | "twitter" | "linkedin">("facebook")
    const [selectedPost, setSelectedPost] = React.useState(metaTags[0])

    const postsWithSeo: PostSeo[] = postsData.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        score: calculateSeoScore(post),
        issues: getIssues(post),
        suggestions: getSuggestions(post)
    }))

    const filteredPosts = postsWithSeo.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const averageScore = postsWithSeo.length > 0
        ? Math.round(postsWithSeo.reduce((sum, p) => sum + p.score.overall, 0) / postsWithSeo.length)
        : 0

    const runAnalysis = () => {
        setIsAnalyzing(true)
        setTimeout(() => setIsAnalyzing(false), 2000)
    }

    const scanForBrokenLinks = () => {
        setIsScanning(true)
        setTimeout(() => setIsScanning(false), 3000)
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500"
        if (score >= 60) return "text-yellow-500"
        return "text-red-500"
    }

    const getScoreBg = (score: number) => {
        if (score >= 80) return "bg-green-500"
        if (score >= 60) return "bg-yellow-500"
        return "bg-red-500"
    }

    const getTrendIcon = (trend: string) => {
        if (trend === "up") return <ArrowUp className="w-4 h-4 text-green-500" />
        if (trend === "down") return <ArrowDown className="w-4 h-4 text-red-500" />
        return <Minus className="w-4 h-4 text-gray-400" />
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ok":
            case "good":
            case "fixed":
                return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">OK</Badge>
            case "warning":
            case "poor":
                return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Warning</Badge>
            case "error":
            case "broken":
            case "missing":
                return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Error</Badge>
            case "ignored":
                return <Badge variant="secondary">Ignored</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const addRobotRule = async () => {
        if (!newRobotRule.path) return
        const newRule: RobotsRule = {
            id: `robots-${Date.now()}`,
            userAgent: newRobotRule.userAgent,
            type: newRobotRule.type,
            path: newRobotRule.path,
            enabled: true
        }
        const updatedRules = [...robotsRules, newRule]
        setRobotsRules(updatedRules)
        setNewRobotRule({ userAgent: "*", type: "disallow", path: "" })
        // Save to API
        try {
            await fetch('/api/seo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'robotsRules', value: updatedRules, type: 'robots' })
            })
        } catch (error) {
            console.error('Save robots rules error:', error)
        }
    }

    const deleteRobotRule = async (id: string) => {
        const updatedRules = robotsRules.filter(r => r.id !== id)
        setRobotsRules(updatedRules)
        // Save to API
        try {
            await fetch('/api/seo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'robotsRules', value: updatedRules, type: 'robots' })
            })
        } catch (error) {
            console.error('Save robots rules error:', error)
        }
    }

    const addKeyword = () => {
        if (!newKeyword.trim()) return
        const kw: KeywordTracking = {
            id: `kw-${Date.now()}`,
            keyword: newKeyword,
            currentPosition: null,
            previousPosition: null,
            searchVolume: 0,
            difficulty: "medium",
            trend: "stable",
            lastChecked: new Date().toISOString(),
            history: []
        }
        setKeywords([...keywords, kw])
        setNewKeyword("")
    }

    const deleteKeyword = (id: string) => {
        setKeywords(keywords.filter(k => k.id !== id))
    }

    const fixImageAlt = (id: string) => {
        setImageAltIssues(issues =>
            issues.map(img => img.id === id ? { ...img, status: "fixed" as const, currentAlt: img.suggestedAlt } : img)
        )
    }

    const ignoreBrokenLink = (id: string) => {
        setBrokenLinks(links =>
            links.map(link => link.id === id ? { ...link, status: "ignored" as const } : link)
        )
    }

    const toggleSitemapEntry = (id: string) => {
        setSitemapEntries(entries =>
            entries.map(e => e.id === id ? { ...e, enabled: !e.enabled } : e)
        )
    }

    const toggleSchemaTemplate = (id: string) => {
        setSchemaTemplates(templates =>
            templates.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t)
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Globe className="w-8 h-8 text-indigo-500" />
                        SEO ანალიზატორი
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        კონტენტის ოპტიმიზაციის სრული მართვა
                    </p>
                </div>
                <Button onClick={runAnalysis} disabled={isAnalyzing} className="gap-2">
                    <RefreshCw className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`} />
                    {isAnalyzing ? "ანალიზი..." : "ხელახლა ანალიზი"}
                </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} defaultValue="overview" onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-11 w-full h-auto gap-1 bg-muted/50 p-1">
                    <TabsTrigger value="overview" className="text-xs px-2 py-1.5">Overview</TabsTrigger>
                    <TabsTrigger value="meta" className="text-xs px-2 py-1.5">Meta Tags</TabsTrigger>
                    <TabsTrigger value="social" className="text-xs px-2 py-1.5">Social</TabsTrigger>
                    <TabsTrigger value="sitemap" className="text-xs px-2 py-1.5">Sitemap</TabsTrigger>
                    <TabsTrigger value="robots" className="text-xs px-2 py-1.5">Robots.txt</TabsTrigger>
                    <TabsTrigger value="keywords" className="text-xs px-2 py-1.5">Keywords</TabsTrigger>
                    <TabsTrigger value="canonical" className="text-xs px-2 py-1.5">Canonical</TabsTrigger>
                    <TabsTrigger value="schema" className="text-xs px-2 py-1.5">Schema</TabsTrigger>
                    <TabsTrigger value="links" className="text-xs px-2 py-1.5">Links</TabsTrigger>
                    <TabsTrigger value="images" className="text-xs px-2 py-1.5">Images</TabsTrigger>
                    <TabsTrigger value="history" className="text-xs px-2 py-1.5">History</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6 mt-6">
                    {/* Stats Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">საშუალო Score</p>
                                        <p className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}%</p>
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl ${getScoreBg(averageScore)} text-white flex items-center justify-center`}>
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">გაანალიზებული</p>
                                        <p className="text-3xl font-bold">{postsData.length}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">პრობლემები</p>
                                        <p className="text-3xl font-bold text-red-500">
                                            {postsWithSeo.reduce((sum, p) => sum + p.issues.length, 0)}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-red-500 text-white flex items-center justify-center">
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Optimized</p>
                                        <p className="text-3xl font-bold text-green-500">
                                            {postsWithSeo.filter(p => p.score.overall >= 80).length}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-green-500 text-white flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-sm">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="ძიება..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Posts SEO List */}
                    <div className="space-y-4">
                        {filteredPosts.map((post) => (
                            <Card key={post.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${getScoreBg(post.score.overall)} text-white flex-shrink-0`}>
                                            {post.score.overall}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="font-semibold">{post.title}</h3>
                                                    <p className="text-sm text-muted-foreground">/{post.slug}</p>
                                                </div>
                                                <Button variant="ghost" size="icon" className="flex-shrink-0">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-4 gap-2 mt-4">
                                                {[
                                                    { label: "სათაური", value: post.score.title },
                                                    { label: "აღწერა", value: post.score.description },
                                                    { label: "Keywords", value: post.score.keywords },
                                                    { label: "წაკითხვადობა", value: post.score.readability },
                                                ].map((item) => (
                                                    <div key={item.label} className="text-center">
                                                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                            <div
                                                                className={`h-full ${getScoreBg(item.value)}`}
                                                                style={{ width: `${item.value}%` }}
                                                            />
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {(post.issues.length > 0 || post.suggestions.length > 0) && (
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {post.issues.map((issue, i) => (
                                                        <Badge key={i} variant="destructive" className="gap-1">
                                                            <XCircle className="w-3 h-3" />
                                                            {issue}
                                                        </Badge>
                                                    ))}
                                                    {post.suggestions.map((suggestion, i) => (
                                                        <Badge key={i} variant="secondary" className="gap-1">
                                                            <AlertTriangle className="w-3 h-3" />
                                                            {suggestion}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Meta Tags Tab */}
                <TabsContent value="meta" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Meta Tags მართვა
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {metaTags.map((meta) => (
                                <div key={meta.id} className="border rounded-lg p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold">{postsData.find(p => p.id === meta.postId)?.title || "Post"}</h3>
                                        <div className="flex gap-2">
                                            {editingMeta === meta.id ? (
                                                <>
                                                    <Button size="sm" onClick={() => setEditingMeta(null)}>
                                                        <Save className="w-4 h-4 mr-1" /> Save
                                                    </Button>
                                                    <Button size="sm" variant="ghost" onClick={() => setEditingMeta(null)}>
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button size="sm" variant="ghost" onClick={() => setEditingMeta(meta.id)}>
                                                    <Edit3 className="w-4 h-4 mr-1" /> Edit
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {editingMeta === meta.id ? (
                                        <div className="grid gap-4">
                                            <div>
                                                <label className="text-sm font-medium">Title</label>
                                                <Input
                                                    defaultValue={meta.title}
                                                    onChange={(e) => {
                                                        setMetaTags(tags => tags.map(t =>
                                                            t.id === meta.id ? { ...t, title: e.target.value } : t
                                                        ))
                                                    }}
                                                />
                                                <p className="text-xs text-muted-foreground mt-1">{meta.title.length}/60 სიმბოლო</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Description</label>
                                                <Textarea
                                                    defaultValue={meta.description}
                                                    onChange={(e) => {
                                                        setMetaTags(tags => tags.map(t =>
                                                            t.id === meta.id ? { ...t, description: e.target.value } : t
                                                        ))
                                                    }}
                                                />
                                                <p className="text-xs text-muted-foreground mt-1">{meta.description.length}/160 სიმბოლო</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Keywords</label>
                                                <Input
                                                    defaultValue={meta.keywords.join(", ")}
                                                    placeholder="keyword1, keyword2, keyword3"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Canonical URL</label>
                                                <Input defaultValue={meta.canonical} />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Robots</label>
                                                <Select defaultValue={meta.robots}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="index, follow">index, follow</SelectItem>
                                                        <SelectItem value="noindex, follow">noindex, follow</SelectItem>
                                                        <SelectItem value="index, nofollow">index, nofollow</SelectItem>
                                                        <SelectItem value="noindex, nofollow">noindex, nofollow</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid gap-2 text-sm">
                                            <div className="flex gap-2">
                                                <span className="text-muted-foreground w-24">Title:</span>
                                                <span className="truncate">{meta.title}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="text-muted-foreground w-24">Description:</span>
                                                <span className="truncate">{meta.description}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="text-muted-foreground w-24">Keywords:</span>
                                                <span>{meta.keywords.join(", ")}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="text-muted-foreground w-24">Canonical:</span>
                                                <span>{meta.canonical}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Social Preview Tab */}
                <TabsContent value="social" className="space-y-6 mt-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Share2 className="w-5 h-5" />
                                    Open Graph Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Select Post</label>
                                    <Select
                                        value={selectedPost.id}
                                        onValueChange={(v) => setSelectedPost(metaTags.find(m => m.id === v) || metaTags[0])}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {metaTags.map((meta) => (
                                                <SelectItem key={meta.id} value={meta.id}>
                                                    {postsData.find(p => p.id === meta.postId)?.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">OG Title</label>
                                    <Input defaultValue={selectedPost.ogTitle} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">OG Description</label>
                                    <Textarea defaultValue={selectedPost.ogDescription} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">OG Image URL</label>
                                    <Input defaultValue={selectedPost.ogImage} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Twitter Card Type</label>
                                    <Select defaultValue={selectedPost.twitterCard}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="summary">Summary</SelectItem>
                                            <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                                            <SelectItem value="app">App</SelectItem>
                                            <SelectItem value="player">Player</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button className="w-full">
                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="w-5 h-5" />
                                    Preview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2 mb-4">
                                    <Button
                                        size="sm"
                                        variant={socialPlatform === "facebook" ? "default" : "outline"}
                                        onClick={() => setSocialPlatform("facebook")}
                                    >
                                        <Facebook className="w-4 h-4 mr-1" /> Facebook
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={socialPlatform === "twitter" ? "default" : "outline"}
                                        onClick={() => setSocialPlatform("twitter")}
                                    >
                                        <Twitter className="w-4 h-4 mr-1" /> Twitter
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={socialPlatform === "linkedin" ? "default" : "outline"}
                                        onClick={() => setSocialPlatform("linkedin")}
                                    >
                                        <Linkedin className="w-4 h-4 mr-1" /> LinkedIn
                                    </Button>
                                </div>

                                {/* Social Preview Card */}
                                <div className="border rounded-lg overflow-hidden bg-card">
                                    <div className="aspect-video bg-muted flex items-center justify-center">
                                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                                    </div>
                                    <div className="p-4">
                                        <p className="text-xs text-muted-foreground uppercase">
                                            {socialPlatform === "facebook" ? "ANDREWALTAIR.GE" : socialPlatform === "twitter" ? "@andrewaltair" : "andrewaltair.ge"}
                                        </p>
                                        <h3 className="font-semibold mt-1 line-clamp-2">
                                            {socialPlatform === "twitter" ? selectedPost.twitterTitle : selectedPost.ogTitle}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                            {socialPlatform === "twitter" ? selectedPost.twitterDescription : selectedPost.ogDescription}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Sitemap Tab */}
                <TabsContent value="sitemap" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <FileCode className="w-5 h-5" />
                                    Sitemap.xml
                                </CardTitle>
                                <Button className="gap-2">
                                    <RefreshCw className="w-4 h-4" /> Regenerate
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {sitemapEntries.map((entry) => (
                                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                checked={entry.enabled}
                                                onCheckedChange={() => toggleSitemapEntry(entry.id)}
                                            />
                                            <div>
                                                <p className="font-medium">{entry.url}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Last modified: {entry.lastmod} | {entry.changefreq}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Select defaultValue={entry.priority.toString()}>
                                                <SelectTrigger className="w-24">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1].map((p) => (
                                                        <SelectItem key={p} value={p.toString()}>{p}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Badge variant={entry.enabled ? "default" : "secondary"}>
                                                {entry.enabled ? "Active" : "Disabled"}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Robots.txt Tab */}
                <TabsContent value="robots" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Robots.txt Editor
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Add new rule */}
                            <div className="flex gap-2 p-4 border rounded-lg bg-muted/30">
                                <Select value={newRobotRule.userAgent} onValueChange={(v) => setNewRobotRule({ ...newRobotRule, userAgent: v })}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="*">*</SelectItem>
                                        <SelectItem value="Googlebot">Googlebot</SelectItem>
                                        <SelectItem value="Bingbot">Bingbot</SelectItem>
                                        <SelectItem value="GPTBot">GPTBot</SelectItem>
                                        <SelectItem value="Claude-Web">Claude-Web</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={newRobotRule.type} onValueChange={(v: "allow" | "disallow") => setNewRobotRule({ ...newRobotRule, type: v })}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="allow">Allow</SelectItem>
                                        <SelectItem value="disallow">Disallow</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    placeholder="/path"
                                    value={newRobotRule.path}
                                    onChange={(e) => setNewRobotRule({ ...newRobotRule, path: e.target.value })}
                                    className="flex-1"
                                />
                                <Button onClick={addRobotRule}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Rules list */}
                            <div className="space-y-2">
                                {robotsRules.map((rule) => (
                                    <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                checked={rule.enabled}
                                                onCheckedChange={() => {
                                                    setRobotsRules(rules => rules.map(r =>
                                                        r.id === rule.id ? { ...r, enabled: !r.enabled } : r
                                                    ))
                                                }}
                                            />
                                            <Badge variant="outline">{rule.userAgent}</Badge>
                                            <Badge className={rule.type === "allow" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                                                {rule.type}
                                            </Badge>
                                            <span className="font-mono text-sm">{rule.path}</span>
                                        </div>
                                        <Button size="icon" variant="ghost" onClick={() => deleteRobotRule(rule.id)}>
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {/* Preview */}
                            <div className="mt-6">
                                <h4 className="font-medium mb-2">Preview</h4>
                                <pre className="p-4 bg-muted rounded-lg text-sm font-mono overflow-x-auto">
                                    {robotsRules.filter(r => r.enabled).map(r => `User-agent: ${r.userAgent}\n${r.type === "allow" ? "Allow" : "Disallow"}: ${r.path}`).join("\n\n")}

                                    Sitemap: https://andrewaltair.ge/sitemap.xml
                                </pre>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Keywords Tab */}
                <TabsContent value="keywords" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Keyword Tracking
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add keyword..."
                                        value={newKeyword}
                                        onChange={(e) => setNewKeyword(e.target.value)}
                                        className="w-48"
                                    />
                                    <Button onClick={addKeyword}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {keywords.map((kw) => (
                                    <div key={kw.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                {getTrendIcon(kw.trend)}
                                                <span className="font-medium">{kw.keyword}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold">{kw.currentPosition || "-"}</p>
                                                <p className="text-xs text-muted-foreground">Position</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm">{kw.searchVolume.toLocaleString()}</p>
                                                <p className="text-xs text-muted-foreground">Volume</p>
                                            </div>
                                            <Badge className={
                                                kw.difficulty === "easy" ? "bg-green-500/20 text-green-400" :
                                                    kw.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                                                        "bg-red-500/20 text-red-400"
                                            }>
                                                {kw.difficulty}
                                            </Badge>
                                            <Button size="icon" variant="ghost" onClick={() => deleteKeyword(kw.id)}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Canonical URLs Tab */}
                <TabsContent value="canonical" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LinkIcon className="w-5 h-5" />
                                Canonical URLs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {canonicalUrls.map((url) => (
                                    <div key={url.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium">{url.pageUrl}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Canonical: {url.canonicalUrl}
                                            </p>
                                            {url.hasDuplicate && url.duplicateUrls && (
                                                <p className="text-sm text-yellow-500 mt-1">
                                                    ⚠️ Duplicates: {url.duplicateUrls.join(", ")}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(url.status)}
                                            <Button size="icon" variant="ghost">
                                                <Edit3 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Schema Tab */}
                <TabsContent value="schema" className="space-y-6 mt-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileCode className="w-5 h-5" />
                                    Schema Templates
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {schemaTemplates.map((template) => (
                                        <div
                                            key={template.id}
                                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${selectedSchema === template.id ? "border-primary bg-primary/5" : ""}`}
                                            onClick={() => setSelectedSchema(template.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    checked={template.enabled}
                                                    onCheckedChange={() => toggleSchemaTemplate(template.id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <div>
                                                    <p className="font-medium">{template.name}</p>
                                                    <Badge variant="outline">{template.type}</Badge>
                                                </div>
                                            </div>
                                            <Badge variant={template.enabled ? "default" : "secondary"}>
                                                {template.enabled ? "Active" : "Disabled"}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="w-5 h-5" />
                                    JSON-LD Preview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="p-4 bg-muted rounded-lg text-sm font-mono overflow-x-auto max-h-96">
                                    {selectedSchema ?
                                        JSON.stringify(schemaTemplates.find(t => t.id === selectedSchema)?.schema, null, 2) :
                                        "Select a template to preview"
                                    }
                                </pre>
                                <Button className="w-full mt-4" disabled={!selectedSchema}>
                                    <Copy className="w-4 h-4 mr-2" /> Copy to Clipboard
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Broken Links Tab */}
                <TabsContent value="links" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <LinkIcon className="w-5 h-5" />
                                    Broken Links Checker
                                </CardTitle>
                                <Button onClick={scanForBrokenLinks} disabled={isScanning}>
                                    <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? "animate-spin" : ""}`} />
                                    {isScanning ? "Scanning..." : "Scan Now"}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {brokenLinks.map((link) => (
                                    <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="destructive">{link.statusCode}</Badge>
                                                <p className="font-medium truncate">{link.targetUrl}</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                From: {link.sourceUrl} | Anchor: "{link.anchorText}"
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(link.status)}
                                            {link.status !== "ignored" && link.status !== "fixed" && (
                                                <>
                                                    <Button size="sm" variant="outline" onClick={() => ignoreBrokenLink(link.id)}>
                                                        Ignore
                                                    </Button>
                                                    <Button size="sm">Fix</Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Images Tab */}
                <TabsContent value="images" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="w-5 h-5" />
                                Image ALT Text Analyzer
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                                <Card className="bg-red-500/10 border-red-500/20">
                                    <CardContent className="p-4 text-center">
                                        <p className="text-3xl font-bold text-red-500">
                                            {imageAltIssues.filter(i => i.status === "missing").length}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Missing ALT</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-yellow-500/10 border-yellow-500/20">
                                    <CardContent className="p-4 text-center">
                                        <p className="text-3xl font-bold text-yellow-500">
                                            {imageAltIssues.filter(i => i.status === "poor").length}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Poor Quality</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-green-500/10 border-green-500/20">
                                    <CardContent className="p-4 text-center">
                                        <p className="text-3xl font-bold text-green-500">
                                            {imageAltIssues.filter(i => i.status === "good" || i.status === "fixed").length}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Good/Fixed</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-2">
                                {imageAltIssues.map((img) => (
                                    <div key={img.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                                                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{img.imageName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Current: {img.currentAlt || "(empty)"}
                                                </p>
                                                {img.suggestedAlt && (
                                                    <p className="text-sm text-green-500">
                                                        Suggested: {img.suggestedAlt}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(img.status)}
                                            {(img.status === "missing" || img.status === "poor") && (
                                                <Button size="sm" onClick={() => fixImageAlt(img.id)}>
                                                    Apply Fix
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="w-5 h-5" />
                                SEO Changes History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {seoHistory.map((entry) => (
                                    <div key={entry.id} className="flex items-start gap-4 p-4 border rounded-lg">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${entry.action === "create" ? "bg-green-500/20 text-green-500" :
                                            entry.action === "update" ? "bg-blue-500/20 text-blue-500" :
                                                "bg-red-500/20 text-red-500"
                                            }`}>
                                            {entry.action === "create" ? <Plus className="w-5 h-5" /> :
                                                entry.action === "update" ? <Edit3 className="w-5 h-5" /> :
                                                    <Trash2 className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{entry.type}</Badge>
                                                <span className="font-medium">{entry.target}</span>
                                            </div>
                                            <div className="mt-2 space-y-1">
                                                {entry.changes.map((change, i) => (
                                                    <p key={i} className="text-sm">
                                                        <span className="text-muted-foreground">{change.field}:</span>{" "}
                                                        {change.oldValue && <span className="line-through text-red-400">{change.oldValue}</span>}
                                                        {change.oldValue && " → "}
                                                        <span className="text-green-400">{change.newValue}</span>
                                                    </p>
                                                ))}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {entry.user} • {new Date(entry.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                        <Button size="sm" variant="ghost">
                                            <RotateCcw className="w-4 h-4 mr-1" /> Restore
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Search as SearchIcon,
    Globe,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ExternalLink,
    RefreshCw,
    TrendingUp,
    FileText,
    Eye,
    Link as LinkIcon
} from "lucide-react"
import postsData from "@/data/posts.json"

interface SeoScore {
    title: number
    description: number
    keywords: number
    readability: number
    overall: number
}

interface PostSeo {
    id: string
    title: string
    slug: string
    score: SeoScore
    issues: string[]
    suggestions: string[]
}

function calculateSeoScore(post: (typeof postsData)[0]): SeoScore {
    let titleScore = 100
    let descriptionScore = 100
    let keywordsScore = 100
    let readabilityScore = 100

    // Title checks
    if (post.title.length < 30) titleScore -= 20
    if (post.title.length > 60) titleScore -= 15

    // Description (excerpt) checks
    if (post.excerpt.length < 100) descriptionScore -= 25
    if (post.excerpt.length > 160) descriptionScore -= 10

    // Keywords (tags) checks
    if (post.tags.length < 3) keywordsScore -= 30
    if (post.tags.length > 10) keywordsScore -= 10

    // Readability
    if (post.readingTime > 15) readabilityScore -= 20
    if (post.readingTime < 3) readabilityScore -= 15

    const overall = Math.round((titleScore + descriptionScore + keywordsScore + readabilityScore) / 4)

    return { title: titleScore, description: descriptionScore, keywords: keywordsScore, readability: readabilityScore, overall }
}

function getIssues(post: (typeof postsData)[0]): string[] {
    const issues: string[] = []
    if (post.title.length < 30) issues.push("სათაური ძალიან მოკლეა")
    if (post.title.length > 60) issues.push("სათაური ძალიან გრძელია")
    if (post.excerpt.length < 100) issues.push("აღწერა ძალიან მოკლეა")
    if (post.tags.length < 3) issues.push("ცოტა თეგია")
    return issues
}

function getSuggestions(post: (typeof postsData)[0]): string[] {
    const suggestions: string[] = []
    if (post.title.length < 50) suggestions.push("დაამატეთ მეტი კეყორდი სათაურში")
    if (!post.featured) suggestions.push("განიხილეთ featured სტატუსი")
    if (post.readingTime > 10) suggestions.push("განიხილეთ სტატიის დაყოფა")
    return suggestions
}

export default function SeoPage() {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isAnalyzing, setIsAnalyzing] = React.useState(false)

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

    const averageScore = Math.round(postsWithSeo.reduce((sum, p) => sum + p.score.overall, 0) / postsWithSeo.length)

    const runAnalysis = () => {
        setIsAnalyzing(true)
        setTimeout(() => setIsAnalyzing(false), 2000)
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
                        კონტენტის ოპტიმიზაციის ანალიზი
                    </p>
                </div>
                <Button onClick={runAnalysis} disabled={isAnalyzing} className="gap-2">
                    <RefreshCw className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`} />
                    {isAnalyzing ? "ანალიზი..." : "ხელახლა ანალიზი"}
                </Button>
            </div>

            {/* Overview */}
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
                                {/* Score Circle */}
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${getScoreBg(post.score.overall)} text-white flex-shrink-0`}>
                                    {post.score.overall}
                                </div>

                                {/* Content */}
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

                                    {/* Score Breakdown */}
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

                                    {/* Issues & Suggestions */}
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
        </div>
    )
}

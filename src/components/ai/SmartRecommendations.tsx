"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { Sparkles, ArrowRight, Eye, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Post {
    id: string
    slug: string
    title: string
    excerpt: string
    category: string
    views: number
    readingTime: number
    tags: string[]
}

interface SmartRecommendationsProps {
    currentPostId: string
    currentTags: string[]
    allPosts: Post[]
    limit?: number
    className?: string
}

// Simple tag-based recommendation algorithm
function getRecommendations(
    currentId: string,
    currentTags: string[],
    allPosts: Post[],
    limit: number
): Post[] {
    // Filter out current post
    const otherPosts = allPosts.filter((p) => p.id !== currentId)

    // Score posts based on tag overlap and popularity
    const scored = otherPosts.map((post) => {
        const tagOverlap = post.tags.filter((tag) =>
            currentTags.includes(tag)
        ).length
        const popularityScore = Math.log10(post.views + 1)

        return {
            post,
            score: tagOverlap * 10 + popularityScore,
        }
    })

    // Sort by score and return top N
    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((s) => s.post)
}

export function SmartRecommendations({
    currentPostId,
    currentTags,
    allPosts,
    limit = 3,
    className,
}: SmartRecommendationsProps) {
    const recommendations = getRecommendations(
        currentPostId,
        currentTags,
        allPosts,
        limit
    )

    if (recommendations.length === 0) return null

    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-bold">შენთვის რეკომენდირებული</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                {recommendations.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                        <Card className="h-full hover-lift card-shine">
                            <CardContent className="p-4">
                                <Badge variant="secondary" className="mb-2 text-xs">
                                    {post.category}
                                </Badge>
                                <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                    {post.title}
                                </h4>
                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        {post.views.toLocaleString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {post.readingTime} წთ
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}

// "Based on what you read" section
export function RelatedByHistory({
    viewedPostIds,
    allPosts,
    limit = 4,
    className,
}: {
    viewedPostIds: string[]
    allPosts: Post[]
    limit?: number
    className?: string
}) {
    // Get tags from viewed posts
    const viewedPosts = allPosts.filter((p) => viewedPostIds.includes(p.id))
    const viewedTags = [...new Set(viewedPosts.flatMap((p) => p.tags))]

    // Get recommendations excluding already viewed
    const otherPosts = allPosts.filter((p) => !viewedPostIds.includes(p.id))

    const scored = otherPosts.map((post) => {
        const tagOverlap = post.tags.filter((tag) => viewedTags.includes(tag)).length
        return { post, score: tagOverlap }
    })

    const recommendations = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((s) => s.post)

    if (recommendations.length === 0) return null

    return (
        <div className={cn("rounded-xl border bg-card p-6", className)}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="font-bold">შენ რომ წაიკითხე...</h3>
                </div>
                <Link
                    href="/blog"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                    ყველა
                    <ArrowRight className="h-3 w-3" />
                </Link>
            </div>

            <div className="space-y-3">
                {recommendations.map((post, index) => (
                    <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="flex items-start gap-3 group"
                    >
                        <span className="text-xl opacity-20 font-bold">
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                            <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                {post.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                                {post.tags.slice(0, 2).join(" • ")}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

// "Continue reading" for interrupted sessions
export function ContinueReading({
    lastReadId,
    lastReadProgress,
    post,
    className,
}: {
    lastReadId: string
    lastReadProgress: number
    post: Post
    className?: string
}) {
    if (!lastReadId || lastReadProgress >= 90) return null

    return (
        <Link href={`/blog/${post.slug}`}>
            <div
                className={cn(
                    "rounded-xl border bg-gradient-to-r from-primary/10 to-accent/10 p-4 flex items-center gap-4 hover:from-primary/20 hover:to-accent/20 transition-colors",
                    className
                )}
            >
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                        {Math.round(lastReadProgress)}%
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">გააგრძელე კითხვა</p>
                    <p className="font-medium truncate">{post.title}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
        </Link>
    )
}

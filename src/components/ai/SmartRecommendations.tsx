"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { Sparkles, ArrowRight, Eye, Clock, MessageCircle, Share2, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedCard, StaggerContainer } from "@/components/ui/animated"

interface Post {
    id: string
    slug: string
    title: string
    excerpt: string
    category: string
    views: number
    comments: number
    shares: number
    readingTime: number
    tags: string[]
    reactions: Record<string, number>
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
        <div className={cn("space-y-6", className)}>
            <AnimatedCard animation="fade-right">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    <h3 className="font-bold text-lg">შენთვის რეკომენდირებული</h3>
                </div>
            </AnimatedCard>

            <StaggerContainer className="grid gap-6 sm:grid-cols-3">
                {recommendations.map((post, index) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                        <Card className="h-full hover-lift card-shine border-0 shadow-lg bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group overflow-hidden">
                            <CardContent className="p-5 flex flex-col h-full">
                                <Badge variant="secondary" className="w-fit mb-3 text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                    {post.category}
                                </Badge>

                                <h4 className="font-bold leading-tight mb-auto group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h4>

                                {/* Stats Row */}
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            {post.views > 1000 ? (post.views / 1000).toFixed(1) + 'K' : post.views}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {post.readingTime} წთ
                                        </span>
                                    </div>
                                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                                </div>
                            </CardContent>

                            {/* Hover gradient line */}
                            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent w-0 group-hover:w-full transition-all duration-500 ease-out" />
                        </Card>
                    </Link>
                ))}
            </StaggerContainer>
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

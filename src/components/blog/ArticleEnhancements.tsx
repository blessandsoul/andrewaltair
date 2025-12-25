"use client"

import { useState } from "react"
import { ReadingProgress } from "@/components/interactive/ReadingProgress"
import { BookmarkButton } from "@/components/interactive/BookmarkSystem"
import { MiniNarrator } from "@/components/ai/ArticleNarrator"
import { TLDRSummary } from "@/components/ai/TLDRSummary"
import { TableOfContents } from "@/components/interactive/TableOfContents"
import { HighlightShare } from "@/components/interactive/HighlightShare"
import { PageVisitorCounter } from "@/components/interactive/LiveVisitorCounter"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, List } from "lucide-react"

interface ArticleEnhancementsProps {
    postId: string
    postTitle: string
    postSlug: string
    postExcerpt: string
    summary?: string
    keyPoints?: string[]
    readingTime?: number
    content?: string
}

// Floating article tools sidebar
export function ArticleToolsSidebar({
    postId,
    postTitle,
    postSlug,
    postExcerpt,
    content = "",
}: ArticleEnhancementsProps) {
    const [showTOC, setShowTOC] = useState(false)

    return (
        <>
            {/* Floating sidebar on left */}
            <div className="hidden xl:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
                <BookmarkButton
                    id={postId}
                    slug={postSlug}
                    title={postTitle}
                    excerpt={postExcerpt}
                    className="h-10 w-10 rounded-full bg-card border shadow-lg flex items-center justify-center hover:bg-secondary transition-colors"
                    showLabel={false}
                />

                <button
                    onClick={() => setShowTOC(!showTOC)}
                    className="h-10 w-10 rounded-full bg-card border shadow-lg flex items-center justify-center hover:bg-secondary transition-colors"
                    title="სარჩევი"
                >
                    <List className="h-4 w-4" />
                </button>

                <MiniNarrator
                    content={content}
                    className="h-10 w-10 rounded-full bg-card border shadow-lg flex items-center justify-center"
                />
            </div>

            {/* TOC Popup */}
            {showTOC && (
                <div className="fixed left-16 top-1/2 -translate-y-1/2 z-50 w-64 animate-in slide-in-from-left-4">
                    <Card className="shadow-xl">
                        <CardContent className="p-4">
                            <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                                <List className="h-4 w-4" />
                                სარჩევი
                            </h4>
                            <TableOfContents selector="article" />
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    )
}

// TL;DR block for article header
export function ArticleTLDRBlock({
    summary,
    keyPoints,
    readingTime,
}: {
    summary: string
    keyPoints?: string[]
    readingTime?: number
}) {
    return (
        <div className="my-8">
            <TLDRSummary
                summary={summary}
                keyPoints={keyPoints}
                readingTime={readingTime}
            />
        </div>
    )
}

// Article header enhancements (visitor count + reading time)
export function ArticleHeaderEnhancements({ postSlug }: { postSlug: string }) {
    return (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <PageVisitorCounter pageSlug={postSlug} />
        </div>
    )
}

// Progress bar wrapper
export function ArticleProgressBar() {
    return <ReadingProgress position="top" color="gradient" height={3} showPercentage={false} />
}

// Full article wrapper that combines all features
export function ArticleWrapper({
    children,
    postId,
    postTitle,
    postSlug,
    postExcerpt,
    content,
}: ArticleEnhancementsProps & { children: React.ReactNode }) {
    return (
        <>
            {/* Reading progress bar */}
            <ArticleProgressBar />

            {/* Highlight-to-share popup */}
            <HighlightShare />

            {/* Floating tools sidebar */}
            <ArticleToolsSidebar
                postId={postId}
                postTitle={postTitle}
                postSlug={postSlug}
                postExcerpt={postExcerpt}
                content={content}
            />

            {/* Article content */}
            {children}
        </>
    )
}

// Quick action buttons (mobile-friendly)
export function ArticleQuickActions({
    postId,
    postTitle,
    postSlug,
    postExcerpt,
    content = "",
}: ArticleEnhancementsProps) {
    return (
        <div className="flex items-center gap-2 xl:hidden">
            <BookmarkButton
                id={postId}
                slug={postSlug}
                title={postTitle}
                excerpt={postExcerpt}
                showLabel={true}
            />
            <MiniNarrator content={content} />
        </div>
    )
}

// Reading stats card
export function ReadingStatsCard({
    readingTime,
    wordCount,
    views,
}: {
    readingTime: number
    wordCount?: number
    views: number
}) {
    return (
        <Card className="bg-secondary/50">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">⏱️</span>
                            <span className="font-medium ml-1">{readingTime} წთ</span>
                        </div>
                        {wordCount && (
                            <div>
                                <span className="text-muted-foreground">📝</span>
                                <span className="font-medium ml-1">{wordCount.toLocaleString()} სიტყვა</span>
                            </div>
                        )}
                        <div>
                            <span className="text-muted-foreground">👀</span>
                            <span className="font-medium ml-1">{views.toLocaleString()}</span>
                        </div>
                    </div>
                    <Badge variant="outline" className="gap-1">
                        <Sparkles className="h-3 w-3" />
                        AI გაანალიზებული
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}

// Generate TL;DR from content (mock - in real app would use AI API)
export function generateTLDR(content: string, title: string) {
    // Mock implementation - in real app, call AI API
    const cleanContent = content.replace(/<[^>]*>/g, "")
    const sentences = cleanContent.split(/[.!?]+/).filter(Boolean)

    const summary = sentences.slice(0, 2).join(". ").trim() + "."

    const keyPoints = [
        "ძირითადი კონცეფციები ახსნილია მარტივად",
        "პრაქტიკული მაგალითები და რჩევები",
        "შემდგომი ნაბიჯები და რესურსები",
    ]

    return { summary, keyPoints }
}

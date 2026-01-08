"use client"

import * as React from "react"
import Link from "next/link"
import { TbRoute, TbCircleCheck, TbCircle, TbLock, TbChevronRight, TbClock, TbBook } from "react-icons/tb"
import { Badge } from "@/components/ui/badge"

interface Article {
    slug: string
    title: string
    isFree: boolean
    estimatedMinutes?: number
}

interface LearningPathProps {
    sectionSlug: string
    articles: Article[]
    readArticles?: string[]
}

export function LearningPath({ sectionSlug, articles, readArticles = [] }: LearningPathProps) {
    // Find current article index (first unread)
    const currentIndex = articles.findIndex(a => !readArticles.includes(a.slug))

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <TbRoute className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">სწავლის გზა</h3>
                <Badge variant="secondary">
                    {readArticles.length}/{articles.length}
                </Badge>
            </div>

            <div className="relative">
                {/* Progress line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
                <div
                    className="absolute left-4 top-0 w-0.5 bg-primary transition-all duration-500"
                    style={{
                        height: `${(readArticles.length / articles.length) * 100}%`
                    }}
                />

                {/* Articles */}
                <div className="space-y-2">
                    {articles.map((article, index) => {
                        const isRead = readArticles.includes(article.slug)
                        const isCurrent = index === currentIndex
                        const isLocked = !article.isFree && !isRead

                        return (
                            <Link
                                key={article.slug}
                                href={`/encyclopedia/${sectionSlug}/${article.slug}`}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-all relative ${isCurrent
                                        ? 'bg-primary/10 border border-primary/30'
                                        : 'hover:bg-muted/50'
                                    }`}
                            >
                                {/* Status icon */}
                                <div className={`relative z-10 flex-shrink-0 ${isRead ? 'text-green-500' : isCurrent ? 'text-primary' : 'text-muted-foreground'
                                    }`}>
                                    {isRead ? (
                                        <TbCircleCheck className="w-6 h-6" />
                                    ) : (
                                        <TbCircle className="w-6 h-6" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-medium truncate ${isRead ? 'text-muted-foreground' : ''
                                            }`}>
                                            {article.title}
                                        </span>
                                        {isLocked && (
                                            <TbLock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                        )}
                                    </div>
                                    {article.estimatedMinutes && (
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <TbClock className="w-3 h-3" />
                                            {article.estimatedMinutes} წთ
                                        </span>
                                    )}
                                </div>

                                {/* Arrow */}
                                <TbChevronRight className={`w-5 h-5 flex-shrink-0 ${isCurrent ? 'text-primary' : 'text-muted-foreground'
                                    }`} />
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Completion message */}
            {readArticles.length === articles.length && (
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-center">
                    <TbBook className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <p className="font-medium text-green-600 dark:text-green-400">
                        🎉 სექცია დასრულებულია!
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        შეგიძლია მიიღო სერტიფიკატი
                    </p>
                </div>
            )}
        </div>
    )
}

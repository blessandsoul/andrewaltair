"use client"

import Link from "next/link"
import Image from "next/image"
import { TbArrowRight, TbExternalLink, TbFlame, TbEye } from "react-icons/tb"
import { Badge } from "@/components/ui/badge"

interface Insight {
    id: string
    slug: string
    content: string
    excerpt: string
    sourceUrl: string
    sourceTitle: string
    sourceDomain: string
    sourceImage: string
    tags: string[]
    publishedAt: string
    views: number
    reactions: {
        fire: number
        love: number
        mindblown: number
        applause: number
        insightful: number
    }
}

interface InsightsSectionProps {
    insights: Insight[]
}

export function InsightsSection({ insights }: InsightsSectionProps) {
    if (!insights.length) return null

    const totalReactions = (r: Insight['reactions']) =>
        r.fire + r.love + r.mindblown + r.applause + r.insightful

    return (
        <section className="space-y-8">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-headline font-bold text-on-surface">Insights</h2>
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold">
                        მოკლე ანალიტიკა
                    </Badge>
                </div>
                <Link
                    href="/insights"
                    className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
                >
                    ყველა <TbArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {insights.slice(0, 4).map((insight) => (
                    <Link
                        key={insight.id}
                        href={`/insights/${insight.slug}`}
                        className="group"
                    >
                        <article className="flex gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all">
                            {/* Source image thumbnail */}
                            {insight.sourceImage && (
                                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-muted">
                                    <Image
                                        src={insight.sourceImage}
                                        alt={insight.sourceTitle || 'Source'}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        sizes="96px"
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                    {/* Text preview */}
                                    <p className="text-sm text-foreground leading-snug line-clamp-3 group-hover:text-primary/90 transition-colors">
                                        {insight.content.slice(0, 150)}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-2">
                                        {/* Domain */}
                                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                            <TbExternalLink className="w-3 h-3" />
                                            {insight.sourceDomain}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                        {totalReactions(insight.reactions) > 0 && (
                                            <span className="flex items-center gap-0.5">
                                                <TbFlame className="w-3 h-3" />
                                                {totalReactions(insight.reactions)}
                                            </span>
                                        )}
                                        {insight.views > 0 && (
                                            <span className="flex items-center gap-0.5">
                                                <TbEye className="w-3 h-3" />
                                                {insight.views}
                                            </span>
                                        )}
                                        {/* Tags */}
                                        {insight.tags.length > 0 && (
                                            <span className="text-primary/60 font-medium">
                                                #{insight.tags[0]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </section>
    )
}

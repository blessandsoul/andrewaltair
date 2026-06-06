import Link from "next/link"
import { TbMessage2, TbExternalLink } from "react-icons/tb"

import { ForumLikeStack, type ForumLiker } from "@/components/forum/ForumLikeStack"

export interface ForumTopicCardData {
    id: string
    slug: string
    titleKa: string
    summaryKa: string
    sourceImage?: string
    sourceDomain?: string
    postCount?: number
    likedBy?: ForumLiker[]
}

/** Topic card for the /forum grid and the home teaser. */
export function ForumTopicCard({ topic }: { topic: ForumTopicCardData }) {
    return (
        <Link
            href={`/forum/${topic.slug}`}
            className="group block bg-card rounded-2xl border border-border/40 overflow-hidden hover:shadow-lg transition-shadow"
        >
            <div className="relative aspect-video bg-muted overflow-hidden">
                {topic.sourceImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={topic.sourceImage}
                        alt={topic.titleKa}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary-container/20" />
                )}
                {topic.likedBy && topic.likedBy.length > 0 && (
                    <div className="absolute bottom-2 left-2">
                        <ForumLikeStack likedBy={topic.likedBy} size="xs" max={4} overlay showCount={false} />
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
                    {topic.titleKa}
                </h3>
                <p className="mt-1.5 text-sm text-on-surface-variant line-clamp-2">{topic.summaryKa}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-on-surface-variant">
                    <span className="inline-flex items-center gap-1">
                        <TbMessage2 className="w-4 h-4" />
                        {topic.postCount || 0} მოსაზრება
                    </span>
                    {topic.sourceDomain && (
                        <span className="inline-flex items-center gap-1 truncate">
                            <TbExternalLink className="w-3.5 h-3.5 shrink-0" />
                            {topic.sourceDomain}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default ForumTopicCard

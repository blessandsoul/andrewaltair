"use client"

import Link from "next/link"
import { TbSparkles, TbEye, TbHeart } from "react-icons/tb"

interface RelatedPost {
    id: string
    slug: string
    title: string
    views: number
    reactions: Record<string, number>
}

interface InlineRelatedPostsProps {
    posts: RelatedPost[]
    className?: string
}

export function InlineRelatedPosts({ posts, className = "" }: InlineRelatedPostsProps) {
    if (!posts || posts.length === 0) return null

    return (
        <div className={`my-12 p-6 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 rounded-2xl border border-primary/20 ${className}`}>
            <div className="flex items-center gap-2 mb-4">
                <TbSparkles className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-lg">შეიძლება დაგაინტერესოთ</h4>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                {posts.slice(0, 2).map((post) => (
                    <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group block p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border hover:border-primary/50 transition-all hover:shadow-lg"
                    >
                        <p className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <TbEye className="w-3.5 h-3.5" />
                                {post.views?.toLocaleString() || 0}
                            </span>
                            <span className="flex items-center gap-1 text-red-500">
                                <TbHeart className="w-3.5 h-3.5" />
                                {(Object.values(post.reactions || {}) as number[]).reduce((a, b) => a + b, 0)}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default InlineRelatedPosts

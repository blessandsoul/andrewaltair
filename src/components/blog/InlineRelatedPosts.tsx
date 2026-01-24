"use client"

import Link from "next/link"
import Image from "next/image"
import { TbSparkles, TbEye, TbHeart, TbMessage, TbShare } from "react-icons/tb"

interface RelatedPost {
    id: string
    slug: string
    title: string
    views: number
    comments?: number
    shares?: number
    reactions: Record<string, number>
    coverImage?: string
    coverImages?: {
        horizontal?: string
        vertical?: string
    }
}

interface InlineRelatedPostsProps {
    posts: RelatedPost[]
    className?: string
}

// Format numbers for display
function formatNumber(num: number): string {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
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
                {posts.slice(0, 2).map((post) => {
                    const coverImage = post.coverImages?.horizontal || post.coverImage
                    const totalReactions = (Object.values(post.reactions || {}) as number[]).reduce((a, b) => a + b, 0)

                    return (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group block overflow-hidden bg-card/50 backdrop-blur-sm rounded-xl border border-border hover:border-primary/50 transition-all hover:shadow-lg"
                        >
                            {/* Image Container with Stats Overlay */}
                            <div className="relative aspect-[16/9] overflow-hidden">
                                {coverImage ? (
                                    <Image
                                        src={coverImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                                        <TbSparkles className="w-10 h-10 text-muted-foreground/30" />
                                    </div>
                                )}

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Stats Badge Overlay */}
                                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center z-10">
                                    <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-[10px] font-medium shadow-lg">
                                        <div className="flex items-center gap-1" title="ნახვები">
                                            <TbEye className="w-3.5 h-3.5 text-blue-400" />
                                            <span>{formatNumber(post.views || 0)}</span>
                                        </div>
                                        <div className="flex items-center gap-1" title="მოწონებები">
                                            <TbHeart className="w-3.5 h-3.5 text-red-400" />
                                            <span>{formatNumber(totalReactions)}</span>
                                        </div>
                                        <div className="flex items-center gap-1" title="კომენტარები">
                                            <TbMessage className="w-3.5 h-3.5 text-green-400" />
                                            <span>{formatNumber(post.comments || 0)}</span>
                                        </div>
                                        <div className="flex items-center gap-1" title="გაზიარება">
                                            <TbShare className="w-3.5 h-3.5 text-orange-400" />
                                            <span>{formatNumber(post.shares || 0)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <div className="p-4">
                                <p className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                    {post.title}
                                </p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default InlineRelatedPosts

"use client"

import Link from "next/link"
import Image from "next/image"
import { TbArrowRight, TbClock } from "react-icons/tb"
import { PerspectiveTag } from "@/components/ui/PerspectiveTag"
import { formatRelativeDate, getCategoryInfo } from "@/lib/blog-utils"

interface Post {
  id: string
  title: string
  excerpt?: string
  coverImage?: string
  category?: string
  publishedAt?: string
  readingTime?: number
}

interface ArticlesSectionProps {
  posts: Post[]
}

export function ArticlesSection({ posts }: ArticlesSectionProps) {
  if (!posts.length) return null

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-headline font-bold text-on-surface">სტატიები</h2>
        <Link
          href="/blog"
          className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          View All <TbArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post) => {
          const categoryInfo = post.category ? getCategoryInfo(post.category) : null

          return (
            <Link key={post.id} href={`/blog/${post.id}`} className="group">
              <article className="bg-card rounded-xl overflow-hidden border border-border/20 h-full hover:border-border/50 transition-colors">
                {/* Image */}
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20" />
                  )}
                  {categoryInfo && (
                    <div className="absolute top-3 left-3">
                      <PerspectiveTag>{categoryInfo.name}</PerspectiveTag>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant mb-3">
                    {post.publishedAt && (
                      <span>{formatRelativeDate(post.publishedAt)}</span>
                    )}
                    {post.readingTime && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <TbClock className="w-3.5 h-3.5" />
                          {post.readingTime} წთ
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="font-semibold text-on-surface leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </article>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

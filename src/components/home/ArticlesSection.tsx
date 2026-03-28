"use client"

import Link from "next/link"
import Image from "next/image"
import { TbArrowRight, TbRobot, TbAtom, TbBook, TbNews, TbCpu, TbTrendingUp, TbBuildingBank, TbBriefcase, TbUsers, TbSchool, TbWorld, TbFileText } from "react-icons/tb"
import { getCategoryInfo, formatRelativeDate } from "@/lib/blog-utils"

interface Post {
  id: string
  slug: string
  title: string
  excerpt?: string
  coverImage?: string
  category?: string
  publishedAt?: string
}

interface ArticlesSectionProps {
  posts: Post[]
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Bot: TbRobot,
  Atom: TbAtom,
  Book: TbBook,
  News: TbNews,
  Cpu: TbCpu,
  TrendingUp: TbTrendingUp,
  Landmark: TbBuildingBank,
  Briefcase: TbBriefcase,
  Users: TbUsers,
  GraduationCap: TbSchool,
  Globe: TbWorld,
  FileText: TbFileText,
}

export function ArticlesSection({ posts }: ArticlesSectionProps) {
  if (!posts.length) return null

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-headline font-bold text-on-surface">უახლესი სტატიები</h2>
        <Link
          href="/blog"
          className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          ყველა <TbArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.slice(0, 3).map((post) => {
          const categoryInfo = post.category ? getCategoryInfo(post.category) : null
          const IconComponent = categoryInfo?.icon ? (CATEGORY_ICONS[categoryInfo.icon] ?? TbFileText) : TbFileText

          return (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <article className="flex flex-col gap-4">
                {/* Image */}
                <div className="aspect-video overflow-hidden rounded-xl bg-muted relative">
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

                  {/* Top-right: category icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10">
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>

                  {/* Bottom: date overlay */}
                  {post.publishedAt && (
                    <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-linear-to-t from-black/70 to-transparent">
                      <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
                        {formatRelativeDate(post.publishedAt)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold leading-tight text-on-surface group-hover:text-primary transition-colors">
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

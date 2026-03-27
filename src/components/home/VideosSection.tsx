"use client"

import Link from "next/link"
import Image from "next/image"
import { TbArrowRight, TbPlayerPlay, TbEye, TbVideo } from "react-icons/tb"
import { Badge } from "@/components/ui/badge"
import { formatNumber } from "@/lib/blog-utils"

interface Video {
  id: string
  youtubeId?: string
  title: string
  duration?: string
  views?: number
}

interface VideosSectionProps {
  videos: Video[]
}

export function VideosSection({ videos }: VideosSectionProps) {
  if (!videos.length) return null

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-headline font-bold text-on-surface">ვიდეოები</h2>
        <Link
          href="/videos"
          className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          View All <TbArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
        <div className="flex gap-4" style={{ width: "max-content" }}>
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`/videos/${video.id}`}
              className="group min-w-[320px] bg-card rounded-xl overflow-hidden border border-border/30 hover:-translate-y-1 transition-transform"
            >
              <div className="relative aspect-video bg-muted">
                {video.youtubeId && (
                  <Image
                    src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TbPlayerPlay className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </div>
                {video.duration && (
                  <Badge className="absolute bottom-2 right-2 bg-black/70 text-white border-0 text-xs">
                    {video.duration}
                  </Badge>
                )}
              </div>

              <div className="p-3">
                <h3 className="font-medium text-sm text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                {video.views !== undefined && (
                  <div className="flex items-center gap-1 text-xs text-on-surface-variant mt-2">
                    <TbEye className="w-3.5 h-3.5" />
                    {formatNumber(video.views)}
                  </div>
                )}
              </div>
            </Link>
          ))}

          {/* View all card */}
          <Link
            href="/videos"
            className="min-w-[200px] bg-primary/5 rounded-xl border border-primary/20 flex flex-col items-center justify-center gap-3 p-6 hover:bg-primary/10 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TbVideo className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-semibold text-primary text-center">View all videos</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

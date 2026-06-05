"use client"

import Link from "next/link"
import Image from "next/image"
import { TbArrowRight, TbPlayerPlay } from "react-icons/tb"
import { formatNumber } from "@/lib/blog-utils"
import { PersonaLikeStack } from "@/components/ai/PersonaLikeStack"

interface Video {
  id: string
  youtubeId?: string
  title: string
  duration?: string
  views?: number
  category?: string
  likedBy?: { personaId: string; name: string }[]
}

interface VideosSectionProps {
  videos: Video[]
}

export function VideosSection({ videos }: VideosSectionProps) {
  if (!videos.length) return null

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-headline font-bold text-on-surface">ვიდეო გაკვეთილები</h2>
        <Link
          href="/videos"
          className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          ყველა <TbArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
        <div className="flex gap-6 pb-2" style={{ width: "max-content" }}>
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`/videos/${video.id}`}
              className="group min-w-80 space-y-3"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                {video.youtubeId && (
                  <Image
                    src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                    <TbPlayerPlay className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </div>
                {video.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded font-bold">
                    {video.duration}
                  </span>
                )}
                {video.likedBy && video.likedBy.length > 0 && (
                  <div className="absolute top-2 left-2 z-10">
                    <PersonaLikeStack likedBy={video.likedBy} overlay size="xs" max={3} showCount={false} />
                  </div>
                )}
              </div>
              <h4 className="font-bold text-sm line-clamp-2 text-on-surface group-hover:text-primary transition-colors">
                {video.title}
              </h4>
              {video.views !== undefined && (
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                  {video.category ? `${video.category} • ` : ""}{formatNumber(video.views)} ნახვა
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

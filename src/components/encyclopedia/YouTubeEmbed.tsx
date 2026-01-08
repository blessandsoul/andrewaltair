"use client"

import * as React from "react"

interface YouTubeEmbedProps {
    videoId: string
    title?: string
}

export function YouTubeEmbed({ videoId, title = "YouTube Video" }: YouTubeEmbedProps) {
    const [isLoaded, setIsLoaded] = React.useState(false)
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

    if (!isLoaded) {
        return (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
                <img
                    src={thumbnailUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback to hqdefault if maxresdefault not available
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                    }}
                />
                <button
                    onClick={() => setIsLoaded(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors"
                    aria-label={`Play ${title}`}
                >
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </button>
            </div>
        )
    }

    return (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
            />
        </div>
    )
}

// Parse YouTube URL to get video ID
export function getYouTubeVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
        /youtube\.com\/embed\/([^?&\s]+)/,
        /youtube\.com\/v\/([^?&\s]+)/,
    ]

    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
    }

    return null
}

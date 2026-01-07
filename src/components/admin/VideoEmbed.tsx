"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TbVideo, TbPlus, TbTrash, TbExternalLink, TbLoader2 } from "react-icons/tb"

export interface VideoData {
    url: string
    platform: 'youtube' | 'vimeo'
    thumbnailUrl?: string
    videoId?: string
}

interface VideoEmbedProps {
    videos: VideoData[]
    onChange: (videos: VideoData[]) => void
}

// Parse YouTube/Vimeo URL and extract video ID
function parseVideoUrl(url: string): { platform: 'youtube' | 'vimeo'; videoId: string } | null {
    // YouTube patterns
    const youtubePatterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
        /youtube\.com\/shorts\/([^&\s?]+)/
    ]

    for (const pattern of youtubePatterns) {
        const match = url.match(pattern)
        if (match) {
            return { platform: 'youtube', videoId: match[1] }
        }
    }

    // Vimeo patterns
    const vimeoPatterns = [
        /vimeo\.com\/(\d+)/,
        /player\.vimeo\.com\/video\/(\d+)/
    ]

    for (const pattern of vimeoPatterns) {
        const match = url.match(pattern)
        if (match) {
            return { platform: 'vimeo', videoId: match[1] }
        }
    }

    return null
}

// Fetch thumbnail URL async
async function fetchThumbnail(platform: 'youtube' | 'vimeo', videoId: string): Promise<string> {
    if (platform === 'youtube') {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }
    if (platform === 'vimeo') {
        try {
            const response = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`)
            const data = await response.json()
            return data[0]?.thumbnail_large || ''
        } catch (e) {
            console.error('Vimeo thumbnail fetch error:', e)
            return ''
        }
    }
    return ''
}

// Video Thumbnail Component with Fallback
interface VideoThumbnailProps {
    video: VideoData
    className?: string
}

function VideoThumbnail({ video, className }: VideoThumbnailProps) {
    const [imgSrc, setImgSrc] = React.useState<string>(video.thumbnailUrl || '')
    const [error, setError] = React.useState(false)

    React.useEffect(() => {
        setImgSrc(video.thumbnailUrl || '')
        setError(false)
    }, [video.thumbnailUrl])

    if (error || !imgSrc) {
        return (
            <div className={`w-full h-full flex items-center justify-center bg-muted ${className}`}>
                <TbVideo className="w-8 h-8 text-muted-foreground" />
            </div>
        )
    }

    return (
        <img
            src={imgSrc}
            alt="Video thumbnail"
            className={`w-full h-full object-cover ${className}`}
            onError={() => {
                // If maxresdefault failed, try hqdefault
                if (imgSrc.includes('maxresdefault')) {
                    setImgSrc(imgSrc.replace('maxresdefault', 'hqdefault'))
                } else {
                    setError(true)
                }
            }}
        />
    )
}

export function VideoEmbed({ videos, onChange }: VideoEmbedProps) {
    const [newUrl, setNewUrl] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [previewVideo, setPreviewVideo] = React.useState<number | null>(null)

    const handleAddVideo = async () => {
        if (!newUrl.trim()) return

        setIsLoading(true)
        setError(null)

        const parsed = parseVideoUrl(newUrl)
        if (!parsed) {
            setError("არასწორი URL. მხარდაჭერილია YouTube და Vimeo")
            setIsLoading(false)
            return
        }

        // Fetch thumbnail
        const thumbnail = await fetchThumbnail(parsed.platform, parsed.videoId)

        const newVideo: VideoData = {
            url: newUrl,
            platform: parsed.platform,
            videoId: parsed.videoId,
            thumbnailUrl: thumbnail
        }

        onChange([...videos, newVideo])
        setNewUrl("")
        setIsLoading(false)
    }

    const handleRemoveVideo = (index: number) => {
        onChange(videos.filter((_, i) => i !== index))
        if (previewVideo === index) setPreviewVideo(null)
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                    <TbVideo className="w-4 h-4" />
                    ვიდეოები ({videos.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Add video input */}
                <div className="flex gap-2">
                    <Input
                        placeholder="YouTube ან Vimeo URL..."
                        value={newUrl}
                        onChange={(e) => {
                            setNewUrl(e.target.value)
                            setError(null)
                        }}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddVideo())}
                        className="text-xs"
                    />
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddVideo}
                        disabled={isLoading || !newUrl.trim()}
                    >
                        {isLoading ? (
                            <TbLoader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <TbPlus className="w-4 h-4" />
                        )}
                    </Button>
                </div>

                {error && (
                    <p className="text-xs text-red-500">{error}</p>
                )}

                {/* Video list */}
                {videos.length > 0 && (
                    <div className="space-y-2">
                        {videos.map((video, idx) => (
                            <div
                                key={idx}
                                className="border rounded-lg overflow-hidden"
                            >
                                {/* Preview toggle */}
                                {previewVideo === idx ? (
                                    <div className="aspect-video relative bg-black">
                                        <iframe
                                            src={video.platform === 'youtube'
                                                ? `https://www.youtube.com/embed/${video.videoId}`
                                                : `https://player.vimeo.com/video/${video.videoId}`}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="relative aspect-video bg-muted cursor-pointer group"
                                        onClick={() => setPreviewVideo(idx)}
                                    >
                                        <VideoThumbnail video={video} />

                                        {/* Play overlay */}
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                                                <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-black ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Video info bar */}
                                <div className="p-2 bg-muted/30 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${video.platform === 'youtube'
                                            ? 'bg-red-500/20 text-red-500'
                                            : 'bg-blue-500/20 text-blue-500'
                                            }`}>
                                            {video.platform === 'youtube' ? 'YouTube' : 'Vimeo'}
                                        </span>
                                        <span className="text-muted-foreground truncate max-w-[150px]">
                                            {video.videoId}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => window.open(video.url, '_blank')}
                                        >
                                            <TbExternalLink className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-red-500 hover:text-red-600"
                                            onClick={() => handleRemoveVideo(idx)}
                                        >
                                            <TbTrash className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {videos.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                        დაამატეთ YouTube ან Vimeo ვიდეო
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

export default VideoEmbed

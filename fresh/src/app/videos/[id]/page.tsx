import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft,
    Eye,
    Calendar,
    Clock,
    ThumbsUp,
    Share2,
    Sparkles,
    Play
} from "lucide-react"
import { Comments } from "@/components/interactive/Comments"
import { ShareButtons } from "@/components/interactive/ShareButtons"
import { ReactionBar } from "@/components/interactive/ReactionBar"
import { brand } from "@/lib/brand"

// Fetch video from MongoDB API
async function getVideo(id: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/videos?limit=50`, {
            cache: 'no-store'
        })
        if (res.ok) {
            const data = await res.json()
            return (data.videos || []).find((v: { id?: string, youtubeId: string }) => v.id === id || v.youtubeId === id)
        }
    } catch (error) {
        console.error('Error fetching video:', error)
    }
    return null
}

// Get related videos from MongoDB
async function getRelatedVideos(currentId: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/videos?limit=5`, {
            cache: 'no-store'
        })
        if (res.ok) {
            const data = await res.json()
            return (data.videos || []).filter((v: { id?: string, youtubeId: string }) => v.id !== currentId && v.youtubeId !== currentId).slice(0, 4)
        }
    } catch (error) {
        console.error('Error fetching related videos:', error)
    }
    return []
}



export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const video = await getVideo(id)

    if (!video) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold">ვიდეო ვერ მოიძებნა</h1>
                    <p className="text-muted-foreground">
                        სამწუხაროდ, მოთხოვნილი ვიდეო არ არსებობს.
                    </p>
                    <Button asChild>
                        <Link href="/videos">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            ვიდეოებზე დაბრუნება
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    const relatedVideos = await getRelatedVideos(id)

    // Sample reactions
    const reactions = {
        fire: 234,
        love: 156,
        mindblown: 89,
        applause: 67,
        insightful: 123
    }

    return (
        <div className="min-h-screen">
            {/* Video Player Section */}
            <section className="pt-4 pb-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    {/* Back Button */}
                    <Link
                        href="/videos"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        ვიდეოებზე დაბრუნება
                    </Link>

                    {/* Video Player */}
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
                        <iframe
                            src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                        />
                    </div>

                    {/* Video Info */}
                    <div className="mt-6 space-y-4">
                        {/* Category & Stats */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                                {video.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {video.publishedAt}
                            </span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {video.duration}
                            </span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {video.views.toLocaleString()} ნახვა
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                            {video.title}
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-muted-foreground">
                            {video.description}
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-4 pt-4 border-t border-border">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold">Andrew Altair</div>
                                <div className="text-sm text-muted-foreground">AI ინოვატორი და კონტენტ კრეატორი</div>
                            </div>
                            <Button variant="default" className="gap-2">
                                <ThumbsUp className="w-4 h-4" />
                                გამოწერა
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reactions & Share & Comments */}
            <section className="py-8 border-t border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content - Reactions & Comments */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Reactions */}
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-4">რეაქციები</h4>
                                <ReactionBar reactions={reactions} size="lg" />
                            </div>

                            {/* Share */}
                            <ShareButtons
                                url={`https://andrewaltair.ge/videos/${video.id}`}
                                title={video.title}
                                description={video.description}
                            />

                            {/* Comments */}
                            <Comments postId={video.id} className="pt-8 border-t border-border" />
                        </div>

                        {/* Sidebar - Related Videos */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg">მსგავსი ვიდეოები</h3>
                            <div className="space-y-4">
                                {relatedVideos.map((relatedVideo) => (
                                    <Link key={relatedVideo.id} href={`/videos/${relatedVideo.id}`}>
                                        <Card className="hover:bg-secondary/50 transition-colors border shadow-sm mb-4">
                                            <CardContent className="p-4 flex gap-4">
                                                {/* Thumbnail */}
                                                <div className="relative w-36 aspect-video rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                                                    <img
                                                        src={`https://img.youtube.com/vi/${relatedVideo.youtubeId}/mqdefault.jpg`}
                                                        alt={relatedVideo.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                                                        <Play className="w-8 h-8 text-white" />
                                                    </div>
                                                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                                                        {relatedVideo.duration}
                                                    </span>
                                                </div>
                                                {/* Info */}
                                                <div className="flex-1 min-w-0 space-y-2">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {relatedVideo.category}
                                                    </Badge>
                                                    <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary">
                                                        {relatedVideo.title}
                                                    </h4>
                                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-3 h-3" />
                                                            {relatedVideo.views.toLocaleString()}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {relatedVideo.duration}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {relatedVideo.publishedAt}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subscribe CTA */}
            <section className="py-12 relative overflow-hidden">
                <div className="absolute inset-0 animated-gradient opacity-90"></div>
                <div className="absolute inset-0 noise-overlay"></div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center text-white">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">მოგეწონა ვიდეო?</h2>
                        <p className="text-white/80">
                            გამოიწერე YouTube არხი და მიიღე ახალი AI ვიდეოები პირველმა
                        </p>
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                            <a href="https://youtube.com/@AndrewAltair" target="_blank" rel="noopener noreferrer">
                                <Play className="w-4 h-4 mr-2" />
                                YouTube გამოწერა
                            </a>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

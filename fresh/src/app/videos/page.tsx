import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Play,
    Youtube,
    Eye,
    Clock,
    Sparkles,
    ArrowRight,
    Send,
    Mail,
    TrendingUp,
    Zap,
    Heart,
    Bookmark
} from "lucide-react"
import { brand } from "@/lib/brand"
import Image from "next/image"

// Fetch videos from MongoDB API
async function getVideos() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl}/api/videos?limit=50`, {
            cache: 'no-store'
        })
        if (!res.ok) throw new Error('Failed to fetch videos')
        const data = await res.json()
        return data.videos || []
    } catch (error) {
        console.error('Error fetching videos:', error)
        return []
    }
}

// Helper to format numbers
function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

export default async function VideosPage() {
    const videosData = await getVideos()
    const longVideos = videosData.filter((v: any) => v.type === 'long')
    const shortVideos = videosData.filter((v: any) => v.type === 'short')

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative py-20 lg:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-red-500/5">
                    <div className="absolute inset-0 noise-overlay"></div>
                </div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <Badge variant="secondary" className="px-4 py-2">
                            <Youtube className="w-3 h-3 mr-2 text-red-500" />
                            ვიდეო კონტენტი
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            <span className="text-gradient">AI ტუტორიალები და მიმოხილვები</span>
                        </h1>

                        <p className="text-xl text-muted-foreground">
                            ხელოვნური ინტელექტის შესახებ ვიდეო გზამკვლევები, შედარებები და პრაქტიკული რჩევები
                        </p>

                        <div className="flex gap-4 justify-center pt-4">
                            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white glow-sm" asChild>
                                <Link href={brand.social.youtube} target="_blank">
                                    <Youtube className="w-5 h-5 mr-2" />
                                    YouTube არხი
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline">
                                <TrendingUp className="w-5 h-5 mr-2" />
                                {formatNumber(longVideos.reduce((a, v) => a + v.views, 0))} ნახვა
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Shorts Section */}
            <section className="py-16 bg-card border-y border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">მოკლე ვიდეოები</h2>
                                <p className="text-muted-foreground">60 წამში AI ხრიკები</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {shortVideos.map((video) => (
                            <Link
                                key={video.id}
                                href={`/videos/${video.id}`}
                            >
                                <Card className="group border-0 shadow-lg bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]">
                                    <CardContent className="p-0">
                                        <div className="relative aspect-[9/16] overflow-hidden rounded-xl">
                                            {/* YouTube Thumbnail */}
                                            <Image
                                                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                                alt={video.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />

                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />

                                            {/* Play button */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40">
                                                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                                                </div>
                                            </div>

                                            {/* Shorts badge */}
                                            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-red-500 text-white border-0 text-xs">
                                                <Zap className="w-3 h-3 mr-1" />
                                                Shorts
                                            </Badge>

                                            {/* Duration badge */}
                                            <Badge className="absolute top-2 right-2 bg-black/70 text-white border-0 text-xs backdrop-blur-sm">
                                                {video.duration}
                                            </Badge>

                                            {/* Content overlay */}
                                            <div className="absolute bottom-0 inset-x-0 p-3">
                                                <h4 className="font-bold text-white text-sm line-clamp-2 mb-1">
                                                    {video.title}
                                                </h4>
                                                <div className="flex items-center gap-2 text-white/80 text-xs">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-3 h-3" />
                                                        {formatNumber(video.views)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="w-3 h-3 text-red-400" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Long Videos */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                                <Youtube className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">სრული ვიდეოები</h2>
                                <p className="text-muted-foreground">დეტალური ტუტორიალები და მიმოხილვები</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {longVideos.map((video) => (
                            <Link
                                key={video.id}
                                href={`/videos/${video.id}`}
                            >
                                <Card className="group h-full border-0 shadow-xl bg-card transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                                    <CardContent className="p-0">
                                        <div className="relative aspect-video overflow-hidden">
                                            {/* YouTube Thumbnail */}
                                            <Image
                                                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                                alt={video.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />

                                            {/* Dark overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                            {/* Play Button */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl shadow-red-500/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-red-500/50">
                                                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                                                </div>
                                            </div>

                                            {/* Duration Badge */}
                                            <Badge className="absolute bottom-3 right-3 bg-black/80 text-white border-0 backdrop-blur-sm">
                                                {video.duration}
                                            </Badge>

                                            {/* Category Badge */}
                                            <Badge className="absolute top-3 left-3 bg-red-600/90 text-white border-0 backdrop-blur-sm">
                                                {video.category}
                                            </Badge>

                                            {/* Views on image */}
                                            <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/90 text-sm">
                                                <Eye className="w-4 h-4" />
                                                {formatNumber(video.views)}
                                            </div>
                                        </div>

                                        <div className="p-5 space-y-3">
                                            <h3 className="font-bold text-lg group-hover:text-red-500 transition-colors line-clamp-2">
                                                {video.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {video.description}
                                            </p>

                                            {/* Bottom row */}
                                            <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {video.duration}
                                                    </span>
                                                    <span>{video.publishedAt}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Heart className="w-4 h-4 text-red-500 hover:scale-125 transition-transform cursor-pointer" />
                                                    <Bookmark className="w-4 h-4 hover:text-primary transition-colors cursor-pointer" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-red-600 to-orange-500">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center text-white">
                    <div className="space-y-6">
                        <Youtube className="w-16 h-16 mx-auto opacity-80" />
                        <h2 className="text-3xl sm:text-4xl font-bold">
                            გამოიწერე YouTube არხი
                        </h2>
                        <p className="text-xl text-white/80">
                            ახალი ვიდეოები ყოველ კვირას - AI ტუტორიალები, ხრიკები და მიმოხილვები
                        </p>
                        <Button size="lg" className="bg-white text-red-600 hover:bg-white/90" asChild>
                            <Link href={brand.social.youtube} target="_blank">
                                <Youtube className="w-5 h-5 mr-2" />
                                გამოწერა
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

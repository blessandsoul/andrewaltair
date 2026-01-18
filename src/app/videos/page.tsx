import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TbPlayerPlay, TbBrandYoutube, TbEye, TbClock, TbTrendingUp, TbBolt, TbShare, TbBookmark, TbArrowRight, TbCalendar } from "react-icons/tb"
import { brand } from "@/lib/brand"
import Image from "next/image"
import { Metadata } from "next"
import dbConnect from "@/lib/db"
import Video from "@/models/Video"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: "AI ვიდეო ტუტორიალები | Andrew Altair",
    description: "ხელოვნური ინტელექტის შესახებ ვიდეო გზამკვლევები, შედარებები და პრაქტიკული რჩევები. უყურე ChatGPT, Midjourney და სხვა AI ინსტრუმენტების ტუტორიალებს.",
    openGraph: {
        title: "AI ვიდეო ტუტორიალები | Andrew Altair",
        description: "ხელოვნური ინტელექტის შესახებ ვიდეო გზამკვლევები და პრაქტიკული რჩევები.",
        type: "website",
        locale: "ka_GE",
    },
    twitter: {
        card: "summary_large_image",
        title: "AI ვიდეო ტუტორიალები",
        description: "ხელოვნური ინტელექტის შესახებ ვიდეო გზამკვლევები.",
    },
}

// Video interface
interface TbVideo {
    id: string
    youtubeId: string
    title: string
    description: string
    category: string
    duration: string
    views: number
    publishedAt: string
    type?: 'long' | 'short'
    authorName?: string
    authorAvatar?: string
}

// Fetch videos directly from MongoDB
async function getVideos(): Promise<TbVideo[]> {
    try {
        await dbConnect()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const videos = await Video.find({})
            .sort({ publishedAt: -1 })
            .limit(50)
            .lean() as any[]

        return videos.map(video => ({
            ...video,
            id: video._id.toString(),
            _id: undefined,
            publishedAt: video.publishedAt ? new Date(video.publishedAt).toISOString() : new Date().toISOString(),
            createdAt: video.createdAt ? new Date(video.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: video.updatedAt ? new Date(video.updatedAt).toISOString() : new Date().toISOString(),
            authorName: video.authorName || 'Andrew Altair',
            authorAvatar: video.authorAvatar || '/andrewaltair.png',
        }))
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

// Format relative date
function formatRelativeDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "დღეს"
    if (diffDays === 1) return "გუშინ"
    if (diffDays < 7) return `${diffDays} დღის წინ`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} კვირის წინ`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} თვის წინ`
    return `${Math.floor(diffDays / 365)} წლის წინ`
}

// Get category color
function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
        'ტუტორიალი': '#3b82f6',
        'მიმოხილვა': '#8b5cf6',
        'ხრიკები': '#f59e0b',
        'ინტერვიუ': '#10b981',
        'პოდკასტი': '#ec4899',
        'ვლოგი': '#06b6d4',
    }
    return colors[category] || '#6366f1'
}

// Helper to determine author avatar
function getAuthorAvatar(author: { name?: string, avatar?: string, role?: string } | undefined) {
    if (!author) return '/logo.png'
    const name = (author.name || '').toLowerCase()
    const role = author.role

    // Specific mapping for known authors
    if (name.includes('andrew') || role === 'god') return '/andrewaltair.png'
    if (name.includes('deep') || name.includes('დიპ')) return '/images/avatars/deep.jpg'
    if (name.includes('alpha') || name.includes('ალფა')) return '/images/avatars/alpha.jpg'

    // Block invalid/broken paths
    if (author.avatar === '/images/avatar.jpg') return '/logo.png'

    // Database value or generic fallback
    return author.avatar || '/logo.png'
}

export default async function VideosPage() {
    const videosData = await getVideos()
    const longVideos = videosData.filter(v => v.type === 'long')
    const shortVideos = videosData.filter(v => v.type === 'short')

    // VideoObject ItemList Schema for SEO
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'
    const videoListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'AI ვიდეო ტუტორიალები',
        description: 'ხელოვნური ინტელექტის შესახებ ვიდეო გზამკვლევები',
        numberOfItems: videosData.length,
        itemListElement: videosData.slice(0, 10).map((video, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'VideoObject',
                name: video.title,
                description: video.description,
                thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
                uploadDate: video.publishedAt,
                duration: video.duration,
                embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
                contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
                author: {
                    '@type': 'Person',
                    name: 'Andrew Altair',
                    url: siteUrl
                }
            }
        }))
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(videoListSchema) }}
            />
            <div className="min-h-screen">
                {/* Hero */}
                <section className="relative py-20 lg:py-28 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-red-500/5">
                        <div className="absolute inset-0 noise-overlay"></div>
                    </div>

                    <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="max-w-3xl mx-auto text-center space-y-6">
                            <Badge variant="secondary" className="px-4 py-2">
                                <TbBrandYoutube className="w-3 h-3 mr-2 text-red-500" />
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
                                        <TbBrandYoutube className="w-5 h-5 mr-2" />
                                        YouTube არხი
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline">
                                    <TbTrendingUp className="w-5 h-5 mr-2" />
                                    {videosData.length} ვიდეო
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
                                    <TbBolt className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">მოკლე ვიდეოები</h2>
                                    <p className="text-muted-foreground">60 წამში AI ინსაიტები</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {shortVideos.map((video) => (
                                <Link
                                    key={video.id}
                                    href={`/videos/${video.id}`}
                                >
                                    <Card className="group border-0 shadow-lg bg-card/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] hover:bg-card">
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
                                                        <TbPlayerPlay className="w-6 h-6 text-white fill-white ml-1" />
                                                    </div>
                                                </div>

                                                {/* Shorts badge */}
                                                <Badge className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-red-500 text-white border-0 text-xs">
                                                    <TbBolt className="w-3 h-3 mr-1" />
                                                    Shorts
                                                </Badge>

                                                {/* Duration badge */}
                                                {video.duration && (
                                                    <Badge className="absolute top-2 right-2 bg-black/70 text-white border-0 text-xs backdrop-blur-sm">
                                                        {video.duration}
                                                    </Badge>
                                                )}

                                                {/* Content overlay */}
                                                <div className="absolute bottom-0 inset-x-0 p-3">
                                                    <h4 className="font-bold text-white text-sm line-clamp-2 mb-2">
                                                        {video.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-white/80 text-xs">
                                                        {video.views > 0 && (
                                                            <span className="flex items-center gap-1">
                                                                <TbEye className="w-3 h-3" />
                                                                {formatNumber(video.views)}
                                                            </span>
                                                        )}
                                                        <span>{formatRelativeDate(video.publishedAt)}</span>
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

                {/* Long Videos - PostCard Style */}
                <section className="py-16 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                                    <TbBrandYoutube className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">სრული ვიდეოები</h2>
                                    <p className="text-muted-foreground">დეტალური ტუტორიალები და მიმოხილვები</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {longVideos.map((video) => (
                                <div key={video.id} className="block h-full group">
                                    <Card className="h-full border-0 bg-card/50 dark:bg-card/40 overflow-hidden transition-all duration-500 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group-hover:-translate-y-2 group-hover:bg-card dark:group-hover:bg-card dark:group-hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.05)]">
                                        <CardContent className="p-0 h-full flex flex-col">
                                            {/* Image Container */}
                                            <Link href={`/videos/${video.id}`}>
                                                <div className="relative w-full aspect-video overflow-hidden">
                                                    {/* Thumbnail */}
                                                    <Image
                                                        src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                                        alt={video.title}
                                                        fill
                                                        className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
                                                    />

                                                    {/* Gradient Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                                    {/* Category Badge */}
                                                    <div className="absolute top-3 left-3 z-10">
                                                        <Badge
                                                            className="backdrop-blur-md border-0 text-[10px] font-bold px-2.5 py-1 tracking-wider uppercase shadow-lg text-white"
                                                            style={{ backgroundColor: getCategoryColor(video.category) }}
                                                        >
                                                            {video.category}
                                                        </Badge>
                                                    </div>

                                                    {/* Play Button */}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-16 h-16 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl shadow-red-500/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-red-600 group-hover:shadow-red-500/50">
                                                            <TbPlayerPlay className="w-7 h-7 text-white fill-white ml-1" />
                                                        </div>
                                                    </div>

                                                    {/* Bottom Stats */}
                                                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                                                        <div className="flex items-center gap-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-[10px] font-medium shadow-lg">
                                                            {video.views > 0 && (
                                                                <div className="flex items-center gap-1.5" title="ნახვები">
                                                                    <TbEye className="w-3.5 h-3.5 text-blue-400" />
                                                                    <span>{formatNumber(video.views)}</span>
                                                                </div>
                                                            )}
                                                            {video.duration && (
                                                                <div className="flex items-center gap-1.5" title="ხანგრძლივობა">
                                                                    <TbClock className="w-3.5 h-3.5 text-green-400" />
                                                                    <span>{video.duration}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>

                                            {/* Content Section */}
                                            <div className="flex-1 p-5 flex flex-col border-t border-border/20">
                                                <Link href={`/videos/${video.id}`} className="block">
                                                    <h3 className="text-lg font-bold leading-snug mb-3 group-hover:text-red-500 transition-colors line-clamp-2">
                                                        {video.title}
                                                    </h3>
                                                </Link>

                                                {/* Description */}
                                                {video.description && (
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                                                        {video.description}
                                                    </p>
                                                )}

                                                {/* Footer */}
                                                <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between gap-4">
                                                    {/* Author Info */}
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-border/50">
                                                            <Image
                                                                src={getAuthorAvatar({ name: video.authorName, avatar: video.authorAvatar })}
                                                                alt={video.authorName || 'Andrew Altair'}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-semibold">{video.authorName || 'Andrew Altair'}</span>
                                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                                <TbCalendar className="w-3 h-3" />
                                                                {formatRelativeDate(video.publishedAt)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Action Button */}
                                                    <Link href={`/videos/${video.id}`}>
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            className="h-8 text-[10px] font-bold tracking-wide transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-orange-500 group-hover:text-white"
                                                        >
                                                            ნახვა
                                                            <TbArrowRight className="w-3 h-3 ml-1.5 group-hover:translate-x-1 transition-transform" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 bg-gradient-to-r from-red-600 to-orange-500">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center text-white">
                        <div className="space-y-6">
                            <TbBrandYoutube className="w-16 h-16 mx-auto opacity-80" />
                            <h2 className="text-3xl sm:text-4xl font-bold">
                                გამოიწერე YouTube არხი
                            </h2>
                            <p className="text-xl text-white/80">
                                ახალი ვიდეოები ყოველ კვირას - AI ტუტორიალები, ხრიკები და მიმოხილვები
                            </p>
                            <Button size="lg" className="bg-white text-red-600 hover:bg-white/90" asChild>
                                <Link href={brand.social.youtube} target="_blank">
                                    <TbBrandYoutube className="w-5 h-5 mr-2" />
                                    გამოწერა
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </div >
        </>
    )
}


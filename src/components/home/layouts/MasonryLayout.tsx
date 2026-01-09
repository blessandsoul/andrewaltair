"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    TbArrowRight,
    TbBulb,
    TbBook,
    TbSettings,
    TbBriefcase,
    TbShoppingBag,
    TbInfoCircle,
    TbRobot,
    TbGift,
    TbActivity,
    TbClipboardCheck,
    TbSparkles,
    TbVideo,
    TbPlayerPlay,
    TbEye,
    TbFlame,
    TbTrendingUp
} from "react-icons/tb"

interface MasonryLayoutProps {
    posts: any[]
    videos: any[]
}

// Service items for cards
const serviceItems = [
    { href: "/mystic", label: "მისტიკური AI", description: "AI პრედიქციები და ტაროს კითხვა", icon: TbBulb, color: "from-purple-500 to-pink-500", size: "large" },
    { href: "/encyclopedia", label: "AI ენციკლოპედია", description: "სრული AI ცოდნის ბაზა", icon: TbBook, color: "from-blue-500 to-cyan-500", size: "medium" },
    { href: "/videos", label: "ვიდეო ტუტორიალები", description: "YouTube სასწავლო კონტენტი", icon: TbVideo, color: "from-red-500 to-orange-500", size: "medium" },
    { href: "/tools", label: "AI ინსტრუმენტები", description: "რეიტინგები და მიმოხილვები", icon: TbSettings, color: "from-green-500 to-emerald-500", size: "small" },
    { href: "/quiz", label: "AI ქვიზი", description: "იპოვე შენთვის საუკეთესო AI", icon: TbInfoCircle, color: "from-amber-500 to-yellow-400", size: "small" },
    { href: "/bots", label: "AI ჩატბოტები", description: "სპეციალიზებული ბოტები", icon: TbRobot, color: "from-indigo-500 to-purple-500", size: "small" },
    { href: "/mystery-box", label: "საჩუქრის ყუთი", description: "ყოველდღიური პრიზები", icon: TbGift, color: "from-pink-500 to-rose-500", size: "small" },
    { href: "/lessons", label: "მიკრო-გაკვეთილები", description: "სწრაფი AI სწავლება", icon: TbBook, color: "from-teal-500 to-green-500", size: "small" },
    { href: "/ai-health", label: "AI ჯანმრთელობა", description: "შეაფასე AI მზადყოფნა", icon: TbActivity, color: "from-cyan-500 to-blue-500", size: "small" },
    { href: "/prompt-builder", label: "Prompt Builder", description: "AI პრომპტის შემქმნელი", icon: TbSparkles, color: "from-violet-500 to-purple-500", size: "small" },
    { href: "/prompts", label: "პრომპტების მაღაზია", description: "AI პრომპტების მარკეტპლეისი", icon: TbShoppingBag, color: "from-orange-500 to-red-500", size: "small" },
    { href: "/services", label: "კონსულტაცია", description: "AI კონსალტინგი", icon: TbBriefcase, color: "from-slate-600 to-slate-800", size: "small" },
]

export function MasonryLayout({ posts, videos }: MasonryLayoutProps) {
    const featuredPost = posts.find(p => p.featured) || posts[0]
    const otherPosts = posts.filter(p => p.id !== featuredPost?.id).slice(0, 4)

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <TbSparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold">აღმოაჩინე კონტენტი</h2>
                    <p className="text-muted-foreground">ყველაფერი AI-ზე ერთ ადგილზე</p>
                </div>
            </div>

            {/* Masonry Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[200px]">

                {/* Featured Post - Large */}
                {featuredPost && (
                    <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="col-span-2 row-span-2 group"
                    >
                        <Card className="h-full overflow-hidden border-0 shadow-xl hover-lift relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30">
                                {featuredPost.coverImages?.horizontal && (
                                    <Image
                                        src={featuredPost.coverImages.horizontal}
                                        alt={featuredPost.title}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                            <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <Badge className="mb-2 bg-red-500 border-0">
                                    <TbFlame className="w-3 h-3 mr-1" />
                                    Featured
                                </Badge>
                                <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                                    {featuredPost.title}
                                </h3>
                                <p className="text-sm text-white/70 line-clamp-2 mt-2">{featuredPost.excerpt}</p>
                            </CardContent>
                        </Card>
                    </Link>
                )}

                {/* Service Cards */}
                {serviceItems.map((item, index) => {
                    const colSpan = item.size === "large" ? "col-span-2" : item.size === "medium" ? "col-span-2 md:col-span-1" : "col-span-1"
                    const rowSpan = item.size === "large" ? "row-span-2" : "row-span-1"

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${colSpan} ${rowSpan} group`}
                        >
                            <Card className={`h-full overflow-hidden border-0 shadow-lg hover-lift bg-gradient-to-br ${item.color} text-white`}>
                                <CardContent className="h-full p-4 flex flex-col justify-between">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm sm:text-base group-hover:underline">
                                            {item.label}
                                        </h3>
                                        <p className="text-xs text-white/80 line-clamp-2 mt-1 hidden sm:block">
                                            {item.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}

                {/* Recent Posts */}
                {otherPosts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="col-span-1 group"
                    >
                        <Card className="h-full overflow-hidden border shadow-md hover-lift">
                            <CardContent className="h-full p-0 flex flex-col">
                                <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
                                    {post.coverImages?.horizontal && (
                                        <Image
                                            src={post.coverImages.horizontal}
                                            alt={post.title}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                                <div className="p-3 flex-1 flex flex-col justify-between">
                                    <h4 className="font-medium text-xs line-clamp-2 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                        <TbEye className="w-3 h-3" />
                                        {post.views || 0}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {/* Video Preview */}
                {videos[0] && (
                    <Link
                        href={`/videos/${videos[0].id}`}
                        className="col-span-2 group"
                    >
                        <Card className="h-full overflow-hidden border-0 shadow-lg hover-lift relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-orange-500/30">
                                {videos[0].youtubeId && (
                                    <Image
                                        src={`https://img.youtube.com/vi/${videos[0].youtubeId}/maxresdefault.jpg`}
                                        alt={videos[0].title}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                    <TbPlayerPlay className="w-8 h-8 text-red-600 ml-1" />
                                </div>
                            </div>
                            <CardContent className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                <Badge className="mb-2 bg-red-600 border-0">ვიდეო</Badge>
                                <h3 className="font-bold text-sm line-clamp-2">{videos[0].title}</h3>
                            </CardContent>
                        </Card>
                    </Link>
                )}
            </div>

            {/* CTA */}
            <div className="mt-10 text-center">
                <Button size="lg" asChild className="bg-gradient-to-r from-primary to-accent text-white">
                    <Link href="/blog">
                        ყველა სტატია
                        <TbArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </Button>
            </div>
        </div>
    )
}

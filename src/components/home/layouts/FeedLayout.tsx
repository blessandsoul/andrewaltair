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
    TbRobot,
    TbGift,
    TbSparkles,
    TbPlayerPlay,
    TbEye,
    TbFlame,
    TbClock,
    TbMessage,
    TbHeart,
    TbBrain,
    TbQuestionMark,
    TbInfoCircle
} from "react-icons/tb"

interface FeedLayoutProps {
    posts: any[]
    videos: any[]
}

// Different content types for the feed
const promoItems = [
    {
        type: "quiz",
        href: "/quiz",
        title: "🧠 იპოვე შენი AI",
        description: "5 კითხვით გაიგე რომელი AI ინსტრუმენტია შენთვის იდეალური",
        cta: "დაიწყე ქვიზი",
        gradient: "from-amber-500 to-orange-500",
        icon: TbInfoCircle
    },
    {
        type: "mystic",
        href: "/mystic",
        title: "🔮 რას გვეტყვის AI?",
        description: "ტაროს კითხვა, ნუმეროლოგია და ყოველდღიური ჰოროსკოპი AI-ით",
        cta: "გახსენი ბედი",
        gradient: "from-purple-600 to-pink-500",
        icon: TbBulb
    },
    {
        type: "mystery",
        href: "/mystery-box",
        title: "🎁 საჩუქრის ყუთი",
        description: "ყოველდღიური პრიზები AI კრედიტებით და ფასდაკლებებით",
        cta: "გახსენი ახლა",
        gradient: "from-pink-500 to-rose-500",
        icon: TbGift
    },
    {
        type: "bots",
        href: "/bots",
        title: "🤖 AI ჩატბოტები",
        description: "სპეციალიზებული ბოტები სხვადასხვა ამოცანებისთვის",
        cta: "ნახე ბოტები",
        gradient: "from-indigo-500 to-purple-500",
        icon: TbRobot
    },
    {
        type: "encyclopedia",
        href: "/encyclopedia",
        title: "📚 AI ენციკლოპედია",
        description: "ყველაფერი რაც AI-ზე უნდა იცოდე - ერთ ადგილზე",
        cta: "დაიწყე კითხვა",
        gradient: "from-blue-500 to-cyan-500",
        icon: TbBook
    },
    {
        type: "prompt",
        href: "/prompt-builder",
        title: "✨ Prompt Builder",
        description: "შექმენი იდეალური პრომპტი ნებისმიერი AI-სთვის",
        cta: "სცადე ახლა",
        gradient: "from-violet-500 to-purple-500",
        icon: TbSparkles
    },
]

// Fun facts to sprinkle in feed
const funFacts = [
    "💡 ChatGPT-ს 100 მილიონ მომხმარებელს მხოლოდ 2 თვე დასჭირდა",
    "🚀 2030 წლისთვის AI 15.7 ტრილიონ დოლარს დაამატებს გლობალურ ეკონომიკას",
    "🤯 GPT-4-მა იურისტების გამოცდა უკეთესად ჩააბარა ვიდრე ადამიანების 90%",
    "🎨 Midjourney-მ 2022 წელს ხელოვნების კონკურსი მოიგო",
    "💼 AI-ის წყალობით შესაძლებელია 40% უფრო ნაკლები დრო დახარჯო რუტინულ სამუშაოზე",
]

export function FeedLayout({ posts, videos }: FeedLayoutProps) {
    // Interleave content
    const feedItems: any[] = []
    let postIndex = 0
    let promoIndex = 0
    let factIndex = 0
    let videoIndex = 0

    // Build alternating feed
    for (let i = 0; i < 15; i++) {
        if (i % 3 === 0 && posts[postIndex]) {
            feedItems.push({ type: "post", data: posts[postIndex++] })
        } else if (i % 3 === 1 && promoItems[promoIndex]) {
            feedItems.push({ type: "promo", data: promoItems[promoIndex++] })
        } else if (i % 5 === 4) {
            feedItems.push({ type: "fact", data: funFacts[factIndex++ % funFacts.length] })
        } else if (videos[videoIndex]) {
            feedItems.push({ type: "video", data: videos[videoIndex++] })
        } else if (posts[postIndex]) {
            feedItems.push({ type: "post", data: posts[postIndex++] })
        }
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-12">
            {/* Feed Header */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-2">🔥 ახალი ფიდი</h2>
                <p className="text-muted-foreground">მრავალფეროვანი AI კონტენტი ერთ სტრიმში</p>
            </div>

            {/* Feed Items */}
            <div className="space-y-6">
                {feedItems.map((item, index) => {
                    if (item.type === "post") {
                        const post = item.data
                        return (
                            <Link key={`post-${post.id}`} href={`/blog/${post.slug}`} className="block group">
                                <Card className="overflow-hidden hover-lift border shadow-lg">
                                    <CardContent className="p-0">
                                        {post.coverImages?.horizontal && (
                                            <div className="relative aspect-video">
                                                <Image
                                                    src={post.coverImages.horizontal}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                                {post.trending && (
                                                    <Badge className="absolute top-3 left-3 bg-red-500 border-0">
                                                        <TbFlame className="w-3 h-3 mr-1" />
                                                        Trending
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                        <div className="p-5">
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <TbEye className="w-4 h-4" />
                                                    {post.views || 0}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <TbMessage className="w-4 h-4" />
                                                    {post.commentsCount || 0}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <TbClock className="w-4 h-4" />
                                                    {post.readingTime || 5} წთ
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    }

                    if (item.type === "promo") {
                        const promo = item.data
                        return (
                            <Link key={`promo-${promo.type}`} href={promo.href} className="block group">
                                <Card className={`overflow-hidden border-0 shadow-xl bg-gradient-to-r ${promo.gradient} text-white hover-lift`}>
                                    <CardContent className="p-6 flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0">
                                            <promo.icon className="w-7 h-7" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-1">{promo.title}</h3>
                                            <p className="text-white/80 text-sm">{promo.description}</p>
                                        </div>
                                        <Button variant="secondary" size="sm" className="shrink-0 bg-white/20 hover:bg-white/30 border-0">
                                            {promo.cta}
                                            <TbArrowRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    }

                    if (item.type === "video") {
                        const video = item.data
                        return (
                            <Link key={`video-${video.id}`} href={`/videos/${video.id}`} className="block group">
                                <Card className="overflow-hidden hover-lift border shadow-lg">
                                    <CardContent className="p-0">
                                        <div className="relative aspect-video">
                                            {video.youtubeId && (
                                                <Image
                                                    src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                                    alt={video.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                                    <TbPlayerPlay className="w-8 h-8 text-white ml-1" />
                                                </div>
                                            </div>
                                            <Badge className="absolute top-3 right-3 bg-black/60 border-0">
                                                {video.duration || "00:00"}
                                            </Badge>
                                        </div>
                                        <div className="p-5">
                                            <Badge variant="outline" className="mb-2 border-red-500 text-red-500">
                                                <TbPlayerPlay className="w-3 h-3 mr-1" />
                                                ვიდეო
                                            </Badge>
                                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                                                {video.title}
                                            </h3>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    }

                    if (item.type === "fact") {
                        return (
                            <Card key={`fact-${index}`} className="border-2 border-dashed border-primary/30 bg-primary/5">
                                <CardContent className="p-5 text-center">
                                    <div className="text-lg font-medium">{item.data}</div>
                                    <div className="text-xs text-muted-foreground mt-2">AI ფაქტი</div>
                                </CardContent>
                            </Card>
                        )
                    }

                    return null
                })}
            </div>

            {/* Load More CTA */}
            <div className="mt-10 text-center">
                <Button size="lg" variant="outline" asChild>
                    <Link href="/blog">
                        ყველა კონტენტი
                        <TbArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </Button>
            </div>
        </div>
    )
}

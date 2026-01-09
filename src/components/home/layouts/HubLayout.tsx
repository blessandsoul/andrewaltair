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
    TbSparkles,
    TbVideo,
    TbPlayerPlay,
    TbEye,
    TbFlame,
    TbSchool,
    TbFileText,
    TbDownload,
    TbStar,
    TbCrown,
    TbBolt,
    TbCheck,
    TbMessage,
    TbPencil,
    TbBrain
} from "react-icons/tb"

interface HubLayoutProps {
    posts: any[]
    videos: any[]
}

// Services data (from /services page)
const servicesData = [
    {
        id: "consultation",
        title: "💡 AI კონსულტაცია",
        description: "1-on-1 სესიები AI სტრატეგიისთვის",
        price: "150₾",
        unit: "საათში",
        features: ["პირადი ზარი", "სტრატეგიის გეგმა", "Follow-up მხარდაჭერა"],
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        id: "training",
        title: "📚 AI ტრენინგი",
        description: "გუნდის სწავლება AI ინსტრუმენტებზე",
        price: "500₾",
        unit: "გუნდზე",
        features: ["4 საათი", "პრაქტიკული სავარჯიშოები", "მასალები"],
        gradient: "from-purple-500 to-pink-500"
    },
    {
        id: "automation",
        title: "⚡ AI ავტომატიზაცია",
        description: "ბიზნეს პროცესების ავტომატიზაცია",
        price: "1000₾",
        unit: "პროექტი",
        features: ["აუდიტი", "იმპლემენტაცია", "მხარდაჭერა 1 თვე"],
        gradient: "from-orange-500 to-red-500"
    },
    {
        id: "content",
        title: "✍️ AI კონტენტი",
        description: "AI-ით კონტენტის შექმნა",
        price: "200₾",
        unit: "პოსტი",
        features: ["სტატია/ვიდეო სკრიპტი", "SEO ოპტიმიზაცია", "რევიზია"],
        gradient: "from-emerald-500 to-teal-500"
    },
]

// Bots data showcase
const botsShowcase = [
    {
        id: "aicontent",
        name: "AICONTENT",
        description: "კონტენტის ტრანსფორმატორი Facebook + Telegram-ისთვის",
        tier: "free",
        rating: 4.9,
        downloads: 2500,
        icon: TbPencil,
        gradient: "from-violet-500 to-purple-500"
    },
    {
        id: "mystic",
        name: "Mystic AI",
        description: "ტაროს კითხვა და ნუმეროლოგია AI-ით",
        tier: "premium",
        price: 15,
        rating: 4.8,
        downloads: 1800,
        icon: TbSparkles,
        gradient: "from-purple-600 to-pink-500"
    },
    {
        id: "translator",
        name: "Pro Translator",
        description: "პროფესიონალური თარგმანი 50+ ენაზე",
        tier: "free",
        rating: 4.7,
        downloads: 3200,
        icon: TbMessage,
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        id: "coder",
        name: "Code Assistant",
        description: "კოდის გენერაცია და ოპტიმიზაცია",
        tier: "premium",
        price: 25,
        rating: 4.9,
        downloads: 1500,
        icon: TbBrain,
        gradient: "from-emerald-500 to-green-500"
    },
]

// Quick promo items
const quickPromos = [
    { href: "/quiz", title: "🧠 AI ქვიზი", gradient: "from-amber-500 to-orange-500" },
    { href: "/mystic", title: "🔮 მისტიკური AI", gradient: "from-purple-600 to-pink-500" },
    { href: "/mystery-box", title: "🎁 საჩუქრის ყუთი", gradient: "from-pink-500 to-rose-500" },
    { href: "/encyclopedia", title: "📚 ენციკლოპედია", gradient: "from-blue-500 to-cyan-500" },
    { href: "/tools", title: "⚙️ AI ინსტრუმენტები", gradient: "from-emerald-500 to-teal-500" },
    { href: "/prompt-builder", title: "✨ Prompt Builder", gradient: "from-violet-500 to-purple-500" },
]

// Prompt examples
const featuredPrompts = [
    { title: "ChatGPT მარკეტინგი", category: "მარკეტინგი", downloads: 1234, price: "უფასო" },
    { title: "Midjourney ფოტორეალიზმი", category: "ხელოვნება", downloads: 892, price: "₾5" },
    { title: "Claude კოდის რევიუერი", category: "პროგრამირება", downloads: 567, price: "უფასო" },
    { title: "DALL-E ბრენდინგი", category: "დიზაინი", downloads: 445, price: "₾10" },
]

// Tutorial topics
const tutorialTopics = [
    { title: "ChatGPT დამწყებთათვის", level: "დამწყები", duration: "15 წთ", icon: "🎓" },
    { title: "Midjourney მასტერკლასი", level: "საშუალო", duration: "30 წთ", icon: "🎨" },
    { title: "AI ავტომატიზაცია", level: "მოწინავე", duration: "45 წთ", icon: "⚡" },
    { title: "Claude API ინტეგრაცია", level: "მოწინავე", duration: "60 წთ", icon: "💻" },
]

export function HubLayout({ posts, videos }: HubLayoutProps) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 space-y-14">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">🚀 აღმოაჩინე ყველაფერი</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    AI-ს სრული სამყარო — სტატიები, ვიდეოები, ბოტები, პრომპტები და სერვისები
                </p>
            </div>

            {/* Quick Promo Grid */}
            <section>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {quickPromos.map((promo) => (
                        <Link key={promo.href} href={promo.href} className="group">
                            <Card className={`overflow-hidden border-0 shadow-lg bg-gradient-to-r ${promo.gradient} text-white hover-lift h-full`}>
                                <CardContent className="p-3 text-center">
                                    <span className="font-bold text-sm whitespace-nowrap">{promo.title}</span>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Articles Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <TbFileText className="text-blue-500" />
                        სტატიები
                    </h3>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/blog">
                            ყველა
                            <TbArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </Button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {posts.slice(0, 4).map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                            <Card className="h-full overflow-hidden shadow-md hover-lift">
                                <CardContent className="p-0 h-full flex flex-col">
                                    <div className="relative aspect-video bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                                        {post.coverImages?.horizontal && (
                                            <Image src={post.coverImages.horizontal} alt={post.title} fill className="object-cover" />
                                        )}
                                        {post.trending && (
                                            <Badge className="absolute top-2 left-2 bg-red-500 border-0 text-xs">
                                                <TbFlame className="w-3 h-3 mr-1" />Hot
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="p-3 flex-1 flex flex-col">
                                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors flex-1">
                                            {post.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                            <TbEye className="w-3 h-3" />{post.views || 0}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Videos Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <TbVideo className="text-red-500" />
                        ვიდეოები
                    </h3>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/videos">
                            ყველა
                            <TbArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </Button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {videos.slice(0, 4).map((video: any) => (
                        <Link key={video.id} href={`/videos/${video.id}`} className="group">
                            <Card className="h-full overflow-hidden shadow-md hover-lift">
                                <CardContent className="p-0">
                                    <div className="relative aspect-video">
                                        {video.youtubeId && (
                                            <Image src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`} alt={video.title} fill className="object-cover" />
                                        )}
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <TbPlayerPlay className="w-6 h-6 text-white ml-0.5" />
                                            </div>
                                        </div>
                                        <Badge className="absolute top-2 right-2 bg-black/70 text-white border-0 text-xs">
                                            {video.duration || "00:00"}
                                        </Badge>
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-red-500 transition-colors">
                                            {video.title}
                                        </h4>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* AI Bots Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <TbRobot className="text-violet-500" />
                        AI ბოტები
                    </h3>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/bots">
                            ყველა ბოტი
                            <TbArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </Button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {botsShowcase.map((bot) => (
                        <Link key={bot.id} href={`/bots/${bot.id}`} className="group">
                            <Card className={`h-full overflow-hidden shadow-lg hover-lift border-0`}>
                                <CardContent className="p-0">
                                    <div className={`p-4 bg-gradient-to-r ${bot.gradient} text-white`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <bot.icon className="w-8 h-8" />
                                            {bot.tier === 'premium' ? (
                                                <Badge className="bg-amber-400 text-black border-0 text-xs">
                                                    <TbCrown className="w-3 h-3 mr-1" />₾{bot.price}
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-emerald-400 text-black border-0 text-xs">
                                                    <TbBolt className="w-3 h-3 mr-1" />უფასო
                                                </Badge>
                                            )}
                                        </div>
                                        <h4 className="font-bold">{bot.name}</h4>
                                    </div>
                                    <div className="p-4 bg-card">
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {bot.description}
                                        </p>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="flex items-center gap-1 text-amber-500">
                                                <TbStar className="w-3 h-3 fill-current" />{bot.rating}
                                            </span>
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                <TbDownload className="w-3 h-3" />{(bot.downloads / 1000).toFixed(1)}k
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Tutorials Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <TbSchool className="text-amber-500" />
                        ტუტორიალები
                    </h3>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/lessons">
                            ყველა
                            <TbArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </Button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tutorialTopics.map((tutorial, index) => (
                        <Link key={index} href="/lessons" className="group">
                            <Card className="h-full overflow-hidden shadow-md hover-lift border-amber-500/20 hover:border-amber-500/50">
                                <CardContent className="p-4">
                                    <div className="text-3xl mb-3">{tutorial.icon}</div>
                                    <h4 className="font-bold mb-2 group-hover:text-amber-500 transition-colors">
                                        {tutorial.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Badge variant="secondary" className="text-xs">{tutorial.level}</Badge>
                                        <span>•</span>
                                        <span>{tutorial.duration}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Prompts Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <TbSparkles className="text-violet-500" />
                        პრომპტები
                    </h3>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/prompts">
                            მაღაზია
                            <TbArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </Button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {featuredPrompts.map((prompt, index) => (
                        <Link key={index} href="/prompts" className="group">
                            <Card className="h-full overflow-hidden shadow-md hover-lift border-violet-500/20 hover:border-violet-500/50">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <Badge variant="outline" className="text-xs border-violet-500/50 text-violet-500">
                                            {prompt.category}
                                        </Badge>
                                        <span className={`text-sm font-bold ${prompt.price === 'უფასო' ? 'text-green-500' : 'text-foreground'}`}>
                                            {prompt.price}
                                        </span>
                                    </div>
                                    <h4 className="font-bold mb-3 group-hover:text-violet-500 transition-colors">
                                        {prompt.title}
                                    </h4>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <TbDownload className="w-3 h-3" />
                                        {prompt.downloads}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Services Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <TbBriefcase className="text-slate-600" />
                        სერვისები
                    </h3>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/services">
                            ყველა სერვისი
                            <TbArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </Button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {servicesData.map((service) => (
                        <Link key={service.id} href="/services" className="group">
                            <Card className="h-full overflow-hidden shadow-lg hover-lift border-0">
                                <CardContent className="p-0">
                                    <div className={`p-4 bg-gradient-to-r ${service.gradient} text-white`}>
                                        <h4 className="font-bold text-lg mb-1">{service.title}</h4>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold">{service.price}</span>
                                            <span className="text-white/70 text-sm">/ {service.unit}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-card">
                                        <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                                        <div className="space-y-1.5">
                                            {service.features.map((feature, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs">
                                                    <TbCheck className="w-3 h-3 text-green-500" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Bottom CTAs */}
            <section className="grid sm:grid-cols-2 gap-4">
                <Link href="/blog" className="group">
                    <Card className="h-full border-2 border-dashed border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-all">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold mb-1">📝 ბლოგი</h3>
                                <p className="text-sm text-muted-foreground">{posts.length}+ სტატია AI-ზე</p>
                            </div>
                            <TbArrowRight className="w-6 h-6 text-primary group-hover:translate-x-2 transition-transform" />
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/services#booking" className="group">
                    <Card className="h-full border-2 border-dashed border-violet-500/30 hover:border-violet-500 bg-violet-500/5 hover:bg-violet-500/10 transition-all">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold mb-1">💼 დაჯავშნე კონსულტაცია</h3>
                                <p className="text-sm text-muted-foreground">უფასო 15-წუთიანი ზარი</p>
                            </div>
                            <TbArrowRight className="w-6 h-6 text-violet-500 group-hover:translate-x-2 transition-transform" />
                        </CardContent>
                    </Card>
                </Link>
            </section>
        </div>
    )
}

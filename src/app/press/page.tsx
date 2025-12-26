import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Newspaper,
    Mic,
    Video,
    Quote,
    ExternalLink,
    Calendar,
    ArrowRight,
    Play,
    Radio,
    Tv
} from "lucide-react"

const pressItems = [
    {
        id: "1",
        type: "article",
        outlet: "Forbes Georgia",
        logo: "📰",
        title: "AI ტრანსფორმაცია: როგორ ცვლის ხელოვნური ინტელექტი ქართულ ბიზნესს",
        excerpt: "Andrew Altair, ერთ-ერთი წამყვანი AI კონსულტანტი საქართველოში, გვიზიარებს თავის ხედვას...",
        date: "2024-11",
        url: "#"
    },
    {
        id: "2",
        type: "podcast",
        outlet: "Tech Talk Georgia",
        logo: "🎙️",
        title: "EP 45: AI-ს მომავალი და ChatGPT რევოლუცია",
        excerpt: "1-საათიანი ინტერვიუ AI-ს შესაძლებლობებზე, გამოწვევებზე და პრაქტიკულ გამოყენებაზე.",
        date: "2024-10",
        url: "#",
        duration: "01:12:34"
    },
    {
        id: "3",
        type: "tv",
        outlet: "Imedi TV",
        logo: "📺",
        title: "ხელოვნური ინტელექტი ყოველდღიურ ცხოვრებაში",
        excerpt: "საუზმის შოუში მოწვეული ექსპერტი Andrew Altair საუბრობს AI-ს პრაქტიკულ გამოყენებაზე.",
        date: "2024-09",
        url: "#",
        duration: "15:42"
    },
    {
        id: "4",
        type: "article",
        outlet: "Business Media Georgia",
        logo: "📰",
        title: "2024 წლის ტოპ 10 AI ექსპერტი საქართველოში",
        excerpt: "წლის რეიტინგში Andrew Altair მოხვდა AI განათლებისა და კონსალტინგის კატეგორიაში...",
        date: "2024-08",
        url: "#"
    },
    {
        id: "5",
        type: "podcast",
        outlet: "Digital Georgia",
        logo: "🎙️",
        title: "როგორ დავიწყოთ AI ავტომატიზაცია ბიზნესში",
        excerpt: "პრაქტიკული რჩევები მცირე და საშუალო ბიზნესისთვის.",
        date: "2024-07",
        url: "#",
        duration: "45:20"
    },
    {
        id: "6",
        type: "article",
        outlet: "Marketer.ge",
        logo: "📰",
        title: "AI მარკეტინგის ახალი ერა: ინტერვიუ Andrew Altair-თან",
        excerpt: "როგორ იყენებენ წამყვანი ბრენდები AI-ს კონტენტ მარკეტინგში...",
        date: "2024-06",
        url: "#"
    }
]

const featuredQuotes = [
    {
        text: "AI არ არის მომავალი - ის უკვე აქ არის. კითხვა ისაა, ვინ პირველი მოახდენს მის ეფექტურ ინტეგრაცას.",
        source: "Forbes Georgia",
        date: "2024"
    },
    {
        text: "ყველაზე წარმატებული AI პროექტები იწყება არა ტექნოლოგიით, არამედ ბიზნეს-პრობლემის ღრმა გაგებით.",
        source: "Business Media",
        date: "2024"
    },
    {
        text: "ChatGPT მხოლოდ დასაწყისია. ნამდვილი ძალა მაშინ ვლინდება, როცა AI-ს სხვა ინსტრუმენტებს აკავშირებ.",
        source: "Tech Talk Podcast",
        date: "2024"
    }
]

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    article: Newspaper,
    podcast: Mic,
    tv: Tv,
    video: Video
}

const typeLabels: Record<string, string> = {
    article: "სტატია",
    podcast: "პოდკასტი",
    tv: "ტელევიზია",
    video: "ვიდეო"
}

export default function PressPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-background to-primary/10">
                    <div className="absolute inset-0 noise-overlay"></div>
                </div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-4 py-2">
                            <Newspaper className="w-4 h-4 mr-2" />
                            პრესა და მედია
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            მედიაში <span className="text-gradient">გამოჩენა</span>
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            ინტერვიუები, პოდკასტები და სტატიები AI-ს, ტექნოლოგიებისა და
                            ციფრული ტრანსფორმაციის შესახებ
                        </p>

                        {/* Media Logos */}
                        <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
                            {["Forbes Georgia", "Imedi TV", "Business Media", "Tech Talk"].map((outlet, i) => (
                                <div
                                    key={i}
                                    className="px-6 py-3 rounded-lg bg-card border border-border text-muted-foreground font-medium"
                                >
                                    {outlet}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Quotes */}
            <section className="py-16 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="grid md:grid-cols-3 gap-6">
                        {featuredQuotes.map((quote, i) => (
                            <Card key={i} className="relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-accent"></div>
                                <CardContent className="p-6 pl-8">
                                    <Quote className="w-8 h-8 text-primary/30 mb-4" />
                                    <p className="text-lg font-medium leading-relaxed mb-4">
                                        "{quote.text}"
                                    </p>
                                    <div className="text-sm text-muted-foreground">
                                        — {quote.source}, {quote.date}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Type Filter */}
            <section className="py-8 border-b border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Button variant="secondary" className="bg-primary text-white">
                            ყველა
                        </Button>
                        {Object.entries(typeLabels).map(([key, label]) => {
                            const Icon = typeIcons[key]
                            return (
                                <Button key={key} variant="outline" className="gap-2">
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Press Items */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="space-y-6">
                        {pressItems.map((item) => {
                            const Icon = typeIcons[item.type] || Newspaper
                            return (
                                <Card key={item.id} className="group hover-lift overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Left - Visual */}
                                            <div className="md:w-64 p-6 bg-gradient-to-br from-primary/10 to-accent/10 flex flex-col items-center justify-center text-center">
                                                <div className="text-5xl mb-3">{item.logo}</div>
                                                <div className="font-bold">{item.outlet}</div>
                                                <Badge variant="outline" className="mt-2 gap-1">
                                                    <Icon className="w-3 h-3" />
                                                    {typeLabels[item.type]}
                                                </Badge>
                                            </div>

                                            {/* Right - Content */}
                                            <div className="flex-1 p-6 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                        <Calendar className="w-4 h-4" />
                                                        {item.date}
                                                        {item.duration && (
                                                            <>
                                                                <span className="mx-2">•</span>
                                                                <Play className="w-4 h-4" />
                                                                {item.duration}
                                                            </>
                                                        )}
                                                    </div>

                                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                                        {item.title}
                                                    </h3>

                                                    <p className="text-muted-foreground">
                                                        {item.excerpt}
                                                    </p>
                                                </div>

                                                <div className="mt-4">
                                                    <Button variant="outline" size="sm" className="gap-2" asChild>
                                                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                            {item.type === "podcast" || item.type === "tv" ? (
                                                                <>
                                                                    <Play className="w-4 h-4" />
                                                                    მოსმენა / ყურება
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ExternalLink className="w-4 h-4" />
                                                                    წაკითხვა
                                                                </>
                                                            )}
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Press Kit CTA */}
            <section className="py-16 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <Card className="overflow-hidden">
                        <div className="grid md:grid-cols-2">
                            <div className="p-8 lg:p-12 bg-gradient-to-br from-primary to-accent text-white">
                                <Radio className="w-12 h-12 mb-6" />
                                <h2 className="text-2xl font-bold mb-4">
                                    მოწვევა ინტერვიუზე ან პოდკასტში?
                                </h2>
                                <p className="text-white/80">
                                    ხალისით ვმონაწილეობ პოდკასტებში, ტელე და ონლაინ ინტერვიუებში
                                    AI, ტექნოლოგია და ციფრული ტრანსფორმაციის თემებზე.
                                </p>
                            </div>
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                                <h3 className="font-bold text-lg mb-4">თემები რომლებზეც ვსაუბრობ:</h3>
                                <ul className="space-y-2 text-muted-foreground mb-6">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                        AI და ChatGPT ბიზნესისთვის
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                        ავტომატიზაცია და პროდუქტიულობა
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                        AI-ს მომავალი და ტრენდები
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                        კონტენტ კრეაცია და მარკეტინგი
                                    </li>
                                </ul>
                                <div className="flex gap-3">
                                    <Button asChild>
                                        <Link href="/contact">
                                            დამიკავშირდით
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline">
                                        Press Kit
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    )
}

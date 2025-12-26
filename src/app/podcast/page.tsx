import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Mic,
    Play,
    Pause,
    Clock,
    Calendar,
    Headphones,
    ExternalLink,
    ArrowRight,
    Share2,
    Heart,
    Volume2
} from "lucide-react"

const episodes = [
    {
        id: "15",
        title: "Claude 3.5 vs GPT-4o: დეტალური შედარება",
        description: "ორი უძლიერესი AI მოდელის სიღრმისეული ანალიზი. რომელი და როდის გამოვიყენოთ?",
        duration: "45:32",
        date: "2024-12-20",
        listens: 1234,
        featured: true,
        topics: ["Claude", "GPT-4", "შედარება"]
    },
    {
        id: "14",
        title: "AI ავტომატიზაცია: Make.com მასტერკლასი",
        description: "პრაქტიკული გაიდი Make.com-ზე ავტომატიზაციების აწყობაზე. რეალური მაგალითები.",
        duration: "52:18",
        date: "2024-12-13",
        listens: 987,
        featured: false,
        topics: ["Make.com", "ავტომატიზაცია", "No-Code"]
    },
    {
        id: "13",
        title: "ChatGPT Memory: როგორ მუშაობს?",
        description: "ChatGPT-ს ახალი Memory ფუნქციის დეტალური მიმოხილვა და პრაქტიკული რჩევები.",
        duration: "38:45",
        date: "2024-12-06",
        listens: 1567,
        featured: false,
        topics: ["ChatGPT", "Memory", "ახალი ფუნქციები"]
    },
    {
        id: "12",
        title: "AI კონტენტ კრეაცია: სრული გაიდი",
        description: "როგორ შევქმნათ ხარისხიანი კონტენტი AI-ს დახმარებით. ტექსტი, ვიზუალი, ვიდეო.",
        duration: "1:02:22",
        date: "2024-11-29",
        listens: 2341,
        featured: false,
        topics: ["კონტენტი", "მარკეტინგი", "AI"]
    },
    {
        id: "11",
        title: "Prompt Engineering: საფუძვლები",
        description: "როგორ დავწეროთ ეფექტური პრომპტები? ტექნიკები და მაგალითები.",
        duration: "41:15",
        date: "2024-11-22",
        listens: 3156,
        featured: false,
        topics: ["Prompts", "ChatGPT", "საფუძვლები"]
    }
]

const platforms = [
    { name: "Spotify", icon: "🎵", url: "#", color: "#1DB954" },
    { name: "Apple Podcasts", icon: "🎧", url: "#", color: "#872EC4" },
    { name: "YouTube", icon: "📺", url: "#", color: "#FF0000" },
    { name: "Google Podcasts", icon: "🎙️", url: "#", color: "#4285F4" }
]

export default function PodcastPage() {
    const featuredEpisode = episodes.find(e => e.featured)

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-background to-primary/10">
                    <div className="absolute inset-0 noise-overlay"></div>
                </div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 px-4 py-2">
                                <Mic className="w-4 h-4 mr-2" />
                                AI პოდკასტი
                            </Badge>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                                AI <span className="text-gradient">Insights</span>
                            </h1>

                            <p className="text-xl text-muted-foreground leading-relaxed">
                                ყოველკვირეული პოდკასტი AI-ს, ტექნოლოგიებისა და მომავლის შესახებ.
                                სიახლეები, ტუტორიალები და ღრმა ანალიზი.
                            </p>

                            {/* Stats */}
                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold">15</div>
                                    <div className="text-sm text-muted-foreground">ეპიზოდი</div>
                                </div>
                                <div className="w-px h-12 bg-border"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold">10K+</div>
                                    <div className="text-sm text-muted-foreground">მოსმენა</div>
                                </div>
                                <div className="w-px h-12 bg-border"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold">4.9</div>
                                    <div className="text-sm text-muted-foreground">რეიტინგი</div>
                                </div>
                            </div>

                            {/* Listen On */}
                            <div className="space-y-3">
                                <div className="text-sm font-medium text-muted-foreground">მოისმინე:</div>
                                <div className="flex flex-wrap gap-3">
                                    {platforms.map((platform) => (
                                        <Button
                                            key={platform.name}
                                            variant="outline"
                                            className="gap-2"
                                            asChild
                                        >
                                            <a href={platform.url} target="_blank" rel="noopener noreferrer">
                                                <span className="text-lg">{platform.icon}</span>
                                                {platform.name}
                                            </a>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Featured Episode Player */}
                        {featuredEpisode && (
                            <Card className="overflow-hidden bg-gradient-to-br from-purple-500/10 to-primary/10 border-purple-500/20">
                                <CardContent className="p-8">
                                    <Badge className="mb-4 bg-purple-500 text-white">
                                        ⭐ უახლესი ეპიზოდი
                                    </Badge>

                                    <h2 className="text-2xl font-bold mb-3">
                                        {featuredEpisode.title}
                                    </h2>

                                    <p className="text-muted-foreground mb-6">
                                        {featuredEpisode.description}
                                    </p>

                                    {/* Mock Player */}
                                    <div className="bg-card rounded-xl p-4 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <Button size="lg" className="w-14 h-14 rounded-full bg-purple-500 hover:bg-purple-600">
                                                <Play className="w-6 h-6 fill-white text-white ml-1" />
                                            </Button>
                                            <div className="flex-1">
                                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                    <div className="h-full w-1/3 bg-gradient-to-r from-purple-500 to-primary rounded-full"></div>
                                                </div>
                                                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                                                    <span>15:23</span>
                                                    <span>{featuredEpisode.duration}</span>
                                                </div>
                                            </div>
                                            <Volume2 className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Headphones className="w-4 h-4" />
                                            {featuredEpisode.listens.toLocaleString()} მოსმენა
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(featuredEpisode.date).toLocaleDateString('ka-GE')}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </section>

            {/* All Episodes */}
            <section className="py-16 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-bold">ყველა ეპიზოდი</h2>
                            <p className="text-muted-foreground">{episodes.length} ეპიზოდი</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {episodes.map((episode, i) => (
                            <Card key={episode.id} className="group hover-lift overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex items-center gap-6 p-6">
                                        {/* Episode Number */}
                                        <div className="hidden sm:flex w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-primary items-center justify-center text-white font-bold text-xl shrink-0">
                                            #{episode.id}
                                        </div>

                                        {/* Play Button */}
                                        <Button
                                            size="icon"
                                            className="w-12 h-12 rounded-full bg-purple-500/10 hover:bg-purple-500 text-purple-500 hover:text-white shrink-0"
                                        >
                                            <Play className="w-5 h-5 ml-0.5" />
                                        </Button>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg group-hover:text-purple-500 transition-colors truncate">
                                                {episode.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm line-clamp-1 mt-1">
                                                {episode.description}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                                {episode.topics.map((topic, j) => (
                                                    <Badge key={j} variant="secondary" className="text-xs">
                                                        {topic}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Meta */}
                                        <div className="hidden lg:flex items-center gap-6 text-sm text-muted-foreground shrink-0">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {episode.duration}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Headphones className="w-4 h-4" />
                                                {episode.listens.toLocaleString()}
                                            </span>
                                            <span>
                                                {new Date(episode.date).toLocaleDateString('ka-GE')}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button variant="ghost" size="icon">
                                                <Heart className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Share2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Button variant="outline">
                            მეტი ეპიზოდი
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Subscribe CTA */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-4">არ გამოტოვო ახალი ეპიზოდი</h2>
                    <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                        გამოიწერე პოდკასტი შენს საყვარელ პლატფორმაზე და მიიღე შეტყობინება
                        ყოველი ახალი ეპიზოდისას
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {platforms.map((platform) => (
                            <Button
                                key={platform.name}
                                size="lg"
                                variant="outline"
                                className="gap-2"
                                asChild
                            >
                                <a href={platform.url} target="_blank" rel="noopener noreferrer">
                                    <span className="text-xl">{platform.icon}</span>
                                    {platform.name}
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </Button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

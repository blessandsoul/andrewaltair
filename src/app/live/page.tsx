import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Video,
    Play,
    Calendar,
    Clock,
    Users,
    Bell,
    ArrowRight,
    ExternalLink,
    Youtube
} from "lucide-react"
import { brand } from "@/lib/brand"

const upcomingStreams = [
    {
        id: "1",
        title: "AI Weekly: კვირის სიახლეები და Q&A",
        description: "ყოველკვირეული ლაივი AI სიახლეებზე. დასვი კითხვები ლაივში!",
        date: "2025-01-03",
        time: "20:00",
        platform: "YouTube",
        recurring: true
    },
    {
        id: "2",
        title: "ChatGPT Deep Dive: Advanced Techniques",
        description: "სიღრმისეული სესია ChatGPT-ს მოწინავე ტექნიკებზე.",
        date: "2025-01-10",
        time: "19:00",
        platform: "YouTube",
        recurring: false
    }
]

const pastStreams = [
    {
        id: "p1",
        title: "Claude 3.5 მიმოხილვა ლაივში",
        date: "2024-12-20",
        duration: "1:45:32",
        views: 1234,
        thumbnail: null
    },
    {
        id: "p2",
        title: "AI ავტომატიზაცია Q&A",
        date: "2024-12-13",
        duration: "2:12:18",
        views: 987,
        thumbnail: null
    },
    {
        id: "p3",
        title: "Prompt Engineering ვორქშოპი",
        date: "2024-12-06",
        duration: "1:58:45",
        views: 1567,
        thumbnail: null
    },
    {
        id: "p4",
        title: "AI კონტენტ კრეაცია",
        date: "2024-11-29",
        duration: "1:32:10",
        views: 2341,
        thumbnail: null
    }
]

export default function LivePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-background to-primary/10">
                    <div className="absolute inset-0 noise-overlay"></div>
                </div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-4 py-2">
                            <Video className="w-4 h-4 mr-2" />
                            ლაივ სტრიმები
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            AI <span className="text-gradient">ლაივში</span>
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            ყოველკვირეული ლაივ სტრიმები AI-ზე, Q&A სესიები და ინტერაქტიული ვორქშოპები
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button
                                size="lg"
                                className="bg-red-500 hover:bg-red-600 text-white gap-2"
                                asChild
                            >
                                <a href={brand.social.youtube} target="_blank" rel="noopener noreferrer">
                                    <Youtube className="w-5 h-5" />
                                    გამოიწერე YouTube
                                </a>
                            </Button>
                            <Button variant="outline" size="lg" className="gap-2">
                                <Bell className="w-5 h-5" />
                                შეტყობინებების ჩართვა
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Currently Live Check */}
            <section className="py-8 bg-gradient-to-r from-red-500/10 via-red-500/5 to-red-500/10 border-y border-red-500/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                            <span className="text-muted-foreground">ამჟამად ლაივი არ მიმდინარეობს</span>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <a href={brand.social.youtube} target="_blank" rel="noopener noreferrer">
                                შეამოწმე YouTube-ზე
                                <ExternalLink className="w-4 h-4 ml-1" />
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Upcoming Streams */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">მომავალი ლაივები</h2>
                            <p className="text-muted-foreground">დაგეგმილი სტრიმები</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {upcomingStreams.map((stream) => (
                            <Card key={stream.id} className="overflow-hidden hover-lift">
                                <CardContent className="p-0">
                                    <div className="flex">
                                        {/* Date Block */}
                                        <div className="w-28 bg-gradient-to-br from-red-500 to-red-600 text-white p-4 flex flex-col items-center justify-center text-center shrink-0">
                                            <div className="text-3xl font-bold">
                                                {new Date(stream.date).getDate()}
                                            </div>
                                            <div className="text-sm">
                                                {new Date(stream.date).toLocaleDateString('ka-GE', { month: 'short' })}
                                            </div>
                                            <div className="text-xs mt-1 opacity-80">{stream.time}</div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge variant="outline" className="gap-1">
                                                    <Youtube className="w-3 h-3" />
                                                    {stream.platform}
                                                </Badge>
                                                {stream.recurring && (
                                                    <Badge className="bg-primary/10 text-primary border-primary/20">
                                                        ყოველკვირეული
                                                    </Badge>
                                                )}
                                            </div>

                                            <h3 className="font-bold text-lg mb-2">{stream.title}</h3>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                {stream.description}
                                            </p>

                                            <Button size="sm" variant="outline" className="gap-2">
                                                <Bell className="w-4 h-4" />
                                                შემახსენე
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Past Streams */}
            <section className="py-16 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                                <Play className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">წარსული ლაივები</h2>
                                <p className="text-muted-foreground">უყურე ჩანაწერებს</p>
                            </div>
                        </div>
                        <Button variant="outline" asChild>
                            <a href={brand.social.youtube} target="_blank" rel="noopener noreferrer">
                                ყველა YouTube-ზე
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                        </Button>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pastStreams.map((stream) => (
                            <Card key={stream.id} className="group overflow-hidden hover-lift cursor-pointer">
                                {/* Thumbnail */}
                                <div className="aspect-video bg-gradient-to-br from-red-500/20 to-primary/20 relative flex items-center justify-center">
                                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Play className="w-6 h-6 text-red-500 fill-red-500 ml-1" />
                                    </div>
                                    <Badge className="absolute bottom-2 right-2 bg-black/70 text-white border-0">
                                        {stream.duration}
                                    </Badge>
                                </div>

                                <CardContent className="p-4">
                                    <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                        {stream.title}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                                        <span>{stream.views.toLocaleString()} ნახვა</span>
                                        <span>•</span>
                                        <span>{new Date(stream.date).toLocaleDateString('ka-GE')}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Schedule Info */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <Card className="p-8 lg:p-12 text-center">
                        <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
                        <h2 className="text-2xl font-bold mb-4">ლაივების განრიგი</h2>
                        <div className="grid sm:grid-cols-2 gap-6 max-w-xl mx-auto mb-8">
                            <div className="p-4 rounded-xl bg-secondary/50">
                                <div className="font-bold text-lg">AI Weekly</div>
                                <div className="text-muted-foreground">პარასკევი, 20:00</div>
                            </div>
                            <div className="p-4 rounded-xl bg-secondary/50">
                                <div className="font-bold text-lg">სპეციალური ლაივები</div>
                                <div className="text-muted-foreground">შეტყობინებით</div>
                            </div>
                        </div>
                        <p className="text-muted-foreground mb-6">
                            გამოიწერე YouTube არხი და ჩართე შეტყობინებები რომ არ გამოტოვო ლაივი
                        </p>
                        <Button size="lg" className="bg-red-500 hover:bg-red-600 gap-2" asChild>
                            <a href={brand.social.youtube} target="_blank" rel="noopener noreferrer">
                                <Youtube className="w-5 h-5" />
                                გამოიწერე ახლავე
                            </a>
                        </Button>
                    </Card>
                </div>
            </section>
        </div>
    )
}

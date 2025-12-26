import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Video,
    ArrowRight,
    ExternalLink,
    Bell,
    Sparkles,
    Play,
    CheckCircle2,
    CalendarDays
} from "lucide-react"

const upcomingEvents = [
    {
        id: "1",
        title: "AI მასტერკლასი: ChatGPT Advanced",
        type: "workshop",
        format: "online",
        date: "2025-01-15",
        time: "19:00",
        duration: "2 საათი",
        description: "ისწავლე ChatGPT-ს Advanced ფუნქციები: Custom Instructions, GPTs, Vision და მეტი.",
        spots: 50,
        spotsLeft: 12,
        price: "უფასო",
        featured: true
    },
    {
        id: "2",
        title: "Live Q&A: AI ბიზნესში",
        type: "qa",
        format: "online",
        date: "2025-01-22",
        time: "20:00",
        duration: "1.5 საათი",
        description: "დასვი ნებისმიერი კითხვა AI-ს ბიზნესში გამოყენებაზე და მიიღე პასუხი ლაივში.",
        spots: 100,
        spotsLeft: 45,
        price: "უფასო",
        featured: false
    },
    {
        id: "3",
        title: "Make.com Automation Workshop",
        type: "workshop",
        format: "online",
        date: "2025-02-05",
        time: "19:00",
        duration: "3 საათი",
        description: "პრაქტიკული ვორქშოპი Make.com ავტომატიზაციების აწყობაზე. აწყობ 3 რეალურ ავტომატიზაციას.",
        spots: 30,
        spotsLeft: 8,
        price: "49 GEL",
        featured: true
    }
]

const pastEvents = [
    {
        id: "p1",
        title: "AI კონტენტ კრეაცია",
        type: "workshop",
        date: "2024-12-10",
        attendees: 156,
        recording: true
    },
    {
        id: "p2",
        title: "Claude vs ChatGPT: დეტალური შედარება",
        type: "webinar",
        date: "2024-11-28",
        attendees: 234,
        recording: true
    },
    {
        id: "p3",
        title: "Prompt Engineering მასტერკლასი",
        type: "workshop",
        date: "2024-11-15",
        attendees: 189,
        recording: true
    }
]

const typeLabels: Record<string, string> = {
    workshop: "ვორქშოპი",
    webinar: "ვებინარი",
    qa: "Q&A სესია",
    meetup: "Meetup"
}

const typeColors: Record<string, string> = {
    workshop: "#6366f1",
    webinar: "#10b981",
    qa: "#f59e0b",
    meetup: "#ec4899"
}

export default function EventsPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10">
                    <div className="absolute inset-0 noise-overlay"></div>
                </div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                            <CalendarDays className="w-4 h-4 mr-2" />
                            მოვლენები და ღონისძიებები
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            AI <span className="text-gradient">ღონისძიებები</span>
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            ვორქშოპები, ვებინარები და Live სესიები AI-ს სიღრმისეულ შესწავლაზე
                        </p>

                        <Button size="lg" className="gap-2" asChild>
                            <a href="#upcoming">
                                <Calendar className="w-5 h-5" />
                                მომავალი ღონისძიებები
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Upcoming Events */}
            <section id="upcoming" className="py-16 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">მომავალი ღონისძიებები</h2>
                                <p className="text-muted-foreground">დარეგისტრირდი ახლავე</p>
                            </div>
                        </div>
                        <Button variant="outline" className="gap-2">
                            <Bell className="w-4 h-4" />
                            შეტყობინებები
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {upcomingEvents.map((event) => (
                            <Card
                                key={event.id}
                                className={`overflow-hidden hover-lift ${event.featured ? "ring-2 ring-primary/50" : ""}`}
                            >
                                <div className="flex flex-col lg:flex-row">
                                    {/* Date Block */}
                                    <div
                                        className="lg:w-48 p-6 flex flex-col items-center justify-center text-center text-white"
                                        style={{ background: `linear-gradient(135deg, ${typeColors[event.type]}, ${typeColors[event.type]}CC)` }}
                                    >
                                        <div className="text-5xl font-bold">
                                            {new Date(event.date).getDate()}
                                        </div>
                                        <div className="text-lg">
                                            {new Date(event.date).toLocaleDateString('ka-GE', { month: 'short' })}
                                        </div>
                                        <Badge className="mt-2 bg-white/20 text-white border-0">
                                            {typeLabels[event.type]}
                                        </Badge>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6 flex flex-col lg:flex-row lg:items-center gap-6">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {event.featured && (
                                                    <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                                        ⭐ რეკომენდებული
                                                    </Badge>
                                                )}
                                                <Badge variant="outline" className="gap-1">
                                                    <Video className="w-3 h-3" />
                                                    {event.format === "online" ? "ონლაინ" : "ოფლაინ"}
                                                </Badge>
                                            </div>

                                            <h3 className="text-xl font-bold">{event.title}</h3>
                                            <p className="text-muted-foreground">{event.description}</p>

                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {event.time} ({event.duration})
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {event.spotsLeft}/{event.spots} ადგილი
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <div className="lg:text-right space-y-3">
                                            <div className="text-2xl font-bold">
                                                {event.price}
                                            </div>
                                            {event.spotsLeft < 15 && (
                                                <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                                                    🔥 მალე ამოიწურება
                                                </Badge>
                                            )}
                                            <Button size="lg" className="w-full lg:w-auto gap-2">
                                                დარეგისტრირდი
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Subscribe for Updates */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <Card className="overflow-hidden">
                        <div className="grid md:grid-cols-2">
                            <div className="p-8 lg:p-12 bg-gradient-to-br from-primary to-accent text-white">
                                <Bell className="w-12 h-12 mb-6" />
                                <h2 className="text-2xl font-bold mb-4">
                                    არ გამოტოვო ღონისძიება
                                </h2>
                                <p className="text-white/80">
                                    გამოიწერე და მიიღე შეტყობინება ახალი ღონისძიებების შესახებ პირველმა
                                </p>
                            </div>
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                                <form className="space-y-4">
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="შენი ელ-ფოსტა"
                                            className="w-full h-12 px-4 rounded-lg border border-input bg-background"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">
                                        <Bell className="w-4 h-4 mr-2" />
                                        შეტყობინებების გამოწერა
                                    </Button>
                                </form>
                                <p className="text-sm text-muted-foreground mt-4 text-center">
                                    მხოლოდ ღონისძიებების შესახებ. სპამი არ იქნება.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Past Events */}
            <section className="py-16 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                            <Play className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">წარსული ღონისძიებები</h2>
                            <p className="text-muted-foreground">უყურე ჩანაწერებს</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {pastEvents.map((event) => (
                            <Card key={event.id} className="group hover-lift">
                                <CardContent className="p-6">
                                    <Badge
                                        className="mb-3"
                                        style={{
                                            backgroundColor: `${typeColors[event.type]}20`,
                                            color: typeColors[event.type],
                                            borderColor: `${typeColors[event.type]}30`
                                        }}
                                    >
                                        {typeLabels[event.type]}
                                    </Badge>

                                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                                        {event.title}
                                    </h3>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(event.date).toLocaleDateString('ka-GE')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {event.attendees}
                                        </span>
                                    </div>

                                    {event.recording && (
                                        <Button variant="outline" size="sm" className="w-full gap-2">
                                            <Play className="w-4 h-4" />
                                            უყურე ჩანაწერს
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Button variant="outline">
                            ყველა ჩანაწერი
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Host an Event CTA */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                        გსურს AI ტრეინინგი შენი კომპანიისთვის?
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                        ვატარებ კორპორატიულ ტრეინინგებს და ვორქშოპებს თქვენს ოფისში ან ონლაინ
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" asChild>
                            <Link href="/services">
                                კორპორატიული ტრეინინგი
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/contact">
                                დაგვიკავშირდით
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    BookOpen,
    Download,
    ExternalLink,
    FileText,
    Sparkles,
    Video,
    Lightbulb,
    Send,
    Gift,
    Lock
} from "lucide-react"
import { brand } from "@/lib/brand"

const resources = [
    {
        id: "1",
        title: "ChatGPT პრომპტების კოლექცია",
        description: "100+ პროფესიონალური პრომპტი ყოველდღიური მუშაობისთვის",
        type: "pdf",
        category: "პრომპტები",
        free: true,
        downloads: 1234,
        featured: true,
    },
    {
        id: "2",
        title: "AI ავტომატიზაციის გზამკვლევი",
        description: "ნაბიჯ-ნაბიჯ სახელმძღვანელო Make.com + AI",
        type: "pdf",
        category: "ტუტორიალი",
        free: true,
        downloads: 892,
        featured: true,
    },
    {
        id: "3",
        title: "DALL-E 3 მასტერკლასი",
        description: "3-საათიანი ვიდეო კურსი სურათების გენერაციაზე",
        type: "video",
        category: "კურსი",
        free: false,
        downloads: 567,
        featured: true,
    },
    {
        id: "4",
        title: "AI სტარტაპის ტემპლეიტი",
        description: "Notion ტემპლეიტი AI პროექტის მართვისთვის",
        type: "notion",
        category: "ტემპლეიტი",
        free: true,
        downloads: 456,
    },
    {
        id: "5",
        title: "პროდუქტიულობის ჰაკები AI-ით",
        description: "ელექტრონული წიგნი 50 პრაქტიკული რჩევით",
        type: "ebook",
        category: "წიგნი",
        free: false,
        downloads: 321,
    },
    {
        id: "6",
        title: "AI ინსტრუმენტების ჩექლისტი",
        description: "კატეგორიების მიხედვით დალაგებული AI ხელსაწყოები",
        type: "pdf",
        category: "ჩექლისტი",
        free: true,
        downloads: 789,
    },
]

const typeIcons: Record<string, any> = {
    pdf: FileText,
    video: Video,
    notion: Sparkles,
    ebook: BookOpen,
}

export default function ResourcesPage() {
    const featuredResources = resources.filter(r => r.featured)
    const freeResources = resources.filter(r => r.free)

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative py-20 lg:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5">
                    <div className="absolute inset-0 noise-overlay"></div>
                </div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <Badge variant="secondary" className="px-4 py-2">
                            <Gift className="w-3 h-3 mr-2" />
                            უფასო რესურსები
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            <span className="text-gradient">AI რესურსები და მასალები</span>
                        </h1>

                        <p className="text-xl text-muted-foreground">
                            უფასო და პრემიუმ მასალები AI-ს შესწავლისთვის — PDF-ები, ტემპლეიტები, კურსები
                        </p>

                        <div className="flex gap-4 justify-center pt-4">
                            <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-white glow-sm">
                                <Download className="w-5 h-5 mr-2" />
                                უფასო მასალები
                            </Button>
                            <Button size="lg" variant="outline">
                                <Lightbulb className="w-5 h-5 mr-2" />
                                პრემიუმ კურსები
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Resources */}
            <section className="py-16 bg-card border-y border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">⭐ რჩეული რესურსები</h2>
                            <p className="text-muted-foreground">ყველაზე პოპულარული მასალები</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {featuredResources.map((resource) => {
                            const Icon = typeIcons[resource.type] || FileText

                            return (
                                <Card key={resource.id} className="group hover-lift card-shine border-0 shadow-xl overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
                                            <Icon className="w-16 h-16 text-primary/30 group-hover:scale-110 transition-transform" />
                                            {resource.free ? (
                                                <Badge className="absolute top-3 right-3 bg-green-500 text-white border-0">
                                                    <Gift className="w-3 h-3 mr-1" />
                                                    უფასო
                                                </Badge>
                                            ) : (
                                                <Badge className="absolute top-3 right-3 bg-amber-500 text-white border-0">
                                                    <Lock className="w-3 h-3 mr-1" />
                                                    პრემიუმ
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="p-6 space-y-3">
                                            <Badge variant="secondary">{resource.category}</Badge>
                                            <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                                                {resource.title}
                                            </h3>
                                            <p className="text-muted-foreground line-clamp-2">
                                                {resource.description}
                                            </p>
                                            <div className="flex items-center justify-between pt-2">
                                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Download className="w-4 h-4" />
                                                    {resource.downloads} გადმოწერა
                                                </span>
                                                <Button size="sm" className={resource.free ? "bg-primary" : "bg-amber-500"}>
                                                    {resource.free ? "გადმოწერა" : "შეძენა"}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* All Resources */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">📚 ყველა რესურსი</h2>
                            <p className="text-muted-foreground">{resources.length} მასალა</p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {resources.map((resource) => {
                            const Icon = typeIcons[resource.type] || FileText

                            return (
                                <Card key={resource.id} className="group hover-lift border shadow-sm hover:shadow-lg transition-all">
                                    <CardContent className="p-5 flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-6 h-6 text-primary" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className="font-semibold group-hover:text-primary transition-colors truncate">
                                                    {resource.title}
                                                </h4>
                                                {resource.free ? (
                                                    <Badge className="bg-green-500/10 text-green-600 text-xs flex-shrink-0">უფასო</Badge>
                                                ) : (
                                                    <Badge className="bg-amber-500/10 text-amber-600 text-xs flex-shrink-0">პრემიუმ</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                                {resource.description}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="outline" className="text-xs">{resource.category}</Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {resource.downloads} გადმოწერა
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 animated-gradient opacity-90"></div>
                <div className="absolute inset-0 noise-overlay"></div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center text-white">
                    <div className="space-y-6">
                        <Gift className="w-16 h-16 mx-auto opacity-80" />
                        <h2 className="text-3xl sm:text-4xl font-bold">
                            მიიღე ახალი რესურსები პირველმა
                        </h2>
                        <p className="text-xl text-white/80">
                            გამოიწერე და მიიღე ექსკლუზიური მასალები ელ-ფოსტაზე
                        </p>
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                            <Send className="w-5 h-5 mr-2" />
                            გამოწერა
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

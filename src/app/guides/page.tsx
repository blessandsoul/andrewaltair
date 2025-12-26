import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    BookOpen,
    Download,
    FileText,
    Lock,
    Mail,
    ArrowRight,
    Star,
    Check,
    Sparkles,
    Gift
} from "lucide-react"

const guides = [
    {
        id: "chatgpt-starter",
        title: "ChatGPT სრული გაიდი დამწყებთათვის",
        description: "50+ გვერდიანი PDF გაიდი ChatGPT-ს საფუძვლებზე. იდეალური პირველი ნაბიჯისთვის.",
        format: "PDF",
        pages: 54,
        downloads: 2340,
        free: true,
        featured: true,
        topics: ["ChatGPT", "საფუძვლები", "პრაქტიკა"],
        coverColor: "#6366f1"
    },
    {
        id: "prompt-cheatsheet",
        title: "Prompt Engineering Cheat Sheet",
        description: "ერთ გვერდზე ყველა მნიშვნელოვანი Prompting ტექნიკა და მაგალითი.",
        format: "PDF",
        pages: 2,
        downloads: 3567,
        free: true,
        featured: false,
        topics: ["Prompts", "Cheat Sheet"],
        coverColor: "#10b981"
    },
    {
        id: "ai-business",
        title: "AI ბიზნესში: პრაქტიკული გაიდი",
        description: "როგორ დანერგოთ AI თქვენს ბიზნესში. ROI კალკულაცია, use cases, სტრატეგია.",
        format: "PDF",
        pages: 78,
        downloads: 1234,
        free: false,
        featured: true,
        topics: ["ბიზნესი", "სტრატეგია", "ROI"],
        coverColor: "#f59e0b"
    },
    {
        id: "make-automation",
        title: "Make.com ავტომატიზაციის გაიდი",
        description: "პირველი ავტომატიზაციები Make.com-ზე. ნაბიჯ-ნაბიჯ ინსტრუქციები.",
        format: "PDF + Video",
        pages: 35,
        downloads: 892,
        free: true,
        featured: false,
        topics: ["Make.com", "ავტომატიზაცია"],
        coverColor: "#9333ea"
    },
    {
        id: "midjourney-prompts",
        title: "Midjourney Prompt Bible",
        description: "300+ Midjourney პრომპტი სხვადასხვა სტილისთვის. კატეგორიებით დალაგებული.",
        format: "Notion",
        pages: 0,
        downloads: 1567,
        free: false,
        featured: false,
        topics: ["Midjourney", "Prompts", "ვიზუალი"],
        coverColor: "#ec4899"
    }
]

export default function GuidesPage() {
    const featuredGuides = guides.filter(g => g.featured)
    const freeGuides = guides.filter(g => g.free)
    const paidGuides = guides.filter(g => !g.free)

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
                            <BookOpen className="w-4 h-4 mr-2" />
                            უფასო რესურსები
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            AI <span className="text-gradient">გაიდები</span> და რესურსები
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            უფასო და პრემიუმ გაიდები, e-books და cheat sheets AI-ს სიღრმისეულ შესწავლაზე
                        </p>

                        {/* Stats */}
                        <div className="flex items-center justify-center gap-8 pt-4">
                            <div className="text-center">
                                <div className="text-3xl font-bold">{guides.length}</div>
                                <div className="text-sm text-muted-foreground">გაიდი</div>
                            </div>
                            <div className="w-px h-12 bg-border"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold">{freeGuides.length}</div>
                                <div className="text-sm text-muted-foreground">უფასო</div>
                            </div>
                            <div className="w-px h-12 bg-border"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold">10K+</div>
                                <div className="text-sm text-muted-foreground">ჩამოტვირთვა</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Guides */}
            <section className="py-16 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Star className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">რეკომენდებული</h2>
                            <p className="text-muted-foreground">ყველაზე პოპულარული რესურსები</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {featuredGuides.map((guide) => (
                            <Card key={guide.id} className="group overflow-hidden hover-lift">
                                <div className="flex">
                                    {/* Cover */}
                                    <div
                                        className="w-32 shrink-0 flex items-center justify-center"
                                        style={{ backgroundColor: `${guide.coverColor}20` }}
                                    >
                                        <FileText
                                            className="w-12 h-12"
                                            style={{ color: guide.coverColor }}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline">{guide.format}</Badge>
                                            {guide.free ? (
                                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                                    უფასო
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                                    <Lock className="w-3 h-3 mr-1" />
                                                    პრემიუმ
                                                </Badge>
                                            )}
                                        </div>

                                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                                            {guide.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {guide.description}
                                        </p>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            {guide.pages > 0 && (
                                                <span>{guide.pages} გვერდი</span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Download className="w-4 h-4" />
                                                {guide.downloads.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Free Guides */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                                <Gift className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">უფასო გაიდები</h2>
                                <p className="text-muted-foreground">დაიწყე სწავლა ახლავე</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {freeGuides.map((guide) => (
                            <Card key={guide.id} className="group overflow-hidden hover-lift">
                                {/* Cover */}
                                <div
                                    className="h-32 flex items-center justify-center"
                                    style={{ backgroundColor: `${guide.coverColor}15` }}
                                >
                                    <FileText
                                        className="w-16 h-16"
                                        style={{ color: guide.coverColor }}
                                    />
                                </div>

                                <CardContent className="p-5">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {guide.topics.map((topic, i) => (
                                            <Badge key={i} variant="secondary" className="text-xs">
                                                {topic}
                                            </Badge>
                                        ))}
                                    </div>

                                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                                        {guide.title}
                                    </h3>

                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {guide.description}
                                    </p>
                                </CardContent>

                                <CardFooter className="p-5 pt-0 flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        {guide.format} • {guide.pages > 0 ? `${guide.pages} გვ` : 'ინტერაქტიული'}
                                    </div>
                                    <Button size="sm" className="gap-2">
                                        <Download className="w-4 h-4" />
                                        ჩამოტვირთვა
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Email Signup for Access */}
            <section className="py-16 bg-gradient-to-r from-primary/10 via-transparent to-accent/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
                    <Card className="p-8 lg:p-12 text-center">
                        <Mail className="w-12 h-12 mx-auto mb-4 text-primary" />
                        <h2 className="text-2xl font-bold mb-4">
                            მიიღე ყველა უფასო გაიდი ერთად
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            შეიყვანე ელ-ფოსტა და მიიღე ყველა უფასო რესურსი + ბონუს მასალები
                        </p>

                        <form className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Input
                                    type="email"
                                    placeholder="შენი ელ-ფოსტა"
                                    className="h-12"
                                />
                                <Button size="lg" className="gap-2">
                                    <Download className="w-5 h-5" />
                                    მიღება
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                სპამი არ იქნება. გამოწერის გაუქმება ნებისმიერ დროს.
                            </p>
                        </form>

                        <div className="flex flex-wrap justify-center gap-4 mt-8">
                            {[
                                "5 PDF გაიდი",
                                "Cheat Sheets",
                                "ბონუს პრომპტები",
                                "უფასო განახლებები"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                    <Check className="w-4 h-4 text-green-500" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </section>

            {/* Premium Guides */}
            {paidGuides.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">პრემიუმ გაიდები</h2>
                                <p className="text-muted-foreground">სიღრმისეული რესურსები</p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paidGuides.map((guide) => (
                                <Card key={guide.id} className="group overflow-hidden hover-lift border-yellow-500/20">
                                    <div
                                        className="h-32 flex items-center justify-center relative"
                                        style={{ backgroundColor: `${guide.coverColor}15` }}
                                    >
                                        <FileText
                                            className="w-16 h-16"
                                            style={{ color: guide.coverColor }}
                                        />
                                        <Badge className="absolute top-3 right-3 bg-yellow-500 text-white border-0">
                                            პრემიუმ
                                        </Badge>
                                    </div>

                                    <CardContent className="p-5">
                                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                                            {guide.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {guide.description}
                                        </p>
                                    </CardContent>

                                    <CardFooter className="p-5 pt-0">
                                        <Button className="w-full gap-2" asChild>
                                            <Link href="/products">
                                                დეტალები
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}

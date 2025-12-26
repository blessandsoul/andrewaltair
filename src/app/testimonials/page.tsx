import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Star,
    Quote,
    Users,
    Building2,
    GraduationCap,
    Code2,
    ArrowRight,
    Sparkles,
    MessageCircle
} from "lucide-react"
import testimonialsData from "@/data/testimonials.json"

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    business: Building2,
    developer: Code2,
    student: GraduationCap
}

const categoryLabels: Record<string, string> = {
    business: "ბიზნესი",
    developer: "დეველოპერი",
    student: "სტუდენტი"
}

export default function TestimonialsPage() {
    const featuredTestimonials = testimonialsData.filter(t => t.featured)
    const otherTestimonials = testimonialsData.filter(t => !t.featured)
    const categories = [...new Set(testimonialsData.map(t => t.category))]

    const averageRating = (
        testimonialsData.reduce((sum, t) => sum + t.rating, 0) / testimonialsData.length
    ).toFixed(1)

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-background to-primary/10">
                    <div className="absolute inset-0 noise-overlay"></div>
                </div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 px-4 py-2">
                            <Star className="w-4 h-4 mr-2 fill-current" />
                            კლიენტების შეფასებები
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            რას ამბობენ <span className="text-gradient">კლიენტები</span>
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            რეალური გამოხმაურება რეალური ადამიანებისგან, რომლებსაც AI-მ
                            ბიზნესის ან კარიერის ტრანსფორმაცია მოახდინა
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-3xl font-bold text-yellow-500">
                                    {averageRating}
                                    <Star className="w-8 h-8 fill-yellow-500 text-yellow-500" />
                                </div>
                                <div className="text-sm text-muted-foreground">საშუალო რეიტინგი</div>
                            </div>
                            <div className="w-px h-12 bg-border"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold">{testimonialsData.length}+</div>
                                <div className="text-sm text-muted-foreground">კმაყოფილი კლიენტი</div>
                            </div>
                            <div className="w-px h-12 bg-border"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold">100%</div>
                                <div className="text-sm text-muted-foreground">რეკომენდაციის მზაობა</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-secondary/30 border-y border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Button variant="secondary" className="bg-primary text-white gap-2">
                            <Users className="w-4 h-4" />
                            ყველა
                        </Button>
                        {categories.map(cat => {
                            const Icon = categoryIcons[cat] || Users
                            return (
                                <Button key={cat} variant="outline" className="gap-2">
                                    <Icon className="w-4 h-4" />
                                    {categoryLabels[cat] || cat}
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Featured Testimonials */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">გამორჩეული შეფასებები</h2>
                            <p className="text-muted-foreground">ყველაზე დეტალური გამოხმაურება</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {featuredTestimonials.map((testimonial) => {
                            const Icon = categoryIcons[testimonial.category] || Users
                            return (
                                <Card
                                    key={testimonial.id}
                                    className="relative overflow-hidden hover-lift bg-gradient-to-br from-primary/5 to-accent/5"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-500/20 to-transparent rounded-bl-full"></div>

                                    <CardContent className="p-6 space-y-4">
                                        {/* Rating */}
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${i < testimonial.rating
                                                            ? "text-yellow-500 fill-yellow-500"
                                                            : "text-muted-foreground/30"
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        {/* Quote */}
                                        <div className="relative">
                                            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                                            <p className="text-lg leading-relaxed pl-4">
                                                "{testimonial.text}"
                                            </p>
                                        </div>

                                        {/* Result Badge */}
                                        {testimonial.results && (
                                            <Badge className="bg-primary/10 text-primary border-primary/20">
                                                📈 {testimonial.results}
                                            </Badge>
                                        )}

                                        {/* Author */}
                                        <div className="flex items-center gap-4 pt-4 border-t border-border">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                                                {testimonial.name[0]}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold">{testimonial.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {testimonial.role} @ {testimonial.company}
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="gap-1">
                                                <Icon className="w-3 h-3" />
                                                {categoryLabels[testimonial.category]}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* All Testimonials */}
            <section className="py-16 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold">ყველა შეფასება</h2>
                        <p className="text-muted-foreground">დამატებითი გამოხმაურება</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {otherTestimonials.map((testimonial) => {
                            const Icon = categoryIcons[testimonial.category] || Users
                            return (
                                <Card key={testimonial.id} className="hover-lift">
                                    <CardContent className="p-5 space-y-3">
                                        {/* Rating */}
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < testimonial.rating
                                                            ? "text-yellow-500 fill-yellow-500"
                                                            : "text-muted-foreground/30"
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        {/* Quote */}
                                        <p className="text-sm text-muted-foreground line-clamp-4">
                                            "{testimonial.text}"
                                        </p>

                                        {/* Result */}
                                        {testimonial.results && (
                                            <div className="text-sm font-medium text-primary">
                                                📈 {testimonial.results}
                                            </div>
                                        )}

                                        {/* Author */}
                                        <div className="flex items-center gap-3 pt-3 border-t border-border">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                                {testimonial.name[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm truncate">{testimonial.name}</div>
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {testimonial.company}
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

            {/* Video Testimonials Placeholder */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2">ვიდეო შეფასებები</h2>
                        <p className="text-muted-foreground">უყურე კლიენტების მოთხრობებს</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="overflow-hidden group cursor-pointer">
                                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary border-b-8 border-b-transparent ml-1"></div>
                                    </div>
                                    <Badge className="absolute bottom-3 right-3 bg-black/70 text-white border-0">
                                        2:34
                                    </Badge>
                                </div>
                                <CardContent className="p-4">
                                    <div className="font-medium">კლიენტის ინტერვიუ #{i}</div>
                                    <div className="text-sm text-muted-foreground">მალე დაემატება</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-yellow-500/10 via-transparent to-primary/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl sm:text-4xl font-bold">
                            მზად ხარ შემდეგი წარმატებული კლიენტი გახდე?
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            შეუერთდი კმაყოფილ კლიენტებს და დაიწყე შენი AI ტრანსფორმაცია
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-primary to-accent text-white px-8"
                                asChild
                            >
                                <Link href="/services">
                                    დაჯავშნე კონსულტაცია
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link href="/case-studies">
                                    ნახე კეისები
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

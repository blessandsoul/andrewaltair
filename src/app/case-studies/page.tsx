import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowRight,
    TrendingUp,
    Clock,
    Building2,
    Sparkles,
    Quote,
    ChevronRight,
    Zap,
    Target,
    BarChart3,
    CheckCircle2
} from "lucide-react"
import caseStudiesData from "@/data/case-studies.json"

const industryColors: Record<string, string> = {
    "E-commerce": "#f59e0b",
    "Digital Marketing": "#ec4899",
    "Technology": "#6366f1",
    "Finance": "#10b981"
}

export default function CaseStudiesPage() {
    const featuredCases = caseStudiesData.filter(c => c.featured)
    const otherCases = caseStudiesData.filter(c => !c.featured)

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10">
                    <div className="absolute inset-0 noise-overlay"></div>
                </div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            წარმატებული კეისები
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            რეალური <span className="text-gradient">შედეგები</span>{" "}
                            რეალური კლიენტებისთვის
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            როგორ დაეხმარა AI ავტომატიზაცია სხვადასხვა ინდუსტრიის კომპანიებს
                            დროის დაზოგვაში და ეფექტიანობის გაზრდაში
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-8">
                            {[
                                { value: "50+", label: "პროექტი" },
                                { value: "85%", label: "საშ. დაზოგილი დრო" },
                                { value: "4.9", label: "კლიენტის რეიტინგი" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Case Studies */}
            <section className="py-16 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">გამორჩეული კეისები</h2>
                            <p className="text-muted-foreground">ყველაზე დიდი ტრანსფორმაციები</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {featuredCases.map((caseStudy, i) => (
                            <Card key={caseStudy.id} className="overflow-hidden hover-lift">
                                <div className="grid lg:grid-cols-2 gap-0">
                                    {/* Left - Visual */}
                                    <div
                                        className="p-8 lg:p-12 flex flex-col justify-center"
                                        style={{
                                            background: `linear-gradient(135deg, ${industryColors[caseStudy.industry]}15, ${industryColors[caseStudy.industry]}05)`
                                        }}
                                    >
                                        <Badge
                                            className="w-fit mb-4"
                                            style={{
                                                backgroundColor: `${industryColors[caseStudy.industry]}20`,
                                                color: industryColors[caseStudy.industry],
                                                borderColor: `${industryColors[caseStudy.industry]}30`
                                            }}
                                        >
                                            {caseStudy.industry}
                                        </Badge>

                                        <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                                            {caseStudy.title}
                                        </h3>

                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                                            <span className="flex items-center gap-1">
                                                <Building2 className="w-4 h-4" />
                                                {caseStudy.client}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {caseStudy.duration}
                                            </span>
                                        </div>

                                        {/* Results Grid */}
                                        <div className="grid grid-cols-3 gap-4">
                                            {caseStudy.results.map((result, j) => (
                                                <div key={j} className="text-center p-4 rounded-xl bg-background/80">
                                                    <div
                                                        className="text-2xl font-bold"
                                                        style={{ color: industryColors[caseStudy.industry] }}
                                                    >
                                                        {result.value}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{result.metric}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right - Content */}
                                    <div className="p-8 lg:p-12 space-y-6">
                                        <div>
                                            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                                                <Target className="w-5 h-5 text-red-500" />
                                                გამოწვევა
                                            </h4>
                                            <p className="text-muted-foreground">{caseStudy.challenge}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                                                <Zap className="w-5 h-5 text-primary" />
                                                გადაწყვეტა
                                            </h4>
                                            <p className="text-muted-foreground">{caseStudy.solution}</p>
                                        </div>

                                        {/* Technologies */}
                                        <div className="flex flex-wrap gap-2">
                                            {caseStudy.technologies.map((tech, j) => (
                                                <Badge key={j} variant="secondary">
                                                    {tech}
                                                </Badge>
                                            ))}
                                        </div>

                                        {/* Testimonial */}
                                        <div className="p-4 rounded-xl bg-secondary/50 border-l-4 border-primary">
                                            <Quote className="w-6 h-6 text-primary/50 mb-2" />
                                            <p className="italic text-muted-foreground mb-3">
                                                "{caseStudy.testimonial.text}"
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                                    {caseStudy.testimonial.author[0]}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{caseStudy.testimonial.author}</div>
                                                    <div className="text-sm text-muted-foreground">{caseStudy.testimonial.role}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Other Case Studies */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-bold">სხვა პროექტები</h2>
                            <p className="text-muted-foreground">დამატებითი წარმატების ისტორიები</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {otherCases.map((caseStudy) => (
                            <Card key={caseStudy.id} className="group hover-lift overflow-hidden">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <Badge
                                            style={{
                                                backgroundColor: `${industryColors[caseStudy.industry]}20`,
                                                color: industryColors[caseStudy.industry],
                                                borderColor: `${industryColors[caseStudy.industry]}30`
                                            }}
                                        >
                                            {caseStudy.industry}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">{caseStudy.year}</span>
                                    </div>
                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                        {caseStudy.title}
                                    </h3>
                                    <div className="flex gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Building2 className="w-4 h-4" />
                                            {caseStudy.client}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {caseStudy.duration}
                                        </span>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <p className="text-muted-foreground mb-4 line-clamp-2">
                                        {caseStudy.challenge}
                                    </p>

                                    {/* Key Result */}
                                    <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                                        <TrendingUp
                                            className="w-8 h-8"
                                            style={{ color: industryColors[caseStudy.industry] }}
                                        />
                                        <div>
                                            <div className="font-bold" style={{ color: industryColors[caseStudy.industry] }}>
                                                {caseStudy.results[0].value}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {caseStudy.results[0].metric} - {caseStudy.results[0].description}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Technologies */}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {caseStudy.technologies.slice(0, 3).map((tech, j) => (
                                            <Badge key={j} variant="outline" className="text-xs">
                                                {tech}
                                            </Badge>
                                        ))}
                                        {caseStudy.technologies.length > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{caseStudy.technologies.length - 3}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary/10 via-transparent to-accent/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl sm:text-4xl font-bold">
                            მზად ხარ შენი წარმატების ისტორიისთვის?
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            მოგვიყევი შენი გამოწვევის შესახებ და ერთად შევქმნით AI გადაწყვეტას
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
                                <Link href="/contact">
                                    დაგვიკავშირდი
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

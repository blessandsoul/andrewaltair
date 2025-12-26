import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    MessageCircle,
    Send,
    Youtube,
    Heart,
    ArrowRight,
    ExternalLink,
    Star,
    Zap,
    Gift,
    BookOpen,
    Trophy,
    CheckCircle2
} from "lucide-react"
import { brand } from "@/lib/brand"

const communities = [
    {
        name: "Telegram ჯგუფი",
        platform: "telegram",
        icon: Send,
        color: "#0088cc",
        members: "5K+",
        description: "ყოველდღიური AI სიახლეები, დისკუსიები და Q&A",
        url: brand.social.telegram,
        features: ["უფასო წვდომა", "დღიური რჩევები", "Q&A სესიები"]
    },
    {
        name: "Discord სერვერი",
        platform: "discord",
        icon: MessageCircle,
        color: "#5865F2",
        members: "2K+",
        description: "დეტალური დისკუსიები, ვოის ჩატები და ექსკლუზიური კონტენტი",
        url: "https://discord.gg/andrewaltair",
        features: ["Voice Channels", "რესურსების ბიბლიოთეკა", "Role რანგები"]
    },
    {
        name: "YouTube",
        platform: "youtube",
        icon: Youtube,
        color: "#FF0000",
        members: "25K+",
        description: "ვიდეო ტუტორიალები, მიმოხილვები და ლაივ სტრიმები",
        url: brand.social.youtube,
        features: ["HD ვიდეოები", "ლაივ Q&A", "კომენტარებში მხარდაჭერა"]
    }
]

const memberBenefits = [
    {
        icon: Zap,
        title: "ადრეული წვდომა",
        description: "ახალ კონტენტს მიიღებ სანამ საჯაროდ გამოქვეყნდება"
    },
    {
        icon: Gift,
        title: "ექსკლუზიური ფასდაკლებები",
        description: "სპეციალური შეთავაზებები პროდუქტებზე და სერვისებზე"
    },
    {
        icon: MessageCircle,
        title: "პირდაპირი კომუნიკაცია",
        description: "დასვი კითხვები და მიიღე პასუხი პირდაპირ"
    },
    {
        icon: BookOpen,
        title: "რესურსების ბიბლიოთეკა",
        description: "ექსკლუზიური მასალები, ტემპლეიტები და გაიდები"
    },
    {
        icon: Users,
        title: "Networking",
        description: "შეხვდი მსგავს ინტერესების მქონე ადამიანებს"
    },
    {
        icon: Trophy,
        title: "AI ჩელენჯები",
        description: "მონაწილეობა ყოველკვირეულ AI გამოწვევებში პრიზებით"
    }
]

const rules = [
    "იყავი პატივისცემით სხვა წევრების მიმართ",
    "არ გაავრცელო სპამი ან რეკლამა ნებართვის გარეშე",
    "დაიცავი AI-ს ეთიკური გამოყენების პრინციპები",
    "დაეხმარე სხვებს და გაუზიარე ცოდნა"
]

export default function CommunityPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-background to-primary/10">
                    <div className="absolute inset-0 noise-overlay"></div>
                    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                </div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 px-4 py-2">
                            <Users className="w-4 h-4 mr-2" />
                            AI კომიუნითი
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            შეუერთდი <span className="text-gradient">AI ენთუზიასტების</span> ერთობას
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            ათასობით ადამიანი უკვე სწავლობს, იზიარებს გამოცდილებას და
                            ერთად ივითარებს AI უნარებს
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold">30K+</div>
                                <div className="text-sm text-muted-foreground">წევრი</div>
                            </div>
                            <div className="w-px h-12 bg-border"></div>
                            <div className="text-center">
                                <div className="text-4xl font-bold">5K+</div>
                                <div className="text-sm text-muted-foreground">შეტყობინება/კვირა</div>
                            </div>
                            <div className="w-px h-12 bg-border"></div>
                            <div className="text-center">
                                <div className="text-4xl font-bold">24/7</div>
                                <div className="text-sm text-muted-foreground">აქტიური</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Platforms */}
            <section className="py-16 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">შეუერთდი პლატფორმას</h2>
                        <p className="text-muted-foreground text-lg">აირჩიე შენთვის მოსახერხებელი</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {communities.map((community) => (
                            <Card
                                key={community.platform}
                                className="group hover-lift overflow-hidden relative"
                            >
                                <div
                                    className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-20"
                                    style={{ backgroundColor: community.color }}
                                ></div>

                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                            style={{ backgroundColor: `${community.color}20` }}
                                        >
                                            <community.icon
                                                className="w-7 h-7"
                                                style={{ color: community.color }}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{community.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Users className="w-4 h-4" />
                                                {community.members} წევრი
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <p className="text-muted-foreground">{community.description}</p>

                                    <ul className="space-y-2">
                                        {community.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm">
                                                <CheckCircle2
                                                    className="w-4 h-4"
                                                    style={{ color: community.color }}
                                                />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        className="w-full gap-2"
                                        style={{
                                            backgroundColor: community.color,
                                            color: "white"
                                        }}
                                        asChild
                                    >
                                        <a href={community.url} target="_blank" rel="noopener noreferrer">
                                            შეუერთდი
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Member Benefits */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">წევრობის უპირატესობები</h2>
                        <p className="text-muted-foreground text-lg">
                            რატომ უნდა შეუერთდე AI კომიუნითის?
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {memberBenefits.map((benefit, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                    <benefit.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                                <p className="text-muted-foreground">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Community Guidelines */}
            <section className="py-16 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <Card className="p-8 lg:p-12">
                        <div className="text-center mb-8">
                            <Heart className="w-12 h-12 mx-auto mb-4 text-red-500" />
                            <h2 className="text-2xl font-bold mb-2">კომიუნითის წესები</h2>
                            <p className="text-muted-foreground">
                                ვქმნით უსაფრთხო და დახმარების კულტურას
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {rules.map((rule, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary font-bold">
                                        {i + 1}
                                    </div>
                                    <p>{rule}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">წევრების გამოხმაურება</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                text: "კომიუნითი საოცრად დახმარეა! პასუხებს ძალიან სწრაფად ვიღებ და ბევრი ახალი რამ ვისწავლე.",
                                author: "გიორგი მ.",
                                since: "წევრი 2024-დან"
                            },
                            {
                                text: "Discord-ის voice channels-ში დისკუსიები ძალიან საინტერესოა. ლაივ Q&A სესიები განსაკუთრებით!",
                                author: "ანა კ.",
                                since: "წევრი 2023-დან"
                            },
                            {
                                text: "ექსკლუზიური ფასდაკლებებით AI კურსი გაცილებით იაფად ვიყიდე. 100% გირჩევთ!",
                                author: "დავით თ.",
                                since: "წევრი 2024-დან"
                            }
                        ].map((testimonial, i) => (
                            <Card key={i} className="p-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        {testimonial.author[0]}
                                    </div>
                                    <div>
                                        <div className="font-medium">{testimonial.author}</div>
                                        <div className="text-sm text-muted-foreground">{testimonial.since}</div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-purple-500/10 via-transparent to-primary/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl sm:text-4xl font-bold">
                            მზად ხარ AI მოგზაურობის დასაწყებად?
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            შეუერთდი ათასობით ენთუზიასტს და დაიწყე სწავლა დღესვე
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-purple-500 to-primary text-white px-8"
                                asChild
                            >
                                <a href={brand.social.telegram} target="_blank" rel="noopener noreferrer">
                                    <Send className="w-5 h-5 mr-2" />
                                    Telegram-ზე შეუერთდი
                                </a>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link href="/faq">
                                    FAQ
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

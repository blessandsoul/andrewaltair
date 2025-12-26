import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Gift,
    Sparkles,
    DollarSign,
    TrendingUp,
    Users,
    Link2,
    Copy,
    Check,
    ArrowRight,
    Zap,
    Target,
    Award,
    ExternalLink,
    Percent
} from "lucide-react"

const affiliateTools = [
    {
        name: "ChatGPT Plus",
        category: "AI Чатботы",
        commission: "25%",
        commissionType: "recurring",
        logo: "🤖",
        color: "#10a37f"
    },
    {
        name: "Midjourney",
        category: "AI Графика",
        commission: "20%",
        commissionType: "first-month",
        logo: "🎨",
        color: "#6366f1"
    },
    {
        name: "Make.com",
        category: "Автоматизация",
        commission: "30%",
        commissionType: "recurring",
        logo: "⚡",
        color: "#9333ea"
    },
    {
        name: "Notion AI",
        category: "Продуктивность",
        commission: "15%",
        commissionType: "first-year",
        logo: "📝",
        color: "#000"
    },
    {
        name: "Copy.ai",
        category: "AI Copywriting",
        commission: "35%",
        commissionType: "recurring",
        logo: "✍️",
        color: "#ec4899"
    },
    {
        name: "Jasper AI",
        category: "AI Контент",
        commission: "30%",
        commissionType: "recurring",
        logo: "💎",
        color: "#f97316"
    }
]

export default function AffiliatesPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-background to-primary/10">
                    <div className="absolute inset-0 noise-overlay"></div>
                    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-4 py-2">
                            <DollarSign className="w-4 h-4 mr-2" />
                            პარტნიორული პროგრამა
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            გამოიმუშავე <span className="text-gradient">AI რეკომენდაციებით</span>
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            რეკომენდაცია გაუწიე საუკეთესო AI ინსტრუმენტებს და მიიღე
                            <span className="font-bold text-green-500"> 20-35% კომისია</span> ყოველი გაყიდვიდან
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white px-8 py-6 text-lg"
                                asChild
                            >
                                <a href="#join">
                                    <Gift className="w-5 h-5 mr-2" />
                                    გახდი პარტნიორი
                                </a>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="px-8 py-6 text-lg"
                                asChild
                            >
                                <a href="#tools">
                                    ინსტრუმენტები
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Potential Earnings */}
                    <div className="mt-16 max-w-4xl mx-auto">
                        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
                            <CardContent className="p-8">
                                <div className="grid md:grid-cols-3 gap-8 text-center">
                                    <div>
                                        <div className="text-4xl font-bold text-green-500">$500+</div>
                                        <div className="text-muted-foreground">თვიური შემოსავალი</div>
                                        <div className="text-sm text-muted-foreground mt-1">საშუალო პარტნიორის</div>
                                    </div>
                                    <div>
                                        <div className="text-4xl font-bold text-green-500">35%</div>
                                        <div className="text-muted-foreground">მაქს. კომისია</div>
                                        <div className="text-sm text-muted-foreground mt-1">რეკურენტული</div>
                                    </div>
                                    <div>
                                        <div className="text-4xl font-bold text-green-500">90 დღე</div>
                                        <div className="text-muted-foreground">Cookie ვადა</div>
                                        <div className="text-sm text-muted-foreground mt-1">შეკვეთის თრექინგი</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">როგორ მუშაობს?</h2>
                        <p className="text-muted-foreground text-lg">3 მარტივი ნაბიჯი შემოსავლისკენ</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                step: "1",
                                icon: Link2,
                                title: "აიღე ლინკი",
                                description: "დარეგისტრირდი და მიიღე უნიკალური რეფერალ ლინკები ყველა AI ინსტრუმენტზე"
                            },
                            {
                                step: "2",
                                icon: Users,
                                title: "გააზიარე",
                                description: "გააზიარე ლინკები სოციალურ ქსელებში, ბლოგში ან პირდაპირ მეგობრებთან"
                            },
                            {
                                step: "3",
                                icon: DollarSign,
                                title: "გამოიმუშავე",
                                description: "მიიღე კომისია ყოველ შეკვეთაზე, რომელიც შენი ლინკით მოვა"
                            }
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                                    <item.icon className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-muted-foreground">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Affiliate Tools */}
            <section id="tools" className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">AI ინსტრუმენტები</h2>
                        <p className="text-muted-foreground text-lg">
                            რეკომენდაცია გაუწიე ამ პოპულარულ ინსტრუმენტებს
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {affiliateTools.map((tool, i) => (
                            <Card key={i} className="group hover-lift overflow-hidden">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                                style={{ backgroundColor: `${tool.color}15` }}
                                            >
                                                {tool.logo}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{tool.name}</h3>
                                                <p className="text-sm text-muted-foreground">{tool.category}</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                            <Percent className="w-3 h-3 mr-1" />
                                            {tool.commission}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            {tool.commissionType === "recurring" && "რეკურენტული"}
                                            {tool.commissionType === "first-month" && "პირველი თვე"}
                                            {tool.commissionType === "first-year" && "პირველი წელი"}
                                        </span>
                                        <Button size="sm" variant="outline" className="gap-2">
                                            <ExternalLink className="w-4 h-4" />
                                            ლინკი
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <p className="text-muted-foreground mb-4">
                            + 20 სხვა AI ინსტრუმენტი
                        </p>
                        <Button variant="outline">
                            ყველას ნახვა
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                                უპირატესობები
                            </Badge>
                            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                                რატომ გახდე ჩემი პარტნიორი?
                            </h2>
                            <div className="space-y-4">
                                {[
                                    {
                                        icon: TrendingUp,
                                        title: "მაღალი კომისიები",
                                        desc: "20-35% კომისია ყოველ გაყიდვაზე, ზოგი რეკურენტული"
                                    },
                                    {
                                        icon: Zap,
                                        title: "სწრაფი გადახდა",
                                        desc: "ყოველთვიური გადახდა PayPal-ზე ან ბარათზე"
                                    },
                                    {
                                        icon: Target,
                                        title: "მარკეტინგ მასალები",
                                        desc: "მზა ბანერები, ტექსტები და სტრატეგიები"
                                    },
                                    {
                                        icon: Award,
                                        title: "VIP მხარდაჭერა",
                                        desc: "პირადი მენეჯერი და ექსკლუზიური რჩევები"
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                            <item.icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Calculator */}
                        <Card className="p-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-500" />
                                შემოსავლის კალკულატორი
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        მოსალოდნელი რეფერალები თვეში
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="მაგ: 10"
                                        defaultValue="10"
                                        className="h-12"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        საშუალო შეკვეთის ღირებულება
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="მაგ: $50"
                                        defaultValue="50"
                                        className="h-12"
                                    />
                                </div>

                                <div className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30">
                                    <div className="text-center">
                                        <div className="text-sm text-muted-foreground mb-1">
                                            მოსალოდნელი თვიური შემოსავალი
                                        </div>
                                        <div className="text-4xl font-bold text-green-500">
                                            $125 - $175
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            25-35% კომისიით
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Join Form */}
            <section id="join" className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
                    <Card className="overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
                            <Gift className="w-12 h-12 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">გახდი პარტნიორი დღესვე</h2>
                            <p className="text-white/80">
                                უფასო რეგისტრაცია • მყისიერი დაშვება • შეზღუდვების გარეშე
                            </p>
                        </div>

                        <CardContent className="p-8">
                            <form className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">სახელი</label>
                                        <Input placeholder="თქვენი სახელი" className="h-12" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">ელ-ფოსტა</label>
                                        <Input type="email" placeholder="email@example.com" className="h-12" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        როგორ აპირებ პრომოციას?
                                    </label>
                                    <select className="w-full h-12 px-4 rounded-lg border border-input bg-background">
                                        <option value="">აირჩიე...</option>
                                        <option value="blog">ბლოგი/ვებსაიტი</option>
                                        <option value="youtube">YouTube</option>
                                        <option value="social">სოციალური ქსელები</option>
                                        <option value="email">Email მარკეტინგი</option>
                                        <option value="other">სხვა</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        შენი ვებსაიტი ან სოციალური პროფილი (არასავალდებულო)
                                    </label>
                                    <Input placeholder="https://..." className="h-12" />
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white h-12"
                                >
                                    <Gift className="w-5 h-5 mr-2" />
                                    რეგისტრაცია
                                </Button>

                                <p className="text-center text-sm text-muted-foreground">
                                    რეგისტრაციით ეთანხმები{" "}
                                    <Link href="/terms" className="text-primary hover:underline">
                                        პირობებს
                                    </Link>
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold">ხშირად დასმული კითხვები</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "რამდენ ხანს ინახება Cookie?",
                                a: "90 დღე. ანუ თუ ვინმე შენი ლინკით მოვა და 90 დღის განმავლობაში შეიძენს, კომისიას მიიღებ."
                            },
                            {
                                q: "როდის და როგორ ხდება გადახდა?",
                                a: "გადახდა ხდება ყოველი თვის ბოლოს PayPal-ზე ან საბანკო გადარიცხვით. მინიმალური ზღვარი $50."
                            },
                            {
                                q: "შემიძლია ჩემს პროდუქტებზეც მივიღო კომისია?",
                                a: "დიახ! თუ შენი ლინკით ვინმე ჩემს პროდუქტებს შეიძენს, 20% კომისიას მიიღებ."
                            }
                        ].map((faq, i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                                    <p className="text-muted-foreground">{faq.a}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

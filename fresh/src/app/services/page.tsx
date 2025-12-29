import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    ArrowRight,
    Check,
    Calendar,
    MessageCircle,
    Star,
    Lightbulb,
    GraduationCap,
    Zap,
    PenTool,
    Clock,
    Users,
    Award,
    Sparkles,
    Send
} from "lucide-react"
import { brand } from "@/lib/brand"

// Fetch services from API
async function getServices() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/services`, {
            cache: 'no-store'
        })
        if (res.ok) {
            const data = await res.json()
            return data.services || []
        }
    } catch (error) {
        console.error('Error fetching services:', error)
    }
    return []
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Lightbulb,
    GraduationCap,
    Zap,
    PenTool
}

export default async function ServicesPage() {
    const servicesData = await getServices()

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10">
                    <div className="absolute inset-0 noise-overlay"></div>
                    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                            <Sparkles className="w-4 h-4 mr-2" />
                            პროფესიონალური სერვისები
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            AI-ით <span className="text-gradient">გაძლიერება</span>{" "}
                            თქვენი ბიზნესისთვის
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            დახმარებას გაგიწევთ ხელოვნური ინტელექტის დანერგვაში, ავტომატიზაციაში
                            და თქვენი გუნდის სწავლებაში
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-8 py-6 text-lg glow-sm"
                                asChild
                            >
                                <a href="#booking">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    დაჯავშნე კონსულტაცია
                                </a>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="px-8 py-6 text-lg"
                                asChild
                            >
                                <a href="#services">
                                    სერვისების ნახვა
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
                        {[
                            { icon: Users, value: "50+", label: "კლიენტი" },
                            { icon: Award, value: "8+", label: "წლის გამოცდილება" },
                            { icon: Star, value: "4.9", label: "რეიტინგი" },
                            { icon: Clock, value: "24h", label: "პასუხის დრო" }
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur border border-border/50"
                            >
                                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section id="services" className="py-20 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            ჩემი სერვისები
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            მოქნილი გადაწყვეტილებები ნებისმიერი მასშტაბის ბიზნესისთვის
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                        {servicesData.map((service) => {
                            const Icon = iconMap[service.icon] || Sparkles
                            return (
                                <Card
                                    key={service.id}
                                    className={`relative overflow-hidden hover-lift transition-all duration-300 ${service.popular ? "ring-2 ring-primary/50" : ""
                                        }`}
                                >
                                    {service.popular && (
                                        <div className="absolute top-4 right-4">
                                            <Badge className="bg-primary text-white">
                                                <Star className="w-3 h-3 mr-1" />
                                                პოპულარული
                                            </Badge>
                                        </div>
                                    )}

                                    <CardHeader className="pb-4">
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                                            style={{ backgroundColor: `${service.color}20` }}
                                        >
                                            <Icon
                                                className="w-7 h-7"
                                                style={{ color: service.color }}
                                            />
                                        </div>
                                        <h3 className="text-2xl font-bold">{service.title}</h3>
                                        <p className="text-muted-foreground">{service.description}</p>
                                    </CardHeader>

                                    <CardContent className="pb-4">
                                        <ul className="space-y-3">
                                            {service.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>

                                    <CardFooter className="flex items-center justify-between pt-4 border-t border-border">
                                        <div>
                                            <div className="text-3xl font-bold">
                                                {service.pricing.price}
                                                <span className="text-lg font-normal text-muted-foreground ml-1">
                                                    {service.pricing.currency}
                                                </span>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                / {service.pricing.unit}
                                                {service.pricing.note && (
                                                    <span className="ml-1">({service.pricing.note})</span>
                                                )}
                                            </div>
                                        </div>
                                        <Button asChild>
                                            <a href="#booking">
                                                დაჯავშნე
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </a>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            როგორ მუშაობს?
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            მარტივი და გამჭვირვალე პროცესი შედეგზე ორიენტირებული
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                step: "01",
                                title: "უფასო კონსულტაცია",
                                description: "გავიგებთ თქვენს მიზნებს და გამოწვევებს 15-წუთიანი ზარით"
                            },
                            {
                                step: "02",
                                title: "ანალიზი და გეგმა",
                                description: "მოვამზადებთ დეტალურ წინადადებას და სამუშაო გეგმას"
                            },
                            {
                                step: "03",
                                title: "დანერგვა",
                                description: "ვმუშაობთ თქვენთან ერთად AI გადაწყვეტილებების დანერგვაზე"
                            },
                            {
                                step: "04",
                                title: "მხარდაჭერა",
                                description: "მუდმივი მხარდაჭერა და ოპტიმიზაცია შედეგების გასაუმჯობესებლად"
                            }
                        ].map((item, i) => (
                            <div key={i} className="relative">
                                {i < 3 && (
                                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-y-1/2 z-0"></div>
                                )}
                                <div className="relative z-10 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                                        {item.step}
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground text-sm">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Booking Section */}
            <section id="booking" className="py-20 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Calendly Embed Placeholder */}
                        <div className="order-2 lg:order-1">
                            <Card className="overflow-hidden">
                                <CardContent className="p-0">
                                    {/* Calendly Widget Placeholder - Replace with actual Calendly embed */}
                                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center relative">
                                        <div className="text-center p-8">
                                            <Calendar className="w-16 h-16 mx-auto mb-4 text-primary/50" />
                                            <h3 className="text-xl font-bold mb-2">აირჩიე დრო</h3>
                                            <p className="text-muted-foreground mb-6">
                                                დააჭირე ქვემოთ Calendly-ში დასაჯავშნად
                                            </p>
                                            <Button
                                                size="lg"
                                                className="bg-gradient-to-r from-primary to-accent text-white"
                                                asChild
                                            >
                                                <a
                                                    href="https://calendly.com/andrewaltair"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Calendar className="w-5 h-5 mr-2" />
                                                    გახსენი Calendly
                                                </a>
                                            </Button>
                                        </div>
                                        <div className="absolute inset-0 border-2 border-dashed border-primary/20 m-4 rounded-lg pointer-events-none"></div>
                                    </div>
                                </CardContent>
                            </Card>
                            <p className="text-center text-sm text-muted-foreground mt-4">
                                15-წუთიანი უფასო კონსულტაცია • Zoom ან Google Meet
                            </p>
                        </div>

                        {/* Contact Form */}
                        <div className="order-1 lg:order-2">
                            <div className="mb-8">
                                <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    დაგვიკავშირდით
                                </Badge>
                                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                    გაგზავნე შეტყობინება
                                </h2>
                                <p className="text-muted-foreground">
                                    თუ გაქვთ შეკითხვები ან გსურთ განიხილოთ თქვენი პროექტი დეტალურად,
                                    შეავსეთ ფორმა და დაგიკავშირდებით 24 საათში.
                                </p>
                            </div>

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
                                    <label className="block text-sm font-medium mb-2">სერვისი</label>
                                    <select className="w-full h-12 px-4 rounded-lg border border-input bg-background">
                                        <option value="">აირჩიეთ სერვისი</option>
                                        {servicesData.map((service) => (
                                            <option key={service.id} value={service.id}>
                                                {service.title}
                                            </option>
                                        ))}
                                        <option value="other">სხვა</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">შეტყობინება</label>
                                    <Textarea
                                        placeholder="მოგვიყევით თქვენი პროექტის ან გამოწვევის შესახებ..."
                                        className="min-h-[120px] resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-primary to-accent text-white h-12"
                                >
                                    <Send className="w-5 h-5 mr-2" />
                                    გაგზავნა
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            ხშირად დასმული კითხვები
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "რა ფორმატით მიმდინარეობს კონსულტაცია?",
                                a: "კონსულტაციები მიმდინარეობს Zoom ან Google Meet-ით. ასევე შესაძლებელია პირადი შეხვედრა თბილისში."
                            },
                            {
                                q: "რამდენი დრო სჭირდება AI ავტომატიზაციის დანერგვას?",
                                a: "დამოკიდებულია პროექტის სირთულეზე. მარტივი ავტომატიზაციები შეიძლება დასრულდეს 1-2 კვირაში, ხოლო კომპლექსური - 1-2 თვეში."
                            },
                            {
                                q: "მუშაობთ საერთაშორისო კლიენტებთან?",
                                a: "დიახ! ვმუშაობ კლიენტებთან მთელი მსოფლიოდან. კონსულტაციები შესაძლებელია ქართულად და ინგლისურად."
                            },
                            {
                                q: "არის უფასო კონსულტაცია?",
                                a: "დიახ, პირველი 15-წუთიანი საწყისი კონსულტაცია უფასოა. ამ დროს განვიხილავთ თქვენს მიზნებს და შევაფასებთ, როგორ შემიძლია დაგეხმაროთ."
                            }
                        ].map((faq, i) => (
                            <Card key={i} className="overflow-hidden">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                                    <p className="text-muted-foreground">{faq.a}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <p className="text-muted-foreground mb-4">
                            კიდევ გაქვთ შეკითხვები?
                        </p>
                        <Button variant="outline" asChild>
                            <Link href="/contact">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                დაგვიკავშირდით
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

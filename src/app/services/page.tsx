import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TbArrowRight, TbCheck, TbMessage, TbStar, TbBulb, TbSchool, TbBolt, TbPencil, TbClock, TbUsers, TbAward, TbSparkles, TbSend, TbRocket, TbChartBar, TbDeviceLaptop, TbBrandGoogle, TbBrandSlack, TbBrandNotion, TbBrandZoom, TbBrandOpenai } from "react-icons/tb"
import { brand } from "@/lib/brand"
import { ContactForm } from "@/components/services/ContactForm"
import { TestimonialsCarousel } from "@/components/services/TestimonialsCarousel"
import { AnimatedCounter } from "@/components/ui/AnimatedCounter"

// Client wrapper for ContactForm to pass services data
function ContactFormWrapper({ services }: { services: { id: string; title: string }[] }) {
    return <ContactForm services={services} />
}

// Client wrapper for stats with animatedcounters
function AnimatedStats() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            {[
                { icon: TbUsers, value: 50, suffix: "+", label: "კლიენტი" },
                { icon: TbAward, value: 8, suffix: "+", label: "წლის გამოცდილება" },
                { icon: TbStar, value: 4.9, suffix: "", label: "რეიტინგი" },
                { icon: TbRocket, value: 100, suffix: "+", label: "პროექტი" }
            ].map((stat, i) => (
                <div
                    key={i}
                    className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur border border-border/50 hover:border-primary/30 transition-all group"
                >
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                    <div className="text-3xl font-bold">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
            ))}
        </div>
    )
}

// Testimonials wrapper
function TestimonialsWrapper() {
    return <TestimonialsCarousel />
}

// Service interface
interface Service {
    id: string
    title: string
    description: string
    icon: string
    color: string
    features: string[]
    pricing: {
        price: number
        currency: string
        unit: string
        note?: string
    }
    popular?: boolean
}

// Fetch services from API
async function getServices(): Promise<Service[]> {
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

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
    TbBulb,
    TbSchool,
    TbBolt,
    TbPencil
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
                            <TbSparkles className="w-4 h-4 mr-2" />
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
                                    <TbSend className="w-5 h-5 mr-2" />
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
                                    <TbArrowRight className="w-5 h-5 ml-2" />
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Animated Stats */}
                    <AnimatedStats />
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

                    <div className="grid md:grid-cols-2 gap-8">
                        {servicesData.map((service) => {
                            const Icon = iconMap[service.icon] || TbSparkles
                            return (
                                <Card
                                    key={service.id}
                                    className={`group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl flex flex-col h-full 
                                        ${service.popular
                                            ? "ring-2 ring-primary/50 shadow-lg shadow-primary/10"
                                            : "hover:ring-1 hover:ring-primary/30"
                                        }
                                        bg-gradient-to-br from-card via-card to-card/80 backdrop-blur
                                    `}
                                >
                                    {/* Gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Animated corner accent */}
                                    <div
                                        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                                        style={{ backgroundColor: service.color }}
                                    />

                                    {service.popular && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg animate-pulse">
                                                <TbStar className="w-3 h-3 mr-1 fill-white" />
                                                პოპულარული
                                            </Badge>
                                        </div>
                                    )}

                                    <CardHeader className="pb-4 relative z-10">
                                        <div
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
                                            style={{
                                                backgroundColor: `${service.color}20`,
                                                boxShadow: `0 8px 32px ${service.color}30`
                                            }}
                                        >
                                            <Icon
                                                className="w-8 h-8"
                                                style={{ color: service.color }}
                                            />
                                        </div>
                                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {service.description}
                                        </p>
                                    </CardHeader>

                                    <CardContent className="pb-6 flex-grow relative z-10">
                                        <ul className="space-y-3">
                                            {service.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-3 group/item">
                                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-primary/20 transition-colors">
                                                        <TbCheck className="w-3 h-3 text-primary" />
                                                    </div>
                                                    <span className="text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>

                                    <CardFooter className="flex items-center justify-between pt-6 border-t border-border/50 mt-auto relative z-10 bg-gradient-to-r from-secondary/50 to-secondary/30">
                                        <div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                                    {service.pricing.price}
                                                </span>
                                                <span className="text-lg font-semibold text-muted-foreground">
                                                    {service.pricing.currency}
                                                </span>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                / {service.pricing.unit}
                                                {service.pricing.note && (
                                                    <span className="ml-1 opacity-75">({service.pricing.note})</span>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            asChild
                                            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-lg shadow-primary/25 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/30"
                                        >
                                            <a href="#booking">
                                                დაჯავშნე
                                                <TbArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
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
            <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            როგორ მუშაობს?
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            მარტივი და გამჭვირვალე პროცესი, შედეგზე ორიენტირებული
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connection line for desktop */}
                        <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-full" />

                        <div className="grid md:grid-cols-4 gap-8 relative">
                            {[
                                {
                                    step: "01",
                                    title: "უფასო კონსულტაცია",
                                    description: "გავიგებთ თქვენს მიზნებს და გამოწვევებს 15-წუთიანი ზარით",
                                    color: "from-blue-500 to-cyan-500"
                                },
                                {
                                    step: "02",
                                    title: "ანალიზი და გეგმა",
                                    description: "მოვამზადებთ დეტალურ წინადადებას და სამუშაო გეგმას",
                                    color: "from-purple-500 to-pink-500"
                                },
                                {
                                    step: "03",
                                    title: "განხორციელება",
                                    description: "ვმუშაობთ თქვენთან ერთად AI გადაწყვეტილებების დანერგვაზე",
                                    color: "from-orange-500 to-red-500"
                                },
                                {
                                    step: "04",
                                    title: "მხარდაჭერა",
                                    description: "მუდმივი მხარდაჭერა და ოპტიმიზაცია შედეგების გასაუმჯობესებლად",
                                    color: "from-green-500 to-emerald-500"
                                }
                            ].map((item, i) => (
                                <div key={i} className="relative group">
                                    <div className="text-center">
                                        {/* Step number circle */}
                                        <div className={`relative w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-2xl shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl`}>
                                            <span className="relative z-10">{item.step}</span>
                                            {/* Glow effect */}
                                            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${item.color} blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
                                        </div>

                                        {/* Content card */}
                                        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 transition-all duration-300 group-hover:bg-card group-hover:shadow-lg group-hover:border-primary/20">
                                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Booking Section */}
            <section id="booking" className="py-24 bg-gradient-to-b from-secondary/30 via-background to-background relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center mb-16">
                        <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 px-4 py-2">
                            <TbMessage className="w-4 h-4 mr-2" />
                            დაგვიკავშირდით
                        </Badge>
                        <h2 className="text-3xl sm:text-5xl font-bold mb-4">
                            მოგვწერეთ <span className="text-gradient">პირდაპირ</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            შეავსეთ ფორმა და თქვენი შეტყობინება დაუყოვნებლივ მოვა ჩემს Telegram-ზე.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left side - Trust Indicators & Testimonials */}
                        <div className="order-2 lg:order-1 space-y-8">
                            {/* Trust Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-5 rounded-2xl bg-card/60 backdrop-blur border border-border/50 text-center group hover:border-primary/30 transition-all">
                                    <TbClock className="w-8 h-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                                    <div className="text-2xl font-bold">24სთ</div>
                                    <div className="text-xs text-muted-foreground">პასუხის დრო</div>
                                </div>
                                <div className="p-5 rounded-2xl bg-card/60 backdrop-blur border border-border/50 text-center group hover:border-yellow-500/30 transition-all">
                                    <TbStar className="w-8 h-8 mx-auto mb-2 text-yellow-500 group-hover:scale-110 transition-transform" />
                                    <div className="text-2xl font-bold">4.9/5</div>
                                    <div className="text-xs text-muted-foreground">რეიტინგი</div>
                                </div>
                                <div className="p-5 rounded-2xl bg-card/60 backdrop-blur border border-border/50 text-center group hover:border-green-500/30 transition-all">
                                    <TbUsers className="w-8 h-8 mx-auto mb-2 text-green-500 group-hover:scale-110 transition-transform" />
                                    <div className="text-2xl font-bold">50+</div>
                                    <div className="text-xs text-muted-foreground">კლიენტი</div>
                                </div>
                            </div>

                            {/* Testimonials */}
                            <Card className="overflow-hidden border-border/50 bg-card/60 backdrop-blur">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <TbStar key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                        ))}
                                    </div>
                                    <blockquote className="text-lg mb-4 italic">
                                        &ldquo;ანდრიუმ დაგვეხმარა AI ავტომატიზაციის დანერგვაში და დროის დაზოგვა 40%-ით გაიზარდა. რეკომენდაციას ვუწევ ყველას!&rdquo;
                                    </blockquote>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                                            გ
                                        </div>
                                        <div>
                                            <div className="font-semibold">გიორგი მ.</div>
                                            <div className="text-sm text-muted-foreground">სტარტაპის დამფუძნებელი</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Why Choose Me */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-lg mb-4">რატომ მე?</h4>
                                {[
                                    { icon: TbCheck, text: "8+ წლის გამოცდილება AI და ავტომატიზაციაში" },
                                    { icon: TbCheck, text: "პროექტის დასრულებამდე მხარდაჭერა" },
                                    { icon: TbCheck, text: "გამჭვირვალე ფასები, დამალული ხარჯების გარეშე" },
                                    { icon: TbCheck, text: "100% კმაყოფილების გარანტია" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/30">
                                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                            <item.icon className="w-5 h-5 text-green-500" />
                                        </div>
                                        <span className="text-sm">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right side - Contact Form */}
                        <div className="order-1 lg:order-2">
                            <ContactFormWrapper services={servicesData} />
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
                            <a href="#booking">
                                <TbMessage className="w-4 h-4 mr-2" />
                                დაგვიკავშირდით
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Portfolio / Case Studies */}
            <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center mb-16">
                        <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 px-4 py-2">
                            <TbChartBar className="w-4 h-4 mr-2" />
                            პორტფოლიო
                        </Badge>
                        <h2 className="text-3xl sm:text-5xl font-bold mb-4">
                            წარმატებული <span className="text-gradient">კეისები</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            რეალური შედეგები რეალური კლიენტებისთვის
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "E-commerce ავტომატიზაცია",
                                result: "+60%",
                                metric: "გაყიდვების ზრდა",
                                description: "AI ჩატბოტმა მომხმარებელთა მხარდაჭერა 24/7 რეჟიმში გააქტიურა",
                                tags: ["ChatBot", "E-commerce", "AI"],
                                color: "from-blue-500 to-cyan-500"
                            },
                            {
                                title: "კონტენტ მარკეტინგი",
                                result: "3x",
                                metric: "პროდუქტიულობა",
                                description: "AI-ით კონტენტის გენერაცია და სოციალური მედიის ავტომატიზაცია",
                                tags: ["Content", "Social Media", "Automation"],
                                color: "from-purple-500 to-pink-500"
                            },
                            {
                                title: "HR პროცესების ოპტიმიზაცია",
                                result: "-40%",
                                metric: "დროის დაზოგვა",
                                description: "რეზიუმეების ავტომატური დამუშავება და კანდიდატების შეფასება",
                                tags: ["HR Tech", "Recruitment", "AI Screening"],
                                color: "from-orange-500 to-red-500"
                            }
                        ].map((caseItem, i) => (
                            <Card key={i} className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl">
                                <CardContent className="p-0">
                                    {/* Result header */}
                                    <div className={`bg-gradient-to-r ${caseItem.color} p-8 text-white text-center`}>
                                        <div className="text-5xl font-bold mb-2">{caseItem.result}</div>
                                        <div className="text-white/80 font-medium">{caseItem.metric}</div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                            {caseItem.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            {caseItem.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {caseItem.tags.map((tag, j) => (
                                                <span key={j} className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trusted By / Client Logos */}
            <section className="py-16 border-y border-border/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <p className="text-center text-muted-foreground mb-10 text-sm uppercase tracking-wider">
                        ტექნოლოგიები და ინსტრუმენტები
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
                        {[
                            { icon: TbBrandOpenai, name: "OpenAI" },
                            { icon: TbBrandGoogle, name: "Google AI" },
                            { icon: TbBrandSlack, name: "Slack" },
                            { icon: TbBrandNotion, name: "Notion" },
                            { icon: TbBrandZoom, name: "Zoom" },
                            { icon: TbDeviceLaptop, name: "Custom Apps" },
                        ].map((tool, i) => (
                            <div key={i} className="flex items-center gap-2 hover:opacity-100 transition-opacity cursor-default">
                                <tool.icon className="w-8 h-8" />
                                <span className="font-medium hidden sm:inline">{tool.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-secondary/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center mb-12">
                        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 mb-4 px-4 py-2">
                            <TbStar className="w-4 h-4 mr-2" />
                            მიმოხილვები
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            კლიენტების აზრი
                        </h2>
                    </div>
                    <TestimonialsWrapper />
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[150px]" />

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
                    <Badge className="bg-white/10 text-foreground border-border/20 mb-6 px-4 py-2">
                        <TbSparkles className="w-4 h-4 mr-2" />
                        მზად ხართ?
                    </Badge>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        დაიწყეთ AI <br className="sm:hidden" />
                        <span className="text-gradient">ტრანსფორმაცია</span> დღესვე
                    </h2>

                    <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                        შემოგვიერთდით 50+ წარმატებულ ბიზნესს, რომლებმაც უკვე გააუმჯობესეს
                        თავიანთი პროცესები AI-ით. პირველი კონსულტაცია უფასოა.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-10 py-7 text-lg shadow-2xl shadow-primary/30"
                            asChild
                        >
                            <a href="#booking">
                                <TbRocket className="w-6 h-6 mr-2" />
                                დაჯავშნეთ უფასო კონსულტაცია
                            </a>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="px-10 py-7 text-lg border-2"
                            asChild
                        >
                            <Link href="/about">
                                გაიგეთ მეტი
                                <TbArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </Button>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <TbCheck className="w-5 h-5 text-green-500" />
                            უფასო 15-წუთიანი კონსულტაცია
                        </div>
                        <div className="flex items-center gap-2">
                            <TbCheck className="w-5 h-5 text-green-500" />
                            პასუხი 24 საათში
                        </div>
                        <div className="flex items-center gap-2">
                            <TbCheck className="w-5 h-5 text-green-500" />
                            100% კმაყოფილების გარანტია
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

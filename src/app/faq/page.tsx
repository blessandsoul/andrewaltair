"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Search,
    ChevronDown,
    ChevronUp,
    MessageCircle,
    Sparkles,
    HelpCircle,
    Lightbulb,
    Wrench,
    CreditCard,
    Users,
    BookOpen,
    ArrowRight
} from "lucide-react"

const faqCategories = [
    {
        id: "general",
        title: "ზოგადი",
        icon: HelpCircle,
        color: "#6366f1"
    },
    {
        id: "ai-tools",
        title: "AI ინსტრუმენტები",
        icon: Sparkles,
        color: "#10b981"
    },
    {
        id: "services",
        title: "სერვისები",
        icon: Wrench,
        color: "#f59e0b"
    },
    {
        id: "products",
        title: "პროდუქტები",
        icon: CreditCard,
        color: "#ec4899"
    },
    {
        id: "community",
        title: "კომიუნითი",
        icon: Users,
        color: "#8b5cf6"
    }
]

const faqItems = [
    {
        id: "1",
        category: "general",
        question: "ვინ არის Andrew Altair?",
        answer: "Andrew Altair არის AI ინოვატორი და კონტენტ კრეატორი 8+ წლიანი გამოცდილებით ტექნოლოგიების სფეროში. ვეხმარები ბიზნესებსა და პროფესიონალებს AI-ს ეფექტურ გამოყენებაში კონსულტაციის, ტრეინინგისა და კონტენტის მეშვეობით."
    },
    {
        id: "2",
        category: "general",
        question: "რა ენებზე ხელმისაწვდომია კონტენტი?",
        answer: "ძირითადი კონტენტი ქართულ ენაზეა, თუმცა ზოგიერთი რესურსი და მასალა ინგლისურადაც ხელმისაწვდომია. კონსულტაციები შესაძლებელია ორივე ენაზე."
    },
    {
        id: "3",
        category: "ai-tools",
        question: "რომელი AI ინსტრუმენტია საუკეთესო დამწყებთათვის?",
        answer: "დამწყებთათვის გირჩევთ დაიწყოთ ChatGPT-ით (უფასო ვერსია). ეს არის ყველაზე მარტივი და მძლავრი AI ინსტრუმენტი, რომელიც ტექსტთან მუშაობას, კოდირებას, ანალიზს და მრავალ სხვა ამოცანას ხსნის."
    },
    {
        id: "4",
        category: "ai-tools",
        question: "ChatGPT vs Claude - რომელი ავირჩიო?",
        answer: "ChatGPT (GPT-4) უკეთესია კრეატიულ ამოცანებში და აქვს web browsing. Claude უკეთესია გრძელ ტექსტებთან მუშაობასა და ანალიზში. ორივე შესანიშნავია - გირჩევთ ორივე სცადოთ და აირჩიოთ თქვენი საჭიროების მიხედვით."
    },
    {
        id: "5",
        category: "ai-tools",
        question: "როგორ დავიწყო AI ავტომატიზაცია?",
        answer: "დასაწყისისთვის გირჩევთ Make.com ან Zapier - ეს no-code პლატფორმებია, რომლებითაც ვიზუალურად აწყობთ ავტომატიზაციებს. ჩემი 'Make.com რეცეპტები' პროდუქტი 50 მზა ავტომატიზაციას მოიცავს, რაც დაგეხმარებათ სწრაფად დაიწყოთ."
    },
    {
        id: "6",
        category: "services",
        question: "როგორ მიმდინარეობს კონსულტაცია?",
        answer: "კონსულტაცია მიმდინარეობს Zoom ან Google Meet-ით. პირველი 15-წუთიანი საწყისი ზარი უფასოა, სადაც განვიხილავთ თქვენს გამოწვევებს. შემდეგ ვადგენთ სრული კონსულტაციის გეგმას."
    },
    {
        id: "7",
        category: "services",
        question: "რამდენი ხანი სჭირდება AI პროექტის დანერგვას?",
        answer: "დამოკიდებულია სირთულეზე: მარტივი ავტომატიზაციები - 1-2 კვირა, AI ჩატბოტი - 2-3 კვირა, კომპლექსური ინტეგრაციები - 1-2 თვე. საწყის კონსულტაციაზე უფრო ზუსტ ვადებს განვსაზღვრავთ."
    },
    {
        id: "8",
        category: "services",
        question: "მუშაობთ საერთაშორისო კლიენტებთან?",
        answer: "დიახ! ვმუშაობ კლიენტებთან მთელი მსოფლიოდან. კონსულტაციები შესაძლებელია ქართულად და ინგლისურად."
    },
    {
        id: "9",
        category: "products",
        question: "როგორ მივიღო პროდუქტი ყიდვის შემდეგ?",
        answer: "ყიდვისთანავე მიიღებთ ელ-ფოსტაზე ჩამოტვირთვის ლინკს. ციფრული პროდუქტები მყისიერად ხელმისაწვდომია."
    },
    {
        id: "10",
        category: "products",
        question: "არის თუ არა თანხის დაბრუნების გარანტია?",
        answer: "დიახ! 7 დღიანი გარანტია მოქმედებს ყველა პროდუქტზე. თუ კმაყოფილი არ ხართ, თანხას სრულად დაგიბრუნებთ შეკითხვების გარეშე."
    },
    {
        id: "11",
        category: "products",
        question: "მივიღებ უფასო განახლებებს?",
        answer: "დიახ! ყველა პროდუქტზე მოქმედებს უფასო განახლებები. როცა ახალი ფუნქციები ან გაუმჯობესებები დაემატება, ავტომატურად მიიღებთ ელ-ფოსტაზე."
    },
    {
        id: "12",
        category: "community",
        question: "როგორ შევუერთდე კომიუნითის?",
        answer: "შეუერთდით Telegram ჯგუფს ან Discord სერვერს - ბმულები ხელმისაწვდომია /community გვერდზე. ასევე გამომიწერეთ YouTube-ზე და სხვა სოციალურ ქსელებში."
    },
    {
        id: "13",
        category: "community",
        question: "რა უპირატესობები აქვს კომიუნითის წევრობას?",
        answer: "კომიუნითის წევრები პირველები იღებენ ახალ კონტენტს, ექსკლუზიურ რჩევებს, ფასდაკლებებს პროდუქტებზე და პირდაპირი კომუნიკაციის შესაძლებლობას."
    }
]

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [expandedItems, setExpandedItems] = useState<string[]>([])

    const toggleItem = (id: string) => {
        setExpandedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        )
    }

    const filteredFaqs = faqItems.filter(faq => {
        const matchesSearch = searchQuery === "" ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = !selectedCategory || faq.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10">
                    <div className="absolute inset-0 noise-overlay"></div>
                </div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center space-y-6">
                        <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                            <BookOpen className="w-4 h-4 mr-2" />
                            ბაზა ცოდნის
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                            ხშირად დასმული <span className="text-gradient">კითხვები</span>
                        </h1>

                        <p className="text-xl text-muted-foreground">
                            იპოვე პასუხები AI-ს, სერვისებისა და პროდუქტების შესახებ
                        </p>

                        {/* Search */}
                        <div className="relative max-w-xl mx-auto pt-4">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground mt-2" />
                            <Input
                                type="text"
                                placeholder="მოძებნე კითხვა..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 text-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-8 bg-secondary/30 border-y border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Button
                            variant={selectedCategory === null ? "secondary" : "outline"}
                            className={selectedCategory === null ? "bg-primary text-white" : ""}
                            onClick={() => setSelectedCategory(null)}
                        >
                            ყველა
                        </Button>
                        {faqCategories.map(cat => (
                            <Button
                                key={cat.id}
                                variant={selectedCategory === cat.id ? "secondary" : "outline"}
                                className={`gap-2 ${selectedCategory === cat.id ? "bg-primary text-white" : ""}`}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                <cat.icon className="w-4 h-4" />
                                {cat.title}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Items */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    {filteredFaqs.length === 0 ? (
                        <div className="text-center py-12">
                            <HelpCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                            <h3 className="text-xl font-bold mb-2">კითხვა ვერ მოიძებნა</h3>
                            <p className="text-muted-foreground mb-6">
                                სცადე სხვა საძიებო სიტყვები ან დაგვიკავშირდი პირდაპირ
                            </p>
                            <Button asChild>
                                <Link href="/contact">დაგვიკავშირდი</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredFaqs.map((faq) => {
                                const category = faqCategories.find(c => c.id === faq.category)
                                const isExpanded = expandedItems.includes(faq.id)

                                return (
                                    <Card
                                        key={faq.id}
                                        className={`cursor-pointer transition-all ${isExpanded ? "ring-2 ring-primary/50" : ""}`}
                                        onClick={() => toggleItem(faq.id)}
                                    >
                                        <CardHeader className="pb-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-3">
                                                    {category && (
                                                        <div
                                                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                                            style={{ backgroundColor: `${category.color}20` }}
                                                        >
                                                            <category.icon
                                                                className="w-5 h-5"
                                                                style={{ color: category.color }}
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <Badge variant="outline" className="mb-2 text-xs">
                                                            {category?.title}
                                                        </Badge>
                                                        <h3 className="font-bold text-lg">{faq.question}</h3>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="shrink-0">
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-5 h-5" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5" />
                                                    )}
                                                </Button>
                                            </div>
                                        </CardHeader>

                                        {isExpanded && (
                                            <CardContent className="pt-4">
                                                <p className="text-muted-foreground leading-relaxed pl-13">
                                                    {faq.answer}
                                                </p>
                                            </CardContent>
                                        )}
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Still Have Questions CTA */}
            <section className="py-16 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
                    <Card className="text-center p-8 lg:p-12">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
                        <h2 className="text-2xl font-bold mb-4">ვერ იპოვე პასუხი?</h2>
                        <p className="text-muted-foreground mb-6">
                            დაგვიკავშირდი და უპასუხებთ შენს კონკრეტულ შეკითხვას
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" asChild>
                                <Link href="/contact">
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    დაგვიკავშირდი
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link href="/community">
                                    შეუერთდი კომიუნითის
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    )
}

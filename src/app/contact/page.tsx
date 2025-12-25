"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Mail,
    Send,
    MapPin,
    Youtube,
    Instagram,
    MessageCircle,
    CheckCircle,
    Sparkles,
    Calendar,
    Clock
} from "lucide-react"
import { brand } from "@/lib/brand"

const contactMethods = [
    {
        icon: Send,
        title: "Telegram",
        value: "@andrewaltair",
        href: brand.social.telegram,
        color: "#0088cc",
        description: "ყველაზე სწრაფი პასუხი"
    },
    {
        icon: Mail,
        title: "ელ-ფოსტა",
        value: "andrew@andrewaltair.ge",
        href: "mailto:andrew@andrewaltair.ge",
        color: "#6366f1",
        description: "ბიზნეს შეთავაზებები"
    },
    {
        icon: Youtube,
        title: "YouTube",
        value: "AndrewAltair",
        href: brand.social.youtube,
        color: "#ff0000",
        description: "კომენტარები ვიდეოებზე"
    },
    {
        icon: Instagram,
        title: "Instagram",
        value: "@andrewaltair",
        href: brand.social.instagram,
        color: "#e4405f",
        description: "DM და Stories"
    },
]

const collaborationTypes = [
    "კონსულტაცია",
    "სპონსორობა",
    "კოლაბორაცია",
    "ინტერვიუ",
    "სხვა"
]

export default function ContactPage() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        type: "",
        message: ""
    })
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Demo: just show success message
        setIsSubmitted(true)
    }

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative py-20 lg:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
                    <div className="absolute inset-0 noise-overlay"></div>
                </div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <Badge variant="secondary" className="px-4 py-2">
                            <MessageCircle className="w-3 h-3 mr-2" />
                            კონტაქტი
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            <span className="text-gradient">დამიკავშირდი</span>
                        </h1>

                        <p className="text-xl text-muted-foreground">
                            გაქვს შეკითხვა, იდეა ან თანამშრომლობის სურვილი? მომწერე!
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-12 bg-card border-y border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {contactMethods.map((method) => (
                            <Link key={method.title} href={method.href} target="_blank">
                                <Card className="group h-full hover-lift border-0 shadow-lg text-center">
                                    <CardContent className="p-6 space-y-3">
                                        <div
                                            className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                                            style={{ backgroundColor: `${method.color}15` }}
                                        >
                                            <method.icon className="w-6 h-6" style={{ color: method.color }} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{method.title}</h3>
                                            <p className="text-sm text-primary">{method.value}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="grid gap-12 lg:grid-cols-2">
                        {/* Form */}
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">📝 შეტყობინების გაგზავნა</h2>
                                    <p className="text-muted-foreground">შეავსე ფორმა</p>
                                </div>
                            </div>

                            {isSubmitted ? (
                                <Card className="border-0 shadow-xl bg-green-50 dark:bg-green-900/20">
                                    <CardContent className="p-8 text-center space-y-4">
                                        <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-green-700 dark:text-green-400">
                                            შეტყობინება გაიგზავნა!
                                        </h3>
                                        <p className="text-green-600 dark:text-green-300">
                                            მადლობა დაკავშირებისთვის. მალე გიპასუხებ!
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setIsSubmitted(false)
                                                setFormState({ name: "", email: "", type: "", message: "" })
                                            }}
                                        >
                                            ახალი შეტყობინება
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="border-0 shadow-xl">
                                    <CardContent className="p-6">
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">სახელი</label>
                                                    <Input
                                                        placeholder="შენი სახელი"
                                                        value={formState.name}
                                                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">ელ-ფოსტა</label>
                                                    <Input
                                                        type="email"
                                                        placeholder="email@example.com"
                                                        value={formState.email}
                                                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">თემა</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {collaborationTypes.map((type) => (
                                                        <Button
                                                            key={type}
                                                            type="button"
                                                            variant={formState.type === type ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => setFormState({ ...formState, type })}
                                                        >
                                                            {type}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">შეტყობინება</label>
                                                <Textarea
                                                    placeholder="დაწერე შეტყობინება..."
                                                    rows={5}
                                                    value={formState.message}
                                                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-primary to-accent text-white">
                                                <Send className="w-4 h-4 mr-2" />
                                                გაგზავნა
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Info */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">💡 თანამშრომლობა</h2>
                                    <p className="text-muted-foreground">როგორ შემიძლია დაგეხმარო</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Card className="border-0 shadow-lg">
                                    <CardContent className="p-5 flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <MessageCircle className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">AI კონსულტაცია</h4>
                                            <p className="text-sm text-muted-foreground">
                                                ბიზნესისთვის AI სტრატეგიის შემუშავება და დანერგვა
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-lg">
                                    <CardContent className="p-5 flex items-start gap-4">
                                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Youtube className="w-5 h-5 text-purple-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">სპონსორობა & კოლაბორაცია</h4>
                                            <p className="text-sm text-muted-foreground">
                                                YouTube ვიდეოები და სოციალური მედია
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-lg">
                                    <CardContent className="p-5 flex items-start gap-4">
                                        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Calendar className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">ტრეინინგები & ვორქშოპები</h4>
                                            <p className="text-sm text-muted-foreground">
                                                AI-ს შესახებ კორპორატიული სწავლება
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="border-0 shadow-lg bg-secondary/50">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <Clock className="w-6 h-6 text-muted-foreground" />
                                    <div>
                                        <h4 className="font-semibold">პასუხის დრო</h4>
                                        <p className="text-sm text-muted-foreground">
                                            ჩვეულებრივ ვპასუხობ 24 საათში
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

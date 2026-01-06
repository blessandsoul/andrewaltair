"use client"

import Link from "next/link"
import { TbArrowLeft, TbExternalLink, TbSparkles, TbBook, TbVideo, TbCode, TbWand, TbRocket, TbBrain, TbPalette, TbLayoutDashboard, TbChartBar, TbUsers, TbSettings, TbTerminal } from "react-icons/tb"
import { Button } from "@/components/ui/button"

// Components and features that are still in development
const demoFeatures = [
    {
        category: "AI ფუნქციები (WIP)",
        items: [
            { href: "/new-features", label: "ახალი ფუნქციები", icon: TbSparkles, description: "20 კონვერსიის კომპონენტი", status: "demo" },
        ]
    },
    {
        category: "UI კომპონენტები (Testing)",
        items: [
            { href: "/components/buttons", label: "Buttons", icon: TbPalette, description: "ღილაკების კოლექცია", status: "demo" },
            { href: "/components/cards", label: "Cards", icon: TbLayoutDashboard, description: "კარტების დიზაინი", status: "demo" },
            { href: "/components/forms", label: "Forms", icon: TbSettings, description: "ფორმების კომპონენტები", status: "demo" },
        ]
    },
    {
        category: "ანალიტიკა (Internal)",
        items: [
            { href: "/analytics", label: "Analytics Dashboard", icon: TbChartBar, description: "სტატისტიკის პანელი", status: "internal" },
            { href: "/heatmap", label: "Heatmap", icon: TbUsers, description: "მომხმარებლის ქცევა", status: "internal" },
        ]
    },
    {
        category: "დეველოპერი (Dev Only)",
        items: [
            { href: "/api-docs", label: "API Documentation", icon: TbTerminal, description: "API დოკუმენტაცია", status: "dev" },
            { href: "/storybook", label: "Storybook", icon: TbCode, description: "კომპონენტების ბიბლიოთეკა", status: "dev" },
        ]
    },
]

const statusColors = {
    wip: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    demo: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    internal: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    dev: "bg-gray-500/10 text-gray-400 border-gray-500/20",
}

const statusLabels = {
    wip: "მალე",
    demo: "დემო",
    internal: "შიდა",
    dev: "Dev",
}

export default function DemoFeaturesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
            {/* Header */}
            <div className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-16 z-40">
                <div className="container mx-auto px-4 py-4 max-w-5xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/">
                                <Button variant="ghost" size="icon" className="shrink-0">
                                    <TbArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold flex items-center gap-2">
                                    <TbRocket className="w-5 h-5 text-primary" />
                                    დემო ფიჩერები
                                </h1>
                                <p className="text-sm text-muted-foreground">კომპონენტები და ფუნქციები რომლებიც ჯერ კიდევ დამუშავების პროცესშია</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="space-y-8">
                    {demoFeatures.map((category) => (
                        <div key={category.category} className="space-y-4">
                            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <TbBrain className="w-5 h-5 text-primary" />
                                {category.category}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {category.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="group relative p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                                    >
                                        {/* Status Badge */}
                                        <div className={`absolute top-3 right-3 px-2 py-0.5 text-xs rounded-full border ${statusColors[item.status as keyof typeof statusColors]}`}>
                                            {statusLabels[item.status as keyof typeof statusLabels]}
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                                <item.icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                                                    {item.label}
                                                    <TbExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </h3>
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Box */}
                <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <TbSparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">ეს გვერდი დეველოპერებისთვისაა</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                აქ ნაჩვენებია ყველა კომპონენტი და ფუნქცია რომელიც ჯერ კიდევ დამუშავების ან ტესტირების ეტაპზეა.
                                როცა ისინი მზად იქნება, ისინი გადავა მთავარ ნავიგაციაში.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

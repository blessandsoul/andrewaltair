import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Wrench,
    ExternalLink,
    Star,
    Sparkles,
    MessageSquare,
    Image,
    Video,
    Music,
    Code,
    Search,
    Zap,
    Presentation,
    Palette,
    FileText,
    TrendingUp,
    Languages,
    Mic,
    FileSearch,
    Mail,
    Headphones,
    DollarSign,
    Camera,
    Globe,
    BarChart3,
    GraduationCap,
    Terminal,
    BookOpen,
    User,
    Bookmark,
    Crown,
    ArrowRight,
    Compass,
    Scale,
    Wallet,
    Blocks,
    Gamepad2,
    Box,
    Wand2
} from "lucide-react"
import toolsData from "@/data/tools.json"

// Category icons mapping
const categoryIcons: Record<string, any> = {
    "ჩატბოტები": MessageSquare,
    "სურათები": Image,
    "ვიდეო": Video,
    "აუდიო": Music,
    "კოდი": Code,
    "ძებნა": Search,
    "ავტომატიზაცია": Zap,
    "პროდუქტიულობა": Sparkles,
    "პრეზენტაცია": Presentation,
    "დიზაინი": Palette,
    "კონტენტი": FileText,
    "SEO": TrendingUp,
    "წერა": FileText,
    "თარგმანი": Languages,
    "ტრანსკრიფცია": Mic,
    "დოკუმენტები": FileSearch,
    "ელფოსტა": Mail,
    "მომხმარებელი": Headphones,
    "გაყიდვები": DollarSign,
    "ფოტო რედაქცია": Camera,
    "ვებსაიტი": Globe,
    "ანალიტიკა": BarChart3,
    "განათლება": GraduationCap,
    "დეველოპერი": Terminal,
    "კვლევა": BookOpen,
    "ავატარი": User,
    "ბრაუზერი": Compass,
    "სამართალი": Scale,
    "ფინანსები": Wallet,
    "No-Code": Blocks,
    "თამაშები": Gamepad2,
    "3D": Box,
    "VFX": Wand2,
}

// Category colors
const categoryColors: Record<string, string> = {
    "ჩატბოტები": "#6366f1",
    "სურათები": "#ec4899",
    "ვიდეო": "#f43f5e",
    "აუდიო": "#8b5cf6",
    "კოდი": "#22d3ee",
    "ძებნა": "#10b981",
    "ავტომატიზაცია": "#f59e0b",
    "პროდუქტიულობა": "#6366f1",
    "პრეზენტაცია": "#f97316",
    "დიზაინი": "#a855f7",
    "კონტენტი": "#14b8a6",
    "SEO": "#84cc16",
    "წერა": "#0ea5e9",
    "თარგმანი": "#06b6d4",
    "ტრანსკრიფცია": "#d946ef",
    "დოკუმენტები": "#64748b",
    "ელფოსტა": "#ef4444",
    "მომხმარებელი": "#22c55e",
    "გაყიდვები": "#eab308",
    "ფოტო რედაქცია": "#f472b6",
    "ვებსაიტი": "#3b82f6",
    "ანალიტიკა": "#10b981",
    "განათლება": "#8b5cf6",
    "დეველოპერი": "#0891b2",
    "კვლევა": "#7c3aed",
    "ავატარი": "#ec4899",
    "ბრაუზერი": "#f97316",
    "სამართალი": "#78716c",
    "ფინანსები": "#059669",
    "No-Code": "#8b5cf6",
    "თამაშები": "#dc2626",
    "3D": "#0ea5e9",
    "VFX": "#f472b6",
}

// Pricing labels
const pricingLabels: Record<string, { label: string; color: string }> = {
    "free": { label: "უფასო", color: "bg-green-500/10 text-green-600" },
    "freemium": { label: "Freemium", color: "bg-blue-500/10 text-blue-600" },
    "paid": { label: "ფასიანი", color: "bg-orange-500/10 text-orange-600" },
}

export default function ToolsPage() {
    const featuredTools = toolsData.filter(t => t.featured)
    const categories = [...new Set(toolsData.map(t => t.category))]

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
                            <Wrench className="w-3 h-3 mr-2" />
                            AI ინსტრუმენტები
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            <span className="text-gradient">საუკეთესო AI ინსტრუმენტები</span>
                        </h1>

                        <p className="text-xl text-muted-foreground">
                            ჩემი რეკომენდებული AI ინსტრუმენტები ყოველდღიური მუშაობისთვის
                        </p>

                        <div className="flex flex-wrap gap-2 justify-center pt-4">
                            {categories.map((cat) => {
                                const Icon = categoryIcons[cat] || Sparkles
                                return (
                                    <Badge
                                        key={cat}
                                        variant="outline"
                                        className="px-3 py-1.5"
                                        style={{ borderColor: categoryColors[cat] }}
                                    >
                                        <Icon className="w-3 h-3 mr-1" style={{ color: categoryColors[cat] }} />
                                        {cat}
                                    </Badge>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Tools */}
            <section className="py-16 bg-card border-y border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Star className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">რჩეული ინსტრუმენტები</h2>
                            <p className="text-muted-foreground">ყველაზე ხშირად ვიყენებ</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {featuredTools.map((tool) => {
                            const Icon = categoryIcons[tool.category] || Sparkles
                            const pricing = pricingLabels[tool.pricing]

                            return (
                                <Link key={tool.id} href={tool.url} target="_blank">
                                    <Card className="group h-full border-0 shadow-xl bg-card transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                                        <CardContent className="p-5 space-y-4">
                                            {/* Header */}
                                            <div className="flex items-start justify-between">
                                                <div
                                                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                                                    style={{
                                                        backgroundColor: `${categoryColors[tool.category]}15`,
                                                        boxShadow: `0 8px 32px ${categoryColors[tool.category]}20`
                                                    }}
                                                >
                                                    <Icon className="w-7 h-7" style={{ color: categoryColors[tool.category] }} />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs">
                                                        <Crown className="w-3 h-3 mr-1" />
                                                        ტოპ
                                                    </Badge>
                                                    <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/10">
                                                        <Bookmark className="w-4 h-4 text-muted-foreground" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Title & Description */}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                                        {tool.name}
                                                    </h3>
                                                    <div className="flex items-center gap-0.5 text-yellow-500">
                                                        <Star className="w-3.5 h-3.5 fill-current" />
                                                        <span className="text-xs">{tool.rating}</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                    {tool.description}
                                                </p>
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                        style={{
                                                            backgroundColor: `${categoryColors[tool.category]}15`,
                                                            color: categoryColors[tool.category]
                                                        }}
                                                    >
                                                        {tool.category}
                                                    </Badge>
                                                    <Badge className={`text-xs ${pricing.color}`}>
                                                        {pricing.label}
                                                    </Badge>
                                                </div>
                                                <ExternalLink className={`w-4 h-4 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1`} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* All Tools by Category */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                            <Wrench className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">ყველა ინსტრუმენტი</h2>
                            <p className="text-muted-foreground">კატეგორიების მიხედვით</p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {categories.map((category) => {
                            const Icon = categoryIcons[category] || Sparkles
                            const categoryTools = toolsData.filter(t => t.category === category)

                            return (
                                <div key={category}>
                                    <div className="flex items-center gap-2 mb-6">
                                        <Icon className="w-5 h-5" style={{ color: categoryColors[category] }} />
                                        <h3 className="text-xl font-bold">{category}</h3>
                                        <Badge variant="outline">{categoryTools.length}</Badge>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {categoryTools.map((tool) => {
                                            const pricing = pricingLabels[tool.pricing]

                                            return (
                                                <Link key={tool.id} href={tool.url} target="_blank">
                                                    <Card className="group h-full hover-lift border shadow-sm hover:shadow-lg transition-shadow">
                                                        <CardContent className="p-5 flex items-start gap-4">
                                                            <div
                                                                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                                                style={{ backgroundColor: `${categoryColors[category]}15` }}
                                                            >
                                                                <Icon className="w-6 h-6" style={{ color: categoryColors[category] }} />
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="font-semibold group-hover:text-primary transition-colors">
                                                                        {tool.name}
                                                                    </h4>
                                                                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                                                </div>
                                                                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                                                    {tool.description}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <Badge className={`text-xs ${pricing.color}`}>
                                                                        {pricing.label}
                                                                    </Badge>
                                                                    <div className="flex items-center gap-0.5">
                                                                        {[...Array(tool.rating)].map((_, i) => (
                                                                            <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 animated-gradient opacity-90"></div>
                <div className="absolute inset-0 noise-overlay"></div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center text-white">
                    <div className="space-y-6">
                        <h2 className="text-3xl sm:text-4xl font-bold">
                            გაქვს რეკომენდაცია?
                        </h2>
                        <p className="text-xl text-white/80">
                            თუ იცი კარგი AI ინსტრუმენტი რომელიც აქ არ არის, გამომიგზავნე!
                        </p>
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                            ინსტრუმენტის შეთავაზება
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

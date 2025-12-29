import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ShoppingCart,
    Star,
    Download,
    Play,
    BookOpen,
    Layers,
    Sparkles,
    ArrowRight,
    Gift,
    Check,
    Zap
} from "lucide-react"

// Fetch products from API
async function getProducts() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`, {
            cache: 'no-store'
        })
        if (res.ok) {
            const data = await res.json()
            return data.products || []
        }
    } catch (error) {
        console.error('Error fetching products:', error)
    }
    return []
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    templates: Layers,
    courses: Play,
    ebooks: BookOpen,
    bundles: Gift
}

const categoryLabels: Record<string, string> = {
    templates: "შაბლონები",
    courses: "კურსები",
    ebooks: "ელ-წიგნები",
    bundles: "პაკეტები"
}

export default async function ProductsPage() {
    const productsData = await getProducts()
    const categories = [...new Set(productsData.map((p: { category: string }) => p.category))]

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-primary/10">
                    <div className="absolute inset-0 noise-overlay"></div>
                </div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <Badge className="bg-accent/10 text-accent border-accent/20 px-4 py-2">
                            <Gift className="w-4 h-4 mr-2" />
                            ციფრული პროდუქტები
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            AI <span className="text-gradient">რესურსები</span>{" "}
                            შენი წარმატებისთვის
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            პრემიუმ კურსები, შაბლონები და ინსტრუმენტები AI-ს ეფექტურად გამოყენებისთვის
                        </p>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Download className="w-4 h-4 text-primary" />
                                <span className="font-medium">მყისიერი ჩამოტვირთვა</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className="font-medium">4.8 საშუალო რეიტინგი</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Zap className="w-4 h-4 text-accent" />
                                <span className="font-medium">უფასო განახლებები</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-secondary/30 border-y border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Button variant="secondary" className="bg-primary text-white">
                            ყველა
                        </Button>
                        {categories.map(cat => {
                            const Icon = categoryIcons[cat] || Sparkles
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

            {/* Featured Product */}
            {productsData.find(p => p.bestSeller) && (
                <section className="py-16 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        {(() => {
                            const featured = productsData.find(p => p.bestSeller)!
                            const discount = Math.round((1 - featured.pricing.price / featured.pricing.originalPrice) * 100)
                            return (
                                <div className="grid lg:grid-cols-2 gap-8 items-center">
                                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 shadow-2xl">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Sparkles className="w-24 h-24 text-primary/30" />
                                        </div>
                                        <Badge className="absolute top-4 left-4 bg-red-500 text-white border-0 px-3 py-1.5">
                                            🔥 ბესტსელერი
                                        </Badge>
                                        <Badge className="absolute top-4 right-4 bg-accent text-white border-0 px-3 py-1.5">
                                            -{discount}%
                                        </Badge>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <Badge variant="outline" className="mb-3">
                                                {categoryLabels[featured.category]}
                                            </Badge>
                                            <h2 className="text-3xl sm:text-4xl font-bold mb-3">{featured.title}</h2>
                                            <p className="text-lg text-muted-foreground">{featured.description}</p>
                                        </div>

                                        <ul className="space-y-3">
                                            {featured.features.map((f, i) => (
                                                <li key={i} className="flex items-center gap-3">
                                                    <Check className="w-5 h-5 text-primary" />
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-5 h-5 ${i < Math.floor(featured.rating)
                                                            ? "text-yellow-500 fill-yellow-500"
                                                            : "text-muted-foreground"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {featured.rating} ({featured.reviews} შეფასება)
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div>
                                                <span className="text-4xl font-bold">{featured.pricing.price}</span>
                                                <span className="text-lg ml-1">{featured.pricing.currency}</span>
                                                <span className="text-lg text-muted-foreground line-through ml-3">
                                                    {featured.pricing.originalPrice} {featured.pricing.currency}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-white px-8">
                                                <ShoppingCart className="w-5 h-5 mr-2" />
                                                ყიდვა
                                            </Button>
                                            <Button size="lg" variant="outline">
                                                დეტალები
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })()}
                    </div>
                </section>
            )}

            {/* All Products Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold">ყველა პროდუქტი</h2>
                            <p className="text-muted-foreground">{productsData.length} პროდუქტი ხელმისაწვდომია</p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {productsData.map(product => {
                            const Icon = categoryIcons[product.category] || Sparkles
                            const discount = Math.round((1 - product.pricing.price / product.pricing.originalPrice) * 100)

                            return (
                                <Card key={product.id} className="group overflow-hidden hover-lift">
                                    {/* Product Image */}
                                    <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent/10">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Icon className="w-16 h-16 text-primary/30 group-hover:scale-110 transition-transform" />
                                        </div>

                                        {/* Badges */}
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            {product.bestSeller && (
                                                <Badge className="bg-red-500 text-white border-0">🔥 ბესტსელერი</Badge>
                                            )}
                                            {product.downloadable && (
                                                <Badge variant="secondary" className="gap-1">
                                                    <Download className="w-3 h-3" />
                                                    ჩამოტვირთვა
                                                </Badge>
                                            )}
                                        </div>

                                        {discount > 0 && (
                                            <Badge className="absolute top-3 right-3 bg-accent text-white border-0">
                                                -{discount}%
                                            </Badge>
                                        )}
                                    </div>

                                    <CardContent className="p-5">
                                        <Badge variant="outline" className="mb-2 text-xs">
                                            {categoryLabels[product.category]}
                                        </Badge>

                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                                            {product.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                            {product.description}
                                        </p>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                            ? "text-yellow-500 fill-yellow-500"
                                                            : "text-muted-foreground/30"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                ({product.reviews})
                                            </span>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="p-5 pt-0 flex items-center justify-between">
                                        <div>
                                            <span className="text-2xl font-bold">{product.pricing.price}</span>
                                            <span className="text-sm text-muted-foreground ml-1">
                                                {product.pricing.currency}
                                            </span>
                                            {product.pricing.originalPrice > product.pricing.price && (
                                                <span className="text-sm text-muted-foreground line-through ml-2">
                                                    {product.pricing.originalPrice}
                                                </span>
                                            )}
                                        </div>
                                        <Button size="sm" className="gap-2">
                                            <ShoppingCart className="w-4 h-4" />
                                            ყიდვა
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-16 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4">რატომ ჩემი პროდუქტები?</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Download,
                                title: "მყისიერი წვდომა",
                                desc: "ყიდვისთანავე მიიღებ ჩამოტვირთვის ლინკს"
                            },
                            {
                                icon: Zap,
                                title: "უფასო განახლებები",
                                desc: "ყველა მომავალი განახლება უფასოდ"
                            },
                            {
                                icon: Star,
                                title: "პრემიუმ ხარისხი",
                                desc: "8 წლის გამოცდილება ჩადებული"
                            },
                            {
                                icon: Gift,
                                title: "ბონუსები",
                                desc: "ექსკლუზიური ბონუს მასალები"
                            }
                        ].map((item, i) => (
                            <div key={i} className="text-center p-6 rounded-2xl bg-card border border-border">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <item.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-bold mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Money Back Guarantee */}
                    <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-center">
                        <div className="text-4xl mb-3">💯</div>
                        <h3 className="text-xl font-bold mb-2">7 დღიანი გარანტია</h3>
                        <p className="text-muted-foreground max-w-lg mx-auto">
                            თუ პროდუქტი არ გაგამართლებთ, 7 დღის განმავლობაში დაგიბრუნებთ თანხას სრულად, შეკითხვების გარეშე.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}

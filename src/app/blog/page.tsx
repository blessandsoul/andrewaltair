import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Clock,
  Eye,
  Flame,
  Heart,
  TrendingUp,
  Filter,
  Sparkles,
  ArrowRight,
  Send,
  Mail
} from "lucide-react"
import postsData from "@/data/posts.json"
import { brand } from "@/lib/brand"

// Helper to format numbers
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

// Helper to get total reactions
function getTotalReactions(reactions: Record<string, number>): number {
  return Object.values(reactions).reduce((a, b) => a + b, 0)
}

export default function BlogPage() {
  const allPosts = postsData
  const featuredPosts = postsData.filter(p => p.featured)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
          <div className="absolute inset-0 noise-overlay"></div>
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="px-4 py-2">
              <Sparkles className="w-3 h-3 mr-2" />
              AI ბლოგი
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-gradient">სტატიები და ტუტორიალები</span>
            </h1>

            <p className="text-xl text-muted-foreground">
              ხელოვნური ინტელექტის შესახებ პრაქტიკული სახელმძღვანელოები, რჩევები და სიახლეები
            </p>

            {/* Search Bar */}
            <div className="flex gap-3 max-w-lg mx-auto pt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="მოძებნე სტატია..."
                  className="pl-10 h-12 bg-card"
                />
              </div>
              <Button size="lg" variant="outline" className="h-12">
                <Filter className="w-4 h-4 mr-2" />
                ფილტრი
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="py-8 border-y border-border bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="default" size="sm" className="rounded-full">
              ყველა
            </Button>
            {brand.categories.map((cat) => (
              <Button
                key={cat.id}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <span
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">⭐ რჩეული სტატიები</h2>
                  <p className="text-muted-foreground">ყველაზე საინტერესო მასალები</p>
                </div>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {featuredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="group h-full hover-lift card-shine border-0 shadow-xl bg-card overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-[2/1] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                        <Sparkles className="w-16 h-16 text-primary/30 group-hover:scale-110 transition-transform" />
                        <Badge className="absolute top-4 left-4 bg-primary text-white border-0">
                          რჩეული
                        </Badge>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary">
                            {brand.categories.find(c => c.id === post.category)?.name || post.category}
                          </Badge>
                          {post.trending && (
                            <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                              <Flame className="w-3 h-3 mr-1" />
                              ტრენდი
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {formatNumber(post.views)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {post.readingTime} წთ
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-red-500">
                            <Heart className="w-4 h-4" />
                            {formatNumber(getTotalReactions(post.reactions))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts Grid */}
      <section className="py-16 lg:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">📚 ყველა სტატია</h2>
                <p className="text-muted-foreground">სრული არქივი</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              სულ: {allPosts.length} სტატია
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="group h-full hover-lift card-shine border-0 shadow-lg bg-card">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
                      <Sparkles className="w-10 h-10 text-primary/30 group-hover:scale-110 transition-transform" />
                      {post.trending && (
                        <Badge className="absolute top-3 right-3 bg-red-500 text-white border-0 text-xs">
                          <Flame className="w-3 h-3 mr-1" />
                          ცხელი
                        </Badge>
                      )}
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {brand.categories.find(c => c.id === post.category)?.name || post.category}
                        </Badge>
                      </div>
                      <h3 className="font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {formatNumber(post.views)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readingTime} წთ
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-red-500">
                          <Heart className="w-4 h-4" />
                          {formatNumber(getTotalReactions(post.reactions))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              მეტის ჩვენება
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-90"></div>
        <div className="absolute inset-0 noise-overlay"></div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center text-white">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">
              არ გამოტოვო ახალი სტატიები
            </h2>
            <p className="text-lg text-white/80">
              გამოიწერე და მიიღე ახალი კონტენტი პირველმა
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  placeholder="შენი ელ-ფოსტა"
                  className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <Button size="lg" className="h-12 bg-white text-primary hover:bg-white/90">
                <Send className="w-4 h-4 mr-2" />
                გამოწერა
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowRight,
  Mail,
  TrendingUp,
  Sparkles,
  Play,
  Eye,
  Clock,
  Flame,
  Heart,
  Zap,
  ExternalLink,
  Youtube,
  Send,
  ChevronRight
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

export default function Home() {
  const featuredPost = postsData.find(p => p.featured && p.trending)
  const trendingPosts = postsData.filter(p => p.trending)
  const latestPosts = postsData.slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
          <div className="absolute inset-0 noise-overlay"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8 max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-primary">AI ინოვატორი და კონტენტ კრეატორი</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <span className="text-gradient">Andrew Altair</span>
              </h1>

              {/* Description */}
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
                  ხელოვნური ინტელექტის სამყარო <span className="text-foreground font-medium">მარტივად</span> და <span className="text-foreground font-medium">პრაქტიკულად</span>
                </p>
                <p className="text-lg text-muted-foreground/80 leading-relaxed">
                  ვიზიარებ AI-ს საიდუმლოებებს, ხრიკებს და ტუტორიალებს ქართულად.
                  შეუერთდი 50K+ მკითხველს!
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-8 py-6 text-lg glow-sm group"
                  asChild
                >
                  <Link href="/blog">
                    წაიკითხე ბლოგი
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 px-8 py-6 text-lg group"
                  asChild
                >
                  <Link href="/videos">
                    <Play className="w-5 h-5 mr-2" />
                    უყურე ვიდეოებს
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{brand.stats.yearsExperience}</div>
                  <div className="text-sm text-muted-foreground">წელი გამოცდილება</div>
                </div>
                <div className="w-px h-10 bg-border"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{brand.stats.subscribers}</div>
                  <div className="text-sm text-muted-foreground">გამომწერი</div>
                </div>
                <div className="w-px h-10 bg-border"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{brand.stats.articles}</div>
                  <div className="text-sm text-muted-foreground">სტატია</div>
                </div>
              </div>
            </div>

            {/* Featured Post Card */}
            {featuredPost && (
              <div className="relative animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl"></div>
                <Card className="relative glass-strong rounded-3xl overflow-hidden hover-lift">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-primary/50" />
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                          <Flame className="w-3 h-3 mr-1" />
                          ტრენდული
                        </Badge>
                        <Badge variant="outline">AI ხრიკები</Badge>
                      </div>
                      <h3 className="text-xl font-bold leading-tight line-clamp-2">
                        {featuredPost.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {formatNumber(featuredPost.views)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {featuredPost.readingTime} წთ
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary" asChild>
                          <Link href={`/blog/${featuredPost.slug}`}>
                            წაიკითხე
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trending Section - BuzzFeed Style */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">🔥 ტრენდული ახლა</h2>
                <p className="text-muted-foreground">ყველაზე პოპულარული სტატიები</p>
              </div>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/blog?sort=trending">
                ყველა
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trendingPosts.slice(0, 3).map((post, index) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="group h-full hover-lift card-shine border-0 shadow-lg bg-card">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <span className="text-4xl font-bold text-primary/20">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        {formatNumber(post.views)}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        {post.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center gap-1 text-red-500">
                          <Flame className="w-3 h-3" />
                          {formatNumber(getTotalReactions(post.reactions))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">⚡ უახლესი პოსტები</h2>
                <p className="text-muted-foreground">ახალი სტატიები და ტუტორიალები</p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/blog">
                ყველა სტატია
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="group h-full hover-lift card-shine border-0 shadow-lg bg-card">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-primary/30 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {brand.categories.find(c => c.id === post.category)?.name || post.category}
                        </Badge>
                        {post.trending && (
                          <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-xs">
                            <Flame className="w-3 h-3 mr-1" />
                            ტრენდი
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
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
        </div>
      </section>

      {/* Video Preview Section */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <Youtube className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">🎬 ვიდეო კონტენტი</h2>
                <p className="text-muted-foreground">AI ტუტორიალები და მიმოხილვები</p>
              </div>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/videos">
                ყველა ვიდეო
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="group hover-lift overflow-hidden border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-primary fill-primary ml-1" />
                      </div>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white border-0">
                      12:34
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      ChatGPT-ს ახალი ფუნქციები - სრული მიმოხილვა
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">2.3K ნახვა • 3 დღის წინ</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-90"></div>
        <div className="absolute inset-0 noise-overlay"></div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center text-white">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">შეუერთდი 15K+ გამომწერს</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              მიიღე AI სიახლეები პირველმა
            </h2>

            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
              კვირაში ერთხელ მიიღებ საუკეთესო AI რჩევებს, ტუტორიალებს და ექსკლუზიურ კონტენტს პირდაპირ შენს ინბოქსში
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="email"
                  placeholder="შენი ელ-ფოსტა"
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 focus:bg-white/20 h-12"
                />
              </div>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-12 px-8">
                <Send className="w-4 h-4 mr-2" />
                გამოწერა
              </Button>
            </div>

            <p className="text-sm text-white/60">
              სპამი არ იქნება. გამოწერის გაუქმება ნებისმიერ დროს.
            </p>
          </div>
        </div>
      </section>

      {/* GitHub Projects Section */}
      <section className="py-16 lg:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-background" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">💻 GitHub პროექტები</h2>
                <p className="text-muted-foreground">ღია კოდის პროექტები</p>
              </div>
            </div>
            <Link href="https://github.com/andrewaltair" target="_blank">
              <Button variant="outline" className="gap-2">
                ყველა პროექტი
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { name: "ai-chatbot-template", desc: "🤖 Next.js + OpenAI ChatGPT ჩატბოტის ტემპლეიტი", stars: 234, lang: "TypeScript" },
              { name: "prompt-library", desc: "📚 1000+ ChatGPT პრომპტის კოლექცია", stars: 189, lang: "Markdown" },
              { name: "make-automation-recipes", desc: "⚡ Make.com ავტომატიზაციის რეცეპტები", stars: 156, lang: "JSON" },
              { name: "ai-image-generator", desc: "🎨 DALL-E 3 სურათების გენერატორი", stars: 98, lang: "Python" },
            ].map((repo) => (
              <Link key={repo.name} href={`https://github.com/andrewaltair/${repo.name}`} target="_blank">
                <Card className="group h-full hover-lift border shadow-sm hover:shadow-lg transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h4 className="font-mono text-sm font-semibold text-primary group-hover:underline">
                          {repo.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {repo.desc}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full" style={{
                          backgroundColor: repo.lang === 'TypeScript' ? '#3178c6' :
                            repo.lang === 'Python' ? '#3572A5' :
                              repo.lang === 'Markdown' ? '#083fa1' : '#f1e05a'
                        }} />
                        {repo.lang}
                      </span>
                      <span className="flex items-center gap-1">
                        ⭐ {repo.stars}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-10">
            <h3 className="text-lg font-medium text-muted-foreground">გამომყევი სოციალურ ქსელებში</h3>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { name: 'YouTube', icon: Youtube, color: 'text-red-500', followers: '25K' },
              { name: 'Instagram', icon: Sparkles, color: 'text-pink-500', followers: '15K' },
              { name: 'Facebook', icon: Sparkles, color: 'text-blue-500', followers: '10K' },
              { name: 'TikTok', icon: Sparkles, color: 'text-foreground', followers: '8K' },
              { name: 'Telegram', icon: Send, color: 'text-sky-500', followers: '5K' },
            ].map((social) => (
              <Link
                key={social.name}
                href="#"
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
              >
                <social.icon className={`w-5 h-5 ${social.color}`} />
                <div className="text-left">
                  <div className="font-medium group-hover:text-primary transition-colors">{social.name}</div>
                  <div className="text-sm text-muted-foreground">{social.followers} გამომწერი</div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

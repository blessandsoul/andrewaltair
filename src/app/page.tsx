import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  TbArrowRight,
  TbMail,
  TbTrendingUp,
  TbSparkles,
  TbPlayerPlay,
  TbEye,
  TbClock,
  TbFlame,
  TbHeart,
  TbBolt,
  TbExternalLink,
  TbBrandYoutube,
  TbSend,
  TbChevronRight,
  TbMessage,
  TbShare,
  TbStar
} from "react-icons/tb"
import { brand } from "@/lib/brand"
import { PostCard } from "@/components/blog/PostCard"
import { TrendingCard } from "@/components/blog/TrendingCard"
// Engagement components removed - main page focuses on content
import dbConnect from "@/lib/db"
import Post from "@/models/Post"
import Video from "@/models/Video"
import { HeroCarousel } from "@/components/home/HeroCarousel"
import { NewsletterForm } from "@/components/home/NewsletterForm"

// Fetch posts directly from MongoDB (avoids self-referencing API deadlock)
async function getPosts() {
  try {
    await dbConnect()

    const posts = await Post.find({ status: 'published' })
      .sort({ order: 1, createdAt: -1 })
      .limit(10)
      .lean()

    // Transform _id to id for consistency
    return posts.map(post => ({
      ...post,
      id: post._id.toString(),
      _id: undefined,
    }))
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

// Fetch videos directly from MongoDB
async function getVideos() {
  try {
    await dbConnect()

    const videos = await Video.find({})
      .sort({ publishedAt: -1 })
      .limit(4)
      .lean()

    return videos.map(video => ({
      ...video,
      id: video._id.toString(),
      _id: undefined,
    }))
  } catch (error) {
    console.error('Error fetching videos:', error)
    return []
  }
}

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

export default async function Home() {
  const postsData = await getPosts()
  const videosData = await getVideos()
  // Get up to 5 posts for hero carousel
  const heroPosts = postsData.filter((p: any) => p.featured || p.trending).slice(0, 5)
  if (heroPosts.length === 0 && postsData.length > 0) {
    heroPosts.push(...postsData.slice(0, Math.min(5, postsData.length)))
  }
  const trendingPosts = postsData.filter((p: any) => p.trending)
  const latestPosts = postsData.slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
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
                    <TbArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 px-8 py-6 text-lg group"
                  asChild
                >
                  <Link href="/videos">
                    <TbPlayerPlay className="w-5 h-5 mr-2" />
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

            {/* Hero Posts Carousel */}
            {heroPosts.length > 0 && (
              <div className="relative animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl"></div>
                <HeroCarousel posts={heroPosts} />
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
                <TbTrendingUp className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">ტრენდული ახლა</h2>
                <p className="text-muted-foreground">ყველაზე პოპულარული სტატიები</p>
              </div>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/blog?sort=trending">
                ყველა
                <TbArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trendingPosts.slice(0, 3).map((post, index) => (
              <TrendingCard
                key={post.id}
                post={post as any}
                rank={index + 1}
              />
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
                <TbBolt className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">უახლესი პოსტები</h2>
                <p className="text-muted-foreground">ახალი სტატიები და ტუტორიალები</p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/blog">
                ყველა სტატია
                <TbArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post as any}
                showExcerpt={true}
                showTags={true}
                showAuthor={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Video Preview Section */}
      {videosData.length > 0 && (
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <TbBrandYoutube className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold">ვიდეო კონტენტი</h2>
                  <p className="text-muted-foreground">AI ტუტორიალები და მიმოხილვები</p>
                </div>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/videos">
                  ყველა ვიდეო
                  <TbArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {videosData.map((video: any) => (
                <Link key={video.id} href={`/videos/${video.id}`}>
                  <Card className="group hover-lift overflow-hidden border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
                        {video.youtubeId && (
                          <Image
                            src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                            alt={video.title}
                            fill
                            className="object-cover"
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <TbPlayerPlay className="w-6 h-6 text-red-600 fill-red-600 ml-1" />
                          </div>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-black/70 text-white border-0">
                          {video.duration || '00:00'}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                          {video.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatNumber(video.views || 0)} ნახვა
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}



      {/* Newsletter Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-90"></div>
        <div className="absolute inset-0 noise-overlay"></div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center text-white">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <TbMail className="w-4 h-4" />
              <span className="text-sm font-medium">შეუერთდი 15K+ გამომწერს</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              მიიღე AI სიახლეები პირველმა
            </h2>

            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
              კვირაში ერთხელ მიიღებ საუკეთესო AI რჩევებს, ტუტორიალებს და ექსკლუზიურ კონტენტს პირდაპირ შენს ინბოქსში
            </p>

            <div className="mt-8">
              <NewsletterForm />
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
                <h2 className="text-2xl font-bold">GitHub პროექტები</h2>
                <p className="text-muted-foreground">ღია კოდის პროექტები</p>
              </div>
            </div>
            <Link href="https://github.com/andrewaltair" target="_blank">
              <Button variant="outline" className="gap-2">
                ყველა პროექტი
                <TbExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { name: "ai-chatbot-template", desc: "Next.js + OpenAI ChatGPT ჩატბოტის ტემპლეიტი", stars: 234, lang: "TypeScript" },
              { name: "prompt-library", desc: "1000+ ChatGPT პრომპტის კოლექცია", stars: 189, lang: "Markdown" },
              { name: "make-automation-recipes", desc: "Make.com ავტომატიზაციის რეცეპტები", stars: 156, lang: "JSON" },
              { name: "ai-image-generator", desc: "DALL-E 3 სურათების გენერატორი", stars: 98, lang: "Python" },
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
                      <TbExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
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
                        <TbStar className="w-4 h-4 text-yellow-500" /> {repo.stars}
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
              { name: 'YouTube', icon: TbBrandYoutube, color: 'text-red-500', followers: '25K' },
              { name: 'Instagram', icon: TbSparkles, color: 'text-pink-500', followers: '15K' },
              { name: 'Facebook', icon: TbSparkles, color: 'text-blue-500', followers: '10K' },
              { name: 'TikTok', icon: TbSparkles, color: 'text-foreground', followers: '8K' },
              { name: 'Telegram', icon: TbSend, color: 'text-sky-500', followers: '5K' },
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
                <TbExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

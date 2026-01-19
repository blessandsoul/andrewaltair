// Force dynamic rendering to fix build OOM/Timeout issues
export const dynamic = 'force-dynamic'

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
import MarketplacePrompt from "@/models/MarketplacePrompt"
import MarketplacePromptCard from "@/components/prompts/MarketplacePromptCard"
import { HeroCarousel } from "@/components/home/HeroCarousel"
import { NewsletterForm } from "@/components/home/NewsletterForm"
import { HomeLayoutSwitcher } from "@/components/home/HomeLayoutSwitcher"

import { HeroSearch } from "@/components/home/HeroSearch"
import { HeroTags } from "@/components/home/HeroTags"

// Fetch posts directly from MongoDB (avoids self-referencing API deadlock)
async function getPosts() {
  try {
    await dbConnect()

    const posts = await Post.find({ status: 'published' })
      .sort({ publishedAt: -1 })
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
      .limit(8)
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


// Fetch latest prompts directly from MongoDB
async function getLatestPrompts() {
  try {
    await dbConnect()

    const prompts = await MarketplacePrompt.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean()

    return prompts.map(prompt => ({
      ...prompt,
      id: prompt._id.toString(),
      _id: undefined,
      authorId: prompt.authorId?.toString(),
      relatedPrompts: prompt.relatedPrompts?.map((id: any) => id.toString()),
      bundles: prompt.bundles?.map((id: any) => id.toString()),
      createdAt: prompt.createdAt?.toISOString(),
      updatedAt: prompt.updatedAt?.toISOString(),
      // Ensure numeric fields are numbers, not potentially undefined/null if lean is weird (usually fine with TS)
    }))
  } catch (error) {
    console.error('Error fetching prompts:', error)
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
  const promptsData = await getLatestPrompts()
  // Get up to 5 posts for hero carousel
  const heroPosts = postsData.filter((p: any) => p.featured || p.trending).slice(0, 5)
  if (heroPosts.length === 0 && postsData.length > 0) {
    heroPosts.push(...postsData.slice(0, Math.min(5, postsData.length)))
  }
  const trendingPosts = postsData.filter((p: any) => p.trending)
  const latestPosts = postsData.slice(0, 6)

  // Homepage Schema for SEO
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'
  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Andrew Altair - AI ინოვატორი',
    description: 'ხელოვნური ინტელექტის სამყარო მარტივად და პრაქტიკულად',
    url: siteUrl,
    mainEntity: {
      '@type': 'ItemList',
      name: 'უახლესი კონტენტი',
      itemListElement: [
        ...postsData.slice(0, 5).map((post: any, i: number) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'BlogPosting',
            headline: post.title,
            url: `${siteUrl}/blog/${post.slug}`
          }
        })),
        ...promptsData.slice(0, 3).map((prompt: any, i: number) => ({
          '@type': 'ListItem',
          position: 6 + i,
          item: {
            '@type': 'Product',
            name: prompt.title,
            url: `${siteUrl}/prompts/${prompt.slug}`,
            offers: {
              '@type': 'Offer',
              url: `${siteUrl}/prompts/${prompt.slug}`,
              priceCurrency: prompt.currency || 'USD',
              price: prompt.isFree ? '0' : (prompt.price || '0'),
              availability: 'https://schema.org/OnlineOnly'
            }
          }
        }))
      ]
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <div className="min-h-screen">
        {/* Hero Section with Carousel */}
        <section className="relative min-h-[auto] lg:min-h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
            <div className="absolute inset-0 noise-overlay"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-0 pb-12 lg:pt-4">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4 max-w-2xl">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <span className="text-gradient">გახდი AI პროფესიონალი ნულიდან</span>
                </h1>

                {/* Description */}
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                  <div className="space-y-2">
                    <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                      პრაქტიკული ტუტორიალები, უფასო კურსები და რეალური მაგალითები.
                    </p>
                    <p className="text-base text-muted-foreground/80 leading-relaxed">
                      ისწავლე როგორ გამოიყენო <span className="text-foreground font-medium">GEMINI 3</span>, <span className="text-foreground font-medium">CHATGPT 5.2</span>, <span className="text-foreground font-medium">GROK 3</span> და <span className="text-foreground font-medium">CLAUDE 4.5</span> ეფექტურად.
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="pt-1">
                    <HeroTags />
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 pt-1">
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


        {/* Dynamic Layout Section - User can switch between 4 layouts */}
        <HomeLayoutSwitcher posts={postsData} videos={videosData} />

        {/* Latest Prompts Section */}
        <section className="py-20 lg:py-24 bg-muted/20 border-t border-b border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-12">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider w-fit">
                  <TbSparkles className="w-3.5 h-3.5" />
                  პრემიუმ ხარისხის პრომპტები
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">უახლესი AI პრომპტები</h2>
                <p className="text-muted-foreground text-lg">
                  CHATGPT 5.2, GEMINI 3 / NANO BANANA, GROK 3, CLAUDE 4.5
                </p>
              </div>

              <Link href="/prompts">
                <Button variant="outline" className="gap-2 group">
                  ყველას ნახვა
                  <TbArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {promptsData.map((prompt: any) => (
                <MarketplacePromptCard key={prompt.id} prompt={prompt} />
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
    </>
  )
}

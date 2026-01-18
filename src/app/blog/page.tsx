// Force dynamic rendering to fix build OOM/Timeout issues
export const dynamic = 'force-dynamic'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  TbSearch,
  TbClock,
  TbEye,
  TbFlame,
  TbHeart,
  TbTrendingUp,
  TbFilter,
  TbSparkles,
  TbArrowRight,
  TbSend,
  TbMail,
  TbMessage,
  TbShare
} from "react-icons/tb"
import { brand } from "@/lib/brand"
import { PostCard } from "@/components/blog/PostCard"
import { FeaturedCard } from "@/components/blog/FeaturedCard"
import dbConnect from "@/lib/db"
import Post from "@/models/Post"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI ბლოგი - სტატიები და ტუტორიალები | Andrew Altair",
  description: "ხელოვნური ინტელექტის შესახებ პრაქტიკული სახელმძღვანელოები, რჩევები და სიახლეები. ChatGPT, Midjourney, Stable Diffusion და სხვა AI ინსტრუმენტების ტუტორიალები ქართულად.",
  openGraph: {
    title: "AI ბლოგი | Andrew Altair",
    description: "ხელოვნური ინტელექტის შესახებ პრაქტიკული სახელმძღვანელოები და რჩევები.",
    type: "website",
    locale: "ka_GE",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI ბლოგი - სტატიები და ტუტორიალები",
    description: "ხელოვნური ინტელექტის შესახებ პრაქტიკული სახელმძღვანელოები.",
  },
}

// Fetch posts directly from MongoDB (more reliable for SSR)
async function getPosts() {
  try {
    await dbConnect()
    const posts = await Post.find({ status: 'published' })
      .sort({ order: 1, createdAt: -1 })
      .limit(50)
      .lean()

    // Transform MongoDB documents to plain objects with string IDs
    return posts.map((post) => ({
      ...post,
      id: post._id.toString(),
      _id: post._id.toString(),
    }))
  } catch (error) {
    console.error('Error fetching posts:', error)
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

export default async function BlogPage() {
  const allPosts = await getPosts()
  const featuredPosts = allPosts.filter((p: { featured: boolean }) => p.featured)

  // CollectionPage Schema for Blog
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI ბლოგი',
    description: 'ხელოვნური ინტელექტის შესახებ პრაქტიკული სახელმძღვანელოები და რჩევები',
    url: `${siteUrl}/blog`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: allPosts.length,
      itemListElement: allPosts.slice(0, 10).map((post: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'BlogPosting',
          headline: post.title,
          url: `${siteUrl}/blog/${post.slug}`,
          datePublished: post.publishedAt,
          author: {
            '@type': 'Person',
            name: 'Andrew Altair'
          }
        }
      }))
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
            <div className="absolute inset-0 noise-overlay"></div>
          </div>

          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Badge variant="secondary" className="px-4 py-2">
                <TbSparkles className="w-3 h-3 mr-2" />
                AI ბლოგი
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-gradient">სტატიები და ტუტორიალები</span>
              </h1>

              <p className="text-xl text-muted-foreground">
                ხელოვნური ინტელექტის შესახებ პრაქტიკული სახელმძღვანელოები, რჩევები და სიახლეები
              </p>

              {/* TbSearch Bar */}
              <div className="flex gap-3 max-w-lg mx-auto pt-4">
                <div className="relative flex-1">
                  <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="მოძებნე სტატია..."
                    className="pl-10 h-12 bg-card"
                  />
                </div>
                <Button size="lg" variant="outline" className="h-12">
                  <TbFilter className="w-4 h-4 mr-2" />
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
                    <TbTrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">რჩეული სტატიები</h2>
                    <p className="text-muted-foreground">ყველაზე საინტერესო მასალები</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {featuredPosts.map((post: { id: string }) => (
                  <FeaturedCard key={post.id} post={post as any} />
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
                  <TbSparkles className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">ყველა სტატია</h2>
                  <p className="text-muted-foreground">სრული არქივი</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                სულ: {allPosts.length} სტატია
              </div>
            </div>

            {allPosts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {allPosts.map((post: { id: string }) => (
                  <PostCard
                    key={post.id}
                    post={post as any}
                    showExcerpt={true}
                    showTags={true}
                    showAuthor={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 space-y-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                  <TbSparkles className="w-12 h-12 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">სტატიები მალე!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    ახალი სტატიები და ტუტორიალები მალე დაემატება. გამოიწერე რომ პირველმა გაიგო!
                  </p>
                </div>
                <Button size="lg" asChild>
                  <Link href="/">
                    <TbArrowRight className="w-4 h-4 mr-2" />
                    მთავარ გვერდზე დაბრუნება
                  </Link>
                </Button>
              </div>
            )}

            {/* Load More */}
            <div className="text-center mt-12">
              <Button size="lg" variant="outline">
                მეტის ჩვენება
                <TbArrowRight className="w-4 h-4 ml-2" />
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
                  <TbMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    placeholder="შენი ელ-ფოსტა"
                    className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <Button size="lg" className="h-12 bg-white text-primary hover:bg-white/90">
                  <TbSend className="w-4 h-4 mr-2" />
                  გამოწერა
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

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
import { slugToRawTag } from "@/lib/slug"
import { Metadata } from "next"
import { unstable_cache } from "next/cache"

export async function generateMetadata(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const searchParams = await props.searchParams
  // ?tag/?category/?search variants flooded GSC as duplicates (610 junk URLs in
  // «alternate-canonical» + «crawled-not-indexed» classes, drilldown 2026-06-12).
  // noindex,follow collapses them; ?page= stays indexable for crawl depth.
  const hasFilterParams = Boolean(searchParams.tag || searchParams.category || searchParams.search)

  return {
    title: "AI ბლოგი - სტატიები და ტუტორიალები",
    description: "ხელოვნური ინტელექტის შესახებ პრაქტიკული სახელმძღვანელოები, რჩევები და სიახლეები. ChatGPT, Midjourney, Stable Diffusion და სხვა AI ინსტრუმენტების ტუტორიალები ქართულად.",
    ...(hasFilterParams ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: "AI ბლოგი | Andrew Altair",
      description: "ხელოვნური ინტელექტის შესახებ პრაქტიკული სახელმძღვანელოები და რჩევები.",
      type: "website",
      locale: "ka_GE",
      images: [{ url: '/og.png', width: 1200, height: 630, alt: 'AI ბლოგი' }],
    },
    twitter: {
      card: "summary_large_image",
      title: "AI ბლოგი - სტატიები და ტუტორიალები",
      description: "ხელოვნური ინტელექტის შესახებ პრაქტიკული სახელმძღვანელოები.",
      images: ['/og.png'],
    },
    alternates: {
      canonical: 'https://andrewaltair.ge/blog',
    },
  }
}

// Fetch posts directly from MongoDB — memoized via unstable_cache (tag 'posts',
// busted on publish). The page stays request-dynamic because of searchParams,
// but identical listing requests stop hitting Mongo for 5 minutes.
const POSTS_PER_PAGE = 24

const getCachedBlogListing = unstable_cache(
  async (category: string | undefined, search: string | undefined, tag: string | undefined, page: number) => {
    await dbConnect()

    const query: any = { status: 'published' }
    if (category) {
      query.categories = category
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { "sections.content": { $regex: search, $options: 'i' } }
      ]
    }

    // Resolve tag slug → raw tag value. Posts store tags as free-text strings,
    // so URLs use slugs and we reverse-lookup against the live distinct set.
    // Falls back to raw value for backward compat with old indexed URLs.
    if (tag) {
      const allTags = (await Post.distinct('tags', { status: 'published' })) as string[]
      const resolved = slugToRawTag(tag, allTags)
      query.tags = resolved ?? tag
    }

    const totalPostsCount = await Post.countDocuments(query)

    const postsData = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * POSTS_PER_PAGE)
      .limit(POSTS_PER_PAGE)
      .lean()

    const allPosts = postsData.map((post) => ({
      ...post,
      id: post._id.toString(),
      _id: post._id.toString(),
    }))

    // serialize inside the cached fn — the cache stores plain JSON
    return JSON.parse(JSON.stringify({ allPosts, totalPostsCount }))
  },
  ['blog-listing'],
  { revalidate: 300, tags: ['posts'] }
)

export default async function BlogPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const tag = typeof searchParams.tag === 'string' ? searchParams.tag : undefined
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined
  const pageParam = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1

  let allPosts: any[] = []
  let featuredPosts: any[] = []
  let totalPostsCount = 0

  try {
    const listing = await getCachedBlogListing(category, search, tag, page)
    allPosts = listing.allPosts
    totalPostsCount = listing.totalPostsCount
    featuredPosts = page === 1 ? allPosts.filter((p: any) => p.featured) : []
  } catch (error) {
    console.error('Error fetching blog posts:', error)
  }

  const totalPages = Math.max(1, Math.ceil(totalPostsCount / POSTS_PER_PAGE))
  const buildPageHref = (p: number) => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (search) params.set('search', search)
    if (tag) params.set('tag', tag)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return qs ? `/blog?${qs}` : '/blog'
  }

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
      numberOfItems: totalPostsCount,
      itemListElement: allPosts.slice(0, 10).map((post: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'BlogPosting',
          headline: post.title,
          url: `${siteUrl}/blog/${post.slug}`,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt || post.publishedAt,
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

              {/* Search — a real GET form: submits to crawlable /blog?search= URLs
                  (the old input had no form/handler and went nowhere) */}
              <form action="/blog" method="get" className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto pt-4">
                <div className="relative flex-1">
                  <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    name="search"
                    placeholder="მოძებნე სტატია..."
                    className="pl-10 h-12 bg-card"
                    defaultValue={search}
                  />
                </div>
                <Button type="submit" size="lg" variant="outline" className="h-12">
                  <TbSearch className="w-4 h-4 mr-2" />
                  ძებნა
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Category Pills */}
        <section className="py-8 border-y border-border bg-card/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/blog">
                <Button variant={!tag && !search && !category ? "default" : "outline"} size="sm" className="rounded-full">
                  ყველა
                </Button>
              </Link>
              {brand.categories.map((cat) => (
                <Link key={cat.id} href={`/blog?category=${cat.name}`}>
                  <Button
                    variant={category === cat.name ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                  >
                    <span
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Filter Status */}
        {(tag || search || category) && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-medium">ფილტრი:</span>
              {tag && <Badge variant="outline">Tag: {tag}</Badge>}
              {search && <Badge variant="outline">Search: {search}</Badge>}
              {category && <Badge variant="outline">Category: {category}</Badge>}
              <Link href="/blog" className="text-primary hover:underline text-sm ml-2">გასუფთავება</Link>
            </div>
          </div>
        )}

        {/* Featured Posts (Only show on home/no filters) */}
        {!tag && !search && !category && featuredPosts.length > 0 && (
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
                  <h2 className="text-2xl font-bold">
                    {tag || search || category ? 'ნაპოვნი სტატიები' : 'ყველა სტატია'}
                  </h2>
                  <p className="text-muted-foreground">
                    {tag ? `თეგი: ${tag}` : 'სრული არქივი'}
                  </p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                სულ: {totalPostsCount} სტატია
                {totalPages > 1 && ` · გვერდი ${page}/${totalPages}`}
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
                  <h3 className="text-2xl font-bold">სტატიები არ მოიძებნა</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    სცადეთ სხვა საძიებო სიტყვა ან კატეგორია.
                  </p>
                </div>
                <Button size="lg" asChild>
                  <Link href="/blog">
                    <TbArrowRight className="w-4 h-4 mr-2" />
                    ყველა სტატიის ნახვა
                  </Link>
                </Button>
              </div>
            )}

            {/* Pagination — real crawlable links; posts beyond page 1 used to be
                orphaned behind a permanently-disabled "load more" button */}
            {totalPages > 1 && (
              <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-12 flex-wrap">
                {page > 1 && (
                  <Link href={buildPageHref(page - 1)} rel="prev">
                    <Button variant="outline" size="sm">← წინა</Button>
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .map((p, idx, arr) => (
                    <span key={p} className="flex items-center gap-2">
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="text-muted-foreground">…</span>
                      )}
                      <Link href={buildPageHref(p)}>
                        <Button variant={p === page ? "default" : "outline"} size="sm">
                          {p}
                        </Button>
                      </Link>
                    </span>
                  ))}
                {page < totalPages && (
                  <Link href={buildPageHref(page + 1)} rel="next">
                    <Button variant="outline" size="sm">შემდეგი →</Button>
                  </Link>
                )}
              </nav>
            )}
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
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="relative flex-1">
                  <TbMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    placeholder="შენი ელ-ფოსტა"
                    className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50" // tailwindcss v3 input color fix
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

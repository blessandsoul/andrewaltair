// ISR: Revalidate homepage every hour for fresh content + fast TTFB
export const revalidate = 3600

import dbConnect from "@/lib/db"
import Post from "@/models/Post"
import Video from "@/models/Video"
import MarketplacePrompt from "@/models/MarketplacePrompt"
import Insight from "@/models/Insight"
import { HeroCarousel } from "@/components/home/HeroCarousel"
import { HeroTags } from "@/components/home/HeroTags"
import { QuickAccessGrid } from "@/components/home/QuickAccessGrid"
import { PromptsSection } from "@/components/home/PromptsSection"
import { ArticlesSection } from "@/components/home/ArticlesSection"
import { BotsSection } from "@/components/home/BotsSection"
import { InsightsSection } from "@/components/home/InsightsSection"
import { ServicesSection } from "@/components/home/ServicesSection"
import { VideosSection } from "@/components/home/VideosSection"
import { SocialProof } from "@/components/home/SocialProof"
import { brand } from "@/lib/brand"

// Fetch posts directly from MongoDB (avoids self-referencing API deadlock)
async function getPosts() {
  try {
    await dbConnect()

    const posts = await Post.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(10)
      .lean()

    return posts.map(post => ({
      ...post,
      id: post._id.toString(),
      _id: undefined,
      faq: post.faq?.map((item: any) => ({
        ...item,
        _id: item._id ? item._id.toString() : undefined
      }))
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
      .lean() as any[]

    return videos.map(video => ({
      id: video._id.toString(),
      youtubeId: video.youtubeId,
      title: video.title,
      description: video.description,
      category: video.category,
      duration: video.duration || '',
      views: video.views || 0,
      type: video.type || 'long',
      publishedAt: video.publishedAt ? new Date(video.publishedAt).toISOString() : new Date().toISOString(),
      authorName: video.authorName || 'Andrew Altair',
      authorAvatar: video.authorAvatar || '/andrewaltair.png',
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
    }))
  } catch (error) {
    console.error('Error fetching prompts:', error)
    return []
  }
}

// Fetch latest insights directly from MongoDB
async function getInsights() {
  try {
    await dbConnect()

    const insights = await Insight.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(4)
      .lean()

    return insights.map(insight => ({
      ...insight,
      id: insight._id.toString(),
      _id: undefined,
      publishedAt: insight.publishedAt ? new Date(insight.publishedAt).toISOString() : new Date().toISOString(),
    }))
  } catch (error) {
    console.error('Error fetching insights:', error)
    return []
  }
}

export default async function Home() {
  const [postsData, videosData, promptsData, insightsData] = await Promise.all([
    getPosts(),
    getVideos(),
    getLatestPrompts(),
    getInsights(),
  ])

  const heroPosts = postsData.filter((p: any) => p.featured || p.trending).slice(0, 5)
  if (heroPosts.length === 0 && postsData.length > 0) {
    heroPosts.push(...postsData.slice(0, Math.min(5, postsData.length)))
  }

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

      <main className="pb-20 space-y-16 max-w-400 mx-auto">
        {/* Section 1: Hero (8/12) + Quick Access (4/12) */}
        <section className="grid grid-cols-12 gap-6 px-4 sm:px-6 lg:px-8 pt-8">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {heroPosts.length > 0 && <HeroCarousel posts={heroPosts} />}

            {/* Description + Tags below carousel */}
            <div className="space-y-3 px-1">
              <p className="text-on-surface-variant text-sm leading-relaxed max-w-2xl">
                {brand.bio.short}
              </p>
              <HeroTags />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <QuickAccessGrid />
          </div>
        </section>

        {/* Section 2-7: Content sections */}
        <div className="px-4 sm:px-6 lg:px-8 space-y-16">
          <PromptsSection prompts={promptsData as any[]} />
          <ArticlesSection posts={postsData.slice(0, 3) as any[]} />
          <InsightsSection insights={insightsData as any[]} />
          <BotsSection />
          <ServicesSection />
          <VideosSection videos={videosData} />
          <SocialProof />
        </div>
      </main>
    </>
  )
}

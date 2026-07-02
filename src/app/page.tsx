// ISR: Revalidate homepage every hour for fresh content + fast TTFB
export const revalidate = 3600

import type { Metadata } from "next"
import dbConnect from "@/lib/db"
import Post from "@/models/Post"
import Video from "@/models/Video"
import MarketplacePrompt from "@/models/MarketplacePrompt"
import Insight from "@/models/Insight"
import ForumTopic from "@/models/ForumTopic"
import ForumPost from "@/models/ForumPost"
import { HeroIntro } from "@/components/home/HeroIntro"
import { HeroCarousel } from "@/components/home/HeroCarousel"
import { HeroTags } from "@/components/home/HeroTags"
import { QuickAccessGrid } from "@/components/home/QuickAccessGrid"
import { PromptsSection } from "@/components/home/PromptsSection"
import { ArticlesSection } from "@/components/home/ArticlesSection"
import { BotsSection } from "@/components/home/BotsSection"
import { InsightsSection } from "@/components/home/InsightsSection"
import { ServicesSection } from "@/components/home/ServicesSection"
import { AiNowPromo } from "@/components/ainow/AiNowPromo"
import { VideosSection } from "@/components/home/VideosSection"
import { ForumTeaser } from "@/components/home/ForumTeaser"
import { SocialProof } from "@/components/home/SocialProof"

export const metadata: Metadata = {
  title: "Andrew Altair — AI ექსპერტი, ბლოგი და ინსტრუმენტები ქართულად",
  description: "ხელოვნური ინტელექტი ქართულად: AI ბლოგი, ChatGPT, Grok, Claude და Gemini გზამკვლევები, პრომპტ ბილდერი, AI ბოტები და კონსულტაცია. 400+ სტატია, 50+ ვიდეო.",
  keywords: ["AI ქართულად", "ხელოვნური ინტელექტი", "ChatGPT საქართველო", "Grok ქართულად", "AI ბლოგი", "Claude", "Gemini", "AI კონსულტაცია", "პრომპტი", "Andrew Altair"],
  alternates: {
    canonical: 'https://andrewaltair.ge/',
  },
  openGraph: {
    title: "Andrew Altair — AI ექსპერტი, ბლოგი და ინსტრუმენტები ქართულად",
    description: "AI ბლოგი, ChatGPT/Grok/Claude გზამკვლევები, პრომპტ ბილდერი, AI ბოტები ქართულად.",
    url: 'https://andrewaltair.ge/',
    type: "website",
    locale: "ka_GE",
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Andrew Altair — AI ექსპერტი საქართველოში' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrew Altair — AI ექსპერტი ქართულად",
    description: "AI ბლოგი, გზამკვლევები, პრომპტი და AI ბოტები ქართულად.",
    images: ['/og.png'],
  },
}

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
      likedBy: video.likedBy || [],
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

// Fetch the latest published forum topic + its debating personas for the home teaser
async function getForumTeaser() {
  try {
    await dbConnect()

    const topic = await ForumTopic.findOne({ status: 'published' })
      .sort({ publishedAt: -1 })
      .lean() as any

    if (!topic) return null

    const posts = await ForumPost.find({ topicId: topic._id })
      .select('personaId')
      .limit(12)
      .lean() as any[]

    const seen = new Set<string>()
    const personaIds: string[] = []
    for (const p of posts) {
      if (p.personaId && !seen.has(p.personaId)) {
        seen.add(p.personaId)
        personaIds.push(p.personaId)
      }
    }

    return {
      topic: {
        slug: topic.slug,
        titleKa: topic.titleKa,
        summaryKa: topic.summaryKa,
        sourceImage: topic.sourceImage,
        postCount: topic.postCount,
      },
      personaIds: personaIds.slice(0, 6),
    }
  } catch (error) {
    console.error('Error fetching forum teaser:', error)
    return null
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
  const [postsData, videosData, promptsData, insightsData, forumTeaser] = await Promise.all([
    getPosts(),
    getVideos(),
    getLatestPrompts(),
    getInsights(),
    getForumTeaser(),
  ])

  const heroPosts = postsData.filter((p: any) => p.featured || p.trending).slice(0, 5)
  if (heroPosts.length === 0 && postsData.length > 0) {
    heroPosts.push(...postsData.slice(0, Math.min(5, postsData.length)))
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'
  const newestPost = postsData[0] as any
  const lastModified = newestPost?.publishedAt
    ? new Date(newestPost.publishedAt).toISOString()
    : new Date().toISOString()
  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Andrew Altair - AI ინოვატორი',
    description: 'ხელოვნური ინტელექტის სამყარო მარტივად და პრაქტიკულად',
    url: siteUrl,
    datePublished: '2024-01-01T00:00:00.000Z',
    dateModified: lastModified,
    inLanguage: 'ka',
    isPartOf: { '@id': 'https://andrewaltair.ge/#website' },
    about: { '@id': 'https://andrewaltair.ge/#person' },
    primaryImageOfPage: 'https://andrewaltair.ge/og.png',
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
        {/* Section order = expert → product → content-as-proof.
            The old order opened with a random-article carousel and buried the
            consulting/courses CTAs at position 8 and trust metrics in the footer. */}

        {/* 1. Who Andrew is + CTAs + trust strip (visible H1 lives here) */}
        <HeroIntro />

        <div className="px-4 sm:px-6 lg:px-8 space-y-16">
          {/* 2. The product — consulting + courses, second screen */}
          <ServicesSection />
          {/* aiNOW sister brand, adjacent to Andrew's own services */}
          <AiNowPromo variant="banner" context="home" />
        </div>

        {/* 3. What's hot now: featured carousel (8/12) + quick access (4/12) */}
        <section className="grid grid-cols-12 gap-6 px-4 sm:px-6 lg:px-8">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {heroPosts.length > 0 && <HeroCarousel posts={heroPosts} />}
            <div className="px-1">
              <HeroTags />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <QuickAccessGrid />
          </div>
        </section>

        {/* 4-7. Content core → marketplace → videos → community */}
        <div className="px-4 sm:px-6 lg:px-8 space-y-16">
          <ArticlesSection posts={postsData.slice(0, 3) as any[]} />
          <InsightsSection insights={insightsData as any[]} />
          <BotsSection />
          <PromptsSection prompts={promptsData as any[]} />
          <VideosSection videos={videosData} />
          {forumTeaser && <ForumTeaser topic={forumTeaser.topic} personaIds={forumTeaser.personaIds} />}
          <SocialProof />
        </div>
      </main>
    </>
  )
}

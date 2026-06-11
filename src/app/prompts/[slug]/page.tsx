import { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import PromptDetailClient from './PromptDetailClient'
import dbConnect from '@/lib/db'
import MarketplacePrompt from '@/models/MarketplacePrompt'
import { generateUniqueId } from '@/lib/id-system'
import { lookupRedirect, legacySlugById } from '@/lib/seo-redirects'

interface Props {
    params: { slug: string }
}

const optimizeYouTubeUrl = (url: unknown): string => {
    if (!url || typeof url !== 'string') return ''
    if (url.includes('img.youtube.com') || url.includes('i.ytimg.com')) {
        return url.replace('maxresdefault.jpg', 'hqdefault.jpg')
    }
    return url
}

const safeRender = (value: unknown): string => {
    try {
        if (value === null || value === undefined) return ''
        if (typeof value === 'string') return value
        if (typeof value === 'number') return String(value)
        if (typeof value === 'boolean') return String(value)
        if (Array.isArray(value)) return value.map(safeRender).join(', ')
        if (typeof value === 'object') {
            const obj = value as Record<string, unknown>
            return String(obj.name || obj.title || obj.slug || obj.label || JSON.stringify(value))
        }
        return String(value)
    } catch {
        return ''
    }
}

async function getPrompt(slug: string) {
    try {
        await dbConnect()

        const prompt = await MarketplacePrompt.findOne({ slug }).lean()
        if (!prompt) return null

        // Only show published prompts to public
        if (prompt.status !== 'published') return null

        const result: any = {
            ...prompt,
            id: prompt._id.toString(),
            _id: undefined,
        }

        // For paid prompts, hide the full template
        if (!prompt.isFree) {
            result.promptTemplate = (prompt.promptTemplate || '').substring(0, 100) + '...[Preview - Purchase to see full prompt]'
            result.instructions = prompt.instructions ? prompt.instructions.substring(0, 100) + '...' : ''
            result.negativePrompt = prompt.negativePrompt ? prompt.negativePrompt.substring(0, 50) + '...' : ''
        }

        // Backfill numericId if missing
        if (!prompt.numericId) {
            const numericId = await generateUniqueId()
            await MarketplacePrompt.updateOne({ _id: prompt._id }, { numericId })
            result.numericId = numericId
        }

        // Optimize YouTube URLs
        if (result.coverImage) result.coverImage = optimizeYouTubeUrl(result.coverImage)
        if (Array.isArray(result.exampleImages)) {
            result.exampleImages = result.exampleImages.map((img: any) => ({
                ...img,
                src: optimizeYouTubeUrl(img.src)
            }))
        } else {
            result.exampleImages = []
        }

        return result
    } catch (error) {
        console.error('getPrompt error:', error)
        return null
    }
}

async function getRelatedPrompts(category: string, currentSlug: string) {
    try {
        await dbConnect()

        const prompts = await MarketplacePrompt.find({
            category,
            status: 'published',
            slug: { $ne: currentSlug },
        })
            .limit(4)
            .select('-promptTemplate -instructions -variables -negativePrompt')
            .lean()

        return prompts.map(p => ({
            ...p,
            id: p._id.toString(),
            _id: undefined,
        }))
    } catch (error) {
        console.error('getRelatedPrompts error:', error)
        return []
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = params
    const prompt = await getPrompt(slug)

    // real 404 status — body-level notFound() alone soft-404s under root loading.tsx
    if (!prompt) {
        // legacy /prompts/<ObjectId> URLs = 9 of 15 official GSC soft-404s → 301 to slug
        const legacySlug = await legacySlugById('prompt', slug)
        if (legacySlug) permanentRedirect(`/prompts/${legacySlug}`)
        const target = await lookupRedirect(`/prompts/${slug}`)
        if (target) permanentRedirect(target)
        notFound()
    }

    const title = safeRender(prompt.title)
    const description = typeof prompt.description === 'string' ? prompt.description.substring(0, 160) : ''
    const excerpt = safeRender(prompt.excerpt || description)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'
    let coverImage = typeof prompt.coverImage === 'string' ? prompt.coverImage : ''

    if (coverImage && !coverImage.startsWith('http')) {
        coverImage = `${siteUrl}${coverImage.startsWith('/') ? '' : '/'}${coverImage}`
    } else if (!coverImage) {
        coverImage = `${siteUrl}/og.png`
    }

    return {
        title: `${title} | AI Prompts`,
        description: excerpt,
        openGraph: {
            title: title,
            description: excerpt,
            images: coverImage ? [{ url: coverImage }] : [],
            type: 'article',
            url: `${siteUrl}/prompts/${slug}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: excerpt,
            images: [coverImage],
        },
        alternates: {
            canonical: `${siteUrl}/prompts/${slug}`,
        },
    }
}

export default async function PromptDetailPage({ params }: Props) {
    const { slug } = params
    const prompt = await getPrompt(slug)

    if (!prompt) {
        notFound()
    }

    let primaryCategory = ''
    if (Array.isArray(prompt.category) && prompt.category.length > 0) {
        primaryCategory = safeRender(prompt.category[0])
    } else if (prompt.category) {
        primaryCategory = safeRender(prompt.category)
    }

    if (primaryCategory.startsWith('{')) primaryCategory = ''

    const relatedPrompts = await getRelatedPrompts(primaryCategory, prompt.slug)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'
    const imageUrl = prompt.coverImage || `${siteUrl}/og.png`

    const productJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: safeRender(prompt.title),
        image: imageUrl,
        description: safeRender(prompt.excerpt || prompt.description),
        brand: {
            '@type': 'Brand',
            name: 'Andrew Altair Prompts'
        },
        offers: {
            '@type': 'Offer',
            url: `${siteUrl}/prompts/${prompt.slug}`,
            priceCurrency: safeRender(prompt.currency || 'USD'),
            price: prompt.isFree ? '0' : safeRender(prompt.price),
            availability: 'https://schema.org/OnlineOnly',
            'hasMerchantReturnPolicy': {
                '@type': 'MerchantReturnPolicy',
                'applicableCountry': 'GE',
                'returnPolicyCategory': 'https://schema.org/MerchantReturnNotPermitted'
            },
            'shippingDetails': {
                '@type': 'OfferShippingDetails',
                'shippingRate': {
                    '@type': 'MonetaryAmount',
                    'value': 0,
                    'currency': 'USD'
                },
                'shippingDestination': {
                    '@type': 'DefinedRegion',
                    'addressCountry': 'GE'
                }
            }
        },
        aggregateRating: (prompt.rating || 0) > 0 ? {
            '@type': 'AggregateRating',
            ratingValue: safeRender(prompt.rating),
            reviewCount: safeRender(prompt.reviewsCount || 1),
            bestRating: "5",
            worstRating: "1"
        } : undefined
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <PromptDetailClient prompt={prompt} relatedPrompts={relatedPrompts} />
        </>
    )
}

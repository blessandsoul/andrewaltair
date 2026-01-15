import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PromptDetailClient from './PromptDetailClient'

interface Props {
    params: { slug: string }
}

const optimizeYouTubeUrl = (url: any) => {
    if (!url || typeof url !== 'string') return ''
    if (url.includes('img.youtube.com') || url.includes('i.ytimg.com')) {
        return url.replace('maxresdefault.jpg', 'hqdefault.jpg')
    }
    return url
}

const safeRender = (value: any): string => {
    try {
        if (value === null || value === undefined) return ''
        if (typeof value === 'string') return value
        if (typeof value === 'number') return String(value)
        if (typeof value === 'boolean') return String(value)
        if (Array.isArray(value)) return value.map(safeRender).join(', ')
        if (typeof value === 'object') {
            return value.name || value.title || value.slug || value.label || JSON.stringify(value)
        }
        return String(value)
    } catch (e) {
        return ''
    }
}

async function getPrompt(slug: string) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl}/api/prompts/${slug}`, {
            next: { revalidate: 60 }
        })
        if (!res.ok) return null
        const data = await res.json()
        const prompt = data.prompt

        if (prompt) {
            if (prompt.coverImage) prompt.coverImage = optimizeYouTubeUrl(prompt.coverImage)
            if (Array.isArray(prompt.exampleImages)) {
                prompt.exampleImages = prompt.exampleImages.map((img: any) => ({
                    ...img,
                    src: optimizeYouTubeUrl(img.src)
                }))
            } else {
                prompt.exampleImages = []
            }
        }

        return prompt
    } catch {
        return null
    }
}

async function getRelatedPrompts(category: string, currentSlug: string) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        const res = await fetch(
            `${baseUrl}/api/prompts?category=${category}&status=published&limit=4`,
            { next: { revalidate: 60 } }
        )
        if (!res.ok) return []
        const data = await res.json()
        if (!Array.isArray(data.prompts)) return []
        return data.prompts.filter((p: { slug: string }) => p.slug !== currentSlug)
    } catch {
        return []
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = params
    const prompt = await getPrompt(slug)

    if (!prompt) {
        return { title: 'Prompt Not Found' }
    }

    const title = safeRender(prompt.title)
    const excerpt = safeRender(prompt.excerpt || prompt.description?.substring(0, 160))

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
        }
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
            availability: 'https://schema.org/OnlineOnly'
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

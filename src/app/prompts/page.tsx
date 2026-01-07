import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { TbSparkles, TbDownload, TbStar, TbEye } from 'react-icons/tb'
import { PromptsFilters } from '@/components/prompts/PromptsFilters'

export const metadata: Metadata = {
    title: 'AI Prompts Marketplace | Andrew Altair',
    description: 'მაღალხარისხიანი AI პრომპტები Gemini, Midjourney, DALL-E და სხვა მოდელებისთვის. უფასო და პრემიუმ პრომპტები.',
}

async function getPrompts(searchParams: { [key: string]: string | undefined }) {
    const params = new URLSearchParams()
    params.set('status', 'published')
    if (searchParams.category) params.set('category', searchParams.category)
    if (searchParams.aiModel) params.set('aiModel', searchParams.aiModel)
    if (searchParams.free) params.set('isFree', searchParams.free)
    if (searchParams.sort) params.set('sort', searchParams.sort)
    if (searchParams.search) params.set('search', searchParams.search)
    params.set('limit', '24')

    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl}/api/marketplace-prompts?${params.toString()}`, {
            next: { revalidate: 60 }
        })
        if (!res.ok) return { prompts: [], filters: { categories: [], aiModels: [] } }
        return await res.json()
    } catch {
        return { prompts: [], filters: { categories: [], aiModels: [] } }
    }
}

interface Prompt {
    id: string
    slug: string
    title: string
    excerpt?: string
    coverImage: string
    price: number
    currency: 'GEL' | 'USD'
    isFree: boolean
    category: string
    aiModel: string
    views: number
    purchases: number
    downloads: number
    rating: number
}

function PromptCard({ prompt }: { prompt: Prompt }) {
    return (
        <Link href={`/prompts/${prompt.slug}`}>
            <article className="group relative overflow-hidden rounded-xl border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {prompt.coverImage ? (
                        <Image
                            src={prompt.coverImage}
                            alt={prompt.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <TbSparkles className="w-12 h-12 text-muted-foreground" />
                        </div>
                    )}

                    {/* Price badge */}
                    <div className="absolute top-3 right-3">
                        {prompt.isFree ? (
                            <span className="px-2.5 py-1 text-xs font-bold bg-green-500 text-white rounded-full shadow-lg">
                                უფასო
                            </span>
                        ) : (
                            <span className="px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-primary to-accent text-white rounded-full shadow-lg">
                                {prompt.price} {prompt.currency}
                            </span>
                        )}
                    </div>

                    {/* AI Model badge */}
                    <div className="absolute bottom-3 left-3">
                        <span className="px-2 py-0.5 text-xs bg-black/60 text-white rounded backdrop-blur-sm">
                            {prompt.aiModel}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {prompt.title}
                    </h3>

                    {prompt.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {prompt.excerpt}
                        </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                                <TbEye className="w-3.5 h-3.5" />
                                {prompt.views}
                            </span>
                            <span className="flex items-center gap-1">
                                <TbDownload className="w-3.5 h-3.5" />
                                {prompt.isFree ? prompt.downloads : prompt.purchases}
                            </span>
                        </div>
                        {prompt.rating > 0 && (
                            <span className="flex items-center gap-1 text-yellow-500">
                                <TbStar className="w-3.5 h-3.5 fill-current" />
                                {prompt.rating.toFixed(1)}
                            </span>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    )
}

function PromptsLoading() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl border bg-card overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-muted" />
                    <div className="p-4 space-y-3">
                        <div className="h-5 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
}

async function PromptsGrid({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const { prompts } = await getPrompts(searchParams)

    if (prompts.length === 0) {
        return (
            <div className="text-center py-16">
                <TbSparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">პრომპტები ვერ მოიძებნა</h3>
                <p className="text-muted-foreground">შეცვალეთ ფილტრები ან სცადეთ სხვა ძიება</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {prompts.map((prompt: Prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
            ))}
        </div>
    )
}

export default async function PromptsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const params = await searchParams
    const { filters } = await getPrompts(params)

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative py-16 lg:py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
                    <div className="absolute inset-0 noise-overlay"></div>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <TbSparkles className="w-4 h-4" />
                            AI Prompts Marketplace
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            მაღალხარისხიანი <span className="text-gradient">AI პრომპტები</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            პროფესიონალური პრომპტები Gemini, Midjourney, DALL-E და სხვა AI მოდელებისთვის.
                            შექმენით საოცარი კონტენტი რამდენიმე წამში.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filters & Content */}
            <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    {/* Filters */}
                    <PromptsFilters
                        categories={filters.categories || []}
                        aiModels={filters.aiModels || []}
                    />

                    {/* Grid */}
                    <Suspense fallback={<PromptsLoading />}>
                        <PromptsGrid searchParams={params} />
                    </Suspense>
                </div>
            </section>
        </div>
    )
}

import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { TbSparkles, TbVideo, TbPhoto, TbFileDescription, TbArrowRight } from 'react-icons/tb'
import { PromptsFilters } from '@/components/prompts/PromptsFilters'
import { PromptsTagsCloud } from '@/components/prompts/PromptsTagsCloud'
import { PromptsSearch } from '@/components/prompts/PromptsSearch'
import MarketplacePromptCard from '@/components/prompts/MarketplacePromptCard'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
    if (searchParams.generationType) params.set('generationType', searchParams.generationType)
    params.set('limit', searchParams.limit || '24')

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
    generationType?: string
    views: number
    purchases: number
    downloads: number
    rating: number
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
                <MarketplacePromptCard key={prompt.id} prompt={prompt} />
            ))}
        </div>
    )
}

async function PromptsSection({ title, icon: Icon, type, description }: { title: string, icon: any, type: string, description: string }) {
    const { prompts } = await getPrompts({ generationType: type, limit: '4' })
    if (prompts.length === 0) return null

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between border-b pb-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Icon className="w-6 h-6 text-primary" />
                        {title}
                    </h2>
                    <p className="text-muted-foreground text-sm">{description}</p>
                </div>
                <Link href={`/prompts?generationType=${type}`} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                    ყველას ნახვა
                    <TbArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {prompts.map((prompt: Prompt) => (
                    <MarketplacePromptCard key={prompt.id} prompt={prompt} />
                ))}
            </div>
        </div>
    )
}

export default async function PromptsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const params = await searchParams
    const { filters } = await getPrompts({}) // Get basic filters

    // Check if user is filtering
    const isFiltering = params.category || params.aiModel || params.isFree || params.search || params.generationType

    return (
        <div className="min-h-screen">
            {/* Hero */}
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-background/90 z-10" />
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20 z-0" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50 animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-accent/10 rounded-full blur-[100px] opacity-30" />
                </div>

                <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center max-w-4xl mx-auto space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-sm">
                            <TbSparkles className="w-3.5 h-3.5" />
                            Premium Prompts Marketplace
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
                            აღმოაჩინე <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-accent animate-gradient">საუკეთესო AI პრომპტები</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            პროფესიონალური პრომპტები Gemini, Midjourney, DALL-E და სხვა მოდელებისთვის.
                            დაზოგე დრო და მიიღე უკეთესი შედეგი.
                        </p>

                        {/* Search Component */}
                        <div className="pt-4">
                            <PromptsSearch />
                        </div>

                        {/* Quick Stats or Trust Indicators could go here */}
                    </div>
                </div>
            </section>

            {/* Filters & Content */}
            <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-12">
                    {/* Tags Cloud */}
                    <PromptsTagsCloud />

                    {/* Featured Bundles Mockup (If not filtering) */}
                    {/* Featured Bundles Mockup Removed as per user request */}

                    {/* Filters */}
                    <PromptsFilters
                        categories={filters.categories || []}
                        aiModels={filters.aiModels || []}
                    />

                    {isFiltering ? (
                        <Suspense fallback={<PromptsLoading />}>
                            <PromptsGrid searchParams={params} />
                        </Suspense>
                    ) : (
                        <div className="space-y-16">
                            <Suspense fallback={<PromptsLoading />}>
                                <PromptsSection
                                    title="Video Generation"
                                    icon={TbVideo}
                                    type="video"
                                    description="საუკეთესო პრომპტები ვიდეოების გენერაციისთვის (Runway, Pika, Sora)"
                                />
                                <PromptsSection
                                    title="Image Generation"
                                    icon={TbPhoto}
                                    type="image"
                                    description="მაღალი ხარისხის ფოტო პრომპტები (Midjourney, DALL-E, Stable Diffusion)"
                                />
                                <PromptsSection
                                    title="Text Generation"
                                    icon={TbFileDescription}
                                    type="text-generation"
                                    description="ტექსტური პრომპტები GPT-4, Claude და Gemini-სთვის"
                                />
                            </Suspense>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

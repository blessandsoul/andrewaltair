import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import PromptUnlocker from '@/components/prompts/PromptUnlocker'
import SocialSidebarWidget from '@/components/prompts/SocialSidebarWidget'
import SocialFooterBanner from '@/components/prompts/SocialFooterBanner'
import SocialFloatingButton from '@/components/prompts/SocialFloatingButton'
import { TbSparkles, TbCopy, TbStar, TbEye, TbDownload, TbShoppingCart, TbArrowLeft, TbBrandTelegram, TbCheck, TbUser, TbCalendar } from 'react-icons/tb'

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

const safeDate = (dateString: any): string => {
    try {
        if (!dateString) return ''
        return new Date(dateString).toLocaleDateString('ka-GE')
    } catch (e) {
        return ''
    }
}

async function getPrompt(slug: string) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl}/api/marketplace-prompts/${slug}`, {
            next: { revalidate: 60 }
        })
        if (!res.ok) return null
        const data = await res.json()
        const prompt = data.prompt

        if (prompt) {
            // sanitize images
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
            `${baseUrl}/api/marketplace-prompts?category=${category}&status=published&limit=4`,
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
    const coverImage = typeof prompt.coverImage === 'string' ? prompt.coverImage : ''

    return {
        title: `${title} | AI Prompts`,
        description: excerpt,
        openGraph: {
            title: title,
            description: excerpt,
            images: coverImage ? [{ url: coverImage }] : [],
        }
    }
}

export default async function PromptDetailPage({ params }: Props) {
    const { slug } = params
    const prompt = await getPrompt(slug)

    if (!prompt) {
        notFound()
    }

    // Handle category safely for related prompts fetch
    let primaryCategory = ''
    if (Array.isArray(prompt.category) && prompt.category.length > 0) {
        primaryCategory = safeRender(prompt.category[0])
    } else if (prompt.category) {
        primaryCategory = safeRender(prompt.category)
    }

    // Clean up if it stringified an object
    if (primaryCategory.startsWith('{')) primaryCategory = ''

    const relatedPrompts = await getRelatedPrompts(primaryCategory, prompt.slug)

    // Helper for safe image validation
    const hasValidImage = (src: any) => typeof src === 'string' && src.length > 0;

    return (
        <div className="min-h-screen py-8 lg:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Back link */}
                <Link
                    href="/prompts"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
                >
                    <TbArrowLeft className="w-4 h-4" />
                    ყველა პრომპტი
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Gallery */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                                {hasValidImage(prompt.coverImage) ? (
                                    <Image
                                        src={prompt.coverImage}
                                        alt={safeRender(prompt.title)}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <TbSparkles className="w-16 h-16 text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            {/* Example Images */}
                            {Array.isArray(prompt.exampleImages) && prompt.exampleImages.length > 0 && (
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                    {prompt.exampleImages.map((img: { src: string; alt?: string }, i: number) => (
                                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                                            {hasValidImage(img.src) && (
                                                <Image
                                                    src={img.src}
                                                    alt={safeRender(img.alt) || `Example ${i + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Prompt Template */}
                        <PromptUnlocker
                            template={safeRender(prompt.promptTemplate)}
                            isFree={prompt.isFree}
                            price={prompt.price}
                        />

                        {/* Variables */}
                        {Array.isArray(prompt.variables) && prompt.variables.length > 0 && (
                            <div className="rounded-xl border bg-card p-6 space-y-4">
                                <h2 className="text-xl font-semibold">ცვლადები</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {prompt.variables.map((variable: { name: string; description?: string; options?: string[] }, i: number) => (
                                        <div key={i} className="p-4 rounded-lg bg-muted/50 border">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 text-xs font-mono bg-primary/10 text-primary rounded">
                                                    [{safeRender(variable.name)}]
                                                </span>
                                            </div>
                                            {variable.description && (
                                                <p className="text-sm text-muted-foreground mb-2">{safeRender(variable.description)}</p>
                                            )}
                                            {Array.isArray(variable.options) && variable.options.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {variable.options.map((opt, j) => (
                                                        <span key={j} className="px-2 py-0.5 text-xs bg-background rounded border">
                                                            {safeRender(opt)}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Instructions */}
                        {prompt.instructions && (
                            <div className="rounded-xl border bg-card p-6 space-y-4">
                                <h2 className="text-xl font-semibold">ინსტრუქციები</h2>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-muted-foreground whitespace-pre-wrap">{safeRender(prompt.instructions)}</p>
                                </div>
                            </div>
                        )}

                        {/* Footer Banner */}
                        <SocialFooterBanner />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Buy Card */}
                        <div className="sticky top-24 rounded-xl border bg-card p-6 space-y-4">
                            <h1 className="text-2xl font-bold">{safeRender(prompt.title)}</h1>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                                    <TbSparkles className="w-3.5 h-3.5" />
                                    {safeRender(prompt.aiModel)}
                                </span>
                                {prompt.category && (
                                    <span className="px-2.5 py-1 text-xs font-medium bg-muted rounded-full">
                                        {safeRender(Array.isArray(prompt.category) ? prompt.category[0] : prompt.category)}
                                    </span>
                                )}
                                <span className="px-2.5 py-1 text-xs font-medium bg-muted rounded-full">
                                    {safeRender(prompt.generationType)}
                                </span>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <TbEye className="w-4 h-4" />
                                    {safeRender(prompt.views || 0)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <TbDownload className="w-4 h-4" />
                                    {safeRender(prompt.isFree ? (prompt.downloads || 0) : (prompt.purchases || 0))}
                                </span>
                                {(prompt.rating || 0) > 0 && (
                                    <span className="flex items-center gap-1 text-yellow-500">
                                        <TbStar className="w-4 h-4 fill-current" />
                                        {safeRender((prompt.rating || 0).toFixed(1))} ({safeRender(prompt.reviewsCount || 0)})
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-muted-foreground text-sm">
                                {safeRender(prompt.excerpt || prompt.description?.substring(0, 200))}
                            </p>

                            {/* Price & CTA */}
                            <div className="pt-4 border-t space-y-3">
                                <div className="flex items-baseline gap-2">
                                    {prompt.isFree || prompt.price === 0 ? (
                                        <span className="text-3xl font-bold text-green-500">უფასო</span>
                                    ) : (
                                        <>
                                            <span className="text-3xl font-bold">{safeRender(prompt.price)}</span>
                                            <span className="text-lg text-muted-foreground">{safeRender(prompt.currency)}</span>
                                            {prompt.originalPrice && (
                                                <span className="text-lg text-muted-foreground line-through">
                                                    {safeRender(prompt.originalPrice)} {safeRender(prompt.currency)}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>

                                {prompt.isFree || prompt.price === 0 ? (
                                    <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-lg font-semibold bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">
                                        <TbDownload className="w-5 h-5" />
                                        უფასოდ ჩამოტვირთვა
                                    </button>
                                ) : (
                                    <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-lg font-semibold bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:opacity-90 transition-opacity">
                                        <TbShoppingCart className="w-5 h-5" />
                                        შეძენა
                                    </button>
                                )}
                            </div>

                            {/* Features */}
                            <div className="pt-4 border-t space-y-2">
                                {[
                                    'სრული პრომპტი ყველა ცვლადით',
                                    'დეტალური ინსტრუქციები',
                                    'უვადო წვდომა',
                                    'მხარდაჭერა Telegram-ით'
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                        <TbCheck className="w-4 h-4 text-green-500 shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Author */}
                            <div className="pt-4 border-t">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <TbUser className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{safeRender(prompt.authorName)}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <TbCalendar className="w-3 h-3" />
                                            {safeDate(prompt.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact */}
                            <Link
                                href="https://t.me/andr3waltair"
                                target="_blank"
                                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm border rounded-xl hover:bg-muted transition-colors"
                            >
                                <TbBrandTelegram className="w-4 h-4" />
                                კითხვა? დამიკავშირდით Telegram-ზე
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Related Prompts */}
                {Array.isArray(relatedPrompts) && relatedPrompts.length > 0 && (
                    <section className="mt-16">
                        <h2 className="text-2xl font-bold mb-6">მსგავსი პრომპტები</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedPrompts.slice(0, 4).map((p: { id: string; slug: string; title: string; coverImage: string; price: number; currency: string; isFree: boolean; aiModel: string }) => (
                                <Link key={p.id} href={`/prompts/${p.slug}`}>
                                    <article className="group rounded-xl border bg-card overflow-hidden hover:border-primary/50 transition-all">
                                        <div className="relative aspect-[4/3] bg-muted">
                                            {hasValidImage(p.coverImage) && (
                                                <Image
                                                    src={p.coverImage}
                                                    alt={safeRender(p.title)}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform"
                                                />
                                            )}
                                            <div className="absolute top-2 right-2">
                                                {p.isFree ? (
                                                    <span className="px-2 py-0.5 text-xs font-medium bg-green-500 text-white rounded">უფასო</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 text-xs font-medium bg-primary text-white rounded">{safeRender(p.price)} {safeRender(p.currency)}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">{safeRender(p.title)}</h3>
                                            <span className="text-xs text-muted-foreground">{safeRender(p.aiModel)}</span>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}

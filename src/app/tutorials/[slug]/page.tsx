import dbConnect from "@/lib/db"
import Tutorial from "@/models/Tutorial"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { TbQuote, TbTools, TbCheck, TbArrowLeft, TbCalendar, TbClock, TbEye, TbBrain, TbHelp } from "react-icons/tb"
import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Function to fetch data
async function getTutorial(slug: string) {
    await dbConnect()
    const tutorial = await Tutorial.findOne({ slug: slug }).lean()
    if (!tutorial) return null
    return JSON.parse(JSON.stringify(tutorial))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const tutorial = await getTutorial(params.slug)
    if (!tutorial) return {}

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'
    let coverImage = tutorial.coverImage

    if (coverImage && !coverImage.startsWith('http')) {
        coverImage = `${siteUrl}${coverImage.startsWith('/') ? '' : '/'}${coverImage}`
    } else if (!coverImage) {
        coverImage = `${siteUrl}/og.png`
    }

    return {
        title: `${tutorial.title} | Andrew Altair`,
        description: tutorial.intro,
        openGraph: {
            title: tutorial.title,
            description: tutorial.intro,
            url: `${siteUrl}/tutorials/${params.slug}`,
            images: [{ url: coverImage }],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: tutorial.title,
            description: tutorial.intro,
            images: [coverImage],
        }
    }
}

export default async function TutorialDetailPage({ params }: { params: { slug: string } }) {
    const tutorial = await getTutorial(params.slug)

    if (!tutorial) {
        notFound()
    }

    // HowTo Schema for SEO
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'
    const howToSchema = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: tutorial.title,
        description: tutorial.intro,
        image: tutorial.coverImage || `${siteUrl}/og.png`,
        tool: tutorial.tools ? [{ '@type': 'HowToTool', name: tutorial.tools }] : undefined,
        step: tutorial.modules?.map((module: any, i: number) => ({
            '@type': 'HowToStep',
            position: i + 1,
            name: module.title,
            text: module.explanation
        })) || [],
        author: {
            '@type': 'Person',
            name: 'Andrew Altair',
            url: siteUrl
        }
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />

            <div className="min-h-screen bg-background pb-20 pt-24">
                {/* Hero Section - Matching Blog Style */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
                        <div className="absolute inset-0 noise-overlay"></div>
                    </div>

                    <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        {/* Back Button */}
                        <div className="flex items-center justify-between mb-8">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <TbArrowLeft className="w-4 h-4" />
                                მთავარზე დაბრუნება
                            </Link>
                        </div>

                        {/* Header Content */}
                        <div className="space-y-6 max-w-4xl">
                            <div className="flex flex-wrap gap-2">
                                {tutorial.tags.map((tag: string) => (
                                    <Badge key={tag} className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                                {tutorial.title}
                            </h1>

                            {/* Excerpt */}
                            <div className="p-6 lg:p-8 bg-gradient-to-br from-secondary/40 to-secondary/20 backdrop-blur-sm rounded-2xl border border-secondary/50 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary via-accent to-primary/50" />
                                <p className="text-lg md:text-xl text-foreground/80 leading-relaxed pl-4">
                                    {tutorial.intro}
                                </p>
                            </div>
                        </div>

                        {/* Cover Image */}
                        {tutorial.coverImage && (
                            <div className="relative mt-8 -mx-4 sm:-mx-6 lg:-mx-0 overflow-hidden rounded-2xl shadow-2xl aspect-video max-w-5xl">
                                <img
                                    src={tutorial.coverImage}
                                    alt={tutorial.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                </section>

                <section className="py-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Main Content */}
                            <div className="flex-1 min-w-0 max-w-4xl">

                                {/* Tools Section - Styled generic */}
                                {tutorial.tools && (
                                    <div className="mb-12 p-6 bg-secondary/30 rounded-xl border border-border">
                                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                            <TbTools className="w-5 h-5 text-primary" />
                                            საჭირო ხელსაწყოები
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">{tutorial.tools}</p>
                                    </div>
                                )}

                                {/* Modules as Standard Content */}
                                <div className="space-y-12">
                                    {tutorial.modules.map((module: any, index: number) => (
                                        <div key={index} className="prose prose-lg dark:prose-invert max-w-none">
                                            <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4 border-l-4 border-primary pl-4">
                                                {module.title}
                                            </h2>

                                            {/* Quote as Blockquote */}
                                            {module.quote && (
                                                <blockquote className="border-l-4 border-primary/50 pl-6 italic text-muted-foreground my-6 bg-secondary/10 py-4 pr-4 rounded-r-lg">
                                                    <div className="flex gap-2">
                                                        <TbQuote className="w-5 h-5 text-primary/50 shrink-0 mt-1" />
                                                        <span>{module.quote}</span>
                                                    </div>
                                                </blockquote>
                                            )}

                                            {/* Explanation - Clean Text */}
                                            <div className="text-foreground/90 leading-relaxed space-y-4">
                                                {module.explanation.split('\n').map((paragraph: string, i: number) => (
                                                    <p key={i}>{paragraph}</p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Conclusion */}
                                <div className="mt-16 p-8 bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/10 rounded-2xl">
                                    <h3 className="font-bold text-xl mb-4 text-green-500 flex items-center gap-2">
                                        <TbCheck className="w-6 h-6" />
                                        დასკვნა
                                    </h3>
                                    <p className="text-lg text-foreground/80 leading-relaxed">{tutorial.conclusion}</p>
                                </div>

                                {/* Confidential Advice - Correct Font */}
                                {tutorial.metaAdvice && (
                                    <div className="mt-12 relative p-8 rounded-2xl bg-black border border-white/10 overflow-hidden group">
                                        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
                                        <div className="relative z-10 space-y-4">
                                            <div className="flex items-center gap-2 text-yellow-500">
                                                <span className="text-2xl">🏴‍☠️</span>
                                                <span className="font-black text-xs uppercase tracking-[0.2em] opacity-70 font-georgian">კონფიდენციალური რჩევა</span>
                                            </div>
                                            <p className="text-xl font-georgian italic text-white/90 leading-relaxed">
                                                "{tutorial.metaAdvice}"
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

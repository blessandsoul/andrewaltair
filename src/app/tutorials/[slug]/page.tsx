import dbConnect from "@/lib/db"
import Tutorial from "@/models/Tutorial"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { TbQuote, TbTools, TbBulb, TbCheck } from "react-icons/tb"
import { Metadata } from "next"

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
            url: `${siteUrl}/tutorials/${params.slug}`, // Added absolute URL for openGraph.url
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
            <div className="min-h-screen bg-background pb-20">
                {/* Hero Section */}
                <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
                    {/* Background Image with Overlay */}
                    {tutorial.coverImage && (
                        <div className="absolute inset-0">
                            <img
                                src={tutorial.coverImage}
                                alt={tutorial.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-background" />
                        </div>
                    )}

                    <div className="container mx-auto h-full relative z-10 flex flex-col justify-end pb-12 px-4">
                        <div className="max-w-4xl space-y-6">
                            <div className="flex flex-wrap gap-2">
                                {tutorial.tags.map((tag: string) => (
                                    <Badge key={tag} className="bg-purple-600 hover:bg-purple-700 text-white border-0 px-3 py-1 text-sm">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                                {tutorial.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl font-light">
                                {tutorial.intro}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 max-w-4xl -mt-10 relative z-20">
                    {/* Tools Section */}
                    {tutorial.tools && (
                        <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl p-8 mb-12 shadow-xl">
                            <div className="flex items-center gap-3 mb-4 text-purple-500">
                                <TbTools className="w-6 h-6" />
                                <h3 className="text-lg font-bold uppercase tracking-wider">Required Tools</h3>
                            </div>
                            <p className="text-lg leading-relaxed">{tutorial.tools}</p>
                        </div>
                    )}

                    {/* Modules Timeline */}
                    <div className="space-y-12 relative before:absolute before:left-4 md:before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-border/50">
                        {tutorial.modules.map((module: any, index: number) => (
                            <div key={index} className="relative pl-12 md:pl-16">
                                {/* Number Marker */}
                                <div className="absolute left-0 md:-left-4 top-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-lg ring-4 ring-background">
                                    {index + 1}
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-2xl md:text-3xl font-bold">{module.title}</h2>

                                    {/* Source/Quote Block */}
                                    {module.quote && (
                                        <div className="bg-muted/30 border-l-4 border-purple-500 p-6 rounded-r-xl">
                                            <div className="flex gap-4">
                                                <TbQuote className="w-6 h-6 text-purple-500 shrink-0 opacity-50" />
                                                <div className="font-mono text-sm md:text-base opacity-80 whitespace-pre-wrap">
                                                    {module.quote}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ELI5 Explanation */}
                                    <div className="flex gap-4 items-start">
                                        <TbBulb className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
                                        <div className="space-y-2">
                                            <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Simplified Logic</span>
                                            <p className="text-lg leading-relaxed text-foreground/90">
                                                {module.explanation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Conclusion & Meta Advice */}
                    <div className="mt-20 space-y-8">
                        <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20">
                            <TbCheck className="w-8 h-8 text-green-500 shrink-0" />
                            <div>
                                <h3 className="font-bold text-xl mb-2 text-green-500">Ready to Deploy?</h3>
                                <p className="text-lg">{tutorial.conclusion}</p>
                            </div>
                        </div>

                        {tutorial.metaAdvice && (
                            <div className="relative p-8 rounded-2xl bg-black border border-white/10 overflow-hidden group">
                                <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center gap-2 text-yellow-500">
                                        <span className="text-2xl">🏴‍☠️</span>
                                        <span className="font-black text-xs uppercase tracking-[0.2em] opacity-70">Confidential Advice</span>
                                    </div>
                                    <p className="text-xl font-serif italic text-white/90 leading-relaxed">
                                        "{tutorial.metaAdvice}"
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

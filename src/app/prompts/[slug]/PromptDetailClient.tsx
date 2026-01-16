'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    TbSparkles, TbCopy, TbStar, TbEye, TbDownload, TbShoppingCart,
    TbArrowLeft, TbBrandTelegram, TbCheck, TbUser, TbCalendar,
    TbHome, TbChevronRight, TbX, TbChevronLeft, TbZoomIn, TbCode
} from 'react-icons/tb'
import { incrementPromptView } from '@/app/actions/prompt-actions'
import PromptUnlocker from '@/components/prompts/PromptUnlocker'
import SocialFooterBanner from '@/components/prompts/SocialFooterBanner'
import { formatId } from '@/lib/id-format'

interface Variable {
    name: string
    description?: string
    options?: string[]
}

interface PromptDetailClientProps {
    prompt: {
        id: string
        slug: string
        numericId?: string
        title: string
        excerpt?: string
        description?: string
        coverImage?: string
        exampleImages?: { src: string; alt?: string }[]
        promptTemplate?: string
        variables?: Variable[]
        instructions?: string
        category?: string | string[]
        generationType?: string
        aiModel?: string
        price: number
        originalPrice?: number
        currency?: string
        isFree: boolean
        views?: number
        downloads?: number
        purchases?: number
        rating?: number
        reviewsCount?: number
        authorName?: string
        authorAvatar?: string
        createdAt?: string
    }
    relatedPrompts: any[]
}

// Category translations
const categoryTranslations: Record<string, string> = {
    "Art": "ხელოვნება",
    "Photography": "ფოტოგრაფია",
    "Digital Art": "ციფრული ხელოვნება",
    "3D": "3D",
    "Anime": "ანიმე",
    "Logo": "ლოგო",
    "Portrait": "პორტრეტი",
    "Landscape": "პეიზაჟი",
    "Fantasy": "ფენტეზი",
    "Realistic": "რეალისტური",
    "Character": "პერსონაჟი",
}

// Generation Type translations
const generationTypeTranslations: Record<string, string> = {
    "text-to-image": "სურათი",
    "text-to-text": "ტექსტი",
    "image-to-image": "სურათი-სურათი",
    "text-to-video": "ვიდეო"
}

const translateGenerationType = (type: string) => generationTypeTranslations[type] || type

const translateCategory = (cat: string) => categoryTranslations[cat] || cat

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
}

export default function PromptDetailClient({ prompt, relatedPrompts }: PromptDetailClientProps) {
    const [mounted, setMounted] = useState(false)
    const [copied, setCopied] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
    const [variableValues, setVariableValues] = useState<Record<string, string>>({})

    useEffect(() => {
        setMounted(true)
        // Initialize variable values
        if (prompt.variables) {
            const initial: Record<string, string> = {}
            prompt.variables.forEach(v => {
                initial[v.name] = v.options?.[0] || ''
            })
            setVariableValues(initial)
        }

        // Increment view count
        if (prompt.id) {
            incrementPromptView(prompt.id)
        }
    }, [prompt.variables, prompt.id])

    // All images for gallery
    const allImages = [
        prompt.coverImage,
        ...(prompt.exampleImages?.map(img => img.src) || [])
    ].filter(Boolean) as string[]

    // Get processed prompt with substituted variables
    const getProcessedPrompt = () => {
        let result = prompt.promptTemplate || ''
        Object.entries(variableValues).forEach(([name, value]) => {
            result = result.replace(new RegExp(`\\[${name}\\]`, 'g'), value || `[${name}]`)
        })
        return result
    }

    // Copy handler
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(getProcessedPrompt())
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (e) {
            console.error('Copy failed', e)
        }
    }

    // Gallery navigation
    const navigateGallery = (direction: 'prev' | 'next') => {
        if (selectedImageIndex === null) return
        if (direction === 'prev') {
            setSelectedImageIndex(selectedImageIndex === 0 ? allImages.length - 1 : selectedImageIndex - 1)
        } else {
            setSelectedImageIndex(selectedImageIndex === allImages.length - 1 ? 0 : selectedImageIndex + 1)
        }
    }

    // Close gallery on escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (selectedImageIndex === null) return
            if (e.key === 'Escape') setSelectedImageIndex(null)
            if (e.key === 'ArrowLeft') navigateGallery('prev')
            if (e.key === 'ArrowRight') navigateGallery('next')
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [selectedImageIndex])

    // Lock scroll when gallery open
    useEffect(() => {
        if (selectedImageIndex !== null) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [selectedImageIndex])

    const primaryCategory = Array.isArray(prompt.category) ? prompt.category[0] : prompt.category

    const safeDate = (d: any) => {
        try { return new Date(d).toLocaleDateString('ka-GE') } catch { return '' }
    }

    return (
        <div className="min-h-screen py-8 lg:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                {/* Breadcrumbs */}
                <motion.nav
                    {...fadeInUp}
                    className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap"
                >
                    <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                        <TbHome className="w-4 h-4" />
                        მთავარი
                    </Link>
                    <TbChevronRight className="w-4 h-4" />
                    <Link href="/prompts" className="hover:text-primary transition-colors">
                        პრომპტები
                    </Link>
                    {primaryCategory && (
                        <>
                            <TbChevronRight className="w-4 h-4" />
                            <Link
                                href={`/prompts?category=${primaryCategory}`}
                                className="hover:text-primary transition-colors"
                            >
                                {translateCategory(primaryCategory)}
                            </Link>
                        </>
                    )}
                    <TbChevronRight className="w-4 h-4" />
                    <span className="text-foreground font-medium truncate max-w-[200px]">
                        {prompt.title}
                    </span>
                </motion.nav>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Gallery with Lightbox */}
                        <motion.div {...fadeInUp} className="space-y-4">
                            {/* Main Image */}
                            <div
                                className="relative aspect-video rounded-xl overflow-hidden bg-muted cursor-zoom-in group"
                                onClick={() => setSelectedImageIndex(0)}
                            >
                                {prompt.coverImage ? (
                                    <>
                                        <Image
                                            src={prompt.coverImage}
                                            alt={prompt.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-md rounded-full p-4">
                                                <TbZoomIn className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <TbSparkles className="w-16 h-16 text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                    {allImages.slice(1, 7).map((src, i) => (
                                        <div
                                            key={i}
                                            className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:ring-2 hover:ring-primary transition-all group"
                                            onClick={() => setSelectedImageIndex(i + 1)}
                                        >
                                            <Image
                                                src={src}
                                                alt={`Example ${i + 1}`}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform"
                                            />
                                        </div>
                                    ))}
                                    {allImages.length > 7 && (
                                        <div
                                            className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer flex items-center justify-center"
                                            onClick={() => setSelectedImageIndex(7)}
                                        >
                                            <span className="text-lg font-bold text-muted-foreground">
                                                +{allImages.length - 7}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>

                        {/* Tabs: Prompt / Variables / Instructions */}
                        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                            <Tabs defaultValue="prompt" className="w-full">
                                <TabsList className="w-full grid grid-cols-3 mb-6">
                                    <TabsTrigger value="prompt" className="gap-2">
                                        <TbCode className="w-4 h-4" />
                                        პრომპტი
                                    </TabsTrigger>
                                    <TabsTrigger value="variables" className="gap-2">
                                        <TbSparkles className="w-4 h-4" />
                                        ცვლადები
                                    </TabsTrigger>
                                    <TabsTrigger value="instructions" className="gap-2">
                                        <TbCheck className="w-4 h-4" />
                                        ინსტრუქციები
                                    </TabsTrigger>
                                </TabsList>

                                {/* Prompt Tab */}
                                <TabsContent value="prompt" className="space-y-4">
                                    <PromptUnlocker
                                        template={prompt.promptTemplate || ''}
                                        isFree={prompt.isFree}
                                        price={prompt.price}
                                    />

                                    {/* Copy Button */}
                                    <Button
                                        onClick={handleCopy}
                                        size="lg"
                                        className={`w-full gap-2 transition-all ${copied ? 'bg-green-500 hover:bg-green-600' : ''}`}
                                    >
                                        {copied ? (
                                            <>
                                                <TbCheck className="w-5 h-5" />
                                                დაკოპირებულია!
                                            </>
                                        ) : (
                                            <>
                                                <TbCopy className="w-5 h-5" />
                                                დააკოპირე პრომპტი
                                            </>
                                        )}
                                    </Button>
                                </TabsContent>

                                {/* Variables Tab */}
                                <TabsContent value="variables">
                                    {prompt.variables && prompt.variables.length > 0 ? (
                                        <div className="rounded-xl border bg-card p-6 space-y-4">
                                            <h2 className="text-xl font-semibold">ცვლადები</h2>
                                            <p className="text-sm text-muted-foreground">
                                                აირჩიეთ ან შეიყვანეთ მნიშვნელობები
                                            </p>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {prompt.variables.map((variable, i) => (
                                                    <div key={i} className="p-4 rounded-lg bg-muted/50 border space-y-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2 py-0.5 text-xs font-mono bg-primary/10 text-primary rounded">
                                                                [{variable.name}]
                                                            </span>
                                                        </div>
                                                        {variable.description && (
                                                            <p className="text-sm text-muted-foreground">{variable.description}</p>
                                                        )}
                                                        {variable.options && variable.options.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {variable.options.map((opt, j) => (
                                                                    <button
                                                                        key={j}
                                                                        onClick={() => setVariableValues(prev => ({ ...prev, [variable.name]: opt }))}
                                                                        className={`px-3 py-1.5 text-xs rounded-full border transition-all ${variableValues[variable.name] === opt
                                                                            ? 'bg-primary text-primary-foreground border-primary'
                                                                            : 'bg-background hover:bg-muted border-border'
                                                                            }`}
                                                                    >
                                                                        {opt}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                placeholder={`შეიყვანეთ ${variable.name}`}
                                                                value={variableValues[variable.name] || ''}
                                                                onChange={(e) => setVariableValues(prev => ({ ...prev, [variable.name]: e.target.value }))}
                                                                className="w-full px-3 py-2 text-sm rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Live Preview */}
                                            <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-dashed">
                                                <h3 className="text-sm font-medium mb-2">პრევიუ:</h3>
                                                <p className="text-sm text-muted-foreground font-mono whitespace-pre-wrap">
                                                    {getProcessedPrompt().substring(0, 200)}...
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border bg-card p-8 text-center">
                                            <TbSparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                            <p className="text-muted-foreground">ამ პრომპტს არ აქვს ცვლადები</p>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* Instructions Tab */}
                                <TabsContent value="instructions">
                                    {prompt.instructions ? (
                                        <div className="rounded-xl border bg-card p-6 space-y-4">
                                            <h2 className="text-xl font-semibold">ინსტრუქციები</h2>
                                            <div className="prose prose-invert max-w-none">
                                                <p className="text-muted-foreground whitespace-pre-wrap">
                                                    {prompt.instructions}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border bg-card p-8 text-center">
                                            <TbCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                            <p className="text-muted-foreground">დამატებითი ინსტრუქციები არ არის საჭირო</p>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </motion.div>

                        {/* Example Results Section */}
                        {prompt.exampleImages && prompt.exampleImages.length > 0 && (
                            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="rounded-xl border bg-card p-6 space-y-4">
                                <h2 className="text-xl font-semibold">შედეგების მაგალითები</h2>
                                <p className="text-sm text-muted-foreground">
                                    ეს სურათები შეიქმნა ამ პრომპტის გამოყენებით
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {prompt.exampleImages.slice(0, 6).map((img, i) => (
                                        <div
                                            key={i}
                                            className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer group"
                                            onClick={() => setSelectedImageIndex(i + 1)}
                                        >
                                            <Image
                                                src={img.src}
                                                alt={img.alt || `Result ${i + 1}`}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Footer Banner */}
                        <SocialFooterBanner />
                    </div>

                    {/* Sidebar - Sticky only on lg+ */}
                    <motion.div
                        {...fadeInUp}
                        transition={{ delay: 0.15 }}
                        className="space-y-6"
                    >
                        <div className="lg:sticky lg:top-24 rounded-xl border bg-card p-6 space-y-4">
                            <h1 className="text-2xl font-bold">{prompt.title}</h1>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                                {primaryCategory && (
                                    <Badge variant="secondary">
                                        {translateCategory(primaryCategory)}
                                    </Badge>
                                )}
                                {prompt.generationType && (
                                    <Badge variant="outline">
                                        {translateGenerationType(prompt.generationType)}
                                    </Badge>
                                )}
                            </div>

                            {/* ID */}
                            {prompt.numericId && (
                                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg border border-border/50">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ID:</span>
                                    <span className="text-sm font-mono font-bold text-primary">
                                        {formatId(prompt.numericId)}
                                    </span>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <TbEye className="w-4 h-4" />
                                    {prompt.views || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                    <TbDownload className="w-4 h-4" />
                                    {prompt.isFree ? (prompt.downloads || 0) : (prompt.purchases || 0)}
                                </span>
                                {(prompt.rating || 0) > 0 && (
                                    <span className="flex items-center gap-1 text-yellow-500">
                                        <TbStar className="w-4 h-4 fill-current" />
                                        {(prompt.rating || 0).toFixed(1)}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-muted-foreground text-sm">
                                {prompt.excerpt || prompt.description?.substring(0, 200)}
                            </p>

                            {/* Price & CTA */}
                            <div className="pt-4 border-t space-y-3">
                                <div className="flex items-baseline gap-2">
                                    {prompt.isFree || prompt.price === 0 ? (
                                        <span className="text-3xl font-bold text-green-500">უფასო</span>
                                    ) : (
                                        <>
                                            <span className="text-3xl font-bold">{prompt.price}</span>
                                            <span className="text-lg text-muted-foreground">{prompt.currency}</span>
                                            {prompt.originalPrice && (
                                                <span className="text-lg text-muted-foreground line-through">
                                                    {prompt.originalPrice} {prompt.currency}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>

                                <Button
                                    size="lg"
                                    className={`w-full gap-2 text-lg font-semibold transition-all hover:scale-[1.02] ${prompt.isFree ? 'bg-green-500 hover:bg-green-600' : 'bg-gradient-to-r from-primary to-accent'
                                        }`}
                                >
                                    {prompt.isFree ? (
                                        <>
                                            <TbDownload className="w-5 h-5" />
                                            უფასოდ ჩამოტვირთვა
                                        </>
                                    ) : (
                                        <>
                                            <TbShoppingCart className="w-5 h-5" />
                                            შეძენა
                                        </>
                                    )}
                                </Button>
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

                            {/* Author with Real Avatar */}
                            <div className="pt-4 border-t">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10 border">
                                        <AvatarImage src={prompt.authorAvatar} alt={prompt.authorName} />
                                        <AvatarFallback className="bg-primary/20">
                                            <TbUser className="w-5 h-5 text-primary" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{prompt.authorName || 'Andrew Altair'}</p>
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
                    </motion.div>
                </div>

                {/* Related Prompts */}
                {relatedPrompts && relatedPrompts.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mt-16"
                    >
                        <h2 className="text-2xl font-bold mb-6">მსგავსი პრომპტები</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedPrompts.slice(0, 4).map((p: any) => (
                                <Link key={p.id} href={`/prompts/${p.slug}`}>
                                    <article className="group rounded-xl border bg-card overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-lg">
                                        <div className="relative aspect-[4/3] bg-muted">
                                            {p.coverImage && (
                                                <Image
                                                    src={p.coverImage}
                                                    alt={p.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform"
                                                />
                                            )}
                                            <div className="absolute top-2 right-2">
                                                {p.isFree ? (
                                                    <span className="px-2 py-0.5 text-xs font-medium bg-green-500 text-white rounded">უფასო</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 text-xs font-medium bg-primary text-white rounded">{p.price} {p.currency}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">{p.title}</h3>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>

            {/* Lightbox Gallery */}
            {mounted && selectedImageIndex !== null && createPortal(
                <div
                    className="fixed inset-0 flex items-center justify-center transition-opacity duration-300"
                    style={{ zIndex: 99999 }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                        onClick={() => setSelectedImageIndex(null)}
                    />

                    {/* Close */}
                    <button
                        onClick={() => setSelectedImageIndex(null)}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <TbX className="w-6 h-6 text-white" />
                    </button>

                    {/* Navigation */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={() => navigateGallery('prev')}
                                className="absolute left-4 sm:left-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <TbChevronLeft className="w-6 h-6 text-white" />
                            </button>
                            <button
                                onClick={() => navigateGallery('next')}
                                className="absolute right-4 sm:right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <TbChevronRight className="w-6 h-6 text-white" />
                            </button>
                        </>
                    )}

                    {/* Image */}
                    <div className="relative z-10 p-4 sm:p-12">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={allImages[selectedImageIndex]}
                            alt="Gallery"
                            className="max-w-[95vw] sm:max-w-[85vw] max-h-[85vh] sm:max-h-[90vh] object-contain rounded-lg"
                        />
                    </div>

                    {/* Counter */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-sm font-medium">
                        {selectedImageIndex + 1} / {allImages.length}
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}

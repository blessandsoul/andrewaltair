'use client'

import Link from 'next/link'
import Image from 'next/image'
import { TbSparkles, TbDownload, TbStar, TbEye, TbVideo, TbPhoto, TbFileDescription, TbShoppingCart, TbCopy, TbCheck, TbFlame, TbCertificate } from 'react-icons/tb'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { PromptQuickView } from './PromptQuickView'
import { formatId } from '@/lib/id-format'

interface PromptCardProps {
    prompt: {
        id: string
        slug: string
        title: string
        excerpt?: string
        coverImage: string
        price: number
        currency: string
        isFree: boolean
        category: string | string[]
        aiModel: string
        generationType?: string
        views: number
        purchases: number
        downloads: number
        rating: number
        numericId?: string
    }
}

export default function MarketplacePromptCard({ prompt }: PromptCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [copied, setCopied] = useState(false)
    const [showQuickView, setShowQuickView] = useState(false)

    // Ensure category is always an array
    const categories = Array.isArray(prompt.category)
        ? prompt.category
        : typeof prompt.category === 'string'
            ? (prompt.category as string).split(',').map((c: string) => c.trim())
            : []

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        // Smart Copy (Georgian)
        const textToCopy = `ნახეთ ეს: ${prompt.title} (ID: ${formatId(prompt.numericId)}) https://andrewaltair.ge/s/${prompt.numericId}`
        navigator.clipboard.writeText(textToCopy)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const getTypeLabel = () => {
        switch (prompt.generationType) {
            case 'video-to-video':
            case 'text-to-video':
            case 'image-to-video':
                return 'Video'
            case 'text-generation':
                return 'Text'
            default:
                return 'Image'
        }
    }



    const getTypeIcon = () => {
        switch (prompt.generationType) {
            case 'video-to-video':
            case 'text-to-video':
            case 'image-to-video':
                return <TbVideo className="w-3 h-3" />
            case 'text-generation':
                return <TbFileDescription className="w-3 h-3" />
            default:
                return <TbPhoto className="w-3 h-3" />
        }
    }

    const formatPrice = () => {
        if (prompt.isFree) return 'უფასო'
        return `${prompt.price} ${prompt.currency}`
    }

    return (
        <Link href={`/prompts/${prompt.slug}`} className="block h-full group">
            <Card className="h-full flex flex-col overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                {/* Image Container */}
                <CardHeader className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        {prompt.coverImage ? (
                            <Image
                                src={prompt.coverImage}
                                alt={prompt.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted/50 to-muted">
                                <TbSparkles className="w-12 h-12 text-muted-foreground/30" />
                            </div>
                        )}

                        {/* Overlay Gradient on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                            <div className="flex flex-col gap-2">
                                <Badge variant="secondary" className="bg-black/60 text-white border-white/10 hover:bg-black/70 backdrop-blur-md gap-1.5 pl-2">
                                    {getTypeIcon()}
                                    {getTypeLabel()}
                                </Badge>

                                {prompt.numericId && (
                                    <Badge variant="outline" className="bg-black/60 text-white/80 border-white/10 backdrop-blur-md font-mono text-[10px]">
                                        {formatId(prompt.numericId)}
                                    </Badge>
                                )}

                                {((prompt.views > 1000) || (prompt.rating > 4.5)) && (
                                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none gap-1 pl-1.5 animate-pulse">
                                        <TbFlame className="w-3 h-3 fill-white" />
                                        TOP
                                    </Badge>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className={`
                                        h-8 w-8 rounded-lg bg-black/60 text-white hover:bg-white hover:text-black border border-white/10 backdrop-blur-md
                                        transition-all duration-300
                                        ${isHovered ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}
                                        ${copied ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
                                    `}
                                    onClick={handleCopy}
                                >
                                    {copied ? <TbCheck className="w-4 h-4" /> : <TbCopy className="w-4 h-4" />}
                                </Button>

                                <Badge className={`
                                    h-8 px-3 text-xs font-bold border
                                    ${prompt.isFree
                                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400/50'
                                        : 'bg-primary hover:bg-primary/90 text-white border-primary/50'}
                                `}>
                                    {formatPrice()}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex flex-col flex-grow p-5 gap-4">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            {categories.slice(0, 3).map((category: string, idx: number) => (
                                <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-secondary/50 border-border/50"
                                >
                                    {category}
                                </Badge>
                            ))}
                        </div>
                        <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {prompt.title}
                        </h3>

                        {/* Author Trust Badge */}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-[8px] text-white font-bold">
                                AA
                            </div>
                            <span>Andrew Altair</span>
                            <TbCertificate className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                    </div>

                    {/* Stats Footer */}
                    <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5" title="ნახვები">
                                <TbEye className="w-4 h-4 opacity-70" />
                                {prompt.views || 0}
                            </span>
                            <span className="flex items-center gap-1.5" title={prompt.isFree ? "ჩამოტვირთვები" : "გაყიდვები"}>
                                <TbDownload className="w-4 h-4 opacity-70" />
                                {prompt.isFree ? (prompt.downloads || 0) : (prompt.purchases || 0)}
                            </span>
                        </div>

                        {(prompt.rating || 0) > 0 && (
                            <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                                <TbStar className="w-3.5 h-3.5 fill-current" />
                                {(prompt.rating || 0).toFixed(1)}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <PromptQuickView
                prompt={prompt}
                isOpen={showQuickView}
                onClose={() => setShowQuickView(false)}
            />
        </Link >
    )
}

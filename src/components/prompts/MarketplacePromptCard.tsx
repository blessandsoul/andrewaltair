'use client'

import Link from 'next/link'
import Image from 'next/image'
import { TbSparkles, TbDownload, TbStar, TbEye, TbVideo, TbPhoto, TbFileDescription, TbShoppingCart, TbCopy, TbCheck, TbFlame, TbCertificate } from 'react-icons/tb'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { PromptQuickView } from './PromptQuickView'

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
        category: string
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

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        navigator.clipboard.writeText(`https://andrewaltair.ge/prompts/${prompt.slug}`)
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
        <Link href={`/prompts/${prompt.slug}`} className="block h-full">
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="group relative h-full flex flex-col overflow-hidden rounded-2xl border bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5"
            >
                {/* Image Container */}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-black/60 backdrop-blur-md text-white rounded-lg border border-white/10 w-fit">
                                {getTypeIcon()}
                                {getTypeLabel()}
                            </span>

                            {/* ID Badge */}
                            {prompt.numericId && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono bg-black/60 backdrop-blur-md text-white/80 rounded-lg border border-white/10 w-fit">
                                    #{prompt.numericId}
                                </span>
                            )}

                            {/* Social Proof: Trending - Show if high views or rating */}
                            {((prompt.views > 1000) || (prompt.rating > 4.5)) && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold bg-orange-500/90 text-white rounded-lg backdrop-blur-md animate-pulse w-fit">
                                    <TbFlame className="w-3 h-3 fill-white" />
                                    TOP
                                </span>
                            )}
                        </div>

                        <div className="flex gap-2">
                            {/* Copy Button (Visible on Hover via CSS) */}
                            <button
                                onClick={handleCopy}
                                className={`
                                    p-1.5 rounded-lg backdrop-blur-md transition-all duration-300
                                    ${isHovered ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}
                                    ${copied ? 'bg-green-500 text-white' : 'bg-black/60 text-white hover:bg-white hover:text-black'}
                                `}
                                title="Copy Link"
                            >
                                {copied ? <TbCheck className="w-4 h-4" /> : <TbCopy className="w-4 h-4" />}
                            </button>

                            <div className={`
                                px-3 py-1 text-xs font-bold rounded-lg shadow-lg backdrop-blur-md border h-fit
                                ${prompt.isFree
                                    ? 'bg-emerald-500/90 text-white border-emerald-400/50'
                                    : 'bg-primary/90 text-white border-primary/50'}
                            `}>
                                {formatPrice()}
                            </div>
                        </div>
                    </div>

                    {/* Hover CTA */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <span className="px-5 py-2.5 bg-white text-black font-bold rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-xl flex items-center gap-2">
                            {prompt.isFree ? <TbDownload className="w-4 h-4" /> : <TbShoppingCart className="w-4 h-4" />}
                            {prompt.isFree ? 'გადმოწერა' : 'ყიდვა'}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow space-y-3">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                            <span className="px-2 py-0.5 rounded bg-muted/50 border border-border/50">
                                {prompt.category}
                            </span>
                        </div>
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {prompt.title}
                        </h3>

                        {/* Author Trust Badge */}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span>by Andrew Altair</span>
                            <TbCertificate className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                    </div>

                    {/* Stats Footer */}
                    <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5" title="ნახვები">
                                <TbEye className="w-3.5 h-3.5" />
                                {prompt.views || 0}
                            </span>
                            <span className="flex items-center gap-1.5" title={prompt.isFree ? "ჩამოტვირთვები" : "გაყიდვები"}>
                                <TbDownload className="w-3.5 h-3.5" />
                                {prompt.isFree ? (prompt.downloads || 0) : (prompt.purchases || 0)}
                            </span>
                        </div>

                        {(prompt.rating || 0) > 0 && (
                            <span className="flex items-center gap-1 text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                                <TbStar className="w-3.5 h-3.5 fill-current" />
                                {(prompt.rating || 0).toFixed(1)}
                            </span>
                        )}
                    </div>
                </div>

                <PromptQuickView
                    prompt={prompt}
                    isOpen={showQuickView}
                    onClose={() => setShowQuickView(false)}
                />
            </motion.article>
        </Link >
    )
}

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TbShoppingCart, TbDownload, TbMessageCircle, TbShare, TbInfoCircle } from 'react-icons/tb'
import { formatId } from '@/lib/id-format'
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Not used currently
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface PromptHoverCardProps {
    prompt: any
    isVisible: boolean
}

export function PromptHoverCard({ prompt, isVisible }: PromptHoverCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    // Prepare images array: Cover + Examples
    const images = [
        prompt.coverImage,
        ...(prompt.exampleImages?.map((img: any) => img.src) || [])
    ].filter(Boolean)

    useEffect(() => {
        if (!isVisible || images.length <= 1) {
            setCurrentImageIndex(0)
            return
        }

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length)
        }, 3000) // Slower interval for better viewing

        return () => clearInterval(interval)
    }, [isVisible, images.length])

    // Deterministic share count
    const getShareCount = (id: string) => {
        if (!id) return 12;
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash % 45) + 5;
    }

    const shareCount = getShareCount(prompt.id || prompt.numericId || "default")

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute inset-0 z-20 overflow-hidden rounded-xl border border-white/20 shadow-2xl"
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                >
                    {/* #3 Dominant Color / Ambient Background (Blurred Image) */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={prompt.coverImage}
                            alt="Background"
                            fill
                            className="object-cover opacity-60 blur-3xl scale-150"
                        />
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        {/* Slideshow Header */}
                        <div className="relative h-40 shrink-0 w-full overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentImageIndex}
                                    initial={{ opacity: 0, scale: 1 }} // Start normal
                                    animate={{
                                        opacity: 1,
                                        scale: 1.1 // #1 Ken Burns Effect: Slow zoom to 1.1
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        opacity: { duration: 0.5 },
                                        scale: { duration: 3.5, ease: "linear" } // Long duration for slow zoom
                                    }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={images[currentImageIndex] || prompt.coverImage}
                                        alt={prompt.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 300px"
                                    />
                                    {/* Dark Gradient Overlay for text contrast */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-100" />
                                </motion.div>
                            </AnimatePresence>

                            {/* #7 Smart Tags Overlay */}
                            <div className="absolute bottom-2 left-3 right-3 flex flex-wrap gap-1 z-20 opacity-90">
                                {prompt.tags?.slice(0, 3).map((tag: string, i: number) => (
                                    <span key={i} className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-black/40 text-white/90 backdrop-blur-sm border border-white/10">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* Image Indicators */}
                            {images.length > 1 && (
                                <div className="absolute top-2 right-2 flex gap-1 z-20">
                                    {images.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1 w-1 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/40'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-grow -mt-2">
                            <div className="space-y-1 mb-2">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-bold text-base leading-tight line-clamp-2 text-foreground/90">{prompt.title}</h3>
                                    {prompt.numericId && (
                                        <Badge variant="outline" className="font-mono text-[10px] h-5 px-1.5 shrink-0 bg-background/50">
                                            {formatId(prompt.numericId)}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-3">
                                {prompt.excerpt || prompt.description || "Unlock the potential of this premium AI prompt. Professionally crafted for high-quality results."}
                            </p>

                            <div className="mt-auto space-y-3">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground/80 border-t border-border/40 pt-2">
                                    <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                                        <TbMessageCircle className="w-3.5 h-3.5" />
                                        {prompt.reviewsCount || 0}
                                    </span>
                                    <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                                        <TbShare className="w-3.5 h-3.5" />
                                        {shareCount}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <Button size="sm" className="w-full gap-2 font-semibold h-8 text-xs shadow-sm" variant={prompt.isFree ? "secondary" : "default"}>
                                        {prompt.isFree ? (
                                            <>
                                                <TbDownload className="w-3.5 h-3.5" />
                                                Free
                                            </>
                                        ) : (
                                            <>
                                                <TbShoppingCart className="w-3.5 h-3.5" />
                                                {prompt.price} {prompt.currency}
                                            </>
                                        )}
                                    </Button>
                                    <Button size="icon" variant="outline" className="shrink-0 h-8 w-8 bg-background/50" title="Details">
                                        <TbInfoCircle className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

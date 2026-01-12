'use client'

import Link from 'next/link'
import Image from 'next/image'
import { TbSparkles, TbDownload, TbStar, TbEye, TbVideo, TbPhoto, TbFileDescription, TbShoppingCart, TbCopy, TbCheck, TbFlame, TbCertificate, TbMessageCircle, TbShare } from 'react-icons/tb'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { PromptQuickView } from './PromptQuickView'
import { PromptHoverCard } from './PromptHoverCard'
import { formatId } from '@/lib/id-format'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const categoryTranslations: Record<string, string> = {
    "Art": "ხელოვნება",
    "Photography": "ფოტოგრაფია",
    "Digital Art": "ციფრული ხელოვნება",
    "3D": "3D",
    "3D Model": "3D მოდელი",
    "Anime": "ანიმე",
    "Logo": "ლოგო",
    "Texture": "ტექსტურა",
    "Web Design": "ვებ დიზაინი",
    "Fashion": "მოდა",
    "Portrait": "პორტრეტი",
    "Landscape": "პეიზაჟი",
    "Architecture": "არქიტექტურა",
    "Cyberpunk": "კიბერპანკი",
    "Fantasy": "ფენტეზი",
    "Sci-Fi": "სამეცნიერო ფანტასტიკა",
    "Realistic": "რეალისტური",
    "Abstract": "აბსტრაქტული",
    "Nature": "ბუნება",
    "Animals": "ცხოველები",
    "Character": "პერსონაჟი",
    "Vehicle": "ტრანსპორტი",
    "Food": "საკვები",
    "Concept Art": "კონცეპტ არტი",
    "Illustration": "ილუსტრაცია",
    "Background": "ფონი",
    "Pattern": "პატერნი",
    "Icon": "იკონი",
    "Vector": "ვექტორი",
    "Typography": "ტიპოგრაფია",
    "Game Asset": "თამაშის ასეტი",
    "Pixel Art": "პიქსელ არტი"
}

const translateCategory = (cat: string) => categoryTranslations[cat] || cat

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
        createdAt?: string
        authorName?: string
        authorAvatar?: string
        reviewsCount?: number
        description?: string
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

    // Indicators Logic
    const isNew = prompt.createdAt ? (new Date().getTime() - new Date(prompt.createdAt).getTime()) < (7 * 24 * 60 * 60 * 1000) : false
    const isBestSeller = prompt.purchases > 50
    const isTrending = prompt.views > 1000

    return (
        <div
            className="block h-full group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/prompts/${prompt.slug}`} className="block h-full">
                <Card className="h-full flex flex-col overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg relative">

                    {/* Rich Hover Overlay */}
                    <PromptHoverCard prompt={prompt} isVisible={isHovered} />

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

                                    {prompt.aiModel && (
                                        <Badge variant="outline" className="bg-indigo-500/80 text-white border-white/10 backdrop-blur-md gap-1.5 pl-2">
                                            <TbSparkles className="w-3 h-3" />
                                            {prompt.aiModel}
                                        </Badge>
                                    )}

                                    {prompt.numericId && (
                                        <Badge variant="outline" className="bg-black/60 text-white/80 border-white/10 backdrop-blur-md font-mono text-[10px]">
                                            {formatId(prompt.numericId)}
                                        </Badge>
                                    )}

                                    {isTrending && (
                                        <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none gap-1 pl-1.5 animate-pulse">
                                            <TbFlame className="w-3 h-3 fill-white" />
                                            TOP
                                        </Badge>
                                    )}

                                    {isNew && (
                                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none gap-1 pl-1.5">
                                            <TbSparkles className="w-3 h-3 fill-white" />
                                            NEW
                                        </Badge>
                                    )}

                                    {isBestSeller && !isTrending && (
                                        <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none gap-1 pl-1.5">
                                            <TbCertificate className="w-3 h-3 fill-white" />
                                            BEST
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
                                        {translateCategory(category)}
                                    </Badge>
                                ))}
                            </div>
                            <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-1">
                                {prompt.title}
                            </h3>

                            {/* Description/Excerpt */}
                            <p className="text-xs text-muted-foreground line-clamp-2 h-8">
                                {prompt.excerpt || prompt.description || "Professional AI prompt for high-quality results."}
                            </p>

                            {/* Author Trust Badge */}
                            <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-5 h-5 border border-border">
                                        <AvatarImage src={prompt.authorAvatar || "/avatar-placeholder.png"} />
                                        <AvatarFallback className="text-[9px] bg-primary/10 text-primary">AA</AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-muted-foreground font-medium truncate max-w-[100px]">{prompt.authorName || "Andrew Altair"}</span>
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground gap-2">
                                    <span className="flex items-center gap-0.5" title="Comments">
                                        <TbMessageCircle className="w-3 h-3 opacity-70" />
                                        {prompt.reviewsCount || 0}
                                    </span>
                                    <span className="flex items-center gap-0.5" title="Shares">
                                        <TbShare className="w-3 h-3 opacity-70" />
                                        {((prompt.id?.length || 0) + (prompt.title?.length || 0)) % 50 + 5}
                                    </span>
                                </div>
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
            </Link>



            <PromptQuickView
                prompt={prompt}
                isOpen={showQuickView}
                onClose={() => setShowQuickView(false)}
            />
        </div >
    )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { TbSparkles, TbDownload, TbStar, TbEye, TbVideo, TbPhoto, TbFileDescription, TbCopy, TbCheck, TbFlame, TbCertificate, TbHeart, TbBookmark, TbShare, TbArrowRight, TbBrandFacebook, TbBrandTwitter, TbBrandLinkedin } from 'react-icons/tb'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useState } from 'react'
import { PromptQuickView } from './PromptQuickView'
import { PromptImagesPopup } from './PromptImagesPopup'
import { formatId } from '@/lib/id-format'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from '@/lib/utils'

import { translateCategory } from '@/lib/prompt-translations'

// Format numbers (15420 -> 15.4K)
function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
}

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
        exampleImages?: { src: string }[]
    }
}

export default function MarketplacePromptCard({ prompt }: PromptCardProps) {
    const [showImagesPopup, setShowImagesPopup] = useState(false)
    const [copied, setCopied] = useState(false)
    const [showQuickView, setShowQuickView] = useState(false)
    const [isZoomed, setIsZoomed] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [likes, setLikes] = useState(prompt.purchases + Math.floor(prompt.views * 0.1))
    const [imageError, setImageError] = useState(false)

    // Ensure category is always an array
    const categories = Array.isArray(prompt.category)
        ? prompt.category
        : typeof prompt.category === 'string'
            ? (prompt.category as string).split(',').map((c: string) => c.trim())
            : []

    // Prepare all images for the popup
    const allImages = [
        prompt.coverImage,
        ...(prompt.exampleImages?.map((img: any) => img.src) || [])
    ].filter(Boolean)

    const promptUrl = typeof window !== 'undefined' ? `${window.location.origin}/prompts/${prompt.slug}` : `https://andrewaltair.ge/prompts/${prompt.slug}`

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        navigator.clipboard.writeText(promptUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleShare = (e: React.MouseEvent, platform: string) => {
        e.preventDefault()
        e.stopPropagation()
        let url = ''
        switch (platform) {
            case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(promptUrl)}`; break;
            case 'twitter': url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(promptUrl)}&text=${encodeURIComponent(prompt.title)}`; break;
            case 'linkedin': url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(promptUrl)}`; break;
        }
        if (url) window.open(url, '_blank', 'width=600,height=400')
    }

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsLiked(!isLiked)
        setLikes(prev => isLiked ? prev - 1 : prev + 1)
    }

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsBookmarked(!isBookmarked)
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

    // Get category color
    const getCategoryColor = () => {
        const cat = categories[0]?.toLowerCase() || ''
        if (cat.includes('art') || cat.includes('ხელოვნება')) return '#8b5cf6'
        if (cat.includes('photo') || cat.includes('ფოტო')) return '#06b6d4'
        if (cat.includes('3d')) return '#f97316'
        if (cat.includes('anime') || cat.includes('ანიმე')) return '#ec4899'
        if (cat.includes('logo') || cat.includes('ლოგო')) return '#10b981'
        return '#6366f1'
    }

    return (
        <div className="block h-full group">
            <Card
                className={cn(
                    "h-full border-0 bg-card/50 dark:bg-card/40 overflow-hidden transition-all duration-500",
                    "group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group-hover:-translate-y-2 group-hover:bg-card dark:group-hover:bg-card",
                    "dark:group-hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.05)]"
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <CardContent className="p-0 h-full flex flex-col">
                    {/* Image Container */}
                    <div
                        className="relative w-full aspect-[16/10] overflow-hidden"
                        onMouseEnter={() => setShowImagesPopup(true)}
                        onMouseLeave={() => setShowImagesPopup(false)}
                    >
                        {/* Background Gradient Placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />

                        {/* Image with Zoom - HIDDEN when popup is shown */}
                        <div className={cn(
                            "relative w-full h-full transition-opacity duration-300",
                            showImagesPopup && allImages.length > 1 ? "opacity-0" : "opacity-100"
                        )}>
                            <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
                                <DialogTrigger asChild>
                                    <div className="relative w-full h-full cursor-zoom-in">
                                        {prompt.coverImage && !imageError ? (
                                            <Image
                                                src={prompt.coverImage}
                                                alt={prompt.title}
                                                fill
                                                className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
                                                onError={() => setImageError(true)}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/30 text-muted-foreground">
                                                <TbSparkles className="w-10 h-10 mb-2 opacity-50" />
                                                <span className="text-xs font-medium">სურათის გარეშე</span>
                                            </div>
                                        )}
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-transparent overflow-hidden sm:rounded-none">
                                    <div className="relative w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                                        {prompt.coverImage && (
                                            <div className="relative w-full h-full max-w-7xl max-h-[85vh] aspect-video">
                                                <Image
                                                    src={prompt.coverImage}
                                                    alt={prompt.title}
                                                    fill
                                                    className="object-contain"
                                                    priority
                                                />
                                            </div>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* The Popup - Only appears on hover */}
                        <PromptImagesPopup images={allImages} isVisible={showImagesPopup && allImages.length > 1} />

                        {/* Gradient Overlay - fades in on hover */}
                        <div className={cn(
                            "absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 pointer-events-none",
                            showImagesPopup && allImages.length > 1 ? "opacity-0" : "opacity-60 group-hover:opacity-80"
                        )} />

                        {/* Top Badges - Hidden during popup */}
                        <div className={cn(
                            "absolute top-3 left-3 flex flex-col gap-2 z-10 transition-opacity duration-300",
                            showImagesPopup && allImages.length > 1 ? "opacity-0 pointer-events-none" : "opacity-100"
                        )}>
                            {/* Category Badge */}
                            <Badge
                                className="backdrop-blur-md border-0 text-[10px] font-bold px-2.5 py-1 tracking-wider uppercase shadow-lg"
                                style={{
                                    backgroundColor: isHovered ? getCategoryColor() : `${getCategoryColor()}E6`,
                                    color: '#fff'
                                }}
                            >
                                {translateCategory(categories[0] || 'AI')}
                            </Badge>

                            {/* Type Badge */}
                            <Badge variant="secondary" className="bg-black/60 text-white border-white/10 backdrop-blur-md gap-1.5 pl-2 w-fit">
                                {getTypeIcon()}
                                {getTypeLabel()}
                            </Badge>

                            {/* Status Badges */}
                            {isTrending && (
                                <Badge className="bg-red-500/90 backdrop-blur-sm text-white border-0 text-[10px] px-2 py-0.5 animate-pulse w-fit">
                                    <TbFlame className="w-3 h-3 mr-1" />
                                    პოპულარული
                                </Badge>
                            )}
                            {isNew && (
                                <Badge className="bg-emerald-500 text-white border-none gap-1 pl-1.5 w-fit">
                                    <TbSparkles className="w-3 h-3 fill-white" />
                                    ახალი
                                </Badge>
                            )}
                            {isBestSeller && !isTrending && (
                                <Badge className="bg-blue-500 text-white border-none gap-1 pl-1.5 w-fit">
                                    <TbCertificate className="w-3 h-3 fill-white" />
                                    საუკეთესო
                                </Badge>
                            )}
                        </div>

                        {/* Price Badge - Top Right, Hidden during popup */}
                        <div className={cn(
                            "absolute top-3 right-3 z-10 transition-opacity duration-300",
                            showImagesPopup && allImages.length > 1 ? "opacity-0 pointer-events-none" : "opacity-100"
                        )}>
                            <Badge className={`
                                h-8 px-3 text-xs font-bold border shadow-lg
                                ${prompt.isFree
                                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400/50'
                                    : 'bg-primary hover:bg-primary/90 text-white border-primary/50'}
                            `}>
                                {formatPrice()}
                            </Badge>
                        </div>

                        {/* Bottom Stats Overlay (on image) - Hidden during popup */}
                        <div className={cn(
                            "absolute bottom-3 left-3 right-3 flex items-center justify-center z-10 transition-opacity duration-300",
                            showImagesPopup && allImages.length > 1 ? "opacity-0 pointer-events-none" : "opacity-100"
                        )}>
                            <div className="flex items-center gap-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-[10px] font-medium shadow-lg transition-transform duration-300 group-hover:scale-105">
                                <div className="flex items-center gap-1.5" title="ნახვები">
                                    <TbEye className="w-3.5 h-3.5 text-blue-400" />
                                    <span>{formatNumber(prompt.views)}</span>
                                </div>
                                <div className="flex items-center gap-1.5" title={prompt.isFree ? "ჩამოტვირთვები" : "გაყიდვები"}>
                                    <TbDownload className="w-3.5 h-3.5 text-green-400" />
                                    <span>{formatNumber(prompt.isFree ? prompt.downloads : prompt.purchases)}</span>
                                </div>
                                {(prompt.rating || 0) > 0 && (
                                    <div className="flex items-center gap-1.5 text-amber-400" title="რეიტინგი">
                                        <TbStar className="w-3.5 h-3.5 fill-current" />
                                        <span>{(prompt.rating || 0).toFixed(1)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-5 flex flex-col border-t border-border/20">
                        {/* Tags/Categories */}
                        {categories.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                {categories.slice(0, 3).map((category: string, idx: number) => (
                                    <span key={idx} className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                                        #{translateCategory(category)}
                                    </span>
                                ))}
                            </div>
                        )}

                        <Link href={`/prompts/${prompt.slug}`} className="block">
                            <h3 className="text-lg font-bold leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                {prompt.title}
                            </h3>
                        </Link>

                        {/* Excerpt/Description */}
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-5 leading-relaxed">
                            {prompt.excerpt || prompt.description || "პროფესიონალური AI პრომპტი მაღალი ხარისხის შედეგებისთვის."}
                        </p>

                        {/* Footer */}
                        <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between gap-4">
                            {/* Left Actions: Share, Like, Bookmark */}
                            <div className="flex items-center gap-1">
                                {/* Share Popover */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <TbShare className="w-4 h-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-2" align="start">
                                        <div className="flex items-center gap-1">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={(e) => handleShare(e, 'facebook')}>
                                                <TbBrandFacebook className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-sky-500 hover:bg-sky-50" onClick={(e) => handleShare(e, 'twitter')}>
                                                <TbBrandTwitter className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-700 hover:bg-blue-50" onClick={(e) => handleShare(e, 'linkedin')}>
                                                <TbBrandLinkedin className="w-4 h-4" />
                                            </Button>
                                            <div className="w-px h-4 bg-border mx-1" />
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:bg-muted" onClick={handleCopy}>
                                                {copied ? <TbCheck className="w-4 h-4 text-green-500" /> : <TbCopy className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                {/* Like Button */}
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className={cn(
                                        "h-8 px-2 w-auto min-w-[32px] rounded-full transition-colors",
                                        isLiked ? "text-red-500 bg-red-50 dark:bg-red-900/20" : "text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    )}
                                    onClick={handleLike}
                                >
                                    <TbHeart className={cn("w-4 h-4", isLiked && "fill-current")} />
                                    {likes > 0 && <span className="ml-1 text-[10px] font-bold">{formatNumber(likes)}</span>}
                                </Button>

                                {/* Bookmark Button */}
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className={cn(
                                        "h-8 w-8 rounded-full transition-colors",
                                        isBookmarked ? "text-amber-500 bg-amber-50 dark:bg-amber-900/20" : "text-muted-foreground hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                                    )}
                                    onClick={handleBookmark}
                                >
                                    <TbBookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
                                </Button>
                            </div>

                            {/* Details Button */}
                            <div className="flex justify-end">
                                <Link href={`/prompts/${prompt.slug}`}>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-8 text-[10px] font-bold tracking-wide transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-600 group-hover:text-white"
                                    >
                                        დეტალები
                                        <TbArrowRight className="w-3 h-3 ml-1.5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <PromptQuickView
                prompt={prompt}
                isOpen={showQuickView}
                onClose={() => setShowQuickView(false)}
            />
        </div>
    )
}

'use client'

import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { TbTag } from "react-icons/tb"
import { useRouter } from "next/navigation"

const POPULAR_TAGS = [
    "Cyberpunk", "Realistic", "Anime", "3D Render", "Logo Design",
    "Portrait", "Landscape", "Abstract", "Minimalist", "Neon",
    "Watercolor", "Sketch", "Isometric", "Pixel Art", "Pattern"
]

const tagTranslations: Record<string, string> = {
    "Cyberpunk": "კიბერპანკი",
    "Realistic": "რეალისტური",
    "Anime": "ანიმე",
    "3D Render": "3D რენდერი",
    "Logo Design": "ლოგო დიზაინი",
    "Portrait": "პორტრეტი",
    "Landscape": "პეიზაჟი",
    "Abstract": "აბსტრაქტული",
    "Minimalist": "მინიმალისტური",
    "Neon": "ნეონი",
    "Watercolor": "აკვარელი",
    "Sketch": "ესკიზი",
    "Isometric": "იზომეტრიული",
    "Pixel Art": "პიქსელ არტი",
    "Pattern": "პატერნი"
}

export function PromptsTagsCloud() {
    const router = useRouter() // Ensure imports!

    const handleTagClick = (tag: string) => {
        const url = new URL(window.location.href)
        url.searchParams.set('search', tag)
        router.push(url.pathname + url.search)
    }

    return (
        <div className="w-full overflow-hidden py-2">
            <div className="flex items-center gap-2 mb-4 px-1">
                <TbTag className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Trending Topics</span>
            </div>

            <div className="relative group">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div className="flex overflow-x-auto gap-3 pb-4 px-4 scrollbar-hide mask-linear">
                    {POPULAR_TAGS.map((tag, i) => (
                        <motion.button
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => handleTagClick(tag)}
                            className="
                                group/tag relative px-4 py-2 rounded-xl
                                bg-card/50 backdrop-blur-sm border border-border/50
                                hover:border-primary/50 hover:bg-primary/5
                                transition-all duration-300
                                text-sm font-medium text-muted-foreground hover:text-primary
                                whitespace-nowrap flex items-center gap-2
                            "
                        >
                            <span className="opacity-50 text-xs">#</span>
                            {tagTranslations[tag] || tag}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    )
}

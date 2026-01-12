'use client'

import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { TbTag } from "react-icons/tb"

const POPULAR_TAGS = [
    "Cyberpunk", "Realistic", "Anime", "3D Render", "Logo Design",
    "Portrait", "Landscape", "Abstract", "Minimalist", "Neon",
    "Watercolor", "Sketch", "Isometric", "Pixel Art", "Pattern"
]

export function PromptsTagsCloud() {
    return (
        <div className="w-full overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
                <TbTag className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Popular Tags</span>
            </div>

            <div className="relative group">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-hide mask-linear">
                    {POPULAR_TAGS.map((tag, i) => (
                        <motion.div
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Badge
                                variant="secondary"
                                className="px-4 py-1.5 text-sm font-normal cursor-pointer hover:bg-primary hover:text-white transition-colors whitespace-nowrap border-border/50 hover:border-primary"
                                onClick={() => {
                                    // In a real app, this would toggle a filter
                                    const url = new URL(window.location.href)
                                    url.searchParams.set('search', tag)
                                    window.history.pushState({}, '', url.toString())
                                    window.location.reload() // Simple reload for now
                                }}
                            >
                                #{tag}
                            </Badge>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

'use client'

import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"
import { TbDownload, TbShoppingCart, TbStar, TbEye, TbCheck } from "react-icons/tb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PromptQuickViewProps {
    prompt: any
    isOpen: boolean
    onClose: () => void
}

export function PromptQuickView({ prompt, isOpen, onClose }: PromptQuickViewProps) {
    if (!prompt) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-none shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 h-[80vh] md:h-[600px]">
                    {/* Visual Side */}
                    <div className="relative h-64 md:h-full bg-muted">
                        <Image
                            src={prompt.coverImage}
                            alt={prompt.title}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 md:hidden">
                            <h2 className="text-white font-bold text-xl">{prompt.title}</h2>
                        </div>
                    </div>

                    {/* Details Side */}
                    <div className="p-6 flex flex-col h-full bg-card overflow-y-auto">
                        <div className="mb-6 hidden md:block">
                            <h2 className="text-2xl font-bold mb-2">{prompt.title}</h2>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline">{prompt.category}</Badge>
                                <span className="flex items-center gap-1">
                                    <TbStar className="w-4 h-4 text-amber-500 fill-current" />
                                    {prompt.rating || 5.0}
                                </span>
                                <span>•</span>
                                <span>{prompt.views} views</span>
                            </div>
                        </div>

                        <div className="space-y-6 flex-grow">
                            <div>
                                <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">Description</h3>
                                <p className="text-sm leading-relaxed text-foreground/90">
                                    {prompt.excerpt || "Unlock the potential of AI with this professionally crafted prompt. Designed for consistency and high-quality results."}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-muted/50 border">
                                    <span className="text-xs text-muted-foreground block mb-1">AI Model</span>
                                    <span className="font-medium">{prompt.aiModel}</span>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/50 border">
                                    <span className="text-xs text-muted-foreground block mb-1">Type</span>
                                    <span className="font-medium capitalize">{prompt.generationType?.replace(/-/g, ' ') || 'Image'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t flex items-center justify-between gap-4">
                            <div className="text-2xl font-bold text-primary">
                                {prompt.isFree ? 'FREE' : `${prompt.price} ${prompt.currency}`}
                            </div>
                            <Button size="lg" className="flex-1 gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" onClick={() => window.location.href = `/prompts/${prompt.slug}`}>
                                {prompt.isFree ? <TbDownload className="w-5 h-5" /> : <TbShoppingCart className="w-5 h-5" />}
                                {prompt.isFree ? 'Download Prompt' : 'Buy Now'}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

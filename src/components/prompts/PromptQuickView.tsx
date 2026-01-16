'use client'

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { TbDownload, TbShoppingCart, TbStar, TbEye, TbCheck } from "react-icons/tb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { translateCategory } from "@/lib/prompt-translations"

// Generation Type translations
const generationTypeTranslations: Record<string, string> = {
    "text-to-image": "სურათი",
    "text-to-text": "ტექსტი",
    "image-to-image": "სურათი-სურათი",
    "text-to-video": "ვიდეო"
}

const translateGenerationType = (type: string) => generationTypeTranslations[type] || type

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
                            <DialogTitle className="text-white font-bold text-xl">{prompt.title}</DialogTitle>
                        </div>
                    </div>

                    {/* Details Side */}
                    <div className="p-6 flex flex-col h-full bg-card overflow-y-auto">
                        <div className="mb-6 hidden md:block">
                            <DialogTitle className="text-2xl font-bold mb-2">{prompt.title}</DialogTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline">{translateCategory(prompt.category)}</Badge>
                                <span className="flex items-center gap-1">
                                    <TbStar className="w-4 h-4 text-amber-500 fill-current" />
                                    {prompt.rating || 5.0}
                                </span>
                                <span>•</span>
                                <span>{prompt.views} ნახვა</span>
                            </div>
                        </div>

                        <div className="space-y-6 flex-grow">
                            <div>
                                <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">აღწერა</h3>
                                <p className="text-sm leading-relaxed text-foreground/90">
                                    {prompt.excerpt || "აღმოაჩინეთ AI-ის პოტენციალი ამ პროფესიონალური პრომპტით. შექმნილია მაღალი ხარისხის შედეგებისთვის."}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-muted/50 border">
                                    <span className="text-xs text-muted-foreground block mb-1">AI მოდელი</span>
                                    <span className="font-medium">{prompt.aiModel}</span>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/50 border">
                                    <span className="text-xs text-muted-foreground block mb-1">ტიპი</span>
                                    <span className="font-medium">{translateGenerationType(prompt.generationType)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t flex items-center justify-between gap-4">
                            <div className="text-2xl font-bold text-primary">
                                {prompt.isFree ? 'უფასო' : `${prompt.price} ${prompt.currency}`}
                            </div>
                            <Button size="lg" className="flex-1 gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" onClick={() => window.location.href = `/prompts/${prompt.slug}`}>
                                {prompt.isFree ? <TbDownload className="w-5 h-5" /> : <TbShoppingCart className="w-5 h-5" />}
                                {prompt.isFree ? 'გადმოწერა' : 'ყიდვა'}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

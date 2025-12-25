"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Sparkles, ChevronDown, ChevronUp, Clock, Lightbulb } from "lucide-react"

interface TLDRSummaryProps {
    summary: string
    keyPoints?: string[]
    readingTime?: number
    className?: string
}

export function TLDRSummary({
    summary,
    keyPoints,
    readingTime,
    className,
}: TLDRSummaryProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className={cn("rounded-xl border bg-card overflow-hidden", className)}>
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                        <h4 className="font-bold flex items-center gap-2">
                            TL;DR
                            <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">
                                AI შეჯამება
                            </span>
                        </h4>
                        {readingTime && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                სრული სტატია: {readingTime} წთ
                            </p>
                        )}
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
            </button>

            {/* Content */}
            <div
                className={cn(
                    "transition-all duration-300 ease-out overflow-hidden",
                    isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="p-4 pt-0 space-y-4">
                    {/* Summary */}
                    <p className="text-muted-foreground leading-relaxed">
                        {summary}
                    </p>

                    {/* Key points */}
                    {keyPoints && keyPoints.length > 0 && (
                        <div className="space-y-2">
                            <h5 className="font-medium flex items-center gap-2 text-sm">
                                <Lightbulb className="h-4 w-4 text-primary" />
                                მთავარი პუნქტები:
                            </h5>
                            <ul className="space-y-1.5">
                                {keyPoints.map((point, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-2 text-sm text-muted-foreground"
                                    >
                                        <span className="text-primary mt-0.5">•</span>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Auto-expanded variant for article pages
export function ArticleTLDR({
    content,
    className,
}: {
    content: string
    className?: string
}) {
    // Simulate AI-generated summary from content
    const generateSummary = (text: string) => {
        // In real app, this would call an AI API
        // For now, just truncate the content
        const sentences = text.split(/[.!?]+/).filter(Boolean)
        return sentences.slice(0, 2).join(". ") + "."
    }

    const generateKeyPoints = (_text: string) => {
        // Simulated key points
        return [
            "AI ხელსაწყოები სწრაფად ვითარდება",
            "პრაქტიკული გამოყენება მნიშვნელოვანია",
            "ახალი შესაძლებლობები ყოველდღე ჩნდება",
        ]
    }

    return (
        <div className={cn("rounded-xl border bg-gradient-to-br from-primary/5 to-accent/5 p-6", className)}>
            <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                        ⚡ სწრაფი შეჯამება
                    </h4>
                    <p className="text-muted-foreground mb-4">
                        {generateSummary(content)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {generateKeyPoints(content).map((point, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-sm"
                            >
                                <span className="text-primary">✓</span>
                                {point}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

"use client"

import { cn } from "@/lib/utils"

interface SkeletonProps {
    className?: string
    children?: React.ReactNode
}

// Base Skeleton with shimmer animation
export function NeuroSkeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "bg-gradient-to-r from-[#1A1A1E] via-[#222226] to-[#1A1A1E]",
                "bg-[length:200%_100%] animate-[neuro-shimmer_1.5s_ease-in-out_infinite]",
                "rounded-lg",
                className
            )}
        />
    )
}

// Tool Card Skeleton for zero CLS during loading
export function ToolCardSkeleton() {
    return (
        <div className="p-6 rounded-2xl bg-[#1A1A1E] border border-white/[0.08] space-y-4">
            {/* Icon skeleton */}
            <NeuroSkeleton className="w-14 h-14 mx-auto rounded-xl" />
            {/* Title skeleton */}
            <NeuroSkeleton className="h-4 w-3/4 mx-auto" />
            {/* Description skeleton (hidden on mobile) */}
            <NeuroSkeleton className="h-3 w-full hidden sm:block" />
        </div>
    )
}

// Section skeleton for feature sections
export function SectionSkeleton() {
    return (
        <div className="p-5 rounded-xl bg-[#1A1A1E] border border-white/[0.08] space-y-3">
            <NeuroSkeleton className="w-7 h-7 mx-auto rounded-lg" />
            <NeuroSkeleton className="h-4 w-2/3 mx-auto" />
        </div>
    )
}

// Text skeleton for content loading
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <NeuroSkeleton
                    key={i}
                    className={cn(
                        "h-4",
                        i === lines - 1 ? "w-2/3" : "w-full"
                    )}
                />
            ))}
        </div>
    )
}

// Content block skeleton
export function ContentSkeleton() {
    return (
        <div className="space-y-6 p-6 rounded-2xl bg-[#1A1A1E] border border-white/[0.08]">
            <div className="flex items-center gap-4">
                <NeuroSkeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <NeuroSkeleton className="h-5 w-1/2" />
                    <NeuroSkeleton className="h-3 w-1/3" />
                </div>
            </div>
            <TextSkeleton lines={4} />
        </div>
    )
}

// Grid of tool cards skeleton
export function ToolGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <ToolCardSkeleton key={i} />
            ))}
        </div>
    )
}

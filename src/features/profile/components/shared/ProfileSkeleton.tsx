/**
 * Profile Feature - Loading Skeletons
 * Improved perceived performance with skeleton states
 */

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function ProfileSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center gap-6">
                <div className="w-32 h-32 rounded-full bg-muted" />
                <div className="flex-1 space-y-3">
                    <div className="h-8 w-48 bg-muted rounded" />
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-10 w-24 bg-muted rounded-full" />
                </div>
            </div>

            {/* Content skeleton */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="h-20 bg-muted rounded-lg" />
                <div className="h-20 bg-muted rounded-lg" />
                <div className="h-20 bg-muted rounded-lg" />
                <div className="h-20 bg-muted rounded-lg" />
            </div>
        </div>
    )
}

export function ActivitySkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-muted rounded" />
                        <div className="h-3 w-1/4 bg-muted rounded" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export function StatsSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 rounded-lg bg-muted">
                        <div className="w-6 h-6 bg-muted-foreground/20 rounded mb-2" />
                        <div className="h-7 w-16 bg-muted-foreground/20 rounded mb-1" />
                        <div className="h-4 w-24 bg-muted-foreground/20 rounded" />
                    </div>
                ))}
            </div>
            <div className="p-4 rounded-lg border border-border">
                <div className="h-5 w-32 bg-muted rounded mb-4" />
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-1">
                            <div className="flex justify-between">
                                <div className="h-4 w-24 bg-muted rounded" />
                                <div className="h-4 w-16 bg-muted rounded" />
                            </div>
                            <div className="h-2 bg-muted rounded-full w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

interface SkeletonProps {
    className?: string
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-muted", className)}
        />
    )
}

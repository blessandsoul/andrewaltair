"use client"

import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

// Types
interface ActivityData {
    id: string
    type: string
    displayName: string
    avatarUrl: string
    city?: string
    targetType?: string
    targetTitle?: string
    targetSlug?: string
    metadata?: Record<string, any>
    createdAt: string
    timeAgo: string
}

interface Toast {
    id: string
    type: "subscribe" | "page_view" | "comment" | "reaction" | "share" | "purchase" | "achievement" | "signup" | "group"
    displayName: string
    avatarUrl: string
    city?: string
    targetTitle?: string
    timeAgo: string
    badge?: string
    count?: number
}

// Toast type configurations
const TOAST_CONFIGS: Record<string, {
    gradient: string
    glow: string
    icon: string
    bgColor: string
    borderColor: string
}> = {
    subscribe: {
        gradient: "from-emerald-500 to-green-500",
        glow: "shadow-emerald-500/30",
        icon: "✉️",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20"
    },
    page_view: {
        gradient: "from-blue-500 to-cyan-500",
        glow: "shadow-blue-500/30",
        icon: "📖",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20"
    },
    comment: {
        gradient: "from-violet-500 to-purple-500",
        glow: "shadow-violet-500/30",
        icon: "💬",
        bgColor: "bg-violet-500/10",
        borderColor: "border-violet-500/20"
    },
    reaction: {
        gradient: "from-pink-500 to-rose-500",
        glow: "shadow-pink-500/30",
        icon: "❤️",
        bgColor: "bg-pink-500/10",
        borderColor: "border-pink-500/20"
    },
    share: {
        gradient: "from-cyan-500 to-teal-500",
        glow: "shadow-cyan-500/30",
        icon: "🔗",
        bgColor: "bg-cyan-500/10",
        borderColor: "border-cyan-500/20"
    },
    purchase: {
        gradient: "from-amber-500 to-yellow-500",
        glow: "shadow-amber-500/30",
        icon: "👑",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20"
    },
    achievement: {
        gradient: "from-rose-500 to-pink-500",
        glow: "shadow-rose-500/30",
        icon: "🏆",
        bgColor: "bg-rose-500/10",
        borderColor: "border-rose-500/20"
    },
    signup: {
        gradient: "from-indigo-500 to-purple-500",
        glow: "shadow-indigo-500/30",
        icon: "🎉",
        bgColor: "bg-indigo-500/10",
        borderColor: "border-indigo-500/20"
    },
    group: {
        gradient: "from-indigo-500 to-blue-500",
        glow: "shadow-indigo-500/30",
        icon: "👥",
        bgColor: "bg-indigo-500/10",
        borderColor: "border-indigo-500/20"
    }
}

// Toast content renderer
function ToastContent({ toast }: { toast: Toast }) {
    switch (toast.type) {
        case "subscribe":
            return (
                <>
                    <span className="font-semibold text-foreground">{toast.displayName}</span>
                    <span className="text-muted-foreground"> გამოიწერა ნიუსლეთერი</span>
                </>
            )
        case "page_view":
            return (
                <>
                    <span className="font-semibold text-foreground">{toast.displayName}</span>
                    <span className="text-muted-foreground"> კითხულობს </span>
                    <span className="font-medium text-blue-500">{toast.targetTitle}</span>
                </>
            )
        case "comment":
            return (
                <>
                    <span className="font-semibold text-foreground">{toast.displayName}</span>
                    <span className="text-muted-foreground"> დატოვა კომენტარი </span>
                    <span className="text-muted-foreground/70">სტატიაზე</span>
                </>
            )
        case "reaction":
            return (
                <>
                    <span className="font-semibold text-foreground">{toast.displayName}</span>
                    <span className="text-muted-foreground"> მოიწონა </span>
                    <span className="font-medium text-pink-500">{toast.targetTitle}</span>
                </>
            )
        case "share":
            return (
                <>
                    <span className="font-semibold text-foreground">{toast.displayName}</span>
                    <span className="text-muted-foreground"> გააზიარა სტატია</span>
                </>
            )
        case "purchase":
            return (
                <>
                    <span className="font-semibold text-foreground">{toast.displayName}</span>
                    <span className="text-amber-500 font-medium"> გახდა Premium წევრი 👑</span>
                </>
            )
        case "achievement":
            return (
                <>
                    <span className="font-semibold text-foreground">{toast.displayName}</span>
                    <span className="text-muted-foreground"> მიიღო </span>
                    <span className="font-medium text-rose-500">{toast.badge}</span>
                </>
            )
        case "signup":
            return (
                <>
                    <span className="font-semibold text-foreground">{toast.displayName}</span>
                    <span className="text-muted-foreground"> შეუერთდა საზოგადოებას 🎉</span>
                </>
            )
        case "group":
            return (
                <>
                    <span className="font-bold text-indigo-500">{toast.count} ადამიანი</span>
                    <span className="text-muted-foreground"> კითხულობს </span>
                    <span className="font-medium text-foreground">{toast.targetTitle}</span>
                </>
            )
        default:
            return <span>{toast.displayName}</span>
    }
}

export function SocialProofToast({ enabled = true }: { enabled?: boolean }) {
    const [toasts, setToasts] = useState<Toast[]>([])
    const [lastFetchTime, setLastFetchTime] = useState<string | null>(null)

    // Fetch REAL activities from API (no fallbacks)
    const fetchActivities = useCallback(async () => {
        try {
            const params = new URLSearchParams({
                limit: '5',
                types: 'subscribe,comment,reaction,share,purchase,achievement,signup'
            })
            if (lastFetchTime) {
                params.set('since', lastFetchTime)
            }

            const res = await fetch(`/api/tracking/activities?${params}`)
            if (res.ok) {
                const data = await res.json()
                if (data.activities && data.activities.length > 0) {
                    // Transform API data to Toast format
                    const newToast: Toast = {
                        id: data.activities[0].id,
                        type: data.activities[0].type as Toast["type"],
                        displayName: data.activities[0].displayName,
                        avatarUrl: data.activities[0].avatarUrl,
                        city: data.activities[0].city,
                        targetTitle: data.activities[0].targetTitle,
                        timeAgo: data.activities[0].timeAgo,
                    }

                    setToasts(prev => [...prev.slice(-1), newToast])
                    setLastFetchTime(data.timestamp)

                    // Auto-remove after 6 seconds
                    setTimeout(() => {
                        setToasts(prev => prev.filter(t => t.id !== newToast.id))
                    }, 6000)
                }
                // If no activities, do nothing - don't show fake data
            }
        } catch (error) {
            // On error, just don't show anything - no fake data
        }
    }, [lastFetchTime])

    useEffect(() => {
        if (!enabled) return

        // Check for activities after initial delay
        const initialDelay = setTimeout(() => {
            fetchActivities()
        }, 5000)

        // Then poll for new activities periodically
        const interval = setInterval(() => {
            fetchActivities()
        }, 15000) // Every 15 seconds

        return () => {
            clearTimeout(initialDelay)
            clearInterval(interval)
        }
    }, [enabled, fetchActivities])

    // Don't render if no real toasts
    if (!enabled || toasts.length === 0) return null

    return (
        <div className="fixed bottom-4 left-4 z-40 flex flex-col gap-3 max-w-[90vw] sm:max-w-sm">
            {toasts.map((toast) => {
                const config = TOAST_CONFIGS[toast.type] || TOAST_CONFIGS.page_view

                return (
                    <div
                        key={toast.id}
                        className={cn(
                            "group relative flex items-center gap-3 rounded-2xl",
                            "bg-card/95 backdrop-blur-xl border shadow-xl",
                            "px-3 py-2.5 sm:px-4 sm:py-3",
                            "animate-in slide-in-from-left-8 fade-in duration-500",
                            `shadow-lg ${config.glow}`,
                            config.borderColor
                        )}
                        style={{
                            animationTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)"
                        }}
                    >
                        {/* Glow effect on hover */}
                        <div className={cn(
                            "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                            `bg-gradient-to-r ${config.gradient}`,
                            "blur-xl -z-10"
                        )} />

                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-card ring-primary/20">
                                {toast.type === "group" ? (
                                    <div className="w-full h-full flex items-center justify-center bg-indigo-500/20 text-xl">
                                        👥
                                    </div>
                                ) : (
                                    <Image
                                        src={toast.avatarUrl || '/avatar-placeholder.png'}
                                        alt={toast.displayName}
                                        width={44}
                                        height={44}
                                        className="w-full h-full object-cover"
                                        unoptimized
                                    />
                                )}
                            </div>
                            {/* Online pulse */}
                            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-card" />
                            </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm leading-snug line-clamp-2">
                                <ToastContent toast={toast} />
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                                {toast.city && toast.city !== 'Unknown' && (
                                    <>
                                        <span className="text-[10px] sm:text-xs text-muted-foreground/60">
                                            📍 {toast.city}
                                        </span>
                                        <span className="text-muted-foreground/30">•</span>
                                    </>
                                )}
                                <span className="text-[10px] sm:text-xs text-muted-foreground/60">
                                    {toast.timeAgo}
                                </span>
                            </div>
                        </div>

                        {/* Type icon */}
                        <div className={cn(
                            "shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-base sm:text-lg",
                            config.bgColor
                        )}>
                            {config.icon}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

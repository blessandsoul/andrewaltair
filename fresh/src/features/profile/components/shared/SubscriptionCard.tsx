/**
 * Profile Feature - Subscription Card
 * Manage tool and topic subscriptions
 */

"use client"

import * as React from "react"
import {
    Bot,
    ImageIcon,
    FileText,
    Video,
    Cpu,
    Zap,
    TrendingUp,
    type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SubscriptionCardProps {
    name: string
    type: "tool" | "topic"
    subscribed: boolean
    onToggle: () => void
    className?: string
}

const subscriptionIcons: Record<string, LucideIcon> = {
    ChatGPT: Bot,
    Midjourney: ImageIcon,
    "DALL-E 3": ImageIcon,
    "AI News": FileText,
    Tutorials: Video,
    Claude: Cpu,
    "Stable Diffusion": Zap,
    Gemini: Cpu,
    "Product Updates": TrendingUp,
}

export function SubscriptionCard({
    name,
    type,
    subscribed,
    onToggle,
    className,
}: SubscriptionCardProps) {
    const IconComponent = subscriptionIcons[name] || (type === "tool" ? Bot : FileText)

    return (
        <div
            className={cn(
                "flex items-center justify-between p-4 rounded-lg border transition-colors",
                subscribed ? "border-primary bg-primary/5" : "border-border",
                className
            )}
        >
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        subscribed ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    )}
                >
                    <IconComponent className="w-5 h-5" />
                </div>
                <span className="font-medium">{name}</span>
            </div>
            <button
                onClick={onToggle}
                className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    subscribed
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-muted hover:bg-muted/80"
                )}
            >
                {subscribed ? "გამოწერილია" : "გამოწერა"}
            </button>
        </div>
    )
}

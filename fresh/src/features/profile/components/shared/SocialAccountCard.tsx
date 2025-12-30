/**
 * Profile Feature - Social Account Card
 * Display and manage social connections
 */

"use client"

import * as React from "react"
import { Github, Chrome, Facebook, Send, CheckCircle2, Link2, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SocialAccountCardProps {
    provider: "google" | "github" | "facebook" | "telegram"
    name: string
    connected: boolean
    onConnect?: () => void
    onDisconnect?: () => void
    className?: string
}

const providerConfig: Record<string, { icon: LucideIcon; color: string }> = {
    google: { icon: Chrome, color: "bg-red-500" },
    github: { icon: Github, color: "bg-gray-800" },
    facebook: { icon: Facebook, color: "bg-blue-600" },
    telegram: { icon: Send, color: "bg-sky-500" },
}

export function SocialAccountCard({
    provider,
    name,
    connected,
    onConnect,
    onDisconnect,
    className,
}: SocialAccountCardProps) {
    const config = providerConfig[provider]
    const IconComponent = config.icon

    return (
        <div
            className={cn(
                "flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors",
                className
            )}
        >
            <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white", config.color)}>
                    <IconComponent className="w-6 h-6" />
                </div>
                <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-muted-foreground">
                        {connected ? "დაკავშირებულია" : "არ არის დაკავშირებული"}
                    </p>
                </div>
            </div>
            {connected ? (
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-green-500 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        დაკავშირებულია
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={onDisconnect}
                    >
                        გათიშვა
                    </Button>
                </div>
            ) : (
                <Button variant="outline" size="sm" className="gap-2" onClick={onConnect}>
                    <Link2 className="w-4 h-4" />
                    დაკავშირება
                </Button>
            )}
        </div>
    )
}

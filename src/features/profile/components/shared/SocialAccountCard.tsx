/**
 * Profile Feature - Social Account Card
 * Display and manage social connections
 */

"use client"

import * as React from "react"
import { TbBrandGithub, TbBrandChrome, TbBrandFacebook, TbSend, TbCircleCheck, TbExternalLink, TbLink } from "react-icons/tb"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type IconType = React.ComponentType<{ className?: string }>

interface SocialAccountCardProps {
    provider: "google" | "github" | "facebook" | "telegram"
    name: string
    connected: boolean
    onConnect?: () => void
    onDisconnect?: () => void
    className?: string
}

const providerConfig: Record<string, { icon: IconType; color: string }> = {
    google: { icon: TbBrandChrome, color: "bg-red-500" },
    github: { icon: TbBrandGithub, color: "bg-gray-800" },
    facebook: { icon: TbBrandFacebook, color: "bg-blue-600" },
    telegram: { icon: TbSend, color: "bg-sky-500" },
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
                        <TbCircleCheck className="w-4 h-4" />
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
                    <TbLink className="w-4 h-4" />
                    დაკავშირება
                </Button>
            )}
        </div>
    )
}

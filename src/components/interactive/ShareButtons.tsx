"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Twitter,
    Facebook,
    Linkedin,
    Link2,
    Send,
    Check,
    Share2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ShareButtonsProps {
    url: string
    title: string
    className?: string
    variant?: "default" | "compact"
}

export function ShareButtons({ url, title, className, variant = "default" }: ShareButtonsProps) {
    const [copied, setCopied] = React.useState(false)

    const shareLinks = [
        {
            name: "Twitter",
            icon: Twitter,
            color: "hover:bg-sky-500 hover:text-white hover:border-sky-500",
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        },
        {
            name: "Facebook",
            icon: Facebook,
            color: "hover:bg-blue-600 hover:text-white hover:border-blue-600",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            color: "hover:bg-blue-700 hover:text-white hover:border-blue-700",
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        },
        {
            name: "Telegram",
            icon: Send,
            color: "hover:bg-sky-400 hover:text-white hover:border-sky-400",
            href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        },
    ]

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    if (variant === "compact") {
        return (
            <div className={cn("flex items-center gap-1", className)}>
                {shareLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            "w-8 h-8 rounded-lg border border-border flex items-center justify-center transition-all",
                            link.color
                        )}
                        title={`გაზიარება ${link.name}-ზე`}
                    >
                        <link.icon className="w-4 h-4" />
                    </a>
                ))}
                <button
                    onClick={copyToClipboard}
                    className={cn(
                        "w-8 h-8 rounded-lg border border-border flex items-center justify-center transition-all",
                        copied ? "bg-green-500 text-white border-green-500" : "hover:bg-secondary"
                    )}
                    title="ლინკის კოპირება"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                </button>
            </div>
        )
    }

    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Share2 className="w-4 h-4" />
                <span>გაზიარება</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {shareLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            className={cn("gap-2 transition-all", link.color)}
                        >
                            <link.icon className="w-4 h-4" />
                            {link.name}
                        </Button>
                    </a>
                ))}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className={cn(
                        "gap-2 transition-all",
                        copied && "bg-green-500 text-white border-green-500"
                    )}
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4" />
                            დაკოპირდა!
                        </>
                    ) : (
                        <>
                            <Link2 className="w-4 h-4" />
                            ლინკის კოპირება
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

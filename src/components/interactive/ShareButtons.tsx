"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { TbBrandTwitter, TbBrandFacebook, TbBrandLinkedin, TbSend, TbCheck, TbShare, TbLink } from "react-icons/tb"
import { cn } from "@/lib/utils"
import { useVisitorTracking } from "@/hooks/useVisitorTracking"

interface ShareButtonsProps {
    url: string
    title: string
    description?: string  // Excerpt for viral shares
    postId?: string
    className?: string
    variant?: "default" | "compact"
}

export function ShareButtons({ url, title, description = "", postId, className, variant = "default" }: ShareButtonsProps) {
    const [copied, setCopied] = React.useState(false)
    const { recordActivity } = useVisitorTracking()

    // Create viral share text: Title + short excerpt
    const viralText = description
        ? `${title}\n\n${description.slice(0, 100)}${description.length > 100 ? '...' : ''}`
        : title

    // Twitter-optimized: shorter, punchy
    const twitterText = description
        ? `${title} 🔥\n\n${description.slice(0, 80)}...`
        : `${title} 🔥`

    const shareLinks = [
        {
            name: "Twitter",
            icon: TbBrandTwitter,
            color: "hover:bg-sky-500 hover:text-white hover:border-sky-500",
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(url)}`,
        },
        {
            name: "Facebook",
            icon: TbBrandFacebook,
            color: "hover:bg-blue-600 hover:text-white hover:border-blue-600",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(viralText)}`,
        },
        {
            name: "LinkedIn",
            icon: TbBrandLinkedin,
            color: "hover:bg-blue-700 hover:text-white hover:border-blue-700",
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        },
        {
            name: "Telegram",
            icon: TbSend,
            color: "hover:bg-sky-400 hover:text-white hover:border-sky-400",
            href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(viralText + '\n\n🔗 წაიკითხე სრულად:')}`,
        },
    ]

    // Emojis for fun share text
    const shareEmojis = ["🔥", "✨", "🚀", "💡", "🎯", "⚡", "🤖", "💫", "🎨", "📚"]

    // 🎯 TRACK SHARE ACTIVITY
    const trackShare = React.useCallback((platform: string) => {
        recordActivity('share', {
            targetType: 'post',
            targetId: postId,
            targetTitle: title,
            metadata: { platform, url },
            isPublic: true // Shares shown in social proof
        })
    }, [recordActivity, postId, title, url])

    const handleShareClick = (platform: string) => {
        trackShare(platform)
    }

    const copyToClipboard = async () => {
        try {
            // Pick a random emoji
            const randomEmoji = shareEmojis[Math.floor(Math.random() * shareEmojis.length)]
            // Viral share format with excerpt
            const shareText = description
                ? `${title} ${randomEmoji}\n\n${description.slice(0, 120)}${description.length > 120 ? '...' : ''}\n\n🔗 ${url}`
                : `${title} ${randomEmoji}\n\n${url}`

            await navigator.clipboard.writeText(shareText)
            setCopied(true)

            // Track copy as share
            trackShare('clipboard')

            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            // Silently fail
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
                        onClick={() => handleShareClick(link.name)}
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
                    {copied ? <TbCheck className="w-4 h-4" /> : <TbLink className="w-4 h-4" />}
                </button>
            </div>
        )
    }

    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TbShare className="w-4 h-4" />
                <span>გაზიარება</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {shareLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleShareClick(link.name)}
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
                            <TbCheck className="w-4 h-4" />
                            დაკოპირდა!
                        </>
                    ) : (
                        <>
                            <TbLink className="w-4 h-4" />
                            ლინკის კოპირება
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

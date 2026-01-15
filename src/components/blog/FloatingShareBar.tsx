"use client"

import { useState } from "react"
import { TbBrandFacebook, TbBrandTwitter, TbBrandLinkedin, TbBrandTelegram, TbLink, TbCheck } from "react-icons/tb"

interface FloatingShareBarProps {
    url: string
    title: string
}

export function FloatingShareBar({ url, title }: FloatingShareBarProps) {
    const [copied, setCopied] = useState(false)

    const shareLinks = [
        {
            name: "Facebook",
            icon: TbBrandFacebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            color: "hover:bg-blue-600 hover:text-white"
        },
        {
            name: "Twitter",
            icon: TbBrandTwitter,
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            color: "hover:bg-sky-500 hover:text-white"
        },
        {
            name: "LinkedIn",
            icon: TbBrandLinkedin,
            href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
            color: "hover:bg-blue-700 hover:text-white"
        },
        {
            name: "Telegram",
            icon: TbBrandTelegram,
            href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            color: "hover:bg-sky-400 hover:text-white"
        },
    ]

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    return (
        <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-2 p-2 bg-card/80 backdrop-blur-md rounded-2xl border border-border shadow-xl">
            {shareLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 rounded-xl bg-secondary/50 transition-all duration-200 ${link.color}`}
                    title={link.name}
                >
                    <link.icon className="w-5 h-5" />
                </a>
            ))}
            <button
                onClick={copyLink}
                className={`p-2.5 rounded-xl transition-all duration-200 ${copied
                        ? "bg-green-500 text-white"
                        : "bg-secondary/50 hover:bg-primary hover:text-white"
                    }`}
                title={copied ? "დაკოპირდა!" : "ლინკის კოპირება"}
            >
                {copied ? <TbCheck className="w-5 h-5" /> : <TbLink className="w-5 h-5" />}
            </button>
        </div>
    )
}

export default FloatingShareBar

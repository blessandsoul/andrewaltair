"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { List, ChevronRight } from "lucide-react"

interface TOCItem {
    id: string
    text: string
    level: number
}

interface TableOfContentsProps {
    className?: string
    selector?: string
    maxLevel?: number
}

export function TableOfContents({
    className,
    selector = "article",
    maxLevel = 3,
}: TableOfContentsProps) {
    const [items, setItems] = useState<TOCItem[]>([])
    const [activeId, setActiveId] = useState<string>("")
    const [isOpen, setIsOpen] = useState(true)

    useEffect(() => {
        const article = document.querySelector(selector)
        if (!article) return

        const headings = article.querySelectorAll("h1, h2, h3, h4, h5, h6")
        const tocItems: TOCItem[] = []

        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1))
            if (level > maxLevel) return

            const id = heading.id || `heading-${index}`
            if (!heading.id) {
                heading.id = id
            }

            tocItems.push({
                id,
                text: heading.textContent || "",
                level,
            })
        })

        setItems(tocItems)
    }, [selector, maxLevel])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            {
                rootMargin: "-20% 0% -35% 0%",
                threshold: 0.5,
            }
        )

        items.forEach((item) => {
            const element = document.getElementById(item.id)
            if (element) {
                observer.observe(element)
            }
        })

        return () => observer.disconnect()
    }, [items])

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            const top = element.getBoundingClientRect().top + window.scrollY - 100
            window.scrollTo({ top, behavior: "smooth" })
        }
    }

    if (items.length === 0) return null

    return (
        <nav
            className={cn(
                "hidden xl:block fixed right-8 top-1/4 z-40 w-64 max-h-[60vh] overflow-hidden rounded-xl border bg-card/80 backdrop-blur-lg shadow-xl transition-all",
                !isOpen && "w-12",
                className
            )}
        >
            {/* Header */}
            <div
                className="flex cursor-pointer items-center justify-between border-b px-4 py-3"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    <List className="h-4 w-4 text-primary" />
                    {isOpen && <span className="font-medium text-sm">სარჩევი</span>}
                </div>
                <ChevronRight
                    className={cn(
                        "h-4 w-4 transition-transform",
                        isOpen && "rotate-90"
                    )}
                />
            </div>

            {/* Items */}
            {isOpen && (
                <div className="max-h-[calc(60vh-50px)] overflow-auto p-3">
                    <ul className="space-y-1">
                        {items.map((item) => (
                            <li
                                key={item.id}
                                style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                            >
                                <button
                                    onClick={() => scrollToHeading(item.id)}
                                    className={cn(
                                        "block w-full rounded-lg px-3 py-2 text-left text-sm transition-all hover:bg-secondary",
                                        activeId === item.id
                                            ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <span className="line-clamp-2">{item.text}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Progress indicator */}
            {isOpen && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
                    <div
                        className="h-full bg-primary transition-all duration-200"
                        style={{
                            width: `${items.length > 0
                                    ? ((items.findIndex((item) => item.id === activeId) + 1) /
                                        items.length) *
                                    100
                                    : 0
                                }%`,
                        }}
                    />
                </div>
            )}
        </nav>
    )
}

// Compact inline TOC for mobile
export function TableOfContentsMobile({
    className,
    selector = "article",
}: {
    className?: string
    selector?: string
}) {
    const [items, setItems] = useState<TOCItem[]>([])
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const article = document.querySelector(selector)
        if (!article) return

        const headings = article.querySelectorAll("h2, h3")
        const tocItems: TOCItem[] = []

        headings.forEach((heading, index) => {
            const id = heading.id || `heading-${index}`
            if (!heading.id) heading.id = id

            tocItems.push({
                id,
                text: heading.textContent || "",
                level: parseInt(heading.tagName.charAt(1)),
            })
        })

        setItems(tocItems)
    }, [selector])

    if (items.length === 0) return null

    return (
        <div className={cn("xl:hidden rounded-xl border bg-card p-4", className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between"
            >
                <span className="flex items-center gap-2 font-medium">
                    <List className="h-4 w-4 text-primary" />
                    სარჩევი ({items.length} სექცია)
                </span>
                <ChevronRight
                    className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")}
                />
            </button>

            {isOpen && (
                <ul className="mt-4 space-y-2 border-t pt-4">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            style={{ paddingLeft: `${(item.level - 2) * 16}px` }}
                        >
                            <a
                                href={`#${item.id}`}
                                className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.text}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

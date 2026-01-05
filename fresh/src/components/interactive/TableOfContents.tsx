"use client"

import { useState, useEffect, useCallback } from "react"
import { TbList, TbChevronRight, TbChevronDown } from "react-icons/tb"
import { cn } from "@/lib/utils"

interface TocItem {
    id: string
    text: string
    level: number
}

interface TableOfContentsProps {
    contentSelector?: string
    className?: string
    title?: string
    collapsible?: boolean
}

export function TableOfContents({
    contentSelector = "article",
    className = "",
    title = "შინაარსი",
    collapsible = true
}: TableOfContentsProps) {
    const [items, setItems] = useState<TocItem[]>([])
    const [activeId, setActiveId] = useState<string>("")
    const [isCollapsed, setIsCollapsed] = useState(false)

    // Extract headings from content
    useEffect(() => {
        const extractHeadings = () => {
            const content = document.querySelector(contentSelector)
            if (!content) return

            const headings = content.querySelectorAll("h2, h3")
            const tocItems: TocItem[] = []

            headings.forEach((heading, index) => {
                // Generate ID if not present
                if (!heading.id) {
                    heading.id = `heading-${index}`
                }

                tocItems.push({
                    id: heading.id,
                    text: heading.textContent || "",
                    level: parseInt(heading.tagName[1])
                })
            })

            setItems(tocItems)
        }

        // Small delay to ensure content is rendered
        const timer = setTimeout(extractHeadings, 100)
        return () => clearTimeout(timer)
    }, [contentSelector])

    // Track active heading on scroll
    useEffect(() => {
        if (items.length === 0) return

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
                threshold: 0
            }
        )

        items.forEach((item) => {
            const element = document.getElementById(item.id)
            if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [items])

    const scrollToHeading = useCallback((id: string) => {
        const element = document.getElementById(id)
        if (element) {
            const offset = 100 // Account for fixed header
            const top = element.getBoundingClientRect().top + window.scrollY - offset
            window.scrollTo({ top, behavior: "smooth" })
        }
    }, [])

    if (items.length === 0) return null

    return (
        <nav className={cn("bg-card border border-border rounded-xl p-4 shadow-lg", className)}>
            {/* Header */}
            <button
                onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
                className={cn(
                    "flex items-center justify-between w-full text-sm font-semibold text-foreground mb-3",
                    collapsible && "cursor-pointer hover:text-primary transition-colors"
                )}
            >
                <div className="flex items-center gap-2">
                    <TbList className="w-4 h-4" />
                    <span>{title}</span>
                </div>
                {collapsible && (
                    isCollapsed
                        ? <TbChevronRight className="w-4 h-4" />
                        : <TbChevronDown className="w-4 h-4" />
                )}
            </button>

            {/* Items */}
            <div className={cn(
                "space-y-1 overflow-hidden transition-all duration-300",
                isCollapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"
            )}>
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollToHeading(item.id)}
                        className={cn(
                            "block w-full text-left text-sm py-1.5 px-3 rounded-lg transition-all duration-200",
                            item.level === 3 && "pl-6",
                            activeId === item.id
                                ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                    >
                        <span className="line-clamp-1">{item.text}</span>
                    </button>
                ))}
            </div>

            {/* Progress indicator */}
            <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{items.findIndex(i => i.id === activeId) + 1} / {items.length}</span>
                    <span className="text-primary font-medium">
                        {Math.round(((items.findIndex(i => i.id === activeId) + 1) / items.length) * 100)}%
                    </span>
                </div>
            </div>
        </nav>
    )
}

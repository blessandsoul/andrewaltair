"use client"

import { useEffect, useCallback } from "react"
import Link from "next/link"
import { TbChevronLeft, TbChevronRight } from "react-icons/tb"
import { cn } from "@/lib/utils"

interface PostNavigationProps {
    prevPost?: {
        slug: string
        title: string
    } | null
    nextPost?: {
        slug: string
        title: string
    } | null
    className?: string
    enableKeyboard?: boolean
}

export function PostNavigation({
    prevPost,
    nextPost,
    className = "",
    enableKeyboard = true
}: PostNavigationProps) {
    // TbKeyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Ignore if user is typing in an input
        if (
            document.activeElement?.tagName === "INPUT" ||
            document.activeElement?.tagName === "TEXTAREA" ||
            document.activeElement?.getAttribute("contenteditable") === "true"
        ) {
            return
        }

        if (e.key === "ArrowLeft" && prevPost) {
            window.location.href = `/blog/${prevPost.slug}`
        } else if (e.key === "ArrowRight" && nextPost) {
            window.location.href = `/blog/${nextPost.slug}`
        }
    }, [prevPost, nextPost])

    useEffect(() => {
        if (!enableKeyboard) return
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [enableKeyboard, handleKeyDown])

    if (!prevPost && !nextPost) return null

    return (
        <nav className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", className)}>
            {/* Previous post */}
            {prevPost ? (
                <Link
                    href={`/blog/${prevPost.slug}`}
                    className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                        <TbChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                            <span>წინა სტატია</span>
                            {enableKeyboard && (
                                <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">←</kbd>
                            )}
                        </div>
                        <div className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                            {prevPost.title}
                        </div>
                    </div>
                </Link>
            ) : (
                <div />
            )}

            {/* Next post */}
            {nextPost ? (
                <Link
                    href={`/blog/${nextPost.slug}`}
                    className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 text-right sm:col-start-2"
                >
                    <div className="min-w-0 flex-1">
                        <div className="text-xs text-muted-foreground mb-0.5 flex items-center justify-end gap-1">
                            {enableKeyboard && (
                                <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">→</kbd>
                            )}
                            <span>შემდეგი სტატია</span>
                        </div>
                        <div className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                            {nextPost.title}
                        </div>
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                        <TbChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                </Link>
            ) : (
                <div />
            )}
        </nav>
    )
}


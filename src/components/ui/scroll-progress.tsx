"use client"

import { useEffect, useState } from "react"

export function ScrollProgress() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
            const scrolled = window.scrollY
            const percentage = (scrolled / scrollHeight) * 100
            setProgress(Math.min(100, Math.max(0, percentage)))
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
            <div
                className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    )
}

// Back to top button
export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 500)
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-24 right-4 z-40 w-11 h-11 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transition-all duration-300 ease-out hover:scale-110 hover:shadow-xl ${isVisible
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
            aria-label="Back to top"
        >
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
            </svg>
        </button>
    )
}

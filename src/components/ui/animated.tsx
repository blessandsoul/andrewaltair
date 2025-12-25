"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedCardProps {
    children: React.ReactNode
    className?: string
    delay?: number
    animation?: "fade-up" | "fade-left" | "fade-right" | "scale" | "blur"
}

export function AnimatedCard({
    children,
    className,
    delay = 0,
    animation = "fade-up"
}: AnimatedCardProps) {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay)
                    observer.unobserve(entry.target)
                }
            },
            { threshold: 0.1, rootMargin: "50px" }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [delay])

    const animations = {
        "fade-up": {
            initial: "opacity-0 translate-y-8",
            visible: "opacity-100 translate-y-0"
        },
        "fade-left": {
            initial: "opacity-0 -translate-x-8",
            visible: "opacity-100 translate-x-0"
        },
        "fade-right": {
            initial: "opacity-0 translate-x-8",
            visible: "opacity-100 translate-x-0"
        },
        "scale": {
            initial: "opacity-0 scale-95",
            visible: "opacity-100 scale-100"
        },
        "blur": {
            initial: "opacity-0 blur-sm",
            visible: "opacity-100 blur-0"
        }
    }

    const anim = animations[animation]

    return (
        <div
            ref={ref}
            className={cn(
                "transition-all duration-700 ease-out",
                isVisible ? anim.visible : anim.initial,
                className
            )}
        >
            {children}
        </div>
    )
}

// Staggered animation container
interface StaggerContainerProps {
    children: React.ReactNode
    className?: string
    staggerDelay?: number
}

export function StaggerContainer({
    children,
    className,
    staggerDelay = 100
}: StaggerContainerProps) {
    return (
        <div className={className} style={{ "--stagger-delay": `${staggerDelay}ms` } as React.CSSProperties}>
            {children}
        </div>
    )
}

// Counter animation
interface AnimatedCounterProps {
    value: number
    duration?: number
    className?: string
}

export function AnimatedCounter({
    value,
    duration = 2000,
    className
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(entry.target)
                }
            },
            { threshold: 0.5 }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible) return

        let start = 0
        const increment = value / (duration / 16)

        const timer = setInterval(() => {
            start += increment
            if (start >= value) {
                setCount(value)
                clearInterval(timer)
            } else {
                setCount(Math.floor(start))
            }
        }, 16)

        return () => clearInterval(timer)
    }, [isVisible, value, duration])

    // Format number
    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
        if (num >= 1000) return (num / 1000).toFixed(1) + "K"
        return num.toLocaleString()
    }

    return (
        <span ref={ref} className={className}>
            {formatNumber(count)}
        </span>
    )
}

// Typewriter effect
interface TypewriterProps {
    text: string
    speed?: number
    className?: string
    onComplete?: () => void
}

export function Typewriter({
    text,
    speed = 50,
    className,
    onComplete
}: TypewriterProps) {
    const [displayText, setDisplayText] = useState("")
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(entry.target)
                }
            },
            { threshold: 0.5 }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible) return

        let index = 0
        const timer = setInterval(() => {
            if (index < text.length) {
                setDisplayText(text.slice(0, index + 1))
                index++
            } else {
                clearInterval(timer)
                onComplete?.()
            }
        }, speed)

        return () => clearInterval(timer)
    }, [isVisible, text, speed, onComplete])

    return (
        <span ref={ref} className={className}>
            {displayText}
            <span className="animate-pulse">|</span>
        </span>
    )
}

// Parallax wrapper
interface ParallaxProps {
    children: React.ReactNode
    speed?: number
    className?: string
}

export function Parallax({
    children,
    speed = 0.5,
    className
}: ParallaxProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect()
                const scrolled = window.innerHeight - rect.top
                setOffset(scrolled * speed * 0.1)
            }
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [speed])

    return (
        <div
            ref={ref}
            className={className}
            style={{ transform: `translateY(${offset}px)` }}
        >
            {children}
        </div>
    )
}

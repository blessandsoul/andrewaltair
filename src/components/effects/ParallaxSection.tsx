"use client"

import { useRef, useEffect, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ParallaxSectionProps {
    children: ReactNode
    className?: string
    speed?: number
    direction?: "up" | "down"
}

export function ParallaxSection({
    children,
    className,
    speed = 0.5,
    direction = "up",
}: ParallaxSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        const handleScroll = () => {
            const rect = section.getBoundingClientRect()
            const scrolled = window.scrollY
            const sectionTop = rect.top + scrolled
            const offset = (scrolled - sectionTop) * speed
            const translateY = direction === "up" ? -offset : offset

            section.style.transform = `translateY(${translateY}px)`
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [speed, direction])

    return (
        <div ref={sectionRef} className={cn("will-change-transform", className)}>
            {children}
        </div>
    )
}

// Parallax Image that moves slower than scroll
export function ParallaxImage({
    src,
    alt,
    className,
    speed = 0.3,
}: {
    src: string
    alt: string
    className?: string
    speed?: number
}) {
    const imageRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const image = imageRef.current
        if (!image) return

        const handleScroll = () => {
            const rect = image.getBoundingClientRect()
            const windowHeight = window.innerHeight
            const visible = rect.top < windowHeight && rect.bottom > 0

            if (visible) {
                const centerOffset = rect.top - windowHeight / 2
                const translateY = centerOffset * speed
                image.style.transform = `translateY(${translateY}px) scale(1.1)`
            }
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        handleScroll()
        return () => window.removeEventListener("scroll", handleScroll)
    }, [speed])

    return (
        <div className={cn("overflow-hidden", className)}>
            <div
                ref={imageRef}
                className="h-full w-full bg-cover bg-center will-change-transform"
                style={{ backgroundImage: `url(${src})` }}
                aria-label={alt}
            />
        </div>
    )
}

// Fade In on Scroll
export function FadeInOnScroll({
    children,
    className,
    delay = 0,
    direction = "up",
}: {
    children: ReactNode
    className?: string
    delay?: number
    direction?: "up" | "down" | "left" | "right"
}) {
    const elementRef = useRef<HTMLDivElement>(null)

    const directionStyles = {
        up: "translate-y-10",
        down: "-translate-y-10",
        left: "translate-x-10",
        right: "-translate-x-10",
    }

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            element.classList.remove("opacity-0", directionStyles[direction])
                            element.classList.add("opacity-100", "translate-x-0", "translate-y-0")
                        }, delay)
                    }
                })
            },
            { threshold: 0.1 }
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [delay, direction])

    return (
        <div
            ref={elementRef}
            className={cn(
                "opacity-0 transition-all duration-700 ease-out",
                directionStyles[direction],
                className
            )}
        >
            {children}
        </div>
    )
}

// Scroll-triggered Counter
export function ScrollCounter({
    target,
    duration = 2000,
    className,
    suffix = "",
}: {
    target: number
    duration?: number
    className?: string
    suffix?: string
}) {
    const counterRef = useRef<HTMLSpanElement>(null)
    const hasAnimated = useRef(false)

    useEffect(() => {
        const element = counterRef.current
        if (!element) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true

                    const startTime = Date.now()
                    const animate = () => {
                        const elapsed = Date.now() - startTime
                        const progress = Math.min(elapsed / duration, 1)
                        const eased = 1 - Math.pow(1 - progress, 3) // Ease out cubic
                        const current = Math.floor(target * eased)

                        element.textContent = current.toLocaleString() + suffix

                        if (progress < 1) {
                            requestAnimationFrame(animate)
                        }
                    }

                    animate()
                }
            },
            { threshold: 0.5 }
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [target, duration, suffix])

    return (
        <span ref={counterRef} className={cn("tabular-nums", className)}>
            0{suffix}
        </span>
    )
}

"use client"

import { ReactNode, useEffect, useState, createContext, useContext } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface PageTransitionContextType {
    isTransitioning: boolean
    direction: "in" | "out"
}

const PageTransitionContext = createContext<PageTransitionContextType>({
    isTransitioning: false,
    direction: "in",
})

export function usePageTransition() {
    return useContext(PageTransitionContext)
}

// Page transition wrapper
export function PageTransitionProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [displayChildren, setDisplayChildren] = useState(children)
    const [direction, setDirection] = useState<"in" | "out">("in")

    useEffect(() => {
        // Start exit animation
        setDirection("out")
        setIsTransitioning(true)

        const timer = setTimeout(() => {
            setDisplayChildren(children)
            setDirection("in")

            setTimeout(() => {
                setIsTransitioning(false)
            }, 300)
        }, 300)

        return () => clearTimeout(timer)
    }, [pathname, children])

    return (
        <PageTransitionContext.Provider value={{ isTransitioning, direction }}>
            <div
                className={cn(
                    "transition-all duration-300 ease-out",
                    direction === "out" && "opacity-0 translate-y-4",
                    direction === "in" && !isTransitioning && "opacity-100 translate-y-0"
                )}
            >
                {displayChildren}
            </div>
        </PageTransitionContext.Provider>
    )
}

// Slide transition variant
export function SlideTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(false)
        const timer = setTimeout(() => setMounted(true), 50)
        return () => clearTimeout(timer)
    }, [pathname])

    return (
        <div
            className={cn(
                "transition-all duration-500 ease-out",
                mounted
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-8"
            )}
        >
            {children}
        </div>
    )
}

// Fade transition variant
export function FadeTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(false)
        const timer = setTimeout(() => setMounted(true), 50)
        return () => clearTimeout(timer)
    }, [pathname])

    return (
        <div
            className={cn(
                "transition-opacity duration-500 ease-out",
                mounted ? "opacity-100" : "opacity-0"
            )}
        >
            {children}
        </div>
    )
}

// Scale transition variant
export function ScaleTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(false)
        const timer = setTimeout(() => setMounted(true), 50)
        return () => clearTimeout(timer)
    }, [pathname])

    return (
        <div
            className={cn(
                "transition-all duration-500 ease-out",
                mounted
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95"
            )}
        >
            {children}
        </div>
    )
}

// Stagger children animation
export function StaggerChildren({
    children,
    className,
    staggerDelay = 100,
}: {
    children: ReactNode
    className?: string
    staggerDelay?: number
}) {
    return (
        <div
            className={cn("stagger-container", className)}
            style={{
                ["--stagger-delay" as string]: `${staggerDelay}ms`,
            }}
        >
            {children}
        </div>
    )
}

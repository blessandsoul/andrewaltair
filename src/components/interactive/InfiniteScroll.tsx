"use client"

import { useState, useEffect, useRef, useCallback, ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Loader2, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InfiniteScrollProps<T> {
    items: T[]
    renderItem: (item: T, index: number) => ReactNode
    loadMore: () => Promise<T[]>
    hasMore: boolean
    className?: string
    threshold?: number
    pageSize?: number
}

// Infinite scroll with position save
export function InfiniteScroll<T>({
    items,
    renderItem,
    loadMore,
    hasMore,
    className,
    threshold = 300,
}: InfiniteScrollProps<T>) {
    const [isLoading, setIsLoading] = useState(false)
    const [allItems, setAllItems] = useState<T[]>(items)
    const observerRef = useRef<IntersectionObserver | null>(null)
    const loadMoreRef = useRef<HTMLDivElement>(null)

    // Save scroll position
    useEffect(() => {
        const savedPosition = sessionStorage.getItem("scroll-position")
        if (savedPosition) {
            requestAnimationFrame(() => {
                window.scrollTo(0, parseInt(savedPosition))
                sessionStorage.removeItem("scroll-position")
            })
        }
    }, [])

    // Save position before leaving page
    useEffect(() => {
        const handleScroll = () => {
            sessionStorage.setItem("scroll-position", window.scrollY.toString())
        }

        const debouncedScroll = debounce(handleScroll, 100)
        window.addEventListener("scroll", debouncedScroll)

        return () => {
            window.removeEventListener("scroll", debouncedScroll)
        }
    }, [])

    // Intersection observer for infinite loading
    useEffect(() => {
        if (!hasMore || isLoading) return

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    handleLoadMore()
                }
            },
            { rootMargin: `${threshold}px` }
        )

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current)
        }

        return () => {
            observerRef.current?.disconnect()
        }
    }, [hasMore, isLoading, threshold])

    const handleLoadMore = async () => {
        if (isLoading || !hasMore) return

        setIsLoading(true)
        try {
            const newItems = await loadMore()
            setAllItems((prev) => [...prev, ...newItems])
        } catch (error) {
            console.error("Error loading more items:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={className}>
            {allItems.map((item, index) => renderItem(item, index))}

            {/* Load more trigger */}
            <div ref={loadMoreRef} className="py-8 flex justify-center">
                {isLoading && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>იტვირთება...</span>
                    </div>
                )}

                {!hasMore && allItems.length > 0 && (
                    <p className="text-muted-foreground text-sm">
                        ყველა ელემენტი ნაჩვენებია
                    </p>
                )}
            </div>
        </div>
    )
}

// Back to top button
export function BackToTop({ threshold = 400 }: { threshold?: number }) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > threshold)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [threshold])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    if (!isVisible) return null

    return (
        <Button
            size="icon"
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 rounded-full shadow-lg animate-in slide-in-from-bottom-4"
        >
            <ArrowUp className="h-5 w-5" />
        </Button>
    )
}

// Hook for infinite scroll
export function useInfiniteScroll<T>(
    fetchItems: (page: number) => Promise<{ items: T[]; hasMore: boolean }>,
    initialItems: T[] = []
) {
    const [items, setItems] = useState<T[]>(initialItems)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return []

        setIsLoading(true)
        setError(null)

        try {
            const result = await fetchItems(page + 1)
            setItems((prev) => [...prev, ...result.items])
            setHasMore(result.hasMore)
            setPage((p) => p + 1)
            return result.items
        } catch (err) {
            setError(err as Error)
            return []
        } finally {
            setIsLoading(false)
        }
    }, [fetchItems, page, isLoading, hasMore])

    const reset = useCallback(() => {
        setItems(initialItems)
        setPage(1)
        setHasMore(true)
        setError(null)
    }, [initialItems])

    return {
        items,
        loadMore,
        hasMore,
        isLoading,
        error,
        reset,
    }
}

// Simple pagination component
export function LoadMoreButton({
    onClick,
    isLoading,
    hasMore,
}: {
    onClick: () => void
    isLoading: boolean
    hasMore: boolean
}) {
    if (!hasMore) return null

    return (
        <div className="flex justify-center py-8">
            <Button
                variant="outline"
                size="lg"
                onClick={onClick}
                disabled={isLoading}
                className="gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        იტვირთება...
                    </>
                ) : (
                    "მეტის ჩატვირთვა"
                )}
            </Button>
        </div>
    )
}

// Debounce utility
function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn(...args), delay)
    }
}

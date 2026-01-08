"use client"

import * as React from "react"
import Link from "next/link"
import { TbSearch, TbCommand, TbBook, TbLock, TbClock, TbX } from "react-icons/tb"
import { Badge } from "@/components/ui/badge"

interface SearchResult {
    _id: string
    slug: string
    title: string
    excerpt: string
    isFree: boolean
    difficulty: string
    estimatedMinutes: number
    sectionId: {
        title: string
        slug: string
        gradientFrom?: string
        gradientTo?: string
    }
    categoryId: {
        title: string
        icon: string
    }
}

interface EncyclopediaSearchProps {
    isOpen: boolean
    onClose: () => void
}

export function EncyclopediaSearch({ isOpen, onClose }: EncyclopediaSearchProps) {
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Focus input when opened
    React.useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
        } else {
            setQuery("")
            setResults([])
        }
    }, [isOpen])

    // Keyboard shortcuts
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose()
            }
        }
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown)
            return () => window.removeEventListener("keydown", handleKeyDown)
        }
    }, [isOpen, onClose])

    // Search API
    React.useEffect(() => {
        if (query.length < 2) {
            setResults([])
            return
        }

        const debounce = setTimeout(async () => {
            setIsLoading(true)
            try {
                const res = await fetch(`/api/encyclopedia/search?q=${encodeURIComponent(query)}&limit=10`)
                if (res.ok) {
                    const data = await res.json()
                    setResults(data.articles || [])
                }
            } catch (error) {
                console.error("Search error:", error)
            } finally {
                setIsLoading(false)
            }
        }, 300)

        return () => clearTimeout(debounce)
    }, [query])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-start justify-center pt-[10vh]">
            <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden mx-4">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                    <TbSearch className="w-5 h-5 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="ძიება ენციკლოპედიაში..."
                        className="flex-1 bg-transparent outline-none text-lg"
                    />
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                        <button onClick={onClose} className="p-1 hover:bg-muted rounded">
                            <TbX className="w-5 h-5 text-muted-foreground" />
                        </button>
                    )}
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {query.length < 2 ? (
                        <div className="p-6 text-center text-muted-foreground">
                            <TbBook className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>ჩაწერე მინიმუმ 2 სიმბოლო ძიებისთვის</p>
                            <p className="text-sm mt-2 flex items-center justify-center gap-2">
                                <TbCommand className="w-4 h-4" />
                                <span>Cmd+K გახსნა/დახურვა</span>
                            </p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="p-2">
                            {results.map((result) => (
                                <Link
                                    key={result._id}
                                    href={`/encyclopedia/${result.sectionId?.slug || 'unknown'}/${result.slug}`}
                                    onClick={onClose}
                                    className="flex flex-col gap-1 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{result.categoryId?.icon || '📚'}</span>
                                        <span className="font-medium flex-1">{result.title}</span>
                                        {!result.isFree && (
                                            <TbLock className="w-4 h-4 text-amber-500" />
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {result.excerpt}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-xs">
                                            {result.sectionId?.title}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <TbClock className="w-3 h-3" />
                                            {result.estimatedMinutes} წთ
                                        </span>
                                        <Badge variant="secondary" className="text-xs">
                                            {result.difficulty === 'beginner' ? 'დამწყები' :
                                                result.difficulty === 'intermediate' ? 'საშუალო' : 'მოწინავე'}
                                        </Badge>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">
                            <p>შედეგები ვერ მოიძებნა &quot;{query}&quot;</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-border p-3 flex items-center justify-between text-xs text-muted-foreground bg-muted/30">
                    <span className="flex items-center gap-2">
                        <kbd className="bg-background px-1.5 py-0.5 rounded">↑↓</kbd>
                        ნავიგაცია
                    </span>
                    <span className="flex items-center gap-2">
                        <kbd className="bg-background px-1.5 py-0.5 rounded">↵</kbd>
                        გახსნა
                    </span>
                    <span className="flex items-center gap-2">
                        <kbd className="bg-background px-1.5 py-0.5 rounded">ESC</kbd>
                        დახურვა
                    </span>
                </div>
            </div>
            <div className="fixed inset-0 -z-10" onClick={onClose} />
        </div>
    )
}

// Hook for keyboard shortcut
export function useEncyclopediaSearch() {
    const [isOpen, setIsOpen] = React.useState(false)

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault()
                setIsOpen(prev => !prev)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    return {
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
    }
}

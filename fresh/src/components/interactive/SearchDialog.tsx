"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Search,
    X,
    FileText,
    Video,
    Wrench,
    ArrowRight,
    Clock,
    Sparkles,
    Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchDialogProps {
    isOpen: boolean
    onClose: () => void
}

type SearchResult = {
    id: string
    title: string
    description: string
    type: "post" | "video" | "tool"
    url: string
    category?: string
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const router = useRouter()

    // Focus on open
    React.useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isOpen])

    // Close on escape
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [onClose])

    // Search logic with API calls
    React.useEffect(() => {
        if (query.length < 2) {
            setResults([])
            return
        }

        const searchTimeout = setTimeout(async () => {
            setIsSearching(true)

            try {
                // Use unified search API
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`)

                if (res.ok) {
                    const data = await res.json()
                    const searchResults: SearchResult[] = (data.results || []).map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        type: item.type,
                        url: item.url,
                        category: item.category
                    }))
                    setResults(searchResults)
                } else {
                    setResults([])
                }
            } catch (error) {
                console.error('Search error:', error)
                setResults([])
            }

            setIsSearching(false)
        }, 300) // Debounce 300ms

        return () => clearTimeout(searchTimeout)
    }, [query])

    const handleSelect = (url: string) => {
        onClose()
        setQuery("")
        if (url.startsWith("http")) {
            window.open(url, "_blank")
        } else {
            router.push(url)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative max-w-2xl mx-auto mt-20 px-4">
                <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 p-4 border-b border-border">
                        <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <Input
                            ref={inputRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="მოძებნე სტატია, ვიდეო, ინსტრუმენტი..."
                            className="border-0 bg-transparent text-lg focus-visible:ring-0 px-0"
                        />
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Results */}
                    <div className="max-h-96 overflow-y-auto">
                        {query.length < 2 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                <p>ჩაწერე მინიმუმ 2 სიმბოლო</p>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <p>ვერაფერი მოიძებნა: "{query}"</p>
                            </div>
                        ) : (
                            <div className="p-2">
                                {results.map((result) => (
                                    <button
                                        key={`${result.type}-${result.id}`}
                                        onClick={() => handleSelect(result.url)}
                                        className="w-full flex items-start gap-4 p-3 rounded-xl hover:bg-secondary transition-colors text-left"
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                            result.type === "post" && "bg-primary/10 text-primary",
                                            result.type === "video" && "bg-red-500/10 text-red-500",
                                            result.type === "tool" && "bg-accent/10 text-accent"
                                        )}>
                                            {result.type === "post" && <FileText className="w-5 h-5" />}
                                            {result.type === "video" && <Video className="w-5 h-5" />}
                                            {result.type === "tool" && <Wrench className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium truncate">{result.title}</h4>
                                                <Badge variant="secondary" className="text-xs flex-shrink-0">
                                                    {result.type === "post" ? "სტატია" :
                                                        result.type === "video" ? "ვიდეო" : "ინსტრუმენტი"}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {result.description}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-3" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
                        <span>ESC გასათიშად</span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            სწრაფი ძებნა
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Hook for keyboard shortcut
export function useSearchDialog() {
    const [isOpen, setIsOpen] = React.useState(false)

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault()
                setIsOpen(true)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    return {
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false)
    }
}

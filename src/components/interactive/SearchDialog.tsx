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
    Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import postsData from "@/data/posts.json"
import videosData from "@/data/videos.json"
import toolsData from "@/data/tools.json"
import { handleSmartSearch } from '@/app/actions/search'

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

    // Search logic
    React.useEffect(() => {
        if (query.length < 2) {
            setResults([])
            return
        }

        const q = query.toLowerCase()
        const searchResults: SearchResult[] = []

        // Search posts
        postsData.forEach((post) => {
            if (
                post.title.toLowerCase().includes(q) ||
                post.excerpt.toLowerCase().includes(q) ||
                post.tags.some(t => t.toLowerCase().includes(q))
            ) {
                searchResults.push({
                    id: post.id,
                    title: post.title,
                    description: post.excerpt,
                    type: "post",
                    url: `/blog/${post.slug}`,
                    category: post.category
                })
            }
        })

        // Search videos
        videosData.forEach((video) => {
            if (
                video.title.toLowerCase().includes(q) ||
                video.description.toLowerCase().includes(q)
            ) {
                searchResults.push({
                    id: video.id,
                    title: video.title,
                    description: video.description,
                    type: "video",
                    url: `/videos`,
                    category: video.category
                })
            }
        })

        // Search tools
        toolsData.forEach((tool) => {
            if (
                tool.name.toLowerCase().includes(q) ||
                tool.description.toLowerCase().includes(q) ||
                tool.category.toLowerCase().includes(q)
            ) {
                searchResults.push({
                    id: tool.id,
                    title: tool.name,
                    description: tool.description,
                    type: "tool",
                    url: tool.url,
                    category: tool.category
                })
            }
        })

        setResults(searchResults.slice(0, 8))
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
                        <form action={handleSmartSearch} className="flex-1">
                            <Input
                                ref={inputRef}
                                name="query"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="მოძებნე სტატია, ან შეიყვანე კოდი (მაგ: #GE01)..."
                                className="border-0 bg-transparent text-lg focus-visible:ring-0 px-0 w-full"
                                autoComplete="off"
                            />
                        </form>
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

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    TbCommandDialog,
    TbCommandEmpty,
    TbCommandGroup,
    TbCommandInput,
    TbCommandItem,
    TbCommandList,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { TbFileText, TbVideo, TbTool, TbLoader2 } from "react-icons/tb"
import { handleSmartSearch } from "@/app/actions/search"

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
    image?: string
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<SearchResult[]>([])
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        if (!query) {
            setResults([])
            return
        }

        const debounce = setTimeout(async () => {
            setLoading(true)
            try {
                const visitorId = localStorage.getItem('visitor_id') || ''
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`, {
                    headers: {
                        'x-visitor-id': visitorId
                    }
                })
                if (res.ok) {
                    const data = await res.json()
                    setResults(data.results || [])
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => clearTimeout(debounce)
    }, [query])

    const handleSelect = (url: string) => {
        onClose()
        if (url.startsWith("http")) {
            window.open(url, "_blank")
        } else {
            router.push(url)
        }
    }

    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            if (/^\d{6}$/.test(query)) {
                e.preventDefault()
                const formData = new FormData()
                formData.append("query", query)
                await handleSmartSearch(formData)
            }
        }
    }

    return (
        <TbCommandDialog open={isOpen} onOpenChange={onClose} shouldFilter={false}>
            <TbCommandInput
                placeholder="TbSearch articles, tools, or type ID..."
                value={query}
                onValueChange={setQuery}
                onKeyDown={handleKeyDown}
            />
            <TbCommandList>
                <TbCommandEmpty>No results found.</TbCommandEmpty>
                {loading && (
                    <div className="py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                        <TbLoader2 className="w-4 h-4 animate-spin" />
                        Searching...
                    </div>
                )}
                {!loading && results.length > 0 && (
                    <TbCommandGroup heading="Results">
                        {results.map((result) => (
                            <TbCommandItem
                                key={result.id + result.type}
                                value={result.id + result.type + result.title}
                                onSelect={() => handleSelect(result.url)}
                                onMouseDown={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleSelect(result.url)
                                }}
                                className="flex items-center gap-4 p-2 cursor-pointer"
                            >
                                {result.image ? (
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-secondary border border-border/50">
                                        <img
                                            src={result.image}
                                            alt={result.title}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0 border border-border/50">
                                        {result.type === "post" && <TbFileText className="w-6 h-6 text-muted-foreground" />}
                                        {result.type === "video" && <TbVideo className="w-6 h-6 text-muted-foreground" />}
                                        {result.type === "tool" && <TbTool className="w-6 h-6 text-muted-foreground" />}
                                    </div>
                                )}

                                <div
                                    className="flex flex-col gap-1 overflow-hidden flex-1"
                                    onClick={() => handleSelect(result.url)}
                                >
                                    <span className="font-medium truncate">{result.title}</span>
                                    {result.description && (
                                        <span className="text-xs text-muted-foreground truncate">{result.description}</span>
                                    )}
                                </div>

                                <div className="ml-auto flex flex-col items-end gap-1">
                                    <Badge variant="secondary" className="text-[10px] capitalize px-1.5 h-5">
                                        {result.type}
                                    </Badge>
                                </div>
                            </TbCommandItem>
                        ))}
                    </TbCommandGroup>
                )}
            </TbCommandList>
        </TbCommandDialog>
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

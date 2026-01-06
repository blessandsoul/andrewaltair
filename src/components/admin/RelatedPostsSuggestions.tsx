"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TbPlus, TbX, TbRefresh, TbLoader2, TbExternalLink, TbLink } from "react-icons/tb"
import Link from "next/link"

interface RelatedPost {
    slug: string
    title: string
    excerpt?: string
    coverImage?: string
    category?: string
    relevanceScore?: number
}

interface RelatedPostsSuggestionsProps {
    title: string
    tags: string[]
    category: string
    currentSlug?: string
    selectedPosts: string[]  // Array of selected slugs
    onAddPost: (slug: string) => void
    onRemovePost: (slug: string) => void
}

export function RelatedPostsSuggestions({
    title,
    tags,
    category,
    currentSlug,
    selectedPosts,
    onAddPost,
    onRemovePost
}: RelatedPostsSuggestionsProps) {
    const [suggestions, setSuggestions] = React.useState<RelatedPost[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [isExpanded, setIsExpanded] = React.useState(false)
    const [hasAutoSelected, setHasAutoSelected] = React.useState(false)

    const fetchSuggestions = React.useCallback(async (autoSelect: boolean = false) => {
        if (!title && !tags.length && !category) return

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/posts/suggest-links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    tags,
                    category,
                    excludeSlug: currentSlug
                })
            })

            if (!response.ok) throw new Error('Failed to fetch suggestions')

            const data = await response.json()
            const relatedPosts: RelatedPost[] = data.relatedPosts || []
            setSuggestions(relatedPosts)

            // Auto-select top 3 posts with at least 30% relevance (score >= 3)
            if (autoSelect && !hasAutoSelected && relatedPosts.length > 0) {
                const MIN_RELEVANCE = 3  // ~30% of max score (~10)
                const postsToAdd = relatedPosts
                    .filter(p => (p.relevanceScore || 0) >= MIN_RELEVANCE)
                    .filter(p => !selectedPosts.includes(p.slug))
                    .slice(0, 3)

                postsToAdd.forEach(p => onAddPost(p.slug))
                setHasAutoSelected(true)
            }
        } catch (e) {
            setError('რეკომენდაციების მიღება ვერ მოხერხდა')
            console.error('Suggest links error:', e)
        } finally {
            setIsLoading(false)
        }
    }, [title, tags, category, currentSlug, selectedPosts, onAddPost, hasAutoSelected])

    // Auto-fetch and auto-select when title or tags change (debounced)
    React.useEffect(() => {
        if (!title && !tags.length) return
        if (hasAutoSelected) return  // Don't re-run auto-select

        const timer = setTimeout(() => {
            if (selectedPosts.length === 0) {
                fetchSuggestions(true)  // Auto-select on first load
            }
        }, 1500)  // Wait 1.5 seconds after typing stops

        return () => clearTimeout(timer)
    }, [title, tags, category, hasAutoSelected, selectedPosts.length, fetchSuggestions])

    // Manual fetch on expand (without auto-select)
    React.useEffect(() => {
        if (isExpanded && suggestions.length === 0 && !isLoading) {
            fetchSuggestions(false)
        }
    }, [isExpanded, suggestions.length, isLoading, fetchSuggestions])

    // Filter out already selected posts
    const availableSuggestions = suggestions.filter(s => !selectedPosts.includes(s.slug))

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <TbLink className="w-4 h-4" />
                        დაკავშირებული ({selectedPosts.length})
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="h-6 px-2"
                    >
                        {isExpanded ? 'დამალვა' : 'ჩვენება'}
                    </Button>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="space-y-3">
                    {/* Selected posts */}
                    {selectedPosts.length > 0 && (
                        <div className="space-y-1.5">
                            <p className="text-xs text-muted-foreground">არჩეული:</p>
                            <div className="flex flex-wrap gap-1.5">
                                {selectedPosts.map(slug => (
                                    <Badge
                                        key={slug}
                                        variant="secondary"
                                        className="text-xs gap-1 max-w-full"
                                    >
                                        <span className="truncate">{slug}</span>
                                        <button
                                            onClick={() => onRemovePost(slug)}
                                            className="ml-0.5 hover:text-destructive"
                                        >
                                            <TbX className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Suggestions header */}
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">რეკომენდაციები:</p>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => fetchSuggestions()}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <TbLoader2 className="w-3 h-3 animate-spin" />
                            ) : (
                                <TbRefresh className="w-3 h-3" />
                            )}
                        </Button>
                    </div>

                    {/* Suggestions list */}
                    {error ? (
                        <p className="text-xs text-red-500">{error}</p>
                    ) : isLoading && suggestions.length === 0 ? (
                        <div className="py-4 text-center">
                            <TbLoader2 className="w-4 h-4 animate-spin mx-auto text-muted-foreground" />
                        </div>
                    ) : availableSuggestions.length > 0 ? (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {availableSuggestions.map((post) => (
                                <div
                                    key={post.slug}
                                    className="flex items-start gap-2 p-2 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                                >
                                    {/* Thumbnail */}
                                    {post.coverImage ? (
                                        <img
                                            src={post.coverImage}
                                            alt=""
                                            className="w-10 h-10 rounded object-cover flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                            <TbLink className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                    )}

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium line-clamp-2">{post.title}</p>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            {post.category && (
                                                <span className="text-[10px] text-muted-foreground">{post.category}</span>
                                            )}
                                            {post.relevanceScore != null && (
                                                <span className={`text-[10px] ${post.relevanceScore >= 8 ? 'text-green-500' : post.relevanceScore >= 5 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                                                    🎯 {Math.min(100, Math.round(post.relevanceScore / 15 * 100))}%
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                                        >
                                            <TbExternalLink className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => onAddPost(post.slug)}
                                        >
                                            <TbPlus className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground text-center py-2">
                            {suggestions.length > 0
                                ? 'ყველა რეკომენდაცია დამატებულია'
                                : 'შეავსეთ სათაური ან თეგები რეკომენდაციისთვის'}
                        </p>
                    )}
                </CardContent>
            )}
        </Card>
    )
}

export default RelatedPostsSuggestions

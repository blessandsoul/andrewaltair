"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Bookmark, BookmarkCheck, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BookmarkItem {
    id: string
    slug: string
    title: string
    excerpt: string
    savedAt: number
}

const STORAGE_KEY = "andrewaltair-bookmarks"

// Hook to manage bookmarks
export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            setBookmarks(JSON.parse(stored))
        }
    }, [])

    const save = (item: Omit<BookmarkItem, "savedAt">) => {
        const newBookmark: BookmarkItem = {
            ...item,
            savedAt: Date.now(),
        }
        const updated = [...bookmarks, newBookmark]
        setBookmarks(updated)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    }

    const remove = (id: string) => {
        const updated = bookmarks.filter((b) => b.id !== id)
        setBookmarks(updated)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    }

    const isBookmarked = (id: string) => {
        return bookmarks.some((b) => b.id === id)
    }

    const toggle = (item: Omit<BookmarkItem, "savedAt">) => {
        if (isBookmarked(item.id)) {
            remove(item.id)
        } else {
            save(item)
        }
    }

    return { bookmarks, save, remove, isBookmarked, toggle }
}

// Bookmark toggle button
export function BookmarkButton({
    id,
    slug,
    title,
    excerpt,
    className,
    showLabel = false,
}: {
    id: string
    slug: string
    title: string
    excerpt: string
    className?: string
    showLabel?: boolean
}) {
    const { isBookmarked, toggle } = useBookmarks()
    const [saved, setSaved] = useState(false)
    const [showToast, setShowToast] = useState(false)

    useEffect(() => {
        setSaved(isBookmarked(id))
    }, [id, isBookmarked])

    const handleClick = () => {
        toggle({ id, slug, title, excerpt })
        setSaved(!saved)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 2000)
    }

    return (
        <>
            <Button
                variant={saved ? "default" : "outline"}
                size={showLabel ? "default" : "icon"}
                className={cn(
                    "relative transition-all",
                    saved && "bg-primary text-primary-foreground",
                    className
                )}
                onClick={handleClick}
            >
                {saved ? (
                    <BookmarkCheck className="h-4 w-4" />
                ) : (
                    <Bookmark className="h-4 w-4" />
                )}
                {showLabel && (
                    <span className="ml-2">
                        {saved ? "შენახული" : "შენახვა"}
                    </span>
                )}
            </Button>

            {/* Toast notification */}
            {showToast && (
                <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in">
                    <div className="flex items-center gap-2 rounded-lg bg-card px-4 py-3 shadow-lg border">
                        {saved ? (
                            <>
                                <BookmarkCheck className="h-5 w-5 text-primary" />
                                <span>შენახულია!</span>
                            </>
                        ) : (
                            <>
                                <Bookmark className="h-5 w-5 text-muted-foreground" />
                                <span>წაშლილია შენახულიდან</span>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

// Bookmarks list sidebar/drawer
export function BookmarksList({
    isOpen,
    onClose,
}: {
    isOpen: boolean
    onClose: () => void
}) {
    const { bookmarks, remove } = useBookmarks()

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="absolute right-0 top-0 h-full w-full max-w-md animate-in slide-in-from-right bg-card shadow-2xl">
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b p-4">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Bookmark className="h-5 w-5 text-primary" />
                            შენახული სტატიები
                        </h2>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-auto p-4">
                        {bookmarks.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                                <div>
                                    <Bookmark className="mx-auto h-12 w-12 opacity-20" />
                                    <p className="mt-4">ჯერ არაფერი შენახული</p>
                                    <p className="text-sm">დააჭირე ბუკმარკის ღილაკს სტატიის შესანახად</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {bookmarks.map((bookmark) => (
                                    <div
                                        key={bookmark.id}
                                        className="group relative rounded-lg border bg-secondary/50 p-4 transition-colors hover:bg-secondary"
                                    >
                                        <a
                                            href={`/blog/${bookmark.slug}`}
                                            className="block"
                                            onClick={onClose}
                                        >
                                            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                                {bookmark.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                                {bookmark.excerpt}
                                            </p>
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                შენახულია: {new Date(bookmark.savedAt).toLocaleDateString("ka-GE")}
                                            </p>
                                        </a>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => remove(bookmark.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

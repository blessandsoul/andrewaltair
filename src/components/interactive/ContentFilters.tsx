"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Filter, X, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface FilterOption {
    id: string
    label: string
    count?: number
}

interface ContentFiltersProps {
    categories: FilterOption[]
    tags: FilterOption[]
    difficulties?: FilterOption[]
    onFilterChange: (filters: {
        categories: string[]
        tags: string[]
        difficulty?: string
        search: string
    }) => void
    className?: string
}

export function ContentFilters({
    categories,
    tags,
    difficulties = [
        { id: "beginner", label: "დამწყები", count: 0 },
        { id: "intermediate", label: "საშუალო", count: 0 },
        { id: "advanced", label: "მოწინავე", count: 0 },
    ],
    onFilterChange,
    className,
}: ContentFiltersProps) {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
    const [search, setSearch] = useState("")
    const [showAllTags, setShowAllTags] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const visibleTags = showAllTags ? tags : tags.slice(0, 8)
    const hasFilters = selectedCategories.length > 0 || selectedTags.length > 0 || selectedDifficulty || search

    const handleCategoryToggle = (id: string) => {
        const updated = selectedCategories.includes(id)
            ? selectedCategories.filter((c) => c !== id)
            : [...selectedCategories, id]
        setSelectedCategories(updated)
        onFilterChange({
            categories: updated,
            tags: selectedTags,
            difficulty: selectedDifficulty,
            search,
        })
    }

    const handleTagToggle = (id: string) => {
        const updated = selectedTags.includes(id)
            ? selectedTags.filter((t) => t !== id)
            : [...selectedTags, id]
        setSelectedTags(updated)
        onFilterChange({
            categories: selectedCategories,
            tags: updated,
            difficulty: selectedDifficulty,
            search,
        })
    }

    const handleDifficultyChange = (id: string) => {
        const updated = selectedDifficulty === id ? "" : id
        setSelectedDifficulty(updated)
        onFilterChange({
            categories: selectedCategories,
            tags: selectedTags,
            difficulty: updated,
            search,
        })
    }

    const handleSearchChange = (value: string) => {
        setSearch(value)
        onFilterChange({
            categories: selectedCategories,
            tags: selectedTags,
            difficulty: selectedDifficulty,
            search: value,
        })
    }

    const clearFilters = () => {
        setSelectedCategories([])
        setSelectedTags([])
        setSelectedDifficulty("")
        setSearch("")
        onFilterChange({ categories: [], tags: [], difficulty: "", search: "" })
    }

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Search */}
            <div>
                <label className="text-sm font-medium mb-2 block">ძიება</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="მოძებნე სტატია..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Categories */}
            <div>
                <label className="text-sm font-medium mb-2 block">კატეგორია</label>
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryToggle(cat.id)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-sm transition-colors",
                                selectedCategories.includes(cat.id)
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary hover:bg-secondary/80"
                            )}
                        >
                            {cat.label}
                            {cat.count !== undefined && (
                                <span className="ml-1 opacity-60">({cat.count})</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Difficulty */}
            <div>
                <label className="text-sm font-medium mb-2 block">სირთულე</label>
                <div className="flex gap-2">
                    {difficulties.map((diff) => (
                        <button
                            key={diff.id}
                            onClick={() => handleDifficultyChange(diff.id)}
                            className={cn(
                                "flex-1 px-3 py-2 rounded-lg text-sm text-center transition-colors border",
                                selectedDifficulty === diff.id
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-secondary/50 hover:bg-secondary border-transparent"
                            )}
                        >
                            {diff.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tags */}
            <div>
                <label className="text-sm font-medium mb-2 block">თეგები</label>
                <div className="flex flex-wrap gap-2">
                    {visibleTags.map((tag) => (
                        <button
                            key={tag.id}
                            onClick={() => handleTagToggle(tag.id)}
                            className={cn(
                                "px-2 py-1 rounded-md text-xs transition-colors border",
                                selectedTags.includes(tag.id)
                                    ? "bg-accent text-accent-foreground border-accent"
                                    : "bg-secondary/50 hover:bg-secondary border-transparent"
                            )}
                        >
                            #{tag.label}
                        </button>
                    ))}
                    {tags.length > 8 && (
                        <button
                            onClick={() => setShowAllTags(!showAllTags)}
                            className="text-xs text-primary hover:underline"
                        >
                            {showAllTags ? "ნაკლები" : `+${tags.length - 8} მეტი`}
                        </button>
                    )}
                </div>
            </div>

            {/* Clear filters */}
            {hasFilters && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="w-full"
                >
                    <X className="h-4 w-4 mr-2" />
                    ფილტრების გასუფთავება
                </Button>
            )}
        </div>
    )

    return (
        <>
            {/* Desktop */}
            <div className={cn("hidden lg:block", className)}>
                <FilterContent />
            </div>

            {/* Mobile toggle */}
            <div className="lg:hidden">
                <Button
                    variant="outline"
                    onClick={() => setIsMobileOpen(true)}
                    className="w-full gap-2"
                >
                    <Filter className="h-4 w-4" />
                    ფილტრები
                    {hasFilters && (
                        <Badge variant="secondary" className="ml-auto">
                            {selectedCategories.length + selectedTags.length + (selectedDifficulty ? 1 : 0)}
                        </Badge>
                    )}
                </Button>

                {/* Mobile drawer */}
                {isMobileOpen && (
                    <div className="fixed inset-0 z-50">
                        <div
                            className="absolute inset-0 bg-black/50"
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-card p-6 overflow-auto animate-in slide-in-from-right">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-bold text-lg">ფილტრები</h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <FilterContent />
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

// Active filters display
export function ActiveFilters({
    filters,
    onRemove,
    onClear,
}: {
    filters: { type: string; label: string; id: string }[]
    onRemove: (type: string, id: string) => void
    onClear: () => void
}) {
    if (filters.length === 0) return null

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">აქტიური:</span>
            {filters.map((filter) => (
                <Badge
                    key={`${filter.type}-${filter.id}`}
                    variant="secondary"
                    className="gap-1 pr-1"
                >
                    {filter.label}
                    <button
                        onClick={() => onRemove(filter.type, filter.id)}
                        className="ml-1 hover:bg-secondary rounded-full p-0.5"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </Badge>
            ))}
            <button
                onClick={onClear}
                className="text-xs text-primary hover:underline"
            >
                გასუფთავება
            </button>
        </div>
    )
}

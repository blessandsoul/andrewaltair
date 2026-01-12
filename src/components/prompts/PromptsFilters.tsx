"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { TbSearch } from "react-icons/tb"

interface FilterProps {
    categories: string[]
    aiModels: string[]
}

export function PromptsFilters({ categories, aiModels }: FilterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.push(`/prompts?${params.toString()}`)
    }

    return (
    return (
        <div className="w-full flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-between p-1">
            {/* Left Side: Filters */}
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                {/* Category Filter */}
                <div className="relative group">
                    <select
                        defaultValue={searchParams.get('category') || ''}
                        onChange={(e) => updateParams('category', e.target.value)}
                        className="appearance-none px-4 py-2.5 pr-10 rounded-xl bg-card border border-border/50 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer text-sm font-medium min-w-[160px]"
                    >
                        <option value="">ყველა კატეგორია</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-primary transition-colors">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                {/* AI Model Filter */}
                <div className="relative group">
                    <select
                        defaultValue={searchParams.get('aiModel') || ''}
                        onChange={(e) => updateParams('aiModel', e.target.value)}
                        className="appearance-none px-4 py-2.5 pr-10 rounded-xl bg-card border border-border/50 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer text-sm font-medium min-w-[160px]"
                    >
                        <option value="">ყველა AI მოდელი</option>
                        {aiModels.map((model) => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-primary transition-colors">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                {/* Free/Paid Filter */}
                <div className="relative group">
                    <select
                        defaultValue={searchParams.get('free') || ''}
                        onChange={(e) => updateParams('free', e.target.value)}
                        className="appearance-none px-4 py-2.5 pr-10 rounded-xl bg-card border border-border/50 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer text-sm font-medium"
                    >
                        <option value="">ყველა ფასი</option>
                        <option value="true">უფასო</option>
                        <option value="false">პრემიუმ</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-primary transition-colors">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Right Side: Sort */}
            <div className="w-full sm:w-auto mt-4 sm:mt-0">
                <div className="relative group w-full sm:w-auto">
                    <select
                        defaultValue={searchParams.get('sort') || 'createdAt'}
                        onChange={(e) => updateParams('sort', e.target.value)}
                        className="appearance-none w-full sm:w-auto px-4 py-2.5 pr-10 rounded-xl bg-card border border-border/50 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer text-sm font-medium"
                    >
                        <option value="createdAt">ახალი დამატებული</option>
                        <option value="popular">ყველაზე პოპულარული</option>
                        <option value="rating">მაღალი რეიტინგი</option>
                        <option value="price-asc">ფასი: ზრდადობით</option>
                        <option value="price-desc">ფასი: კლებადობით</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-primary transition-colors">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Active Filters Reset Button - Only show if filters are applied */}
            {(searchParams.get('category') || searchParams.get('aiModel') || searchParams.get('free') || searchParams.get('search')) && (
                <button
                    onClick={() => router.push('/prompts')}
                    className="ml-auto sm:ml-2 text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                >
                    ფილტრების გასუფთავება
                </button>
            )}
        </div>
    )
}

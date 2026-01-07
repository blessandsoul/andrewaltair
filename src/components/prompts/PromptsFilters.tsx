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
        <div className="flex flex-wrap gap-3 mb-8 p-4 rounded-xl bg-card border">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
                <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    defaultValue={searchParams.get('search') || ''}
                    placeholder="ძიება..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            updateParams('search', e.currentTarget.value)
                        }
                    }}
                />
            </div>

            {/* Category Filter */}
            <select
                defaultValue={searchParams.get('category') || ''}
                onChange={(e) => updateParams('category', e.target.value)}
                className="px-4 py-2 rounded-lg bg-background border focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
                <option value="">ყველა კატეგორია</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>

            {/* AI Model Filter */}
            <select
                defaultValue={searchParams.get('aiModel') || ''}
                onChange={(e) => updateParams('aiModel', e.target.value)}
                className="px-4 py-2 rounded-lg bg-background border focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
                <option value="">ყველა AI მოდელი</option>
                {aiModels.map((model) => (
                    <option key={model} value={model}>{model}</option>
                ))}
            </select>

            {/* Free/Paid Filter */}
            <select
                defaultValue={searchParams.get('free') || ''}
                onChange={(e) => updateParams('free', e.target.value)}
                className="px-4 py-2 rounded-lg bg-background border focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
                <option value="">ყველა ფასი</option>
                <option value="true">უფასო</option>
                <option value="false">პრემიუმ</option>
            </select>

            {/* Sort */}
            <select
                defaultValue={searchParams.get('sort') || 'createdAt'}
                onChange={(e) => updateParams('sort', e.target.value)}
                className="px-4 py-2 rounded-lg bg-background border focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
                <option value="createdAt">ახალი</option>
                <option value="popular">პოპულარული</option>
                <option value="rating">რეიტინგით</option>
                <option value="price-asc">ფასი: დაბალი → მაღალი</option>
                <option value="price-desc">ფასი: მაღალი → დაბალი</option>
            </select>
        </div>
    )
}

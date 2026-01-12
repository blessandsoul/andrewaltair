"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { TbSearch, TbX } from "react-icons/tb"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const categoryTranslations: Record<string, string> = {
    "Art": "ხელოვნება",
    "Photography": "ფოტოგრაფია",
    "Digital Art": "ციფრული ხელოვნება",
    "3D": "3D",
    "3D Model": "3D მოდელი",
    "Anime": "ანიმე",
    "Logo": "ლოგო",
    "Texture": "ტექსტურა",
    "Web Design": "ვებ დიზაინი",
    "Fashion": "მოდა",
    "Portrait": "პორტრეტი",
    "Landscape": "პეიზაჟი",
    "Architecture": "არქიტექტურა",
    "Cyberpunk": "კიბერპანკი",
    "Fantasy": "ფენტეზი",
    "Sci-Fi": "სამეცნიერო ფანტასტიკა",
    "Realistic": "რეალისტური",
    "Abstract": "აბსტრაქტული",
    "Nature": "ბუნება",
    "Animals": "ცხოველები",
    "Character": "პერსონაჟი",
    "Vehicle": "ტრანსპორტი",
    "Food": "საკვები",
    "Concept Art": "კონცეპტ არტი",
    "Illustration": "ილუსტრაცია",
    "Background": "ფონი",
    "Pattern": "პატერნი",
    "Icon": "იკონი",
    "Vector": "ვექტორი",
    "Typography": "ტიპოგრაფია",
    "Game Asset": "თამაშის ასეტი",
    "Pixel Art": "პიქსელ არტი"
}

interface FilterProps {
    categories: string[]

}

export function PromptsFilters({ categories }: FilterProps) {
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
        <div className="w-full flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-between p-1">
            {/* Left Side: Filters */}
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                {/* Category Filter */}
                <Select
                    value={searchParams.get('category') || "all"}
                    onValueChange={(value) => updateParams('category', value === "all" ? "" : value)}
                >
                    <SelectTrigger className="w-[180px] bg-card border-border/50 hover:border-primary/50 transition-colors">
                        <SelectValue placeholder="ყველა კატეგორია" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">ყველა კატეგორია</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{categoryTranslations[cat] || cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>



                {/* Free/Paid Filter */}
                <Select
                    value={searchParams.get('free') || "all"}
                    onValueChange={(value) => updateParams('free', value === "all" ? "" : value)}
                >
                    <SelectTrigger className="w-[140px] bg-card border-border/50 hover:border-primary/50 transition-colors">
                        <SelectValue placeholder="ყველა ფასი" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">ყველა ფასი</SelectItem>
                        <SelectItem value="true">უფასო</SelectItem>
                        <SelectItem value="false">პრემიუმ</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Right Side: Sort */}
            <div className="w-full sm:w-auto mt-4 sm:mt-0">
                <Select
                    value={searchParams.get('sort') || 'createdAt'}
                    onValueChange={(value) => updateParams('sort', value)}
                >
                    <SelectTrigger className="w-full sm:w-[200px] bg-card border-border/50 hover:border-primary/50 transition-colors">
                        <SelectValue placeholder="სორტირება" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt">ახალი დამატებული</SelectItem>
                        <SelectItem value="popular">ყველაზე პოპულარული</SelectItem>
                        <SelectItem value="rating">მაღალი რეიტინგი</SelectItem>
                        <SelectItem value="price-asc">ფასი: ზრდადობით</SelectItem>
                        <SelectItem value="price-desc">ფასი: კლებადობით</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Active Filters Reset Button */}
            {(searchParams.get('category') || searchParams.get('free') || searchParams.get('search')) && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/prompts')}
                    className="ml-auto sm:ml-2 text-xs text-muted-foreground hover:text-destructive gap-1 h-9 px-3"
                >
                    <TbX className="w-3.5 h-3.5" />
                    გასუფთავება
                </Button>
            )}
        </div>
    )
}

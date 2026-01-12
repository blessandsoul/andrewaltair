"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { TbSearch, TbCommand, TbArrowRight } from "react-icons/tb"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function PromptsSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')
    const [isFocused, setIsFocused] = useState(false)

    // Sync state with URL params on load/change
    useEffect(() => {
        setSearchValue(searchParams.get('search') || '')
    }, [searchParams])

    const handleSearch = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set('search', value)
        } else {
            params.delete('search')
        }
        router.push(`/prompts?${params.toString()}`)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch(searchValue)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`
                relative w-full max-w-2xl mx-auto
                transition-all duration-300
                ${isFocused ? 'scale-105 transform' : ''}
            `}
        >
            <div className={`
                relative flex items-center gap-2
                p-2
                bg-background/80 backdrop-blur-xl
                border rounded-2xl
                transition-colors duration-300
                ${isFocused ? 'border-primary ring-2 ring-primary/20' : 'border-border/50 hover:border-border'}
            `}>
                <div className="pl-3 text-muted-foreground">
                    <TbSearch className={`w-5 h-5 transition-colors ${isFocused ? 'text-primary' : ''}`} />
                </div>

                <Input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="რას ეძებთ? მაგ: 'Cyberpunk City'..."
                    className="flex-1 border-none shadow-none focus-visible:ring-0 bg-transparent text-lg h-auto py-2 placeholder:text-muted-foreground/50"
                />

                <div className="flex items-center gap-2 pr-2">
                    <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-border/50">
                        <TbCommand className="w-3 h-3" />
                        <span>K</span>
                    </div>
                    <Button
                        size="icon"
                        onClick={() => handleSearch(searchValue)}
                        className={`
                            h-10 w-10 rounded-xl transition-all duration-300
                            ${searchValue ? '' : 'bg-muted text-muted-foreground hover:bg-muted/80'}
                        `}
                        variant={searchValue ? "default" : "ghost"}
                    >
                        <TbArrowRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Quick Suggestions */}
            {isFocused && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 p-1 bg-popover/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                    <div className="p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">პოპულარული ძიებები</div>
                    <div className="flex flex-wrap gap-2 p-2 pt-0">
                        {['Logo Design', 'Anime Portrait', 'Interior Design', 'Web UI', 'Isometric 3D'].map((tag) => (
                            <Button
                                key={tag}
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    setSearchValue(tag)
                                    handleSearch(tag)
                                }}
                                className="h-8 text-xs font-normal"
                            >
                                {tag}
                            </Button>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}

"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { TbSearch, TbCommand } from "react-icons/tb"
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
                relative flex items-center
                bg-background/80 backdrop-blur-xl
                border-2 rounded-2xl overflow-hidden
                transition-colors duration-300
                ${isFocused ? 'border-primary shadow-[0_0_40px_-10px_rgba(var(--primary-rgb),0.3)]' : 'border-white/10 hover:border-white/20'}
            `}>
                <div className="pl-5 text-muted-foreground">
                    <TbSearch className={`w-6 h-6 transition-colors ${isFocused ? 'text-primary' : ''}`} />
                </div>

                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="რას ეძებთ? მაგ: 'Cyberpunk City' ან 'Minimal Logo'..."
                    className="w-full px-4 py-5 bg-transparent border-none outline-none text-lg placeholder:text-muted-foreground/50"
                />

                <div className="pr-4 flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 text-xs font-mono text-muted-foreground border border-white/5">
                        <TbCommand className="w-3 h-3" />
                        <span>K</span>
                    </div>
                    <button
                        onClick={() => handleSearch(searchValue)}
                        className={`
                            p-2 rounded-xl transition-all duration-300
                            ${searchValue ? 'bg-primary text-white hover:bg-primary/90' : 'bg-transparent text-muted-foreground hover:bg-muted'}
                        `}
                    >
                        <TbSearch className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Quick Suggestions - Could be dynamic later */}
            {isFocused && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-3 p-2 bg-card/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 text-sm"
                >
                    <div className="p-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">პოპულარული ძიებები</div>
                    <div className="flex flex-wrap gap-2 p-2">
                        {['Logo Design', 'Anime Portrait', 'Interior Design', 'Web UI', 'Isometric 3D'].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => {
                                    setSearchValue(tag)
                                    handleSearch(tag)
                                }}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-sm"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}

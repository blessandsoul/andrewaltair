"use client"

import * as React from "react"
import { TbLayoutGrid, TbLayoutList, TbLayout, TbLayoutCards, TbCheck } from "react-icons/tb"
import { Button } from "@/components/ui/button"
import { useLayout, LayoutType, LAYOUT_CONFIG } from "@/lib/layoutContext"

const layoutIcons: Record<LayoutType, React.ElementType> = {
    masonry: TbLayoutGrid,
    cards: TbLayoutCards,
    feed: TbLayoutList,
    hub: TbLayout
}

export function LayoutToggle() {
    const { layout, setLayout, layouts } = useLayout()
    const [isOpen, setIsOpen] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="relative">
                <TbLayoutGrid className="h-5 w-5" />
            </Button>
        )
    }

    const CurrentIcon = layoutIcons[layout]

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="relative group"
                title="აირჩიე განლაგება"
            >
                <CurrentIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="sr-only">Layout selector</span>
            </Button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <div className="p-2">
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                გვერდის განლაგება
                            </div>
                            {(Object.keys(layouts) as LayoutType[]).map((key) => {
                                const config = layouts[key]
                                const Icon = layoutIcons[key]
                                const isSelected = layout === key

                                return (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            setLayout(key)
                                            setIsOpen(false)
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${isSelected
                                                ? "bg-primary/10 text-primary"
                                                : "hover:bg-secondary text-foreground"
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected
                                                ? "bg-primary text-white"
                                                : "bg-secondary text-muted-foreground"
                                            }`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm">{config.name}</div>
                                            <div className="text-xs text-muted-foreground truncate">{config.description}</div>
                                        </div>
                                        {isSelected && (
                                            <TbCheck className="w-4 h-4 text-primary shrink-0" />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

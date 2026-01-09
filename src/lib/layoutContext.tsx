"use client"

import * as React from "react"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type LayoutType = "masonry" | "cards" | "feed" | "hub"

export const LAYOUT_CONFIG = {
    masonry: {
        id: "masonry",
        name: "მოზაიკა",
        description: "Pinterest სტილის სეტკა",
        icon: "Grid"
    },
    cards: {
        id: "cards",
        name: "ბარათები",
        description: "ფერადი კატეგორიების ბარათები",
        icon: "Cards"
    },
    feed: {
        id: "feed",
        name: "ფიდი",
        description: "BuzzFeed სტილის ჩამონათვალი",
        icon: "List"
    },
    hub: {
        id: "hub",
        name: "ჰაბი",
        description: "სექციებად დაყოფილი",
        icon: "Layout"
    }
} as const

interface LayoutContextType {
    layout: LayoutType
    setLayout: (layout: LayoutType) => void
    layouts: typeof LAYOUT_CONFIG
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: ReactNode }) {
    const [layout, setLayoutState] = useState<LayoutType>("masonry")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const savedLayout = localStorage.getItem("homepage-layout") as LayoutType | null
        if (savedLayout && Object.keys(LAYOUT_CONFIG).includes(savedLayout)) {
            setLayoutState(savedLayout)
        }
    }, [])

    const setLayout = (newLayout: LayoutType) => {
        setLayoutState(newLayout)
        localStorage.setItem("homepage-layout", newLayout)
    }

    // Return default during SSR to avoid hydration mismatch
    const value: LayoutContextType = {
        layout: mounted ? layout : "masonry",
        setLayout,
        layouts: LAYOUT_CONFIG
    }

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    )
}

export function useLayout() {
    const context = useContext(LayoutContext)
    if (context === undefined) {
        throw new Error("useLayout must be used within a LayoutProvider")
    }
    return context
}

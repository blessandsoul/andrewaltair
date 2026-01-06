"use client"

import { useState, useEffect, useCallback } from "react"

const FAVORITES_KEY = "mystic_favorites"

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load favorites from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(FAVORITES_KEY)
            if (stored) {
                setFavorites(JSON.parse(stored))
            }
        } catch (error) {
            console.error("Error loading favorites:", error)
        }
        setIsLoaded(true)
    }, [])

    // Save favorites to localStorage
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
            } catch (error) {
                console.error("Error saving favorites:", error)
            }
        }
    }, [favorites, isLoaded])

    const toggleFavorite = useCallback((toolId: string) => {
        setFavorites(prev => {
            if (prev.includes(toolId)) {
                return prev.filter(id => id !== toolId)
            } else {
                return [...prev, toolId]
            }
        })
    }, [])

    const isFavorite = useCallback((toolId: string) => {
        return favorites.includes(toolId)
    }, [favorites])

    const addFavorite = useCallback((toolId: string) => {
        setFavorites(prev => {
            if (!prev.includes(toolId)) {
                return [...prev, toolId]
            }
            return prev
        })
    }, [])

    const removeFavorite = useCallback((toolId: string) => {
        setFavorites(prev => prev.filter(id => id !== toolId))
    }, [])

    return {
        favorites,
        toggleFavorite,
        isFavorite,
        addFavorite,
        removeFavorite,
        isLoaded,
    }
}

"use client"

import { useState, useEffect, useCallback, useRef } from 'react'

interface AutosaveOptions {
    key: string  // localStorage key for recovery
    delay?: number  // Debounce delay in ms (default: 30000)
    onSave?: (data: unknown) => Promise<void>  // Optional API save function
    enabled?: boolean  // Enable/disable autosave
}

interface AutosaveResult {
    isSaving: boolean
    lastSaved: Date | null
    error: string | null
    recoveredData: unknown | null
    clearRecovery: () => void
    forceSave: () => void
}

export function useAutosave<T>(
    data: T,
    options: AutosaveOptions
): AutosaveResult {
    const { key, delay = 30000, onSave, enabled = true } = options

    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [recoveredData, setRecoveredData] = useState<T | null>(null)

    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const dataRef = useRef<T>(data)
    const initialLoadRef = useRef(true)

    // Update ref when data changes
    dataRef.current = data

    // Check for recovered data on mount
    useEffect(() => {
        if (typeof window === 'undefined') return

        try {
            const stored = localStorage.getItem(`autosave_${key}`)
            if (stored) {
                const parsed = JSON.parse(stored)
                if (parsed.data && parsed.timestamp) {
                    // Only recover if less than 24 hours old
                    const age = Date.now() - parsed.timestamp
                    if (age < 24 * 60 * 60 * 1000) {
                        setRecoveredData(parsed.data)
                    } else {
                        // Clear old data
                        localStorage.removeItem(`autosave_${key}`)
                    }
                }
            }
        } catch (e) {
            console.error('Autosave recovery error:', e)
        }

        initialLoadRef.current = false
    }, [key])

    // Clear recovery data
    const clearRecovery = useCallback(() => {
        setRecoveredData(null)
        localStorage.removeItem(`autosave_${key}`)
    }, [key])

    // Save function
    const saveData = useCallback(async () => {
        if (!enabled) return

        setIsSaving(true)
        setError(null)

        try {
            // Always save to localStorage as backup
            localStorage.setItem(`autosave_${key}`, JSON.stringify({
                data: dataRef.current,
                timestamp: Date.now()
            }))

            // Call API save if provided
            if (onSave) {
                await onSave(dataRef.current)
            }

            setLastSaved(new Date())
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Autosave failed'
            setError(errorMessage)
            console.error('Autosave error:', e)
        } finally {
            setIsSaving(false)
        }
    }, [key, onSave, enabled])

    // Force save immediately
    const forceSave = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
        saveData()
    }, [saveData])

    // Debounced save effect
    useEffect(() => {
        if (!enabled || initialLoadRef.current) return

        // Clear previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
            saveData()
        }, delay)

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [data, delay, saveData, enabled])

    // Save before unload
    useEffect(() => {
        if (!enabled) return

        const handleBeforeUnload = () => {
            localStorage.setItem(`autosave_${key}`, JSON.stringify({
                data: dataRef.current,
                timestamp: Date.now()
            }))
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [key, enabled])

    return {
        isSaving,
        lastSaved,
        error,
        recoveredData,
        clearRecovery,
        forceSave
    }
}

// Format time since last save
export function formatTimeSince(date: Date | null): string {
    if (!date) return ''

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

    if (seconds < 10) return 'ახლა შენახულია'
    if (seconds < 60) return `${seconds} წამის წინ`

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} წთ-ის წინ`

    const hours = Math.floor(minutes / 60)
    return `${hours} სთ-ის წინ`
}

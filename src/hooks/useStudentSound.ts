'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface StudentSound {
    unlocked: boolean
    enable: () => Promise<void> // must run inside a user gesture (autoplay policy)
    chime: () => void // a new round opened — "look at your phone"
    confirm: () => void // your own answer was accepted
    reveal: () => void // results revealed
}

/**
 * Student-phone sound for ONLINE workshops (mirror of the host DisplayClient audio).
 * Cues fire only on this student's own view transitions — never on peer answers — so
 * 30 phones never beep in a herd. AudioContext is created inside the unlock gesture
 * only (SSR-safe). `volume` is 0-100.
 */
export function useStudentSound(volume: number): StudentSound {
    const [unlocked, setUnlocked] = useState(false)
    const ctxRef = useRef<AudioContext | null>(null)
    const mp3Ref = useRef<HTMLAudioElement | null>(null)
    const vol = Math.min(1, Math.max(0, volume / 100))

    useEffect(() => {
        const a = new Audio('/workshop/answer.mp3')
        a.preload = 'auto'
        a.volume = vol
        mp3Ref.current = a
    }, [vol])

    const blip = useCallback(
        (freqA: number, freqB: number, gainPeak: number) => {
            const ctx = ctxRef.current
            if (!ctx) return
            if (ctx.state === 'suspended') ctx.resume().catch(() => {})
            if (ctx.state !== 'running') return
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            const peak = Math.max(0.0001, gainPeak * vol)
            osc.type = 'sine'
            osc.frequency.setValueAtTime(freqA, ctx.currentTime)
            osc.frequency.exponentialRampToValueAtTime(freqB, ctx.currentTime + 0.09)
            gain.gain.setValueAtTime(peak, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12)
            osc.connect(gain).connect(ctx.destination)
            osc.start()
            osc.stop(ctx.currentTime + 0.13)
        },
        [vol]
    )

    const enable = useCallback(async (): Promise<void> => {
        if (!ctxRef.current) ctxRef.current = new AudioContext()
        if (ctxRef.current.state === 'suspended') await ctxRef.current.resume()
        // prime the mp3 inside the gesture so it can autoplay on reveal later
        const a = mp3Ref.current
        if (a) {
            a.play()
                .then(() => {
                    a.pause()
                    a.currentTime = 0
                })
                .catch(() => {})
        }
        setUnlocked(true)
        blip(660, 880, 0.12)
    }, [blip])

    // Browsers suspend the context when the phone backgrounds — re-resume on return.
    useEffect(() => {
        const onVis = () => {
            const ctx = ctxRef.current
            if (ctx && ctx.state === 'suspended' && document.visibilityState === 'visible') {
                ctx.resume().catch(() => {})
            }
        }
        document.addEventListener('visibilitychange', onVis)
        return () => document.removeEventListener('visibilitychange', onVis)
    }, [])

    const chime = useCallback(() => blip(660, 880, 0.1), [blip])
    const confirm = useCallback(() => blip(523, 784, 0.08), [blip])
    const reveal = useCallback(() => {
        const a = mp3Ref.current
        if (!a) return
        a.currentTime = 0
        a.play().catch(() => {})
    }, [])

    return { unlocked, enable, chime, confirm, reveal }
}

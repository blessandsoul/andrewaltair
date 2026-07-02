'use client'

import { useEffect, useRef, useState } from 'react'
import type { HostState } from '@/types/workshop.types'

/**
 * Owns the projector's audio: the enable-sound gate, the Web-Audio blip, and the
 * answer-arrival / lobby-join notification sounds. Extracted from DisplayClient so
 * the component stays under the line cap — behavior is unchanged.
 */
export function useDisplayAudio(state: HostState | null) {
    const [soundOn, setSoundOn] = useState(false)
    const [audioPrompted, setAudioPrompted] = useState(false) // dismissed/answered the enable-sound overlay
    const audioRef = useRef<AudioContext | null>(null)
    const answerSoundRef = useRef<HTMLAudioElement | null>(null) // mp3 played when an answer arrives
    const prevResponsesRef = useRef(0)
    const prevParticipantsRef = useRef(0)

    // Answer-arrival sound = the user's mp3 (public/workshop/answer.mp3)
    useEffect(() => {
        const a = new Audio('/workshop/answer.mp3')
        a.preload = 'auto'
        a.volume = 0.85
        answerSoundRef.current = a
    }, [])

    // Must run inside a user gesture: priming play()+pause() unlocks autoplay.
    const unlockAnswerSound = () => {
        const a = answerSoundRef.current
        if (!a) return
        a.play()
            .then(() => {
                a.pause()
                a.currentTime = 0
            })
            .catch(() => {})
    }

    const playAnswerSound = () => {
        const a = answerSoundRef.current
        if (!a) return
        a.currentTime = 0
        a.play().catch(() => {})
    }

    // Web Audio blip — short two-tone pop, no audio assets needed.
    // Best-effort resume: tab-share/backgrounding suspends the context; nudge it
    // back so the NEXT blip plays (the visibilitychange handler also re-resumes).
    const blip = (freqA: number, freqB: number, gainPeak = 0.12) => {
        const ctx = audioRef.current
        if (!ctx) return
        if (ctx.state === 'suspended') ctx.resume().catch(() => {})
        if (ctx.state !== 'running') return
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freqA, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(freqB, ctx.currentTime + 0.09)
        gain.gain.setValueAtTime(gainPeak, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
        osc.connect(gain).connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.13)
    }

    // A short rising fanfare for the reveal payoff (reuses the blip synth, no assets).
    const fanfare = () => {
        const notes: Array<[number, number]> = [[523, 659], [659, 784], [784, 1047]]
        notes.forEach(([a, b], i) => window.setTimeout(() => blip(a, b, 0.12), i * 110))
    }

    // A crowd cheer swell: filtered white noise, brightness + length scaled by intensity 0..1.
    const cheer = (intensity: number) => {
        const ctx = audioRef.current
        if (!ctx || ctx.state !== 'running') return
        const amt = Math.min(1, Math.max(0, intensity))
        const dur = 0.5 + amt * 0.8
        const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5
        const src = ctx.createBufferSource()
        src.buffer = buffer
        const bp = ctx.createBiquadFilter()
        bp.type = 'bandpass'
        bp.frequency.value = 900 + amt * 1400
        bp.Q.value = 0.7
        const gain = ctx.createGain()
        const peak = 0.05 + amt * 0.1
        gain.gain.setValueAtTime(0.001, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(peak, ctx.currentTime + 0.15)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
        src.connect(bp).connect(gain).connect(ctx.destination)
        src.start()
        src.stop(ctx.currentTime + dur)
    }

    // The browser requires a user gesture to unlock audio — this is that gesture.
    const enableSound = async () => {
        if (!audioRef.current) audioRef.current = new AudioContext()
        if (audioRef.current.state === 'suspended') await audioRef.current.resume()
        unlockAnswerSound()
        setSoundOn(true)
        setAudioPrompted(true)
        blip(660, 880, 0.14) // confirmation chirp
    }

    const toggleSound = async () => {
        if (!audioRef.current) audioRef.current = new AudioContext()
        if (audioRef.current.state === 'suspended') await audioRef.current.resume()
        unlockAnswerSound()
        setAudioPrompted(true)
        setSoundOn((v) => {
            const next = !v
            if (next) blip(660, 880, 0.1) // confirmation chirp
            return next
        })
    }

    // Keep the context alive: browsers suspend it when the tab is backgrounded
    // (host shares the tab then switches to Meet/remote). Re-resume on return.
    useEffect(() => {
        const onVis = () => {
            const ctx = audioRef.current
            if (ctx && ctx.state === 'suspended' && document.visibilityState === 'visible') {
                ctx.resume().catch(() => {})
            }
        }
        document.addEventListener('visibilitychange', onVis)
        return () => document.removeEventListener('visibilitychange', onVis)
    }, [])

    // Answer arrived → play the notification mp3 (only while a round accepts answers)
    useEffect(() => {
        const count = state?.responsesCount ?? 0
        const phase = state?.round?.phase
        const hostAnswerSound = state?.settings?.hostAnswerSound !== false
        if (soundOn && hostAnswerSound && count > prevResponsesRef.current && (phase === 'open' || phase === 'revote')) {
            const a = answerSoundRef.current
            if (a) a.volume = Math.min(1, Math.max(0, (state?.settings?.hostVolume ?? 85) / 100))
            playAnswerSound()
        }
        prevResponsesRef.current = count
    }, [state?.responsesCount, state?.round?.phase, soundOn, state?.settings?.hostAnswerSound, state?.settings?.hostVolume])

    // Someone joined the lobby → softer pop
    useEffect(() => {
        const count = state?.participantCount ?? 0
        if (soundOn && count > prevParticipantsRef.current && state?.status === 'lobby') {
            blip(440, 660, 0.05)
        }
        prevParticipantsRef.current = count
    }, [state?.participantCount, state?.status, soundOn])

    return { soundOn, audioPrompted, dismissPrompt: () => setAudioPrompted(true), enableSound, toggleSound, fanfare, cheer }
}

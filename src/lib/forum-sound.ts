// Lightweight Web Audio SFX for the forum — no asset files, respects a localStorage mute.
// Plays only on user gestures (reaction click / sound toggle) so autoplay policy is fine.

let ctx: AudioContext | null = null

function audio(): AudioContext | null {
    if (typeof window === "undefined") return null
    try {
        const Ctor =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        if (!Ctor) return null
        if (!ctx) ctx = new Ctor()
        return ctx
    } catch {
        return null
    }
}

export function forumSoundOn(): boolean {
    if (typeof window === "undefined") return false
    return window.localStorage.getItem("forum_sound") === "on"
}

export function setForumSound(on: boolean): void {
    if (typeof window !== "undefined") window.localStorage.setItem("forum_sound", on ? "on" : "off")
}

function tone(freq: number, durMs: number, type: OscillatorType, gain = 0.08): void {
    const a = audio()
    if (!a) return
    const o = a.createOscillator()
    const g = a.createGain()
    o.type = type
    o.frequency.value = freq
    g.gain.setValueAtTime(gain, a.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + durMs / 1000)
    o.connect(g)
    g.connect(a.destination)
    o.start()
    o.stop(a.currentTime + durMs / 1000)
}

/** Soft wooden "knock" — a gavel. Used as feedback when enabling sound / on a verdict. */
export function playKnock(): void {
    if (!forumSoundOn()) return
    tone(180, 90, "sine", 0.12)
    setTimeout(() => tone(120, 120, "sine", 0.1), 70)
}

/** Tiny "pop" for a reaction tap. */
export function playPop(): void {
    if (!forumSoundOn()) return
    tone(520, 60, "triangle", 0.06)
}

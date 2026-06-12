'use client'

export interface NameAccent {
    /** solid avatar/stripe background */
    solid: string
    /** soft tinted background (chips, name pills) */
    soft: string
    /** readable text on the soft tint */
    text: string
}

const ACCENTS: NameAccent[] = [
    { solid: 'bg-violet-600', soft: 'bg-violet-50', text: 'text-violet-700' },
    { solid: 'bg-pink-600', soft: 'bg-pink-50', text: 'text-pink-700' },
    { solid: 'bg-teal-600', soft: 'bg-teal-50', text: 'text-teal-700' },
    { solid: 'bg-amber-500', soft: 'bg-amber-50', text: 'text-amber-700' },
    { solid: 'bg-indigo-600', soft: 'bg-indigo-50', text: 'text-indigo-700' },
    { solid: 'bg-rose-500', soft: 'bg-rose-50', text: 'text-rose-700' },
    { solid: 'bg-emerald-600', soft: 'bg-emerald-50', text: 'text-emerald-700' },
    { solid: 'bg-fuchsia-600', soft: 'bg-fuchsia-50', text: 'text-fuchsia-700' },
]

/** Deterministic accent — same name → same color set everywhere. */
export function nameAccent(name: string): NameAccent {
    let h = 0
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
    return ACCENTS[h % ACCENTS.length]
}

interface NameAvatarProps {
    name: string
    size?: number
}

/** Deterministic colored initial circle — same name → same color everywhere. */
export default function NameAvatar({ name, size = 28 }: NameAvatarProps) {
    const initial = (name.trim()[0] ?? '?').toUpperCase()
    return (
        <span
            className={`inline-flex items-center justify-center rounded-full text-white font-bold shrink-0 ${nameAccent(name).solid}`}
            style={{ width: size, height: size, fontSize: size * 0.48 }}
        >
            {initial}
        </span>
    )
}

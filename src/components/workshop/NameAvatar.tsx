'use client'

const PALETTE = [
    'bg-violet-600',
    'bg-pink-600',
    'bg-teal-600',
    'bg-amber-500',
    'bg-indigo-600',
    'bg-rose-500',
    'bg-emerald-600',
    'bg-fuchsia-600',
] as const

function colorFor(name: string): string {
    let h = 0
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
    return PALETTE[h % PALETTE.length]
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
            className={`inline-flex items-center justify-center rounded-full text-white font-bold shrink-0 ${colorFor(name)}`}
            style={{ width: size, height: size, fontSize: size * 0.48 }}
        >
            {initial}
        </span>
    )
}

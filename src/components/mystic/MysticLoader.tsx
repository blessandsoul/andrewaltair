"use client"

interface MysticLoaderProps {
    text?: string
    size?: "sm" | "md" | "lg"
}

export function MysticLoader({ text = "იტვირთება...", size = "md" }: MysticLoaderProps) {
    const sizeClasses = {
        sm: "w-12 h-12",
        md: "w-20 h-20",
        lg: "w-28 h-28",
    }

    const textSizes = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
            {/* Mystical Orb Loader */}
            <div className={`relative ${sizeClasses[size]}`}>
                {/* Outer rotating ring */}
                <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-spin-slow">
                    <div className="absolute top-0 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400" />
                </div>

                {/* Middle pulsing ring */}
                <div className="absolute inset-2 rounded-full border border-pink-500/30 animate-pulse" />

                {/* Inner glowing orb */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 animate-pulse shadow-[0_0_30px_10px_rgba(168,85,247,0.3)]">
                    {/* Eye/Crystal center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1/3 h-1/3 rounded-full bg-white/80 animate-ping"
                            style={{ animationDuration: '1.5s' }} />
                    </div>
                </div>

                {/* Orbiting particles */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
                    <div className="absolute top-1/2 left-0 w-1.5 h-1.5 -translate-y-1/2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                </div>
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
                    <div className="absolute top-0 left-1/2 w-1 h-1 -translate-x-1/2 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
                </div>
            </div>

            {/* Loading text with shimmer */}
            <div className="relative overflow-hidden">
                <p className={`${textSizes[size]} text-gray-400 font-georgian`}>{text}</p>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            </div>

            {/* Mystical dots animation */}
            <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>
        </div>
    )
}

export function MysticLoadingOverlay({ text }: { text?: string }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]/80 backdrop-blur-sm">
            <div className="bg-[#12121a] border border-purple-500/20 rounded-2xl p-8 shadow-2xl shadow-purple-900/20">
                <MysticLoader text={text} size="lg" />
            </div>
        </div>
    )
}

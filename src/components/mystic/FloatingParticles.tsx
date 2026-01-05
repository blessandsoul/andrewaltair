"use client"

export function FloatingParticles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Large background orbs */}
            <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-purple-500/20 rounded-full blur-[80px] sm:blur-[100px] animate-float opacity-60" />
            <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-pink-500/15 rounded-full blur-[100px] sm:blur-[120px] animate-float" style={{ animationDelay: "-2s" }} />
            <div className="absolute top-1/2 left-1/4 sm:left-1/3 w-40 sm:w-64 h-40 sm:h-64 bg-blue-500/15 rounded-full blur-[60px] sm:blur-[80px] animate-float opacity-50" style={{ animationDelay: "-4s" }} />
        </div>
    )
}

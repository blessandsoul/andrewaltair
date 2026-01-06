"use client"

import { useEffect, useState } from "react"

// 3D Crystal Ball for Fortune Teller
export function CrystalBall3D() {
    return (
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto perspective-1000">
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-purple-500/30 to-purple-900/30 blur-3xl animate-pulse" />

            {/* Crystal ball base */}
            <div className="relative w-full h-full rounded-full 
                          bg-gradient-to-br from-purple-300/20 via-purple-500/10 to-purple-900/30
                          border border-purple-400/30 shadow-[0_0_60px_rgba(168,85,247,0.4)]
                          animate-[float_4s_ease-in-out_infinite]"
                style={{ transformStyle: 'preserve-3d' }}>

                {/* Inner glow core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                              w-24 h-24 sm:w-32 sm:h-32 rounded-full
                              bg-gradient-to-br from-purple-400/60 via-pink-500/40 to-purple-600/60
                              blur-xl animate-pulse"
                    style={{ animationDuration: '2s' }} />

                {/* Swirling mist */}
                <div className="absolute inset-4 rounded-full overflow-hidden">
                    <div className="absolute w-full h-full animate-spin" style={{ animationDuration: '8s' }}>
                        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-purple-400/30 rounded-full blur-md" />
                        <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-pink-400/30 rounded-full blur-md" />
                        <div className="absolute top-1/2 right-1/3 w-10 h-10 bg-indigo-400/20 rounded-full blur-lg" />
                    </div>
                </div>

                {/* Reflection highlight */}
                <div className="absolute top-4 left-6 w-16 h-8 sm:w-20 sm:h-10 
                              bg-gradient-to-br from-white/40 to-transparent 
                              rounded-full blur-sm rotate-[-30deg]" />

                {/* TbSparkles */}
                <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDuration: '1.5s' }} />
                <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-purple-200 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
                <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-pink-200 rounded-full animate-ping" style={{ animationDuration: '1.8s', animationDelay: '1s' }} />
            </div>

            {/* Stand */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-6 
                          bg-gradient-to-b from-purple-900 to-purple-950 
                          rounded-b-full border border-purple-600/30 shadow-lg" />
        </div>
    )
}

// 3D Rotating Tarot Card
export function TarotCard3D() {
    const [isFlipped, setIsFlipped] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => setIsFlipped(f => !f), 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="relative w-40 h-64 sm:w-48 sm:h-72 mx-auto perspective-1000">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-indigo-500/20 blur-3xl animate-pulse" />

            <div className={`relative w-full h-full transition-all duration-1000 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                style={{ transformStyle: 'preserve-3d' }}>

                {/* Front face */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden
                              bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950
                              border-2 border-indigo-400/30 shadow-[0_0_40px_rgba(99,102,241,0.4)]"
                    style={{ backfaceVisibility: 'hidden' }}>

                    {/* Card design */}
                    <div className="absolute inset-3 border border-indigo-400/30 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-6xl sm:text-7xl mb-2">⭐</div>
                            <div className="text-indigo-300 text-sm font-semibold">THE STAR</div>
                        </div>
                    </div>

                    {/* Corner decorations */}
                    <div className="absolute top-2 left-2 text-indigo-400/40 text-xs">XVII</div>
                    <div className="absolute bottom-2 right-2 text-indigo-400/40 text-xs rotate-180">XVII</div>

                    {/* Mystical patterns */}
                    <div className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(99,102,241,0.3) 0%, transparent 50%)`,
                        }} />
                </div>

                {/* Back face */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden
                              bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950
                              border-2 border-purple-400/30 shadow-[0_0_40px_rgba(168,85,247,0.4)]"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>

                    {/* Pattern */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 border-4 border-purple-400/30 rotate-45" />
                        <div className="absolute w-24 h-24 border-2 border-indigo-400/30 rotate-45" />
                        <div className="absolute text-4xl">✨</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// 3D Beating Heart for Love TbCalculator
export function BeatingHeart3D() {
    return (
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto perspective-1000">
            {/* Glow */}
            <div className="absolute inset-0 bg-pink-500/20 blur-3xl animate-pulse" style={{ animationDuration: '1s' }} />

            {/* Heart container */}
            <div className="relative w-full h-full flex items-center justify-center animate-heartbeat">

                {/* Main heart */}
                <div className="relative">
                    {/* Heart shape using CSS */}
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                        <div className="absolute top-0 left-0 w-20 h-32 sm:w-24 sm:h-40 
                                      bg-gradient-to-br from-pink-400 via-rose-500 to-pink-600
                                      rounded-tl-full rounded-tr-full origin-bottom rotate-[-45deg]
                                      shadow-[0_0_40px_rgba(236,72,153,0.5)]"
                            style={{ borderRadius: '50% 50% 0 0' }} />
                        <div className="absolute top-0 right-0 w-20 h-32 sm:w-24 sm:h-40 
                                      bg-gradient-to-bl from-pink-400 via-rose-500 to-pink-600
                                      rounded-tl-full rounded-tr-full origin-bottom rotate-[45deg]
                                      shadow-[0_0_40px_rgba(236,72,153,0.5)]"
                            style={{ borderRadius: '50% 50% 0 0' }} />
                    </div>

                    {/* Highlight */}
                    <div className="absolute top-6 left-4 w-6 h-4 bg-white/30 rounded-full blur-sm rotate-[-30deg]" />

                    {/* Particles */}
                    <div className="absolute -top-4 -left-4 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-60" />
                    <div className="absolute -top-2 right-0 w-2 h-2 bg-rose-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.3s' }} />
                    <div className="absolute bottom-8 -right-6 w-2.5 h-2.5 bg-pink-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.6s' }} />
                </div>
            </div>
        </div>
    )
}

// 3D All-Seeing Eye for Dreams
export function MysticalEye3D() {
    return (
        <div className="relative w-56 h-40 sm:w-64 sm:h-48 mx-auto perspective-1000">
            {/* Glow */}
            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl animate-pulse" />

            {/* Eye container */}
            <div className="relative w-full h-full flex items-center justify-center">

                {/* Outer eye shape */}
                <div className="relative w-48 h-24 sm:w-56 sm:h-28 
                              bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent
                              rounded-[50%] border border-cyan-400/30
                              shadow-[0_0_50px_rgba(34,211,238,0.3)]
                              animate-blink3d">

                    {/* Iris */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                  w-16 h-16 sm:w-20 sm:h-20 rounded-full
                                  bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600
                                  shadow-[0_0_30px_rgba(34,211,238,0.5)]
                                  animate-lookAround">

                        {/* Pupil */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                      w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black
                                      shadow-inner">
                            {/* Light reflection */}
                            <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full" />
                            <div className="absolute top-3 left-4 w-1 h-1 bg-white/60 rounded-full" />
                        </div>

                        {/* Iris patterns */}
                        <div className="absolute inset-0 rounded-full opacity-40 animate-spin" style={{ animationDuration: '10s' }}>
                            <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-gradient-to-b from-cyan-300 to-transparent" />
                            <div className="absolute top-1/2 left-0 w-1/2 h-0.5 bg-gradient-to-r from-cyan-300 to-transparent" />
                        </div>
                    </div>
                </div>

                {/* Cosmic rays */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-cyan-400/50 to-transparent" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-t from-cyan-400/50 to-transparent" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-cyan-400/50 to-transparent" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-l from-cyan-400/50 to-transparent" />
                </div>
            </div>
        </div>
    )
}

// 3D Sun with Zodiac for Horoscope
export function ZodiacSun3D() {
    const zodiacSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

    return (
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto perspective-1000">
            {/* Glow */}
            <div className="absolute inset-0 bg-amber-500/30 blur-3xl animate-pulse" />

            {/* Zodiac ring */}
            <div className="absolute inset-0 rounded-full animate-spin" style={{ animationDuration: '30s' }}>
                {zodiacSymbols.map((symbol, i) => (
                    <div key={i}
                        className="absolute text-amber-300/60 text-lg sm:text-xl font-bold"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: `rotate(${i * 30}deg) translateY(-100px) rotate(-${i * 30}deg) translate(-50%, -50%)`,
                        }}>
                        {symbol}
                    </div>
                ))}
            </div>

            {/* Sun core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-28 h-28 sm:w-32 sm:h-32 rounded-full
                          bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500
                          shadow-[0_0_60px_rgba(251,191,36,0.6)]
                          animate-pulse" style={{ animationDuration: '2s' }}>

                {/* Inner glow */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-200 to-amber-400 opacity-80" />

                {/* Surface details */}
                <div className="absolute top-4 left-6 w-8 h-6 bg-orange-500/30 rounded-full blur-sm" />
                <div className="absolute bottom-6 right-4 w-6 h-4 bg-yellow-500/40 rounded-full blur-sm" />
            </div>

            {/* Rays */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                {[...Array(12)].map((_, i) => (
                    <div key={i}
                        className="absolute top-1/2 left-1/2 w-1 h-16 sm:h-20 origin-bottom
                                  bg-gradient-to-t from-amber-400/60 to-transparent"
                        style={{ transform: `rotate(${i * 30}deg) translateY(-100%)` }} />
                ))}
            </div>
        </div>
    )
}

// 3D Floating Numbers for Numerology
export function SacredNumbers3D() {
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

    return (
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto perspective-1000">
            {/* Glow */}
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl animate-pulse" />

            {/* Sphere of numbers */}
            <div className="relative w-full h-full animate-spin" style={{ animationDuration: '15s', transformStyle: 'preserve-3d' }}>
                {numbers.map((num, i) => {
                    const theta = (i / numbers.length) * Math.PI * 2
                    const phi = Math.acos(1 - 2 * ((i + 0.5) / numbers.length))
                    const x = Math.sin(phi) * Math.cos(theta) * 80
                    const y = Math.sin(phi) * Math.sin(theta) * 80
                    const z = Math.cos(phi) * 80

                    return (
                        <div key={i}
                            className="absolute top-1/2 left-1/2 text-2xl sm:text-3xl font-bold
                                      text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                            style={{
                                transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px)`,
                            }}>
                            {num}
                        </div>
                    )
                })}
            </div>

            {/* Center orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-20 h-20 sm:w-24 sm:h-24 rounded-full
                          bg-gradient-to-br from-emerald-400/30 to-teal-600/30
                          border border-emerald-400/30 shadow-[0_0_40px_rgba(52,211,153,0.3)]">
                <div className="absolute inset-0 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-emerald-300">
                    ∞
                </div>
            </div>
        </div>
    )
}

// 3D Realistic Moon
export function RealisticMoon3D() {
    return (
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto perspective-1000">
            {/* Glow */}
            <div className="absolute inset-0 bg-slate-400/20 blur-3xl" />

            {/* Moon sphere */}
            <div className="relative w-full h-full rounded-full 
                          bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400
                          shadow-[inset_-20px_-10px_30px_rgba(0,0,0,0.4),0_0_50px_rgba(148,163,184,0.3)]
                          animate-[float_6s_ease-in-out_infinite]">

                {/* Craters */}
                <div className="absolute top-[20%] left-[30%] w-12 h-12 rounded-full 
                              bg-gradient-to-br from-slate-400/50 to-slate-500/30
                              shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]" />
                <div className="absolute top-[50%] left-[20%] w-8 h-8 rounded-full 
                              bg-gradient-to-br from-slate-400/40 to-slate-500/20
                              shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3)]" />
                <div className="absolute top-[35%] right-[25%] w-10 h-10 rounded-full 
                              bg-gradient-to-br from-slate-400/45 to-slate-500/25
                              shadow-[inset_2px_2px_4px_rgba(0,0,0,0.25)]" />
                <div className="absolute bottom-[20%] left-[45%] w-6 h-6 rounded-full 
                              bg-gradient-to-br from-slate-400/35 to-slate-500/15
                              shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]" />
                <div className="absolute top-[60%] right-[30%] w-5 h-5 rounded-full 
                              bg-gradient-to-br from-slate-400/30 to-slate-500/10
                              shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]" />

                {/* Terminator shadow (day/night line) */}
                <div className="absolute inset-0 rounded-full 
                              bg-gradient-to-l from-transparent via-transparent to-slate-900/70"
                    style={{ clipPath: 'inset(0 0 0 30%)' }} />

                {/* Highlight */}
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full 
                              bg-gradient-to-br from-white/20 to-transparent blur-sm" />
            </div>

            {/* Orbiting stars */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full" />
                <div className="absolute bottom-4 right-8 w-0.5 h-0.5 bg-white/60 rounded-full" />
            </div>
        </div>
    )
}

// 3D Mystic Orb for Chat
export function MysticOrb3D() {
    return (
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto perspective-1000">
            {/* Outer glow */}
            <div className="absolute inset-0 bg-fuchsia-500/30 blur-3xl animate-pulse" />

            {/* Orb */}
            <div className="relative w-full h-full rounded-full 
                          bg-gradient-to-br from-fuchsia-400/20 via-purple-500/30 to-fuchsia-600/20
                          border border-fuchsia-400/30 
                          shadow-[0_0_60px_rgba(217,70,239,0.4),inset_0_0_60px_rgba(217,70,239,0.2)]
                          animate-[float_4s_ease-in-out_infinite]"
                style={{ transformStyle: 'preserve-3d' }}>

                {/* Inner energy core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                              w-20 h-20 sm:w-24 sm:h-24 rounded-full
                              bg-gradient-to-br from-fuchsia-400 via-purple-500 to-pink-500
                              blur-md animate-pulse" style={{ animationDuration: '1.5s' }} />

                {/* Chat symbol */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                              text-4xl sm:text-5xl animate-pulse" style={{ animationDuration: '2s' }}>
                    💬
                </div>

                {/* Swirling energy */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="absolute w-full h-full animate-spin" style={{ animationDuration: '6s' }}>
                        <div className="absolute top-4 left-1/4 w-16 h-2 bg-fuchsia-400/30 rounded-full blur-sm" />
                        <div className="absolute bottom-8 right-1/4 w-12 h-2 bg-purple-400/30 rounded-full blur-sm" />
                    </div>
                </div>

                {/* Highlight */}
                <div className="absolute top-4 left-8 w-16 h-10 
                              bg-gradient-to-br from-white/30 to-transparent 
                              rounded-full blur-sm rotate-[-20deg]" />

                {/* Floating particles */}
                <div className="absolute top-8 right-12 w-2 h-2 bg-fuchsia-300 rounded-full animate-ping opacity-60" />
                <div className="absolute bottom-12 left-8 w-1.5 h-1.5 bg-purple-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.5s' }} />
            </div>
        </div>
    )
}

// Map of service IDs to their 3D models
export const SERVICE_3D_MODELS: Record<string, () => JSX.Element> = {
    fortune: CrystalBall3D,
    tarot: TarotCard3D,
    love: BeatingHeart3D,
    dream: MysticalEye3D,
    horoscope: ZodiacSun3D,
    numerology: SacredNumbers3D,
    moon: RealisticMoon3D,
    chat: MysticOrb3D,
}

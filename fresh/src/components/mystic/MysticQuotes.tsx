"use client"

import { useState, useEffect } from "react"

const MYSTIC_QUOTES = [
    { text: "ვარსკვლავები მხოლოდ იმას აჩვენებენ, ვინც თვალებს ზეცისკენ ატარებს", author: "უძველესი სიბრძნე" },
    { text: "შენი ბედი შენს ხელშია, მაგრამ კოსმოსი გამუდმებით გიჩვენებს გზას", author: "მისტიკური მოძღვარი" },
    { text: "ყოველი სიზმარი არის შეტყობინება უნივერსიდან", author: "სიზმრების მკითხავი" },
    { text: "რაც ზეცაშია, ისიც მიწაზეა", author: "ჰერმეს ტრისმეგისტოსი" },
    { text: "თვალი რომ ვარსკვლავებს ხედავს, თავადაც ვარსკვლავისგან არის შექმნილი", author: "კარლ საგანი" },
    { text: "მაგია მოლოდინის მიღმაა და რაციონალურის საზღვრებს ამოვარდება", author: "ალექსანდრე" },
    { text: "კოსმოსი გვეკუთვნის და ჩვენ კოსმოსს ვეკუთვნით", author: "მისტიკოსი" },
    { text: "სულის სარკე მთვარის შუქზე იხსნება", author: "მთვარის დედოფალი" },
]

export function MysticQuotes() {
    const [currentQuote, setCurrentQuote] = useState(MYSTIC_QUOTES[0])
    const [isVisible, setIsVisible] = useState(true)
    const [glowIntensity, setGlowIntensity] = useState(0)

    useEffect(() => {
        const changeQuote = () => {
            setIsVisible(false)

            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * MYSTIC_QUOTES.length)
                setCurrentQuote(MYSTIC_QUOTES[randomIndex])
                setIsVisible(true)
            }, 1000)
        }

        const interval = setInterval(changeQuote, 8000)
        return () => clearInterval(interval)
    }, [])

    // Glow animation
    useEffect(() => {
        const glowInterval = setInterval(() => {
            setGlowIntensity(prev => {
                const next = prev + 0.1
                return next > Math.PI * 2 ? 0 : next
            })
        }, 50)
        return () => clearInterval(glowInterval)
    }, [])

    const glow = Math.sin(glowIntensity) * 0.3 + 0.7

    return (
        <div className="relative py-8 overflow-hidden">
            {/* Decorative lines */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                <div className="w-2 h-2 rotate-45 bg-purple-500/50" />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            </div>

            {/* TbQuote container */}
            <div
                className={`relative z-10 max-w-2xl mx-auto px-8 py-6 text-center
                    transition-all duration-1000 ease-in-out
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
                {/* TbQuote marks */}
                <div className="absolute -top-2 left-4 text-6xl text-purple-500/20 font-serif">"</div>
                <div className="absolute -bottom-6 right-4 text-6xl text-purple-500/20 font-serif rotate-180">"</div>

                {/* TbQuote text */}
                <p
                    className="text-lg sm:text-xl text-gray-200 font-georgian leading-relaxed mb-4"
                    style={{
                        textShadow: `0 0 ${20 * glow}px rgba(168, 85, 247, ${0.3 * glow})`,
                    }}
                >
                    {currentQuote.text}
                </p>

                {/* Author */}
                <p className="text-sm text-purple-400/70 italic">
                    — {currentQuote.author}
                </p>
            </div>

            {/* Floating particles around quote */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full animate-float"
                        style={{
                            left: `${15 + i * 15}%`,
                            top: `${20 + (i % 3) * 30}%`,
                            backgroundColor: i % 2 === 0 ? 'rgba(168, 85, 247, 0.5)' : 'rgba(236, 72, 153, 0.5)',
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${3 + i}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

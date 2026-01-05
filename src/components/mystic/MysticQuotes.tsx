import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const QUOTES = [
    {
        text: "ვარსკვლავები მხოლოდ იმას აჩვენებენ, ვინც თვალებს ზეცისკენ ატარებს",
        author: "უძველესი სიბრძნე"
    },
    {
        text: "შენი ბედი შენს ხელშია, მაგრამ კოსმოსი გამუდმებით გიჩვენებს გზას",
        author: "მისტიკური მოძღვარი"
    },
    {
        text: "სამყარო გელაპარაკება დამთხვევების ენით",
        author: "კარლ იუნგი"
    },
    {
        text: "რასაც ეძებ, ისიც გეძებს შენ",
        author: "რუმი"
    },
    {
        text: "ყოველი დასასრული ახალი დასაწყისია ვარსკვლავურ რუკაზე",
        author: "ასტროლოგიური ჭეშმარიტება"
    }
]

export function MysticQuotes() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false)
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % QUOTES.length)
                setIsVisible(true)
            }, 500)
        }, 8000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="relative max-w-2xl mx-auto text-center px-4 py-8 sm:py-12">
            <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-purple-500/10 blur-3xl rounded-full" />

                <div className={cn(
                    "relative transition-all duration-700 transform",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-4 animate-pulse" />

                    <p className="text-lg sm:text-xl md:text-2xl font-medium text-white/90 leading-relaxed font-georgian italic">
                        "{QUOTES[currentIndex].text}"
                    </p>

                    <div className="mt-4 flex items-center justify-center gap-2">
                        <div className="h-px w-8 bg-purple-500/30" />
                        <p className="text-sm text-purple-300/60 font-medium">
                            {QUOTES[currentIndex].author}
                        </p>
                        <div className="h-px w-8 bg-purple-500/30" />
                    </div>
                </div>
            </div>

            {/* Progress indicators */}
            <div className="flex justify-center gap-1.5 mt-6 sm:mt-8">
                {QUOTES.map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-1 rounded-full transition-all duration-300",
                            i === currentIndex
                                ? "w-6 bg-purple-500"
                                : "w-1 bg-purple-500/20"
                        )}
                    />
                ))}
            </div>
        </div>
    )
}

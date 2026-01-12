"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TbHash, TbSparkles, TbRefresh, TbLoader2, TbCalendar, TbUser, TbHeart, TbStar } from "react-icons/tb"

interface NumerologyResult {
    lifePath: number
    destiny: number
    soul: number
    personality: number
    interpretation: string
    yearForecast: string
}

function calculateLifePath(dateStr: string): number {
    const digits = dateStr.replace(/\D/g, '').split('')
    let sum = digits.reduce((acc, d) => acc + parseInt(d), 0)
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').reduce((acc, d) => acc + parseInt(d), 0)
    }
    return sum
}

function calculateFromName(name: string): { destiny: number; soul: number; personality: number } {
    const letterValues: Record<string, number> = {
        'ა': 1, 'ბ': 2, 'გ': 3, 'დ': 4, 'ე': 5, 'ვ': 6, 'ზ': 7, 'თ': 8, 'ი': 9,
        'კ': 1, 'ლ': 2, 'მ': 3, 'ნ': 4, 'ო': 5, 'პ': 6, 'ჟ': 7, 'რ': 8, 'ს': 9,
        'ტ': 1, 'უ': 2, 'ფ': 3, 'ქ': 4, 'ღ': 5, 'ყ': 6, 'შ': 7, 'ჩ': 8, 'ც': 9,
        'ძ': 1, 'წ': 2, 'ჭ': 3, 'ხ': 4, 'ჯ': 5, 'ჰ': 6,
        'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
        'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
        's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8,
    }
    const vowels = new Set(['ა', 'ე', 'ი', 'ო', 'უ', 'a', 'e', 'i', 'o', 'u'])

    let destinySum = 0
    let soulSum = 0
    let personalitySum = 0

    for (const char of name.toLowerCase()) {
        const val = letterValues[char] || 0
        if (val > 0) {
            destinySum += val
            if (vowels.has(char)) {
                soulSum += val
            } else {
                personalitySum += val
            }
        }
    }

    const reduce = (n: number) => {
        while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
            n = n.toString().split('').reduce((acc, d) => acc + parseInt(d), 0)
        }
        return n
    }

    return {
        destiny: reduce(destinySum),
        soul: reduce(soulSum),
        personality: reduce(personalitySum)
    }
}

const NUMBER_MEANINGS: Record<number, { title: string; traits: string }> = {
    1: { title: "ლიდერი", traits: "დამოუკიდებელი, ამბიციური, პიონერი" },
    2: { title: "პარტნიორი", traits: "დიპლომატი, მგრძნობიარე, თანამშრომელი" },
    3: { title: "შემოქმედი", traits: "კრეატიული, ოპტიმისტი, გამომხატველი" },
    4: { title: "მშენებელი", traits: "პრაქტიკული, სტაბილური, შრომისმოყვარე" },
    5: { title: "თავისუფალი", traits: "თავგადასავლიანი, ცვალებადი, ცნობისმოყვარე" },
    6: { title: "მზრუნველი", traits: "პასუხისმგებლიანი, მზრუნველი, ჰარმონიული" },
    7: { title: "მოაზროვნე", traits: "ანალიტიკური, სულიერი, ინტროსპექტიული" },
    8: { title: "ძალაუფლებიანი", traits: "ამბიციური, მატერიალისტი, ავტორიტეტული" },
    9: { title: "ჰუმანისტი", traits: "ალტრუისტი, იდეალისტი, თანამგრძნობი" },
    11: { title: "ინტუიტიური ოსტატი", traits: "ხილვისმქონე, შთამაგონებელი, სულიერი ლიდერი" },
    22: { title: "მასტერ-მშენებელი", traits: "პრაქტიკული ხილვა, დიდი მიზნები, გლობალური ცვლილება" },
    33: { title: "მასტერ-მასწავლებელი", traits: "უანგარო სიყვარული, სულიერი მოწოდება, მსოფლიო მსახური" },
}

export function Numerology() {
    const { csrfToken } = useAuth()
    const [fullName, setFullName] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [result, setResult] = useState<NumerologyResult | null>(null)
    const [isCalculating, setIsCalculating] = useState(false)

    const handleCalculate = async () => {
        if (!fullName.trim() || !birthDate) return

        setIsCalculating(true)

        const lifePath = calculateLifePath(birthDate)
        const { destiny, soul, personality } = calculateFromName(fullName)

        try {
            const response = await fetch("/api/mystic/numerology", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": csrfToken || ""
                },
                body: JSON.stringify({ fullName, birthDate, lifePath, destiny, soul, personality }),
            })

            if (!response.ok) throw new Error("API error")
            const data = await response.json()
            setResult({
                lifePath,
                destiny,
                soul,
                personality,
                interpretation: data.interpretation,
                yearForecast: data.yearForecast
            })
        } catch {
            setResult({
                lifePath,
                destiny,
                soul,
                personality,
                interpretation: `შენი სიცოცხლის გზის რიცხვი ${lifePath} გეუბნება, რომ შენ ${NUMBER_MEANINGS[lifePath]?.traits || 'უნიკალური პიროვნება ხარ'}. ბედისწერის რიცხვი ${destiny} კი მიგითითებს შენს ცხოვრების მისიაზე.`,
                yearForecast: "წელს განსაკუთრებული ენერგია გელოდება. ახალი შესაძლებლობები გამოჩნდება."
            })
        } finally {
            setIsCalculating(false)
        }
    }

    const handleReset = () => {
        setFullName("")
        setBirthDate("")
        setResult(null)
    }

    return (
        <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl sm:rounded-3xl blur-xl opacity-20" />

            <div className="relative rounded-2xl sm:rounded-3xl bg-[#12121a] border border-white/10 overflow-hidden">
                {/* Header gradient */}
                <div className="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-emerald-600/20 to-transparent pointer-events-none" />

                <div className="relative p-5 sm:p-6 lg:p-8">
                    {!result ? (
                        <div className="space-y-4 sm:space-y-6">
                            {/* Header */}
                            <div className="flex justify-center mb-6 sm:mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-2xl animate-pulse" />
                                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 p-1">
                                        <div className="w-full h-full rounded-full bg-[#12121a] flex items-center justify-center">
                                            <TbHash className="w-7 h-7 sm:w-9 sm:h-9 text-emerald-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">სრული სახელი</label>
                                    <Input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="სახელი და გვარი..."
                                        className="h-10 sm:h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-lg sm:rounded-xl focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">დაბადების თარიღი</label>
                                    <Input
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="h-10 sm:h-12 bg-white/5 border-white/10 text-white rounded-lg sm:rounded-xl focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleCalculate}
                                disabled={!fullName.trim() || !birthDate || isCalculating}
                                className="w-full h-11 sm:h-12 lg:h-14 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold border-0"
                            >
                                {isCalculating ? (
                                    <span className="flex items-center gap-3">
                                        <TbLoader2 className="w-5 h-5 animate-spin" />
                                        AI ანალიზი...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-3">
                                        <TbSparkles className="w-5 h-5" />
                                        გაიგე შენი რიცხვები
                                    </span>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Numbers grid */}
                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-center">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                        <TbCalendar className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-black text-emerald-400">{result.lifePath}</div>
                                    <div className="text-xs text-gray-500">სიცოცხლის გზა</div>
                                    <div className="text-[10px] sm:text-xs text-emerald-300 mt-1">{NUMBER_MEANINGS[result.lifePath]?.title}</div>
                                </div>
                                <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                        <TbStar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-black text-purple-400">{result.destiny}</div>
                                    <div className="text-xs text-gray-500">ბედისწერა</div>
                                    <div className="text-[10px] sm:text-xs text-purple-300 mt-1">{NUMBER_MEANINGS[result.destiny]?.title}</div>
                                </div>
                                <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-xl bg-pink-500/20 flex items-center justify-center">
                                        <TbHeart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-black text-pink-400">{result.soul}</div>
                                    <div className="text-xs text-gray-500">სულის სურვილი</div>
                                </div>
                                <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                        <TbUser className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-black text-blue-400">{result.personality}</div>
                                    <div className="text-xs text-gray-500">პიროვნება</div>
                                </div>
                            </div>

                            {/* Interpretation */}
                            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                        <TbSparkles className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold text-white mb-2">ინტერპრეტაცია</h3>
                                        <p className="text-sm text-gray-300 leading-relaxed">{result.interpretation}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Year forecast */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-sm text-gray-400">
                                    <span className="text-amber-400 font-medium">📅 {new Date().getFullYear()} წელი: </span>
                                    {result.yearForecast}
                                </p>
                            </div>

                            <Button
                                onClick={handleReset}
                                variant="outline"
                                className="w-full h-10 sm:h-12 rounded-xl border-white/10 text-white hover:bg-white/5 bg-transparent"
                            >
                                <TbRefresh className="w-4 h-4 mr-2" />
                                ხელახლა
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { Zap, Crown, AlertTriangle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AIUsageCreditsProps {
    maxCredits?: number
    onUpgrade?: () => void
}

export function AIUsageCredits({ maxCredits = 10, onUpgrade }: AIUsageCreditsProps) {
    const [credits, setCredits] = useState(maxCredits)
    const [showWarning, setShowWarning] = useState(false)

    useEffect(() => {
        // Load credits from localStorage
        const storageKey = 'ai_credits'
        const dateKey = 'ai_credits_date'

        const savedCredits = localStorage.getItem(storageKey)
        const savedDate = localStorage.getItem(dateKey)
        const today = new Date().toDateString()

        if (savedDate !== today) {
            // Reset credits daily
            localStorage.setItem(storageKey, String(maxCredits))
            localStorage.setItem(dateKey, today)
            setCredits(maxCredits)
        } else if (savedCredits) {
            setCredits(parseInt(savedCredits))
        }
    }, [maxCredits])

    const useCredit = () => {
        if (credits > 0) {
            const newCredits = credits - 1
            setCredits(newCredits)
            localStorage.setItem('ai_credits', String(newCredits))

            if (newCredits <= 3) {
                setShowWarning(true)
            }
            return true
        }
        return false
    }

    const percentage = (credits / maxCredits) * 100
    const isLow = credits <= 3
    const isEmpty = credits === 0

    return (
        <div className="w-full max-w-sm">
            <div className={`relative overflow-hidden rounded-2xl p-4 backdrop-blur-xl border transition-all duration-500 ${isEmpty
                    ? 'bg-gradient-to-br from-red-900/40 to-orange-900/40 border-red-500/30'
                    : isLow
                        ? 'bg-gradient-to-br from-amber-900/40 to-orange-900/40 border-amber-500/30'
                        : 'bg-gradient-to-br from-slate-900/40 to-indigo-900/40 border-slate-700/50'
                }`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${isEmpty ? 'bg-red-500/20' : isLow ? 'bg-amber-500/20' : 'bg-indigo-500/20'}`}>
                            <Zap className={`w-5 h-5 ${isEmpty ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-indigo-400'}`} />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-sm">AI კრედიტები</h3>
                            <p className="text-white/50 text-xs">განახლდება ყოველდღე</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`text-2xl font-bold ${isEmpty ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-white'}`}>
                            {credits}
                        </span>
                        <span className="text-white/40 text-sm">/{maxCredits}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden mb-3">
                    <div
                        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${isEmpty
                                ? 'bg-gradient-to-r from-red-500 to-red-600'
                                : isLow
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                    : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                            }`}
                        style={{ width: `${percentage}%` }}
                    />
                    {/* Animated shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>

                {/* Warning Message */}
                {(isLow || isEmpty) && (
                    <div className={`flex items-center gap-2 p-2 rounded-lg mb-3 ${isEmpty ? 'bg-red-500/10 border border-red-500/20' : 'bg-amber-500/10 border border-amber-500/20'
                        }`}>
                        <AlertTriangle className={`w-4 h-4 ${isEmpty ? 'text-red-400' : 'text-amber-400'}`} />
                        <span className={`text-xs ${isEmpty ? 'text-red-300' : 'text-amber-300'}`}>
                            {isEmpty
                                ? 'კრედიტები ამოიწურა! გახდი Premium შეუზღუდავი წვდომისთვის.'
                                : 'კრედიტები მცირდება! დარჩა მხოლოდ ' + credits + ' მოთხოვნა.'}
                        </span>
                    </div>
                )}

                {/* Upgrade CTA */}
                {(isLow || isEmpty) && (
                    <Button
                        onClick={onUpgrade}
                        className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/25"
                    >
                        <Crown className="w-4 h-4 mr-2" />
                        შეუზღუდავი კრედიტები
                        <Sparkles className="w-4 h-4 ml-2" />
                    </Button>
                )}

                {/* Usage tip */}
                {!isLow && !isEmpty && (
                    <p className="text-center text-white/40 text-xs">
                        გამოიყენე AI ჩატი, გადამთარგმნე, ან გენერირე კონტენტი
                    </p>
                )}
            </div>
        </div>
    )
}

// Export hook for using credits in other components
export function useAICredits() {
    const [credits, setCredits] = useState(10)

    useEffect(() => {
        const savedCredits = localStorage.getItem('ai_credits')
        if (savedCredits) {
            setCredits(parseInt(savedCredits))
        }
    }, [])

    const useCredit = () => {
        if (credits > 0) {
            const newCredits = credits - 1
            setCredits(newCredits)
            localStorage.setItem('ai_credits', String(newCredits))
            return true
        }
        return false
    }

    const hasCredits = credits > 0

    return { credits, useCredit, hasCredits }
}

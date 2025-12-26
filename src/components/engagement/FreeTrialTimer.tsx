'use client'

import { useState, useEffect } from 'react'
import { X, Clock, Zap, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FreeTrialTimerProps {
    trialDays?: number
    onUpgrade?: () => void
}

export function FreeTrialTimer({ trialDays = 7, onUpgrade }: FreeTrialTimerProps) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const [isVisible, setIsVisible] = useState(true)
    const [isDismissed, setIsDismissed] = useState(false)

    useEffect(() => {
        // Get or set trial end date
        const storageKey = 'trial_end_date'
        let endDate = localStorage.getItem(storageKey)

        if (!endDate) {
            const newEndDate = new Date()
            newEndDate.setDate(newEndDate.getDate() + trialDays)
            endDate = newEndDate.toISOString()
            localStorage.setItem(storageKey, endDate)
        }

        const targetDate = new Date(endDate).getTime()

        const timer = setInterval(() => {
            const now = new Date().getTime()
            const difference = targetDate - now

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                })
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [trialDays])

    useEffect(() => {
        const dismissed = sessionStorage.getItem('trial_timer_dismissed')
        if (dismissed) setIsDismissed(true)
    }, [])

    const handleDismiss = () => {
        setIsDismissed(true)
        sessionStorage.setItem('trial_timer_dismissed', 'true')
    }

    if (isDismissed || !isVisible) return null

    const isUrgent = timeLeft.days < 2
    const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

    return (
        <div className={`fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-500`}>
            <div className={`relative overflow-hidden rounded-2xl p-4 shadow-2xl backdrop-blur-xl border ${isUrgent
                    ? 'bg-gradient-to-r from-red-900/90 to-orange-900/90 border-red-500/50'
                    : 'bg-gradient-to-r from-indigo-900/90 to-purple-900/90 border-indigo-500/50'
                }`}>
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X className="w-4 h-4 text-white/60" />
                </button>

                <div className="relative flex items-center gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-xl ${isUrgent ? 'bg-red-500/20' : 'bg-indigo-500/20'}`}>
                        <Clock className={`w-6 h-6 ${isUrgent ? 'text-red-400 animate-pulse' : 'text-indigo-400'}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-white/80 text-sm font-medium">
                                {isExpired ? '⏰ თქვენი საცდელი პერიოდი დასრულდა!' : '⏳ საცდელი პერიოდი'}
                            </span>
                            {isUrgent && !isExpired && (
                                <span className="px-2 py-0.5 bg-red-500/30 rounded-full text-xs text-red-300 animate-pulse">
                                    იჩქარეთ!
                                </span>
                            )}
                        </div>

                        {/* Timer */}
                        {!isExpired && (
                            <div className="flex gap-2 mb-2">
                                {[
                                    { value: timeLeft.days, label: 'დღე' },
                                    { value: timeLeft.hours, label: 'სთ' },
                                    { value: timeLeft.minutes, label: 'წთ' },
                                    { value: timeLeft.seconds, label: 'წმ' }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <span className={`text-xl font-bold ${isUrgent ? 'text-red-300' : 'text-white'}`}>
                                            {String(item.value).padStart(2, '0')}
                                        </span>
                                        <span className="text-[10px] text-white/50">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CTA Button */}
                        <Button
                            onClick={onUpgrade}
                            size="sm"
                            className={`w-full ${isUrgent
                                    ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
                                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                                } text-white font-semibold shadow-lg`}
                        >
                            <Crown className="w-4 h-4 mr-2" />
                            გახდი Premium
                            <Zap className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
        </div>
    )
}

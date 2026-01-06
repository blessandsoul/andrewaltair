'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { TbX, TbCookie, TbSettings, TbCheck, TbSparkles } from 'react-icons/tb'
import Link from 'next/link'

type ConsentStatus = 'pending' | 'accepted' | 'declined' | null

export function CookieBanner() {
    const [consent, setConsent] = useState<ConsentStatus>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const [closeType, setCloseType] = useState<'accept' | 'decline' | null>(null)
    const [showSettings, setShowSettings] = useState(false)
    const [preferences, setPreferences] = useState({
        necessary: true,
        analytics: true,
        marketing: true
    })

    // Sound effect
    const playClickSound = () => {
        try {
            const audio = new Audio('/sounds/click.mp3') // Fallback or placeholder
            audio.volume = 0.2
            audio.play().catch(() => { }) // Ignore auto-play errors
        } catch (e) {
            // Ignore constraints
        }
    }

    useEffect(() => {
        // Check if user has already made a choice
        const savedConsent = localStorage.getItem('cookie_consent')
        if (savedConsent) {
            // Check if it's JSON or simple string
            if (savedConsent.startsWith('{')) {
                try {
                    const parsed = JSON.parse(savedConsent)
                    setConsent(parsed.status)
                } catch {
                    setConsent(savedConsent as ConsentStatus)
                }
            } else {
                setConsent(savedConsent as ConsentStatus)
            }
        } else {
            // Show banner after a small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const closeBanner = (type: 'accept' | 'decline', callback: () => void) => {
        setCloseType(type)
        setIsClosing(true)
        setTimeout(() => {
            callback()
            setIsVisible(false)
            setIsClosing(false)
            setCloseType(null)
        }, 600)
    }

    const handleSavePreferences = () => {
        closeBanner('accept', () => {
            const consentData = {
                status: 'accepted',
                ...preferences,
                timestamp: Date.now()
            }
            localStorage.setItem('cookie_consent', JSON.stringify(consentData)) // Save complex object
            // Also save simple status for backward compatibility if needed, or just handle it in hook
            localStorage.setItem('cookie_consent_simple', 'accepted')

            setConsent('accepted')
            // Reload to apply preferences
            window.location.reload()
        })
    }

    const handleAccept = () => {
        closeBanner('accept', () => {
            localStorage.setItem('cookie_consent', 'accepted')
            setConsent('accepted')
            // Reload to initialize analytics
            window.location.reload()
        })
    }

    const handleDecline = () => {
        closeBanner('decline', () => {
            localStorage.setItem('cookie_consent', 'declined')
            setConsent('declined')
        })
    }

    const handleClose = () => {
        setIsVisible(false)
    }

    // Don't render if consent already given or banner not ready
    if (consent || !isVisible) {
        return null
    }

    return (
        <div
            className={`
                fixed z-50 p-4
                transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                ${isClosing
                    ? closeType === 'accept'
                        ? 'scale-75 opacity-0 translate-x-[-100%] blur-md'
                        : 'translate-y-[150%] opacity-0 rotate-[-10deg]'
                    : 'animate-in slide-in-from-left-full slide-in-from-bottom-10 fade-in zoom-in-90 duration-1000'
                }
                bottom-6 left-4 right-4 sm:right-auto sm:max-w-md w-full
            `}
        >
            {/* 🌟 Premium Border Beam Effect - contained within card */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
                <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent animate-[shimmer_3s_ease-in-out_infinite_1.5s]" />
                <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-primary to-transparent animate-[shimmer-vertical_3s_ease-in-out_infinite_0.75s]" />
                <div className="absolute right-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-accent to-transparent animate-[shimmer-vertical_3s_ease-in-out_infinite_2.25s]" />
            </div>

            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-xl animate-pulse" />

            <div className="relative bg-card/95 border border-border/50 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden min-h-[160px]">

                {/* Success/Close overlay */}
                {isClosing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-card/95 backdrop-blur-sm z-20 animate-in fade-in duration-300">
                        <div className={`
                            flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg
                            ${closeType === 'accept'
                                ? 'bg-green-500/20 border border-green-500/30'
                                : 'bg-orange-500/20 border border-orange-500/30'
                            }
                        `}>
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center animate-bounce
                                ${closeType === 'accept' ? 'bg-green-500' : 'bg-orange-500'}
                            `}>
                                {closeType === 'accept' ? (
                                    <TbCheck className="w-6 h-6 text-white" />
                                ) : (
                                    <TbX className="w-6 h-6 text-white" />
                                )}
                            </div>
                            <span className="text-base font-medium">
                                {closeType === 'accept' ? 'მადლობა! ✨' : 'შენახულია!'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Decorative top gradient line */}
                <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x" />

                <div className="p-5">
                    {!showSettings ? (
                        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Main View */}
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/25 animate-bounce">
                                    <TbCookie className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-foreground">
                                            Cookies-ის გამოყენება
                                        </h3>
                                        <TbSparkles className="w-4 h-4 text-primary animate-pulse" />
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        ვიყენებთ cookies-ს საიტის გამოცდილების გასაუმჯობესებლად.
                                    </p>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleClose}
                                    className="text-muted-foreground hover:text-foreground hover:bg-muted/50 -mt-1 -mr-2 transition-transform hover:rotate-90 duration-300"
                                >
                                    <TbX className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        playClickSound()
                                        setShowSettings(true)
                                    }}
                                    className="col-span-2 sm:col-span-1 hover:bg-muted/50 group"
                                >
                                    <TbSettings className="w-4 h-4 mr-2 group-hover:rotate-45 transition-transform" />
                                    პარამეტრები
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleAccept}
                                    className="col-span-2 sm:col-span-1 bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
                                >
                                    <TbCheck className="w-4 h-4 mr-1" />
                                    ყველას მიღება
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                            {/* Settings View */}
                            <div className="flex items-center justify-between pb-2 border-b border-border/50">
                                <h3 className="font-bold flex items-center gap-2">
                                    <TbSettings className="w-5 h-5 text-primary" />
                                    პარამეტრები
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowSettings(false)}
                                    className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                >
                                    უკან
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <div className="text-sm">
                                            <span className="font-medium block">აუცილებელი</span>
                                            <span className="text-xs text-muted-foreground">საიტის მუშაობისთვის</span>
                                        </div>
                                    </div>
                                    <div className="h-5 w-9 bg-primary/20 rounded-full relative cursor-not-allowed opacity-50">
                                        <div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full shadow-sm" />
                                    </div>
                                </div>

                                <label className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full transition-colors ${preferences.analytics ? 'bg-blue-500' : 'bg-gray-400'}`} />
                                        <div className="text-sm">
                                            <span className="font-medium block">ანალიტიკა</span>
                                            <span className="text-xs text-muted-foreground">Google Analytics</span>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={preferences.analytics}
                                        onChange={(e) => {
                                            playClickSound()
                                            setPreferences(p => ({ ...p, analytics: e.target.checked }))
                                        }}
                                        className="w-5 h-5 accent-primary rounded-md"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full transition-colors ${preferences.marketing ? 'bg-purple-500' : 'bg-gray-400'}`} />
                                        <div className="text-sm">
                                            <span className="font-medium block">მარკეტინგი</span>
                                            <span className="text-xs text-muted-foreground">პერსონალური რეკლამა</span>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={preferences.marketing}
                                        onChange={(e) => {
                                            playClickSound()
                                            setPreferences(p => ({ ...p, marketing: e.target.checked }))
                                        }}
                                        className="w-5 h-5 accent-primary rounded-md"
                                    />
                                </label>
                            </div>

                            <Button
                                size="sm"
                                onClick={handleSavePreferences}
                                className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                            >
                                არჩეულის შენახვა
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateX(100%); opacity: 0; }
                }
                @keyframes shimmer-vertical {
                    0% { transform: translateY(-100%); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(100%); opacity: 0; }
                }
                @keyframes gradient-x {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease infinite;
                }
            `}</style>
        </div>
    )
}

// Hook to check cookie consent
export function useCookieConsent(): ConsentStatus {
    const [consent, setConsent] = useState<ConsentStatus>(null)

    useEffect(() => {
        const savedConsent = localStorage.getItem('cookie_consent')
        if (savedConsent?.startsWith('{')) {
            try {
                const parsed = JSON.parse(savedConsent)
                setConsent(parsed.status)
            } catch {
                setConsent(savedConsent as ConsentStatus)
            }
        } else {
            setConsent(savedConsent as ConsentStatus)
        }
    }, [])

    return consent
}

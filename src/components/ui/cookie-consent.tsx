"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TbCookie, TbCheck, TbX, TbSettings } from "react-icons/tb"
import { cn } from "@/lib/utils"

interface CookieConsentProps {
    className?: string
}

export function CookieConsent({ className }: CookieConsentProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const [closeType, setCloseType] = useState<"accept" | "reject" | null>(null)
    const [preferences, setPreferences] = useState({
        necessary: true, // Always required
        analytics: true,
        marketing: false,
    })

    useEffect(() => {
        // Check if consent was already given
        const consent = localStorage.getItem("cookie_consent")
        if (!consent) {
            // Show banner after short delay
            const timer = setTimeout(() => setIsVisible(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const closeBanner = (type: "accept" | "reject") => {
        setCloseType(type)
        setIsClosing(true)
        // Wait for animation before hiding
        setTimeout(() => {
            setIsVisible(false)
            setIsClosing(false)
            setCloseType(null)
        }, 600)
    }

    const handleAcceptAll = () => {
        const consentData = {
            necessary: true,
            analytics: true,
            marketing: true,
            timestamp: Date.now()
        }
        localStorage.setItem("cookie_consent", JSON.stringify(consentData))
        closeBanner("accept")
    }

    const handleRejectNonEssential = () => {
        const consentData = {
            necessary: true,
            analytics: false,
            marketing: false,
            timestamp: Date.now()
        }
        localStorage.setItem("cookie_consent", JSON.stringify(consentData))
        closeBanner("reject")
    }

    const handleSavePreferences = () => {
        const consentData = {
            ...preferences,
            timestamp: Date.now()
        }
        localStorage.setItem("cookie_consent", JSON.stringify(consentData))
        closeBanner(preferences.analytics || preferences.marketing ? "accept" : "reject")
    }

    if (!isVisible) return null

    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-card/95 backdrop-blur-xl border-t",
                "transition-all duration-500 ease-out",
                isClosing ? "translate-y-full opacity-0" : "animate-in slide-in-from-bottom",
                className
            )}
        >
            {/* Feedback overlay when closing */}
            {isClosing && (
                <div className="absolute inset-0 flex items-center justify-center bg-card/90 backdrop-blur-sm z-10">
                    <div className={cn(
                        "flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg transition-all duration-300",
                        closeType === "accept"
                            ? "bg-green-500/20 border border-green-500/30"
                            : "bg-orange-500/20 border border-orange-500/30"
                    )}>
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center animate-bounce",
                            closeType === "accept" ? "bg-green-500" : "bg-orange-500"
                        )}>
                            {closeType === "accept" ? (
                                <TbCheck className="w-7 h-7 text-white" />
                            ) : (
                                <TbX className="w-7 h-7 text-white" />
                            )}
                        </div>
                        <span className="text-lg font-medium">
                            {closeType === "accept" ? "მიღებულია! ✨" : "შენახულია!"}
                        </span>
                    </div>
                </div>
            )}

            <div className="container mx-auto max-w-4xl">
                {!showDetails ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex items-center gap-3 flex-1">
                            <TbCookie className="w-8 h-8 text-orange-400 shrink-0 animate-pulse" />
                            <div>
                                <p className="text-sm">
                                    ვიყენებთ ქუქი-ფაილებს თქვენი გამოცდილების გასაუმჯობესებლად. {" "}
                                    <button
                                        onClick={() => setShowDetails(true)}
                                        className="text-primary underline hover:no-underline"
                                    >
                                        მეტი ინფორმაცია
                                    </button>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <Button variant="ghost" size="sm" onClick={handleRejectNonEssential}>
                                მხოლოდ აუცილებელი
                            </Button>
                            <Button size="sm" onClick={handleAcceptAll}>
                                <TbCheck className="w-4 h-4 mr-1" />
                                ყველას მიღება
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <TbSettings className="w-5 h-5" />
                                ქუქი-ფაილების პარამეტრები
                            </h3>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <TbX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {/* Necessary */}
                            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                                <div>
                                    <p className="font-medium">აუცილებელი ქუქიები</p>
                                    <p className="text-xs text-muted-foreground">
                                        საჭიროა საიტის ძირითადი ფუნქციონირებისთვის
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={true}
                                    disabled
                                    className="w-5 h-5"
                                />
                            </div>

                            {/* Analytics */}
                            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                                <div>
                                    <p className="font-medium">ანალიტიკის ქუქიები</p>
                                    <p className="text-xs text-muted-foreground">
                                        გვეხმარება გავიგოთ როგორ იყენებთ საიტს
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={preferences.analytics}
                                    onChange={(e) => setPreferences(p => ({ ...p, analytics: e.target.checked }))}
                                    className="w-5 h-5"
                                />
                            </div>

                            {/* Marketing */}
                            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                                <div>
                                    <p className="font-medium">მარკეტინგული ქუქიები</p>
                                    <p className="text-xs text-muted-foreground">
                                        პერსონალიზებული რეკლამებისთვის
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={preferences.marketing}
                                    onChange={(e) => setPreferences(p => ({ ...p, marketing: e.target.checked }))}
                                    className="w-5 h-5"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={handleRejectNonEssential}>
                                მხოლოდ აუცილებელი
                            </Button>
                            <Button size="sm" onClick={handleSavePreferences}>
                                შენახვა
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// Utility to check if analytics is allowed
export function isAnalyticsAllowed(): boolean {
    if (typeof window === "undefined") return false

    try {
        const consent = localStorage.getItem("cookie_consent")
        if (!consent) return false
        const parsed = JSON.parse(consent)
        return parsed.analytics === true
    } catch {
        return false
    }
}

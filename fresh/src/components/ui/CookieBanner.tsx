'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { TbX, TbCookie, TbSettings } from 'react-icons/tb'
import Link from 'next/link'

type ConsentStatus = 'pending' | 'accepted' | 'declined' | null

export function CookieBanner() {
    const [consent, setConsent] = useState<ConsentStatus>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check if user has already made a choice
        const savedConsent = localStorage.getItem('cookie_consent') as ConsentStatus
        if (savedConsent) {
            setConsent(savedConsent)
        } else {
            // Show banner after a small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted')
        setConsent('accepted')
        setIsVisible(false)
        // Reload to initialize analytics
        window.location.reload()
    }

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'declined')
        setConsent('declined')
        setIsVisible(false)
    }

    const handleClose = () => {
        setIsVisible(false)
    }

    // Don't render if consent already given or banner not ready
    if (consent || !isVisible) {
        return null
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="container max-w-4xl mx-auto">
                <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 backdrop-blur-xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Icon */}
                        <div className="hidden sm:flex w-12 h-12 rounded-xl bg-primary/10 items-center justify-center flex-shrink-0">
                            <TbCookie className="w-6 h-6 text-primary" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <TbCookie className="w-5 h-5 text-primary sm:hidden" />
                                <h3 className="font-semibold text-foreground">
                                    Cookies-ის გამოყენება
                                </h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                ჩვენ ვიყენებთ cookies-ს საიტის გამოცდილების გასაუმჯობესებლად
                                და ანალიტიკისთვის. აირჩიეთ "მიღება" Google Analytics-ის
                                ჩასართავად, ან "უარყოფა" მხოლოდ აუცილებელი cookies-ით სარგებლობისთვის.
                                {' '}
                                <Link
                                    href="/privacy"
                                    className="text-primary hover:underline inline-flex items-center gap-1"
                                >
                                    <TbSettings className="w-3 h-3" />
                                    მეტი ინფორმაცია
                                </Link>
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDecline}
                                className="flex-1 sm:flex-none"
                            >
                                უარყოფა
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleAccept}
                                className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-accent text-white border-0"
                            >
                                მიღება
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleClose}
                                className="hidden sm:flex text-muted-foreground hover:text-foreground"
                            >
                                <TbX className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Hook to check cookie consent
export function useCookieConsent(): ConsentStatus {
    const [consent, setConsent] = useState<ConsentStatus>(null)

    useEffect(() => {
        const savedConsent = localStorage.getItem('cookie_consent') as ConsentStatus
        setConsent(savedConsent)
    }, [])

    return consent
}

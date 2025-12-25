"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { X, Mail, Gift, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NewsletterPopupProps {
    trigger?: "exit" | "scroll" | "time" | "manual"
    scrollPercentage?: number
    delaySeconds?: number
    className?: string
}

export function NewsletterPopup({
    trigger = "scroll",
    scrollPercentage = 50,
    delaySeconds = 30,
    className,
}: NewsletterPopupProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    useEffect(() => {
        // Check if already dismissed/subscribed
        const dismissed = localStorage.getItem("newsletter-dismissed")
        const subscribed = localStorage.getItem("newsletter-subscribed")
        if (dismissed || subscribed) return

        // Exit intent trigger
        if (trigger === "exit") {
            const handleMouseLeave = (e: MouseEvent) => {
                if (e.clientY < 10) {
                    setIsOpen(true)
                    document.removeEventListener("mouseout", handleMouseLeave)
                }
            }
            document.addEventListener("mouseout", handleMouseLeave)
            return () => document.removeEventListener("mouseout", handleMouseLeave)
        }

        // Scroll trigger
        if (trigger === "scroll") {
            const handleScroll = () => {
                const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                if (scrolled >= scrollPercentage) {
                    setIsOpen(true)
                    window.removeEventListener("scroll", handleScroll)
                }
            }
            window.addEventListener("scroll", handleScroll, { passive: true })
            return () => window.removeEventListener("scroll", handleScroll)
        }

        // Time trigger
        if (trigger === "time") {
            const timer = setTimeout(() => {
                setIsOpen(true)
            }, delaySeconds * 1000)
            return () => clearTimeout(timer)
        }
    }, [trigger, scrollPercentage, delaySeconds])

    const handleClose = () => {
        setIsOpen(false)
        localStorage.setItem("newsletter-dismissed", Date.now().toString())
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setIsSubmitting(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setIsSubmitting(false)
        setIsSubmitted(true)
        localStorage.setItem("newsletter-subscribed", "true")

        // Close after success animation
        setTimeout(() => {
            setIsOpen(false)
        }, 3000)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className={cn(
                    "relative w-full max-w-lg rounded-2xl bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-500",
                    className
                )}
            >
                {/* Decorative gradient */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary to-accent opacity-10" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />

                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 z-10 p-2 rounded-full bg-secondary/80 hover:bg-secondary transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="relative p-8 pt-12">
                    {isSubmitted ? (
                        // Success state
                        <div className="text-center space-y-4 py-8">
                            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Sparkles className="h-8 w-8 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold">გმადლობთ! 🎉</h2>
                            <p className="text-muted-foreground">
                                თქვენ წარმატებით გამოიწერეთ ნიუსლეთერი!
                            </p>
                        </div>
                    ) : (
                        // Form state
                        <>
                            {/* Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl opacity-50" />
                                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                        <Gift className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold mb-2">
                                    🎁 მიიღე ექსკლუზიური AI რჩევები!
                                </h2>
                                <p className="text-muted-foreground">
                                    გამოიწერე ნიუსლეთერი და მიიღე კვირაში ერთხელ საუკეთესო AI ხრიკები და ტუტორიალები
                                </p>
                            </div>

                            {/* Benefits */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {[
                                    "🤖 AI ტუტორიალები",
                                    "⚡ პრომპტ ტემპლეიტები",
                                    "🔥 ახალი ინსტრუმენტები",
                                    "💡 ექსკლუზიური რჩევები",
                                ].map((benefit, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 text-sm text-muted-foreground"
                                    >
                                        <span>{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="შეიყვანე ელ-ფოსტა"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="animate-pulse">იგზავნება...</span>
                                    ) : (
                                        <>
                                            გამოწერა
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            {/* Trust signal */}
                            <p className="text-center text-xs text-muted-foreground mt-4">
                                15,000+ გამომწერი • სპამი არ იქნება • გაუქმება ნებისმიერ დროს
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

// Trigger to manually open newsletter
export function useNewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false)
    return {
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((prev) => !prev),
    }
}

"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TbMail, TbSend, TbLoader2, TbCheck, TbAlertCircle } from "react-icons/tb"
import { motion, AnimatePresence } from "framer-motion"

export function NewsletterForm() {
    const [email, setEmail] = React.useState("")
    const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = React.useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setStatus('submitting')
        setErrorMessage("")

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: "Newsletter Subscriber",
                    email: email,
                    message: "New newsletter subscription request from footer",
                    service: "Newsletter",
                    urgency: "medium",
                    social: "Email Subscription"
                })
            })

            const data = await res.json()

            if (res.ok) {
                setStatus('success')
                setEmail("")
                // Reset success message after 3 seconds
                setTimeout(() => setStatus('idle'), 3000)
            } else {
                setStatus('error')
                setErrorMessage(data.error || 'დაფიქსირდა შეცდომა')
            }
        } catch {
            setStatus('error')
            setErrorMessage('კავშირის შეცდომა')
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <TbMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="შენი ელ-ფოსტა"
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 focus:bg-white/20 h-12 transition-all"
                        disabled={status === 'submitting' || status === 'success'}
                    />
                </div>
                <Button
                    type="submit"
                    size="lg"
                    className={`h-12 px-8 transition-all duration-300 ${status === 'success'
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-white text-primary hover:bg-white/90'
                        }`}
                    disabled={status === 'submitting' || status === 'success'}
                >
                    {status === 'submitting' ? (
                        <TbLoader2 className="w-5 h-5 animate-spin" />
                    ) : status === 'success' ? (
                        <>
                            <TbCheck className="w-5 h-5 mr-2" />
                            გაიგზავნა
                        </>
                    ) : (
                        <>
                            <TbSend className="w-4 h-4 mr-2" />
                            გამოწერა
                        </>
                    )}
                </Button>
            </form>

            <AnimatePresence>
                {status === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-3 flex items-center justify-center gap-2 text-red-300 text-sm bg-red-500/10 p-2 rounded-lg border border-red-500/20"
                    >
                        <TbAlertCircle className="w-4 h-4" />
                        <span>{errorMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

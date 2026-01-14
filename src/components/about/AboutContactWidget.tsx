"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    TbSend,
    TbArrowRight,
    TbCheck,
    TbLoader2,
    TbBrandTelegram,
    TbMessageCircle
} from "react-icons/tb"
import { brand } from "@/lib/brand"

export function AboutContactWidget() {
    const [name, setName] = useState("")
    const [phoneNumberInput, setPhoneNumberInput] = useState("")
    const [message, setMessage] = useState("")
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState("")

    const handleSendMessage = async () => {
        if (!message.trim()) return

        setSending(true)
        setError("")

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim() || 'ანონიმური',
                    email: 'about-page@andrewaltair.ge',
                    phone: phoneNumberInput.trim(),
                    message: message.trim(),
                    service: 'About Page Contact'
                })
            })

            const data = await response.json()

            if (data.success) {
                setSent(true)
                setName("")
                setPhoneNumberInput("")
                setMessage("")
                setTimeout(() => setSent(false), 5000)
            } else {
                setError(data.error || 'შეცდომა გაგზავნისას')
            }
        } catch (err) {
            setError('კავშირის შეცდომა')
        } finally {
            setSending(false)
        }
    }

    return (
        <section className="py-24">
            <div className="container mx-auto px-6 lg:px-12 max-w-[90rem]">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                    {/* Left: Content */}
                    <div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">
                            ავაშენოთ <br />
                            <span className="text-primary">მომავალი.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-12 max-w-lg leading-relaxed">
                            მზად ხართ AI-ს ინტეგრაციისთვის?
                            შეავსეთ ფორმა ან მომწერეთ პირდაპირ მესენჯერებში.
                        </p>

                        <div className="space-y-6">
                            <a href={`mailto:${brand.email}`} className="block text-xl hover:text-primary transition-colors font-medium">
                                {brand.email}
                            </a>
                            <a href="tel:+995599701552" className="block text-xl hover:text-primary transition-colors font-medium">
                                +995 599 701 552
                            </a>
                            <a
                                href="https://t.me/andr3waltair"
                                target="_blank"
                                className="flex items-center gap-2 text-xl hover:text-sky-500 transition-colors font-medium"
                            >
                                <TbBrandTelegram className="w-6 h-6" /> Telegram
                            </a>
                        </div>
                    </div>

                    {/* Right: Form - Enhanced Visuals */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-[2rem] blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-background/80 backdrop-blur-xl border border-white/10 p-8 sm:p-12 rounded-[1.8rem] shadow-2xl">
                            <div className="space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">სახელი</label>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="h-12 bg-muted/40 border-white/10 focus:border-primary/50 focus:bg-background transition-all"
                                            placeholder="თქვენი სახელი"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">ტელეფონი (სავალდებულო)</label>
                                        <Input
                                            value={phoneNumberInput}
                                            onChange={(e) => setPhoneNumberInput(e.target.value)}
                                            className="h-12 bg-muted/40 border-white/10 focus:border-primary/50 focus:bg-background transition-all"
                                            placeholder="+995..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">შეტყობინება</label>
                                    <Textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={4}
                                        className="resize-none bg-muted/40 border-white/10 focus:border-primary/50 focus:bg-background transition-all"
                                        placeholder="მომიყევით პროექტის შესახებ..."
                                    />
                                </div>

                                {error && (
                                    <p className="text-sm text-red-500 font-medium bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</p>
                                )}

                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!message.trim() || !phoneNumberInput.trim() || sending}
                                    className="w-full h-12 text-base rounded-xl font-medium bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                                    size="lg"
                                >
                                    {sent ? (
                                        <>წარმატებით გაიგზავნა <TbCheck className="ml-2" /></>
                                    ) : sending ? (
                                        <>იგზავნება... <TbLoader2 className="ml-2 animate-spin" /></>
                                    ) : (
                                        <>გაგზავნა <TbArrowRight className="ml-2" /></>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

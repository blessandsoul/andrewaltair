"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    TbSend,
    TbBrandTelegram,
    TbPhone,
    TbMail,
    TbCheck,
    TbMessageCircle,
    TbLoader2
} from "react-icons/tb"
import { brand } from "@/lib/brand"

export function AboutContactWidget() {
    const [name, setName] = useState("")
    const [message, setMessage] = useState("")
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState("")

    const telegramUsername = "andr3waltair"
    const phoneNumber = "+995 599 701 552"

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
                    message: message.trim(),
                    service: 'საიტიდან შეტყობინება'
                })
            })

            const data = await response.json()

            if (data.success) {
                setSent(true)
                setName("")
                setMessage("")
                setTimeout(() => setSent(false), 5000)
            } else {
                setError(data.error || 'შეცდომა გაგზავნისას')
            }
        } catch (err) {
            setError('შეტყობინების გაგზავნა ვერ მოხერხდა')
        } finally {
            setSending(false)
        }
    }

    return (
        <section className="py-20 lg:py-28 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

            <div className="container relative mx-auto px-4 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 mb-4 text-accent">
                        <TbMessageCircle className="w-6 h-6" />
                        <span className="text-sm font-bold uppercase tracking-widest">კონტაქტი</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold">
                        დამიწერე <span className="text-gradient">პირდაპირ</span>
                    </h2>
                    <p className="text-muted-foreground mt-4">
                        შეკითხვა, იდეა, თანამშრომლობა — მზად ვარ მოსასმენად
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-card/50 backdrop-blur-md rounded-3xl border border-white/10 p-8"
                    >
                        {/* Profile photo */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/30">
                                <Image
                                    src="/i.png"
                                    alt="Andrew Altair"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold">გაგზავნე შეტყობინება</h3>
                                <p className="text-sm text-muted-foreground">პირდაპირ Telegram-ში მივიღებ</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Input
                                placeholder="შენი სახელი (არასავალდებულო)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-background/50 border-white/10 focus:border-primary/50"
                            />
                            <Textarea
                                placeholder="დაწერე შეტყობინება..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                className="bg-background/50 border-white/10 focus:border-primary/50 resize-none"
                            />

                            {error && (
                                <p className="text-sm text-red-500">{error}</p>
                            )}

                            <Button
                                onClick={handleSendMessage}
                                disabled={!message.trim() || sending}
                                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white gap-2"
                            >
                                {sent ? (
                                    <>
                                        <TbCheck className="w-4 h-4" />
                                        გაიგზავნა წარმატებით!
                                    </>
                                ) : sending ? (
                                    <>
                                        <TbLoader2 className="w-4 h-4 animate-spin" />
                                        იგზავნება...
                                    </>
                                ) : (
                                    <>
                                        <TbSend className="w-4 h-4" />
                                        გაგზავნა
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.div>

                    {/* Quick Contact Options */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        {/* Telegram Direct */}
                        <a
                            href={`https://t.me/${telegramUsername}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-white/10 hover:border-sky-500/30 hover:bg-sky-500/5 transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 bg-sky-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <TbBrandTelegram className="w-7 h-7 text-sky-500" />
                            </div>
                            <div className="flex-grow">
                                <div className="font-bold text-lg">Telegram</div>
                                <div className="text-muted-foreground">@{telegramUsername}</div>
                            </div>
                            <TbSend className="w-5 h-5 text-muted-foreground group-hover:text-sky-500 transition-colors" />
                        </a>

                        {/* Phone */}
                        <a
                            href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                            className="flex items-center gap-4 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <TbPhone className="w-7 h-7 text-emerald-500" />
                            </div>
                            <div className="flex-grow">
                                <div className="font-bold text-lg">ტელეფონი</div>
                                <div className="text-muted-foreground">{phoneNumber}</div>
                            </div>
                            <TbPhone className="w-5 h-5 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                        </a>

                        {/* Email */}
                        <a
                            href={`mailto:${brand.email}`}
                            className="flex items-center gap-4 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-white/10 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <TbMail className="w-7 h-7 text-primary" />
                            </div>
                            <div className="flex-grow">
                                <div className="font-bold text-lg">Email</div>
                                <div className="text-muted-foreground">{brand.email}</div>
                            </div>
                            <TbSend className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

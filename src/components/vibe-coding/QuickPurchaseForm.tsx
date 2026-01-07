"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    TbSend,
    TbLoader2,
    TbBrandTelegram,
    TbUser,
    TbMail,
    TbPhone,
    TbLink,
    TbCheck,
    TbAlertCircle
} from "react-icons/tb"
import { motion } from "framer-motion"

interface QuickPurchaseFormProps {
    defaultValues?: {
        service?: string
        message?: string
    }
    onSuccess: () => void
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function QuickPurchaseForm({ defaultValues, onSuccess }: QuickPurchaseFormProps) {
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        phone: "",
        social: "",
        service: defaultValues?.service || "Vibe Coding Premium",
        message: defaultValues?.message || "Purchase Request",
        urgency: "high" // Default high urgency for purchases
    })
    const [status, setStatus] = React.useState<FormStatus>('idle')
    const [errorMessage, setErrorMessage] = React.useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('submitting')
        setErrorMessage("")

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (res.ok) {
                setStatus('success')
                onSuccess()
            } else {
                setStatus('error')
                setErrorMessage(data.error || 'დაფიქსირდა შეცდომა')
            }
        } catch {
            setStatus('error')
            setErrorMessage('კავშირის შეცდომა. სცადეთ თავიდან.')
        }
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    }

    if (status === 'success') return null

    return (
        <motion.form
            variants={container}
            initial="hidden"
            animate="show"
            onSubmit={handleSubmit}
            className="space-y-4 pt-2"
        >

            {/* Name */}
            <motion.div variants={item} className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-purple-500">
                    <TbUser className="w-5 h-5" />
                </div>
                <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="სახელი და გვარი *"
                    className="pl-10 h-12 bg-secondary/30 border-border/50 focus:border-purple-500 transition-all rounded-xl"
                />
            </motion.div>

            {/* Email */}
            <motion.div variants={item} className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-purple-500">
                    <TbMail className="w-5 h-5" />
                </div>
                <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ელ-ფოსტა *"
                    className="pl-10 h-12 bg-secondary/30 border-border/50 focus:border-purple-500 transition-all rounded-xl"
                />
            </motion.div>

            {/* Phone */}
            <motion.div variants={item} className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-purple-500">
                    <TbPhone className="w-5 h-5" />
                </div>
                <Input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="ტელეფონი *"
                    className="pl-10 h-12 bg-secondary/30 border-border/50 focus:border-purple-500 transition-all rounded-xl"
                />
            </motion.div>

            {/* Social Link */}
            <motion.div variants={item} className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-purple-500">
                    <TbLink className="w-5 h-5" />
                </div>
                <Input
                    required
                    value={formData.social}
                    onChange={(e) => setFormData({ ...formData, social: e.target.value })}
                    placeholder="Link to Social Network (Telegram/FB) *"
                    className="pl-10 h-12 bg-secondary/30 border-border/50 focus:border-purple-500 transition-all rounded-xl"
                />
            </motion.div>

            {/* Error Message */}
            {status === 'error' && (
                <motion.div variants={item} className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    <TbAlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                </motion.div>
            )}

            {/* Submit Button */}
            <motion.div variants={item}>
                <Button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full h-12 mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all text-white font-semibold text-base shadow-lg shadow-purple-500/20 rounded-xl"
                >
                    {status === 'submitting' ? (
                        <>
                            <TbLoader2 className="w-5 h-5 animate-spin mr-2" />
                            იგზავნება...
                        </>
                    ) : (
                        <>
                            <TbSend className="w-5 h-5 mr-2" />
                            გაგზავნა
                        </>
                    )}
                </Button>
            </motion.div>

            <motion.p variants={item} className="text-xs text-center text-muted-foreground">
                პასუხს მიიღებთ მითითებულ სოც. ქსელში ან ელ-ფოსტაზე.
            </motion.p>
        </motion.form>
    )
}

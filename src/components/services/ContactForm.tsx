"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    TbSend,
    TbCheck,
    TbAlertCircle,
    TbLoader2,
    TbBrandTelegram,
    TbUser,
    TbMail,
    TbPhone,
    TbBriefcase,
    TbCurrencyDollar,
    TbMessage,
    TbFlame,
    TbClock,
    TbSparkles,
    TbRocket,
    TbShieldCheck
} from "react-icons/tb"

interface Service {
    id: string
    title: string
}

interface ContactFormProps {
    services: Service[]
    defaultValues?: {
        service?: string
        message?: string
        budget?: string
    }
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'
type Urgency = 'low' | 'medium' | 'high' | 'urgent'

export function ContactForm({ services, defaultValues }: ContactFormProps) {
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        phone: "",
        service: defaultValues?.service || "",
        budget: defaultValues?.budget || "",
        message: defaultValues?.message || "",
        urgency: "medium" as Urgency
    })
    const [status, setStatus] = React.useState<FormStatus>('idle')
    const [errorMessage, setErrorMessage] = React.useState("")
    const [focusedField, setFocusedField] = React.useState<string | null>(null)

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
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    service: "",
                    budget: "",
                    message: "",
                    urgency: "medium"
                })
            } else {
                setStatus('error')
                setErrorMessage(data.error || 'დაფიქსირდა შეცდომა')
            }
        } catch {
            setStatus('error')
            setErrorMessage('კავშირის შეცდომა. სცადეთ თავიდან.')
        }
    }

    const urgencyOptions = [
        { value: 'low', label: 'დაბალი', icon: TbClock, color: 'text-green-500', bgColor: 'bg-green-500/10 border-green-500/30', hoverBg: 'hover:bg-green-500/20' },
        { value: 'medium', label: 'საშუალო', icon: TbClock, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10 border-yellow-500/30', hoverBg: 'hover:bg-yellow-500/20' },
        { value: 'high', label: 'მაღალი', icon: TbFlame, color: 'text-orange-500', bgColor: 'bg-orange-500/10 border-orange-500/30', hoverBg: 'hover:bg-orange-500/20' },
        { value: 'urgent', label: 'სასწრაფო!', icon: TbRocket, color: 'text-red-500', bgColor: 'bg-red-500/10 border-red-500/30 animate-pulse', hoverBg: 'hover:bg-red-500/20' },
    ]

    const budgetOptions = [
        { value: '< 500', label: '< 500 ₾' },
        { value: '500-1000', label: '500 - 1000 ₾' },
        { value: '1000-2500', label: '1000 - 2500 ₾' },
        { value: '2500-5000', label: '2500 - 5000 ₾' },
        { value: '5000+', label: '5000+ ₾' },
    ]

    if (status === 'success') {
        return (
            <Card className="overflow-hidden border-green-500/30 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-green-500/10 shadow-2xl">
                <CardContent className="p-10 text-center">
                    <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/30 animate-in zoom-in-50 duration-700">
                        <TbCheck className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        შეტყობინება გაგზავნილია!
                    </h3>
                    <p className="text-muted-foreground mb-8 text-lg">
                        თქვენი მოთხოვნა Telegram-ზე გადაიგზავნა.<br />
                        დაგიკავშირდებით 24 საათის განმავლობაში.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-6">
                        <TbBrandTelegram className="w-5 h-5" />
                        გაგზავნილია Telegram-ით
                    </div>
                    <div className="pt-4">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setStatus('idle')}
                            className="gap-2"
                        >
                            <TbMessage className="w-5 h-5" />
                            კიდევ ერთი შეტყობინება
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="relative">
            {/* Animated background effects */}
            <div className="absolute -inset-6 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 rounded-3xl blur-3xl opacity-40" />
            <div className="absolute -inset-3 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-60 animate-pulse" />

            <Card className="relative overflow-hidden border-0 shadow-2xl bg-card/95 backdrop-blur-xl">
                {/* Animated gradient header */}
                <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient" />

                <CardContent className="p-8 lg:p-10">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/30">
                                <TbBrandTelegram className="w-7 h-7 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">სწრაფი კავშირი</h3>
                            <p className="text-muted-foreground flex items-center gap-1.5">
                                <TbSparkles className="w-4 h-4 text-primary" />
                                პირდაპირი პასუხი Telegram-ით
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name & Email */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className={`relative group transition-all duration-300 ${focusedField === 'name' ? 'scale-[1.02]' : ''}`}>
                                <TbUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="თქვენი სახელი *"
                                    className="pl-12 h-14 bg-secondary/30 border-border/50 focus:border-primary focus:bg-secondary/50 transition-all text-base"
                                />
                            </div>
                            <div className={`relative group transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                                <TbMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="ელ-ფოსტა *"
                                    className="pl-12 h-14 bg-secondary/30 border-border/50 focus:border-primary focus:bg-secondary/50 transition-all text-base"
                                />
                            </div>
                        </div>

                        {/* Phone & Service - Shadcn Select */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className={`relative group transition-all duration-300 ${focusedField === 'phone' ? 'scale-[1.02]' : ''}`}>
                                <TbPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                                <Input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    onFocus={() => setFocusedField('phone')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="ტელეფონი (არასავალდებულო)"
                                    className="pl-12 h-14 bg-secondary/30 border-border/50 focus:border-primary focus:bg-secondary/50 transition-all text-base"
                                />
                            </div>
                            <div className="relative">
                                <TbBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                                <Select
                                    value={formData.service}
                                    onValueChange={(value) => setFormData({ ...formData, service: value })}
                                >
                                    <SelectTrigger className="h-14 pl-12 bg-secondary/30 border-border/50 focus:border-primary focus:ring-primary/20 text-base">
                                        <SelectValue placeholder="აირჩიეთ სერვისი" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {services.map((service) => (
                                            <SelectItem key={service.id} value={service.title}>
                                                {service.title}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="სხვა">სხვა</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Budget Selection - Shadcn Select */}
                        <div>
                            <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                                <TbCurrencyDollar className="w-4 h-4 text-primary" />
                                სავარაუდო ბიუჯეტი
                            </label>
                            <Select
                                value={formData.budget}
                                onValueChange={(value) => setFormData({ ...formData, budget: value })}
                            >
                                <SelectTrigger className="h-12 bg-secondary/30 border-border/50 focus:border-primary">
                                    <SelectValue placeholder="აირჩიეთ ბიუჯეტი" />
                                </SelectTrigger>
                                <SelectContent>
                                    {budgetOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Urgency Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                                <TbFlame className="w-4 h-4 text-orange-500" />
                                პრიორიტეტი
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {urgencyOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, urgency: option.value as Urgency })}
                                        className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${formData.urgency === option.value
                                            ? `${option.bgColor} ${option.color} font-semibold scale-105 shadow-lg`
                                            : `bg-secondary/20 border-border/30 text-muted-foreground ${option.hoverBg}`
                                            }`}
                                    >
                                        <option.icon className={`w-6 h-6 mx-auto mb-2 ${formData.urgency === option.value ? option.color : 'text-muted-foreground'}`} />
                                        <span className="text-sm block">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message */}
                        <div className={`transition-all duration-300 ${focusedField === 'message' ? 'scale-[1.01]' : ''}`}>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <TbMessage className="w-4 h-4 text-primary" />
                                შეტყობინება *
                            </label>
                            <Textarea
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                onFocus={() => setFocusedField('message')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="მოგვიყევით თქვენი პროექტის, იდეის ან გამოწვევის შესახებ..."
                                className="min-h-[160px] bg-secondary/30 border-border/50 focus:border-primary focus:bg-secondary/50 transition-all resize-none text-base"
                            />
                        </div>

                        {/* Error message */}
                        {status === 'error' && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 animate-in slide-in-from-top-2">
                                <TbAlertCircle className="w-6 h-6 shrink-0" />
                                <span className="font-medium">{errorMessage}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            size="lg"
                            disabled={status === 'submitting'}
                            className="w-full h-16 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] hover:bg-[position:100%_0] text-white font-bold text-lg shadow-2xl shadow-primary/30 transition-all duration-500 disabled:opacity-70 gap-2"
                        >
                            {status === 'submitting' ? (
                                <>
                                    <TbLoader2 className="w-6 h-6 animate-spin" />
                                    იგზავნება...
                                </>
                            ) : (
                                <>
                                    <TbSend className="w-6 h-6" />
                                    გაგზავნა Telegram-ზე
                                </>
                            )}
                        </Button>

                        {/* Footer */}
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <TbShieldCheck className="w-4 h-4 text-green-500" />
                            თქვენი მონაცემები უსაფრთხოა • პასუხი 24 საათში
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

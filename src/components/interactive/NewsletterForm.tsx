"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TbSend, TbCheck, TbLoader2 } from "react-icons/tb"
import { cn } from "@/lib/utils"
import { useVisitorTracking } from "@/hooks/useVisitorTracking"

const newsletterSchema = z.object({
    email: z.string().email('გთხოვთ შეიყვანოთ სწორი ელფოსტა'),
})
type NewsletterFormData = z.infer<typeof newsletterSchema>

interface NewsletterFormProps {
    className?: string
    variant?: "default" | "inline" | "compact"
    showTitle?: boolean
    buttonText?: string
    placeholder?: string
}

export function NewsletterForm({
    className,
    variant = "default",
    showTitle = true,
    buttonText = "გამოწერა",
    placeholder = "შენი ელფოსტა..."
}: NewsletterFormProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")
    const { visitorId, recordActivity } = useVisitorTracking()

    const { register, handleSubmit, formState: { errors }, reset } = useForm<NewsletterFormData>({
        resolver: zodResolver(newsletterSchema),
    })

    const onSubmit = async (formData: NewsletterFormData) => {
        if (status === "loading") return

        setStatus("loading")

        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, visitorId })
            })

            const data = await res.json()

            if (res.ok) {
                setStatus("success")
                setMessage(data.message || "გამოწერა წარმატებით შესრულდა!")
                reset()

                // Track on client side for immediate social proof
                recordActivity("subscribe", {
                    metadata: { displayName: formData.email.replace(/(.{2}).*@/, "$1***@") },
                    isPublic: true
                })
            } else {
                setStatus("error")
                setMessage(data.error || "შეცდომა მოხდა")
            }
        } catch (error) {
            setStatus("error")
            setMessage("კავშირის შეცდომა. სცადეთ მოგვიანებით.")
        }

        // Reset after 5 seconds
        setTimeout(() => {
            if (status !== "idle") {
                setStatus("idle")
                setMessage("")
            }
        }, 5000)
    }

    if (variant === "compact") {
        return (
            <form onSubmit={handleSubmit(onSubmit)} className={cn("flex gap-2", className)}>
                <Input
                    type="email"
                    {...register('email')}
                    placeholder={placeholder}
                    aria-label="ელ-ფოსტის მისამართი"
                    disabled={status === "loading" || status === "success"}
                    className="flex-1 h-9"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'compact-email-error' : undefined}
                />
                <Button
                    type="submit"
                    size="sm"
                    disabled={status === "loading" || status === "success"}
                >
                    {status === "loading" ? (
                        <TbLoader2 className="w-4 h-4 animate-spin" />
                    ) : status === "success" ? (
                        <TbCheck className="w-4 h-4" />
                    ) : (
                        <TbSend className="w-4 h-4" />
                    )}
                </Button>
                {errors.email && (
                    <p id="compact-email-error" className="sr-only">{errors.email.message}</p>
                )}
            </form>
        )
    }

    if (variant === "inline") {
        return (
            <div className={cn("space-y-2", className)}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
                    <Input
                        type="email"
                        {...register('email')}
                        placeholder={placeholder}
                        aria-label="ელ-ფოსტის მისამართი"
                        disabled={status === "loading" || status === "success"}
                        className="flex-1"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'inline-email-error' : undefined}
                    />
                    <Button type="submit" disabled={status === "loading" || status === "success"}>
                        {status === "loading" ? (
                            <TbLoader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : status === "success" ? (
                            <TbCheck className="w-4 h-4 mr-2" />
                        ) : (
                            <TbSend className="w-4 h-4 mr-2" />
                        )}
                        {buttonText}
                    </Button>
                </form>
                {errors.email && (
                    <p id="inline-email-error" className="text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}
                {message && (
                    <p className={cn(
                        "text-sm",
                        status === "success" ? "text-green-500" : "text-red-500"
                    )}>
                        {message}
                    </p>
                )}
            </div>
        )
    }

    // Default variant
    return (
        <div className={cn("space-y-4", className)}>
            {showTitle && (
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold">გამოიწერე ნიუსლეთერი</h3>
                    <p className="text-sm text-muted-foreground">
                        მიიღე ახალი AI სტატიები პირველმა
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div>
                    <Input
                        type="email"
                        {...register('email')}
                        placeholder={placeholder}
                        disabled={status === "loading" || status === "success"}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'default-email-error' : undefined}
                    />
                    {errors.email && (
                        <p id="default-email-error" className="text-sm text-red-500 mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>
                <Button
                    type="submit"
                    className="w-full"
                    disabled={status === "loading" || status === "success"}
                >
                    {status === "loading" ? (
                        <>
                            <TbLoader2 className="w-4 h-4 animate-spin mr-2" />
                            იგზავნება...
                        </>
                    ) : status === "success" ? (
                        <>
                            <TbCheck className="w-4 h-4 mr-2" />
                            გამოწერილია!
                        </>
                    ) : (
                        <>
                            <TbSend className="w-4 h-4 mr-2" />
                            {buttonText}
                        </>
                    )}
                </Button>
            </form>

            {message && (
                <p className={cn(
                    "text-sm text-center",
                    status === "success" ? "text-green-500" : "text-red-500"
                )}>
                    {message}
                </p>
            )}
        </div>
    )
}

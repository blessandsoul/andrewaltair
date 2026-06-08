"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TbSend, TbCheck, TbLoader2 } from "react-icons/tb"
import { cn } from "@/lib/utils"

// Presence only — ANY format accepted (no phone-format validation, per requirement).
const phoneSchema = z.object({
    phone: z.string().min(1, "გთხოვთ შეიყვანოთ ტელეფონის ნომერი"),
})
type PhoneFormData = z.infer<typeof phoneSchema>

interface PhoneSubscribeFormProps {
    className?: string
    buttonText?: string
    placeholder?: string
}

export function PhoneSubscribeForm({
    className,
    buttonText = "გამოწერა",
    placeholder = "შენი ტელეფონის ნომერი...",
}: PhoneSubscribeFormProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    const { register, handleSubmit, formState: { errors }, reset } = useForm<PhoneFormData>({
        resolver: zodResolver(phoneSchema),
    })

    const onSubmit = async (formData: PhoneFormData) => {
        if (status === "loading") return

        setStatus("loading")

        try {
            const res = await fetch("/api/phone-lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: formData.phone, page: window.location.pathname }),
            })

            const data = await res.json()

            if (res.ok) {
                setStatus("success")
                setMessage(data.message || "გმადლობთ! მალე დაგიკავშირდებით.")
                reset()
            } else {
                setStatus("error")
                // apiError nests under error.message — not a flat string.
                setMessage(data?.error?.message || "შეცდომა მოხდა")
            }
        } catch {
            setStatus("error")
            setMessage("კავშირის შეცდომა. სცადეთ მოგვიანებით.")
        }

        // Reset to idle after 5 seconds
        setTimeout(() => {
            setStatus("idle")
            setMessage("")
        }, 5000)
    }

    return (
        <div className={cn("space-y-2", className)}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
                <Input
                    type="tel"
                    inputMode="tel"
                    {...register("phone")}
                    placeholder={placeholder}
                    aria-label="ტელეფონის ნომერი"
                    disabled={status === "loading" || status === "success"}
                    className="flex-1"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-lead-error" : undefined}
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
            {errors.phone && (
                <p id="phone-lead-error" className="text-sm text-red-500">
                    {errors.phone.message}
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

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TbSend, TbCheck, TbLoader2 } from "react-icons/tb"
import { cn } from "@/lib/utils"
import { useVisitorTracking } from "@/hooks/useVisitorTracking"

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
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")
    const { visitorId, recordActivity } = useVisitorTracking()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim() || status === "loading") return

        setStatus("loading")

        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, visitorId })
            })

            const data = await res.json()

            if (res.ok) {
                setStatus("success")
                setMessage(data.message || "გამოწერა წარმატებით შესრულდა!")
                setEmail("")

                // 🎯 Also track on client side for immediate social proof
                recordActivity("subscribe", {
                    metadata: { displayName: email.replace(/(.{2}).*@/, "$1***@") },
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
            <form onSubmit={handleSubmit} className={cn("flex gap-2", className)}>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    required
                    disabled={status === "loading" || status === "success"}
                    className="flex-1 h-9"
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
            </form>
        )
    }

    if (variant === "inline") {
        return (
            <div className={cn("space-y-2", className)}>
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={placeholder}
                        required
                        disabled={status === "loading" || status === "success"}
                        className="flex-1"
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

            <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    required
                    disabled={status === "loading" || status === "success"}
                />
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

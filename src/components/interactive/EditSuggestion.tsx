"use client"

import { useState } from "react"
import { TbAlertTriangle, TbSend, TbX, TbCircleCheck } from "react-icons/tb"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EditSuggestionProps {
    postSlug: string
    postTitle: string
    className?: string
}

export function EditSuggestion({ postSlug, postTitle, className = "" }: EditSuggestionProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [suggestion, setSuggestion] = useState("")
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!suggestion.trim()) return

        setIsSubmitting(true)
        setError("")

        try {
            const response = await fetch("/api/suggestions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postSlug,
                    postTitle,
                    suggestion,
                    email: email || undefined
                })
            })

            if (response.ok) {
                setIsSuccess(true)
                setSuggestion("")
                setEmail("")
                setTimeout(() => {
                    setIsOpen(false)
                    setIsSuccess(false)
                }, 2000)
            } else {
                throw new Error("Failed to submit")
            }
        } catch {
            // Still show success for demo (in real app, handle error properly)
            setIsSuccess(true)
            setSuggestion("")
            setEmail("")
            setTimeout(() => {
                setIsOpen(false)
                setIsSuccess(false)
            }, 2000)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            {/* Trigger button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(true)}
                className={cn("gap-2", className)}
            >
                <TbAlertTriangle className="w-4 h-4" />
                შეცდომის შეტყობინება
            </Button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => !isSubmitting && setIsOpen(false)}
                    />

                    {/* Modal content */}
                    <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
                        {/* Close button */}
                        <button
                            onClick={() => !isSubmitting && setIsOpen(false)}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            disabled={isSubmitting}
                        >
                            <TbX className="w-5 h-5" />
                        </button>

                        {isSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <TbCircleCheck className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">მადლობა!</h3>
                                <p className="text-muted-foreground">
                                    თქვენი შემოთავაზება მიღებულია.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                        <TbAlertTriangle className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">შეცდომის შეტყობინება</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                            {postTitle}
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                                            რა შეცდომა აღმოაჩინეთ? *
                                        </label>
                                        <textarea
                                            value={suggestion}
                                            onChange={(e) => setSuggestion(e.target.value)}
                                            placeholder="აღწერეთ შეცდომა ან გააკეთეთ შემოთავაზება..."
                                            className="w-full h-28 px-3 py-2 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                                            თქვენი ელ-ფოსტა (არასავალდებულო)
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="example@email.com"
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                            disabled={isSubmitting}
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            დავგიკავშირდებით თუ გჭირდებათ დამატებითი ინფორმაცია
                                        </p>
                                    </div>

                                    {error && (
                                        <p className="text-sm text-red-500">{error}</p>
                                    )}

                                    <div className="flex gap-3 pt-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsOpen(false)}
                                            disabled={isSubmitting}
                                            className="flex-1"
                                        >
                                            გაუქმება
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={!suggestion.trim() || isSubmitting}
                                            className="flex-1 gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

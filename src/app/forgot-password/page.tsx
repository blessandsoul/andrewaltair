"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TbMail, TbArrowLeft } from "react-icons/tb"

export default function ForgotPasswordPage() {
    const [email, setEmail] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [isSubmitted, setIsSubmitted] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call for now
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSubmitted(true)
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
            <div className="w-full max-w-md">
                <Card className="border-border/50 shadow-xl backdrop-blur-sm">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-2xl">პაროლის აღდგენა</CardTitle>
                        <CardDescription>
                            შეიყვანეთ თქვენი ელფოსტა პაროლის აღსადგენად
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isSubmitted ? (
                            <div className="text-center space-y-4">
                                <div className="p-4 bg-green-500/10 text-green-500 rounded-lg">
                                    ინსტრუქცია გამოგზავნილია თქვენს ელფოსტაზე
                                </div>
                                <Link href="/login">
                                    <Button variant="outline" className="w-full">
                                        უკან დაბრუნება
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <TbMail className="w-4 h-4 text-muted-foreground" />
                                        ელფოსტა
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "იგზავნება..." : "აღდგენა"}
                                </Button>
                                <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                                    <TbArrowLeft className="w-4 h-4" />
                                    შესვლა
                                </Link>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

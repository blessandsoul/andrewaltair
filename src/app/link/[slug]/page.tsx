"use client"

import * as React from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TbLock, TbArrowRight, TbLink } from "react-icons/tb"

export default function LinkRedirectPage() {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const slug = params.slug as string

    const [mode, setMode] = React.useState<"loading" | "password" | "redirect" | "error">("loading")
    const [password, setPassword] = React.useState("")
    const [error, setError] = React.useState("")
    const [linkData, setLinkData] = React.useState<{
        title?: string
        delay: number
        message?: string
        originalUrl: string
    } | null>(null)
    const [countdown, setCountdown] = React.useState(0)

    React.useEffect(() => {
        const checkLink = async () => {
            try {
                const utmParams = new URLSearchParams()
                searchParams.forEach((value, key) => {
                    if (key !== 'pwd') utmParams.set(key, value)
                })
                const pwd = searchParams.get("pwd")
                const url = `/api/link/${slug}?${utmParams}${pwd ? `&pwd=${pwd}` : ''}`
                const res = await fetch(url)
                const json = await res.json()

                if (!json.success) {
                    if (json.error?.code === 'LINK_PASSWORD_REQUIRED') {
                        setMode("password")
                    } else {
                        setMode("error")
                        setError(json.error?.message || "Link not found")
                    }
                    return
                }

                if (json.data.showRedirectPage) {
                    setLinkData(json.data)
                    setCountdown(json.data.delay)
                    setMode("redirect")
                } else {
                    window.location.href = json.data.originalUrl
                }
            } catch {
                setMode("error")
                setError("Something went wrong")
            }
        }
        checkLink()
    }, [slug, searchParams])

    // Countdown timer
    React.useEffect(() => {
        if (mode !== "redirect" || countdown <= 0 || !linkData) return
        const timer = setTimeout(() => {
            if (countdown <= 1) {
                window.location.href = linkData.originalUrl
            } else {
                setCountdown(countdown - 1)
            }
        }, 1000)
        return () => clearTimeout(timer)
    }, [mode, countdown, linkData])

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const utmParams = new URLSearchParams()
            searchParams.forEach((value, key) => {
                if (key !== 'pwd') utmParams.set(key, value)
            })
            const res = await fetch(`/api/link/${slug}?${utmParams}&pwd=${encodeURIComponent(password)}`)
            const json = await res.json()
            if (!json.success) {
                setError(json.error?.message || "Wrong password")
                return
            }
            if (json.data.showRedirectPage) {
                setLinkData(json.data)
                setCountdown(json.data.delay)
                setMode("redirect")
            } else {
                window.location.href = json.data.originalUrl
            }
        } catch {
            setError("Something went wrong")
        }
    }

    if (mode === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-pulse flex items-center gap-2 text-muted-foreground">
                    <TbLink className="w-5 h-5 animate-spin" />
                    <span>Loading...</span>
                </div>
            </div>
        )
    }

    if (mode === "password") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                            <TbLock className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h1 className="text-xl font-bold">Protected Link</h1>
                        <p className="text-sm text-muted-foreground mt-1">Enter password to continue</p>
                    </div>
                    <form onSubmit={handlePasswordSubmit} className="space-y-3">
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError("") }}
                            autoFocus
                        />
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <Button type="submit" className="w-full gap-2">
                            <TbArrowRight className="w-4 h-4" />
                            Continue
                        </Button>
                    </form>
                </div>
            </div>
        )
    }

    if (mode === "redirect" && linkData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="w-full max-w-md text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <TbLink className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">
                        {linkData.message || "Redirecting..."}
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        {linkData.title || linkData.originalUrl}
                    </p>
                    <div className="text-4xl font-bold text-indigo-500 mb-6">{countdown}</div>
                    <Button
                        onClick={() => { window.location.href = linkData.originalUrl }}
                        className="gap-2"
                    >
                        <TbArrowRight className="w-4 h-4" />
                        Go now
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                        Powered by Andrew Altair
                    </p>
                </div>
            </div>
        )
    }

    // Error state
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Link Not Available</h1>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => router.push("/")} variant="outline">
                    Go to Homepage
                </Button>
            </div>
        </div>
    )
}

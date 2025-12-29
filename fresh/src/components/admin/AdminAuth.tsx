"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Eye, EyeOff, Shield, AlertCircle, Smartphone, CheckCircle } from "lucide-react"

// Simple password for admin access
// In production, this should be an environment variable and proper auth
const ADMIN_PASSWORD = "admin123"

interface AdminAuthProps {
    children: React.ReactNode
}

export function AdminAuth({ children }: AdminAuthProps) {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false)
    const [password, setPassword] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const [error, setError] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(true)

    // 2FA state
    const [twoFAEnabled, setTwoFAEnabled] = React.useState(false)
    const [show2FA, setShow2FA] = React.useState(false)
    const [otpCode, setOtpCode] = React.useState("")
    const [otpError, setOtpError] = React.useState("")

    // Check for existing session on mount
    React.useEffect(() => {
        const session = sessionStorage.getItem("admin_auth")
        const twoFA = localStorage.getItem("admin_2fa_enabled")
        if (session === "authenticated") {
            setIsAuthenticated(true)
        }
        if (twoFA === "true") {
            setTwoFAEnabled(true)
        }
        setIsLoading(false)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password === ADMIN_PASSWORD) {
            if (twoFAEnabled) {
                // Show 2FA step
                setShow2FA(true)
            } else {
                // Complete login
                sessionStorage.setItem("admin_auth", "authenticated")
                setIsAuthenticated(true)
            }
        } else {
            setError("არასწორი პაროლი")
            setPassword("")
        }
    }

    const handleVerify2FA = (e: React.FormEvent) => {
        e.preventDefault()
        setOtpError("")

        // Demo: accept any 6-digit code
        if (otpCode.length === 6 && /^\d+$/.test(otpCode)) {
            sessionStorage.setItem("admin_auth", "authenticated")
            setIsAuthenticated(true)
            setShow2FA(false)
        } else {
            setOtpError("შეიყვანეთ 6-ნიშნა კოდი")
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem("admin_auth")
        setIsAuthenticated(false)
        setPassword("")
        setOtpCode("")
        setShow2FA(false)
    }

    const toggle2FA = () => {
        const newValue = !twoFAEnabled
        setTwoFAEnabled(newValue)
        localStorage.setItem("admin_2fa_enabled", String(newValue))
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    // 2FA verification step
    if (show2FA) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Smartphone className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl">2FA ვერიფიკაცია</CardTitle>
                        <p className="text-muted-foreground mt-2">
                            შეიყვანეთ 6-ნიშნა კოდი თქვენი Authenticator აპიდან
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleVerify2FA} className="space-y-4">
                            <div className="flex justify-center gap-2">
                                <Input
                                    type="text"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    placeholder="000000"
                                    className="text-center text-2xl tracking-[0.5em] w-48 font-mono"
                                    maxLength={6}
                                    autoFocus
                                />
                            </div>

                            {otpError && (
                                <div className="flex items-center justify-center gap-2 text-destructive text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {otpError}
                                </div>
                            )}

                            <Button type="submit" className="w-full">
                                ვერიფიკაცია
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full"
                                onClick={() => setShow2FA(false)}
                            >
                                უკან დაბრუნება
                            </Button>
                        </form>

                        <p className="text-xs text-muted-foreground text-center mt-6">
                            დემო: შეიყვანეთ ნებისმიერი 6 ციფრი
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Not authenticated - show login
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl">Admin Panel</CardTitle>
                        <p className="text-muted-foreground mt-2">
                            შესვლისთვის შეიყვანეთ პაროლი
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">პაროლი</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* 2FA Toggle */}
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">2FA ავტორიზაცია</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={toggle2FA}
                                    className={`w-10 h-6 rounded-full transition-colors ${twoFAEnabled ? "bg-indigo-500" : "bg-muted-foreground/30"
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white transition-transform mx-1 ${twoFAEnabled ? "translate-x-4" : ""
                                        }`} />
                                </button>
                            </div>

                            {twoFAEnabled && (
                                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-500/10 p-2 rounded-lg">
                                    <CheckCircle className="w-4 h-4" />
                                    2FA ჩართულია
                                </div>
                            )}

                            {error && (
                                <div className="flex items-center gap-2 text-destructive text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full">
                                შესვლა
                            </Button>
                        </form>

                        <p className="text-xs text-muted-foreground text-center mt-6">
                            პაროლი: <code className="bg-muted px-1 rounded">admin123</code>
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Authenticated - show admin content
    return <>{children}</>
}

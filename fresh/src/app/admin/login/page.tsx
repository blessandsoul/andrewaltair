'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TbShield, TbLock, TbEye, TbEyeOff, TbLoader2, TbAlertTriangle } from "react-icons/tb"

function AdminLoginForm() {
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [attempts, setAttempts] = useState(0)

    const router = useRouter()
    const searchParams = useSearchParams()
    const from = searchParams.get('from') || '/admin'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setAttempts((prev) => prev + 1)
                throw new Error(data.error || 'Login failed')
            }

            // Redirect to the page they tried to access
            router.push(from)
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const isLocked = attempts >= 5

    return (
        <div className="w-full max-w-md">
            {/* Logo Section */}
            <div className="text-center mb-8">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl animate-pulse" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                        <TbShield className="w-10 h-10 text-white" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold mt-6 text-foreground">ადმინ პანელი</h1>
                <p className="text-muted-foreground mt-2">შეიყვანეთ პაროლი გასაგრძელებლად</p>
            </div>

            {/* Login Form */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                            <TbAlertTriangle className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Locked Warning */}
                    {isLocked && (
                        <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-600 text-sm">
                            <TbLock className="w-4 h-4 flex-shrink-0" />
                            <span>ძალიან ბევრი მცდელობა. დაელოდეთ 15 წუთი.</span>
                        </div>
                    )}

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-foreground">
                            პაროლი
                        </label>
                        <div className="relative">
                            <TbLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="pl-10 pr-10"
                                disabled={loading || isLocked}
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                disabled={loading || isLocked}
                            >
                                {showPassword ? (
                                    <TbEyeOff className="w-5 h-5" />
                                ) : (
                                    <TbEye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-accent text-white border-0"
                        disabled={loading || isLocked || !password}
                    >
                        {loading ? (
                            <>
                                <TbLoader2 className="w-4 h-4 mr-2 animate-spin" />
                                შემოწმება...
                            </>
                        ) : (
                            <>
                                <TbShield className="w-4 h-4 mr-2" />
                                შესვლა
                            </>
                        )}
                    </Button>

                    {/* Attempts Counter */}
                    {attempts > 0 && attempts < 5 && (
                        <p className="text-xs text-muted-foreground text-center">
                            მცდელობები: {attempts}/5
                        </p>
                    )}
                </form>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-muted-foreground mt-6">
                დაცულია 🔒 Andrew Altair Admin System
            </p>
        </div>
    )
}

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/30 p-4">
            <Suspense fallback={<div className="text-center">იტვირთება...</div>}>
                <AdminLoginForm />
            </Suspense>
        </div>
    )
}

"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TbLogin, TbMail, TbLock, TbEye, TbEyeOff, TbSparkles, TbArrowRight, TbBrandGithub, TbBrandChrome, TbUser, TbAlertCircle } from "react-icons/tb"
import { useAuth } from "@/lib/auth"

export default function LoginPage() {
    const router = useRouter()
    const { login, user } = useAuth()
    const [formData, setFormData] = React.useState({
        username: "",
        password: "",
    })
    const [showPassword, setShowPassword] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState("")

    // Redirect if already logged in
    React.useEffect(() => {
        if (user) {
            router.push("/")
        }
    }, [user, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        const result = await login(formData.username, formData.password)

        if (result.success) {
            router.push("/")
        } else {
            setError(result.error || "შესვლა ვერ მოხერხდა")
        }

        setIsLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                            <div className="relative w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white shadow-lg">
                                <TbSparkles className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-left">
                            <span className="font-bold text-2xl text-gradient">Andrew Altair</span>
                            <div className="text-sm text-muted-foreground">AI ინოვატორი</div>
                        </div>
                    </Link>
                </div>

                <Card className="border-border/50 shadow-xl backdrop-blur-sm">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-2xl flex items-center justify-center gap-2">
                            <TbLogin className="w-6 h-6 text-primary" />
                            შესვლა
                        </CardTitle>
                        <CardDescription>
                            შედით თქვენს ანგარიშზე AI სერვისებზე წვდომისთვის
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Error Message */}
                            {error && (
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-sm text-destructive">
                                    <TbAlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Username */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <TbUser className="w-4 h-4 text-muted-foreground" />
                                    მომხმარებლის სახელი
                                </label>
                                <Input
                                    placeholder="andrew"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <TbLock className="w-4 h-4 text-muted-foreground" />
                                        პაროლი
                                    </label>
                                    <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                                        დაგავიწყდათ?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <TbEyeOff className="w-4 h-4" /> : <TbEye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Demo Credentials */}
                            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                                <p className="text-xs text-muted-foreground mb-2">🔑 ტესტ მომხმარებელი:</p>
                                <div className="flex items-center gap-2 text-sm">
                                    <code className="px-2 py-1 rounded bg-background text-primary">andrew</code>
                                    <span className="text-muted-foreground">/</span>
                                    <code className="px-2 py-1 rounded bg-background text-primary">andrew</code>
                                    <span className="text-xs text-yellow-500 ml-2">👑 GOD</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        შესვლა
                                        <TbArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">ან</span>
                                </div>
                            </div>

                            {/* Social Login */}
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" type="button" className="gap-2">
                                    <TbBrandChrome className="w-4 h-4" />
                                    Google
                                </Button>
                                <Button variant="outline" type="button" className="gap-2">
                                    <TbBrandGithub className="w-4 h-4" />
                                    GitHub
                                </Button>
                            </div>
                        </form>

                        {/* Register Link */}
                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">არ გაქვთ ანგარიში? </span>
                            <Link href="/register" className="text-primary font-medium hover:underline">
                                რეგისტრაცია
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

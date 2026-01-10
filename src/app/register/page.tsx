"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TbUserPlus, TbMail, TbLock, TbEye, TbEyeOff, TbSparkles, TbArrowRight, TbBrandGithub, TbBrandChrome, TbUser, TbCheck, TbId } from "react-icons/tb"
import { toast } from "sonner" // Assuming sonner is used, if not we'll fallback to basic alerts or errors state

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = React.useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [showPassword, setShowPassword] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [errors, setErrors] = React.useState<Record<string, string>>({})
    const [acceptTerms, setAcceptTerms] = React.useState(false)

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = "სახელი სავალდებულოა"
        }

        if (!formData.username.trim()) {
            newErrors.username = "მომხმარებლის სახელი სავალდებულოა"
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = "დაშვებულია მხოლოდ ლათინური ასოები, ციფრები და _"
        }

        if (!formData.email.trim()) {
            newErrors.email = "ელ.ფოსტა სავალდებულოა"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "არასწორი ელ.ფოსტის ფორმატი"
        }

        if (!formData.password) {
            newErrors.password = "პაროლი სავალდებულოა"
        } else if (formData.password.length < 8) {
            newErrors.password = "მინიმუმ 8 სიმბოლო"
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "პაროლები არ ემთხვევა"
        }

        if (!acceptTerms) {
            newErrors.terms = "გთხოვთ დაეთანხმოთ პირობებს"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            setIsLoading(true)
            setErrors({}) // Clear previous errors

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fullName: formData.name,
                        username: formData.username,
                        email: formData.email,
                        password: formData.password,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'რეგისტრაცია ვერ მოხერხდა');
                }

                // Success
                toast.success("რეგისტრაცია წარმატებულია!", {
                    description: "გთხოვთ შეამოწმოთ ელ-ფოსტა ანგარიშის გასააქტიურებლად."
                });

                // Redirect to login after short delay
                setTimeout(() => {
                    router.push("/login");
                }, 2000);

            } catch (error: any) {
                setErrors(prev => ({
                    ...prev,
                    submit: error.message || "დაფიქსირდა შეცდომა, გთხოვთ სცადოთ თავიდან"
                }));
            } finally {
                setIsLoading(false)
            }
        }
    }

    // Password strength indicator
    const getPasswordStrength = () => {
        const password = formData.password
        if (!password) return { strength: 0, label: "", color: "" }

        let strength = 0
        if (password.length >= 6) strength++
        if (password.length >= 8) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[^A-Za-z0-9]/.test(password)) strength++

        if (strength <= 2) return { strength, label: "სუსტი", color: "bg-red-500" }
        if (strength <= 3) return { strength, label: "საშუალო", color: "bg-yellow-500" }
        return { strength, label: "ძლიერი", color: "bg-green-500" }
    }

    const passwordStrength = getPasswordStrength()

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-gradient-to-br from-background via-background to-primary/5">
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
                            <TbUserPlus className="w-6 h-6 text-primary" />
                            რეგისტრაცია
                        </CardTitle>
                        <CardDescription>
                            შექმენით ანგარიში AI სამყაროში შესასვლელად
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* General Error Message */}
                            {errors.submit && (
                                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                                    {errors.submit}
                                </div>
                            )}

                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <TbUser className="w-4 h-4 text-muted-foreground" />
                                    სრული სახელი
                                </label>
                                <Input
                                    placeholder="თქვენი სახელი"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={errors.name ? "border-destructive" : ""}
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            {/* Username - NEW */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <TbId className="w-4 h-4 text-muted-foreground" />
                                    მომხმარებლის სახელი
                                </label>
                                <Input
                                    placeholder="username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className={errors.username ? "border-destructive" : ""}
                                />
                                {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <TbMail className="w-4 h-4 text-muted-foreground" />
                                    ელ.ფოსტა
                                </label>
                                <Input
                                    type="email"
                                    placeholder="email@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={errors.email ? "border-destructive" : ""}
                                />
                                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <TbLock className="w-4 h-4 text-muted-foreground" />
                                    პაროლი
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="მინიმუმ 8 სიმბოლო"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className={errors.password ? "border-destructive pr-10" : "pr-10"}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <TbEyeOff className="w-4 h-4" /> : <TbEye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {/* Password strength */}
                                {formData.password && (
                                    <div className="space-y-1">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-colors ${i <= passwordStrength.strength ? passwordStrength.color : "bg-muted"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-muted-foreground">{passwordStrength.label}</p>
                                    </div>
                                )}
                                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <TbLock className="w-4 h-4 text-muted-foreground" />
                                    პაროლის დადასტურება
                                </label>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="გაიმეორეთ პაროლი"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className={errors.confirmPassword ? "border-destructive" : ""}
                                />
                                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                            </div>

                            {/* Terms checkbox */}
                            <div className="flex items-start gap-2">
                                <button
                                    type="button"
                                    onClick={() => setAcceptTerms(!acceptTerms)}
                                    className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${acceptTerms ? "bg-primary border-primary text-white" : "border-input"
                                        } ${errors.terms ? "border-destructive" : ""}`}
                                >
                                    {acceptTerms && <TbCheck className="w-3 h-3" />}
                                </button>
                                <p className="text-sm text-muted-foreground">
                                    ვეთანხმები{" "}
                                    <Link href="/terms" className="text-primary hover:underline">
                                        წესებს და პირობებს
                                    </Link>
                                    {" "}და{" "}
                                    <Link href="/privacy" className="text-primary hover:underline">
                                        კონფიდენციალურობის პოლიტიკას
                                    </Link>
                                </p>
                            </div>
                            {errors.terms && <p className="text-sm text-destructive">{errors.terms}</p>}

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
                                        რეგისტრაცია
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

                        {/* Login Link */}
                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">უკვე გაქვთ ანგარიში? </span>
                            <Link href="/login" className="text-primary font-medium hover:underline">
                                შესვლა
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

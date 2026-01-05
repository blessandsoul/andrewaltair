/**
 * Security Tab - Password change, 2FA, and active sessions
 */

"use client"

import * as React from "react"
import { TbShield, TbLock, TbEye, TbEyeOff } from "react-icons/tb"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { passwordFormSchema, type PasswordFormData } from "../../schemas"

export function SecurityTab() {
    const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
    const [showNewPassword, setShowNewPassword] = React.useState(false)
    const [passwordData, setPasswordData] = React.useState<PasswordFormData>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = React.useState<Partial<Record<keyof PasswordFormData, string>>>({})

    const handlePasswordChange = () => {
        const result = passwordFormSchema.safeParse(passwordData)
        if (!result.success) {
            const fieldErrors: Partial<Record<keyof PasswordFormData, string>> = {}
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0] as keyof PasswordFormData] = err.message
                }
            })
            setErrors(fieldErrors)
            return
        }
        setErrors({})
        // TODO: API call to change password
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    }

    return (
        <Card className="border-border/50 shadow-xl backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TbShield className="w-5 h-5 text-primary" />
                    უსაფრთხოება
                </CardTitle>
                <CardDescription>მართეთ თქვენი პაროლი და უსაფრთხოების პარამეტრები</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Password Change */}
                <div className="p-4 rounded-lg border border-border">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                        <TbLock className="w-4 h-4" />
                        პაროლის შეცვლა
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">მიმდინარე პაროლი</label>
                            <div className="relative">
                                <Input
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showCurrentPassword ? <TbEyeOff className="w-4 h-4" /> : <TbEye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.currentPassword && <p className="text-sm text-destructive">{errors.currentPassword}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">ახალი პაროლი</label>
                            <div className="relative">
                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showNewPassword ? <TbEyeOff className="w-4 h-4" /> : <TbEye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">დაადასტურეთ პაროლი</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            />
                            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                        </div>

                        <Button onClick={handlePasswordChange} className="gap-2">
                            <TbLock className="w-4 h-4" />
                            პაროლის შეცვლა
                        </Button>
                    </div>
                </div>

                {/* 2FA */}
                <div className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium flex items-center gap-2">
                                <TbShield className="w-4 h-4" />
                                ორფაქტორიანი ავთენტიფიკაცია
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                დაიცავით თქვენი ანგარიში დამატებითი დაცვით
                            </p>
                        </div>
                        <Button variant="outline">ჩართვა</Button>
                    </div>
                </div>

                {/* Active Sessions */}
                <div className="p-4 rounded-lg border border-border">
                    <h3 className="font-medium mb-4">აქტიური სესიები</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                <div>
                                    <p className="font-medium text-sm">Windows • TbBrandChrome</p>
                                    <p className="text-xs text-muted-foreground">თბილისი, საქართველო • ახლა</p>
                                </div>
                            </div>
                            <span className="text-xs text-green-500 font-medium">მიმდინარე</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

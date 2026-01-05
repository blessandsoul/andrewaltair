/**
 * Profile Info Tab - Basic profile information
 */

"use client"

import * as React from "react"
import { TbUser, TbMail, TbCalendar, TbFileText, TbEdit, TbX, TbDeviceFloppy } from "react-icons/tb"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth"
import { profileFormSchema, type ProfileFormData } from "../../schemas"

export function ProfileInfoTab() {
    const { user } = useAuth()
    const [isEditing, setIsEditing] = React.useState(false)
    const [formData, setFormData] = React.useState<ProfileFormData>({
        fullName: user?.fullName || "",
        email: user?.email || "",
        username: user?.username || "",
        bio: "AI ენთუზიასტი და ტექნოლოგიების მოყვარული 🚀",
    })
    const [errors, setErrors] = React.useState<Partial<Record<keyof ProfileFormData, string>>>({})

    if (!user) return null

    const handleSave = () => {
        const result = profileFormSchema.safeParse(formData)
        if (!result.success) {
            const fieldErrors: Partial<Record<keyof ProfileFormData, string>> = {}
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0] as keyof ProfileFormData] = err.message
                }
            })
            setErrors(fieldErrors)
            return
        }
        setErrors({})
        setIsEditing(false)
        // TODO: API call to save
    }

    const handleCancel = () => {
        setFormData({
            fullName: user.fullName,
            email: user.email,
            username: user.username,
            bio: "AI ენთუზიასტი და ტექნოლოგიების მოყვარული 🚀",
        })
        setErrors({})
        setIsEditing(false)
    }

    return (
        <Card className="border-border/50 shadow-xl backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <TbUser className="w-5 h-5 text-primary" />
                        პროფილის ინფორმაცია
                    </CardTitle>
                    <CardDescription>მართეთ თქვენი პირადი მონაცემები</CardDescription>
                </div>
                <Button
                    variant={isEditing ? "outline" : "default"}
                    size="sm"
                    onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
                    className="gap-2"
                >
                    {isEditing ? (
                        <>
                            <TbX className="w-4 h-4" />
                            გაუქმება
                        </>
                    ) : (
                        <>
                            <TbEdit className="w-4 h-4" />
                            რედაქტირება
                        </>
                    )}
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <TbUser className="w-4 h-4 text-muted-foreground" />
                            სრული სახელი
                        </label>
                        {isEditing ? (
                            <div>
                                <Input
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                                {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
                            </div>
                        ) : (
                            <p className="px-3 py-2 bg-muted/50 rounded-md">{user.fullName}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <span className="text-muted-foreground">@</span>
                            მომხმარებლის სახელი
                        </label>
                        {isEditing ? (
                            <div>
                                <Input
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                                {errors.username && <p className="text-sm text-destructive mt-1">{errors.username}</p>}
                            </div>
                        ) : (
                            <p className="px-3 py-2 bg-muted/50 rounded-md">{user.username}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <TbMail className="w-4 h-4 text-muted-foreground" />
                            ელ. ფოსტა
                        </label>
                        {isEditing ? (
                            <div>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                            </div>
                        ) : (
                            <p className="px-3 py-2 bg-muted/50 rounded-md">{user.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <TbCalendar className="w-4 h-4 text-muted-foreground" />
                            რეგისტრაციის თარიღი
                        </label>
                        <p className="px-3 py-2 bg-muted/50 rounded-md">
                            {new Date(user.createdAt).toLocaleDateString("ka-GE", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <TbFileText className="w-4 h-4 text-muted-foreground" />
                        ბიო
                    </label>
                    {isEditing ? (
                        <div>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full px-3 py-2 bg-background border border-border rounded-md resize-none h-24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="მოყევით თქვენ შესახებ..."
                            />
                            {errors.bio && <p className="text-sm text-destructive mt-1">{errors.bio}</p>}
                        </div>
                    ) : (
                        <p className="px-3 py-2 bg-muted/50 rounded-md">{formData.bio}</p>
                    )}
                </div>

                {isEditing && (
                    <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleSave} className="gap-2">
                            <TbDeviceFloppy className="w-4 h-4" />
                            შენახვა
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

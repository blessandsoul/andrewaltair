/**
 * Profile Feature - Profile Header Component
 * Cover image, avatar, user info, and quick actions
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { Camera, Shield, LogOut, Sparkles, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth, ROLE_CONFIG } from "@/lib/auth"
import { cn } from "@/lib/utils"

interface ProfileHeaderProps {
    onAvatarChange?: (file: File, onSuccess: (base64: string) => void) => void
    onCoverChange?: (file: File, onSuccess: (base64: string) => void) => void
    onLogout?: () => void
}

export function ProfileHeader({ onAvatarChange, onCoverChange, onLogout }: ProfileHeaderProps) {
    const { user, isGod, isAdmin, logout } = useAuth()
    const avatarInputRef = React.useRef<HTMLInputElement>(null)
    const coverInputRef = React.useRef<HTMLInputElement>(null)

    // Local state for images
    const [avatarImage, setAvatarImage] = React.useState<string | undefined>(user?.avatar)
    const [coverImage, setCoverImage] = React.useState<string | null>(null)

    // Update avatar when user changes
    React.useEffect(() => {
        setAvatarImage(user?.avatar)
    }, [user?.avatar])

    // Update cover image when user data loads
    React.useEffect(() => {
        // This will be populated from API response via ProfileShell
        if (user?.coverImage) {
            setCoverImage(user.coverImage)
        }
    }, [user?.coverImage])

    if (!user) return null

    const roleConfig = ROLE_CONFIG[user.role]

    const handleAvatarClick = () => avatarInputRef.current?.click()
    const handleCoverClick = () => coverInputRef.current?.click()

    const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && onAvatarChange) {
            onAvatarChange(file, (base64) => {
                // Update local state immediately
                setAvatarImage(base64)
            })
        }
    }

    const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && onCoverChange) {
            onCoverChange(file, (base64) => {
                // Update local state immediately
                setCoverImage(base64)
            })
        }
    }

    const handleLogoutClick = () => {
        logout()
        onLogout?.()
    }

    return (
        <>
            {/* Cover Image */}
            <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary via-accent to-primary overflow-hidden">
                {coverImage ? (
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-80" />
                )}
                <div className="absolute inset-0 bg-black/20" />

                {/* Cover upload button */}
                <button
                    onClick={handleCoverClick}
                    className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-colors"
                >
                    <Camera className="w-4 h-4" />
                    ფონის შეცვლა
                </button>
                <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverFileChange}
                />

                {/* Logo link */}
                <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-xl blur-md" />
                        <div className="relative w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Sparkles className="w-5 h-5" />
                        </div>
                    </div>
                    <span className="font-bold text-xl text-white drop-shadow-lg">Andrew Altair</span>
                </Link>
            </div>

            <div className="max-w-4xl mx-auto px-4 relative z-10 -mt-16">
                {/* Profile Card */}
                <Card className="border-border/50 shadow-xl backdrop-blur-sm mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Avatar with upload */}
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent p-1 shadow-xl">
                                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                                        {avatarImage ? (
                                            <img src={avatarImage} alt={user.fullName} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-16 h-16 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleAvatarClick}
                                    className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="ავატარის ატვირთვა"
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                                <input
                                    ref={avatarInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarFileChange}
                                />
                                {isGod && (
                                    <div className="absolute -top-2 -right-2 text-3xl animate-bounce" aria-label="ღმერთი">
                                        👑
                                    </div>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
                                <p className="text-muted-foreground mb-3">@{user.username}</p>

                                {/* Role Badge */}
                                <div
                                    className={cn(
                                        "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r text-white text-sm font-medium",
                                        roleConfig.color
                                    )}
                                >
                                    <span>{roleConfig.icon}</span>
                                    <span>{roleConfig.label}</span>
                                </div>

                                {user.badge && (
                                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-sm ml-2">
                                        {user.badge}
                                    </div>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-col gap-2">
                                {(isGod || isAdmin) && (
                                    <Button asChild variant="outline" className="gap-2">
                                        <Link href="/admin">
                                            <Shield className="w-4 h-4" />
                                            ადმინ პანელი
                                        </Link>
                                    </Button>
                                )}
                                <Button variant="outline" className="gap-2" onClick={handleLogoutClick}>
                                    <LogOut className="w-4 h-4" />
                                    გასვლა
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

import * as React from "react"
import Link from "next/link"
import { TbCamera, TbShield, TbLogout, TbArrowsMove, TbCheck, TbX, TbUser } from "react-icons/tb"
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
    const coverRef = React.useRef<HTMLDivElement>(null)

    // Local state for images & positioning
    const [avatarImage, setAvatarImage] = React.useState<string | undefined>(user?.avatar)
    const [coverImage, setCoverImage] = React.useState<string | null>(null)
    const [isRepositioning, setIsRepositioning] = React.useState(false)
    const [coverOffsetY, setCoverOffsetY] = React.useState(50) // default to center
    const [originalOffsetY, setOriginalOffsetY] = React.useState(50)

    // Use refs for drag tracking to avoid stale closure issues
    const isDragging = React.useRef(false)
    const dragStartY = React.useRef(0)
    const dragStartOffset = React.useRef(50)

    // Update avatar when user changes
    React.useEffect(() => {
        setAvatarImage(user?.avatar)
    }, [user?.avatar])

    // Update cover image & offset when user data loads
    React.useEffect(() => {
        if (user?.coverImage) {
            setCoverImage(user.coverImage)
        }
        if (user?.coverOffsetY !== undefined) {
            setCoverOffsetY(user.coverOffsetY)
        }
    }, [user?.coverImage, user?.coverOffsetY])

    if (!user) return null

    const roleConfig = ROLE_CONFIG[user.role]

    const handleAvatarClick = () => avatarInputRef.current?.click()
    const handleCoverClick = () => coverInputRef.current?.click()

    const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && onAvatarChange) {
            onAvatarChange(file, (base64) => {
                setAvatarImage(base64)
            })
        }
    }

    const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && onCoverChange) {
            onCoverChange(file, (base64) => {
                setCoverImage(base64)
                setCoverOffsetY(50) // Reset to center on new upload
                // Also save the reset offset
                saveCoverPosition(50)
            })
        }
    }

    const startReposition = () => {
        setIsRepositioning(true)
        setOriginalOffsetY(coverOffsetY)
    }

    const cancelReposition = () => {
        setIsRepositioning(false)
        setCoverOffsetY(originalOffsetY)
        isDragging.current = false
    }

    const saveCoverPosition = async (offset?: number) => {
        const finalOffset = offset !== undefined ? offset : coverOffsetY
        setIsRepositioning(false)
        isDragging.current = false

        try {
            const token = localStorage.getItem("auth_token")
            if (!token) return

            await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ coverOffsetY: finalOffset }),
            })
        } catch (error) {
            console.error("Failed to save cover position", error)
        }
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isRepositioning) return
        e.preventDefault()
        e.stopPropagation()

        isDragging.current = true
        dragStartY.current = e.clientY
        dragStartOffset.current = coverOffsetY
    }

    // Handle global mouse events for drag
    React.useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDragging.current || !isRepositioning || !coverRef.current) return

            const deltaY = e.clientY - dragStartY.current
            const containerHeight = coverRef.current.offsetHeight
            const percentChange = (deltaY / containerHeight) * 100

            // Invert: dragging down shows top of image (lower %)
            const newOffset = dragStartOffset.current - percentChange
            const clampedOffset = Math.min(100, Math.max(0, newOffset))

            setCoverOffsetY(clampedOffset)
        }

        const handleGlobalMouseUp = () => {
            if (isDragging.current) {
                isDragging.current = false
                setOriginalOffsetY(coverOffsetY)
            }
        }

        if (isRepositioning) {
            window.addEventListener('mousemove', handleGlobalMouseMove)
            window.addEventListener('mouseup', handleGlobalMouseUp)
        }

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove)
            window.removeEventListener('mouseup', handleGlobalMouseUp)
        }
    }, [isRepositioning, coverOffsetY])

    const handleLogoutClick = () => {
        logout()
        onLogout?.()
    }

    return (
        <>
            {/* Cover TbPhoto */}
            <div
                ref={coverRef}
                className={cn(
                    "relative h-48 md:h-64 bg-gradient-to-r from-primary via-accent to-primary overflow-hidden select-none",
                    isRepositioning && "cursor-move"
                )}
                onMouseDown={handleMouseDown}
            >
                {coverImage ? (
                    <img
                        src={coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover transition-none"
                        style={{ objectPosition: `center ${coverOffsetY}%` }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-80" />
                )}
                <div className="absolute inset-0 bg-black/20" />

                {/* Cover Actions */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    {isRepositioning ? (
                        <>
                            <Button
                                onClick={() => saveCoverPosition()}
                                variant="default"
                                size="sm"
                                className="gap-2 bg-green-600 hover:bg-green-700"
                            >
                                <TbCheck className="w-4 h-4" />
                                შენახვა
                            </Button>
                            <Button
                                onClick={cancelReposition}
                                variant="destructive"
                                size="sm"
                                className="gap-2"
                            >
                                <TbX className="w-4 h-4" />
                                გაუქმება
                            </Button>
                        </>
                    ) : (
                        <>
                            {coverImage && (
                                <button
                                    onClick={startReposition}
                                    className="flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-colors text-sm font-medium"
                                >
                                    <TbArrowsMove className="w-4 h-4" />
                                    პოზიცია
                                </button>
                            )}
                            <button
                                onClick={handleCoverClick}
                                className="flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-colors text-sm font-medium"
                            >
                                <TbCamera className="w-4 h-4" />
                                ფონის შეცვლა
                            </button>
                        </>
                    )}
                </div>

                <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverFileChange}
                />

                {/* NOTE: Username/Logo removed as requested */}
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
                                            <TbUser className="w-16 h-16 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleAvatarClick}
                                    className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="ავატარის ატვირთვა"
                                >
                                    <TbCamera className="w-5 h-5" />
                                </button>
                                <input
                                    ref={avatarInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarFileChange}
                                />
                                {isGod && (
                                    // Crown removed as requested
                                    null
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
                                    // Badge removed as requested
                                    null
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-col gap-2">
                                {(isGod || isAdmin) && (
                                    <Button asChild variant="outline" className="gap-2">
                                        <Link href="/admin">
                                            <TbShield className="w-4 h-4" />
                                            ადმინ პანელი
                                        </Link>
                                    </Button>
                                )}
                                <Button variant="outline" className="gap-2" onClick={handleLogoutClick}>
                                    <TbLogout className="w-4 h-4" />
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

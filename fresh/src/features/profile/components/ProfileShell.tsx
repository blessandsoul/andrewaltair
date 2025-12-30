/**
 * Profile Feature - Main Shell Component
 * Orchestrates all profile components and data fetching
 */

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { ProfileHeader } from "./ProfileHeader"
import { ProfileTabs, useProfileTab } from "./ProfileTabs"
import { ProfileInfoTab } from "./tabs/ProfileInfoTab"
import { ActivityTab } from "./tabs/ActivityTab"
import { StatsTab } from "./tabs/StatsTab"
import { SocialAccountsTab } from "./tabs/SocialAccountsTab"
import { PrivacyTab } from "./tabs/PrivacyTab"
import { MediaTab } from "./tabs/MediaTab"
import { SubscriptionsTab } from "./tabs/SubscriptionsTab"
import { SecurityTab } from "./tabs/SecurityTab"
import { PreferencesTab } from "./tabs/PreferencesTab"
import { ProfileSkeleton } from "./shared/ProfileSkeleton"
import type { ActivityItem, UserStats, SubscriptionItem, SocialAccount } from "../types"

export function ProfileShell() {
    const router = useRouter()
    const { user, isLoading: authLoading } = useAuth()
    const activeTab = useProfileTab()

    // Profile data state
    const [activity, setActivity] = React.useState<ActivityItem[]>([])
    const [stats, setStats] = React.useState<UserStats | null>(null)
    const [subscriptions, setSubscriptions] = React.useState<SubscriptionItem[]>([])
    const [socialAccounts, setSocialAccounts] = React.useState<SocialAccount[]>([])
    const [isProfileLoading, setIsProfileLoading] = React.useState(true)

    // Redirect if not logged in
    React.useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login")
        }
    }, [user, authLoading, router])

    // Fetch profile data
    React.useEffect(() => {
        async function fetchProfileData() {
            if (!user) return

            try {
                const token = localStorage.getItem("auth_token")
                if (!token) {
                    setIsProfileLoading(false)
                    return
                }

                const res = await fetch("/api/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (res.ok) {
                    const data = await res.json()

                    // Set activity data
                    if (data.activity) {
                        setActivity(
                            data.activity.map((a: any, i: number) => ({
                                id: a.id || `activity-${i}`,
                                type: a.type || "login",
                                description: a.description,
                                time: formatTimeAgo(a.time),
                                timestamp: new Date(a.time),
                            }))
                        )
                    }

                    // Set stats data
                    if (data.stats) {
                        const topSections = data.stats.topSections || []
                        const totalVisits = topSections.reduce((sum: number, s: any) => sum + s.visits, 0) || 1
                        setStats({
                            ...data.stats,
                            topSections: topSections.map((s: any) => ({
                                ...s,
                                percentage: Math.round((s.visits / totalVisits) * 100),
                            })),
                        })
                    }

                    // Set subscriptions
                    if (data.subscriptions) {
                        setSubscriptions(data.subscriptions)
                    }

                    // Set social accounts
                    if (data.socialAccounts) {
                        setSocialAccounts(data.socialAccounts)
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile data:", error)
            } finally {
                setIsProfileLoading(false)
            }
        }

        fetchProfileData()
    }, [user])

    // Handle logout
    const handleLogout = () => {
        router.push("/")
    }

    // Handle file uploads
    const handleAvatarUpload = async (file: File, onSuccess: (base64: string) => void) => {
        try {
            // Convert to base64
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = async () => {
                const base64String = reader.result as string

                // Update UI immediately (optimistic update)
                onSuccess(base64String)

                // Update via API
                const token = localStorage.getItem("auth_token")
                if (!token) return

                const res = await fetch("/api/profile", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ avatar: base64String }),
                })

                if (!res.ok) {
                    console.error("Failed to upload avatar")
                }
            }
        } catch (error) {
            console.error("Avatar upload error:", error)
        }
    }

    const handleCoverUpload = async (file: File, onSuccess: (base64: string) => void) => {
        try {
            // Convert to base64
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = async () => {
                const base64String = reader.result as string

                // Update UI immediately (optimistic update)
                onSuccess(base64String)

                // Update via API
                const token = localStorage.getItem("auth_token")
                if (!token) return

                const res = await fetch("/api/profile", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ coverImage: base64String }),
                })

                if (!res.ok) {
                    console.error("Failed to upload cover")
                }
            }
        } catch (error) {
            console.error("Cover upload error:", error)
        }
    }

    // Show loading state
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <ProfileHeader
                onAvatarChange={handleAvatarUpload}
                onCoverChange={handleCoverUpload}
                onLogout={handleLogout}
            />

            {/* Tabs and Content */}
            <ProfileTabs>
                {activeTab === "profile" && <ProfileInfoTab />}
                {activeTab === "activity" && <ActivityTab activity={activity} isLoading={isProfileLoading} />}
                {activeTab === "stats" && <StatsTab stats={stats} isLoading={isProfileLoading} />}
                {activeTab === "social" && <SocialAccountsTab socialAccounts={socialAccounts} />}
                {activeTab === "privacy" && <PrivacyTab />}
                {activeTab === "media" && <MediaTab />}
                {activeTab === "subscriptions" && (
                    <SubscriptionsTab subscriptions={subscriptions} isLoading={isProfileLoading} />
                )}
                {activeTab === "security" && <SecurityTab />}
                {activeTab === "preferences" && <PreferencesTab />}
            </ProfileTabs>

            {/* Bottom spacing */}
            <div className="h-12" />
        </div>
    )
}

// Helper to format time ago
function formatTimeAgo(dateString: string): string {
    try {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 60) return `${diffMins} წთ წინ`
        if (diffHours < 24) return `${diffHours} სთ წინ`
        if (diffDays === 0) return "დღეს"
        if (diffDays === 1) return "გუშინ"
        if (diffDays < 7) return `${diffDays} დღის წინ`
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} კვირის წინ`
        return date.toLocaleDateString("ka-GE")
    } catch {
        return dateString
    }
}

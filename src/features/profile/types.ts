/**
 * Profile Feature - Type Definitions
 * 2025 Elite Frontend Architecture
 */

import { type User } from "@/lib/auth"

// Tab types
export const PROFILE_TABS = [
    "profile",
    "activity",
    "stats",
    "social",
    "privacy",
    "media",
    "subscriptions",
    "security",
    "preferences",
] as const

export type ProfileTab = (typeof PROFILE_TABS)[number]

// Activity
export interface ActivityItem {
    id: string
    type: "login" | "profile_update" | "comment" | "like" | "view" | "subscription" | "password_change"
    description: string
    time: string
    timestamp: Date
}

// Statistics
export interface UserStats {
    totalTimeSpent: string
    sessionsCount: number
    lastActive: string
    pagesVisited: number
    toolsUsed: number
    commentsPosted: number
    likesGiven: number
    topSections: TopSection[]
}

export interface TopSection {
    name: string
    visits: number
    percentage?: number
}

// Subscriptions
export interface SubscriptionItem {
    id: number
    name: string
    type: "tool" | "topic"
    subscribed: boolean
    icon?: string
}

// Social Accounts
export interface SocialAccount {
    id: string
    name: string
    connected: boolean
    provider: "google" | "github" | "facebook" | "telegram"
}

// Privacy Settings
export interface PrivacySettings {
    profileVisible: boolean
    showEmail: boolean
    showActivity: boolean
    showSubscriptions: boolean
    allowMessages: boolean
}

// API Response
export interface ProfileData {
    user: User
    activity: ActivityItem[]
    stats: UserStats
    subscriptions: SubscriptionItem[]
    socialAccounts: SocialAccount[]
}

// NOTE: ProfileFormData and PasswordFormData types are exported from schemas.ts (Zod-inferred)

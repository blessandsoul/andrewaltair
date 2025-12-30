/**
 * Profile Feature - Profile Tabs Component
 * URL-synced tab navigation with nuqs
 */

"use client"

import * as React from "react"
import { useQueryState, parseAsStringLiteral } from "nuqs"
import {
    User,
    History,
    BarChart3,
    Link2,
    Users,
    Image,
    Bookmark,
    Shield,
    Settings,
    type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PROFILE_TABS, type ProfileTab } from "../types"

interface Tab {
    id: ProfileTab
    label: string
    icon: LucideIcon
}

const tabs: Tab[] = [
    { id: "profile", label: "პროფილი", icon: User },
    { id: "activity", label: "აქტივობა", icon: History },
    { id: "stats", label: "სტატისტიკა", icon: BarChart3 },
    { id: "social", label: "სოც. ქსელები", icon: Link2 },
    { id: "privacy", label: "კონფიდენციალურობა", icon: Users },
    { id: "media", label: "მედია", icon: Image },
    { id: "subscriptions", label: "გამოწერები", icon: Bookmark },
    { id: "security", label: "უსაფრთხოება", icon: Shield },
    { id: "preferences", label: "პარამეტრები", icon: Settings },
]

interface ProfileTabsProps {
    children: React.ReactNode
}

export function ProfileTabs({ children }: ProfileTabsProps) {
    const [activeTab, setActiveTab] = useQueryState(
        "tab",
        parseAsStringLiteral(PROFILE_TABS).withDefault("profile")
    )

    return (
        <div className="max-w-4xl mx-auto px-4">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide" role="tablist">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`tabpanel-${tab.id}`}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            activeTab === tab.id
                                ? "bg-primary text-white shadow-lg"
                                : "bg-card border border-border hover:bg-accent/10 hover:border-primary/30"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div
                id={`tabpanel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`tab-${activeTab}`}
            >
                {children}
            </div>
        </div>
    )
}

// Hook to get current tab
export function useProfileTab() {
    const [activeTab] = useQueryState(
        "tab",
        parseAsStringLiteral(PROFILE_TABS).withDefault("profile")
    )
    return activeTab
}

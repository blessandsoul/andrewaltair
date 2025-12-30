/**
 * Profile Feature - Barrel Export
 * Export all components for easy importing
 */

// Main components
export { ProfileShell } from "./components/ProfileShell"
export { ProfileHeader } from "./components/ProfileHeader"
export { ProfileTabs, useProfileTab } from "./components/ProfileTabs"

// Tab components
export { ProfileInfoTab } from "./components/tabs/ProfileInfoTab"
export { ActivityTab } from "./components/tabs/ActivityTab"
export { StatsTab } from "./components/tabs/StatsTab"
export { SocialAccountsTab } from "./components/tabs/SocialAccountsTab"
export { PrivacyTab } from "./components/tabs/PrivacyTab"
export { MediaTab } from "./components/tabs/MediaTab"
export { SubscriptionsTab } from "./components/tabs/SubscriptionsTab"
export { SecurityTab } from "./components/tabs/SecurityTab"
export { PreferencesTab } from "./components/tabs/PreferencesTab"

// Shared components
export { SettingToggle } from "./components/shared/SettingToggle"
export { StatCard } from "./components/shared/StatCard"
export { ActivityItem } from "./components/shared/ActivityItem"
export { SocialAccountCard } from "./components/shared/SocialAccountCard"
export { SubscriptionCard } from "./components/shared/SubscriptionCard"
export {
    ProfileSkeleton,
    ActivitySkeleton,
    StatsSkeleton,
    Skeleton,
} from "./components/shared/ProfileSkeleton"

// Types
export * from "./types"

// Schemas
export * from "./schemas"

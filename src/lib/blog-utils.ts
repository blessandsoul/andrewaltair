"use client"

import { brand } from "@/lib/brand"

// Helper to determine author avatar
export function getAuthorAvatar(author: { name: string, avatar?: string, role?: string } | undefined | null) {
    if (!author) return '/logo.png'
    const name = author.name.toLowerCase()

    // Specific mapping for known authors
    if (name.includes('andrew') || author.role === 'god') return '/andrewaltair.png'

    // Force override for Deep Science
    // Includes check for 'science' to catch variations like "Deep Science" or just "Science"
    if (name.includes('deep') || name.includes('დიპ') || name.includes('დიფ') || name.includes('science')) {
        return '/images/avatars/deep.png?v=6'
    }

    if (name.includes('alpha') || name.includes('ალფა')) return '/images/avatars/alpha.jpg?v=6'

    // Block invalid/broken paths
    if (author.avatar === '/images/avatar.jpg') return '/logo.png'

    // Database value or generic fallback
    return author.avatar || '/logo.png'
}

// Get category info with color
export function getCategoryInfo(categoryId: string) {
    const normalizedId = categoryId?.trim().toLowerCase()

    // Flat search including subcategories
    const allCategories = brand.categories.flatMap(c => [c, ...(c.subcategories || [])])

    return allCategories.find(c => c.id.toLowerCase() === normalizedId) || {
        id: categoryId,
        name: categoryId,
        color: "#6366f1"
    }
}

// Format numbers (15420 -> 15.4K)
export function formatNumber(num: number): string {
    if (!num) return "0"
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
}

// Get total reactions
export function getTotalReactions(reactions: Record<string, number> | undefined): number {
    if (!reactions) return 0
    return Object.values(reactions).reduce((a, b) => a + b, 0)
}

// Format date to relative time (5 დღის წინ)
export function formatRelativeDate(dateString: string): string {
    if (!dateString) return ""
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "დღეს"
    if (diffDays === 1) return "გუშინ"
    if (diffDays < 7) return `${diffDays} დღის წინ`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} კვირის წინ`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} თვის წინ`
    return `${Math.floor(diffDays / 365)} წლის წინ`
}

/**
 * Profile Page - 2025 Elite Frontend Architecture
 * Clean, modular implementation with URL-synced tabs
 */

"use client"

import { Suspense } from "react"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { ProfileShell } from "@/features/profile"

export default function ProfilePage() {
    return (
        <NuqsAdapter>
            <Suspense
                fallback={
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                }
            >
                <ProfileShell />
            </Suspense>
        </NuqsAdapter>
    )
}

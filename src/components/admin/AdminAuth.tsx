"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"

// Password is now verified via API - NO HARDCODING!
// Credentials are stored in .env.local as ADMIN_PASSWORD

interface AdminAuthContextValue {
    isAuthenticated: boolean
    isLoading: boolean
}

const AdminAuthContext = React.createContext<AdminAuthContextValue>({
    isAuthenticated: false,
    isLoading: true,
})

export function useAdminAuth(): AdminAuthContextValue {
    return React.useContext(AdminAuthContext)
}

interface AdminAuthProps {
    children: React.ReactNode
}

function RedirectToLogin(): null {
    const router = useRouter()
    const pathname = usePathname()
    React.useEffect(() => {
        const loginUrl = `/admin/login${pathname && pathname !== '/admin/login' ? `?from=${encodeURIComponent(pathname)}` : ''}`
        router.replace(loginUrl)
    }, [router, pathname])
    return null
}

export function AdminAuth({ children }: AdminAuthProps) {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true)

    // Check for existing session on mount (cookie-based auth)
    React.useEffect(() => {
        const verifySession = async () => {
            try {
                const res = await fetch('/api/admin/verify')
                if (res.ok) {
                    setIsAuthenticated(true)
                }
            } catch {
                // Network error — session state unknown
            }
            setIsLoading(false)
        }
        verifySession()
    }, [])

    const contextValue = React.useMemo<AdminAuthContextValue>(
        () => ({ isAuthenticated, isLoading }),
        [isAuthenticated, isLoading]
    )

    // Loading state
    if (isLoading) {
        return (
            <AdminAuthContext.Provider value={contextValue}>
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </AdminAuthContext.Provider>
        )
    }

    // Not authenticated - redirect to login page
    // Middleware handles this too, but this covers client-side navigation
    if (!isAuthenticated) {
        return (
            <AdminAuthContext.Provider value={contextValue}>
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-muted-foreground mt-4 text-sm">გადამისამართება...</p>
                    </div>
                </div>
                <RedirectToLogin />
            </AdminAuthContext.Provider>
        )
    }

    // Authenticated - show admin content
    return <AdminAuthContext.Provider value={contextValue}>{children}</AdminAuthContext.Provider>
}

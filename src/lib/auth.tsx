"use client"

import * as React from "react"

// User types
export interface User {
    id: string
    username: string
    email: string
    fullName: string
    bio?: string
    avatar?: string
    coverImage?: string
    coverOffsetY?: number
    role: "god" | "admin" | "editor" | "viewer"
    badge?: string
    createdAt: string
}

// Role labels and colors
export const ROLE_CONFIG = {
    god: { label: "ღმერთი", color: "from-yellow-500 to-orange-500", icon: "👑" },
    admin: { label: "ადმინი", color: "from-red-500 to-pink-500", icon: "🛡️" },
    editor: { label: "ედიტორი", color: "from-blue-500 to-cyan-500", icon: "✏️" },
    viewer: { label: "მნახველი", color: "from-gray-500 to-gray-600", icon: "👁️" }
}

// Auth context
interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
    register: (data: { username: string; email: string; password: string; fullName: string }) => Promise<{ success: boolean; error?: string }>
    logout: () => void
    isGod: boolean
    isAdmin: boolean
    canEdit: boolean
    token: string | null
    updateUser: (user: User) => void
    csrfToken: string | null
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

// Auth provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null)
    const [token, setToken] = React.useState<string | null>(null)
    const [csrfToken, setCsrfToken] = React.useState<string | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    // Load user and CSRF token on mount
    React.useEffect(() => {
        const loadAuth = async () => {
            try {
                // Fetch CSRF token
                const csrfRes = await fetch("/api/csrf")
                if (csrfRes.ok) {
                    const csrfData = await csrfRes.json()
                    setCsrfToken(csrfData.csrfToken)
                }

                // Token automatically sent via cookie
                const response = await fetch("/api/auth/me", {
                    // credentials: 'include' is default for same-origin, but explicit doesn't hurt if using cross-origin later
                })

                if (response.ok) {
                    const data = await response.json()
                    setUser(data.user)
                }
            } catch (error) {
                console.error('Failed to load auth:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadAuth()
    }, [])

    const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": csrfToken || ""
                },
                body: JSON.stringify({ username, password })
            })

            const data = await response.json()

            if (!response.ok) {
                return { success: false, error: data.error || "შესვლა ვერ მოხერხდა" }
            }

            setUser(data.user)
            // Token is now in httpOnly cookie, no need to store it

            return { success: true }
        } catch {
            return { success: false, error: "სერვერთან დაკავშირება ვერ მოხერხდა" }
        }
    }

    const register = async (data: { username: string; email: string; password: string; fullName: string }): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": csrfToken || ""
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (!response.ok) {
                return { success: false, error: result.error || "რეგისტრაცია ვერ მოხერხდა" }
            }

            setUser(result.user)
            // Token is in cookie now

            return { success: true }
        } catch {
            return { success: false, error: "სერვერთან დაკავშირება ვერ მოხერხდა" }
        }
    }

    const updateUser = (userData: User) => {
        setUser(userData)
        // localStorage.setItem("auth_user", JSON.stringify(userData)) - REMOVED for security
    }

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                    "x-csrf-token": csrfToken || ""
                }
            })
        } catch (e) {
            console.error(e)
        }
        setUser(null)
        setToken(null)
        // Cleanup legacy items if present
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")

        // Force reload to clear all state
        window.location.href = '/'
    }

    const isGod = user?.role === "god"
    const isAdmin = user?.role === "god" || user?.role === "admin"
    const canEdit = user?.role === "god" || user?.role === "admin" || user?.role === "editor"

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, isGod, isAdmin, canEdit, token, updateUser, csrfToken }}>
            {children}
        </AuthContext.Provider>
    )
}

// Hook to use auth
export function useAuth() {
    const context = React.useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

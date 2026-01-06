"use client"

import * as React from "react"

// User types
export interface User {
    id: string
    username: string
    email: string
    fullName: string
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
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

// Auth provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null)
    const [token, setToken] = React.useState<string | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    // Load user from localStorage on mount
    React.useEffect(() => {
        const loadUser = async () => {
            const savedToken = localStorage.getItem("auth_token")
            const savedUser = localStorage.getItem("auth_user")

            if (savedToken && savedUser) {
                try {
                    // Verify token is still valid
                    const response = await fetch("/api/auth/me", {
                        headers: {
                            "Authorization": `Bearer ${savedToken}`
                        }
                    })

                    if (response.ok) {
                        const data = await response.json()
                        setUser(data.user)
                        setToken(savedToken)
                    } else {
                        // Token invalid, clear storage
                        localStorage.removeItem("auth_token")
                        localStorage.removeItem("auth_user")
                    }
                } catch {
                    // On error, try to use cached user
                    try {
                        setUser(JSON.parse(savedUser))
                        setToken(savedToken)
                    } catch {
                        localStorage.removeItem("auth_token")
                        localStorage.removeItem("auth_user")
                    }
                }
            }
            setIsLoading(false)
        }

        loadUser()
    }, [])

    const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            })

            const data = await response.json()

            if (!response.ok) {
                return { success: false, error: data.error || "შესვლა ვერ მოხერხდა" }
            }

            setUser(data.user)
            setToken(data.token)
            localStorage.setItem("auth_token", data.token)
            localStorage.setItem("auth_user", JSON.stringify(data.user))

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
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (!response.ok) {
                return { success: false, error: result.error || "რეგისტრაცია ვერ მოხერხდა" }
            }

            setUser(result.user)
            setToken(result.token)
            localStorage.setItem("auth_token", result.token)
            localStorage.setItem("auth_user", JSON.stringify(result.user))

            return { success: true }
        } catch {
            return { success: false, error: "სერვერთან დაკავშირება ვერ მოხერხდა" }
        }
    }

    const updateUser = (userData: User) => {
        setUser(userData)
        localStorage.setItem("auth_user", JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
    }

    const isGod = user?.role === "god"
    const isAdmin = user?.role === "god" || user?.role === "admin"
    const canEdit = user?.role === "god" || user?.role === "admin" || user?.role === "editor"

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, isGod, isAdmin, canEdit, token, updateUser }}>
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

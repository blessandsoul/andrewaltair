"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { AdminSidebar, AdminHeader } from "@/components/admin/AdminSidebar"
import { AdminAuth, useAdminAuth } from "@/components/admin/AdminAuth"
import { OnboardingTour, useOnboarding } from "@/components/admin/OnboardingTour"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAdminAuth()
    const [sidebarOpen, setSidebarOpen] = React.useState(false)
    const [theme, setTheme] = React.useState<"light" | "dark">("light")
    const { showTour, endTour } = useOnboarding()
    const pathname = usePathname()

    // Initialize theme from localStorage or system preference
    React.useEffect(() => {
        const savedTheme = localStorage.getItem("admin_theme") as "light" | "dark" | null
        if (savedTheme) {
            setTheme(savedTheme)
        } else {
            setTheme("light")
        }
    }, [])

    // Apply theme to document
    React.useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
        localStorage.setItem("admin_theme", theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === "dark" ? "light" : "dark")
    }

    // Don't render sidebar/header until authenticated
    if (isLoading || !isAuthenticated) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                theme={theme}
                onThemeToggle={toggleTheme}
            />
            <div className="lg:pl-64">
                <AdminHeader
                    onMenuClick={() => setSidebarOpen(true)}
                    theme={theme}
                    onThemeToggle={toggleTheme}
                />
                <main className="p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Onboarding Tour — dashboard root only. Its 5 steps target dashboard
                widgets, so it must not auto-pop over sub-tools like /admin/workshop. */}
            <OnboardingTour isOpen={showTour && pathname === "/admin"} onComplete={endTour} />
        </div>
    )
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AdminAuth>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </AdminAuth>
    )
}

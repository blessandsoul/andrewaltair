"use client"

import * as React from "react"
import { AdminSidebar, AdminHeader } from "@/components/admin/AdminSidebar"
import { AdminAuth } from "@/components/admin/AdminAuth"
import { OnboardingTour, useOnboarding } from "@/components/admin/OnboardingTour"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = React.useState(false)
    const [theme, setTheme] = React.useState<"light" | "dark">("light")
    const { showTour, endTour } = useOnboarding()

    // Initialize theme from localStorage or system preference
    React.useEffect(() => {
        const savedTheme = localStorage.getItem("admin_theme") as "light" | "dark" | null
        if (savedTheme) {
            setTheme(savedTheme)
        } else {
            // Default to light for admin panel
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

    return (
        <AdminAuth>
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
            </div>

            {/* Onboarding Tour */}
            <OnboardingTour isOpen={showTour} onComplete={endTour} />
        </AdminAuth>
    )
}

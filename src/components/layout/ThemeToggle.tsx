"use client"

import * as React from "react"
import { TbMoon, TbSun, TbDeviceDesktop } from "react-icons/tb"
import { Button } from "@/components/ui/button"

type Theme = "light" | "dark" | "system"

export function ThemeToggle() {
    const [theme, setTheme] = React.useState<Theme>("light")
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
        const savedTheme = localStorage.getItem("theme") as Theme | null
        if (savedTheme) {
            setTheme(savedTheme)
            applyTheme(savedTheme)
        } else {
            // Default to light
            applyTheme("light")
        }
    }, [])

    const applyTheme = (newTheme: Theme) => {
        const root = document.documentElement

        if (newTheme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
            root.classList.toggle("dark", systemTheme === "dark")
        } else {
            root.classList.toggle("dark", newTheme === "dark")
        }
    }

    const cycleTheme = () => {
        const themes: Theme[] = ["light", "dark", "system"]
        const currentIndex = themes.indexOf(theme)
        const nextTheme = themes[(currentIndex + 1) % themes.length]

        setTheme(nextTheme)
        localStorage.setItem("theme", nextTheme)
        applyTheme(nextTheme)
    }

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="relative">
                <TbSun className="h-5 w-5" />
            </Button>
        )
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            className="relative group"
            title={`Current: ${theme}`}
        >
            {theme === "light" && (
                <TbSun className="h-5 w-5 transition-transform group-hover:rotate-45" />
            )}
            {theme === "dark" && (
                <TbMoon className="h-5 w-5 transition-transform group-hover:-rotate-12" />
            )}
            {theme === "system" && (
                <TbDeviceDesktop className="h-5 w-5 transition-transform group-hover:scale-110" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

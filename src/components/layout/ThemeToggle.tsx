"use client"

import * as React from "react"
import { TbMoon, TbSun } from "react-icons/tb"
import { Button } from "@/components/ui/button"

type Theme = "light" | "dark"

export function ThemeToggle() {
    const [theme, setTheme] = React.useState<Theme>("light")
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
        const savedTheme = localStorage.getItem("theme") as Theme | null
        if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
            setTheme(savedTheme)
            applyTheme(savedTheme)
        } else {
            // Default to light
            applyTheme("light")
        }
    }, [])

    const applyTheme = (newTheme: Theme) => {
        const root = document.documentElement
        root.classList.toggle("dark", newTheme === "dark")
    }

    const toggleTheme = () => {
        const nextTheme: Theme = theme === "light" ? "dark" : "light"
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
            onClick={toggleTheme}
            className="relative group"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
            {theme === "light" ? (
                <TbSun className="h-5 w-5 transition-transform group-hover:rotate-45" />
            ) : (
                <TbMoon className="h-5 w-5 transition-transform group-hover:-rotate-12" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

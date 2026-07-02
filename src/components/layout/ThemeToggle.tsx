"use client"

import * as React from "react"
import { TbMoon, TbSun } from "react-icons/tb"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
            // No saved choice: honor the OS preference on first paint
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            const initial: Theme = prefersDark ? "dark" : "light"
            setTheme(initial)
            applyTheme(initial)
        }
    }, [])

    const applyTheme = (newTheme: Theme) => {
        document.documentElement.classList.toggle("dark", newTheme === "dark")
    }

    const toggleTheme = () => {
        const nextTheme: Theme = theme === "light" ? "dark" : "light"
        setTheme(nextTheme)
        localStorage.setItem("theme", nextTheme)
        applyTheme(nextTheme)
    }

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="relative" aria-hidden="true">
                <TbSun className="h-5 w-5" />
            </Button>
        )
    }

    const isLight = theme === "light"

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative"
            aria-label={isLight ? "ბნელ რეჟიმზე გადართვა" : "ნათელ რეჟიმზე გადართვა"}
            title={isLight ? "ბნელ რეჟიმზე გადართვა" : "ნათელ რეჟიმზე გადართვა"}
        >
            <span className="relative inline-flex h-5 w-5 items-center justify-center">
                <TbSun
                    className={cn(
                        "absolute h-5 w-5 transition-[transform,opacity,filter] duration-300 motion-reduce:transition-none",
                        isLight ? "scale-100 opacity-100 blur-0" : "scale-50 opacity-0 blur-xs"
                    )}
                />
                <TbMoon
                    className={cn(
                        "absolute h-5 w-5 transition-[transform,opacity,filter] duration-300 motion-reduce:transition-none",
                        isLight ? "scale-50 opacity-0 blur-xs" : "scale-100 opacity-100 blur-0"
                    )}
                />
            </span>
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

"use client"

import Link from "next/link"
import { TbHome, TbSparkles, TbChartBar, TbUser } from "react-icons/tb"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "მთავარი", icon: TbHome },
  { href: "/blog", label: "Explore", icon: TbSparkles },
  { href: "/prompts", label: "Insights", icon: TbChartBar },
  { href: "/profile", label: "Profile", icon: TbUser },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden w-[85%] max-w-sm">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-border/20">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-all duration-200",
                  isActive
                    ? "bg-primary text-white"
                    : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

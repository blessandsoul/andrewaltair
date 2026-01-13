"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { TbLayoutDashboard, TbFileText, TbVideo, TbMessage, TbChevronLeft, TbMenu2, TbX, TbSparkles, TbSun, TbMoon, TbSearch, TbBell, TbSettings, TbDownload, TbChartBar, TbActivity, TbTag, TbFolderOpen, TbPhoto, TbUsers, TbWorld, TbTool, TbPencil, TbKeyboard, TbCommand, TbBook, TbBrandGithub } from "react-icons/tb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface NavItem {
    href: string
    label: string
    icon: React.ReactNode
    badge?: string
}

const contentItems: NavItem[] = [
    { href: "/admin", label: "Dashboard", icon: <TbLayoutDashboard className="w-5 h-5" /> },
    { href: "/admin/content", label: "ედიტორი", icon: <TbPencil className="w-5 h-5" /> },
    { href: "/admin/posts", label: "პოსტები", icon: <TbFileText className="w-5 h-5" /> },
    { href: "/admin/encyclopedia", label: "ენციკლოპედია", icon: <TbBook className="w-5 h-5" />, badge: "new" },
    { href: "/admin/marketplace-prompts", label: "პრომპტები", icon: <TbSparkles className="w-5 h-5" /> },
    { href: "/admin/repositories", label: "რეპოზიტორიები", icon: <TbBrandGithub className="w-5 h-5" />, badge: "beta" },
    { href: "/admin/videos", label: "ვიდეოები", icon: <TbVideo className="w-5 h-5" /> },
    { href: "/admin/tutorials", label: "ტუტორიალები", icon: <TbBook className="w-5 h-5" />, badge: "beta" },
    { href: "/admin/media", label: "მედია", icon: <TbPhoto className="w-5 h-5" /> },
]

const organizationItems: NavItem[] = [
    { href: "/admin/tags", label: "თეგები", icon: <TbTag className="w-5 h-5" /> },
    { href: "/admin/categories", label: "კატეგორიები", icon: <TbFolderOpen className="w-5 h-5" /> },
    { href: "/admin/comments", label: "კომენტარები", icon: <TbMessage className="w-5 h-5" />, badge: "new" },
]

const systemItems: NavItem[] = [
    { href: "/admin/analytics", label: "ანალიტიკა", icon: <TbChartBar className="w-5 h-5" /> },
    { href: "/admin/users", label: "მომხმარებლები", icon: <TbUsers className="w-5 h-5" /> },
    { href: "/admin/seo", label: "SEO", icon: <TbWorld className="w-5 h-5" /> },
    { href: "/admin/tools", label: "ინსტრუმენტები", icon: <TbTool className="w-5 h-5" /> },
    { href: "/admin/settings", label: "პარამეტრები", icon: <TbSettings className="w-5 h-5" /> },
]

interface AdminSidebarProps {
    isOpen: boolean
    onClose: () => void
    theme: "light" | "dark"
    onThemeToggle: () => void
}

export function AdminSidebar({ isOpen, onClose, theme, onThemeToggle }: AdminSidebarProps) {
    const pathname = usePathname()

    const NavSection = ({ title, items }: { title: string; items: NavItem[] }) => (
        <>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mt-4 mb-2">
                {title}
            </div>
            {items.map((item) => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                            isActive
                                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                    >
                        {item.icon}
                        <span className="font-medium flex-1 text-sm">{item.label}</span>
                        {item.badge && (
                            <Badge
                                variant={item.badge === "new" ? "default" : "secondary"}
                                className="text-xs h-5"
                            >
                                {item.badge}
                            </Badge>
                        )}
                    </Link>
                )
            })}
        </>
    )

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0 flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="h-14 flex items-center justify-between px-4 border-b border-border">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <TbSparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg">Admin</span>
                    </Link>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onThemeToggle}
                            className="h-8 w-8"
                        >
                            {theme === "dark" ? (
                                <TbSun className="w-4 h-4" />
                            ) : (
                                <TbMoon className="w-4 h-4" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden h-8 w-8"
                            onClick={onClose}
                        >
                            <TbX className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-3 flex-1 overflow-y-auto">
                    <NavSection title="კონტენტი" items={contentItems} />
                    <NavSection title="ორგანიზაცია" items={organizationItems} />
                    <NavSection title="სისტემა" items={systemItems} />
                </nav>

                {/* TbKeyboard Shortcuts Hint */}
                <div className="p-3 border-t border-border">
                    <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2 mb-2">
                            <TbKeyboard className="w-4 h-4" />
                            <span className="font-medium">Shortcuts</span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <span>ძიება</span>
                                <kbd className="bg-background px-1.5 rounded">⌘K</kbd>
                            </div>
                            <div className="flex justify-between">
                                <span>შენახვა</span>
                                <kbd className="bg-background px-1.5 rounded">⌘S</kbd>
                            </div>
                            <div className="flex justify-between">
                                <span>ახალი</span>
                                <kbd className="bg-background px-1.5 rounded">⌘N</kbd>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back to site */}
                <div className="p-3 border-t border-border">
                    <Link href="/">
                        <Button variant="outline" className="w-full justify-start gap-2 h-9">
                            <TbChevronLeft className="w-4 h-4" />
                            საიტზე დაბრუნება
                        </Button>
                    </Link>
                </div>
            </aside>
        </>
    )
}

export function AdminHeader({
    onMenuClick,
    theme,
    onThemeToggle
}: {
    onMenuClick: () => void
    theme: "light" | "dark"
    onThemeToggle: () => void
}) {
    const [showSearch, setShowSearch] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [notifications] = React.useState(3)
    const router = useRouter()

    // TbKeyboard shortcuts
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // ⌘K or Ctrl+K for search
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault()
                setShowSearch(true)
            }
            // Escape to close
            if (e.key === "Escape") {
                setShowSearch(false)
                setSearchQuery("")
            }
            // ⌘N for new post
            if ((e.metaKey || e.ctrlKey) && e.key === "n") {
                e.preventDefault()
                router.push("/admin/content")
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [router])

    const searchResults = [
        { type: "page", label: "Dashboard", href: "/admin", icon: TbLayoutDashboard },
        { type: "page", label: "პოსტები", href: "/admin/posts", icon: TbFileText },
        { type: "page", label: "ენციკლოპედია", href: "/admin/encyclopedia", icon: TbBook },
        { type: "page", label: "ვიდეოები", href: "/admin/videos", icon: TbVideo },
        { type: "page", label: "კომენტარები", href: "/admin/comments", icon: TbMessage },
        { type: "page", label: "ანალიტიკა", href: "/admin/analytics", icon: TbChartBar },
        { type: "page", label: "პარამეტრები", href: "/admin/settings", icon: TbSettings },
        { type: "action", label: "ახალი პოსტის შექმნა", href: "/admin/content", icon: TbPencil },
        { type: "action", label: "მედიის ატვირთვა", href: "/admin/media", icon: TbPhoto },
    ]

    const filteredResults = searchQuery
        ? searchResults.filter(r => r.label.toLowerCase().includes(searchQuery.toLowerCase()))
        : searchResults

    return (
        <>
            <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30 flex items-center px-4 lg:pl-72 gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={onMenuClick}
                >
                    <TbMenu2 className="w-5 h-5" />
                </Button>

                {/* TbSearch Button */}
                <button
                    onClick={() => setShowSearch(true)}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-muted-foreground text-sm hover:bg-muted transition-colors"
                >
                    <TbSearch className="w-4 h-4" />
                    <span>ძიება...</span>
                    <kbd className="ml-4 text-xs bg-background px-1.5 py-0.5 rounded border">⌘K</kbd>
                </button>

                <div className="flex-1" />

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="hidden sm:flex h-9 w-9">
                        <TbDownload className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onThemeToggle}
                        className="hidden lg:flex h-9 w-9"
                    >
                        {theme === "dark" ? (
                            <TbSun className="w-4 h-4" />
                        ) : (
                            <TbMoon className="w-4 h-4" />
                        )}
                    </Button>

                    <Button variant="ghost" size="icon" className="relative h-9 w-9">
                        <TbBell className="w-4 h-4" />
                        {notifications > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center px-1">
                                {notifications}
                            </span>
                        )}
                    </Button>

                    {/* Logout Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            sessionStorage.removeItem("admin_auth")
                            window.location.reload()
                        }}
                        className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                        <TbX className="w-4 h-4" />
                        <span className="hidden sm:inline">გასვლა</span>
                    </Button>
                </div>
            </header>

            {/* TbCommand TbPalette / TbSearch Modal */}
            {showSearch && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-[15vh]">
                    <div className="w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden mx-4">
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                            <TbCommand className="w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ძიება გვერდებში, მოქმედებებში..."
                                className="flex-1 bg-transparent outline-none text-lg"
                                autoFocus
                            />
                            <kbd className="text-xs bg-muted px-2 py-1 rounded">ESC</kbd>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {filteredResults.length > 0 ? (
                                <div className="p-2">
                                    {filteredResults.map((result, i) => (
                                        <Link
                                            key={i}
                                            href={result.href}
                                            onClick={() => {
                                                setShowSearch(false)
                                                setSearchQuery("")
                                            }}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
                                        >
                                            <result.icon className="w-5 h-5 text-muted-foreground" />
                                            <span className="flex-1">{result.label}</span>
                                            <Badge variant="secondary" className="text-xs">
                                                {result.type === "page" ? "გვერდი" : "მოქმედება"}
                                            </Badge>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-muted-foreground">
                                    შედეგები ვერ მოიძებნა
                                </div>
                            )}
                        </div>
                        <div className="border-t border-border p-3 flex items-center justify-between text-xs text-muted-foreground">
                            <span>↑↓ ნავიგაცია</span>
                            <span>↵ გახსნა</span>
                            <span>ESC დახურვა</span>
                        </div>
                    </div>
                    <div className="fixed inset-0 -z-10" onClick={() => setShowSearch(false)} />
                </div>
            )}
        </>
    )
}


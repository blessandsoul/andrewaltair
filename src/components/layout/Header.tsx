"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  TbRobot,
  TbBook,
  TbVideo,
  TbSettings,
  TbBulb,
  TbBriefcase,
  TbShoppingBag,
  TbUser,
  TbSearch,
  TbMenu2,
  TbX,
  TbLogin,
  TbUserPlus,
  TbLogout,
  TbChevronDown,
  TbSparkles,
  TbShield,
  TbCrown,
  TbChartBar,
} from "react-icons/tb"
import { useState } from "react"
import { ThemeToggle } from "./ThemeToggle"
import { SearchDialog, useSearchDialog } from "@/components/interactive/SearchDialog"
import { useAuth, ROLE_CONFIG } from "@/lib/auth"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

// Main nav items (flat links)
const mainNavItems = [
  { href: "/blog", label: "ბლოგი" },
  { href: "/prompts", label: "პრომპტები" },
  { href: "/bots", label: "ბოტები" },
  { href: "/services", label: "სერვისები" },
]

// Explore dropdown
const exploreItems = [
  { href: "/videos", label: "ვიდეოები", icon: TbVideo, description: "YouTube გაკვეთილები" },
  { href: "/tools", label: "ხელსაწყოები", icon: TbSettings, description: "AI ხელსაწყოების რეიტინგი" },
  { href: "/encyclopedia", label: "ენციკლოპედია", icon: TbBook, description: "AI ცოდნის ბაზა" },
  { href: "/lessons", label: "გაკვეთილები", icon: TbBulb, description: "მიკრო-გაკვეთილები" },
  { href: "/about", label: "ჩვენს შესახებ", icon: TbUser, description: "Andrew Altair" },
]

// Mobile menu — all sections
const mobileNavSections = [
  {
    category: "მთავარი",
    items: [
      { href: "/blog", label: "ბლოგი", icon: TbBook },
      { href: "/prompts", label: "პრომპტები", icon: TbShoppingBag },
      { href: "/bots", label: "ბოტები", icon: TbRobot },
      { href: "/services", label: "სერვისები", icon: TbBriefcase },
    ],
  },
  {
    category: "მეტი",
    items: exploreItems.map((i) => ({ href: i.href, label: i.label, icon: i.icon })),
  },
]

function UserProfileDropdown() {
  const { user, logout, isGod, isAdmin } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const roleConfig = ROLE_CONFIG[user.role]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition-colors"
      >
        <div
          className={`relative w-8 h-8 rounded-full bg-linear-to-br ${roleConfig.color} flex items-center justify-center text-white font-bold text-sm overflow-hidden`}
        >
          {user.avatar ? (
            <Image src={user.avatar} alt={user.fullName} fill className="object-cover" />
          ) : (
            user.fullName[0]
          )}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium flex items-center gap-1">
            {user.fullName}
            {isGod && <TbCrown className="w-4 h-4 text-yellow-500" />}
          </div>
          <div className="text-xs text-muted-foreground">{roleConfig.label}</div>
        </div>
        <TbChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 z-50 bg-card rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div
                  className={`relative w-12 h-12 rounded-full bg-linear-to-br ${roleConfig.color} flex items-center justify-center text-white font-bold overflow-hidden`}
                >
                  {user.avatar ? (
                    <Image src={user.avatar} alt={user.fullName} fill className="object-cover" />
                  ) : (
                    user.fullName[0]
                  )}
                </div>
                <div>
                  <div className="font-medium flex items-center gap-1">
                    {user.fullName}
                    {isGod && <TbCrown className="w-4 h-4 text-yellow-500" />}
                  </div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                  {user.badge && <div className="text-xs text-primary mt-1">{user.badge}</div>}
                </div>
              </div>
            </div>

            <div className="py-2">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
              >
                <TbUser className="w-4 h-4 text-muted-foreground" />
                პროფილი
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
              >
                <TbSettings className="w-4 h-4 text-muted-foreground" />
                პარამეტრები
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors text-primary"
                >
                  <TbShield className="w-4 h-4" />
                  ადმინ პანელი
                  {isGod && (
                    <span className="ml-auto text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded">
                      GOD
                    </span>
                  )}
                </Link>
              )}
            </div>

            <div className="border-t border-border py-2">
              <button
                onClick={() => {
                  logout()
                  setIsOpen(false)
                }}
                className="flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 w-full transition-colors"
              >
                <TbLogout className="w-4 h-4" />
                გასვლა
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const search = useSearchDialog()
  const { user, isLoading, logout } = useAuth()
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-[60] w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-outline-variant/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-primary-container flex items-center justify-center text-white shadow-sm group-hover:shadow-primary/20 group-hover:shadow-md transition-shadow">
                <TbRobot className="w-5 h-5" />
              </div>
              <span className="font-headline font-bold text-lg tracking-tight text-on-surface">
                Altair AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {mainNavItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "inline-flex h-10 items-center px-4 text-sm font-medium transition-colors rounded-lg",
                          pathname === item.href
                            ? "text-primary font-semibold border-b-2 border-primary rounded-none"
                            : "text-on-surface-variant hover:text-primary hover:bg-muted"
                        )}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}

                {/* Explore Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10 px-4 text-sm font-medium text-on-surface-variant bg-transparent hover:text-primary">
                    მეტი
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[280px] gap-1 p-3">
                      {exploreItems.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-muted transition-colors group"
                            >
                              <item.icon className="w-4 h-4 text-primary shrink-0" />
                              <div className="min-w-0">
                                <div className="font-medium text-sm text-on-surface">
                                  {item.label}
                                </div>
                                <div className="text-xs text-on-surface-variant truncate">
                                  {item.description}
                                </div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="relative group">
                <button
                  onClick={search.open}
                  className="flex items-center gap-2 bg-surface-container-low rounded-full pl-4 pr-3 py-1.5 text-sm text-on-surface-variant w-56 hover:bg-muted transition-colors"
                >
                  <TbSearch className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">ძებნა...</span>
                  <span className="text-xs opacity-50 hidden xl:block">Ctrl K</span>
                </button>
              </div>

              <ThemeToggle />

              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              ) : user ? (
                <UserProfileDropdown />
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="gap-2 text-on-surface-variant">
                      <TbLogin className="w-4 h-4" />
                      შესვლა
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      size="sm"
                      className="gap-2 bg-linear-to-br from-primary to-primary-container text-white border-0 shadow-sm hover:shadow-primary/20 hover:shadow-md transition-shadow"
                    >
                      <TbUserPlus className="w-4 h-4" />
                      რეგისტრაცია
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <Button variant="ghost" size="icon" onClick={search.open}>
                <TbSearch className="w-5 h-5" />
              </Button>
              <ThemeToggle />
              {user && (
                <div
                  className={`relative w-8 h-8 rounded-full bg-linear-to-br ${ROLE_CONFIG[user.role].color} flex items-center justify-center text-white font-bold text-xs overflow-hidden`}
                >
                  {user.avatar ? (
                    <Image src={user.avatar} alt={user.fullName} fill className="object-cover" />
                  ) : (
                    user.fullName[0]
                  )}
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <TbX className="w-5 h-5" /> : <TbMenu2 className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-border/30 py-4 animate-in slide-in-from-top-2 max-h-[70vh] overflow-y-auto">
              <nav className="space-y-4">
                {user && (
                  <div className="px-4 py-3 mb-4 bg-muted/30 rounded-xl mx-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`relative w-10 h-10 rounded-full bg-linear-to-br ${ROLE_CONFIG[user.role].color} flex items-center justify-center text-white font-bold overflow-hidden`}
                      >
                        {user.avatar ? (
                          <Image src={user.avatar} alt={user.fullName} fill className="object-cover" />
                        ) : (
                          user.fullName[0]
                        )}
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          {user.fullName}
                          {user.role === "god" && <TbCrown className="w-4 h-4 text-yellow-500" />}
                        </div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </div>
                )}

                {mobileNavSections.map((section) => (
                  <div key={section.category} className="space-y-1">
                    <div className="px-4 py-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                      {section.category}
                    </div>
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors mx-1",
                          pathname === item.href
                            ? "text-primary bg-primary/10 font-semibold"
                            : "text-on-surface-variant hover:text-on-surface hover:bg-muted"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="w-4 h-4 mr-3 text-primary/70 shrink-0" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}

                <div className="flex items-center gap-2 px-4 pt-4 border-t border-border/30">
                  {user ? (
                    <>
                      <Link href="/admin" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <TbShield className="w-4 h-4" />
                          ადმინ
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1 gap-2"
                        onClick={() => {
                          logout()
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        <TbLogout className="w-4 h-4" />
                        გასვლა
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <TbLogin className="w-4 h-4" />
                          შესვლა
                        </Button>
                      </Link>
                      <Link href="/register" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button
                          size="sm"
                          className="w-full gap-2 bg-linear-to-br from-primary to-primary-container text-white border-0"
                        >
                          <TbUserPlus className="w-4 h-4" />
                          რეგისტრაცია
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <SearchDialog isOpen={search.isOpen} onClose={search.close} />
    </>
  )
}

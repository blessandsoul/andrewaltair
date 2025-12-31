"use client"

import Link from "next/link"
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
  Search, Menu, X, Sparkles,
  BookOpen, Video,
  Wrench, ShoppingBag, Briefcase, HelpCircle,
  User,
  LogIn, UserPlus, LogOut, Settings, Shield, ChevronDown
} from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "./ThemeToggle"
import { SearchDialog, useSearchDialog } from "@/components/interactive/SearchDialog"
import { useAuth, ROLE_CONFIG } from "@/lib/auth"

const contentItems = [
  { href: "/blog", label: "ბლოგი", icon: BookOpen, description: "სტატიები და სიახლეები" },
  { href: "/videos", label: "ვიდეოები", icon: Video, description: "YouTube ტუტორიალები" },
]

const servicesItems = [
  { href: "/tools", label: "AI ინსტრუმენტები", icon: Wrench, description: "რეიტინგები და მიმოხილვები" },
  { href: "/mystic", label: "მისტიკური AI", icon: Sparkles, description: "AI პრედიქციები" },
  { href: "/new-features", label: "ახალი ფუნქციები", icon: Sparkles, description: "20 კონვერსიის კომპონენტი" },
  { href: "/services", label: "კონსულტაცია", icon: Briefcase, description: "AI კონსალტინგი" },
  { href: "/products", label: "პროდუქტები", icon: ShoppingBag, description: "კურსები და ტემპლეიტები" },
  { href: "/quiz", label: "AI ქვიზი", icon: HelpCircle, description: "იპოვე შენი AI" },
]



const aboutItems = [
  { href: "/about", label: "ჩემ შესახებ", icon: User, description: "Andrew Altair" },
]

// All items for mobile
const allMobileItems = [
  { category: "კონტენტი", items: contentItems },
  { category: "სერვისები", items: servicesItems },
  { category: "შესახებ", items: aboutItems },
]

// User Profile Dropdown
function UserProfileDropdown() {
  const { user, logout, isGod, isAdmin } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const roleConfig = ROLE_CONFIG[user.role]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-secondary transition-colors"
      >
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${roleConfig.color} flex items-center justify-center text-white font-bold text-sm`}>
          {user.fullName[0]}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium flex items-center gap-1">
            {user.fullName}
            {isGod && <span className="text-yellow-500">👑</span>}
          </div>
          <div className="text-xs text-muted-foreground">{roleConfig.label}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
            {/* User Info */}
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${roleConfig.color} flex items-center justify-center text-white font-bold`}>
                  {user.fullName[0]}
                </div>
                <div>
                  <div className="font-medium flex items-center gap-1">
                    {user.fullName}
                    {isGod && <span>👑</span>}
                  </div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                  {user.badge && (
                    <div className="text-xs text-primary mt-1">{user.badge}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
              >
                <User className="w-4 h-4 text-muted-foreground" />
                პროფილი
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                პარამეტრები
              </Link>

              {/* Admin Link - Only for admins */}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors text-primary"
                >
                  <Shield className="w-4 h-4" />
                  ადმინ პანელი
                  {isGod && <span className="ml-auto text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded">GOD</span>}
                </Link>
              )}
            </div>

            {/* Logout */}
            <div className="border-t border-border py-2">
              <button
                onClick={() => {
                  logout()
                  setIsOpen(false)
                }}
                className="flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 w-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
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
  const { user, isLoading } = useAuth()

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform shadow-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl text-gradient">
                  Andrew Altair
                </span>
                <div className="text-xs text-muted-foreground">AI ინოვატორი</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {/* Home */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className="group inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-secondary hover:text-foreground text-muted-foreground"
                    >
                      მთავარი
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Content Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10 px-4 text-sm font-medium text-muted-foreground bg-transparent">
                    კონტენტი
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[320px] gap-2 p-4">
                      {contentItems.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className="group flex items-center gap-3 rounded-lg p-2 hover:bg-secondary transition-colors"
                            >
                              <item.icon className="w-5 h-5 text-primary shrink-0" />
                              <div className="min-w-0">
                                <div className="font-medium text-sm">{item.label}</div>
                                <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Services Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10 px-4 text-sm font-medium text-muted-foreground bg-transparent">
                    სერვისები
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[320px] gap-2 p-4">
                      {servicesItems.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className="group flex items-center gap-3 rounded-lg p-2 hover:bg-secondary transition-colors"
                            >
                              <item.icon className="w-5 h-5 text-primary shrink-0" />
                              <div className="min-w-0">
                                <div className="font-medium text-sm">{item.label}</div>
                                <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>



                {/* About Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10 px-4 text-sm font-medium text-muted-foreground bg-transparent">
                    შესახებ
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[320px] gap-2 p-4">
                      {aboutItems.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className="group flex items-center gap-3 rounded-lg p-2 hover:bg-secondary transition-colors"
                            >
                              <item.icon className="w-5 h-5 text-primary shrink-0" />
                              <div className="min-w-0">
                                <div className="font-medium text-sm">{item.label}</div>
                                <div className="text-xs text-muted-foreground truncate">{item.description}</div>
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
            <div className="hidden lg:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground gap-2"
                onClick={search.open}
              >
                <Search className="w-4 h-4" />
                <span className="text-xs">⌘K</span>
              </Button>
              <ThemeToggle />

              {/* Auth Buttons or User Profile */}
              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              ) : user ? (
                <UserProfileDropdown />
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <LogIn className="w-4 h-4" />
                      შესვლა
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0 shadow-lg">
                      <UserPlus className="w-4 h-4" />
                      რეგისტრაცია
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={search.open}>
                <Search className="w-5 h-5" />
              </Button>
              <ThemeToggle />
              {user && (
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${ROLE_CONFIG[user.role].color} flex items-center justify-center text-white font-bold text-xs`}>
                  {user.fullName[0]}
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-border py-4 animate-in slide-in-from-top-2 max-h-[70vh] overflow-y-auto">
              <nav className="space-y-4">
                {/* User Info (Mobile) */}
                {user && (
                  <div className="px-4 py-3 mb-4 bg-muted/30 rounded-lg mx-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${ROLE_CONFIG[user.role].color} flex items-center justify-center text-white font-bold`}>
                        {user.fullName[0]}
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          {user.fullName}
                          {user.role === "god" && <span>👑</span>}
                        </div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Home */}
                <Link
                  href="/"
                  className="flex items-center px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Sparkles className="w-5 h-5 mr-3 text-primary" />
                  მთავარი
                </Link>

                {/* Categories */}
                {allMobileItems.map((category) => (
                  <div key={category.category} className="space-y-1">
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {category.category}
                    </div>
                    {category.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="w-4 h-4 mr-3 text-primary/70" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}

                {/* Auth Actions */}
                <div className="flex items-center space-x-2 px-4 pt-4 border-t border-border">
                  {user ? (
                    <>
                      <Link href="/admin" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <Shield className="w-4 h-4" />
                          ადმინ პანელი
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1 gap-2"
                        onClick={() => {
                          const { logout } = useAuth()
                          logout()
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        გასვლა
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <LogIn className="w-4 h-4" />
                          შესვლა
                        </Button>
                      </Link>
                      <Link href="/register" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button size="sm" className="w-full gap-2 bg-gradient-to-r from-primary to-accent text-white border-0">
                          <UserPlus className="w-4 h-4" />
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

      {/* Search Dialog */}
      <SearchDialog isOpen={search.isOpen} onClose={search.close} />
    </>
  )
}

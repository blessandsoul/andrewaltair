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
  Search, Menu, X, Sparkles, Send,
  BookOpen, Video, Mic, Radio, FileText,
  Wrench, ShoppingBag, Briefcase, HelpCircle,
  Users, Calendar, MessageCircle,
  Trophy, Star, Newspaper, User, Handshake
} from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "./ThemeToggle"
import { SearchDialog, useSearchDialog } from "@/components/interactive/SearchDialog"

const contentItems = [
  { href: "/blog", label: "ბლოგი", icon: BookOpen, description: "სტატიები და სიახლეები" },
  { href: "/videos", label: "ვიდეოები", icon: Video, description: "YouTube ტუტორიალები" },
  { href: "/podcast", label: "პოდკასტი", icon: Mic, description: "აუდიო ეპიზოდები" },
  { href: "/live", label: "ლაივები", icon: Radio, description: "სტრიმების განრიგი" },
  { href: "/guides", label: "გაიდები", icon: FileText, description: "უფასო რესურსები" },
]

const servicesItems = [
  { href: "/tools", label: "AI ინსტრუმენტები", icon: Wrench, description: "რეიტინგები და მიმოხილვები" },
  { href: "/services", label: "კონსულტაცია", icon: Briefcase, description: "AI კონსალტინგი" },
  { href: "/products", label: "პროდუქტები", icon: ShoppingBag, description: "კურსები და ტემპლეიტები" },
  { href: "/quiz", label: "AI ქვიზი", icon: HelpCircle, description: "იპოვე შენი AI" },
]

const communityItems = [
  { href: "/community", label: "კომიუნითი", icon: Users, description: "Telegram & Discord" },
  { href: "/events", label: "ღონისძიებები", icon: Calendar, description: "ვორქშოპები და მითაფები" },
  { href: "/faq", label: "FAQ", icon: MessageCircle, description: "ხშირი კითხვები" },
]

const aboutItems = [
  { href: "/case-studies", label: "კეისები", icon: Trophy, description: "წარმატების ისტორიები" },
  { href: "/testimonials", label: "შეფასებები", icon: Star, description: "კლიენტების გამოხმაურება" },
  { href: "/press", label: "პრესა", icon: Newspaper, description: "მედია გამოჩენები" },
  { href: "/about", label: "ჩემ შესახებ", icon: User, description: "Andrew Altair" },
  { href: "/affiliates", label: "პარტნიორობა", icon: Handshake, description: "Affiliate პროგრამა" },
]

// All items for mobile
const allMobileItems = [
  { category: "კონტენტი", items: contentItems },
  { category: "სერვისები", items: servicesItems },
  { category: "კომიუნითი", items: communityItems },
  { category: "შესახებ", items: aboutItems },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const search = useSearchDialog()

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

                {/* Community Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10 px-4 text-sm font-medium text-muted-foreground bg-transparent">
                    კომიუნითი
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[280px] gap-2 p-4">
                      {communityItems.map((item) => (
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
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0 shadow-lg hover:shadow-xl transition-all glow-sm">
                <Send className="w-4 h-4 mr-2" />
                გამოწერა
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={search.open}>
                <Search className="w-5 h-5" />
              </Button>
              <ThemeToggle />
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

                {/* Actions */}
                <div className="flex items-center space-x-2 px-4 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => { search.open(); setIsMobileMenuOpen(false); }}>
                    <Search className="w-4 h-4 mr-2" />
                    ძიება
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-primary to-accent text-white border-0">
                    <Send className="w-4 h-4 mr-2" />
                    გამოწერა
                  </Button>
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

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Search, Menu, X, Sparkles, Send } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "./ThemeToggle"
import { SearchDialog, useSearchDialog } from "@/components/interactive/SearchDialog"

const navItems = [
  { href: "/", label: "მთავარი" },
  { href: "/blog", label: "ბლოგი" },
  { href: "/videos", label: "ვიდეოები" },
  { href: "/tools", label: "ინსტრუმენტები" },
  { href: "/mystic", label: "მისტიკა" },
  { href: "/features", label: "ფიჩერები" },
  { href: "/resources", label: "რესურსები" },
  { href: "/about", label: "ჩემ შესახებ" },
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
              <NavigationMenuList className="space-x-1">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className="group inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-secondary hover:text-foreground text-muted-foreground"
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
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
            <div className="lg:hidden border-t border-border py-4 animate-in slide-in-from-top-2">
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex items-center space-x-2 px-4 pt-4 border-t border-border mt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={search.open}>
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

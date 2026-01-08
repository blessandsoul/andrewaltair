"use client"

import { Suspense } from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/footer"
import { EasterEgg } from "@/components/interactive/EasterEgg"
import { SocialProofToast } from "@/components/interactive/SocialProofToast"
import { LiveVisitorCounter } from "@/components/interactive/LiveVisitorCounter"
import { AIChatAssistant } from "@/components/ai/AIChatAssistant"
import { ScrollProgress, BackToTop } from "@/components/ui/scroll-progress"
import { VisitorTracker } from "@/components/tracking"

import { HeatmapOverlay } from "@/components/analytics/HeatmapOverlay"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdminRoute = pathname?.startsWith("/admin")
    const isMysticRoute = pathname === "/mystic"
    // Check if on blog post detail page (has slug after /blog/)
    const isBlogPostPage = pathname?.startsWith("/blog/") && pathname !== "/blog/"

    // Don't show main layout elements on admin pages
    if (isAdminRoute) {
        return (
            <>
                <Suspense fallback={null}>
                    <VisitorTracker />
                </Suspense>
                {children}
            </>
        )
    }

    // Mystic page has its own dark theme - hide header/footer for full immersion
    if (isMysticRoute) {
        return (
            <div className="dark bg-[#0a0a12] min-h-screen">
                <Suspense fallback={null}>
                    <VisitorTracker />
                </Suspense>

                {/* Mystic-styled header */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a12]/80 backdrop-blur-xl border-b border-white/5">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="flex h-14 sm:h-16 items-center justify-between">
                            {/* Logo */}
                            <a href="/" className="flex items-center gap-2 sm:gap-3 group">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                    <span className="text-white text-sm sm:text-base">✨</span>
                                </div>
                                <span className="font-bold text-base sm:text-lg text-white hidden sm:block">Andrew Altair</span>
                            </a>

                            {/* Back to main site */}
                            <a
                                href="/"
                                className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
                            >
                                <span>მთავარი გვერდი</span>
                                <span>→</span>
                            </a>
                        </div>
                    </div>
                </header>

                {/* Main content with padding for fixed header */}
                <main className="pt-14 sm:pt-16">
                    {children}
                </main>

                {/* Simple mystic footer */}
                <footer className="border-t border-white/5 bg-[#0a0a12] py-6 sm:py-8">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-xs sm:text-sm text-gray-600">
                            © 2024 Andrew Altair • მისტიკური AI სამყარო
                        </p>
                    </div>
                </footer>

                {/* Floating elements */}
                <AIChatAssistant />
            </div>
        )
    }

    return (
        <>
            {/* Visitor Tracking */}
            <Suspense fallback={null}>
                <VisitorTracker />
            </Suspense>

            <ScrollProgress />
            {!isBlogPostPage && <BackToTop />}

            {/* Global Effects */}
            <EasterEgg />

            {/* Main Layout */}
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />

            {/* Floating Elements */}
            <SocialProofToast enabled={true} />
            <LiveVisitorCounter variant="floating" className="!bottom-auto !top-20 !right-4" />
            <AIChatAssistant />
            <Suspense fallback={null}>
                <HeatmapOverlay />
            </Suspense>
        </>
    )
}


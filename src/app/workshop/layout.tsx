import type { Metadata } from 'next'

export const metadata: Metadata = {
    robots: { index: false, follow: false },
}

/**
 * Workshop Room shell — light deck theme, Noto Sans Georgian everywhere,
 * fully isolated from the site chrome (LayoutWrapper skips /workshop).
 */
export default function WorkshopLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="min-h-dvh bg-[#F7F5EE] text-[#0E0F1F] font-georgian"
            style={{
                backgroundImage: 'radial-gradient(circle, rgba(14,15,31,.05) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
            }}
        >
            {children}
        </div>
    )
}

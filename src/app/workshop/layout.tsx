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
            className="workshop-theme hide-scrollbar h-dvh overflow-y-auto bg-background text-foreground font-georgian"
            style={{
                backgroundImage:
                    'radial-gradient(circle, color-mix(in srgb, var(--foreground) 5%, transparent) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
            }}
        >
            {children}
        </div>
    )
}

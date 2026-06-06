"use client"

import * as React from "react"
import { TbMessages, TbTrendingUp } from "react-icons/tb"

import { cn } from "@/lib/utils"

/**
 * Two-tab switch for a forum topic: opinions (the debate) vs predictions. Both panels are
 * rendered into the DOM (inactive one hidden via CSS) so the debate stays server-rendered
 * and crawlable for SEO — the tab only toggles visibility. The predictions tab is omitted
 * entirely when a topic has none.
 */
export function ForumTabs({
    opinions,
    predictions,
    opinionsCount,
    predictionsCount,
}: {
    opinions: React.ReactNode
    predictions: React.ReactNode
    opinionsCount: number
    predictionsCount: number
}) {
    const [tab, setTab] = React.useState<"opinions" | "predictions">("opinions")
    const hasPredictions = predictionsCount > 0
    const active = hasPredictions ? tab : "opinions"

    return (
        <div>
            <div className="mb-5 flex items-center gap-1 border-b border-border/40">
                <TabButton
                    active={active === "opinions"}
                    onClick={() => setTab("opinions")}
                    icon={<TbMessages className="w-4 h-4" />}
                    label="მოსაზრებები"
                    count={opinionsCount}
                />
                {hasPredictions && (
                    <TabButton
                        active={active === "predictions"}
                        onClick={() => setTab("predictions")}
                        icon={<TbTrendingUp className="w-4 h-4" />}
                        label="პროგნოზები"
                        count={predictionsCount}
                    />
                )}
            </div>

            <div className={active === "opinions" ? "" : "hidden"}>{opinions}</div>
            {hasPredictions && <div className={active === "predictions" ? "" : "hidden"}>{predictions}</div>}
        </div>
    )
}

function TabButton({
    active,
    onClick,
    icon,
    label,
    count,
}: {
    active: boolean
    onClick: () => void
    icon: React.ReactNode
    label: string
    count: number
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                active
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant hover:text-on-surface",
            )}
        >
            {icon}
            {label}
            <span
                className={cn(
                    "rounded-full px-1.5 py-0.5 text-xs",
                    active ? "bg-primary/15 text-primary" : "bg-muted text-on-surface-variant",
                )}
            >
                {count}
            </span>
        </button>
    )
}

export default ForumTabs

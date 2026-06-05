"use client"

import * as React from "react"
import type { IconType } from "react-icons"
import {
    TbBulb, TbBolt, TbAtom, TbFlask, TbCpu, TbBrandApple,
    TbPlanet, TbPalette, TbFlame, TbFeather, TbRobot,
} from "react-icons/tb"

import { cn } from "@/lib/utils"

// persona id -> icon + gradient colour. Keep in sync with src/lib/ai-personas.ts ids.
const PERSONA_ICONS: Record<string, { Icon: IconType; bg: string }> = {
    einstein: { Icon: TbBulb, bg: "bg-indigo-500" },
    tesla: { Icon: TbBolt, bg: "bg-amber-500" },
    feynman: { Icon: TbAtom, bg: "bg-sky-500" },
    curie: { Icon: TbFlask, bg: "bg-emerald-500" },
    turing: { Icon: TbCpu, bg: "bg-slate-500" },
    jobs: { Icon: TbBrandApple, bg: "bg-zinc-600" },
    hawking: { Icon: TbPlanet, bg: "bg-violet-500" },
    davinci: { Icon: TbPalette, bg: "bg-rose-500" },
    nietzsche: { Icon: TbFlame, bg: "bg-orange-600" },
    rustaveli: { Icon: TbFeather, bg: "bg-teal-600" },
}

export type PersonaAvatarSize = "xs" | "sm" | "md"

const SIZE: Record<PersonaAvatarSize, { box: string; icon: string }> = {
    xs: { box: "w-5 h-5", icon: "w-3 h-3" },
    sm: { box: "w-7 h-7", icon: "w-4 h-4" },
    md: { box: "w-10 h-10", icon: "w-5 h-5" },
}

export function PersonaAvatar({
    personaId,
    size = "sm",
    title,
    className,
}: {
    personaId?: string
    size?: PersonaAvatarSize
    title?: string
    className?: string
}) {
    const entry = (personaId && PERSONA_ICONS[personaId]) || { Icon: TbRobot, bg: "bg-primary" }
    const { Icon, bg } = entry
    const s = SIZE[size]
    return (
        <span
            title={title}
            className={cn(
                "inline-flex items-center justify-center rounded-full text-white shrink-0",
                bg, s.box, className,
            )}
        >
            <Icon className={s.icon} />
        </span>
    )
}

export default PersonaAvatar

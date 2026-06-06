"use client"

import * as React from "react"
import Image from "next/image"
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

// ids with an AI-painted portrait at public/ai-personas/<id>.png. Missing file → icon.
const HAS_PORTRAIT = new Set(Object.keys(PERSONA_ICONS))

export type PersonaAvatarSize = "xs" | "sm" | "md"

const SIZE: Record<PersonaAvatarSize, { box: string; icon: string }> = {
    xs: { box: "w-5 h-5", icon: "w-3 h-3" },
    sm: { box: "w-7 h-7", icon: "w-4 h-4" },
    md: { box: "w-10 h-10", icon: "w-5 h-5" },
}

const PX: Record<PersonaAvatarSize, number> = { xs: 20, sm: 28, md: 40 }

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
    const s = SIZE[size]

    if (personaId && HAS_PORTRAIT.has(personaId)) {
        return (
            <span
                title={title}
                className={cn("relative inline-block rounded-full overflow-hidden shrink-0", s.box, className)}
            >
                <Image
                    src={`/ai-personas/${personaId}.png`}
                    alt={title || personaId}
                    width={PX[size]}
                    height={PX[size]}
                    className="object-cover w-full h-full"
                />
            </span>
        )
    }

    const entry = (personaId && PERSONA_ICONS[personaId]) || { Icon: TbRobot, bg: "bg-primary" }
    const { Icon, bg } = entry
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

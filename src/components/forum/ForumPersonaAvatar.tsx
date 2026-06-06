"use client"

import * as React from "react"
import Image from "next/image"
import type { IconType } from "react-icons"
import {
    TbCrown, TbFeather, TbPencil, TbFlame, TbSettings, TbStar,
    TbBook, TbBrain, TbShield, TbHammer, TbEye, TbSword, TbUser,
} from "react-icons/tb"

import { cn } from "@/lib/utils"
import { getForumPersona } from "@/lib/georgian-forum-personas"

// icon key (ForumPersona.icon) -> react-icon. Fallback = TbUser.
const ICONS: Record<string, IconType> = {
    crown: TbCrown,
    scroll: TbFeather,
    pen: TbPencil,
    flame: TbFlame,
    gear: TbSettings,
    star: TbStar,
    book: TbBook,
    brain: TbBrain,
    shield: TbShield,
    hammer: TbHammer,
    eye: TbEye,
    sword: TbSword,
}

export type ForumAvatarSize = "xs" | "sm" | "md" | "lg"

const SIZE: Record<ForumAvatarSize, { box: string; icon: string }> = {
    xs: { box: "w-5 h-5", icon: "w-3 h-3" },
    sm: { box: "w-7 h-7", icon: "w-4 h-4" },
    md: { box: "w-10 h-10", icon: "w-5 h-5" },
    lg: { box: "w-12 h-12", icon: "w-6 h-6" },
}

const PX: Record<ForumAvatarSize, number> = { xs: 20, sm: 28, md: 40, lg: 48 }

/**
 * Avatar chip for a Georgian forum persona. Uses the persona's real portrait if one is
 * set, otherwise an icon-on-color chip. `title` shows the name (+era) on hover.
 */
export function ForumPersonaAvatar({
    personaId,
    size = "md",
    title,
    className,
}: {
    personaId?: string
    size?: ForumAvatarSize
    title?: string
    className?: string
}) {
    const persona = getForumPersona(personaId)
    const Icon = (persona && ICONS[persona.icon]) || TbUser
    const bg = persona?.color || "bg-primary"
    const s = SIZE[size]
    const hover = title ?? (persona ? `${persona.name} · ${persona.era}` : undefined)

    if (persona?.portrait) {
        return (
            <span
                title={hover}
                className={cn("relative inline-block rounded-full overflow-hidden shrink-0", s.box, className)}
            >
                <Image src={persona.portrait} alt={persona.name} width={PX[size]} height={PX[size]} className="object-cover w-full h-full" />
            </span>
        )
    }

    return (
        <span
            title={hover}
            className={cn(
                "inline-flex items-center justify-center rounded-full text-white shrink-0",
                bg, s.box, className,
            )}
        >
            <Icon className={s.icon} />
        </span>
    )
}

export default ForumPersonaAvatar

"use client"

import * as React from "react"
import { TbVolume, TbVolumeOff } from "react-icons/tb"

import { forumSoundOn, setForumSound, playKnock } from "@/lib/forum-sound"

/** Speaker toggle for forum SFX (gavel + reaction pops). Off by default; plays a knock
 *  as feedback when enabled. */
export function ForumSoundToggle() {
    const [on, setOn] = React.useState(false)
    React.useEffect(() => { setOn(forumSoundOn()) }, [])

    const toggle = () => {
        const next = !on
        setForumSound(next)
        setOn(next)
        if (next) playKnock()
    }

    return (
        <button
            onClick={toggle}
            title={on ? "ხმა ჩართულია" : "ხმა გამორთულია"}
            className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary"
        >
            {on ? <TbVolume className="w-4 h-4" /> : <TbVolumeOff className="w-4 h-4" />}
        </button>
    )
}

export default ForumSoundToggle

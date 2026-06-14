'use client'

import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { popIn } from '@/components/workshop/motion'
import { STR } from '@/data/workshop-strings'

/**
 * One-time enable-sound gate — the browser needs a user gesture to unlock audio.
 * Extracted from DisplayClient so the projector entry stays under the line cap.
 */
export function EnableSoundOverlay({ onEnable, onSkip }: { onEnable: () => void; onSkip: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-strong fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-background/85"
        >
            <motion.div variants={popIn} initial="initial" animate="animate" transition={{ type: 'spring', stiffness: 220, damping: 16 }}>
                <Button variant="gradient" onClick={onEnable} className="glow-primary h-auto rounded-2xl px-9 py-5 text-2xl">
                    <Volume2 className="size-7" /> {STR.display.enableSound}
                </Button>
            </motion.div>
            <p className="max-w-md text-center text-base text-muted-foreground">{STR.display.enableSoundHint}</p>
            <Button variant="link" onClick={onSkip} className="text-muted-foreground/70 hover:text-muted-foreground">
                {STR.display.enableSoundSkip}
            </Button>
        </motion.div>
    )
}

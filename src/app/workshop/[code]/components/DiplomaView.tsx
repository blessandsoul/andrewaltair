'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Download, Share2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { STR } from '@/data/workshop-strings'
import { cn } from '@/lib/utils'
import { popIn, springPop } from '@/components/workshop/motion'

type DiplomaFormat = 'square' | 'story'

/** Student end screen: their shareable workshop diploma (1080x1080 feed or 1080x1920 story). */
export function DiplomaView({ code, clientId, name }: { code: string; clientId: string; name: string }) {
    const [format, setFormat] = useState<DiplomaFormat>('square')
    const [busy, setBusy] = useState(false)
    const reduceMotion = useReducedMotion()
    const celebrated = useRef(false)
    const url = `/api/workshop/rooms/${code}/diploma/${clientId}${format === 'story' ? '?format=story' : ''}`
    const fileName = `diploma-${name}-${format}.png`

    // One-shot confetti when the diploma appears: the workshop payoff moment.
    useEffect(() => {
        if (reduceMotion || celebrated.current) return
        celebrated.current = true
        let cancelled = false
        import('canvas-confetti')
            .then((m) => {
                if (cancelled) return
                m.default({ particleCount: 130, spread: 78, origin: { y: 0.35 } })
                setTimeout(() => {
                    if (!cancelled) m.default({ particleCount: 70, spread: 100, startVelocity: 32, origin: { y: 0.4 } })
                }, 220)
            })
            .catch(() => {})
        return () => {
            cancelled = true
        }
    }, [reduceMotion])

    const download = (): void => {
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
    }

    const share = async (): Promise<void> => {
        setBusy(true)
        try {
            const res = await fetch(url)
            const blob = await res.blob()
            const file = new File([blob], fileName, { type: 'image/png' })
            const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean }
            if (nav.canShare?.({ files: [file] })) {
                await nav.share!({ files: [file], title: STR.diploma.shareTitle })
            } else if (nav.share) {
                await nav.share({ title: STR.diploma.shareTitle, url: location.href })
            } else {
                await navigator.clipboard?.writeText(location.href)
            }
        } catch {
            /* user cancelled or unsupported, silent */
        } finally {
            setBusy(false)
        }
    }

    return (
        <motion.div
            variants={reduceMotion ? undefined : popIn}
            initial={reduceMotion ? false : 'initial'}
            animate={reduceMotion ? undefined : 'animate'}
            transition={springPop}
            className="flex flex-col items-center gap-4"
        >
            <p className="text-center text-2xl font-bold text-foreground">{STR.diploma.ready}</p>

            {/* format toggle: 1:1 feed vs 9:16 story */}
            <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 text-sm">
                {(['square', 'story'] as const).map((f) => (
                    <button
                        key={f}
                        type="button"
                        onClick={() => setFormat(f)}
                        aria-pressed={format === f}
                        className={cn(
                            'rounded-full px-4 py-1.5 font-semibold transition',
                            format === f
                                ? 'bg-[image:var(--ws-cta)] text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        {f === 'square' ? STR.diploma.square : STR.diploma.story}
                    </button>
                ))}
            </div>

            <div className="flex w-full justify-center overflow-hidden rounded-2xl border border-border shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="diploma" className="max-h-[68dvh] w-full object-contain" />
            </div>
            <div className="flex w-full gap-2">
                <Button
                    onClick={share}
                    disabled={busy}
                    variant="gradient"
                    className="glow-primary h-auto flex-1 rounded-2xl py-3.5 text-base font-bold"
                >
                    {busy ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />} {STR.diploma.share}
                </Button>
                <Button onClick={download} variant="outline" className="h-auto rounded-2xl px-5 py-3.5" aria-label="Download">
                    <Download size={18} />
                </Button>
            </div>
        </motion.div>
    )
}

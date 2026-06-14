'use client'

import { motion, AnimatePresence } from 'framer-motion'
import NameAvatar from '@/components/workshop/NameAvatar'
import { springPop, staggerChild } from '@/components/workshop/motion'
import { STR } from '@/data/workshop-strings'

interface LobbyViewProps {
    qr: { qrDataUrl: string; joinUrl: string } | null
    code: string
    roster: string[]
}

/** Pre-round lobby — floating QR card + live roster of joined participants. */
export function LobbyView({ qr, code, roster }: LobbyViewProps) {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-14 lg:flex-row">
            {/* QR card — gentle float so the lobby screen feels alive */}
            <div className="text-center">
                <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="glass-strong hover-lift inline-block rounded-[28px] bg-card p-7 shadow-2xl shadow-primary/15"
                >
                    {qr ? (
                        <img src={qr.qrDataUrl} alt={`QR · ${code}`} className="size-80 rounded-2xl" />
                    ) : (
                        <div className="size-80 rounded-2xl bg-background" />
                    )}
                    <p className="mt-5 text-5xl font-bold tracking-[0.25em] text-primary">{code}</p>
                </motion.div>
                <p className="mt-5 text-xl text-muted-foreground">{STR.display.scanQr}</p>
            </div>

            {/* Roster — each newcomer pops in with a spring */}
            <div className="w-full max-w-md">
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    {STR.display.joined} ·{' '}
                    <motion.span
                        key={roster.length}
                        initial={{ scale: 1.4 }}
                        animate={{ scale: 1 }}
                        transition={springPop}
                        className="inline-block text-primary"
                    >
                        {roster.length}
                    </motion.span>
                </p>
                <div className="flex flex-wrap gap-2">
                    <AnimatePresence initial={false}>
                        {roster.map((name, i) => (
                            <motion.span
                                key={`${name}-${i}`}
                                variants={staggerChild}
                                initial="initial"
                                animate="animate"
                                transition={springPop}
                                className="inline-flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-4 text-sm font-medium shadow-sm"
                            >
                                <NameAvatar name={name} size={24} />
                                {name}
                            </motion.span>
                        ))}
                    </AnimatePresence>
                    {roster.length === 0 && <p className="text-muted-foreground/60">{STR.display.waiting}</p>}
                </div>
            </div>
        </div>
    )
}

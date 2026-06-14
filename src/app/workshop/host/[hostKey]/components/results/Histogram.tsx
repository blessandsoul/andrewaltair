'use client'

import { motion } from 'framer-motion'
import type { NumberBucket } from '@/types/workshop.types'
import { STR } from '@/data/workshop-strings'

interface HistogramProps {
    buckets: NumberBucket[]
    total: number
    avg: number
}

export default function Histogram({ buckets, total, avg }: HistogramProps) {
    const maxCount = Math.max(1, ...buckets.map((b) => b.count))
    return (
        <div className="mx-auto max-w-4xl">
            <div className="flex h-64 items-end justify-center gap-2">
                {buckets.map((b, i) => {
                    const hPct = (b.count / maxCount) * 100
                    return (
                        <div key={b.label} className="flex h-full max-w-16 flex-1 flex-col items-center justify-end gap-1.5">
                            <motion.span
                                key={b.count}
                                initial={{ scale: 1.3, opacity: 0.6 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-sm tabular-nums text-muted-foreground"
                            >
                                {b.count > 0 ? b.count : ''}
                            </motion.span>
                            <motion.div
                                className="w-full rounded-t-lg bg-[image:var(--ws-cta)]"
                                animate={{ height: `${Math.max(hPct, b.count > 0 ? 6 : 0)}%` }}
                                transition={{ type: 'spring', stiffness: 110, damping: 18, delay: i * 0.03 }}
                            />
                            <span className="text-xs tabular-nums text-muted-foreground/70">{b.label}</span>
                        </div>
                    )
                })}
            </div>
            <p className="mt-5 text-center text-muted-foreground">
                {STR.results.histTotal(total)} · {STR.results.histAvg}{' '}
                <motion.span
                    key={avg}
                    initial={{ scale: 1.25 }}
                    animate={{ scale: 1 }}
                    className="inline-block font-bold text-primary"
                >
                    {STR.results.histSeconds(avg)}
                </motion.span>
            </p>
        </div>
    )
}

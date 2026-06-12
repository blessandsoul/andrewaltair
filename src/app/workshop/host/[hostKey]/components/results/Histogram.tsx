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
        <div className="max-w-4xl mx-auto">
            <div className="flex items-end justify-center gap-2 h-64">
                {buckets.map((b, i) => {
                    const hPct = (b.count / maxCount) * 100
                    return (
                        <div key={b.label} className="flex flex-col items-center justify-end gap-1.5 flex-1 max-w-16 h-full">
                            <motion.span
                                key={b.count}
                                initial={{ scale: 1.3, opacity: 0.6 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-[#6E7186] text-sm tabular-nums"
                            >
                                {b.count > 0 ? b.count : ''}
                            </motion.span>
                            <motion.div
                                className="w-full rounded-t-lg bg-linear-to-t from-violet-700 to-violet-500"
                                animate={{ height: `${Math.max(hPct, b.count > 0 ? 6 : 0)}%` }}
                                transition={{ type: 'spring', stiffness: 110, damping: 18, delay: i * 0.03 }}
                            />
                            <span className="text-[#6E7186]/70 text-xs tabular-nums">{b.label}</span>
                        </div>
                    )
                })}
            </div>
            <p className="text-center text-[#6E7186] mt-5">
                {STR.results.histTotal(total)} · {STR.results.histAvg}{' '}
                <motion.span
                    key={avg}
                    initial={{ scale: 1.25 }}
                    animate={{ scale: 1 }}
                    className="inline-block text-violet-600 font-bold"
                >
                    {STR.results.histSeconds(avg)}
                </motion.span>
            </p>
        </div>
    )
}

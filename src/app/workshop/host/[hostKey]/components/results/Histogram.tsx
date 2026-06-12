'use client'

import type { NumberBucket } from '@/types/workshop.types'

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
                {buckets.map((b) => {
                    const hPct = (b.count / maxCount) * 100
                    return (
                        <div key={b.label} className="flex flex-col items-center gap-1.5 flex-1 max-w-16">
                            <span className="text-[#6E7186] text-sm tabular-nums">{b.count > 0 ? b.count : ''}</span>
                            <div
                                className="w-full rounded-t-lg bg-violet-600 transition-all duration-700"
                                style={{ height: `${Math.max(hPct, b.count > 0 ? 6 : 0)}%` }}
                            />
                            <span className="text-[#6E7186]/70 text-xs tabular-nums">{b.label}</span>
                        </div>
                    )
                })}
            </div>
            <p className="text-center text-[#6E7186] mt-5">
                სულ: {total} · საშუალო: <span className="text-violet-600 font-bold">{avg} წამი</span>
            </p>
        </div>
    )
}

'use client'

import { motion } from 'framer-motion'
import type { RoundResults } from '@/types/workshop.types'
import { ChoiceBar } from '@/components/workshop/ChoiceBar'
import { springSoft } from '@/components/workshop/motion'
import { nameAccent } from '@/components/workshop/NameAvatar'
import { STR } from '@/data/workshop-strings'

/** Compact, phone-sized live results shown to a student after they answer. */
export default function StudentResults({
    results,
    myOptionId,
}: {
    results: RoundResults | null
    myOptionId?: string
}) {
    if (!results) return null

    if (results.type === 'choice') {
        return (
            <div className="space-y-3">
                {results.counts.map((c) => {
                    const mine = myOptionId === c.optionId
                    return (
                        <ChoiceBar
                            key={c.optionId}
                            size="sm"
                            label={cleanLabel(c.label)}
                            count={c.count}
                            total={results.total}
                            correct={results.correctOptionId === c.optionId}
                            mine={mine}
                            note={mine ? STR.results.yourAnswer : undefined}
                        />
                    )
                })}
                <p className="text-center text-xs text-muted-foreground pt-1">{STR.results.totalVotes(results.total)}</p>
            </div>
        )
    }

    if (results.type === 'choice_revote') {
        return (
            <div className="space-y-3">
                {results.options.map((o) => {
                    const p1 = pct(o.open, results.totalOpen)
                    const p2 = pct(o.revote, results.totalRevote)
                    return (
                        <div key={o.optionId} className="rounded-xl bg-card border border-border p-3">
                            <p className="text-sm font-semibold mb-2 text-foreground">{cleanLabel(o.label)}</p>
                            <MiniRow tag={STR.results.vote1} count={o.open} pct={p1} tone="primary" />
                            <MiniRow tag={STR.results.vote2} count={o.revote} pct={p2} tone="secondary" />
                        </div>
                    )
                })}
                {results.movedCount > 0 && (
                    <p className="text-center text-sm font-semibold text-primary">
                        {STR.results.shiftMoved(results.movedCount)}
                    </p>
                )}
            </div>
        )
    }

    if (results.type === 'number') {
        const max = Math.max(1, ...results.buckets.map((b) => b.count))
        return (
            <div>
                <div className="flex items-end justify-center gap-1.5 h-32">
                    {results.buckets.map((b) => (
                        <div key={b.label} className="flex flex-col items-center justify-end gap-1 flex-1 max-w-10 h-full">
                            <span className="text-[10px] text-muted-foreground tabular-nums">{b.count > 0 ? b.count : ''}</span>
                            <motion.div
                                className="w-full rounded-t bg-primary"
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.max((b.count / max) * 100, b.count > 0 ? 6 : 0)}%` }}
                                transition={springSoft}
                            />
                            <span className="text-[10px] text-muted-foreground/70 tabular-nums">{b.label}</span>
                        </div>
                    ))}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-3">
                    {STR.results.histAvg}{' '}
                    <b className="text-primary">{STR.results.histSeconds(results.avg)}</b> · {STR.results.histTotal(results.total)}
                </p>
            </div>
        )
    }

    // text — scrollable compact list of everyone's answers
    return (
        <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                {STR.results.answersCount(results.items.length)}
            </p>
            <div className="space-y-2 max-h-[46vh] overflow-y-auto pr-1">
                {results.items.map((it) => {
                    const accent = nameAccent(it.name)
                    return (
                        <div key={it.id} className="rounded-xl bg-card border border-border p-3 relative overflow-hidden">
                            <span className={`absolute left-0 top-0 bottom-0 w-1 ${accent.solid}`} />
                            <p className={`text-[11px] font-bold mb-0.5 ${accent.text}`}>{it.name}</p>
                            <p className="text-sm text-card-foreground whitespace-pre-wrap leading-snug">{it.textValue}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function cleanLabel(label: string): string {
    return label.replace(/^[A-Z]\s*·\s*/, '').trim()
}

function pct(n: number, total: number): number {
    return total > 0 ? Math.round((n / total) * 100) : 0
}

function MiniRow({ tag, count, pct, tone }: { tag: string; count: number; pct: number; tone: 'primary' | 'secondary' }) {
    return (
        <div className="flex items-center gap-2 mb-1 last:mb-0">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground w-10 shrink-0">{tag}</span>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${tone === 'primary' ? 'bg-primary' : 'bg-secondary'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={springSoft}
                />
            </div>
            <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">{count}</span>
        </div>
    )
}

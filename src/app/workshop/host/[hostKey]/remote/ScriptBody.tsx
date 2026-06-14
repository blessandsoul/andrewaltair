'use client'

import { Mic, Lightbulb, Eye, HelpCircle, CornerDownRight, Info } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { RoundScript } from '@/types/workshop.types'
import { STR } from '@/data/workshop-strings'
import { cn } from '@/lib/utils'

/** Structured speaker script (say / example / show / ask / after) — phone-readable. */
export function ScriptBody({ script }: { script: RoundScript }) {
    const sections: { key: keyof RoundScript; label: string; icon: LucideIcon; tone: string; box?: 'after' | 'meta' }[] = [
        { key: 'say', label: STR.remote.script.say, icon: Mic, tone: 'text-primary' },
        { key: 'example', label: STR.remote.script.example, icon: Lightbulb, tone: 'text-warning' },
        { key: 'show', label: STR.remote.script.show, icon: Eye, tone: 'text-info' },
        { key: 'ask', label: STR.remote.script.ask, icon: HelpCircle, tone: 'text-secondary' },
        { key: 'after', label: STR.remote.script.after, icon: CornerDownRight, tone: 'text-success', box: 'after' },
        { key: 'meta', label: STR.remote.script.meta, icon: Info, tone: 'text-muted-foreground', box: 'meta' },
    ]
    return (
        <div className="space-y-3">
            {sections.map(({ key, label, icon: Icon, tone, box }) => {
                const text = script[key]
                if (!text) return null
                const boxCls =
                    box === 'after'
                        ? 'rounded-xl bg-success/10 border border-success/30 px-3 py-2.5'
                        : box === 'meta'
                        ? 'rounded-xl bg-foreground/3 border border-dashed border-border px-3 py-2.5'
                        : ''
                return (
                    <div key={key} className={boxCls}>
                        <p className={cn('inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-bold mb-1', tone)}>
                            <Icon size={13} /> {label}
                        </p>
                        <p
                            className={cn(
                                'leading-relaxed whitespace-pre-wrap',
                                box === 'meta' ? 'text-[13px] text-muted-foreground italic' : 'text-[15px] text-card-foreground'
                            )}
                        >
                            {text}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}

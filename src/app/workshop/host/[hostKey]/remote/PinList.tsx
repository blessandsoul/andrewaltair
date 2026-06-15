'use client'

import { Star } from 'lucide-react'
import NameAvatar from '@/components/workshop/NameAvatar'
import { answerPreview } from '@/components/workshop/parseAnswer'
import { Button } from '@/components/ui/button'
import type { TextResultItem } from '@/types/workshop.types'
import { cn } from '@/lib/utils'
import { STR } from '@/data/workshop-strings'

interface PinListProps {
    items: TextResultItem[]
    pinnedIds: string[]
    onToggle: (id: string) => void
    onClearAll: () => void
}

/** Pin list for text rounds — tap a row to spotlight an answer on the display. Multi-select. */
export function PinList({ items, pinnedIds, onToggle, onClearAll }: PinListProps) {
    return (
        <div className="px-5 pb-3 space-y-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                {STR.remote.pinListHeader}
                {pinnedIds.length > 0 && <span className="text-warning"> · {pinnedIds.length}</span>}
            </p>
            {items.map((item) => {
                const pinned = pinnedIds.includes(item.id)
                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onToggle(item.id)}
                        aria-pressed={pinned}
                        className={cn(
                            'flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left shadow-sm transition',
                            pinned
                                ? 'border-warning/50 bg-warning/10'
                                : 'border-border bg-card hover:border-warning/30 hover:bg-accent',
                        )}
                    >
                        <div className="flex min-w-0 items-center gap-2.5">
                            <NameAvatar name={item.name} size={30} />
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-muted-foreground">{item.name}</p>
                                <p className="truncate text-sm text-card-foreground">{answerPreview(item.textValue)}</p>
                            </div>
                        </div>
                        <Star
                            size={18}
                            className={cn('shrink-0', pinned ? 'fill-warning text-warning' : 'text-muted-foreground')}
                        />
                    </button>
                )
            })}
            {pinnedIds.length > 0 && (
                <Button
                    onClick={onClearAll}
                    variant="link"
                    size="sm"
                    className="min-h-11 h-auto px-1 py-2 text-primary underline underline-offset-4"
                >
                    {STR.remote.unpin}
                </Button>
            )}
        </div>
    )
}

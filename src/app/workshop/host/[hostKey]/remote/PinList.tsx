'use client'

import { Star } from 'lucide-react'
import NameAvatar from '@/components/workshop/NameAvatar'
import { answerPreview } from '@/components/workshop/parseAnswer'
import { Button } from '@/components/ui/button'
import type { TextResultItem } from '@/types/workshop.types'
import { STR } from '@/data/workshop-strings'

interface PinListProps {
    items: TextResultItem[]
    isPinned: boolean
    onPin: (id: string) => void
    onUnpin: () => void
}

/** Quick pin list for text rounds — tap a star to spotlight an answer on the display. */
export function PinList({ items, isPinned, onPin, onUnpin }: PinListProps) {
    return (
        <div className="px-5 pb-3 space-y-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                {STR.remote.pinListHeader}
            </p>
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-card border border-border shadow-sm px-3.5 py-2.5"
                >
                    <div className="flex items-center gap-2.5 min-w-0">
                        <NameAvatar name={item.name} size={30} />
                        <div className="min-w-0">
                            <p className="text-xs text-muted-foreground font-semibold">{item.name}</p>
                            <p className="text-sm text-card-foreground truncate">{answerPreview(item.textValue)}</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => onPin(item.id)}
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-muted-foreground hover:text-warning hover:bg-warning/10"
                        title={STR.results.pinTitle}
                    >
                        <Star size={18} />
                    </Button>
                </div>
            ))}
            {isPinned && (
                <Button
                    onClick={onUnpin}
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-primary underline underline-offset-4"
                >
                    {STR.remote.unpin}
                </Button>
            )}
        </div>
    )
}

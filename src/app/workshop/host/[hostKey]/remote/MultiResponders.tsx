'use client'

import type { ReactElement } from 'react'
import NameAvatar from '@/components/workshop/NameAvatar'
import type { MultiResponder } from '@/types/workshop.types'
import { cn } from '@/lib/utils'
import { STR } from '@/data/workshop-strings'

interface MultiRespondersProps {
    responders: MultiResponder[]
}

/**
 * Live per-name picks on a find-the-mistake (multi) round.
 * Host reads finders aloud by name and sees which of the planted mistakes are still unfound.
 * Pult-only, never projected. Updates on the existing host poll.
 */
export function MultiResponders({ responders }: MultiRespondersProps): ReactElement {
    return (
        <div className="px-5 pb-3 space-y-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                {STR.remote.findersHeader}
                <span className="text-warning"> · {responders.length}</span>
            </p>
            {responders.map((responder, i) => (
                <div
                    key={`${responder.name}-${i}`}
                    className="flex items-start gap-2.5 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-sm"
                >
                    <NameAvatar name={responder.name} size={30} />
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-muted-foreground">{responder.name}</p>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                            {responder.picks.map((pick, j) => (
                                <span
                                    key={`${pick.label}-${j}`}
                                    className={cn(
                                        'rounded-md border px-2 py-0.5 text-xs',
                                        pick.correct
                                            ? 'border-success/40 bg-success/10 text-success'
                                            : 'border-border bg-muted text-muted-foreground',
                                    )}
                                >
                                    {pick.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

'use client'

import { Badge } from '@/components/ui/badge'
import type { HostState } from '@/types/workshop.types'

/** Status pill (LIVE / lobby / ended) — token-based badge variants. */
export function StatusPill({ status }: { status: HostState['status'] }) {
    if (status === 'live') {
        return (
            <Badge className="border-transparent bg-destructive/15 text-destructive uppercase tracking-wider gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                LIVE
            </Badge>
        )
    }
    if (status === 'ended') {
        return (
            <Badge variant="outline" className="text-muted-foreground uppercase tracking-wider">
                ENDED
            </Badge>
        )
    }
    return (
        <Badge variant="success" className="uppercase tracking-wider">
            LOBBY
        </Badge>
    )
}

'use client'

import { STR } from '@/data/workshop-strings'

/** Shared connection-lost banner (was copy-pasted 3×). Token-based (warning). */
export function ReconnectBanner() {
    return (
        <div className="fixed inset-x-0 top-0 z-50 bg-warning py-2 text-center text-sm font-semibold text-foreground shadow-md">
            {STR.common.reconnecting}
        </div>
    )
}

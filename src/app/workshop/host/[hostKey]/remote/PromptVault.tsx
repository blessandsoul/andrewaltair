'use client'

import { useState } from 'react'
import type { ReactElement } from 'react'
import { Clapperboard, Copy, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DEMO_PROMPTS } from '@/data/workshops/demo-prompts'
import { STR } from '@/data/workshop-strings'

/**
 * Private host tool: a button on the pult that opens a full-screen popup with
 * ready demo prompts, each with one-tap copy, so the host can paste a prompt
 * into an image generator live during the cinema-bonus round.
 */
export function PromptVault(): ReactElement {
    const [open, setOpen] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const copy = async (id: string, body: string): Promise<void> => {
        try {
            await navigator.clipboard.writeText(body)
            setCopiedId(id)
            window.setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1500)
        } catch {
            // clipboard blocked (insecure context or denied), leave UI unchanged
        }
    }

    return (
        <>
            <Button
                variant="outline"
                size="icon"
                onClick={() => setOpen(true)}
                title={STR.remote.vaultTitle}
                aria-label={STR.remote.vaultTitle}
                className="min-h-11 min-w-11 shrink-0 text-muted-foreground hover:text-primary"
            >
                <Clapperboard size={18} />
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 flex flex-col bg-background">
                    <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                        <span className="inline-flex items-center gap-2 font-bold">
                            <Clapperboard size={18} className="text-primary" /> {STR.remote.vaultTitle}
                        </span>
                        <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label={STR.remote.vaultClose}>
                            <X size={20} />
                        </Button>
                    </header>
                    <div className="hide-scrollbar flex-1 overflow-y-auto px-4 py-4">
                        <div className="mx-auto max-w-2xl space-y-4">
                            {DEMO_PROMPTS.map((p) => {
                                const isCopied = copiedId === p.id
                                return (
                                    <div key={p.id} className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                                        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
                                            <span className="font-semibold text-card-foreground">{p.title}</span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => copy(p.id, p.body)}
                                                className="shrink-0 gap-1.5"
                                            >
                                                {isCopied ? <Check size={15} /> : <Copy size={15} />}
                                                {isCopied ? STR.remote.vaultCopied : STR.remote.vaultCopy}
                                            </Button>
                                        </div>
                                        <pre className="whitespace-pre-wrap break-words px-4 py-3 text-sm leading-relaxed text-card-foreground font-mono">
                                            {p.body}
                                        </pre>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

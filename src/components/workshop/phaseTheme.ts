import type { RoundPhase } from '@/types/workshop.types'

/**
 * Single source of truth for phase → semantic-token color classes (deck-themed).
 * `badge` = subtle chip (host phase badge / stepper); `banner` = solid fill
 * (student "what to do now" banner). Consumed by CurrentRound, ResultsBoard,
 * PhaseStepper and the remote — so the phase color vocabulary is defined ONCE.
 */
export const PHASE_THEME: Record<RoundPhase, { badge: string; banner: string }> = {
    open: { badge: 'bg-primary/10 text-primary', banner: 'bg-primary text-primary-foreground' },
    revote: { badge: 'bg-secondary/10 text-secondary', banner: 'bg-secondary text-primary-foreground' },
    discuss: { badge: 'bg-info/10 text-info', banner: 'bg-info text-primary-foreground' },
    revealed: { badge: 'bg-success/10 text-success', banner: 'bg-success text-primary-foreground' },
    closed: { badge: 'bg-muted text-muted-foreground', banner: 'border border-border bg-card text-card-foreground' },
}

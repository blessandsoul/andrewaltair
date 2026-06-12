// Workshop Room — shared client/API DTO types

export const ROUND_TYPES = {
    TEXT: 'text',
    CHOICE: 'choice',
    CHOICE_REVOTE: 'choice_revote',
    NUMBER: 'number',
    QUIZ: 'quiz',
} as const;
export type RoundType = (typeof ROUND_TYPES)[keyof typeof ROUND_TYPES];

export const ROUND_PHASES = {
    CLOSED: 'closed',
    OPEN: 'open',
    DISCUSS: 'discuss',
    REVOTE: 'revote',
    REVEALED: 'revealed',
} as const;
export type RoundPhase = (typeof ROUND_PHASES)[keyof typeof ROUND_PHASES];

export const ROOM_STATUSES = {
    LOBBY: 'lobby',
    LIVE: 'live',
    ENDED: 'ended',
} as const;
export type RoomStatus = (typeof ROOM_STATUSES)[keyof typeof ROOM_STATUSES];

export interface RoundOption {
    id: string;
    label: string;
}

export interface RoundConfig {
    minNumber?: number;
    maxNumber?: number;
    fields?: string[];
}

// Round as seen by a student (correctOptionId stripped until revealed)
export interface StudentRound {
    key: string;
    type: RoundType;
    prompt: string;
    options: RoundOption[];
    phase: RoundPhase;
    config: RoundConfig;
    correctOptionId?: string;
    index: number;
    total: number;
    phaseStartedAt?: string;
    durationSec?: number;
    pinned?: { name: string; textValue: string } | null;
}

export interface StudentState {
    status: RoomStatus;
    title: string;
    participantCount: number;
    round: StudentRound | null;
    myAnswer: { phase: string; optionId?: string; textValue?: string; numberValue?: number } | null;
    serverNow: string;
}

export interface TextResultItem {
    id: string;
    name: string;
    textValue: string;
    createdAt: string;
}

export interface ChoiceCount {
    optionId: string;
    label: string;
    count: number;
}

export interface RevoteOptionResult {
    optionId: string;
    label: string;
    open: number;
    revote: number;
}

export interface NumberBucket {
    label: string;
    count: number;
}

export type RoundResults =
    | { type: 'text'; items: TextResultItem[] }
    | { type: 'choice'; counts: ChoiceCount[]; total: number; correctOptionId?: string }
    | { type: 'choice_revote'; options: RevoteOptionResult[]; totalOpen: number; totalRevote: number; movedCount: number }
    | { type: 'number'; buckets: NumberBucket[]; total: number; avg: number };

export interface RosterEntry {
    name: string;
    joinedAt: string;
    online: boolean;
}

export interface HostState {
    code: string;
    title: string;
    status: RoomStatus;
    currentRoundIndex: number;
    roundsTotal: number;
    round: (StudentRound & { correctOptionId?: string; hostNotes?: string }) | null;
    results: RoundResults | null;
    roster: RosterEntry[];
    participantCount: number;
    responsesCount: number;
    serverNow: string;
    qrDataUrl?: string;
    joinUrl?: string;
}

export const HOST_ACTIONS = {
    OPEN_ROUND: 'openRound',
    ADVANCE_PHASE: 'advancePhase',
    REVEAL: 'reveal',
    NEXT_ROUND: 'nextRound',
    END_ROOM: 'endRoom',
    SEED_FAKE: 'seedFake',
    PIN_RESPONSE: 'pinResponse',
    UNPIN: 'unpin',
} as const;
export type HostAction = (typeof HOST_ACTIONS)[keyof typeof HOST_ACTIONS];

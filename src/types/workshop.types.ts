// Workshop Room — shared client/API DTO types

export const ROUND_TYPES = {
    TEXT: 'text',
    CHOICE: 'choice',
    CHOICE_REVOTE: 'choice_revote',
    NUMBER: 'number',
    QUIZ: 'quiz',
    TEACH: 'teach',
} as const;
export type RoundType = (typeof ROUND_TYPES)[keyof typeof ROUND_TYPES];

// Non-interactive "teach" slide content — the deck theory/media lives here so the
// host runs everything from one screen. Blocks render full-screen on the display.
export type TeachBlock =
    | { kind: 'lead'; text: string }
    | { kind: 'cards'; cards: { title: string; text: string }[] }
    | { kind: 'keypoints'; items: { n?: string; text: string }[] }
    | {
          kind: 'media';
          items: { letter?: string; title?: string; src: string; mediaType: 'image' | 'video'; caption?: string }[];
      }
    | { kind: 'table'; headers: string[]; rows: string[][] };

export interface TeachContent {
    accent?: string;
    blocks: TeachBlock[];
}

// Host-only speaker script shown on the remote (пульт) per step — the deep
// "what you say" text. Never sent to students. Empty fields are not rendered.
export interface RoundScript {
    say?: string; // основной разбор / что говоришь
    example?: string; // конкретный пример
    show?: string; // что показываешь / делаешь (клип, LIVE-генерация)
    ask?: string; // как вовлекаешь — точная формулировка вопроса
    after?: string; // что сказать ПОСЛЕ ответов (разбор, привязка к их ответам)
    meta?: string; // заметка ведущему (НЕ произносится) — тайминг, приём, fallback
}

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
    src?: string; // optional image (photo-vote options)
}

export interface SelectedPhoto {
    src: string;
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
    content?: TeachContent;
    script?: RoundScript; // host-only (forHost) — deep speaker script for the remote
    showsHeroPhoto?: boolean; // F3: chosen photo stays visible during this round
    reasons?: RoundOption[]; // F4: preset "why" chips shown in the discuss phase
}

// Full per-room settings (all 20). Lives here — a pure, client-safe module — so the
// admin form and the model share ONE source. The Mongoose model re-exports these.
export interface IWorkshopRoomSettings {
    audience: 'inperson' | 'online';
    studentSound: boolean;
    hostAnswerSound: boolean;
    hostVolume: number;
    studentVolume: number;
    autoReveal: boolean;
    graceSec: number;
    gateRatio: number;
    roundTimerSec: number;
    revealCorrect: boolean;
    anonymousNames: boolean;
    shuffleOptions: boolean;
    textWallLimit: number;
    maxParticipants: number;
    nameFilter: boolean;
    allowKick: boolean;
    codeLength: number;
    onlineWindowSec: number;
    studentPollMs: number;
    language: 'ka' | 'ru';
    confetti: boolean;
}

export const DEFAULT_ROOM_SETTINGS: IWorkshopRoomSettings = {
    audience: 'inperson',
    studentSound: false,
    hostAnswerSound: true,
    hostVolume: 85,
    studentVolume: 70,
    autoReveal: true,
    graceSec: 5,
    gateRatio: 0.6,
    roundTimerSec: 0,
    revealCorrect: true,
    anonymousNames: false,
    shuffleOptions: false,
    textWallLimit: 100,
    maxParticipants: 0,
    nameFilter: false,
    allowKick: true,
    codeLength: 5,
    onlineWindowSec: 10,
    studentPollMs: 3000,
    language: 'ka',
    confetti: true,
};

// Client-readable subset of room settings. Server-only flags (autoReveal, graceSec,
// revealCorrect, anonymousNames, textWallLimit, maxParticipants, nameFilter,
// onlineWindowSec, codeLength) are consumed in the service and never sent to clients.
export interface RoomSettingsDTO {
    audience: 'inperson' | 'online';
    studentSound: boolean;
    hostAnswerSound: boolean;
    hostVolume: number;
    studentVolume: number;
    gateRatio: number;
    studentPollMs: number;
    confetti: boolean;
    allowKick: boolean;
    language: 'ka' | 'ru';
}

export interface StudentState {
    status: RoomStatus;
    title: string;
    participantCount: number;
    round: StudentRound | null;
    myAnswer: { phase: string; optionId?: string; textValue?: string; numberValue?: number } | null;
    // live tally shown on the student's phone once they've answered (or at reveal).
    // Suppressed for Mazur choice_revote until reveal so it doesn't spoil the re-vote.
    results: RoundResults | null;
    selectedPhoto: SelectedPhoto | null; // F3: photo voted as winner (shown as hero)
    serverNow: string;
    settings: RoomSettingsDTO; // per-room config (audience / sound / poll / etc.)
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

// F4: per-person open→revote transition + their reason, for the "who changed" view
export interface RevoteMove {
    name: string;
    fromLabel: string | null;
    toLabel: string | null;
    changed: boolean;
    reason?: string;
}

export interface NumberBucket {
    label: string;
    count: number;
}

export type RoundResults =
    | { type: 'text'; items: TextResultItem[] }
    | { type: 'choice'; counts: ChoiceCount[]; total: number; correctOptionId?: string }
    | {
          type: 'choice_revote';
          options: RevoteOptionResult[];
          totalOpen: number;
          totalRevote: number;
          movedCount: number;
          moves: RevoteMove[];
      }
    | { type: 'number'; buckets: NumberBucket[]; total: number; avg: number };

export interface RosterEntry {
    name: string;
    clientId: string; // host-only — used to kick a participant
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
    selectedPhoto: SelectedPhoto | null; // F3
    serverNow: string;
    settings: RoomSettingsDTO; // per-room config (audience / sound / poll / etc.)
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
    KICK_PARTICIPANT: 'kickParticipant',
} as const;
export type HostAction = (typeof HOST_ACTIONS)[keyof typeof HOST_ACTIONS];

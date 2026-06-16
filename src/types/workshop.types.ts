// Workshop Room — shared client/API DTO types

export const ROUND_TYPES = {
    TEXT: 'text',
    CHOICE: 'choice',
    CHOICE_REVOTE: 'choice_revote',
    MULTI: 'multi', // checkbox — pick several; several can be correct
    NUMBER: 'number',
    QUIZ: 'quiz',
    ORDER: 'order', // drag-and-drop: reorder the option images into the right sequence
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
    // annotated photo — numbered pins (x/y are % of the frame) map concepts onto a real image
    | {
          kind: 'annotated';
          src?: string; // omit → use the room's chosen hero photo (selectedPhoto)
          pins: { n: string; label: string; text?: string; x: number; y: number }[];
      }
    | { kind: 'table'; headers: string[]; rows: string[][] }
    // pick-a-question list (t_close fortune round) — numbered pills, «toRoom» tossed to the audience
    | { kind: 'questions'; items: { n: number; text: string; toRoom?: boolean }[] };

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
    correctOptionIds?: string[]; // multi round — host-only, present after reveal
    correctOrder?: string[]; // order round — host-only, present after reveal
    index: number;
    total: number;
    phaseStartedAt?: string;
    durationSec?: number;
    pinned?: { id: string; name: string; textValue: string }[] | null;
    content?: TeachContent;
    script?: RoundScript; // host-only (forHost) — deep speaker script for the remote
    showsHeroPhoto?: boolean; // F3: chosen photo stays visible during this round
    roundImage?: string; // a round-specific image pinned on the projector while answering (e.g. broken.jpg)
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
    gamification: boolean; // points / leaderboard / streaks / badges / reactions / wheel
    teamMode: boolean; // opt-in — split the room into teams (off by default)
    teamCount: number;
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
    gamification: true,
    teamMode: false,
    teamCount: 2,
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
    gamification: boolean; // phone needs to know whether to render points/streak/reactions
    teamMode: boolean;
}

export interface StudentState {
    status: RoomStatus;
    title: string;
    participantCount: number;
    round: StudentRound | null;
    myAnswer: { phase: string; optionId?: string; optionIds?: string[]; textValue?: string; numberValue?: number } | null;
    // live tally shown on the student's phone once they've answered (or at reveal).
    // Suppressed for Mazur choice_revote until reveal so it doesn't spoil the re-vote.
    results: RoundResults | null;
    selectedPhoto: SelectedPhoto | null; // F3: photo voted as winner (shown as hero)
    serverNow: string;
    settings: RoomSettingsDTO; // per-room config (audience / sound / poll / etc.)
    // gamification (present only when settings.gamification)
    me?: MyGame | null;
    reactions?: Reaction[];
    progress?: number; // 0..1 — interactive rounds completed ("video assembling")
    spotlightName?: string | null; // wheel-of-names result
    spotlightAt?: number | null; // nonce — re-fires the wheel even on a repeat pick
    myPrediction?: string | null; // 🎯 ფსონი — the option this student bet on (for the reveal outcome)
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

// order round — a submitted sequence (option ids in order) + how many submitted it
export interface OrderSequence {
    order: string[];
    labels: string[];
    count: number;
    correct: boolean;
}

export type RoundResults =
    | { type: 'text'; items: TextResultItem[] }
    | { type: 'choice'; counts: ChoiceCount[]; total: number; correctOptionId?: string }
    | { type: 'multi'; counts: ChoiceCount[]; total: number; correctOptionIds?: string[] }
    | {
          type: 'choice_revote';
          options: RevoteOptionResult[];
          totalOpen: number;
          totalRevote: number;
          movedCount: number;
          moves: RevoteMove[];
      }
    | { type: 'number'; buckets: NumberBucket[]; total: number; avg: number }
    | {
          type: 'order';
          sequences: OrderSequence[]; // sorted by count desc
          correctOrder: string[];
          correctLabels: string[];
          correctCount: number;
          total: number;
      };

export interface RosterEntry {
    name: string;
    clientId: string; // host-only — used to kick a participant
    joinedAt: string;
    online: boolean;
}

// Host-only: full per-round results + per-participant answer grid (history panel + end stats)
export interface HistoryRound {
    key: string;
    index: number;
    prompt: string;
    type: RoundType;
    results: RoundResults | null;
}
export interface HistoryParticipant {
    clientId: string;
    name: string;
    answers: { roundKey: string; prompt: string; value: string }[];
}
export interface RoomHistory {
    rounds: HistoryRound[];
    participants: HistoryParticipant[];
    participantCount: number;
}

// ── Gamification ──────────────────────────────────────────────────────────────
export interface Badge {
    id: string;
    emoji: string;
    label: string;
}
export interface LeaderboardEntry {
    clientId: string;
    name: string;
    team?: number;
    points: number;
    streak: number;
    badges: Badge[];
    rank: number;
}
export interface TeamScore {
    team: number;
    points: number;
    members: number;
}
export interface ScoreSummary {
    leaderboard: LeaderboardEntry[]; // sorted by points desc, ranked
    teams: TeamScore[]; // empty unless teamMode
}
export const REACTION_KINDS = ['clap', 'fire', 'love', 'haha', 'wow', 'party'] as const;
export type ReactionKind = (typeof REACTION_KINDS)[number];
export interface Reaction {
    id: number; // unique sequence — stable dedupe key for the floating overlay
    kind: string; // ReactionKind — which icon to draw
    name: string; // sender label (blank when anonymousNames)
}
// Per-student gamification slice (on StudentState)
export interface MyGame {
    points: number;
    streak: number;
    rank: number;
    badges: Badge[];
    team?: number;
}
// Shareable end-of-workshop diploma (per participant)
export interface DiplomaData {
    name: string;
    dream: string; // their r1 «видео-мечта»
    points: number;
    rank: number;
    total: number;
    streak: number;
    badges: Badge[];
    photo: string | null; // the chosen hero photo
    title: string; // workshop title (room.title)
    dateISO: string; // room.createdAt — formatted ka-GE at render
    percentile: number; // 1..100, "top N%" (100 = #1)
    answeredCount: number; // interactive rounds answered
    roundsTotal: number; // interactive rounds total
    correctCount: number; // quiz/order/choice correct answers
    accuracyPct: number; // 0..100 over scorable rounds answered
    code: string; // room code (verify token)
    team?: number; // only when teamMode
}

// Projector reveal panel — winners (most correct answers) or top-N answers, triggered by the host.
export interface SpotlightPanel {
    kind: 'winners' | 'topAnswers';
    at: number; // nonce — re-fires the overlay on each trigger
    title?: string;
    rows: { name: string; sub?: string; who?: string[] }[]; // who = participant names behind this row
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
    // gamification (present only when settings.gamification)
    leaderboard?: LeaderboardEntry[];
    teams?: TeamScore[];
    reactions?: Reaction[];
    progress?: number; // 0..1
    spotlightName?: string | null;
    spotlightAt?: number | null;
    spotlightPanel?: SpotlightPanel | null; // winners / top-answers projector reveal
    fastest?: string[]; // speed-spotlight: first-N answerer names of the current open round
}

export const HOST_ACTIONS = {
    OPEN_ROUND: 'openRound',
    ADVANCE_PHASE: 'advancePhase',
    REVEAL: 'reveal',
    NEXT_ROUND: 'nextRound',
    PREV_ROUND: 'prevRound',
    REOPEN_ROUND: 'reopenRound',
    END_ROOM: 'endRoom',
    SEED_FAKE: 'seedFake',
    PIN_RESPONSE: 'pinResponse',
    UNPIN: 'unpin',
    KICK_PARTICIPANT: 'kickParticipant',
    SPIN_WHEEL: 'spinWheel',
    SHOW_WINNERS: 'showWinners',
    SHOW_TOP_ANSWERS: 'showTopAnswers',
} as const;
export type HostAction = (typeof HOST_ACTIONS)[keyof typeof HOST_ACTIONS];

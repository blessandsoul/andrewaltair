import mongoose, { Schema, Document } from 'mongoose';
import type { TeachContent, RoundScript, IWorkshopRoomSettings } from '@/types/workshop.types';

// The settings shape + defaults live in the pure types module (client-safe). Re-export
// them so existing imports `from '@/models/WorkshopRoom'` keep resolving.
export type { IWorkshopRoomSettings } from '@/types/workshop.types';
export { DEFAULT_ROOM_SETTINGS } from '@/types/workshop.types';

export interface IWorkshopRound {
    key: string;
    type: 'text' | 'choice' | 'choice_revote' | 'multi' | 'number' | 'quiz' | 'order' | 'teach';
    prompt: string;
    options: { id: string; label: string; src?: string }[]; // src = optional image (photo vote)
    correctOptionId?: string;
    correctOptionIds?: string[]; // multi round — the correct option ids
    correctOrder?: string[]; // order round — the right sequence of option ids
    phase: 'closed' | 'open' | 'discuss' | 'revote' | 'revealed';
    phaseStartedAt?: Date;
    allAnsweredAt?: Date; // F2: stamped when everyone has answered → 5s grace → auto-reveal
    durationSec?: number;
    hostNotes?: string;
    pinnedResponseIds?: string[]; // answers spotlighted on the projector (multi-select)
    showsHeroPhoto?: boolean; // F3: keep the chosen photo visible during this round
    roundImage?: string; // round-specific image pinned on the projector while answering
    reasons?: { id: string; label: string }[]; // F4: preset "why" chips for the discuss phase
    config: {
        minNumber?: number;
        maxNumber?: number;
        fields?: string[];
    };
    // Non-interactive 'teach' slides carry their deck content here (Mixed in Mongoose).
    content?: TeachContent;
    // Host-only deep speaker script shown on the remote (Mixed in Mongoose).
    script?: RoundScript;
}

export interface IWorkshopRoom extends Document {
    _id: mongoose.Types.ObjectId;
    code: string;
    hostKey: string;
    title: string;
    templateId: string;
    status: 'lobby' | 'live' | 'ended';
    rounds: IWorkshopRound[];
    currentRoundIndex: number;
    isDemo: boolean; // demo room → answers drip in one-by-one on open rounds (poll-driven)
    selectedPhoto?: { src: string; label: string }; // F3: the photo voted as winner (persists)
    spotlightName?: string; // wheel-of-names result (transient; cleared on next round action)
    spotlightAt?: number; // nonce — bumped on every spin so a repeat pick of the same name re-fires the overlay
    // winners / top-answers projector reveal (transient; cleared on next non-panel action)
    spotlightPanel?: { kind: string; at: number; title?: string; rows: { name: string; sub?: string }[] };
    settings: IWorkshopRoomSettings; // per-room config chosen at creation
    createdAt: Date;
    updatedAt: Date;
}

const WorkshopRoundSchema = new Schema<IWorkshopRound>(
    {
        key: { type: String, required: true },
        type: {
            type: String,
            enum: ['text', 'choice', 'choice_revote', 'multi', 'number', 'quiz', 'order', 'teach'],
            required: true,
        },
        prompt: { type: String, required: true },
        options: [
            {
                id: { type: String, required: true },
                label: { type: String, required: true },
                src: { type: String },
                _id: false,
            },
        ],
        correctOptionId: { type: String },
        correctOptionIds: { type: [String], default: undefined },
        correctOrder: { type: [String], default: undefined },
        phase: {
            type: String,
            enum: ['closed', 'open', 'discuss', 'revote', 'revealed'],
            default: 'closed',
        },
        phaseStartedAt: { type: Date },
        allAnsweredAt: { type: Date },
        durationSec: { type: Number },
        hostNotes: { type: String },
        pinnedResponseIds: { type: [String], default: undefined },
        showsHeroPhoto: { type: Boolean },
        roundImage: { type: String },
        reasons: [
            {
                id: { type: String, required: true },
                label: { type: String, required: true },
                _id: false,
            },
        ],
        config: {
            minNumber: { type: Number },
            maxNumber: { type: Number },
            fields: [{ type: String }],
        },
        // 'teach' slide content (lead/cards/keypoints/media/table blocks) — flexible shape.
        content: { type: Schema.Types.Mixed },
        // host-only speaker script (say/example/show/ask/after) — flexible shape.
        script: { type: Schema.Types.Mixed },
    },
    { _id: false }
);

const WorkshopSettingsSchema = new Schema<IWorkshopRoomSettings>(
    {
        audience: { type: String, enum: ['inperson', 'online'], default: 'inperson' },
        studentSound: { type: Boolean, default: false },
        hostAnswerSound: { type: Boolean, default: true },
        hostVolume: { type: Number, default: 85 },
        studentVolume: { type: Number, default: 70 },
        autoReveal: { type: Boolean, default: true },
        graceSec: { type: Number, default: 5 },
        gateRatio: { type: Number, default: 0.6 },
        roundTimerSec: { type: Number, default: 0 },
        revealCorrect: { type: Boolean, default: true },
        anonymousNames: { type: Boolean, default: false },
        shuffleOptions: { type: Boolean, default: false },
        textWallLimit: { type: Number, default: 100 },
        maxParticipants: { type: Number, default: 0 },
        nameFilter: { type: Boolean, default: false },
        allowKick: { type: Boolean, default: true },
        codeLength: { type: Number, default: 5 },
        onlineWindowSec: { type: Number, default: 10 },
        studentPollMs: { type: Number, default: 3000 },
        language: { type: String, enum: ['ka', 'ru'], default: 'ka' },
        confetti: { type: Boolean, default: true },
        gamification: { type: Boolean, default: true },
        teamMode: { type: Boolean, default: false },
        teamCount: { type: Number, default: 2 },
    },
    { _id: false }
);

const WorkshopRoomSchema = new Schema<IWorkshopRoom>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            index: true,
            uppercase: true,
            trim: true,
        },
        hostKey: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        templateId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['lobby', 'live', 'ended'],
            default: 'lobby',
        },
        rounds: [WorkshopRoundSchema],
        currentRoundIndex: {
            type: Number,
            default: -1,
        },
        isDemo: {
            type: Boolean,
            default: false,
        },
        selectedPhoto: {
            type: { src: String, label: String },
            default: undefined,
            _id: false,
        },
        spotlightName: {
            type: String,
        },
        spotlightAt: {
            type: Number,
        },
        spotlightPanel: {
            type: Schema.Types.Mixed,
            default: undefined,
        },
        settings: {
            type: WorkshopSettingsSchema,
            default: () => ({}),
        },
    },
    { timestamps: true }
);

export default mongoose.models.WorkshopRoom ||
    mongoose.model<IWorkshopRoom>('WorkshopRoom', WorkshopRoomSchema);

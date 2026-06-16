import crypto from 'crypto'
import * as QRCode from 'qrcode'
import mongoose from 'mongoose'
import dbConnect from '@/lib/db'
import WorkshopRoom, {
    type IWorkshopRoom,
    type IWorkshopRound,
    type IWorkshopRoomSettings,
    DEFAULT_ROOM_SETTINGS,
} from '@/models/WorkshopRoom'
import WorkshopParticipant from '@/models/WorkshopParticipant'
import WorkshopResponse, { type IWorkshopResponse } from '@/models/WorkshopResponse'
import { WORKSHOP_TEMPLATES, DEMO_RESPONSES, DEMO_NAMES, isWorkshopTemplateId } from '@/data/workshop-templates'
import { resolveDeep, tr } from '@/data/workshop-i18n'
import type {
    HostAction,
    RoomSettingsDTO,
    RoundResults,
    StudentRound,
    StudentState,
    RosterEntry,
    RevoteMove,
    TeachContent,
    RoundScript,
    RoomHistory,
    HistoryRound,
    HistoryParticipant,
    Badge,
    LeaderboardEntry,
    TeamScore,
    ScoreSummary,
    Reaction,
    MyGame,
    DiplomaData,
} from '@/types/workshop.types'
import { REACTION_KINDS } from '@/types/workshop.types'

// Resolved (all-strings) shape of a template round after resolveDeep flattens every L.
interface ResolvedTemplateRound {
    key: string
    type: IWorkshopRound['type']
    prompt: string
    options?: { id: string; label: string; src?: string }[]
    correctOptionId?: string
    correctOptionIds?: string[]
    correctOrder?: string[]
    durationSec?: number
    hostNotes?: string
    showsHeroPhoto?: boolean
    roundImage?: string
    reasons?: { id: string; label: string }[]
    config?: { minNumber?: number; maxNumber?: number; fields?: string[] }
    content?: TeachContent
    script?: RoundScript
}

// Perf: the per-round tally is identical for all pollers within a phase. Cache it
// briefly so 30 students polling don't each re-run the same aggregation every 2s.
const RESULTS_TTL_MS = 1500
const resultsCache = new Map<string, { value: RoundResults | null; exp: number }>()

// Gamification: scores are identical for all pollers — cache briefly (shared by host + every student poll).
const SCORES_TTL_MS = 2000
const scoresCache = new Map<string, { value: ScoreSummary; exp: number }>()

// Ephemeral reaction buffer (per room, ~5s window) — in-memory, no DB, resets on redeploy (fine for confetti-class fluff).
const REACTION_TTL_MS = 5000
type ReactionBuf = { id: number; kind: string; name: string; at: number }
const reactionsBuffer = new Map<string, ReactionBuf[]>()
const REACTION_KIND_SET = new Set<string>(REACTION_KINDS)
let reactionSeq = 0

// Badge catalog — awarded from real signals in computeScores.
const BADGE: Record<string, Badge> = {
    lightning: { id: 'lightning', emoji: '⚡', label: 'Молния' }, // first to answer ≥1×
    streak: { id: 'streak', emoji: '🔥', label: 'Серия' }, // streak ≥3
    mindchange: { id: 'mindchange', emoji: '🧠', label: 'Сменил мнение' }, // Mazur revote change
    director: { id: 'director', emoji: '🎬', label: 'Режиссёр' }, // order round correct
    oracle: { id: 'oracle', emoji: '🎯', label: 'Оракул' }, // ≥2 predictions right
    onair: { id: 'onair', emoji: '⭐', label: 'В эфире' }, // answer pinned by host
    champion: { id: 'champion', emoji: '🏆', label: 'Чемпион' }, // leaderboard #1
}

// Pull the «видео-мечта» line out of an r1 multi-field answer (falls back to last line).
function extractDream(text: string): string {
    const lines = text.split('\n').filter(Boolean)
    const dreamLine = lines.find((l) => /меч|ოცნ/i.test(l)) ?? lines[lines.length - 1] ?? text
    const colon = dreamLine.indexOf(':')
    return (colon >= 0 ? dreamLine.slice(colon + 1) : dreamLine).trim()
}

function badgesFor(a: {
    firstCount: number
    streak: number
    mindChange: boolean
    orderCorrect: boolean
    predictRight: number
    pinned: boolean
}): Badge[] {
    const b: Badge[] = []
    if (a.firstCount > 0) b.push(BADGE.lightning)
    if (a.streak >= 3) b.push(BADGE.streak)
    if (a.mindChange) b.push(BADGE.mindchange)
    if (a.orderCorrect) b.push(BADGE.director)
    if (a.predictRight >= 2) b.push(BADGE.oracle)
    if (a.pinned) b.push(BADGE.onair)
    return b
}

// Unambiguous alphabet — no 0/O/1/I/L
const CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
const CODE_LENGTH = 5

// Anti-peek: one-time Fisher–Yates at creation when `shuffleOptions` is on.
function shuffled<T>(input: readonly T[]): T[] {
    const arr = [...input]
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const a = arr[i]
        const b = arr[j]
        if (a === undefined || b === undefined) continue
        arr[i] = b
        arr[j] = a
    }
    return arr
}

const ANON_LABEL = 'ანონიმი'
const BLOCKED_NAME_WORDS = ['admin', 'fuck', 'shit', 'хуй', 'пизд', 'бля', 'еба']
function isBlockedName(name: string): boolean {
    const low = name.toLowerCase()
    return BLOCKED_NAME_WORDS.some((w) => low.includes(w))
}

const FAKE_NAMES = ['გიორგი', 'ნინო', 'დათო', 'მარიამი', 'ლუკა', 'ანა', 'საბა', 'თეკლა'] as const
const FAKE_TEXTS = [
    'ორთქლი აუვა ჭიქას',
    'შუქი შეიცვლება ფანჯრიდან',
    'ფარდა შეირხევა ქარზე',
    'ჩრდილები გადაიწევა ნელა',
    'წვიმის წვეთები ჩამოირბენს მინაზე',
    'თმა შეირხევა ოდნავ',
    'კვამლი აიწევა მაღლა',
    'ფოთლები შეირხევა ფონზე',
] as const

export class WorkshopService {
    static generateCode(length: number = CODE_LENGTH): string {
        const n = Math.min(6, Math.max(4, Math.round(length) || CODE_LENGTH))
        const bytes = crypto.randomBytes(n)
        let code = ''
        for (let i = 0; i < n; i++) {
            code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length]
        }
        return code
    }

    static async createRoomFromTemplate(
        templateId: string,
        opts?: { isDemo?: boolean; settings?: Partial<IWorkshopRoomSettings> }
    ): Promise<IWorkshopRoom> {
        await dbConnect()
        if (!isWorkshopTemplateId(templateId)) {
            throw new Error('Unknown template')
        }
        const settings: IWorkshopRoomSettings = { ...DEFAULT_ROOM_SETTINGS, ...(opts?.settings ?? {}) }
        const template = WORKSHOP_TEMPLATES[templateId]
        const rounds = template.rounds.map((tpl) => {
            // resolveDeep flattens every localized `L` to its display string for the chosen language
            const r = resolveDeep(tpl, settings.language) as unknown as ResolvedTemplateRound
            const baseOptions = (r.options ?? []).map((o) => ({
                id: o.id,
                label: o.label,
                ...(o.src ? { src: o.src } : {}),
            }))
            // anti-peek: randomize answer-option order once, per room (stable thereafter)
            const options = settings.shuffleOptions && baseOptions.length > 1 ? shuffled(baseOptions) : baseOptions
            // a global default timer overrides per-round template timers for answerable rounds
            const durationSec =
                settings.roundTimerSec > 0 && r.type !== 'teach' ? settings.roundTimerSec : r.durationSec
            return {
                key: r.key,
                type: r.type,
                prompt: r.prompt,
                options,
                correctOptionId: r.correctOptionId,
                ...(r.correctOptionIds?.length ? { correctOptionIds: r.correctOptionIds } : {}),
                ...(r.correctOrder ? { correctOrder: r.correctOrder } : {}),
                phase: 'closed' as const,
                durationSec,
                hostNotes: r.hostNotes,
                ...(r.showsHeroPhoto ? { showsHeroPhoto: true } : {}),
                ...(r.roundImage ? { roundImage: r.roundImage } : {}),
                ...(r.reasons && r.reasons.length
                    ? { reasons: r.reasons.map((x) => ({ id: x.id, label: x.label })) }
                    : {}),
                config: { ...(r.config ?? {}) },
                ...(r.content ? { content: r.content } : {}),
                ...(r.script ? { script: r.script } : {}),
            }
        })

        for (let attempt = 0; attempt < 5; attempt++) {
            try {
                return await WorkshopRoom.create({
                    code: this.generateCode(settings.codeLength),
                    hostKey: crypto.randomBytes(12).toString('hex'),
                    title: tr(template.title, settings.language),
                    templateId,
                    status: 'lobby',
                    rounds,
                    currentRoundIndex: -1,
                    isDemo: opts?.isDemo ?? false,
                    settings,
                })
            } catch (err: unknown) {
                const isDup = typeof err === 'object' && err !== null && 'code' in err && (err as { code: number }).code === 11000
                if (!isDup || attempt === 4) throw err
            }
        }
        throw new Error('Code collision')
    }

    static async getRoomByCode(code: string): Promise<IWorkshopRoom | null> {
        await dbConnect()
        return WorkshopRoom.findOne({ code: code.toUpperCase() }).lean<IWorkshopRoom>()
    }

    /**
     * Perf: the student poll never needs per-round `content` (teach slide blocks) or
     * `script` (host-only) — those are large blobs that bloat the room doc fetched on
     * every poll. Project them out so 30 phones deserialize a small document each tick.
     */
    static async getRoomByCodeForStudent(code: string): Promise<IWorkshopRoom | null> {
        await dbConnect()
        return WorkshopRoom.findOne(
            { code: code.toUpperCase() },
            { 'rounds.content': 0, 'rounds.script': 0 }
        ).lean<IWorkshopRoom>()
    }

    static async getRoomByHostKey(hostKey: string): Promise<IWorkshopRoom | null> {
        await dbConnect()
        return WorkshopRoom.findOne({ hostKey }).lean<IWorkshopRoom>()
    }

    static async listRecentRooms(limit = 10): Promise<IWorkshopRoom[]> {
        await dbConnect()
        return WorkshopRoom.find({}).sort({ createdAt: -1 }).limit(limit).lean<IWorkshopRoom[]>()
    }

    /**
     * Demo room: full template + 8 fake participants. Answers are NOT pre-seeded —
     * they DRIP IN one-by-one (maybeDripDemo) as the host walks each open round, so
     * the per-answer notification sound plays distinctly and the graph fills live.
     * (The remote's dice button still fills a round instantly if you want it all at once.)
     */
    static async createDemoRoom(
        templateId: string,
        opts?: { settings?: Partial<IWorkshopRoomSettings> }
    ): Promise<IWorkshopRoom> {
        const room = await this.createDemoRoomBase(templateId, opts)
        if (!DEMO_RESPONSES[templateId]) return room

        // participants → roster + counters work; answers arrive via the drip
        await WorkshopParticipant.bulkWrite(
            DEMO_NAMES.map((name, i) => ({
                updateOne: {
                    filter: { roomId: room._id, clientId: `fake-${i}` },
                    update: {
                        $set: { name, lastSeenAt: new Date() },
                        $setOnInsert: { joinedAt: new Date(Date.now() - (DEMO_NAMES.length - i) * 7000) },
                    },
                    upsert: true,
                },
            }))
        )
        return room
    }

    private static async createDemoRoomBase(
        templateId: string,
        opts?: { settings?: Partial<IWorkshopRoomSettings> }
    ): Promise<IWorkshopRoom> {
        return this.createRoomFromTemplate(templateId, { isDemo: true, settings: opts?.settings })
    }

    /**
     * Demo drip: on each host poll, insert ONE more demo answer for the current
     * open/revote round (time-throttled to ~1 per 1.5s so each plays a distinct
     * sound). Poll-driven — no cron. No-op for non-demo rooms and teach slides.
     */
    static async maybeDripDemo(room: IWorkshopRoom): Promise<void> {
        if (!room.isDemo) return
        const idx = room.currentRoundIndex
        const r = idx >= 0 && idx < room.rounds.length ? room.rounds[idx] : null
        if (!r || r.type === 'teach') return
        if (r.phase !== 'open' && r.phase !== 'revote') return

        const demo = DEMO_RESPONSES[room.templateId]?.[r.key]
        if (!demo) return
        const phase = r.phase === 'revote' ? 'revote' : 'open'
        const values = phase === 'revote' ? demo.revote ?? [] : demo.open
        if (!values.length) return

        await dbConnect()
        // throttle: keep ~1.5s between drips so each beep is separate
        const last = await WorkshopResponse.findOne({ roomId: room._id, roundKey: r.key, phase })
            .sort({ createdAt: -1 })
            .lean<{ createdAt: Date }>()
        if (last && Date.now() - new Date(last.createdAt).getTime() < 1500) return

        const have = await WorkshopResponse.countDocuments({ roomId: room._id, roundKey: r.key, phase })
        if (have >= values.length) return

        const i = have // insert the next participant's answer
        const value = values[i]
        const set: Record<string, unknown> = { name: DEMO_NAMES[i % DEMO_NAMES.length] }
        if (r.type === 'number') set.numberValue = value as number
        else if (r.type === 'text' || r.type === 'order') set.textValue = value as string
        else if (r.type === 'multi') set.optionIds = (value as string).split(',').filter(Boolean)
        else set.optionId = value as string

        await WorkshopResponse.updateOne(
            { roomId: room._id, roundKey: r.key, phase, clientId: `fake-${i}` },
            { $set: set, $setOnInsert: { createdAt: new Date() } },
            { upsert: true }
        )
        this.bustResultsCache(room._id, r.key)
    }

    /** Admin: delete a room with all its participants and responses. */
    static async deleteRoom(code: string): Promise<boolean> {
        await dbConnect()
        const room = await WorkshopRoom.findOne({ code: code.toUpperCase() }).lean<IWorkshopRoom>()
        if (!room) return false
        await Promise.all([
            WorkshopResponse.deleteMany({ roomId: room._id }),
            WorkshopParticipant.deleteMany({ roomId: room._id }),
        ])
        await WorkshopRoom.deleteOne({ _id: room._id })
        return true
    }

    static async joinRoom(
        roomId: mongoose.Types.ObjectId,
        name: string,
        clientId: string
    ): Promise<{ ok: true } | { ok: false; reason: 'full' | 'name' }> {
        await dbConnect()
        const room = await WorkshopRoom.findById(roomId, { settings: 1 }).lean<{ settings?: IWorkshopRoomSettings }>()
        const max = room?.settings?.maxParticipants ?? DEFAULT_ROOM_SETTINGS.maxParticipants
        const filter = room?.settings?.nameFilter ?? DEFAULT_ROOM_SETTINGS.nameFilter
        const teamMode = room?.settings?.teamMode ?? DEFAULT_ROOM_SETTINGS.teamMode
        const teamCount = room?.settings?.teamCount ?? DEFAULT_ROOM_SETTINGS.teamCount
        const clean = (name ?? '').trim()
        if (filter && (clean.length < 1 || isBlockedName(clean))) return { ok: false, reason: 'name' }

        const existing = await WorkshopParticipant.findOne({ roomId, clientId }).lean<{ _id: unknown }>()
        let team: number | undefined
        if (!existing && (max > 0 || teamMode)) {
            const count = await WorkshopParticipant.countDocuments({ roomId })
            if (max > 0 && count >= max) return { ok: false, reason: 'full' }
            // round-robin team balance, sticky (only on first join)
            if (teamMode) team = (count % Math.max(teamCount, 1)) + 1
        }
        await WorkshopParticipant.findOneAndUpdate(
            { roomId, clientId },
            {
                $set: { name: clean || name, lastSeenAt: new Date() },
                $setOnInsert: { joinedAt: new Date(), ...(team ? { team } : {}) },
            },
            { upsert: true }
        )
        return { ok: true }
    }

    /** Host kick: remove a participant + their answers for this room. */
    static async kickParticipant(roomId: mongoose.Types.ObjectId, clientId: string): Promise<void> {
        await dbConnect()
        await Promise.all([
            WorkshopParticipant.deleteOne({ roomId, clientId }),
            WorkshopResponse.deleteMany({ roomId, clientId }),
        ])
    }

    static async touchParticipant(roomId: mongoose.Types.ObjectId, clientId: string): Promise<void> {
        await dbConnect()
        await WorkshopParticipant.updateOne({ roomId, clientId }, { $set: { lastSeenAt: new Date() } })
    }

    private static sanitizeRound(room: IWorkshopRoom, forHost: boolean): StudentRound | null {
        const idx = room.currentRoundIndex
        if (idx < 0 || idx >= room.rounds.length) return null
        const r = room.rounds[idx]
        // host always sees the correct answer (control); students only if the room
        // allows it AND the round is revealed.
        const showCorrect = room.settings?.revealCorrect ?? DEFAULT_ROOM_SETTINGS.revealCorrect
        const revealCorrect = forHost || (r.phase === 'revealed' && showCorrect)
        return {
            key: r.key,
            type: r.type,
            prompt: r.prompt,
            options: r.options.map((o) => ({ id: o.id, label: o.label, ...(o.src ? { src: o.src } : {}) })),
            phase: r.phase,
            config: r.config ?? {},
            ...(revealCorrect && r.correctOptionId ? { correctOptionId: r.correctOptionId } : {}),
            ...(revealCorrect && r.correctOptionIds?.length ? { correctOptionIds: r.correctOptionIds } : {}),
            ...(revealCorrect && r.correctOrder?.length ? { correctOrder: r.correctOrder } : {}),
            ...(forHost && r.hostNotes ? { hostNotes: r.hostNotes } : {}),
            ...(forHost && r.script ? { script: r.script } : {}),
            ...(r.phaseStartedAt ? { phaseStartedAt: r.phaseStartedAt.toISOString() } : {}),
            ...(typeof r.durationSec === 'number' ? { durationSec: r.durationSec } : {}),
            ...(r.content ? { content: r.content } : {}),
            ...(r.showsHeroPhoto ? { showsHeroPhoto: true } : {}),
            ...(r.roundImage ? { roundImage: r.roundImage } : {}),
            ...(r.reasons && r.reasons.length ? { reasons: r.reasons.map((x) => ({ id: x.id, label: x.label })) } : {}),
            index: idx,
            total: room.rounds.length,
        }
    }

    /** Pinned responses for projector display (multi-select; one extra query only when set, pin order preserved). */
    static async getPinned(
        room: IWorkshopRoom
    ): Promise<{ id: string; name: string; textValue: string }[] | null> {
        const idx = room.currentRoundIndex
        const r = idx >= 0 ? room.rounds[idx] : null
        const ids = (r?.pinnedResponseIds ?? []).filter((id) => mongoose.Types.ObjectId.isValid(id))
        if (!ids.length) return null
        await dbConnect()
        const docs = await WorkshopResponse.find({ _id: { $in: ids } }).lean<IWorkshopResponse[]>()
        const byId = new Map(docs.map((d) => [String(d._id), d]))
        const out = ids
            .map((id) => byId.get(id))
            .filter((d): d is IWorkshopResponse => !!d)
            .map((d) => ({ id: String(d._id), name: d.name, textValue: d.textValue ?? '' }))
        return out.length ? out : null
    }

    /** Timer expiry: true when an open/revote phase ran out of durationSec. */
    private static isPhaseExpired(r: IWorkshopRound): boolean {
        if (!r.durationSec || !r.phaseStartedAt) return false
        if (r.phase !== 'open' && r.phase !== 'revote') return false
        return Date.now() > r.phaseStartedAt.getTime() + r.durationSec * 1000
    }

    /** F3: when revealing a photo-vote round (options carry images), record the winner. */
    private static async stampSelectedPhoto(doc: IWorkshopRoom, round: IWorkshopRound): Promise<void> {
        // Only the photo VOTE sets the hero photo — never the order round (its option
        // images are story frames, not the chosen hero) or any non-choice round.
        if (round.type !== 'choice' && round.type !== 'quiz') return
        if (!round.options?.some((o) => o.src)) return
        const agg = await WorkshopResponse.aggregate([
            { $match: { roomId: doc._id, roundKey: round.key, phase: 'open' } },
            { $group: { _id: '$optionId', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 },
        ])
        const winnerId = agg[0]?._id as string | undefined
        const winner = round.options.find((o) => o.id === winnerId) ?? round.options.find((o) => o.src)
        if (winner?.src) {
            doc.selectedPhoto = { src: winner.src, label: winner.label }
        }
    }

    /**
     * Auto-advance on poll GETs (no cron):
     *   (1) choice_revote open→discuss on timer expiry.
     *   (2) F2 — when EVERYONE has answered, start a 5s grace; if nobody re-answers
     *       within it, auto-reveal. The grace is reset by submitResponse on every
     *       (re)answer, so it only fires once the room has truly settled.
     */
    static async maybeAutoAdvance(room: IWorkshopRoom): Promise<IWorkshopRoom> {
        const idx = room.currentRoundIndex
        const r = idx >= 0 ? room.rounds[idx] : null
        if (!r) return room

        // (1) choice_revote open→discuss on timer expiry
        if (r.type === 'choice_revote' && r.phase === 'open' && this.isPhaseExpired(r)) {
            await dbConnect()
            const doc = await WorkshopRoom.findById(room._id)
            if (!doc) return room
            const dr = doc.rounds[idx]
            if (dr && dr.phase === 'open' && this.isPhaseExpired(dr)) {
                dr.phase = 'discuss'
                dr.phaseStartedAt = new Date()
                doc.markModified('rounds')
                await doc.save()
                return doc.toObject() as IWorkshopRoom
            }
        }

        // (2) F2 — all-answered → 5s grace → auto-reveal.
        // Applies to simple open rounds and to the Mazur RE-vote (not the first
        // Mazur vote, which should flow into discuss instead of reveal).
        const autoRevealOn = room.settings?.autoReveal ?? DEFAULT_ROOM_SETTINGS.autoReveal
        const graceMs = (room.settings?.graceSec ?? DEFAULT_ROOM_SETTINGS.graceSec) * 1000
        const autoRevealEligible =
            autoRevealOn &&
            r.type !== 'teach' &&
            ((r.phase === 'open' && r.type !== 'choice_revote') || r.phase === 'revote')
        if (autoRevealEligible) {
            await dbConnect()
            const [participantCount, responsesCount] = await Promise.all([
                WorkshopParticipant.countDocuments({ roomId: room._id }),
                this.getResponsesCount(room),
            ])
            const allAnswered = participantCount > 0 && responsesCount >= participantCount
            if (allAnswered && !r.allAnsweredAt) {
                const doc = await WorkshopRoom.findById(room._id)
                const dr = doc?.rounds[idx]
                if (doc && dr && (dr.phase === 'open' || dr.phase === 'revote') && !dr.allAnsweredAt) {
                    dr.allAnsweredAt = new Date()
                    doc.markModified('rounds')
                    await doc.save()
                    return doc.toObject() as IWorkshopRoom
                }
            } else if (allAnswered && r.allAnsweredAt && Date.now() - new Date(r.allAnsweredAt).getTime() > graceMs) {
                const doc = await WorkshopRoom.findById(room._id)
                const dr = doc?.rounds[idx]
                if (
                    doc &&
                    dr &&
                    (dr.phase === 'open' || dr.phase === 'revote') &&
                    dr.allAnsweredAt &&
                    Date.now() - new Date(dr.allAnsweredAt).getTime() > graceMs
                ) {
                    dr.phase = 'revealed'
                    dr.phaseStartedAt = new Date()
                    dr.allAnsweredAt = undefined
                    await this.stampSelectedPhoto(doc, dr)
                    doc.markModified('rounds')
                    await doc.save()
                    return doc.toObject() as IWorkshopRoom
                }
            }
        }

        return room
    }

    /** Client-readable subset of room settings (server-only flags stay in the service). */
    static pickClientSettings(room: IWorkshopRoom): RoomSettingsDTO {
        const s = room.settings
        const d = DEFAULT_ROOM_SETTINGS
        return {
            audience: s?.audience ?? d.audience,
            studentSound: s?.studentSound ?? d.studentSound,
            hostAnswerSound: s?.hostAnswerSound ?? d.hostAnswerSound,
            hostVolume: s?.hostVolume ?? d.hostVolume,
            studentVolume: s?.studentVolume ?? d.studentVolume,
            gateRatio: s?.gateRatio ?? d.gateRatio,
            studentPollMs: s?.studentPollMs ?? d.studentPollMs,
            confetti: s?.confetti ?? d.confetti,
            allowKick: s?.allowKick ?? d.allowKick,
            language: s?.language ?? d.language,
            gamification: s?.gamification ?? d.gamification,
            teamMode: s?.teamMode ?? d.teamMode,
        }
    }

    static async getStudentState(room: IWorkshopRoom, clientId: string | null): Promise<StudentState> {
        await dbConnect()
        const round = this.sanitizeRound(room, false)
        const participantCount = await WorkshopParticipant.countDocuments({ roomId: room._id })

        let myAnswer: StudentState['myAnswer'] = null
        if (clientId && round) {
            const phase = round.phase === 'revote' ? 'revote' : round.phase === 'discuss' ? 'discuss' : 'open'
            const resp = await WorkshopResponse.findOne({
                roomId: room._id, roundKey: round.key, phase, clientId,
            }).lean<IWorkshopResponse>()
            if (resp) {
                myAnswer = {
                    phase,
                    optionId: resp.optionId,
                    ...(resp.optionIds ? { optionIds: resp.optionIds } : {}),
                    textValue: resp.textValue,
                    numberValue: resp.numberValue,
                }
            }
        }
        if (round) {
            round.pinned = await this.getPinned(room)
        }

        // 🎯 the bet this student placed (phase='predict') — surfaced at reveal as a +15 outcome
        let myPrediction: string | null = null
        if (clientId && round && (round.type === 'choice' || round.type === 'quiz')) {
            const pred = await WorkshopResponse.findOne({
                roomId: room._id, roundKey: round.key, phase: 'predict', clientId,
            }).lean<IWorkshopResponse>()
            myPrediction = pred?.optionId ?? null
        }

        // Show the live tally on the student's phone once they've answered (or at
        // reveal) — removes the need to wait for a separate "reveal" click. Mazur
        // choice_revote stays hidden until reveal so the re-vote isn't anchored.
        let results: RoundResults | null = null
        if (round && round.type !== 'teach') {
            const revealed = round.phase === 'revealed'
            const mazurEarly = round.type === 'choice_revote' && !revealed
            if ((myAnswer != null || revealed) && !mazurEarly) {
                results = await this.getResults(room)
            }
        }

        const gamified = room.settings?.gamification ?? DEFAULT_ROOM_SETTINGS.gamification
        let me: MyGame | null = null
        if (gamified) {
            const scores = await this.getScores(room)
            me = this.myGame(scores, clientId)
        }

        return {
            status: room.status,
            title: room.title,
            participantCount,
            round,
            myAnswer,
            results,
            selectedPhoto: room.selectedPhoto ?? null,
            serverNow: new Date().toISOString(),
            settings: this.pickClientSettings(room),
            ...(gamified
                ? {
                      me,
                      reactions: this.getRecentReactions(room._id),
                      progress: this.progressOf(room),
                      spotlightName: room.spotlightName ?? null,
                      spotlightAt: room.spotlightAt ?? null,
                      myPrediction,
                  }
                : {}),
        }
    }

    /** Distinct responders for the CURRENT phase of the current round (the «17/24» counter). */
    static async getResponsesCount(room: IWorkshopRoom): Promise<number> {
        const idx = room.currentRoundIndex
        const r = idx >= 0 ? room.rounds[idx] : null
        if (!r) return 0
        const phase = r.phase === 'revote' ? 'revote' : 'open'
        await dbConnect()
        return WorkshopResponse.countDocuments({ roomId: room._id, roundKey: r.key, phase })
    }

    static async submitResponse(params: {
        room: IWorkshopRoom
        clientId: string
        roundKey: string
        optionId?: string
        optionIds?: string[]
        textValue?: string
        numberValue?: number
        orderValue?: string[]
        predictedOptionId?: string
    }): Promise<{ ok: true } | { ok: false; reason: 'closed' | 'invalid' }> {
        await dbConnect()
        const { room, clientId, roundKey } = params
        const idx = room.currentRoundIndex
        const round = idx >= 0 ? room.rounds[idx] : null
        if (!round || round.key !== roundKey) return { ok: false, reason: 'closed' }

        // Gamified prediction bet — a separate phase='predict' row (doesn't touch the vote),
        // accepted only while the round is open. Scored on reveal in computeScores.
        if (params.predictedOptionId && (round.type === 'choice' || round.type === 'quiz')) {
            if (round.phase !== 'open') return { ok: false, reason: 'closed' }
            if (!round.options.some((o) => o.id === params.predictedOptionId)) return { ok: false, reason: 'invalid' }
            const p = await WorkshopParticipant.findOne({ roomId: room._id, clientId }).lean<{ name: string }>()
            await WorkshopResponse.findOneAndUpdate(
                { roomId: room._id, roundKey, phase: 'predict', clientId },
                { $set: { optionId: params.predictedOptionId, name: p?.name ?? 'ანონიმი' }, $setOnInsert: { createdAt: new Date() } },
                { upsert: true }
            )
            this.bustResultsCache(room._id, roundKey)
            return { ok: true }
        }

        // F4: during the Mazur discuss phase, students submit a REASON (text) for why
        // they voted — stored as a separate phase='discuss' row (doesn't touch the vote).
        const isDiscussReason = round.type === 'choice_revote' && round.phase === 'discuss'
        if (round.phase !== 'open' && round.phase !== 'revote' && !isDiscussReason) {
            return { ok: false, reason: 'closed' }
        }
        if (this.isPhaseExpired(round)) return { ok: false, reason: 'closed' }

        const phase = round.phase === 'revote' ? 'revote' : round.phase === 'discuss' ? 'discuss' : 'open'
        const set: Partial<IWorkshopResponse> = {}

        if (isDiscussReason) {
            if (!params.textValue?.trim()) return { ok: false, reason: 'invalid' }
            set.textValue = params.textValue.trim().slice(0, 500)
        } else if (round.type === 'text') {
            if (!params.textValue?.trim()) return { ok: false, reason: 'invalid' }
            set.textValue = params.textValue.trim().slice(0, 2000)
        } else if (round.type === 'number') {
            const { minNumber = 0, maxNumber = 100 } = round.config ?? {}
            if (typeof params.numberValue !== 'number' || params.numberValue < minNumber || params.numberValue > maxNumber) {
                return { ok: false, reason: 'invalid' }
            }
            set.numberValue = params.numberValue
        } else if (round.type === 'order') {
            // a full permutation of the option ids — packed as a comma-joined string
            const ids = params.orderValue ?? []
            const valid =
                ids.length === round.options.length &&
                ids.every((id) => round.options.some((o) => o.id === id)) &&
                new Set(ids).size === ids.length
            if (!valid) return { ok: false, reason: 'invalid' }
            set.textValue = ids.join(',')
        } else if (round.type === 'multi') {
            // checkbox — keep only valid, de-duped ids; at least one required
            const ids = [...new Set((params.optionIds ?? []).filter((id) => round.options.some((o) => o.id === id)))]
            if (!ids.length) return { ok: false, reason: 'invalid' }
            set.optionIds = ids
        } else {
            if (!params.optionId || !round.options.some((o) => o.id === params.optionId)) {
                return { ok: false, reason: 'invalid' }
            }
            set.optionId = params.optionId
        }

        const participant = await WorkshopParticipant.findOne({ roomId: room._id, clientId }).lean<{ name: string }>()
        const name = participant?.name ?? 'ანონიმი'

        await WorkshopResponse.findOneAndUpdate(
            { roomId: room._id, roundKey, phase, clientId },
            { $set: { ...set, name }, $setOnInsert: { createdAt: new Date() } },
            { upsert: true }
        )

        // F2: any (re)answer resets the «all-answered» grace timer for this round,
        // so auto-reveal only fires once the room has been quiet for 5s.
        if (phase === 'open' || phase === 'revote') {
            await WorkshopRoom.updateOne(
                { _id: room._id },
                { $set: { [`rounds.${idx}.allAnsweredAt`]: null } }
            )
        }
        // a new answer changes the tally → drop the cached results for this round
        this.bustResultsCache(room._id, roundKey)
        return { ok: true }
    }

    /** Cached wrapper — collapses 30 identical per-round aggregations into 1 per ~1.5s. */
    static async getResults(room: IWorkshopRoom): Promise<RoundResults | null> {
        const idx = room.currentRoundIndex
        const round = idx >= 0 ? room.rounds[idx] : null
        if (!round) return null
        const key = `${room._id}:${round.key}:${round.phase}`
        const now = Date.now()
        const hit = resultsCache.get(key)
        if (hit && hit.exp > now) return hit.value
        const value = await this.computeResults(room, round)
        resultsCache.set(key, { value, exp: now + RESULTS_TTL_MS })
        if (resultsCache.size > 300) {
            for (const [k, v] of resultsCache) if (v.exp <= now) resultsCache.delete(k)
        }
        return value
    }

    /**
     * Full per-round results + per-participant answer grid — powers the host's
     * private "answer history" panel (recall any past round by name) and the end-stats
     * screen. All answers persist in WorkshopResponse keyed by roundKey; this is the
     * only place that reads across ALL rounds at once.
     */
    static async getRoomHistory(room: IWorkshopRoom): Promise<RoomHistory> {
        await dbConnect()
        const anon = room.settings?.anonymousNames ?? DEFAULT_ROOM_SETTINGS.anonymousNames

        const rounds: HistoryRound[] = []
        for (let i = 0; i < room.rounds.length; i++) {
            const r = room.rounds[i]
            if (r.type === 'teach') continue
            rounds.push({
                key: r.key,
                index: i,
                prompt: r.prompt,
                type: r.type,
                results: await this.computeResults(room, r),
            })
        }

        // per-participant answer grid — one query, grouped client-side, values resolved to labels
        const all = await WorkshopResponse.find({ roomId: room._id, phase: 'open' })
            .sort({ createdAt: 1 })
            .lean<IWorkshopResponse[]>()
        const roundByKey = new Map(room.rounds.map((r) => [r.key, r]))
        const labelOf = (r: IWorkshopRound, optionId?: string) =>
            optionId ? r.options.find((o) => o.id === optionId)?.label ?? optionId : ''
        const valueOf = (r: IWorkshopRound, doc: IWorkshopResponse): string => {
            if (r.type === 'number') return doc.numberValue != null ? String(doc.numberValue) : ''
            if (r.type === 'order')
                return (doc.textValue ?? '')
                    .split(',')
                    .filter(Boolean)
                    .map((id) => labelOf(r, id))
                    .join(' → ')
            if (r.type === 'choice' || r.type === 'quiz' || r.type === 'choice_revote') return labelOf(r, doc.optionId)
            return doc.textValue ?? ''
        }
        const byClient = new Map<string, HistoryParticipant>()
        for (const doc of all) {
            const r = roundByKey.get(doc.roundKey)
            if (!r || r.type === 'teach') continue
            let p = byClient.get(doc.clientId)
            if (!p) {
                p = { clientId: doc.clientId, name: doc.name, answers: [] }
                byClient.set(doc.clientId, p)
            }
            p.answers.push({ roundKey: doc.roundKey, prompt: r.prompt, value: valueOf(r, doc) })
        }
        let participants = [...byClient.values()].sort((a, b) => b.answers.length - a.answers.length)
        if (anon) participants = participants.map((p, n) => ({ ...p, name: `${ANON_LABEL} ${n + 1}` }))

        const participantCount = await WorkshopParticipant.countDocuments({ roomId: room._id })
        return { rounds, participants, participantCount }
    }

    /**
     * Gamification scoring — derived from WorkshopResponse rows (no score stored).
     * Cached briefly (shared by the host poll + every student poll).
     */
    static async getScores(room: IWorkshopRoom): Promise<ScoreSummary> {
        const key = `${room._id}:${room.currentRoundIndex}:${room.status}`
        const now = Date.now()
        const hit = scoresCache.get(key)
        if (hit && hit.exp > now) return hit.value
        const value = await this.computeScores(room)
        scoresCache.set(key, { value, exp: now + SCORES_TTL_MS })
        if (scoresCache.size > 200) for (const [k, v] of scoresCache) if (v.exp <= now) scoresCache.delete(k)
        return value
    }

    private static async computeScores(room: IWorkshopRoom): Promise<ScoreSummary> {
        await dbConnect()
        const anon = room.settings?.anonymousNames ?? DEFAULT_ROOM_SETTINGS.anonymousNames
        const teamMode = room.settings?.teamMode ?? DEFAULT_ROOM_SETTINGS.teamMode

        const all = await WorkshopResponse.find({ roomId: room._id }).sort({ createdAt: 1 }).lean<IWorkshopResponse[]>()
        const roundByKey = new Map(room.rounds.map((r) => [r.key, r]))
        const pinnedIds = new Set<string>()
        for (const r of room.rounds) for (const id of r.pinnedResponseIds ?? []) pinnedIds.add(id)

        type Acc = {
            clientId: string; name: string; points: number; answered: Set<string>
            firstCount: number; mindChange: boolean; orderCorrect: boolean; predictRight: number; pinned: boolean; streak: number
        }
        const acc = new Map<string, Acc>()
        const get = (clientId: string, name: string): Acc => {
            let a = acc.get(clientId)
            if (!a) {
                a = { clientId, name, points: 0, answered: new Set(), firstCount: 0, mindChange: false, orderCorrect: false, predictRight: 0, pinned: false, streak: 0 }
                acc.set(clientId, a)
            }
            a.name = name
            return a
        }

        const openByRound = new Map<string, IWorkshopResponse[]>()
        const revoteByRound = new Map<string, Map<string, string>>()
        const predictByRound = new Map<string, IWorkshopResponse[]>()
        for (const d of all) {
            const r = roundByKey.get(d.roundKey)
            if (!r || r.type === 'teach') continue
            if (d.phase === 'open') {
                const arr = openByRound.get(d.roundKey) ?? []
                arr.push(d)
                openByRound.set(d.roundKey, arr)
            } else if (d.phase === 'revote' && d.optionId) {
                const m = revoteByRound.get(d.roundKey) ?? new Map<string, string>()
                m.set(d.clientId, d.optionId)
                revoteByRound.set(d.roundKey, m)
            } else if (d.phase === 'predict') {
                const arr = predictByRound.get(d.roundKey) ?? []
                arr.push(d)
                predictByRound.set(d.roundKey, arr)
            }
        }

        const winnerByRound = new Map<string, string>()
        for (const r of room.rounds) {
            if (r.type === 'teach') continue
            const opens = openByRound.get(r.key) ?? [] // createdAt-asc (global sort preserved)
            if (r.type === 'choice' || r.type === 'quiz' || r.type === 'choice_revote') {
                const tally = new Map<string, number>()
                for (const d of opens) if (d.optionId) tally.set(d.optionId, (tally.get(d.optionId) ?? 0) + 1)
                let best: string | undefined
                let bestN = -1
                for (const [k, n] of tally) if (n > bestN) { best = k; bestN = n }
                if (best) winnerByRound.set(r.key, best)
            }
            opens.forEach((d, i) => {
                const a = get(d.clientId, d.name)
                a.points += 10
                a.answered.add(r.key)
                if (i === 0) { a.points += 5; a.firstCount++ } else if (i === 1) a.points += 3
                else if (i === 2) a.points += 2
                let correct = false
                if ((r.type === 'choice' || r.type === 'quiz') && r.correctOptionId) correct = d.optionId === r.correctOptionId
                else if (r.type === 'order' && r.correctOrder?.length) correct = (d.textValue ?? '') === r.correctOrder.join(',')
                else if (r.type === 'multi' && r.correctOptionIds?.length) {
                    // partial credit: +5 per correct selection; full clean set also earns the +20 below
                    const cset = new Set(r.correctOptionIds)
                    const picks = d.optionIds ?? []
                    const hits = picks.filter((id) => cset.has(id)).length
                    if (hits > 0) a.points += hits * 5
                    if (hits === cset.size && picks.length === cset.size) correct = true
                }
                if (correct) { a.points += 20; if (r.type === 'order') a.orderCorrect = true }
                if (pinnedIds.has(String(d._id))) { a.points += 15; a.pinned = true }
            })
            if (r.type === 'choice_revote') {
                const rev = revoteByRound.get(r.key)
                if (rev) {
                    const openOpt = new Map(opens.map((d) => [d.clientId, d.optionId]))
                    for (const [cid, to] of rev) {
                        const from = openOpt.get(cid)
                        if (from && to && from !== to) { const a = acc.get(cid); if (a) { a.points += 5; a.mindChange = true } }
                    }
                }
            }
        }

        for (const [roundKey, preds] of predictByRound) {
            const winner = winnerByRound.get(roundKey)
            if (!winner) continue
            for (const d of preds) if (d.optionId === winner) { const a = get(d.clientId, d.name); a.points += 15; a.predictRight++ }
        }

        const interactive = room.rounds.filter((r) => r.type !== 'teach')
        for (const a of acc.values()) {
            let cur = 0
            let best = 0
            for (const r of interactive) { if (a.answered.has(r.key)) { cur++; best = Math.max(best, cur) } else cur = 0 }
            a.streak = best
        }

        const teamOf = new Map<string, number | undefined>()
        if (teamMode) {
            const parts = await WorkshopParticipant.find({ roomId: room._id }, { clientId: 1, team: 1 }).lean<{ clientId: string; team?: number }[]>()
            for (const p of parts) teamOf.set(p.clientId, p.team)
        }

        const ranked = [...acc.values()]
            .map((a) => ({ clientId: a.clientId, rawName: a.name, team: teamOf.get(a.clientId), points: a.points, streak: a.streak, badges: badgesFor(a) }))
            .sort((x, y) => y.points - x.points || y.streak - x.streak)
        if (ranked[0] && ranked[0].points > 0) ranked[0].badges = [...ranked[0].badges, BADGE.champion]

        const leaderboard: LeaderboardEntry[] = ranked.map((e, i) => ({
            clientId: e.clientId,
            name: anon ? `${ANON_LABEL} ${i + 1}` : e.rawName,
            team: e.team,
            points: e.points,
            streak: e.streak,
            badges: e.badges,
            rank: i + 1,
        }))

        let teams: TeamScore[] = []
        if (teamMode) {
            const tmap = new Map<number, { points: number; members: number }>()
            for (const e of ranked) {
                if (e.team == null) continue
                const t = tmap.get(e.team) ?? { points: 0, members: 0 }
                t.points += e.points
                t.members++
                tmap.set(e.team, t)
            }
            teams = [...tmap.entries()]
                .map(([team, v]) => ({ team, points: v.points, members: v.members }))
                .sort((a, b) => b.points - a.points)
        }

        return { leaderboard, teams }
    }

    /** Per-participant shareable diploma data (real name even if anon, their dream, rank, badges). */
    static async getDiplomaData(room: IWorkshopRoom, clientId: string): Promise<DiplomaData | null> {
        await dbConnect()
        const scores = await this.getScores(room)
        const me = scores.leaderboard.find((e) => e.clientId === clientId)
        const docs = await WorkshopResponse.find({ roomId: room._id, clientId, phase: 'open' })
            .lean<IWorkshopResponse[]>()
        const part = await WorkshopParticipant.findOne({ roomId: room._id, clientId }, { name: 1 }).lean<{ name: string }>()
        const name = part?.name ?? docs.find((d) => d.name)?.name ?? 'სტუმარი'
        if (!me && !docs.length) return null // never participated
        // dream = their first text round answer (key r1 preferred)
        const r1 = room.rounds.find((r) => r.key === 'r1') ?? room.rounds.find((r) => r.type === 'text')
        const r1doc = r1 ? docs.find((d) => d.roundKey === r1.key) : undefined
        const dream = r1doc?.textValue ? extractDream(r1doc.textValue) : ''

        // per-student stats over their own open responses (mirrors computeScores correctness logic)
        const roundByKey = new Map(room.rounds.map((r) => [r.key, r]))
        const interactiveKeys = new Set(room.rounds.filter((r) => r.type !== 'teach').map((r) => r.key))
        const answeredKeys = new Set<string>()
        let correctCount = 0
        let scorable = 0 // rounds answered that HAVE a correct answer (accuracy denominator)
        for (const d of docs) {
            const r = roundByKey.get(d.roundKey)
            if (!r || r.type === 'teach') continue
            answeredKeys.add(d.roundKey)
            const hasKey = ((r.type === 'choice' || r.type === 'quiz') && !!r.correctOptionId) || (r.type === 'order' && !!r.correctOrder?.length)
            if (!hasKey) continue
            scorable++
            const correct =
                (r.type === 'choice' || r.type === 'quiz') && r.correctOptionId
                    ? d.optionId === r.correctOptionId
                    : r.type === 'order' && r.correctOrder?.length
                      ? (d.textValue ?? '') === r.correctOrder.join(',')
                      : false
            if (correct) correctCount++
        }
        const total = scores.leaderboard.length
        const rank = me?.rank ?? total + 1
        const roundsTotal = interactiveKeys.size
        return {
            name,
            dream,
            points: me?.points ?? 0,
            rank,
            total,
            streak: me?.streak ?? 0,
            badges: me?.badges ?? [],
            photo: room.selectedPhoto?.src ?? null,
            title: room.title,
            dateISO: (room.createdAt instanceof Date ? room.createdAt : new Date()).toISOString(),
            percentile: total > 0 ? Math.max(1, Math.round((1 - (rank - 1) / total) * 100)) : 100,
            answeredCount: answeredKeys.size,
            roundsTotal,
            correctCount,
            accuracyPct: scorable > 0 ? Math.round((correctCount / scorable) * 100) : 0,
            code: room.code,
            team: me?.team,
        }
    }

    /** The current student's gamification slice (rank/points/streak/badges/team). */
    static myGame(scores: ScoreSummary, clientId: string | null): MyGame | null {
        if (!clientId) return null
        const e = scores.leaderboard.find((x) => x.clientId === clientId)
        if (!e) return null
        return { points: e.points, streak: e.streak, rank: e.rank, badges: e.badges, team: e.team }
    }

    /** Speed-spotlight: first-N names of the current open round (createdAt order). */
    static async getFastest(room: IWorkshopRoom, limit = 3): Promise<string[]> {
        const idx = room.currentRoundIndex
        const r = idx >= 0 ? room.rounds[idx] : null
        if (!r || r.type === 'teach' || (r.phase !== 'open' && r.phase !== 'revote')) return []
        await dbConnect()
        const docs = await WorkshopResponse.find({ roomId: room._id, roundKey: r.key, phase: 'open' }, { name: 1 })
            .sort({ createdAt: 1 })
            .limit(limit)
            .lean<{ name: string }[]>()
        return docs.map((d) => d.name)
    }

    /** Progress 0..1 — interactive rounds finished (for the "video assembling" bar). */
    static progressOf(room: IWorkshopRoom): number {
        const interactive = room.rounds.filter((r) => r.type !== 'teach')
        if (!interactive.length) return 0
        if (room.status === 'ended') return 1
        const idx = room.currentRoundIndex
        let done = 0
        for (const r of interactive) {
            const ri = room.rounds.indexOf(r)
            if (ri < idx || (ri === idx && r.phase === 'revealed')) done++
        }
        return Math.min(1, done / interactive.length)
    }

    /** Ephemeral reaction — appended to the in-memory buffer (no DB). Each gets a unique id
     *  (so same-millisecond bursts never collide) + the sender's name for the projector label. */
    static pushReaction(roomId: mongoose.Types.ObjectId, kind: string, name: string): void {
        if (!REACTION_KIND_SET.has(kind)) return
        const key = String(roomId)
        const now = Date.now()
        const arr = (reactionsBuffer.get(key) ?? []).filter((x) => x.at > now - REACTION_TTL_MS)
        arr.push({ id: ++reactionSeq, kind, name: name.slice(0, 24), at: now })
        if (arr.length > 60) arr.splice(0, arr.length - 60)
        reactionsBuffer.set(key, arr)
    }

    /** Reactions from the last ~5s (pruned on read). */
    static getRecentReactions(roomId: mongoose.Types.ObjectId): Reaction[] {
        const key = String(roomId)
        const now = Date.now()
        const arr = (reactionsBuffer.get(key) ?? []).filter((x) => x.at > now - REACTION_TTL_MS)
        if (arr.length) reactionsBuffer.set(key, arr)
        else reactionsBuffer.delete(key)
        return arr.map((r) => ({ id: r.id, kind: r.kind, name: r.name }))
    }

    /** Drop cached tallies for a round (all phases) — call after a (re)answer. */
    private static bustResultsCache(roomId: mongoose.Types.ObjectId, roundKey: string): void {
        const prefix = `${roomId}:${roundKey}:`
        for (const k of resultsCache.keys()) if (k.startsWith(prefix)) resultsCache.delete(k)
    }

    private static async computeResults(
        room: IWorkshopRoom,
        round: IWorkshopRound | null,
    ): Promise<RoundResults | null> {
        await dbConnect()
        if (!round) return null

        // Teach slides are display-only — no answers, no results tally.
        if (round.type === 'teach') return null

        const anon = room.settings?.anonymousNames ?? DEFAULT_ROOM_SETTINGS.anonymousNames

        if (round.type === 'text') {
            const wallLimit = room.settings?.textWallLimit ?? DEFAULT_ROOM_SETTINGS.textWallLimit
            const items = await WorkshopResponse.find({ roomId: room._id, roundKey: round.key, phase: 'open' })
                .sort({ createdAt: -1 })
                .limit(wallLimit)
                .lean<IWorkshopResponse[]>()
            return {
                type: 'text',
                items: items.map((i, n) => ({
                    id: String(i._id),
                    name: anon ? `${ANON_LABEL} ${n + 1}` : i.name,
                    textValue: i.textValue ?? '',
                    createdAt: i.createdAt.toISOString(),
                })),
            }
        }

        if (round.type === 'choice' || round.type === 'quiz') {
            const agg = await WorkshopResponse.aggregate([
                { $match: { roomId: room._id, roundKey: round.key, phase: 'open' } },
                { $group: { _id: '$optionId', count: { $sum: 1 } } },
            ])
            const countMap = new Map<string, number>(agg.map((a) => [a._id as string, a.count as number]))
            const counts = round.options.map((o) => ({
                optionId: o.id, label: o.label, count: countMap.get(o.id) ?? 0,
            }))
            return {
                type: 'choice',
                counts,
                total: counts.reduce((s, c) => s + c.count, 0),
                ...(round.correctOptionId ? { correctOptionId: round.correctOptionId } : {}),
            }
        }

        if (round.type === 'multi') {
            // each response carries an array of picked ids → per-option selection counts
            const agg = await WorkshopResponse.aggregate([
                { $match: { roomId: room._id, roundKey: round.key, phase: 'open' } },
                { $unwind: '$optionIds' },
                { $group: { _id: '$optionIds', count: { $sum: 1 } } },
            ])
            const countMap = new Map<string, number>(agg.map((a) => [a._id as string, a.count as number]))
            const counts = round.options.map((o) => ({ optionId: o.id, label: o.label, count: countMap.get(o.id) ?? 0 }))
            const total = await WorkshopResponse.countDocuments({ roomId: room._id, roundKey: round.key, phase: 'open' })
            return {
                type: 'multi',
                counts,
                total, // responders, not selections
                ...(round.correctOptionIds?.length ? { correctOptionIds: round.correctOptionIds } : {}),
            }
        }

        if (round.type === 'choice_revote') {
            const agg = await WorkshopResponse.aggregate([
                { $match: { roomId: room._id, roundKey: round.key } },
                { $group: { _id: { optionId: '$optionId', phase: '$phase' }, count: { $sum: 1 } } },
            ])
            const get = (optionId: string, phase: string) =>
                (agg.find((a) => a._id.optionId === optionId && a._id.phase === phase)?.count as number | undefined) ?? 0
            const options = round.options.map((o) => ({
                optionId: o.id, label: o.label, open: get(o.id, 'open'), revote: get(o.id, 'revote'),
            }))

            // F4: per-client open→revote transition + the discuss reason → "who changed, and why"
            const perClient = await WorkshopResponse.aggregate([
                { $match: { roomId: room._id, roundKey: round.key } },
                {
                    $group: {
                        _id: '$clientId',
                        name: { $first: '$name' },
                        votes: { $push: { phase: '$phase', optionId: '$optionId', textValue: '$textValue' } },
                    },
                },
                {
                    $project: {
                        name: 1,
                        open: { $first: { $filter: { input: '$votes', cond: { $eq: ['$$this.phase', 'open'] } } } },
                        revote: { $first: { $filter: { input: '$votes', cond: { $eq: ['$$this.phase', 'revote'] } } } },
                        discuss: { $first: { $filter: { input: '$votes', cond: { $eq: ['$$this.phase', 'discuss'] } } } },
                    },
                },
            ])
            const labelOf = (id?: string) => (id ? round.options.find((o) => o.id === id)?.label ?? null : null)
            const moves: RevoteMove[] = perClient
                .filter((p) => p.open || p.revote)
                .map((p) => {
                    const from = p.open?.optionId as string | undefined
                    const to = p.revote?.optionId as string | undefined
                    const reason = (p.discuss?.textValue as string | undefined)?.trim() || undefined
                    return {
                        name: anon ? ANON_LABEL : (p.name as string),
                        fromLabel: labelOf(from),
                        toLabel: labelOf(to),
                        changed: !!(from && to && from !== to),
                        ...(reason ? { reason } : {}),
                    }
                })
                .sort((a, b) => Number(b.changed) - Number(a.changed)) // movers first

            return {
                type: 'choice_revote',
                options,
                totalOpen: options.reduce((s, o) => s + o.open, 0),
                totalRevote: options.reduce((s, o) => s + o.revote, 0),
                movedCount: moves.filter((m) => m.changed).length,
                moves,
            }
        }

        if (round.type === 'order') {
            const ordered = await WorkshopResponse.find({ roomId: room._id, roundKey: round.key, phase: 'open' })
                .lean<IWorkshopResponse[]>()
            const correctOrder = round.correctOrder ?? []
            const labelOf = (id: string) => round.options.find((o) => o.id === id)?.label ?? id
            const tally = new Map<string, { order: string[]; count: number }>()
            for (const d of ordered) {
                const order = (d.textValue ?? '').split(',').filter(Boolean)
                if (!order.length) continue
                const k = order.join(',')
                const hit = tally.get(k)
                if (hit) hit.count++
                else tally.set(k, { order, count: 1 })
            }
            const correctKey = correctOrder.join(',')
            const sequences = [...tally.values()]
                .sort((a, b) => b.count - a.count)
                .map((s) => ({
                    order: s.order,
                    labels: s.order.map(labelOf),
                    count: s.count,
                    correct: s.order.join(',') === correctKey,
                }))
            return {
                type: 'order',
                sequences,
                correctOrder,
                correctLabels: correctOrder.map(labelOf),
                correctCount: tally.get(correctKey)?.count ?? 0,
                total: ordered.length,
            }
        }

        // number → histogram
        const docs = await WorkshopResponse.find({ roomId: room._id, roundKey: round.key, phase: 'open' })
            .lean<IWorkshopResponse[]>()
        const values = docs.map((d) => d.numberValue ?? 0)
        const { minNumber = 0, maxNumber = 100 } = round.config ?? {}
        const range = maxNumber - minNumber
        const buckets: { label: string; count: number }[] = []
        if (range <= 15) {
            for (let v = minNumber; v <= maxNumber; v++) {
                buckets.push({ label: String(v), count: values.filter((x) => x === v).length })
            }
        } else {
            const step = Math.ceil(range / 6)
            for (let lo = minNumber; lo <= maxNumber; lo += step) {
                const hi = Math.min(lo + step - 1, maxNumber)
                buckets.push({ label: `${lo}–${hi}`, count: values.filter((x) => x >= lo && x <= hi).length })
            }
        }
        const avg = values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0
        return { type: 'number', buckets, total: values.length, avg: Math.round(avg * 10) / 10 }
    }

    static async getRoster(
        roomId: mongoose.Types.ObjectId,
        opts?: { anonymous?: boolean; onlineWindowMs?: number }
    ): Promise<RosterEntry[]> {
        await dbConnect()
        const parts = await WorkshopParticipant.find({ roomId })
            .sort({ joinedAt: 1 })
            .lean<{ name: string; clientId: string; joinedAt: Date; lastSeenAt: Date }[]>()
        const now = Date.now()
        const windowMs = opts?.onlineWindowMs ?? DEFAULT_ROOM_SETTINGS.onlineWindowSec * 1000
        return parts.map((p, i) => ({
            name: opts?.anonymous ? `${ANON_LABEL} ${i + 1}` : p.name,
            clientId: p.clientId,
            joinedAt: p.joinedAt.toISOString(),
            online: now - new Date(p.lastSeenAt).getTime() < windowMs,
        }))
    }

    static async hostAdvance(
        room: IWorkshopRoom,
        action: HostAction,
        responseId?: string,
        targetClientId?: string,
        count?: number
    ): Promise<{ ok: boolean; message?: string }> {
        await dbConnect()
        const doc = await WorkshopRoom.findById(room._id)
        if (!doc) return { ok: false, message: 'Room not found' }

        const idx = doc.currentRoundIndex
        const round: IWorkshopRound | null = idx >= 0 && idx < doc.rounds.length ? doc.rounds[idx] : null
        const stamp = (r: IWorkshopRound) => {
            r.phaseStartedAt = new Date()
        }
        // Teach slides have no answering phase — they land directly on 'revealed'
        // (students see the "look at the screen" banner, projector shows the content).
        const openPhaseFor = (r: IWorkshopRound) => (r.type === 'teach' ? 'revealed' : 'open')

        // Any host action except the wheel itself dismisses a prior wheel result.
        if (action !== 'spinWheel' && doc.spotlightName) {
            doc.spotlightName = undefined
            doc.spotlightAt = undefined
        }
        // Panel reveals (winners / top-answers) clear on any other action.
        if (action !== 'showWinners' && action !== 'showTopAnswers' && doc.spotlightPanel) {
            doc.spotlightPanel = undefined
        }

        switch (action) {
            case 'openRound': {
                // From lobby (or after reveal): open the NEXT closed round, or re-open current closed one
                if (round && round.phase === 'closed') {
                    round.phase = openPhaseFor(round)
                    stamp(round)
                } else {
                    const nextIdx = idx + 1
                    if (nextIdx >= doc.rounds.length) return { ok: false, message: 'No more rounds' }
                    doc.currentRoundIndex = nextIdx
                    doc.rounds[nextIdx].phase = openPhaseFor(doc.rounds[nextIdx])
                    stamp(doc.rounds[nextIdx])
                }
                doc.status = 'live'
                break
            }
            case 'advancePhase': {
                if (!round) return { ok: false, message: 'No active round' }
                if (round.type !== 'choice_revote') return { ok: false, message: 'Not a revote round' }
                if (round.phase === 'open') round.phase = 'discuss'
                else if (round.phase === 'discuss') round.phase = 'revote'
                else return { ok: false, message: 'Cannot advance phase' }
                stamp(round)
                break
            }
            case 'reveal': {
                if (!round) return { ok: false, message: 'No active round' }
                round.phase = 'revealed'
                round.allAnsweredAt = undefined
                stamp(round)
                await this.stampSelectedPhoto(doc, round) // F3: record photo winner
                break
            }
            case 'nextRound': {
                const nextIdx = idx + 1
                if (nextIdx >= doc.rounds.length) return { ok: false, message: 'No more rounds' }
                doc.currentRoundIndex = nextIdx
                doc.rounds[nextIdx].phase = openPhaseFor(doc.rounds[nextIdx])
                stamp(doc.rounds[nextIdx])
                doc.status = 'live'
                break
            }
            case 'prevRound': {
                // Go back to re-work an earlier slide. Non-destructive: the previous
                // round shows in 'revealed' state (its stored answers stay). Use
                // reopenRound after to re-collect. From lobby/ended it just goes live.
                const prevIdx = idx - 1
                if (prevIdx < 0) return { ok: false, message: 'Already at the first round' }
                doc.currentRoundIndex = prevIdx
                doc.rounds[prevIdx].phase = 'revealed'
                stamp(doc.rounds[prevIdx])
                doc.status = 'live'
                break
            }
            case 'reopenRound': {
                // Re-open the current round for answering (e.g. someone mis-answered).
                // Non-destructive: phase back to 'open' lets them re-submit/overwrite; others keep theirs.
                if (!round) return { ok: false, message: 'No active round' }
                if (round.type === 'teach') return { ok: false, message: 'Teach slide has no vote' }
                round.phase = 'open'
                round.allAnsweredAt = undefined
                round.pinnedResponseIds = undefined
                stamp(round)
                doc.status = 'live'
                break
            }
            case 'endRoom': {
                doc.status = 'ended'
                break
            }
            case 'seedFake': {
                if (!round || (round.phase !== 'open' && round.phase !== 'revote')) {
                    return { ok: false, message: 'Open a round first' }
                }
                await this.seedFakeResponses(doc._id, round)
                break
            }
            case 'pinResponse': {
                // Toggle: tap to spotlight, tap again to remove (multi-select on the projector).
                if (!round) return { ok: false, message: 'No active round' }
                if (!responseId) return { ok: false, message: 'responseId required' }
                const ids = round.pinnedResponseIds ?? []
                round.pinnedResponseIds = ids.includes(responseId)
                    ? ids.filter((x) => x !== responseId)
                    : [...ids, responseId]
                break
            }
            case 'unpin': {
                // With responseId → remove that one; without → clear all pins.
                if (!round) return { ok: false, message: 'No active round' }
                round.pinnedResponseIds = responseId
                    ? (round.pinnedResponseIds ?? []).filter((x) => x !== responseId)
                    : undefined
                break
            }
            case 'kickParticipant': {
                const allowKick = doc.settings?.allowKick ?? DEFAULT_ROOM_SETTINGS.allowKick
                if (!allowKick) return { ok: false, message: 'Kick disabled' }
                if (!targetClientId) return { ok: false, message: 'targetClientId required' }
                await this.kickParticipant(doc._id, targetClientId)
                return { ok: true } // no round mutation — already persisted
            }
            case 'spinWheel': {
                // Pick N random real participants — on question rounds + the t_close fortune slide.
                if (!round || (round.type === 'teach' && round.key !== 't_close'))
                    return { ok: false, message: 'Not a question round' }
                const parts = await WorkshopParticipant.find({ roomId: doc._id }, { name: 1, clientId: 1 }).lean<
                    { name: string; clientId: string }[]
                >()
                const real = parts.filter((p) => !p.clientId.startsWith('fake-'))
                const want = Math.max(1, Math.min(count ?? 1, parts.length))
                // prefer real participants; if too few for the requested count (host testing solo,
                // small room) top up from demo/fake so the wheel can still draw `want` distinct names
                const pool =
                    real.length >= want ? real : [...real, ...parts.filter((p) => p.clientId.startsWith('fake-'))]
                if (!pool.length) return { ok: false, message: 'No participants' }
                const n = Math.max(1, Math.min(want, pool.length))
                // draw n UNIQUE names without replacement
                const avail = pool.map((p) => p.name)
                const picks: string[] = []
                for (let k = 0; k < n && avail.length; k++) {
                    const j = Math.floor(Math.random() * avail.length)
                    picks.push(avail.splice(j, 1)[0]!)
                }
                doc.spotlightName = picks.join('\n') // multi-pick joined; overlay splits on newline
                doc.spotlightAt = Date.now() // nonce so a repeat pick still re-fires the overlay
                break
            }
            case 'showWinners': {
                // Reveal the people with the MOST correct answers this session (even 1 correct shows).
                const n = Math.max(1, Math.min(count ?? 5, 50))
                let rows = await this.computeWinners(doc, n)
                if (!rows.length) {
                    // No scorable correct answers yet → fall back to the points leaderboard so the panel always opens.
                    const s = await this.getScores(doc)
                    rows = s.leaderboard.slice(0, n).map((e) => ({ name: e.name, sub: String(e.points) }))
                }
                if (!rows.length) return { ok: false, message: 'No participants' }
                doc.spotlightPanel = { kind: 'winners', at: Date.now(), rows }
                break
            }
            case 'showTopAnswers': {
                // Reveal the top-N most common answers of the CURRENT round.
                if (!round || round.type === 'teach') return { ok: false, message: 'Not a question round' }
                const n = Math.max(1, Math.min(count ?? 3, 20))
                const rows = await this.computeTopAnswers(doc, round, n)
                if (!rows.length) return { ok: false, message: 'No answers yet' }
                doc.spotlightPanel = { kind: 'topAnswers', at: Date.now(), rows }
                break
            }
            default:
                return { ok: false, message: 'Unknown action' }
        }
        doc.markModified('rounds')
        doc.markModified('spotlightPanel') // Mixed field — Mongoose needs an explicit dirty flag
        await doc.save()
        return { ok: true }
    }

    /** Per-participant correct-answer ranking for the «winners» projector reveal (even 1 correct shows). */
    private static async computeWinners(doc: IWorkshopRoom, n: number): Promise<{ name: string; sub: string }[]> {
        await dbConnect()
        const responses = await WorkshopResponse.find({ roomId: doc._id, phase: 'open' }).lean<IWorkshopResponse[]>()
        const roundByKey = new Map(doc.rounds.map((r) => [r.key, r]))
        const correct = new Map<string, { name: string; n: number }>()
        for (const d of responses) {
            const r = roundByKey.get(d.roundKey)
            if (!r) continue
            let score = 0
            if ((r.type === 'choice' || r.type === 'quiz') && r.correctOptionId) score = d.optionId === r.correctOptionId ? 1 : 0
            else if (r.type === 'order' && r.correctOrder?.length) score = (d.textValue ?? '') === r.correctOrder.join(',') ? 1 : 0
            else if (r.type === 'multi' && r.correctOptionIds?.length) {
                // partial credit: +1 per correct pick, −1 per trap, floored at 0 → anyone with a net-correct pick ranks
                const cset = new Set(r.correctOptionIds)
                const picks = d.optionIds ?? []
                const hits = picks.filter((id) => cset.has(id)).length
                score = Math.max(0, hits - (picks.length - hits))
            }
            if (score <= 0) continue
            const e = correct.get(d.clientId) ?? { name: d.name ?? '—', n: 0 }
            e.n += score
            if (d.name) e.name = d.name
            correct.set(d.clientId, e)
        }
        return [...correct.values()]
            .sort((a, b) => b.n - a.n)
            .slice(0, n)
            .map((e) => ({ name: e.name, sub: String(e.n) }))
    }

    /** Top-N most common answers of one round (+ WHO gave each) for the «top answers» reveal. */
    private static async computeTopAnswers(
        doc: IWorkshopRoom,
        round: IWorkshopRound,
        n: number
    ): Promise<{ name: string; sub: string; who: string[] }[]> {
        await dbConnect()
        const responses = await WorkshopResponse.find({ roomId: doc._id, roundKey: round.key, phase: 'open' }).lean<
            IWorkshopResponse[]
        >()
        const strip = (s: string) => s.replace(/^[A-Z0-9]\s*·\s*/, '').trim()
        const labelOf = (id: string) => round.options.find((o) => o.id === id)?.label ?? id
        const WHO_CAP = 12
        const pushWho = (arr: string[], name?: string) => {
            if (name && arr.length < WHO_CAP) arr.push(name)
        }

        // number (slider) rounds — bucket identical values, rank by frequency
        if (round.type === 'number') {
            const tally = new Map<number, { c: number; who: string[] }>()
            for (const d of responses) {
                if (typeof d.numberValue !== 'number') continue
                const e = tally.get(d.numberValue) ?? { c: 0, who: [] }
                e.c++
                pushWho(e.who, d.name)
                tally.set(d.numberValue, e)
            }
            return [...tally.entries()]
                .sort((a, b) => b[1].c - a[1].c)
                .slice(0, n)
                .map(([v, e]) => ({ name: String(v), sub: `×${e.c}`, who: e.who }))
        }

        // option-keyed rounds (choice/quiz/multi/revote): tally selections per option + who picked it
        if (round.type === 'multi' || round.type === 'choice' || round.type === 'quiz' || round.type === 'choice_revote') {
            const tally = new Map<string, { c: number; who: string[] }>()
            for (const d of responses) {
                const ids = round.type === 'multi' ? d.optionIds ?? [] : d.optionId ? [d.optionId] : []
                for (const id of ids) {
                    const e = tally.get(id) ?? { c: 0, who: [] }
                    e.c++
                    pushWho(e.who, d.name)
                    tally.set(id, e)
                }
            }
            return [...tally.entries()]
                .sort((a, b) => b[1].c - a[1].c)
                .slice(0, n)
                .map(([id, e]) => ({ name: strip(String(labelOf(id))), sub: `×${e.c}`, who: e.who }))
        }
        // text / order — cluster by normalized text + who wrote it
        const tally = new Map<string, { text: string; n: number; who: string[] }>()
        for (const d of responses) {
            const t = (d.textValue ?? '').trim()
            if (!t) continue
            const k = t.toLowerCase().replace(/\s+/g, ' ')
            const e = tally.get(k) ?? { text: t, n: 0, who: [] }
            e.n++
            pushWho(e.who, d.name)
            tally.set(k, e)
        }
        return [...tally.values()]
            .sort((a, b) => b.n - a.n)
            .slice(0, n)
            .map((e) => ({ name: e.text, sub: `×${e.n}`, who: e.who }))
    }

    /** Demo/rehearsal: insert fake responses for the round's current phase. */
    private static async seedFakeResponses(roomId: mongoose.Types.ObjectId, round: IWorkshopRound): Promise<void> {
        await dbConnect()
        // fake participants join the roster too — counters stay consistent (8/8, not 8/0)
        await WorkshopParticipant.bulkWrite(
            FAKE_NAMES.map((name, i) => ({
                updateOne: {
                    filter: { roomId, clientId: `fake-${i}` },
                    update: { $set: { name, lastSeenAt: new Date() }, $setOnInsert: { joinedAt: new Date() } },
                    upsert: true,
                },
            }))
        )
        const phase = round.phase === 'revote' ? 'revote' : 'open'
        const { minNumber = 0, maxNumber = 100 } = round.config ?? {}
        const ops = FAKE_NAMES.map((name, i) => {
            const set: Record<string, unknown> = { name }
            if (round.type === 'text') {
                set.textValue = FAKE_TEXTS[i % FAKE_TEXTS.length]
            } else if (round.type === 'multi') {
                // pick a rotating subset (1..min(3,N)) of the options
                const ids = round.options.map((o) => o.id)
                const take = 1 + (i % Math.min(3, Math.max(ids.length, 1)))
                set.optionIds = [...ids.slice(i % Math.max(ids.length, 1)), ...ids].slice(0, take)
            } else if (round.type === 'number') {
                set.numberValue = minNumber + ((i * 7919) % (maxNumber - minNumber + 1))
            } else if (round.type === 'order') {
                // a rotated permutation of the option ids per fake participant
                const ids = round.options.map((o) => o.id)
                const rot = i % Math.max(ids.length, 1)
                set.textValue = [...ids.slice(rot), ...ids.slice(0, rot)].join(',')
            } else {
                set.optionId = round.options[(i * 31) % Math.max(round.options.length, 1)]?.id
            }
            return {
                updateOne: {
                    filter: { roomId, roundKey: round.key, phase, clientId: `fake-${i}` },
                    update: { $set: set, $setOnInsert: { createdAt: new Date() } },
                    upsert: true,
                },
            }
        })
        await WorkshopResponse.bulkWrite(ops)
        this.bustResultsCache(roomId, round.key)
    }

    static async generateQR(url: string): Promise<string> {
        return QRCode.toDataURL(url, {
            width: 640,
            margin: 1,
            errorCorrectionLevel: 'M',
            color: { dark: '#5B21B6', light: '#FFFFFF' },
        })
    }

    static getHostStateRound(room: IWorkshopRoom): StudentRound | null {
        return this.sanitizeRound(room, true)
    }
}

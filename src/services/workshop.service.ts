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
} from '@/types/workshop.types'

// Resolved (all-strings) shape of a template round after resolveDeep flattens every L.
interface ResolvedTemplateRound {
    key: string
    type: IWorkshopRound['type']
    prompt: string
    options?: { id: string; label: string; src?: string }[]
    correctOptionId?: string
    durationSec?: number
    hostNotes?: string
    showsHeroPhoto?: boolean
    reasons?: { id: string; label: string }[]
    config?: { minNumber?: number; maxNumber?: number; fields?: string[] }
    content?: TeachContent
    script?: RoundScript
}

// Perf: the per-round tally is identical for all pollers within a phase. Cache it
// briefly so 30 students polling don't each re-run the same aggregation every 2s.
const RESULTS_TTL_MS = 1500
const resultsCache = new Map<string, { value: RoundResults | null; exp: number }>()

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
                phase: 'closed' as const,
                durationSec,
                hostNotes: r.hostNotes,
                ...(r.showsHeroPhoto ? { showsHeroPhoto: true } : {}),
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
        else if (r.type === 'text') set.textValue = value as string
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
        const clean = (name ?? '').trim()
        if (filter && (clean.length < 1 || isBlockedName(clean))) return { ok: false, reason: 'name' }

        const existing = await WorkshopParticipant.findOne({ roomId, clientId }).lean<{ _id: unknown }>()
        if (!existing && max > 0) {
            const count = await WorkshopParticipant.countDocuments({ roomId })
            if (count >= max) return { ok: false, reason: 'full' }
        }
        await WorkshopParticipant.findOneAndUpdate(
            { roomId, clientId },
            { $set: { name: clean || name, lastSeenAt: new Date() }, $setOnInsert: { joinedAt: new Date() } },
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
            ...(forHost && r.hostNotes ? { hostNotes: r.hostNotes } : {}),
            ...(forHost && r.script ? { script: r.script } : {}),
            ...(r.phaseStartedAt ? { phaseStartedAt: r.phaseStartedAt.toISOString() } : {}),
            ...(typeof r.durationSec === 'number' ? { durationSec: r.durationSec } : {}),
            ...(r.content ? { content: r.content } : {}),
            ...(r.showsHeroPhoto ? { showsHeroPhoto: true } : {}),
            ...(r.reasons && r.reasons.length ? { reasons: r.reasons.map((x) => ({ id: x.id, label: x.label })) } : {}),
            index: idx,
            total: room.rounds.length,
        }
    }

    /** Pinned response content for projector display (one extra query only when set). */
    static async getPinned(room: IWorkshopRoom): Promise<{ name: string; textValue: string } | null> {
        const idx = room.currentRoundIndex
        const r = idx >= 0 ? room.rounds[idx] : null
        if (!r?.pinnedResponseId || !mongoose.Types.ObjectId.isValid(r.pinnedResponseId)) return null
        await dbConnect()
        const doc = await WorkshopResponse.findById(r.pinnedResponseId).lean<IWorkshopResponse>()
        if (!doc) return null
        return { name: doc.name, textValue: doc.textValue ?? '' }
    }

    /** Timer expiry: true when an open/revote phase ran out of durationSec. */
    private static isPhaseExpired(r: IWorkshopRound): boolean {
        if (!r.durationSec || !r.phaseStartedAt) return false
        if (r.phase !== 'open' && r.phase !== 'revote') return false
        return Date.now() > r.phaseStartedAt.getTime() + r.durationSec * 1000
    }

    /** F3: when revealing a photo-vote round (options carry images), record the winner. */
    private static async stampSelectedPhoto(doc: IWorkshopRoom, round: IWorkshopRound): Promise<void> {
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
                    textValue: resp.textValue,
                    numberValue: resp.numberValue,
                }
            }
        }
        if (round) {
            round.pinned = await this.getPinned(room)
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
        textValue?: string
        numberValue?: number
    }): Promise<{ ok: true } | { ok: false; reason: 'closed' | 'invalid' }> {
        await dbConnect()
        const { room, clientId, roundKey } = params
        const idx = room.currentRoundIndex
        const round = idx >= 0 ? room.rounds[idx] : null
        if (!round || round.key !== roundKey) return { ok: false, reason: 'closed' }

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
        const value = await this.computeResults(room)
        resultsCache.set(key, { value, exp: now + RESULTS_TTL_MS })
        if (resultsCache.size > 300) {
            for (const [k, v] of resultsCache) if (v.exp <= now) resultsCache.delete(k)
        }
        return value
    }

    /** Drop cached tallies for a round (all phases) — call after a (re)answer. */
    private static bustResultsCache(roomId: mongoose.Types.ObjectId, roundKey: string): void {
        const prefix = `${roomId}:${roundKey}:`
        for (const k of resultsCache.keys()) if (k.startsWith(prefix)) resultsCache.delete(k)
    }

    private static async computeResults(room: IWorkshopRoom): Promise<RoundResults | null> {
        await dbConnect()
        const idx = room.currentRoundIndex
        const round = idx >= 0 ? room.rounds[idx] : null
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
        targetClientId?: string
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
                if (!round) return { ok: false, message: 'No active round' }
                if (!responseId) return { ok: false, message: 'responseId required' }
                round.pinnedResponseId = responseId
                break
            }
            case 'unpin': {
                if (!round) return { ok: false, message: 'No active round' }
                round.pinnedResponseId = undefined
                break
            }
            case 'kickParticipant': {
                const allowKick = doc.settings?.allowKick ?? DEFAULT_ROOM_SETTINGS.allowKick
                if (!allowKick) return { ok: false, message: 'Kick disabled' }
                if (!targetClientId) return { ok: false, message: 'targetClientId required' }
                await this.kickParticipant(doc._id, targetClientId)
                return { ok: true } // no round mutation — already persisted
            }
            default:
                return { ok: false, message: 'Unknown action' }
        }
        doc.markModified('rounds')
        await doc.save()
        return { ok: true }
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
            } else if (round.type === 'number') {
                set.numberValue = minNumber + ((i * 7919) % (maxNumber - minNumber + 1))
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

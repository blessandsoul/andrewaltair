import crypto from 'crypto'
import * as QRCode from 'qrcode'
import mongoose from 'mongoose'
import dbConnect from '@/lib/db'
import WorkshopRoom, { type IWorkshopRoom, type IWorkshopRound } from '@/models/WorkshopRoom'
import WorkshopParticipant from '@/models/WorkshopParticipant'
import WorkshopResponse, { type IWorkshopResponse } from '@/models/WorkshopResponse'
import { WORKSHOP_TEMPLATES, isWorkshopTemplateId } from '@/data/workshop-templates'
import type { HostAction, RoundResults, StudentRound, StudentState, RosterEntry } from '@/types/workshop.types'

// Unambiguous alphabet — no 0/O/1/I/L
const CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
const CODE_LENGTH = 5
const ONLINE_WINDOW_MS = 10_000
const TEXT_WALL_LIMIT = 100

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
    static generateCode(): string {
        const bytes = crypto.randomBytes(CODE_LENGTH)
        let code = ''
        for (let i = 0; i < CODE_LENGTH; i++) {
            code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length]
        }
        return code
    }

    static async createRoomFromTemplate(templateId: string): Promise<IWorkshopRoom> {
        await dbConnect()
        if (!isWorkshopTemplateId(templateId)) {
            throw new Error('Unknown template')
        }
        const template = WORKSHOP_TEMPLATES[templateId]
        const rounds = template.rounds.map((r) => ({
            key: r.key,
            type: r.type,
            prompt: r.prompt,
            options: (r.options ?? []).map((o) => ({ id: o.id, label: o.label })),
            correctOptionId: r.correctOptionId,
            phase: 'closed' as const,
            durationSec: r.durationSec,
            hostNotes: r.hostNotes,
            config: { ...(r.config ?? {}) },
        }))

        for (let attempt = 0; attempt < 5; attempt++) {
            try {
                return await WorkshopRoom.create({
                    code: this.generateCode(),
                    hostKey: crypto.randomBytes(12).toString('hex'),
                    title: template.title,
                    templateId,
                    status: 'lobby',
                    rounds,
                    currentRoundIndex: -1,
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

    static async getRoomByHostKey(hostKey: string): Promise<IWorkshopRoom | null> {
        await dbConnect()
        return WorkshopRoom.findOne({ hostKey }).lean<IWorkshopRoom>()
    }

    static async listRecentRooms(limit = 10): Promise<IWorkshopRoom[]> {
        await dbConnect()
        return WorkshopRoom.find({}).sort({ createdAt: -1 }).limit(limit).lean<IWorkshopRoom[]>()
    }

    static async joinRoom(roomId: mongoose.Types.ObjectId, name: string, clientId: string): Promise<void> {
        await dbConnect()
        await WorkshopParticipant.findOneAndUpdate(
            { roomId, clientId },
            { $set: { name, lastSeenAt: new Date() }, $setOnInsert: { joinedAt: new Date() } },
            { upsert: true }
        )
    }

    static async touchParticipant(roomId: mongoose.Types.ObjectId, clientId: string): Promise<void> {
        await dbConnect()
        await WorkshopParticipant.updateOne({ roomId, clientId }, { $set: { lastSeenAt: new Date() } })
    }

    private static sanitizeRound(room: IWorkshopRoom, forHost: boolean): StudentRound | null {
        const idx = room.currentRoundIndex
        if (idx < 0 || idx >= room.rounds.length) return null
        const r = room.rounds[idx]
        const revealCorrect = forHost || r.phase === 'revealed'
        return {
            key: r.key,
            type: r.type,
            prompt: r.prompt,
            options: r.options.map((o) => ({ id: o.id, label: o.label })),
            phase: r.phase,
            config: r.config ?? {},
            ...(revealCorrect && r.correctOptionId ? { correctOptionId: r.correctOptionId } : {}),
            ...(forHost && r.hostNotes ? { hostNotes: r.hostNotes } : {}),
            ...(r.phaseStartedAt ? { phaseStartedAt: r.phaseStartedAt.toISOString() } : {}),
            ...(typeof r.durationSec === 'number' ? { durationSec: r.durationSec } : {}),
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

    /**
     * Auto-advance on expiry (called from poll GETs — no cron needed):
     * choice_revote open→discuss; other types just stop accepting (submit guard).
     */
    static async maybeAutoAdvance(room: IWorkshopRoom): Promise<IWorkshopRoom> {
        const idx = room.currentRoundIndex
        const r = idx >= 0 ? room.rounds[idx] : null
        if (!r || !this.isPhaseExpired(r)) return room
        if (r.type === 'choice_revote' && r.phase === 'open') {
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
        return room
    }

    static async getStudentState(room: IWorkshopRoom, clientId: string | null): Promise<StudentState> {
        await dbConnect()
        const round = this.sanitizeRound(room, false)
        const participantCount = await WorkshopParticipant.countDocuments({ roomId: room._id })

        let myAnswer: StudentState['myAnswer'] = null
        if (clientId && round) {
            const phase = round.phase === 'revote' ? 'revote' : 'open'
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
        return {
            status: room.status,
            title: room.title,
            participantCount,
            round,
            myAnswer,
            serverNow: new Date().toISOString(),
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
        if (round.phase !== 'open' && round.phase !== 'revote') return { ok: false, reason: 'closed' }
        if (this.isPhaseExpired(round)) return { ok: false, reason: 'closed' }

        const phase = round.phase === 'revote' ? 'revote' : 'open'
        const set: Partial<IWorkshopResponse> = {}

        if (round.type === 'text') {
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
        return { ok: true }
    }

    static async getResults(room: IWorkshopRoom): Promise<RoundResults | null> {
        await dbConnect()
        const idx = room.currentRoundIndex
        const round = idx >= 0 ? room.rounds[idx] : null
        if (!round) return null

        if (round.type === 'text') {
            const items = await WorkshopResponse.find({ roomId: room._id, roundKey: round.key, phase: 'open' })
                .sort({ createdAt: -1 })
                .limit(TEXT_WALL_LIMIT)
                .lean<IWorkshopResponse[]>()
            return {
                type: 'text',
                items: items.map((i) => ({
                    id: String(i._id),
                    name: i.name,
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

            // Shift score: per-client join of phase-1 vs phase-2 votes — how many MOVED
            const moved = await WorkshopResponse.aggregate([
                { $match: { roomId: room._id, roundKey: round.key } },
                { $group: { _id: '$clientId', votes: { $push: { phase: '$phase', optionId: '$optionId' } } } },
                {
                    $project: {
                        open: { $first: { $filter: { input: '$votes', cond: { $eq: ['$$this.phase', 'open'] } } } },
                        revote: { $first: { $filter: { input: '$votes', cond: { $eq: ['$$this.phase', 'revote'] } } } },
                    },
                },
                { $match: { open: { $ne: null }, revote: { $ne: null } } },
                { $match: { $expr: { $ne: ['$open.optionId', '$revote.optionId'] } } },
                { $count: 'moved' },
            ])

            return {
                type: 'choice_revote',
                options,
                totalOpen: options.reduce((s, o) => s + o.open, 0),
                totalRevote: options.reduce((s, o) => s + o.revote, 0),
                movedCount: (moved[0]?.moved as number | undefined) ?? 0,
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

    static async getRoster(roomId: mongoose.Types.ObjectId): Promise<RosterEntry[]> {
        await dbConnect()
        const parts = await WorkshopParticipant.find({ roomId })
            .sort({ joinedAt: 1 })
            .lean<{ name: string; joinedAt: Date; lastSeenAt: Date }[]>()
        const now = Date.now()
        return parts.map((p) => ({
            name: p.name,
            joinedAt: p.joinedAt.toISOString(),
            online: now - new Date(p.lastSeenAt).getTime() < ONLINE_WINDOW_MS,
        }))
    }

    static async hostAdvance(
        room: IWorkshopRoom,
        action: HostAction,
        responseId?: string
    ): Promise<{ ok: boolean; message?: string }> {
        await dbConnect()
        const doc = await WorkshopRoom.findById(room._id)
        if (!doc) return { ok: false, message: 'Room not found' }

        const idx = doc.currentRoundIndex
        const round: IWorkshopRound | null = idx >= 0 && idx < doc.rounds.length ? doc.rounds[idx] : null
        const stamp = (r: IWorkshopRound) => {
            r.phaseStartedAt = new Date()
        }

        switch (action) {
            case 'openRound': {
                // From lobby (or after reveal): open the NEXT closed round, or re-open current closed one
                if (round && round.phase === 'closed') {
                    round.phase = 'open'
                    stamp(round)
                } else {
                    const nextIdx = idx + 1
                    if (nextIdx >= doc.rounds.length) return { ok: false, message: 'No more rounds' }
                    doc.currentRoundIndex = nextIdx
                    doc.rounds[nextIdx].phase = 'open'
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
                stamp(round)
                break
            }
            case 'nextRound': {
                const nextIdx = idx + 1
                if (nextIdx >= doc.rounds.length) return { ok: false, message: 'No more rounds' }
                doc.currentRoundIndex = nextIdx
                doc.rounds[nextIdx].phase = 'open'
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

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import type mongoose from 'mongoose'

// --- Mocks ---

vi.mock('@/lib/db', () => ({
    default: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/models/WorkshopRoom', () => ({
    default: { findById: vi.fn() },
    DEFAULT_ROOM_SETTINGS: { anonymousNames: false, textWallLimit: 50 },
}))

vi.mock('@/models/WorkshopParticipant', () => ({
    default: { find: vi.fn() },
}))

vi.mock('@/models/WorkshopResponse', () => ({
    default: {},
}))

vi.mock('@/models/WorkshopMessage', () => ({
    default: { find: vi.fn(), findOne: vi.fn() },
}))

// Chainable query builder: mirrors Mongoose's fluent .sort().limit().select().lean() shape.
function createChainableQuery(resolvedValue: unknown) {
    const chain: Record<string, ReturnType<typeof vi.fn>> = {}
    chain.sort = vi.fn().mockReturnValue(chain)
    chain.limit = vi.fn().mockReturnValue(chain)
    chain.select = vi.fn().mockReturnValue(chain)
    chain.lean = vi.fn().mockResolvedValue(resolvedValue)
    return chain
}

import { WorkshopService } from '@/services/workshop.service'
import WorkshopMessage from '@/models/WorkshopMessage'
import WorkshopParticipant from '@/models/WorkshopParticipant'
import WorkshopRoom from '@/models/WorkshopRoom'

const msgFind = WorkshopMessage.find as unknown as Mock
const msgFindOne = WorkshopMessage.findOne as unknown as Mock
const partFind = WorkshopParticipant.find as unknown as Mock
const roomFindById = WorkshopRoom.findById as unknown as Mock

const ROOM_ID = 'room-1' as unknown as mongoose.Types.ObjectId

function blankChatMessage(clientId: string) {
    return {
        _id: 'm1',
        clientId,
        name: '', // stored blank: the participant row was missing at post time
        kind: 'chat',
        text: 'hello',
        status: 'live',
        votes: 0,
        createdAt: new Date('2026-06-22T10:00:00Z'),
    }
}

// --- Tests ---

describe('WorkshopService.getLiveMessages chat name resolution', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        msgFind.mockReturnValue(createChainableQuery([blankChatMessage('c1')]))
        msgFindOne.mockReturnValue(createChainableQuery(null))
    })

    it('resolves a blank stored name from the current roster when anonymousNames is off', async () => {
        roomFindById.mockReturnValue(createChainableQuery({ settings: { anonymousNames: false } }))
        partFind.mockReturnValue(createChainableQuery([{ clientId: 'c1', name: 'gela' }]))

        const { messages } = await WorkshopService.getLiveMessages(ROOM_ID)

        expect(messages).toHaveLength(1)
        expect(messages[0]?.name).toBe('gela')
    })

    it('falls back to the Guest label when the sender has no participant row', async () => {
        roomFindById.mockReturnValue(createChainableQuery({ settings: { anonymousNames: false } }))
        partFind.mockReturnValue(createChainableQuery([]))

        const { messages } = await WorkshopService.getLiveMessages(ROOM_ID)

        expect(messages[0]?.name).toBe('სტუმარი')
    })

    it('leaves the name blank in anonymous mode (the UI shows the anonymous label)', async () => {
        roomFindById.mockReturnValue(createChainableQuery({ settings: { anonymousNames: true } }))
        partFind.mockReturnValue(createChainableQuery([{ clientId: 'c1', name: 'gela' }]))

        const { messages } = await WorkshopService.getLiveMessages(ROOM_ID)

        expect(messages[0]?.name).toBe('')
        expect(partFind).not.toHaveBeenCalled() // anon short-circuits before the roster query
    })

    it('does not query the room or roster when every message already has a name', async () => {
        msgFind.mockReturnValue(
            createChainableQuery([{ ...blankChatMessage('c1'), name: 'mari' }]),
        )

        const { messages } = await WorkshopService.getLiveMessages(ROOM_ID)

        expect(messages[0]?.name).toBe('mari')
        expect(roomFindById).not.toHaveBeenCalled()
        expect(partFind).not.toHaveBeenCalled()
    })
})

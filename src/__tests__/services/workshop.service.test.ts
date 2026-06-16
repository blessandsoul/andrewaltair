import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

// --- Mocks ---

vi.mock('@/lib/db', () => ({
    default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/models/WorkshopRoom', () => ({
    default: {},
    DEFAULT_ROOM_SETTINGS: { anonymousNames: false, textWallLimit: 50 },
}));

vi.mock('@/models/WorkshopParticipant', () => ({
    default: { countDocuments: vi.fn() },
}));

vi.mock('@/models/WorkshopResponse', () => ({
    default: { find: vi.fn(), aggregate: vi.fn() },
}));

// Chainable query builder: mirrors Mongoose's .sort().limit().lean() fluent shape.
function createChainableQuery(resolvedValue: unknown) {
    const chain: Record<string, ReturnType<typeof vi.fn>> = {};
    chain.sort = vi.fn().mockReturnValue(chain);
    chain.skip = vi.fn().mockReturnValue(chain);
    chain.limit = vi.fn().mockReturnValue(chain);
    chain.select = vi.fn().mockReturnValue(chain);
    chain.lean = vi.fn().mockResolvedValue(resolvedValue);
    return chain;
}

import { WorkshopService } from '@/services/workshop.service';
import type { IWorkshopRoom } from '@/models/WorkshopRoom';
import WorkshopResponse from '@/models/WorkshopResponse';
import WorkshopParticipant from '@/models/WorkshopParticipant';

const ANON_LABEL = 'ანონიმი';

const findMock = WorkshopResponse.find as unknown as Mock;
const aggregateMock = WorkshopResponse.aggregate as unknown as Mock;
const countMock = WorkshopParticipant.countDocuments as unknown as Mock;

// --- Fixtures ---

// One find-the-mistake round: o1 + o3 are the planted mistakes (correct picks), o2 is a trap.
const MULTI_ROUND = {
    key: 'r6',
    type: 'multi',
    prompt: 'find the planted mistakes',
    options: [
        { id: 'o1', label: 'opt1' },
        { id: 'o2', label: 'opt2' },
        { id: 'o3', label: 'opt3' },
    ],
    correctOptionIds: ['o1', 'o3'],
};

// Answer-order matters: Дато found first, so responders must keep createdAt-ascending order.
const MULTI_DOCS = [
    {
        _id: 'd1',
        clientId: 'c1',
        name: 'დათო',
        optionIds: ['o1', 'o3'],
        roundKey: 'r6',
        phase: 'open',
        createdAt: new Date('2026-06-16T10:00:00Z'),
    },
    {
        _id: 'd2',
        clientId: 'c2',
        name: 'ნინო',
        optionIds: ['o2'],
        roundKey: 'r6',
        phase: 'open',
        createdAt: new Date('2026-06-16T10:00:05Z'),
    },
];

function makeRoom(anonymousNames: boolean): IWorkshopRoom {
    return {
        _id: 'room-1',
        currentRoundIndex: 0,
        status: 'live',
        rounds: [MULTI_ROUND],
        settings: { anonymousNames },
    } as unknown as IWorkshopRoom;
}

// --- Tests ---

describe('WorkshopService find-the-mistake (multi) per-name answers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        aggregateMock.mockResolvedValue([]);
        countMock.mockResolvedValue(2);
        // Route each WorkshopResponse.find by its query shape:
        // textValue → write-ins (none), roundKey → responders, else → cross-round grid.
        findMock.mockImplementation((query: unknown) => {
            const q = query as Record<string, unknown>;
            if (q.textValue) return createChainableQuery([]);
            if (q.roundKey) return createChainableQuery(MULTI_DOCS);
            return createChainableQuery(MULTI_DOCS);
        });
    });

    it('should expose per-name responders with correct flags when results computed for a multi round', async () => {
        const room = makeRoom(false);

        const history = await WorkshopService.getRoomHistory(room);

        const results = history.rounds[0]?.results;
        const responders = results && results.type === 'multi' ? results.responders : undefined;
        expect(responders).toHaveLength(2);
        expect(responders?.[0]).toEqual({
            name: 'დათო',
            picks: [
                { label: 'opt1', correct: true },
                { label: 'opt3', correct: true },
            ],
        });
        expect(responders?.[1]).toEqual({
            name: 'ნინო',
            picks: [{ label: 'opt2', correct: false }],
        });
    });

    it('should anonymize responder names when anonymousNames is enabled', async () => {
        const room = makeRoom(true);

        const history = await WorkshopService.getRoomHistory(room);

        const results = history.rounds[0]?.results;
        const responders = results && results.type === 'multi' ? results.responders : undefined;
        expect(responders?.[0]?.name).toBe(`${ANON_LABEL} 1`);
        expect(responders?.[1]?.name).toBe(`${ANON_LABEL} 2`);
    });

    it('should resolve a multi answer to joined option labels in the per-participant grid', async () => {
        const room = makeRoom(false);

        const history = await WorkshopService.getRoomHistory(room);

        const dato = history.participants.find((p) => p.clientId === 'c1');
        expect(dato?.answers?.[0]?.value).toBe('opt1, opt3');
    });
});

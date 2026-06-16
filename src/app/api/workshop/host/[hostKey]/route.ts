import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { WorkshopService } from '@/services/workshop.service'
import type { HostState, SpotlightPanel } from '@/types/workshop.types'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ hostKey: string }> }
) {
    try {
        const { hostKey } = await params
        let room = await WorkshopService.getRoomByHostKey(hostKey)
        if (!room) {
            return apiError(ERROR_CODES.WORKSHOP_FORBIDDEN, 'Invalid host key', 403)
        }
        room = await WorkshopService.maybeAutoAdvance(room)
        await WorkshopService.maybeDripDemo(room) // demo rooms: one answer trickles in per poll

        const [results, roster, responsesCount, pinned] = await Promise.all([
            WorkshopService.getResults(room),
            WorkshopService.getRoster(room._id, {
                anonymous: room.settings?.anonymousNames,
                onlineWindowMs: (room.settings?.onlineWindowSec ?? 10) * 1000,
            }),
            WorkshopService.getResponsesCount(room),
            WorkshopService.getPinned(room),
        ])

        const round = WorkshopService.getHostStateRound(room)
        if (round) round.pinned = pinned

        const gamified = room.settings?.gamification ?? true
        const [scores, fastest] = gamified
            ? await Promise.all([WorkshopService.getScores(room), WorkshopService.getFastest(room)])
            : [null, []]

        const state: HostState = {
            code: room.code,
            title: room.title,
            status: room.status,
            currentRoundIndex: room.currentRoundIndex,
            roundsTotal: room.rounds.length,
            round,
            results,
            roster,
            participantCount: roster.length,
            responsesCount,
            selectedPhoto: room.selectedPhoto ?? null,
            serverNow: new Date().toISOString(),
            settings: WorkshopService.pickClientSettings(room),
            ...WorkshopService.questionStateFor(room), // round 28 Q&A (t_close only)
            ...(gamified
                ? {
                      leaderboard: scores!.leaderboard,
                      teams: scores!.teams,
                      reactions: WorkshopService.getRecentReactions(room._id),
                      progress: WorkshopService.progressOf(room),
                      spotlightName: room.spotlightName ?? null,
                      spotlightAt: room.spotlightAt ?? null,
                      spotlightPanel: (room.spotlightPanel ?? null) as SpotlightPanel | null,
                      fastest,
                  }
                : {}),
        }

        // QR fetched once by the display client on mount (?qr=1), not on every 2s poll
        if (request.nextUrl.searchParams.get('qr') === '1') {
            const joinUrl = `${BASE_URL}/workshop/${room.code}`
            state.joinUrl = joinUrl
            state.qrDataUrl = await WorkshopService.generateQR(joinUrl)
        }

        return apiSuccess(state)
    } catch {
        return apiError(ERROR_CODES.WORKSHOP_FETCH_FAILED, 'Failed to fetch host state', 500)
    }
}

// @vitest-environment node
// LiveKit AccessToken.toJwt() signs via jose/crypto.subtle, which needs Node's WebCrypto,
// not jsdom's. Run this file in the node environment so real token minting works.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import jwt from 'jsonwebtoken'
import QRCode from 'qrcode'

// next/server -> apiSuccess/apiError return a plain { body, status } (same shape as api-response.test.ts)
vi.mock('next/server', () => ({
    NextResponse: { json: vi.fn((body, options) => ({ body, status: options?.status || 200 })) },
}))

// WorkshopService: hoisted mock fns, controlled per test (DB never touched)
const svc = vi.hoisted(() => ({
    getRoomByHostKey: vi.fn(),
    getRoomByCode: vi.fn(),
    isSpeaker: vi.fn(),
    setBroadcast: vi.fn(),
    setBroadcastByCode: vi.fn(),
    startRecording: vi.fn(),
    stopRecording: vi.fn(),
    getBroadcastRecap: vi.fn(),
}))
vi.mock('@/services/workshop.service', () => ({ WorkshopService: svc }))

// livekit: keep the REAL token minting, override only receiveWebhook (so we can inject events)
const recv = vi.hoisted(() => vi.fn())
vi.mock('@/lib/livekit', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/lib/livekit')>()
    return { ...actual, receiveWebhook: recv }
})

// rate-limit: controllable check (resolve = allowed, reject = limited)
const limiterCheck = vi.hoisted(() => vi.fn())
vi.mock('@/lib/rate-limit', () => ({ rateLimit: () => ({ check: limiterCheck }) }))

import { createPublisherToken, createViewerToken } from '@/lib/livekit'
import { POST as broadcastToken } from '@/app/api/workshop/host/[hostKey]/broadcast-token/route'
import { POST as phoneToken } from '@/app/api/workshop/host/[hostKey]/phone-token/route'
import { POST as watchToken } from '@/app/api/workshop/rooms/[code]/watch-token/route'
import { POST as webhook } from '@/app/api/workshop/livekit-webhook/route'
import { PATCH as control } from '@/app/api/workshop/host/[hostKey]/control/route'
import { GET as broadcastRecap } from '@/app/api/workshop/host/[hostKey]/broadcast-recap/route'

type Decoded = { sub?: string; exp?: number; video?: { room?: string; roomJoin?: boolean; canPublish?: boolean; canSubscribe?: boolean; canPublishData?: boolean } }
type Res = {
    status: number
    body: {
        data?: { url?: string; token?: string; speaker?: boolean; seconds?: number; transcript?: unknown[] }
        error?: { code: string; message: string }
    }
}
const grant = (t?: string) => jwt.decode(t ?? '') as Decoded
// route handlers are typed as returning NextResponse; at runtime our mock returns { body, status }
const res = (p: Promise<unknown>) => p as unknown as Promise<Res>
const params = <T,>(p: T) => ({ params: Promise.resolve(p) })
const liveRoom = { _id: 'rid1', code: 'ABCD', status: 'live', recordingEgressId: null }

beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('LIVEKIT_URL', 'wss://livekit.test')
    vi.stubEnv('LIVEKIT_API_KEY', 'APItestkey')
    vi.stubEnv('LIVEKIT_API_SECRET', 'strong-test-secret-not-weak-0123456789abcd')
    limiterCheck.mockResolvedValue(undefined)
})
afterEach(() => vi.unstubAllEnvs())

// ---- A. Token grants, direct (one-way lock + identities) ----
describe('A. token grants', () => {
    it('host publisher: canPublish true', async () => expect(grant(await createPublisherToken('ABCD', 'host')).video?.canPublish).toBe(true))
    it('host publisher: canSubscribe true', async () => expect(grant(await createPublisherToken('ABCD', 'host')).video?.canSubscribe).toBe(true))
    it('host publisher: canPublishData false', async () => expect(grant(await createPublisherToken('ABCD', 'host')).video?.canPublishData).toBe(false))
    it('host publisher: roomJoin true', async () => expect(grant(await createPublisherToken('ABCD', 'host')).video?.roomJoin).toBe(true))
    it('host publisher: room === code', async () => expect(grant(await createPublisherToken('ABCD', 'host')).video?.room).toBe('ABCD'))
    it('host publisher: identity (sub) === host', async () => expect(grant(await createPublisherToken('ABCD', 'host')).sub).toBe('host'))
    it('phone-cam publisher: identity === phone-cam', async () => expect(grant(await createPublisherToken('ABCD', 'phone-cam')).sub).toBe('phone-cam'))
    it('phone-cam publisher: can publish a camera', async () => expect(grant(await createPublisherToken('ABCD', 'phone-cam')).video?.canPublish).toBe(true))
    it('phone-cam publisher: room scoped to code', async () => expect(grant(await createPublisherToken('ZZZZ', 'phone-cam')).video?.room).toBe('ZZZZ'))
    it('viewer: canPublish FALSE (one-way lock)', async () => expect(grant(await createViewerToken('ABCD', 'client-12345')).video?.canPublish).toBe(false))
    it('viewer: canSubscribe true', async () => expect(grant(await createViewerToken('ABCD', 'client-12345')).video?.canSubscribe).toBe(true))
    it('viewer: identity === clientId', async () => expect(grant(await createViewerToken('ABCD', 'client-12345')).sub).toBe('client-12345'))
    it('token expires ~3h ahead', async () => {
        const d = grant(await createPublisherToken('ABCD', 'host'))
        const now = Math.floor(Date.now() / 1000)
        expect(d.exp!).toBeGreaterThan(now + 2 * 3600)
        expect(d.exp!).toBeLessThan(now + 4 * 3600)
    })
    it('throws when LiveKit env is missing', async () => {
        vi.stubEnv('LIVEKIT_API_SECRET', '')
        await expect(createPublisherToken('ABCD', 'host')).rejects.toThrow(/LiveKit not configured/)
    })
})

// ---- B. broadcast-token route (desktop host) ----
describe('B. broadcast-token route', () => {
    it('valid hostKey -> 200 with url + token', async () => {
        svc.getRoomByHostKey.mockResolvedValue(liveRoom)
        const r = await res(broadcastToken(null as never, params({ hostKey: 'hk1' })))
        expect(r.status).toBe(200)
        expect(r.body.data?.url).toBeTruthy()
        expect(r.body.data?.token).toBeTruthy()
    })
    it('token identity is host + canPublish', async () => {
        svc.getRoomByHostKey.mockResolvedValue(liveRoom)
        const r = await res(broadcastToken(null as never, params({ hostKey: 'hk1' })))
        const g = grant(r.body.data?.token)
        expect(g.sub).toBe('host')
        expect(g.video?.canPublish).toBe(true)
    })
    it('token room === room.code', async () => {
        svc.getRoomByHostKey.mockResolvedValue(liveRoom)
        const r = await res(broadcastToken(null as never, params({ hostKey: 'hk1' })))
        expect(grant(r.body.data?.token).video?.room).toBe('ABCD')
    })
    it('unknown hostKey -> 403 WORKSHOP_FORBIDDEN', async () => {
        svc.getRoomByHostKey.mockResolvedValue(null)
        const r = await res(broadcastToken(null as never, params({ hostKey: 'nope' })))
        expect(r.status).toBe(403)
        expect(r.body.error?.code).toBe('WORKSHOP_FORBIDDEN')
    })
    it('ended room -> 410 WORKSHOP_ENDED', async () => {
        svc.getRoomByHostKey.mockResolvedValue({ ...liveRoom, status: 'ended' })
        const r = await res(broadcastToken(null as never, params({ hostKey: 'hk1' })))
        expect(r.status).toBe(410)
        expect(r.body.error?.code).toBe('WORKSHOP_ENDED')
    })
})

// ---- C. phone-token route (the new phone publisher) ----
describe('C. phone-token route', () => {
    it('valid hostKey -> 200 with url + token', async () => {
        svc.getRoomByHostKey.mockResolvedValue(liveRoom)
        const r = await res(phoneToken(null as never, params({ hostKey: 'hk1' })))
        expect(r.status).toBe(200)
        expect(r.body.data?.token).toBeTruthy()
    })
    it('token identity is phone-cam', async () => {
        svc.getRoomByHostKey.mockResolvedValue(liveRoom)
        const r = await res(phoneToken(null as never, params({ hostKey: 'hk1' })))
        expect(grant(r.body.data?.token).sub).toBe('phone-cam')
    })
    it('phone token canPublish true', async () => {
        svc.getRoomByHostKey.mockResolvedValue(liveRoom)
        const r = await res(phoneToken(null as never, params({ hostKey: 'hk1' })))
        expect(grant(r.body.data?.token).video?.canPublish).toBe(true)
    })
    it('phone identity is NOT host (eviction guard)', async () => {
        svc.getRoomByHostKey.mockResolvedValue(liveRoom)
        const r = await res(phoneToken(null as never, params({ hostKey: 'hk1' })))
        expect(grant(r.body.data?.token).sub).not.toBe('host')
    })
    it('unknown hostKey -> 403', async () => {
        svc.getRoomByHostKey.mockResolvedValue(null)
        const r = await res(phoneToken(null as never, params({ hostKey: 'nope' })))
        expect(r.status).toBe(403)
    })
    it('ended room -> 410', async () => {
        svc.getRoomByHostKey.mockResolvedValue({ ...liveRoom, status: 'ended' })
        const r = await res(phoneToken(null as never, params({ hostKey: 'hk1' })))
        expect(r.status).toBe(410)
    })
})

// ---- D. watch-token route (viewer / speaker) ----
const watchReq = (clientId: unknown) => ({ json: async () => ({ clientId }) }) as never
describe('D. watch-token route', () => {
    it('non-speaker -> speaker:false in body', async () => {
        svc.getRoomByCode.mockResolvedValue(liveRoom)
        svc.isSpeaker.mockResolvedValue(false)
        const r = await res(watchToken(watchReq('client-12345'), params({ code: 'ABCD' })))
        expect(r.body.data?.speaker).toBe(false)
    })
    it('non-speaker -> viewer token canPublish false', async () => {
        svc.getRoomByCode.mockResolvedValue(liveRoom)
        svc.isSpeaker.mockResolvedValue(false)
        const r = await res(watchToken(watchReq('client-12345'), params({ code: 'ABCD' })))
        expect(grant(r.body.data?.token).video?.canPublish).toBe(false)
    })
    it('approved speaker -> speaker:true', async () => {
        svc.getRoomByCode.mockResolvedValue(liveRoom)
        svc.isSpeaker.mockResolvedValue(true)
        const r = await res(watchToken(watchReq('client-12345'), params({ code: 'ABCD' })))
        expect(r.body.data?.speaker).toBe(true)
    })
    it('approved speaker -> publisher token canPublish true', async () => {
        svc.getRoomByCode.mockResolvedValue(liveRoom)
        svc.isSpeaker.mockResolvedValue(true)
        const r = await res(watchToken(watchReq('client-12345'), params({ code: 'ABCD' })))
        expect(grant(r.body.data?.token).video?.canPublish).toBe(true)
    })
    it('token identity === clientId', async () => {
        svc.getRoomByCode.mockResolvedValue(liveRoom)
        svc.isSpeaker.mockResolvedValue(false)
        const r = await res(watchToken(watchReq('client-99999'), params({ code: 'ABCD' })))
        expect(grant(r.body.data?.token).sub).toBe('client-99999')
    })
    it('unknown code -> 404 WORKSHOP_NOT_FOUND', async () => {
        svc.getRoomByCode.mockResolvedValue(null)
        const r = await res(watchToken(watchReq('client-12345'), params({ code: 'XXXX' })))
        expect(r.status).toBe(404)
        expect(r.body.error?.code).toBe('WORKSHOP_NOT_FOUND')
    })
    it('ended room -> 410', async () => {
        svc.getRoomByCode.mockResolvedValue({ ...liveRoom, status: 'ended' })
        const r = await res(watchToken(watchReq('client-12345'), params({ code: 'ABCD' })))
        expect(r.status).toBe(410)
    })
    it('clientId too short -> 400 VALIDATION_FAILED', async () => {
        svc.getRoomByCode.mockResolvedValue(liveRoom)
        const r = await res(watchToken(watchReq('short'), params({ code: 'ABCD' })))
        expect(r.status).toBe(400)
        expect(r.body.error?.code).toBe('VALIDATION_FAILED')
    })
    it('rate-limited -> 429 RATE_LIMITED', async () => {
        svc.getRoomByCode.mockResolvedValue(liveRoom)
        limiterCheck.mockRejectedValue(new Error('limit'))
        const r = await res(watchToken(watchReq('client-12345'), params({ code: 'ABCD' })))
        expect(r.status).toBe(429)
        expect(r.body.error?.code).toBe('RATE_LIMITED')
    })
})

// ---- E. livekit-webhook auto-stop scoping ----
const hookReq = () => ({ text: async () => 'raw', headers: { get: () => 'Bearer x' } }) as never
describe('E. livekit-webhook auto-stop', () => {
    it('host left -> flips broadcast off', async () => {
        recv.mockResolvedValue({ event: 'participant_left', participant: { identity: 'host' }, room: { name: 'ABCD' } })
        await webhook(hookReq())
        expect(svc.setBroadcastByCode).toHaveBeenCalledWith('ABCD', false)
    })
    it('phone-cam left -> flips broadcast off (the fix)', async () => {
        recv.mockResolvedValue({ event: 'participant_left', participant: { identity: 'phone-cam' }, room: { name: 'ABCD' } })
        await webhook(hookReq())
        expect(svc.setBroadcastByCode).toHaveBeenCalledWith('ABCD', false)
    })
    it('a student viewer leaving does NOT stop the broadcast', async () => {
        recv.mockResolvedValue({ event: 'participant_left', participant: { identity: 'client-12345' }, room: { name: 'ABCD' } })
        await webhook(hookReq())
        expect(svc.setBroadcastByCode).not.toHaveBeenCalled()
    })
    it('the projector leaving does NOT stop the broadcast', async () => {
        recv.mockResolvedValue({ event: 'participant_left', participant: { identity: 'projector' }, room: { name: 'ABCD' } })
        await webhook(hookReq())
        expect(svc.setBroadcastByCode).not.toHaveBeenCalled()
    })
    it('room_finished -> flips broadcast off', async () => {
        recv.mockResolvedValue({ event: 'room_finished', room: { name: 'ABCD' } })
        await webhook(hookReq())
        expect(svc.setBroadcastByCode).toHaveBeenCalledWith('ABCD', false)
    })
    it('no room name -> ignored', async () => {
        recv.mockResolvedValue({ event: 'participant_left', participant: { identity: 'host' } })
        await webhook(hookReq())
        expect(svc.setBroadcastByCode).not.toHaveBeenCalled()
    })
    it('bad signature -> 401', async () => {
        recv.mockRejectedValue(new Error('bad signature'))
        const r = await res(webhook(hookReq()))
        expect(r.status).toBe(401)
    })
})

// ---- F. control: broadcast + recording ----
const ctrlReq = (body: unknown) => ({ json: async () => body }) as never
describe('F. control setBroadcast + recording', () => {
    it('setBroadcast true -> service called with (roomId, true)', async () => {
        svc.getRoomByHostKey.mockResolvedValue(liveRoom)
        await control(ctrlReq({ action: 'setBroadcast', enabled: true }), params({ hostKey: 'hk1' }))
        expect(svc.setBroadcast).toHaveBeenCalledWith('rid1', true)
    })
    it('setBroadcast false -> service called with (roomId, false)', async () => {
        svc.getRoomByHostKey.mockResolvedValue(liveRoom)
        await control(ctrlReq({ action: 'setBroadcast', enabled: false }), params({ hostKey: 'hk1' }))
        expect(svc.setBroadcast).toHaveBeenCalledWith('rid1', false)
    })
    it('startRecording -> service.startRecording called', async () => {
        svc.getRoomByHostKey.mockResolvedValue(liveRoom)
        svc.startRecording.mockResolvedValue({ egressId: 'e1' })
        await control(ctrlReq({ action: 'startRecording' }), params({ hostKey: 'hk1' }))
        expect(svc.startRecording).toHaveBeenCalledTimes(1)
    })
    it('stopRecording -> service.stopRecording called', async () => {
        svc.getRoomByHostKey.mockResolvedValue(liveRoom)
        svc.stopRecording.mockResolvedValue({ ok: true })
        await control(ctrlReq({ action: 'stopRecording' }), params({ hostKey: 'hk1' }))
        expect(svc.stopRecording).toHaveBeenCalledTimes(1)
    })
})

// ---- G. QR generation (the lib + options the host route uses for the phone page) ----
const qrOpts = { width: 640, margin: 1, errorCorrectionLevel: 'M' as const, color: { dark: '#5B21B6', light: '#FFFFFF' } }
describe('G. QR generation', () => {
    it('produces a PNG data URL', async () => {
        const d = await QRCode.toDataURL('https://andrewaltair.ge/workshop/host/hk1/phone', qrOpts)
        expect(d).toMatch(/^data:image\/png;base64,/)
    })
    it('encodes the phone-page URL shape', async () => {
        const url = 'https://andrewaltair.ge/workshop/host/abc123/phone'
        expect(url).toMatch(/\/workshop\/host\/[^/]+\/phone$/)
        await expect(QRCode.toDataURL(url, qrOpts)).resolves.toContain('base64,')
    })
    it('different URLs yield different QR output', async () => {
        const a = await QRCode.toDataURL('https://andrewaltair.ge/workshop/host/a/phone', qrOpts)
        const b = await QRCode.toDataURL('https://andrewaltair.ge/workshop/host/b/phone', qrOpts)
        expect(a).not.toBe(b)
    })
})

// ---- H. broadcast-recap route (regression) ----
describe('H. broadcast-recap route', () => {
    it('valid hostKey -> 200 with the recap', async () => {
        svc.getRoomByHostKey.mockResolvedValue(liveRoom)
        svc.getBroadcastRecap.mockResolvedValue({ seconds: 42, transcript: [{ at: 1, text: 'hi' }] })
        const r = await res(broadcastRecap(null as never, params({ hostKey: 'hk1' })))
        expect(r.status).toBe(200)
        expect(r.body.data?.seconds).toBe(42)
        expect(r.body.data?.transcript).toHaveLength(1)
    })
    it('unknown hostKey -> 403', async () => {
        svc.getRoomByHostKey.mockResolvedValue(null)
        const r = await res(broadcastRecap(null as never, params({ hostKey: 'nope' })))
        expect(r.status).toBe(403)
    })
})

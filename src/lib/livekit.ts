import {
    AccessToken,
    WebhookReceiver,
    EgressClient,
    EncodedFileOutput,
    EncodedFileType,
    type WebhookEvent,
} from 'livekit-server-sdk'

/**
 * LiveKit token minting for the workshop one-way broadcast.
 * Host gets a publisher grant, viewers (students + projector) get subscribe-only,
 * so the one-way property is enforced server-side: a viewer cannot push a camera
 * even if it tampers with the client.
 *
 * Server-only env (no NEXT_PUBLIC prefix on the secret half), read lazily so a
 * missing key never crashes the build, only the request that actually needs a token:
 *   LIVEKIT_URL          wss url the browser connects to (NEXT_PUBLIC_LIVEKIT_URL mirrors it)
 *   LIVEKIT_API_KEY      key half of the LiveKit api key/secret pair
 *   LIVEKIT_API_SECRET   secret half
 */

interface LiveKitConfig {
    url: string
    apiKey: string
    apiSecret: string
}

function getLiveKitConfig(): LiveKitConfig {
    const url = process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.LIVEKIT_URL
    const apiKey = process.env.LIVEKIT_API_KEY
    const apiSecret = process.env.LIVEKIT_API_SECRET
    if (!url || !apiKey || !apiSecret) {
        throw new Error('LiveKit not configured (need LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET)')
    }
    return { url, apiKey, apiSecret }
}

/** The wss url the browser connects to. Routes echo this so the client needs no env of its own. */
export function liveKitUrl(): string {
    return getLiveKitConfig().url
}

async function mint(
    identity: string,
    room: string,
    opts: { canPublish: boolean; canSubscribe: boolean }
): Promise<string> {
    const { apiKey, apiSecret } = getLiveKitConfig()
    const at = new AccessToken(apiKey, apiSecret, { identity, ttl: '3h' })
    at.addGrant({
        roomJoin: true,
        room,
        canPublish: opts.canPublish,
        canSubscribe: opts.canSubscribe,
        // Data messages (reactions / raised hands) are allowed for everyone incl.
        // viewers: ephemeral UX only, and canPublish stays false so a viewer still
        // cannot push a camera or mic. HTTP remains the source of truth; never trust
        // a data payload for anything authoritative (identity is caller-set, audit V014).
        canPublishData: true,
    })
    return at.toJwt()
}

/**
 * Publisher token: may publish camera + mic, and subscribes too. The host needs to
 * subscribe so it can HEAR a talkback speaker; a granted speaker uses the same token
 * shape (publish their mic + hear the host). Viewers never get this.
 */
export function createPublisherToken(room: string, identity: string): Promise<string> {
    return mint(identity, room, { canPublish: true, canSubscribe: true })
}

/** Viewer token (student + projector): subscribe only, can never push a camera. */
export function createViewerToken(room: string, identity: string): Promise<string> {
    return mint(identity, room, { canPublish: false, canSubscribe: true })
}

let _receiver: WebhookReceiver | null = null

/**
 * Verify + parse a LiveKit webhook (the server signs each event with the api key).
 * Used by the auto-stop route: when the host participant leaves the room ungracefully
 * (closed tab, crash, network drop), LiveKit fires participant_left and we flip the
 * broadcast flag off so viewers stop waiting on a dead tile. `body` is the raw request
 * text, `authHeader` is the Authorization header.
 */
export async function receiveWebhook(body: string, authHeader: string): Promise<WebhookEvent> {
    const { apiKey, apiSecret } = getLiveKitConfig()
    if (!_receiver) _receiver = new WebhookReceiver(apiKey, apiSecret)
    return _receiver.receive(body, authHeader)
}

/** HTTP(S) form of the LiveKit url. The server-side service clients (Egress) need http, not wss. */
function liveKitHttpUrl(): string {
    return getLiveKitConfig().url.replace(/^wss:/i, 'https:').replace(/^ws:/i, 'http:')
}

let _egress: EgressClient | null = null
function egressClient(): EgressClient {
    if (!_egress) {
        const { apiKey, apiSecret } = getLiveKitConfig()
        _egress = new EgressClient(liveKitHttpUrl(), apiKey, apiSecret)
    }
    return _egress
}

/**
 * Start a room-composite MP4 recording. The egress container writes the file to its mounted
 * output dir (see deploy/livekit/egress-compose.yml); returns the egress id so a later stop can
 * target it. Requires the egress container + Redis to be running, otherwise this rejects and the
 * caller leaves recording off.
 */
export async function startRoomRecording(room: string): Promise<string> {
    const file = new EncodedFileOutput({
        fileType: EncodedFileType.MP4,
        // Absolute path inside the egress container, mounted to ./recordings on the host
        // (see deploy/livekit/egress-compose.yml). {time} is expanded by egress.
        filepath: `/out/workshop-${room}-{time}.mp4`,
    })
    const info = await egressClient().startRoomCompositeEgress(room, { file }, { layout: 'speaker' })
    return info.egressId
}

/** Stop a running room recording by its egress id. */
export async function stopRoomRecording(egressId: string): Promise<void> {
    await egressClient().stopEgress(egressId)
}

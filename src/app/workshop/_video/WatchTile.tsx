'use client'

import { useEffect, useState, type ReactNode } from 'react'
import {
    LiveKitRoom,
    RoomAudioRenderer,
    useConnectionState,
    useLocalParticipant,
    useTracks,
    VideoTrack,
} from '@livekit/components-react'
import { Track, ConnectionState, type RemoteTrackPublication } from 'livekit-client'
import { Radio, MonitorUp, ChevronDown, ChevronUp, Loader2, Headphones, Video, VideoOff, Mic, MicOff, Hand } from 'lucide-react'
import { STR } from '@/data/workshop-strings'

/**
 * Viewer tile (student phone + projector PiP). Subscribe-only: fetches a watch token,
 * renders the host screen share (big) with the camera as a small inset when both are live,
 * plays the host audio (students only), and surfaces connecting / starting / reconnecting
 * states. The phone tile can be collapsed to a slim LIVE bar to free the screen for chat.
 * Local publish is OFF, so the viewer never sends a track.
 */
export default function WatchTile({
    code,
    clientId,
    variant = 'tile',
    canSpeak = false,
    handRaised = false,
    caption = null,
}: {
    code: string
    clientId: string
    variant?: 'tile' | 'pip'
    canSpeak?: boolean
    handRaised?: boolean
    caption?: string | null
}) {
    const [conn, setConn] = useState<{ url: string; token: string } | null>(null)
    const [collapsed, setCollapsed] = useState(false)
    const [audioOnly, setAudioOnly] = useState(false)

    // Re-fetch when canSpeak flips: a granted speaker needs the publisher token, so the
    // LiveKitRoom remounts with a token that can publish the mic.
    useEffect(() => {
        let alive = true
        fetch(`/api/workshop/rooms/${code}/watch-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId }),
        })
            .then((r) => r.json())
            .then((j) => alive && j?.success && setConn(j.data as { url: string; token: string }))
            .catch(() => {})
        return () => {
            alive = false
        }
    }, [code, clientId, canSpeak])

    if (!conn)
        return (
            <Shell variant={variant}>
                <Hint text={STR.broadcast.connecting} spin />
            </Shell>
        )

    return (
        <>
            <LiveKitRoom
                serverUrl={conn.url}
                token={conn.token}
                connect
                audio={false}
                video={false}
                // adaptiveStream picks a simulcast layer by the rendered tile size, so a small tile
                // gets a blurry low layer. Keep it ON for the student phone (saves their data, they
                // also have the audio-only toggle), but OFF for the projector PiP so it always pulls
                // the sharp top layer and downscales it into the corner.
                options={{ adaptiveStream: variant === 'tile' }}
                className="contents"
            >
                {/* Students hear the host. The projector PiP stays muted: host publisher + projector
                    often share one machine/room, and playing the host mic there would feed back. */}
                {variant === 'tile' && <RoomAudioRenderer />}
                <Feed
                    variant={variant}
                    collapsed={collapsed}
                    onToggle={() => setCollapsed((v) => !v)}
                    audioOnly={audioOnly}
                    onAudioToggle={() => setAudioOnly((v) => !v)}
                    caption={caption}
                />
                {variant === 'tile' && canSpeak && <SpeakerControls />}
            </LiveKitRoom>
            {variant === 'tile' && !canSpeak && (
                <RaiseHand code={code} clientId={clientId} handRaised={handRaised} />
            )}
        </>
    )
}

/**
 * Shown to a granted speaker: tap-to-unmute mic + an optional camera toggle (co-host video).
 * The grant came from the host; the publisher token lets this client push mic and camera.
 */
function SpeakerControls() {
    const { localParticipant, isMicrophoneEnabled, isCameraEnabled } = useLocalParticipant()
    return (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 px-3 py-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Hand size={14} /> {STR.broadcast.youCanSpeak}
            </span>
            <button
                type="button"
                onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                    isMicrophoneEnabled
                        ? 'bg-[image:var(--ws-cta)] text-white'
                        : 'border border-border bg-card text-foreground'
                }`}
            >
                {isMicrophoneEnabled ? <Mic size={13} /> : <MicOff size={13} />}
                {isMicrophoneEnabled ? STR.broadcast.speaking : STR.broadcast.tapToSpeak}
            </button>
            <button
                type="button"
                onClick={() => localParticipant.setCameraEnabled(!isCameraEnabled)}
                aria-label={isCameraEnabled ? STR.broadcast.camOff : STR.broadcast.camOn}
                className={`inline-flex size-8 items-center justify-center rounded-full ${
                    isCameraEnabled ? 'bg-[image:var(--ws-cta)] text-white' : 'border border-border bg-card text-foreground'
                }`}
            >
                {isCameraEnabled ? <Video size={13} /> : <VideoOff size={13} />}
            </button>
        </div>
    )
}

/** Raise / lower a hand to ask for the mic. Plain fetch, no room context needed. */
function RaiseHand({ code, clientId, handRaised }: { code: string; clientId: string; handRaised: boolean }) {
    const toggle = () => {
        fetch(`/api/workshop/rooms/${code}/raise-hand`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId, raise: !handRaised }),
        }).catch(() => {})
    }
    return (
        <button
            type="button"
            onClick={toggle}
            className={`mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                handRaised
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border bg-card text-foreground hover:bg-accent'
            }`}
        >
            <Hand size={15} /> {handRaised ? STR.broadcast.handRaised : STR.broadcast.raiseHand}
        </button>
    )
}

function Feed({
    variant,
    collapsed,
    onToggle,
    audioOnly,
    onAudioToggle,
    caption,
}: {
    variant: 'tile' | 'pip'
    collapsed: boolean
    onToggle: () => void
    audioOnly: boolean
    onAudioToggle: () => void
    caption?: string | null
}) {
    const cs = useConnectionState()
    const tracks = useTracks([Track.Source.ScreenShare, Track.Source.Camera])
    const screen = tracks.find((t) => !t.participant.isLocal && t.source === Track.Source.ScreenShare)
    const cams = tracks.filter((t) => !t.participant.isLocal && t.source === Track.Source.Camera)
    const primary = screen ?? cams[0]
    const inset = screen ? cams[0] : cams[1] // co-host cam, or the host cam beside a shared screen
    const reconnecting = cs === ConnectionState.Reconnecting
    const showVideo = !!primary && !audioOnly

    // Low-data mode: drop the video subscription entirely, keep the audio.
    useEffect(() => {
        tracks.forEach((t) => {
            const pub = t.publication as RemoteTrackPublication | undefined
            pub?.setSubscribed?.(!audioOnly)
        })
    }, [audioOnly, tracks])

    // Collapsed phone tile: a slim tappable LIVE bar, audio keeps playing underneath.
    if (variant === 'tile' && collapsed) {
        return (
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-2 text-sm shadow-sm"
            >
                <span className="inline-flex items-center gap-2 font-semibold text-foreground">
                    <Radio size={14} className="text-destructive" /> {STR.broadcast.live}
                </span>
                <ChevronDown size={16} className="text-muted-foreground" />
            </button>
        )
    }

    return (
        <Shell variant={variant}>
            {showVideo ? (
                <>
                    <VideoTrack trackRef={primary} className="h-full w-full object-cover" />
                    {inset && (
                        <div className="absolute bottom-7 left-2 aspect-video w-1/4 min-w-16 overflow-hidden rounded-lg border border-white/30 shadow-lg">
                            <VideoTrack trackRef={inset} className="h-full w-full object-cover" />
                        </div>
                    )}
                </>
            ) : audioOnly ? (
                <span className="inline-flex items-center gap-2 text-xs font-medium text-white/70">
                    <Headphones size={14} /> {STR.broadcast.audioOnly}
                </span>
            ) : (
                <Hint text={reconnecting ? STR.broadcast.reconnecting : STR.broadcast.starting} spin />
            )}

            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[image:var(--ws-cta)] px-2 py-0.5 text-[11px] font-bold text-white shadow">
                <Radio size={11} /> {STR.broadcast.live}
            </span>
            {screen && !audioOnly && (
                <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white">
                    <MonitorUp size={11} /> {STR.broadcast.sharing}
                </span>
            )}
            {reconnecting && showVideo && (
                <span className="absolute left-1/2 top-9 -translate-x-1/2 rounded-full bg-warning/90 px-2 py-0.5 text-[11px] font-semibold text-white">
                    {STR.broadcast.reconnecting}
                </span>
            )}

            {caption && showVideo && (
                <span className="pointer-events-none absolute inset-x-2 bottom-9 rounded-md bg-black/65 px-2 py-1 text-center text-[13px] font-semibold leading-tight text-white">
                    {caption}
                </span>
            )}

            <span className="pointer-events-none absolute bottom-1.5 left-2 text-[10px] font-bold tracking-wider text-white/55">
                ANDREWALTAIR.GE
            </span>

            {variant === 'tile' && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={onAudioToggle}
                        aria-label={audioOnly ? STR.broadcast.videoOn : STR.broadcast.audioOnly}
                        className="inline-flex size-7 items-center justify-center rounded-full bg-black/45 text-white"
                    >
                        {audioOnly ? <Video size={14} /> : <Headphones size={14} />}
                    </button>
                    <button
                        type="button"
                        onClick={onToggle}
                        aria-label={STR.broadcast.collapse}
                        className="inline-flex size-7 items-center justify-center rounded-full bg-black/45 text-white"
                    >
                        <ChevronUp size={15} />
                    </button>
                </div>
            )}
        </Shell>
    )
}

function Hint({ text, spin }: { text: string; spin?: boolean }) {
    return (
        <span className="inline-flex items-center gap-2 text-xs font-medium text-white/70">
            {spin && <Loader2 size={13} className="animate-spin" />}
            {text}
        </span>
    )
}

function Shell({ variant, children }: { variant: 'tile' | 'pip'; children: ReactNode }) {
    const box =
        variant === 'pip'
            ? 'absolute bottom-4 right-4 z-40 aspect-video w-52 shadow-2xl'
            : 'relative aspect-video w-full'
    return (
        <div
            className={`${box} flex items-center justify-center overflow-hidden rounded-2xl border border-border bg-foreground/90 backdrop-blur`}
        >
            {children}
        </div>
    )
}

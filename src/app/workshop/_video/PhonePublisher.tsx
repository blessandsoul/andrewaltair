'use client'

import { useEffect, useState, type ReactNode } from 'react'
import {
    LiveKitRoom,
    RoomAudioRenderer,
    useLocalParticipant,
    useMediaDeviceSelect,
    useTracks,
    VideoTrack,
} from '@livekit/components-react'
import { Track, VideoPresets, ScreenSharePresets } from 'livekit-client'
import { Mic, MicOff, Video, VideoOff, SwitchCamera, Radio } from 'lucide-react'
import { STR } from '@/data/workshop-strings'

/**
 * Mobile phone-camera publisher, opened by scanning the QR on the host pult. Fetches a
 * publisher token (identity 'phone-cam') and publishes the rear camera straight into the
 * workshop LiveKit room, so viewers and the projector see it. Served from the https domain so
 * iOS Safari getUserMedia works with no cert prompt; capture starts on an explicit tap (the iOS
 * user-gesture requirement), not auto-connect.
 */
export default function PhonePublisher({ hostKey }: { hostKey: string }) {
    const [conn, setConn] = useState<{ url: string; token: string } | null>(null)
    const [err, setErr] = useState<string | null>(null)
    const [started, setStarted] = useState(false)

    useEffect(() => {
        let alive = true
        fetch(`/api/workshop/host/${hostKey}/phone-token`, { method: 'POST' })
            .then((r) => r.json())
            .then((j) => {
                if (!alive) return
                if (j?.success) setConn(j.data as { url: string; token: string })
                else setErr(STR.broadcast.cameraBlocked)
            })
            .catch(() => alive && setErr(STR.broadcast.cameraBlocked))
        return () => {
            alive = false
        }
    }, [hostKey])

    if (err)
        return (
            <Screen>
                <Notice msg={err} />
            </Screen>
        )
    if (!conn)
        return (
            <Screen>
                <span className="text-sm font-medium text-white/70">{STR.broadcast.connecting}</span>
            </Screen>
        )
    if (!started)
        return (
            <Screen>
                <button
                    type="button"
                    onClick={() => setStarted(true)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[image:var(--ws-cta)] px-7 py-4 text-lg font-bold text-white shadow-lg"
                >
                    <Video size={22} /> {STR.broadcast.phoneStart}
                </button>
            </Screen>
        )

    return (
        <LiveKitRoom
            serverUrl={conn.url}
            token={conn.token}
            connect
            video
            // Mic starts OFF: the phone is the camera, the teacher narrates from the computer mic
            // (HostMicPublisher on the pult). The mic button below re-enables phone audio if needed.
            audio={false}
            options={{
                // Rear camera at 1080p so viewers get a sharp top simulcast layer.
                videoCaptureDefaults: { facingMode: 'environment', resolution: VideoPresets.h1080.resolution },
                publishDefaults: {
                    videoEncoding: VideoPresets.h1080.encoding,
                    videoSimulcastLayers: [VideoPresets.h720, VideoPresets.h360],
                    screenShareEncoding: ScreenSharePresets.h1080fps15.encoding,
                    degradationPreference: 'maintain-resolution',
                },
            }}
            className="h-dvh"
            onError={() => setErr(STR.broadcast.cameraBlocked)}
        >
            {/* the phone hears talkback speakers (its publisher token also subscribes) */}
            <RoomAudioRenderer />
            <PhoneUI onStop={() => setStarted(false)} />
        </LiveKitRoom>
    )
}

function PhoneUI({ onStop }: { onStop: () => void }) {
    const tracks = useTracks([Track.Source.Camera], { onlySubscribed: false })
    const cam = tracks.find((t) => t.participant.isLocal && t.source === Track.Source.Camera)
    const { localParticipant, isMicrophoneEnabled } = useLocalParticipant()
    const { devices, activeDeviceId, setActiveMediaDevice } = useMediaDeviceSelect({ kind: 'videoinput' })
    const flip = () => {
        if (devices.length < 2) return
        const i = devices.findIndex((d) => d.deviceId === activeDeviceId)
        const next = devices[(i + 1) % devices.length]
        if (next) setActiveMediaDevice(next.deviceId)
    }

    return (
        <div className="flex h-dvh w-full flex-col bg-black">
            <div className="relative flex-1 overflow-hidden">
                {cam ? (
                    <VideoTrack trackRef={cam} className="h-full w-full object-cover" />
                ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-medium text-white/70">
                        {STR.broadcast.camOn}
                    </span>
                )}
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[image:var(--ws-cta)] px-3 py-1 text-xs font-bold text-white shadow">
                    <Radio size={13} /> {STR.broadcast.live}
                </span>
            </div>
            <div className="flex items-center justify-center gap-4 bg-black px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
                <button
                    type="button"
                    onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
                    aria-label={isMicrophoneEnabled ? STR.broadcast.micMute : STR.broadcast.micUnmute}
                    className={`inline-flex size-14 items-center justify-center rounded-full border ${
                        isMicrophoneEnabled ? 'border-transparent bg-[image:var(--ws-cta)] text-white' : 'border-white/30 text-white'
                    }`}
                >
                    {isMicrophoneEnabled ? <Mic size={22} /> : <MicOff size={22} />}
                </button>
                {devices.length > 1 && (
                    <button
                        type="button"
                        onClick={flip}
                        aria-label={STR.broadcast.flip}
                        className="inline-flex size-14 items-center justify-center rounded-full border border-white/30 text-white"
                    >
                        <SwitchCamera size={22} />
                    </button>
                )}
                <button
                    type="button"
                    onClick={onStop}
                    className="inline-flex items-center gap-2 rounded-full bg-destructive px-7 py-3 text-base font-bold text-white"
                >
                    <VideoOff size={20} /> {STR.broadcast.phoneStop}
                </button>
            </div>
        </div>
    )
}

function Screen({ children }: { children: ReactNode }) {
    return <div className="flex h-dvh w-full items-center justify-center bg-black p-6 text-center">{children}</div>
}

function Notice({ msg }: { msg: string }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <VideoOff size={28} className="text-white/70" />
            <span className="text-sm font-medium text-white/80">{msg}</span>
        </div>
    )
}

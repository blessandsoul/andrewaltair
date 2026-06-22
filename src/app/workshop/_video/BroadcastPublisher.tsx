'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
    LiveKitRoom,
    RoomAudioRenderer,
    useLocalParticipant,
    useMediaDeviceSelect,
    useTracks,
    VideoTrack,
} from '@livekit/components-react'
import { Track, LocalVideoTrack, VideoPresets, ScreenSharePresets } from 'livekit-client'
import { Mic, MicOff, Video, VideoOff, MonitorUp, MonitorX, SwitchCamera, Sparkles, Captions, Camera, Settings, Radio } from 'lucide-react'
import { STR } from '@/data/workshop-strings'

/**
 * Host publisher tile + control bar, lives in the host remote. Fetches a publisher token,
 * opens a LiveKitRoom that auto-publishes camera + mic, shows a self-preview, and exposes
 * mic mute / camera off (audio-only) / screen share / camera flip. Unmounting disconnects
 * the room and releases the devices.
 */
export default function BroadcastPublisher({
    hostKey,
    code,
    lang = 'ka',
}: {
    hostKey: string
    code: string
    lang?: 'ka' | 'ru'
}) {
    const [conn, setConn] = useState<{ url: string; token: string } | null>(null)
    const [err, setErr] = useState<string | null>(null)

    useEffect(() => {
        let alive = true
        fetch(`/api/workshop/host/${hostKey}/broadcast-token`, { method: 'POST' })
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
            <Shell>
                <Notice msg={err} />
            </Shell>
        )
    if (!conn)
        return (
            <Shell>
                <span className="text-xs font-medium text-white/70">{STR.broadcast.connecting}</span>
            </Shell>
        )

    return (
        <LiveKitRoom
            serverUrl={conn.url}
            token={conn.token}
            connect
            video
            audio
            options={{
                // Capture + publish at 1080p so viewers have a sharp top simulcast layer to pull.
                // maintain-resolution keeps the picture crisp under load (drops FPS first, not pixels).
                videoCaptureDefaults: { resolution: VideoPresets.h1080.resolution },
                publishDefaults: {
                    videoEncoding: VideoPresets.h1080.encoding,
                    videoSimulcastLayers: [VideoPresets.h720, VideoPresets.h360],
                    screenShareEncoding: ScreenSharePresets.h1080fps15.encoding,
                    degradationPreference: 'maintain-resolution',
                },
            }}
            className="space-y-2"
            onError={() => setErr(STR.broadcast.cameraBlocked)}
        >
            {/* lets the host hear a talkback speaker (host token subscribes) */}
            <RoomAudioRenderer />
            <PublisherUI code={code} lang={lang} />
        </LiveKitRoom>
    )
}

function PublisherUI({ code, lang }: { code: string; lang: 'ka' | 'ru' }) {
    const { localParticipant, isCameraEnabled, isMicrophoneEnabled, isScreenShareEnabled } = useLocalParticipant()

    // Live captions: the host browser transcribes speech and posts lines to the caption route,
    // which fans them out to viewers as subtitles + accumulates the transcript. Opt-in (flaky API).
    // SpeechRecognition is vendor-prefixed and not in lib.dom, so we type it structurally here.
    const [captionsOn, setCaptionsOn] = useState(false)
    useEffect(() => {
        if (!captionsOn) return
        type RecEvent = {
            resultIndex: number
            results: { length: number; [i: number]: { isFinal: boolean; [a: number]: { transcript: string } } }
        }
        type Recognizer = {
            continuous: boolean
            interimResults: boolean
            lang: string
            onresult: ((e: RecEvent) => void) | null
            onend: (() => void) | null
            start: () => void
            stop: () => void
        }
        const win = window as unknown as {
            SpeechRecognition?: new () => Recognizer
            webkitSpeechRecognition?: new () => Recognizer
        }
        const Ctor = win.SpeechRecognition || win.webkitSpeechRecognition
        if (!Ctor) return
        const rec = new Ctor()
        rec.continuous = true
        rec.interimResults = true
        rec.lang = lang === 'ru' ? 'ru-RU' : 'ka-GE'
        let stopped = false
        const post = (text: string, final: boolean) => {
            fetch(`/api/workshop/rooms/${code}/caption`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text.slice(0, 300), final }),
            }).catch(() => {})
        }
        rec.onresult = (e: RecEvent) => {
            let interim = ''
            for (let i = e.resultIndex; i < e.results.length; i++) {
                const r = e.results[i]
                if (r.isFinal) post(r[0].transcript, true)
                else interim += r[0].transcript
            }
            if (interim.trim()) post(interim, false)
        }
        rec.onend = () => {
            if (!stopped) {
                try {
                    rec.start()
                } catch {
                    // already starting
                }
            }
        }
        try {
            rec.start()
        } catch {
            // not supported / blocked
        }
        return () => {
            stopped = true
            try {
                rec.stop()
            } catch {
                // already stopped
            }
        }
    }, [captionsOn, code, lang])
    const tracks = useTracks([Track.Source.ScreenShare, Track.Source.Camera], { onlySubscribed: false })
    const localScreen = tracks.find((t) => t.participant.isLocal && t.source === Track.Source.ScreenShare)
    const localCam = tracks.find((t) => t.participant.isLocal && t.source === Track.Source.Camera)
    const preview = localScreen ?? localCam

    const { devices, activeDeviceId, setActiveMediaDevice } = useMediaDeviceSelect({ kind: 'videoinput' })
    const flip = () => {
        if (devices.length < 2) return
        const i = devices.findIndex((d) => d.deviceId === activeDeviceId)
        const next = devices[(i + 1) % devices.length]
        if (next) setActiveMediaDevice(next.deviceId)
    }

    // Video settings popover (gear): live quality, smoothness, camera + mic device pick.
    const mic = useMediaDeviceSelect({ kind: 'audioinput' })
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [quality, setQuality] = useState<'1080' | '720' | '360'>('1080')
    const [motion, setMotion] = useState<'sharp' | 'smooth'>('sharp')

    const camTrack = () => {
        const t = localParticipant.getTrackPublication(Track.Source.Camera)?.track
        return t instanceof LocalVideoTrack ? t : null
    }
    // Quality: restart the camera capture at the chosen resolution (keeps the same device).
    const applyQuality = async (q: '1080' | '720' | '360') => {
        setQuality(q)
        const track = camTrack()
        if (!track) return
        const resolution =
            q === '1080' ? VideoPresets.h1080.resolution : q === '720' ? VideoPresets.h720.resolution : VideoPresets.h360.resolution
        try {
            await track.restartTrack({ deviceId: activeDeviceId || undefined, resolution })
        } catch {
            // device busy or constraint unsupported, keep the current capture
        }
    }
    // Smoothness: under load drop resolution (sharp) or framerate (smooth).
    const applyMotion = async (m: 'sharp' | 'smooth') => {
        setMotion(m)
        const sender = camTrack()?.sender
        if (!sender) return
        try {
            const p = sender.getParameters() as RTCRtpSendParameters & { degradationPreference?: RTCDegradationPreference }
            p.degradationPreference = m === 'sharp' ? 'maintain-resolution' : 'maintain-framerate'
            await sender.setParameters(p)
        } catch {
            // some browsers ignore a runtime degradationPreference change, no-op
        }
    }

    // Background blur runs a MediaPipe processor on the camera track, loaded on demand
    // (the WASM is heavy) so it never bloats the base bundle.
    const [blurOn, setBlurOn] = useState(false)
    const toggleBlur = async () => {
        const track = localParticipant.getTrackPublication(Track.Source.Camera)?.track
        if (!(track instanceof LocalVideoTrack)) return
        try {
            if (!blurOn) {
                const { BackgroundBlur } = await import('@livekit/track-processors')
                await track.setProcessor(BackgroundBlur(12))
                setBlurOn(true)
            } else {
                await track.stopProcessor()
                setBlurOn(false)
            }
        } catch {
            // processor unsupported on this device, leave the raw camera as is
        }
    }

    // Snapshot: draw the current preview frame (camera or screen, whichever is live) to an
    // offscreen canvas and download it as PNG. The track is a local MediaStream so the canvas
    // is not tainted and toBlob succeeds.
    const previewRef = useRef<HTMLDivElement>(null)
    const snapshot = () => {
        const video = previewRef.current?.querySelector<HTMLVideoElement>('video')
        if (!video || !video.videoWidth) return
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
            if (!blob) return
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `snapshot-${code}-${Date.now()}.png`
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(url)
        }, 'image/png')
    }

    return (
        <>
            <Shell>
                <div ref={previewRef} className="h-full w-full">
                    {preview ? (
                        <VideoTrack trackRef={preview} className="h-full w-full object-cover" />
                    ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-medium text-white/70">{STR.broadcast.camOn}</span>
                    )}
                </div>
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[image:var(--ws-cta)] px-2 py-0.5 text-[11px] font-bold text-white shadow">
                    <Radio size={11} /> {STR.broadcast.live}
                </span>
            </Shell>
            <div className="flex items-center justify-center gap-2">
                <CtlBtn
                    tone={isMicrophoneEnabled ? 'neutral' : 'danger'}
                    onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
                    label={isMicrophoneEnabled ? STR.broadcast.micMute : STR.broadcast.micUnmute}
                    icon={isMicrophoneEnabled ? <Mic size={16} /> : <MicOff size={16} />}
                />
                <CtlBtn
                    tone={isCameraEnabled ? 'neutral' : 'danger'}
                    onClick={() => localParticipant.setCameraEnabled(!isCameraEnabled)}
                    label={isCameraEnabled ? STR.broadcast.camOff : STR.broadcast.camOn}
                    icon={isCameraEnabled ? <Video size={16} /> : <VideoOff size={16} />}
                />
                <CtlBtn
                    tone={isScreenShareEnabled ? 'active' : 'neutral'}
                    onClick={() => localParticipant.setScreenShareEnabled(!isScreenShareEnabled)}
                    label={isScreenShareEnabled ? STR.broadcast.screenStop : STR.broadcast.screen}
                    icon={isScreenShareEnabled ? <MonitorX size={16} /> : <MonitorUp size={16} />}
                />
                {devices.length > 1 && (
                    <CtlBtn tone="neutral" onClick={flip} label={STR.broadcast.flip} icon={<SwitchCamera size={16} />} />
                )}
                <CtlBtn
                    tone={blurOn ? 'active' : 'neutral'}
                    onClick={toggleBlur}
                    label={STR.broadcast.blur}
                    icon={<Sparkles size={16} />}
                />
                <CtlBtn
                    tone={captionsOn ? 'active' : 'neutral'}
                    onClick={() => setCaptionsOn((v) => !v)}
                    label={STR.broadcast.captions}
                    icon={<Captions size={16} />}
                />
                {preview && (
                    <CtlBtn tone="neutral" onClick={snapshot} label={STR.broadcast.snapshot} icon={<Camera size={16} />} />
                )}
                <CtlBtn
                    tone={settingsOpen ? 'active' : 'neutral'}
                    onClick={() => setSettingsOpen((v) => !v)}
                    label={STR.broadcast.settings}
                    icon={<Settings size={16} />}
                />
            </div>
            {settingsOpen && (
                <div className="space-y-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
                    <div>
                        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{STR.broadcast.quality}</p>
                        <div className="flex gap-1.5">
                            {(['1080', '720', '360'] as const).map((q) => (
                                <button
                                    key={q}
                                    type="button"
                                    onClick={() => applyQuality(q)}
                                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
                                        quality === q
                                            ? 'border-transparent bg-[image:var(--ws-cta)] text-white'
                                            : 'border-border bg-background text-foreground hover:bg-accent'
                                    }`}
                                >
                                    {q}p
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{STR.broadcast.motion}</p>
                        <div className="flex gap-1.5">
                            {([['sharp', STR.broadcast.sharp], ['smooth', STR.broadcast.smooth]] as const).map(([m, label]) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => applyMotion(m)}
                                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
                                        motion === m
                                            ? 'border-transparent bg-[image:var(--ws-cta)] text-white'
                                            : 'border-border bg-background text-foreground hover:bg-accent'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {devices.length > 0 && (
                        <label className="block">
                            <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{STR.broadcast.cameraLabel}</span>
                            <select
                                value={activeDeviceId}
                                onChange={(e) => setActiveMediaDevice(e.target.value)}
                                className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
                            >
                                {devices.map((d, i) => (
                                    <option key={d.deviceId} value={d.deviceId}>
                                        {d.label || `${STR.broadcast.cameraLabel} ${i + 1}`}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}
                    {mic.devices.length > 0 && (
                        <label className="block">
                            <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{STR.broadcast.micLabel}</span>
                            <select
                                value={mic.activeDeviceId}
                                onChange={(e) => mic.setActiveMediaDevice(e.target.value)}
                                className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
                            >
                                {mic.devices.map((d, i) => (
                                    <option key={d.deviceId} value={d.deviceId}>
                                        {d.label || `${STR.broadcast.micLabel} ${i + 1}`}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}
                </div>
            )}
        </>
    )
}

function CtlBtn({
    tone,
    onClick,
    label,
    icon,
}: {
    tone: 'neutral' | 'danger' | 'active'
    onClick: () => void
    label: string
    icon: ReactNode
}) {
    const cls =
        tone === 'danger'
            ? 'border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20'
            : tone === 'active'
              ? 'border-transparent bg-[image:var(--ws-cta)] text-white'
              : 'border-border bg-card text-foreground hover:bg-accent'
    return (
        <button
            type="button"
            onClick={onClick}
            title={label}
            aria-label={label}
            className={`inline-flex size-10 items-center justify-center rounded-full border transition ${cls}`}
        >
            {icon}
        </button>
    )
}

function Shell({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-foreground/90">
            {children}
        </div>
    )
}

function Notice({ msg }: { msg: string }) {
    return (
        <div className="flex flex-col items-center gap-1.5 px-4 text-center">
            <VideoOff size={20} className="text-white/70" />
            <span className="text-xs font-medium text-white/80">{msg}</span>
        </div>
    )
}

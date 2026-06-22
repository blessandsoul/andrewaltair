'use client'

import { useEffect, useState } from 'react'
import { LiveKitRoom, RoomAudioRenderer, useLocalParticipant } from '@livekit/components-react'
import { Mic, MicOff } from 'lucide-react'
import { STR } from '@/data/workshop-strings'

/**
 * Audio-only host publisher, mounted on the pult in iPhone camera mode. The phone provides the
 * picture as 'phone-cam' (video only) while this publishes the COMPUTER mic as 'host', so the
 * teacher narrates from the laptop and viewers hear the laptop, not the phone room noise. It
 * reuses the publisher 'host' token; in iPhone mode BroadcastPublisher (which also uses 'host')
 * is never mounted, so the identity is free. The mic starts on; the button mutes it.
 */
export default function HostMicPublisher({ hostKey }: { hostKey: string }) {
    const [conn, setConn] = useState<{ url: string; token: string } | null>(null)

    useEffect(() => {
        let alive = true
        fetch(`/api/workshop/host/${hostKey}/broadcast-token`, { method: 'POST' })
            .then((r) => r.json())
            .then((j) => alive && j?.success && setConn(j.data as { url: string; token: string }))
            .catch(() => {})
        return () => {
            alive = false
        }
    }, [hostKey])

    if (!conn) return null

    return (
        <LiveKitRoom serverUrl={conn.url} token={conn.token} connect audio video={false} className="contents">
            {/* lets the host hear a talkback speaker (host token subscribes) */}
            <RoomAudioRenderer />
            <MicToggle />
        </LiveKitRoom>
    )
}

function MicToggle() {
    const { localParticipant, isMicrophoneEnabled } = useLocalParticipant()
    return (
        <button
            type="button"
            onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                isMicrophoneEnabled
                    ? 'border-transparent bg-[image:var(--ws-cta)] text-white'
                    : 'border-destructive/40 bg-destructive/10 text-destructive'
            }`}
        >
            {isMicrophoneEnabled ? <Mic size={15} /> : <MicOff size={15} />}
            {isMicrophoneEnabled ? STR.broadcast.computerMic : STR.broadcast.micUnmute}
        </button>
    )
}

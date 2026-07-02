'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { LiveKitRoom, useDataChannel } from '@livekit/components-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { REACTION_BY_KIND } from '@/components/workshop/reactionIcons'

export type RealtimeEvent =
    | { t: 'reaction'; kind: string; id: number; name?: string }
    | { t: 'hand'; raised: boolean }
    | { t: 'answered' }

type Ctx = { publish: (e: RealtimeEvent) => void }
const RealtimeCtx = createContext<Ctx>({ publish: () => {} })

/** Publish a workshop realtime event (reaction / hand). No-op until the data channel connects. */
export function useRealtimePublish(): (e: RealtimeEvent) => void {
    return useContext(RealtimeCtx).publish
}

const TOPIC = 'ws-signal'
const encoder = new TextEncoder()
const decoder = new TextDecoder()

type SendFn = (payload: Uint8Array) => void

function Bridge({ onEvent, onReady }: { onEvent?: (e: RealtimeEvent) => void; onReady: (s: SendFn | null) => void }) {
    const onEventRef = useRef(onEvent)
    onEventRef.current = onEvent
    const { send } = useDataChannel(TOPIC, (msg) => {
        try {
            const e = JSON.parse(decoder.decode(msg.payload)) as RealtimeEvent
            onEventRef.current?.(e)
        } catch {
            /* malformed payload, ignore */
        }
    })
    useEffect(() => {
        const fn: SendFn = (payload) => {
            void send(payload, { reliable: false })
        }
        onReady(() => fn)
        return () => onReady(null)
    }, [send, onReady])
    return null
}

/**
 * Additive realtime layer for the workshop. Opens a SECOND, data-only LiveKit connection
 * (audio + video off, a distinct "#rt" identity so it never collides with the video
 * WatchTile connection) purely to relay reactions and raised hands with no poll delay.
 * It renders as a sibling of `children`, so children never remount when it connects, and
 * if LiveKit is unreachable everything degrades to the existing HTTP path. HTTP stays the
 * source of truth; data payloads are ephemeral UX only (never authoritative, audit V014).
 */
export function RealtimeProvider({
    code,
    identity,
    onEvent,
    children,
}: {
    code: string
    identity: string
    onEvent?: (e: RealtimeEvent) => void
    children: ReactNode
}) {
    const [conn, setConn] = useState<{ url: string; token: string } | null>(null)
    const [sender, setSender] = useState<SendFn | null>(null)

    useEffect(() => {
        let alive = true
        fetch(`/api/workshop/rooms/${code}/watch-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId: `${identity}#rt` }),
        })
            .then((r) => r.json())
            .then((j) => {
                if (alive && j?.success) setConn(j.data as { url: string; token: string })
            })
            .catch(() => {})
        return () => {
            alive = false
        }
    }, [code, identity])

    const publish = useCallback(
        (e: RealtimeEvent) => {
            if (!sender) return
            try {
                sender(encoder.encode(JSON.stringify(e)))
            } catch {
                /* not connected yet, drop */
            }
        },
        [sender],
    )

    return (
        <RealtimeCtx.Provider value={{ publish }}>
            {conn && (
                <LiveKitRoom
                    serverUrl={conn.url}
                    token={conn.token}
                    connect
                    audio={false}
                    video={false}
                    style={{ display: 'contents' }}
                >
                    <Bridge onEvent={onEvent} onReady={setSender} />
                </LiveKitRoom>
            )}
            {children}
        </RealtimeCtx.Provider>
    )
}

/** Renders reactions arriving from OTHER participants as icons floating up the screen. */
export function ReactionFloatLayer({ items }: { items: { id: number; kind: string }[] }) {
    const reduceMotion = useReducedMotion()
    if (reduceMotion) return null
    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-28 z-40 flex justify-center">
            <AnimatePresence>
                {items.map(({ id, kind }) => {
                    const r = REACTION_BY_KIND[kind]
                    if (!r) return null
                    const Icon = r.Icon
                    return (
                        <motion.span
                            key={id}
                            initial={{ opacity: 0, y: 0, scale: 0.5 }}
                            animate={{ opacity: 1, y: -130, scale: 1.3, x: ((id % 7) - 3) * 18 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.4, ease: 'easeOut' }}
                            className="absolute"
                        >
                            <Icon size={34} style={{ color: r.color }} />
                        </motion.span>
                    )
                })}
            </AnimatePresence>
        </div>
    )
}

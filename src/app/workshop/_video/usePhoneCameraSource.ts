'use client'

import { useEffect, useRef, useState } from 'react'

type PhoneState = 'idle' | 'waiting' | 'connected'

// Messages relayed by the PHONE_CAMERA signaling server (github.com/andrewaltair/PHONE_CAMERA).
type SignalMsg =
    | { type: 'offer'; sdp: RTCSessionDescriptionInit }
    | { type: 'answer'; sdp: RTCSessionDescriptionInit }
    | { type: 'ice'; candidate: RTCIceCandidateInit }
    | { type: 'peer-ready' }
    | { type: 'peer-left' }
    | { type: 'replaced' }
    | { type: 'caps'; [k: string]: unknown }
    | { type: 'control'; [k: string]: unknown }

const STUN: RTCConfiguration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }

/**
 * Receives the iPhone camera over PHONE_CAMERA's WebRTC P2P link and exposes its
 * MediaStreamTracks, so the workshop host can republish them into LiveKit. This is the
 * "viewer" half of PHONE_CAMERA (source.html) ported to a React hook: join the signaling
 * room as role viewer, answer the phone's offer, take the track from pc.ontrack.
 * LAN only (single Google STUN, no TURN). Passing enabled=false tears everything down.
 */
export function usePhoneCameraSource(enabled: boolean): {
    state: PhoneState
    videoTrack: MediaStreamTrack | null
    audioTrack: MediaStreamTrack | null
    wsUrl: string
} {
    const wsUrl = process.env.NEXT_PUBLIC_PHONE_CAMERA_WS || 'wss://localhost:8443'
    const [state, setState] = useState<PhoneState>('idle')
    const [videoTrack, setVideoTrack] = useState<MediaStreamTrack | null>(null)
    const [audioTrack, setAudioTrack] = useState<MediaStreamTrack | null>(null)

    const wsRef = useRef<WebSocket | null>(null)
    const pcRef = useRef<RTCPeerConnection | null>(null)
    const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (!enabled) {
            setState('idle')
            return
        }
        let alive = true

        const closePc = () => {
            pcRef.current?.close()
            pcRef.current = null
            setVideoTrack(null)
            setAudioTrack(null)
        }

        const connect = () => {
            if (!alive) return
            const ws = new WebSocket(wsUrl)
            wsRef.current = ws

            ws.onopen = () => {
                if (!alive) return
                ws.send(JSON.stringify({ type: 'join', role: 'viewer' }))
                setState('waiting')
            }

            ws.onmessage = async (ev) => {
                if (!alive) return
                let msg: SignalMsg
                try {
                    msg = JSON.parse(typeof ev.data === 'string' ? ev.data : '') as SignalMsg
                } catch {
                    return
                }
                if (msg.type === 'offer') {
                    const pc = new RTCPeerConnection(STUN)
                    pcRef.current = pc
                    pc.ontrack = (e) => {
                        if (!alive) return
                        const stream = e.streams[0]
                        setVideoTrack(stream?.getVideoTracks()[0] ?? null)
                        setAudioTrack(stream?.getAudioTracks()[0] ?? null)
                    }
                    pc.onicecandidate = (e) => {
                        if (e.candidate) ws.send(JSON.stringify({ type: 'ice', candidate: e.candidate }))
                    }
                    pc.onconnectionstatechange = () => {
                        if (!alive) return
                        const s = pc.connectionState
                        if (s === 'connected') setState('connected')
                        else if (s === 'failed' || s === 'disconnected' || s === 'closed') {
                            setVideoTrack(null)
                            setAudioTrack(null)
                            setState('waiting')
                        }
                    }
                    await pc.setRemoteDescription(msg.sdp)
                    await pc.setLocalDescription(await pc.createAnswer())
                    ws.send(JSON.stringify({ type: 'answer', sdp: pc.localDescription }))
                } else if (msg.type === 'ice') {
                    try {
                        await pcRef.current?.addIceCandidate(msg.candidate)
                    } catch {
                        // candidate arrived before the remote description, ignore
                    }
                } else if (msg.type === 'peer-left' || msg.type === 'replaced') {
                    closePc()
                    setState('waiting')
                }
            }

            ws.onclose = () => {
                if (!alive) return
                closePc()
                retryRef.current = setTimeout(connect, 1000)
            }

            ws.onerror = () => {
                try {
                    ws.close()
                } catch {
                    // already closing
                }
            }
        }

        connect()

        return () => {
            alive = false
            if (retryRef.current) clearTimeout(retryRef.current)
            retryRef.current = null
            try {
                wsRef.current?.close()
            } catch {
                // already closed
            }
            wsRef.current = null
            pcRef.current?.close()
            pcRef.current = null
            setVideoTrack(null)
            setAudioTrack(null)
            setState('idle')
        }
    }, [enabled, wsUrl])

    return { state, videoTrack, audioTrack, wsUrl }
}

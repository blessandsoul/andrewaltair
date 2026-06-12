'use client'

import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'

interface TemplateInfo {
    id: string
    title: string
    roundsTotal: number
}

interface RoomInfo {
    roomId: string
    code: string
    hostKey: string
    title: string
    status: string
    createdAt: string
}

export default function CreateRoomPanel() {
    const [templates, setTemplates] = useState<TemplateInfo[]>([])
    const [rooms, setRooms] = useState<RoomInfo[]>([])
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const load = async () => {
        try {
            const res = await fetch('/api/workshop/rooms', { cache: 'no-store' })
            const json = await res.json()
            if (json.success) {
                setTemplates(json.data.templates)
                setRooms(json.data.rooms)
            } else {
                setError('Не авторизован — залогинься в админку')
            }
        } catch {
            setError('Ошибка загрузки')
        }
    }

    useEffect(() => {
        load()
    }, [])

    const create = async (templateId: string) => {
        setBusy(true)
        setError(null)
        try {
            const res = await fetch('/api/workshop/rooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ templateId }),
            })
            const json = await res.json()
            if (json.success) {
                await load()
            } else {
                setError(json.error?.message ?? 'Не удалось создать')
            }
        } catch {
            setError('Ошибка сети')
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <h2 className="text-sm font-mono uppercase tracking-widest text-white/40">Создать комнату</h2>
                {templates.map((t) => (
                    <div
                        key={t.id}
                        className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md px-5 py-4"
                    >
                        <div>
                            <p className="font-semibold">{t.title}</p>
                            <p className="text-white/40 text-sm">
                                {t.id} · {t.roundsTotal} раундов
                            </p>
                        </div>
                        <button
                            onClick={() => create(t.id)}
                            disabled={busy}
                            className="rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 px-5 py-2.5 font-semibold transition-colors"
                        >
                            {busy ? '...' : 'Создать'}
                        </button>
                    </div>
                ))}
                {error && <p className="text-red-400">{error}</p>}
            </section>

            <section className="space-y-3">
                <h2 className="text-sm font-mono uppercase tracking-widest text-white/40">Комнаты</h2>
                {rooms.length === 0 && <p className="text-white/30">Пока нет</p>}
                {rooms.map((r) => (
                    <div
                        key={r.roomId}
                        className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md px-5 py-4 space-y-2"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-xl font-bold tracking-[0.2em]">{r.code}</span>
                            <span
                                className={`text-xs font-mono uppercase px-3 py-1 rounded-full border ${
                                    r.status === 'live'
                                        ? 'border-red-500/50 text-red-400'
                                        : r.status === 'ended'
                                        ? 'border-white/20 text-white/40'
                                        : 'border-emerald-500/50 text-emerald-400'
                                }`}
                            >
                                {r.status}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <a
                                href={`/workshop/host/${r.hostKey}`}
                                target="_blank"
                                className="inline-flex items-center gap-1.5 text-violet-400 underline underline-offset-4"
                            >
                                Экран (шарить в Meet) <ExternalLink size={14} />
                            </a>
                            <a
                                href={`/workshop/host/${r.hostKey}/remote`}
                                target="_blank"
                                className="inline-flex items-center gap-1.5 text-emerald-400 underline underline-offset-4"
                            >
                                Пульт (кнопки) <ExternalLink size={14} />
                            </a>
                            <span className="text-white/40">
                                студенты: andrewaltair.ge/workshop/{r.code}
                            </span>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    )
}

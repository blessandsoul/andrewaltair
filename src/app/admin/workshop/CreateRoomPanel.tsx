'use client'

import { useEffect, useState } from 'react'
import { MonitorPlay, Gamepad2, Trash2, Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
    lobby: { label: 'LOBBY', cls: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' },
    live: { label: '● LIVE', cls: 'bg-red-500/15 text-red-600 border-red-500/30' },
    ended: { label: 'ENDED', cls: 'bg-muted text-muted-foreground border-border' },
}

export default function CreateRoomPanel() {
    const [templates, setTemplates] = useState<TemplateInfo[]>([])
    const [rooms, setRooms] = useState<RoomInfo[]>([])
    const [busy, setBusy] = useState(false)
    const [deleteArm, setDeleteArm] = useState<string | null>(null)
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
            if (json.success) await load()
            else setError(json.error?.message ?? 'Не удалось создать')
        } catch {
            setError('Ошибка сети')
        } finally {
            setBusy(false)
        }
    }

    const remove = async (code: string) => {
        if (deleteArm !== code) {
            setDeleteArm(code)
            return
        }
        setDeleteArm(null)
        setBusy(true)
        try {
            await fetch(`/api/workshop/rooms/${code}`, { method: 'DELETE' })
            await load()
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Templates */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">ახალი ოთახი</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {templates.map((t) => (
                        <div
                            key={t.id}
                            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3"
                        >
                            <div className="min-w-0">
                                <p className="font-semibold text-foreground truncate">{t.title}</p>
                                <p className="text-muted-foreground text-sm">
                                    {t.id} · {t.roundsTotal} раундов
                                </p>
                            </div>
                            <Button onClick={() => create(t.id)} disabled={busy} className="shrink-0 gap-2">
                                <Plus size={16} /> Создать
                            </Button>
                        </div>
                    ))}
                    {error && <p className="text-destructive text-sm">{error}</p>}
                </CardContent>
            </Card>

            {/* Rooms */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">ოთახები</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {rooms.length === 0 && <p className="text-muted-foreground text-sm">Пока нет</p>}
                    {rooms.map((r) => {
                        const badge = STATUS_BADGE[r.status] ?? STATUS_BADGE.ended
                        return (
                            <div
                                key={r.roomId}
                                className="rounded-xl border border-border bg-card px-4 py-3 space-y-3"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-xl font-bold tracking-[0.2em] text-foreground">
                                        {r.code}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={badge.cls}>
                                            {badge.label}
                                        </Badge>
                                        {deleteArm === r.code ? (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => remove(r.code)}
                                                disabled={busy}
                                                className="gap-1.5"
                                            >
                                                <Trash2 size={14} /> წავშალო?
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => remove(r.code)}
                                                disabled={busy}
                                                className="text-muted-foreground hover:text-destructive"
                                            >
                                                <Trash2 size={15} />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Button asChild variant="default" size="sm" className="gap-1.5">
                                        <a href={`/workshop/host/${r.hostKey}`} target="_blank">
                                            <MonitorPlay size={15} /> ეკრანი (Meet)
                                        </a>
                                    </Button>
                                    <Button asChild variant="secondary" size="sm" className="gap-1.5">
                                        <a href={`/workshop/host/${r.hostKey}/remote`} target="_blank">
                                            <Gamepad2 size={15} /> პულტი
                                        </a>
                                    </Button>
                                    <Badge variant="secondary" className="gap-1.5 font-normal">
                                        <Users size={13} /> andrewaltair.ge/workshop/{r.code}
                                    </Badge>
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        </div>
    )
}

'use client'

import { useState } from 'react'
import { FlaskConical, Plus, Presentation, Wifi } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { DEFAULT_ROOM_SETTINGS, type IWorkshopRoomSettings } from '@/types/workshop.types'

interface RoomSettingsFormProps {
    busy: boolean
    onCreate: (demo: boolean, settings: IWorkshopRoomSettings) => void
}

type BoolKey = {
    [K in keyof IWorkshopRoomSettings]: IWorkshopRoomSettings[K] extends boolean ? K : never
}[keyof IWorkshopRoomSettings]
type NumKey = {
    [K in keyof IWorkshopRoomSettings]: IWorkshopRoomSettings[K] extends number ? K : never
}[keyof IWorkshopRoomSettings]

const BOOL_FIELDS: { key: BoolKey; label: string }[] = [
    { key: 'studentSound', label: 'ხმა სტუდენტების ტელეფონებზე' },
    { key: 'hostAnswerSound', label: 'პასუხების ხმა პროექტორზე' },
    { key: 'autoReveal', label: 'შედეგების ავტო-ჩვენება' },
    { key: 'revealCorrect', label: 'სწორი პასუხის ჩვენება' },
    { key: 'anonymousNames', label: 'ანონიმური პასუხები (სახელების დამალვა)' },
    { key: 'shuffleOptions', label: 'ვარიანტების არევა' },
    { key: 'nameFilter', label: 'სახელების ფილტრი (გინება / ცარიელი)' },
    { key: 'allowKick', label: 'მონაწილის გაგდების უფლება' },
    { key: 'confetti', label: 'კონფეტი ჩვენებისას' },
    { key: 'gamification', label: '🎮 გეიმიფიკაცია (ქულები, ბეჯები, რეაქციები)' },
    { key: 'teamMode', label: '🎨 გუნდური რეჟიმი' },
    { key: 'chatEnabled', label: '💬 მონაწილეების ჩატი' },
    { key: 'questionsEnabled', label: '❓ კითხვები დარბაზიდან' },
    { key: 'chatAutoShow', label: '⚡ ჩატის ავტო-ჩვენება (მოდერაციის გარეშე)' },
    { key: 'broadcastEnabled', label: '📹 წამყვანის ვიდეო-ეთერი' },
]

const NUM_FIELDS: { key: NumKey; label: string; min: number; max: number; step: number; fmt: (v: number) => string }[] = [
    { key: 'graceSec', label: 'პაუზა ავტო-ჩვენებამდე', min: 0, max: 60, step: 1, fmt: (v) => `${v} წმ` },
    { key: 'gateRatio', label: 'შედეგების ჩვენების ზღვარი', min: 0, max: 1, step: 0.1, fmt: (v) => `${Math.round(v * 100)}%` },
    { key: 'roundTimerSec', label: 'რაუნდის ტაიმერი', min: 0, max: 600, step: 5, fmt: (v) => (v ? `${v} წმ` : 'შაბლონიდან') },
    { key: 'studentPollMs', label: 'ტელეფონების გამოკითხვა', min: 1000, max: 10000, step: 500, fmt: (v) => `${v} მწმ` },
    { key: 'textWallLimit', label: 'პასუხების ლიმიტი კედელზე', min: 10, max: 500, step: 10, fmt: (v) => `${v}` },
    { key: 'maxParticipants', label: 'მონაწილეების ლიმიტი', min: 0, max: 500, step: 1, fmt: (v) => (v ? `${v}` : '∞') },
    { key: 'codeLength', label: 'კოდის სიგრძე', min: 4, max: 6, step: 1, fmt: (v) => `${v}` },
    { key: 'onlineWindowSec', label: 'ონლაინ ფანჯარა', min: 5, max: 60, step: 1, fmt: (v) => `${v} წმ` },
    { key: 'hostVolume', label: 'პროექტორის ხმა', min: 0, max: 100, step: 5, fmt: (v) => `${v}` },
    { key: 'studentVolume', label: 'ტელეფონის ხმა', min: 0, max: 100, step: 5, fmt: (v) => `${v}` },
    { key: 'teamCount', label: 'გუნდები', min: 2, max: 6, step: 1, fmt: (v) => `${v}` },
]

export function RoomSettingsForm({ busy, onCreate }: RoomSettingsFormProps) {
    const [settings, setSettings] = useState<IWorkshopRoomSettings>({ ...DEFAULT_ROOM_SETTINGS })

    const setField = <K extends keyof IWorkshopRoomSettings>(key: K, value: IWorkshopRoomSettings[K]): void =>
        setSettings((s) => ({ ...s, [key]: value }))

    // Preset resets everything to the preset's defaults (operator can still tweak after).
    const applyPreset = (audience: 'inperson' | 'online'): void =>
        setSettings({ ...DEFAULT_ROOM_SETTINGS, audience, studentSound: audience === 'online' })

    const online = settings.audience === 'online'

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
                <PresetCard
                    active={!online}
                    onClick={() => applyPreset('inperson')}
                    icon={<Presentation size={16} />}
                    title="დარბაზში"
                    sub="ხმა მხოლოდ პროექტორზე"
                />
                <PresetCard
                    active={online}
                    onClick={() => applyPreset('online')}
                    icon={<Wifi size={16} />}
                    title="ონლაინ"
                    sub="+ ხმა სტუდენტების ტელეფონებზე"
                />
            </div>

            <details className="group rounded-xl border border-border bg-card">
                <summary className="flex cursor-pointer select-none items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground">
                    <span className="transition-transform group-open:rotate-90">▸</span> დამატებითი პარამეტრები
                </summary>
                <div className="space-y-5 px-4 pb-4 pt-1">
                    <div className="grid gap-2 sm:grid-cols-2">
                        {BOOL_FIELDS.map((f) => (
                            <div
                                key={f.key}
                                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
                            >
                                <span className="text-foreground">{f.label}</span>
                                <Switch
                                    checked={settings[f.key]}
                                    onCheckedChange={(c) => setField(f.key, c)}
                                    aria-label={f.label}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                        {NUM_FIELDS.map((f) => (
                            <div key={f.key} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{f.label}</span>
                                    <span className="font-semibold tabular-nums text-foreground">
                                        {f.fmt(settings[f.key])}
                                    </span>
                                </div>
                                <Slider
                                    min={f.min}
                                    max={f.max}
                                    step={f.step}
                                    value={[settings[f.key]]}
                                    onValueChange={([v]) => setField(f.key, v ?? settings[f.key])}
                                    aria-label={f.label}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </details>

            <div className="flex gap-2">
                <Button onClick={() => onCreate(false, settings)} disabled={busy} className="gap-2">
                    <Plus size={16} /> შექმნა {online ? '(ონლაინ)' : '(დარბაზში)'}
                </Button>
                <Button
                    onClick={() => onCreate(true, settings)}
                    disabled={busy}
                    variant="secondary"
                    className="gap-2"
                    title="ოთახი 8 ფეიქ მონაწილით და მზა პასუხებით, რომ ნახო როგორ მუშაობს"
                >
                    <FlaskConical size={16} /> დემო
                </Button>
            </div>
        </div>
    )
}

function PresetCard({
    active,
    onClick,
    icon,
    title,
    sub,
}: {
    active: boolean
    onClick: () => void
    icon: React.ReactNode
    title: string
    sub: string
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'flex flex-col items-start gap-0.5 rounded-xl border px-4 py-3 text-left text-sm transition',
                active
                    ? 'border-primary bg-primary/10 text-foreground ring-2 ring-primary/30'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-accent'
            )}
        >
            <span className="flex items-center gap-1.5 font-semibold">
                {icon} {title}
            </span>
            <span className="text-xs text-muted-foreground">{sub}</span>
        </button>
    )
}

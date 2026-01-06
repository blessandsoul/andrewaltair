"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TbSettings, TbBrandTelegram, TbBell, TbDatabase, TbCheck, TbLoader2, TbArrowLeft } from "react-icons/tb"
import Link from "next/link"

interface SettingField {
    key: string
    label: string
    description: string
    type: 'text' | 'password' | 'number'
    placeholder: string
    icon: React.ReactNode
}

const SETTINGS_CONFIG: SettingField[] = [
    {
        key: 'telegram_bot_token',
        label: 'Telegram Bot Token',
        description: 'Get this from @BotFather on Telegram',
        type: 'password',
        placeholder: '123456789:ABCdefGHI...',
        icon: <TbBrandTelegram className="w-5 h-5 text-blue-500" />
    },
    {
        key: 'telegram_chat_id',
        label: 'Telegram Chat ID',
        description: 'Your Telegram user ID or group ID for alerts',
        type: 'text',
        placeholder: '-1001234567890',
        icon: <TbBrandTelegram className="w-5 h-5 text-blue-500" />
    },
    {
        key: 'alert_threshold',
        label: 'Alert Threshold (%)',
        description: 'Trigger alert when traffic exceeds baseline by this percentage',
        type: 'number',
        placeholder: '200',
        icon: <TbBell className="w-5 h-5 text-orange-500" />
    },
    {
        key: 'data_retention_days',
        label: 'Data Retention (Days)',
        description: 'Automatically delete old tracking data after this many days',
        type: 'number',
        placeholder: '30',
        icon: <TbDatabase className="w-5 h-5 text-purple-500" />
    }
]

export default function AdminSettingsPage() {
    const [values, setValues] = useState<Record<string, string>>({})
    const [originalValues, setOriginalValues] = useState<Record<string, boolean>>({})
    const [saving, setSaving] = useState<string | null>(null)
    const [saved, setSaved] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings')
            const data = await res.json()
            if (data.success) {
                const vals: Record<string, string> = {}
                const hasVals: Record<string, boolean> = {}
                data.settings.forEach((s: any) => {
                    vals[s.key] = s.key.includes('token') ? '' : s.value || ''
                    hasVals[s.key] = s.hasValue
                })
                setValues(vals)
                setOriginalValues(hasVals)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const saveSetting = async (key: string) => {
        setSaving(key)
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value: values[key] })
            })
            if (res.ok) {
                setSaved(key)
                setOriginalValues(prev => ({ ...prev, [key]: !!values[key] }))
                setTimeout(() => setSaved(null), 2000)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setSaving(null)
        }
    }

    const testTelegram = async () => {
        try {
            const res = await fetch('/api/tracking/anomalies/test', { method: 'POST' })
            const data = await res.json()
            if (data.success) {
                alert('✅ Test message sent successfully!')
            } else {
                alert('❌ Failed: ' + (data.error || 'Unknown error'))
            }
        } catch (e) {
            alert('❌ Failed to send test message')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <TbLoader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/analytics">
                    <Button variant="ghost" size="icon">
                        <TbArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <TbSettings className="w-8 h-8 text-primary" />
                        Analytics Settings
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Configure alerts, integrations, and data policies
                    </p>
                </div>
            </div>

            {/* Settings Cards */}
            <div className="space-y-6">
                {/* Telegram Section */}
                <Card className="border-blue-500/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <TbBrandTelegram className="w-5 h-5 text-blue-500" />
                            Telegram Alerts
                        </CardTitle>
                        <CardDescription>
                            Receive instant notifications when anomalies are detected
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {SETTINGS_CONFIG.filter(s => s.key.includes('telegram')).map((setting) => (
                            <div key={setting.key} className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    {setting.label}
                                    {originalValues[setting.key] && (
                                        <Badge variant="secondary" className="text-xs">Configured</Badge>
                                    )}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type={setting.type}
                                        value={values[setting.key] || ''}
                                        onChange={(e) => setValues(prev => ({ ...prev, [setting.key]: e.target.value }))}
                                        placeholder={setting.placeholder}
                                        className="flex-1 px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    <Button
                                        onClick={() => saveSetting(setting.key)}
                                        disabled={saving === setting.key}
                                        variant={saved === setting.key ? "default" : "outline"}
                                        className="min-w-[100px]"
                                    >
                                        {saving === setting.key ? (
                                            <TbLoader2 className="w-4 h-4 animate-spin" />
                                        ) : saved === setting.key ? (
                                            <><TbCheck className="w-4 h-4 mr-1" /> Saved</>
                                        ) : (
                                            'Save'
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">{setting.description}</p>
                            </div>
                        ))}

                        <div className="pt-4 border-t">
                            <Button onClick={testTelegram} variant="outline" className="gap-2">
                                <TbBrandTelegram className="w-4 h-4" />
                                Send Test Message
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Other Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">System Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {SETTINGS_CONFIG.filter(s => !s.key.includes('telegram')).map((setting) => (
                            <div key={setting.key} className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    {setting.icon}
                                    {setting.label}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type={setting.type}
                                        value={values[setting.key] || ''}
                                        onChange={(e) => setValues(prev => ({ ...prev, [setting.key]: e.target.value }))}
                                        placeholder={setting.placeholder}
                                        className="flex-1 px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    <Button
                                        onClick={() => saveSetting(setting.key)}
                                        disabled={saving === setting.key}
                                        variant={saved === setting.key ? "default" : "outline"}
                                        className="min-w-[100px]"
                                    >
                                        {saving === setting.key ? (
                                            <TbLoader2 className="w-4 h-4 animate-spin" />
                                        ) : saved === setting.key ? (
                                            <><TbCheck className="w-4 h-4 mr-1" /> Saved</>
                                        ) : (
                                            'Save'
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">{setting.description}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Settings,
    User,
    Lock,
    Bell,
    Palette,
    Globe,
    Shield,
    Database,
    Mail,
    Save,
    Check,
    RefreshCw,
    Trash2,
    Download,
    Upload
} from "lucide-react"

export default function SettingsPage() {
    const [saved, setSaved] = React.useState(false)
    const [settings, setSettings] = React.useState({
        siteName: "Andrew Altair",
        siteDescription: "AI ინოვატორი და კონტენტ კრეატორი",
        email: "contact@andrewaltair.ge",
        adminPassword: "admin123",
        enableComments: true,
        moderateComments: true,
        enableNotifications: true,
        autoBackup: false
    })

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Settings className="w-8 h-8 text-indigo-500" />
                        პარამეტრები
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        საიტის და ადმინ პანელის კონფიგურაცია
                    </p>
                </div>
                <Button onClick={handleSave} className="gap-2">
                    {saved ? (
                        <>
                            <Check className="w-4 h-4" />
                            შენახულია!
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            შენახვა
                        </>
                    )}
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-500" />
                            ზოგადი
                        </CardTitle>
                        <CardDescription>საიტის ძირითადი პარამეტრები</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">საიტის სახელი</label>
                            <Input
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">აღწერა</label>
                            <Input
                                value={settings.siteDescription}
                                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                value={settings.email}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-500" />
                            უსაფრთხოება
                        </CardTitle>
                        <CardDescription>პაროლი და წვდომა</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">ადმინის პაროლი</label>
                            <Input
                                type="password"
                                value={settings.adminPassword}
                                onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">
                                შეცვალეთ ადმინ პანელში შესვლის პაროლი
                            </p>
                        </div>
                        <div className="pt-2">
                            <Button variant="outline" className="w-full gap-2">
                                <RefreshCw className="w-4 h-4" />
                                სესიების განახლება
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Comments Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-orange-500" />
                            კომენტარები
                        </CardTitle>
                        <CardDescription>კომენტარების მართვა</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ToggleSetting
                            label="კომენტარების დაშვება"
                            description="მომხმარებლებს შეუძლიათ დატოვონ კომენტარები"
                            checked={settings.enableComments}
                            onChange={(checked) => setSettings({ ...settings, enableComments: checked })}
                        />
                        <ToggleSetting
                            label="მოდერაცია"
                            description="ახალი კომენტარები საჭიროებს დამტკიცებას"
                            checked={settings.moderateComments}
                            onChange={(checked) => setSettings({ ...settings, moderateComments: checked })}
                        />
                        <ToggleSetting
                            label="შეტყობინებები"
                            description="მიიღეთ შეტყობინება ახალ კომენტარზე"
                            checked={settings.enableNotifications}
                            onChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
                        />
                    </CardContent>
                </Card>

                {/* Data Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="w-5 h-5 text-purple-500" />
                            მონაცემები
                        </CardTitle>
                        <CardDescription>ექსპორტი და სარეზერვო ასლები</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ToggleSetting
                            label="ავტო-სარეზერვო"
                            description="ყოველდღიური ავტომატური სარეზერვო ასლი"
                            checked={settings.autoBackup}
                            onChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
                        />
                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <Button variant="outline" className="gap-2">
                                <Download className="w-4 h-4" />
                                ექსპორტი
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Upload className="w-4 h-4" />
                                იმპორტი
                            </Button>
                        </div>
                        <Button variant="outline" className="w-full gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                            <Trash2 className="w-4 h-4" />
                            ქეშის გასუფთავება
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Info */}
            <Card className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                <Database className="w-6 h-6 text-indigo-500" />
                            </div>
                            <div>
                                <p className="font-medium">მონაცემთა შენახვა</p>
                                <p className="text-sm text-muted-foreground">
                                    JSON ფაილები • სამომავლოდ: Supabase/Firebase
                                </p>
                            </div>
                        </div>
                        <Badge variant="secondary">ლოკალური</Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Toggle Setting Component
function ToggleSetting({
    label,
    description,
    checked,
    onChange
}: {
    label: string
    description: string
    checked: boolean
    onChange: (checked: boolean) => void
}) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="font-medium text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-indigo-500" : "bg-muted"
                    }`}
            >
                <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "left-6" : "left-1"
                        }`}
                />
            </button>
        </div>
    )
}

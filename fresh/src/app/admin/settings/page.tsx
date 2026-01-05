"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TbSettings, TbWorld, TbShield, TbDatabase, TbDeviceFloppy, TbCheck, TbRefresh, TbTrash, TbDownload, TbUpload, TbPalette, TbSun, TbMoon, TbLanguage, TbMail, TbShare, TbChartBar, TbKey, TbWebhook, TbDeviceSdCard, TbTools, TbActivity, TbAlertTriangle, TbClock, TbCopy, TbEye, TbEyeOff, TbSend, TbPlus, TbCalendar, TbServer, TbCpu, TbHistory, TbAlertCircle, TbCircleCheck, TbCircleX, TbInfoCircle } from "react-icons/tb"

// Tab configuration
const tabs = [
    { id: "general", label: "ზოგადი", icon: TbSettings },
    { id: "theme", label: "თემა", icon: TbPalette },
    { id: "localization", label: "ენა", icon: TbLanguage },
    { id: "email", label: "ელფოსტა", icon: TbMail },
    { id: "social", label: "სოციალური", icon: TbShare },
    { id: "security", label: "უსაფრთხოება", icon: TbShield },
    { id: "analytics", label: "ანალიტიკა", icon: TbChartBar },
    { id: "api", label: "API", icon: TbKey },
    { id: "backups", label: "ბექაფები", icon: TbDeviceSdCard },
    { id: "maintenance", label: "მეინტენანსი", icon: TbTools },
    { id: "system", label: "სისტემა", icon: TbActivity },
]

export default function SettingsPage() {
    const [saved, setSaved] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true)
    const [activeTab, setActiveTab] = React.useState("general")

    // General Settings
    const [generalSettings, setGeneralSettings] = React.useState({
        siteName: "Andrew Altair",
        siteDescription: "AI ინოვატორი და კონტენტ კრეატორი",
        email: "contact@andrewaltair.ge",
        siteUrl: "https://andrewaltair.ge"
    })

    // Theme Settings
    const [themeSettings, setThemeSettings] = React.useState({
        mode: "dark" as "light" | "dark" | "system",
        primaryColor: "#6366f1",
        fontFamily: "inter"
    })

    // Localization Settings
    const [localizationSettings, setLocalizationSettings] = React.useState({
        language: "ka",
        timezone: "Asia/Tbilisi",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24h"
    })

    // Email Settings
    const [emailSettings, setEmailSettings] = React.useState({
        smtpHost: "",
        smtpPort: "587",
        smtpUser: "",
        smtpPassword: "",
        smtpSecure: true,
        fromEmail: "noreply@andrewaltair.ge",
        fromName: "Andrew Altair"
    })
    const [showSmtpPassword, setShowSmtpPassword] = React.useState(false)

    // Social Settings
    const [socialSettings, setSocialSettings] = React.useState({
        facebook: "https://www.facebook.com/andr3waltair",
        instagram: "https://www.instagram.com/andr3waltair/",
        youtube: "https://www.youtube.com/@AndrewAltair",
        twitter: "",
        linkedin: "",
        tiktok: "",
        enableSharing: true
    })

    // Security Settings
    const [securitySettings, setSecuritySettings] = React.useState({
        enable2FA: false,
        maxLoginAttempts: 5,
        sessionTimeout: 60,
        ipWhitelist: "",
        enableCaptcha: false,
        forceHttps: true
    })

    // Analytics Settings
    const [analyticsSettings, setAnalyticsSettings] = React.useState({
        googleAnalyticsId: "",
        facebookPixelId: "",
        customTrackingCode: "",
        enableInternalAnalytics: true
    })

    // API Settings
    const [apiSettings, setApiSettings] = React.useState({
        apiKey: "sk_live_xxxx_xxxx_xxxx_xxxx",
        enableApi: true,
        rateLimit: 100,
        webhookUrl: "",
        webhookSecret: ""
    })
    const [showApiKey, setShowApiKey] = React.useState(false)

    // Backup Settings
    const [backupSettings, setBackupSettings] = React.useState({
        autoBackup: true,
        backupFrequency: "daily",
        backupRetention: 30,
        storageLocation: "local"
    })
    const [backups] = React.useState([
        { id: 1, date: "2024-12-28 10:30", size: "2.4 MB", status: "success" },
        { id: 2, date: "2024-12-27 10:30", size: "2.3 MB", status: "success" },
        { id: 3, date: "2024-12-26 10:30", size: "2.2 MB", status: "success" },
    ])

    // Maintenance Settings
    const [maintenanceSettings, setMaintenanceSettings] = React.useState({
        enabled: false,
        message: "საიტი დროებით მიუწვდომელია. გთხოვთ სცადოთ მოგვიანებით.",
        whitelistedIPs: "",
        scheduledStart: "",
        scheduledEnd: ""
    })

    // System Logs
    const [logs, setLogs] = React.useState([
        { id: 1, type: "info", message: "მომხმარებელმა შეცვალა პარამეტრები", time: "5 წუთის წინ" },
        { id: 2, type: "success", message: "სარეზერვო ასლი შეიქმნა წარმატებით", time: "2 საათის წინ" },
        { id: 3, type: "warning", message: "დაბლოკილი შესვლის მცდელობა", time: "5 საათის წინ" },
        { id: 4, type: "error", message: "Email-ის გაგზავნა ვერ მოხერხდა", time: "1 დღის წინ" },
    ])

    // Fetch settings from MongoDB on mount
    React.useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch('/api/settings')
                if (res.ok) {
                    const data = await res.json()
                    const settings = data.settings || []
                    settings.forEach((s: { key: string; value: Record<string, unknown> }) => {
                        switch (s.key) {
                            case 'general': setGeneralSettings(prev => ({ ...prev, ...s.value })); break
                            case 'theme': setThemeSettings(prev => ({ ...prev, ...s.value as typeof prev })); break
                            case 'localization': setLocalizationSettings(prev => ({ ...prev, ...s.value })); break
                            case 'email': setEmailSettings(prev => ({ ...prev, ...s.value })); break
                            case 'social': setSocialSettings(prev => ({ ...prev, ...s.value })); break
                            case 'security': setSecuritySettings(prev => ({ ...prev, ...s.value })); break
                            case 'analytics': setAnalyticsSettings(prev => ({ ...prev, ...s.value })); break
                            case 'api': setApiSettings(prev => ({ ...prev, ...s.value })); break
                            case 'backup': setBackupSettings(prev => ({ ...prev, ...s.value })); break
                            case 'maintenance': setMaintenanceSettings(prev => ({ ...prev, ...s.value })); break
                        }
                    })
                }
            } catch (error) {
                console.error('Error fetching settings:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchSettings()
    }, [])

    // Save all settings to MongoDB
    const handleSave = async () => {
        setSaved(false)
        try {
            const settingsToSave = [
                { key: 'general', value: generalSettings, category: 'site' },
                { key: 'theme', value: themeSettings, category: 'appearance' },
                { key: 'localization', value: localizationSettings, category: 'site' },
                { key: 'email', value: emailSettings, category: 'communication' },
                { key: 'social', value: socialSettings, category: 'social' },
                { key: 'security', value: securitySettings, category: 'security' },
                { key: 'analytics', value: analyticsSettings, category: 'tracking' },
                { key: 'api', value: apiSettings, category: 'api' },
                { key: 'backup', value: backupSettings, category: 'system' },
                { key: 'maintenance', value: maintenanceSettings, category: 'system' },
            ]
            await Promise.all(settingsToSave.map(s =>
                fetch('/api/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(s)
                })
            ))
            setSaved(true)
            // Add log entry
            setLogs(prev => [{ id: Date.now(), type: 'success', message: 'პარამეტრები შენახულია', time: 'ახლახანს' }, ...prev.slice(0, 9)])
            setTimeout(() => setSaved(false), 2000)
        } catch (error) {
            console.error('Save settings error:', error)
            setLogs(prev => [{ id: Date.now(), type: 'error', message: 'პარამეტრების შენახვა ვერ მოხერხდა', time: 'ახლახანს' }, ...prev.slice(0, 9)])
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    const regenerateApiKey = () => {
        const newKey = "sk_live_" + Math.random().toString(36).substring(2, 15)
        setApiSettings({ ...apiSettings, apiKey: newKey })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <TbSettings className="w-8 h-8 text-indigo-500" />
                        პარამეტრები
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        საიტის და ადმინ პანელის სრული კონფიგურაცია
                    </p>
                </div>
                <Button onClick={handleSave} className="gap-2">
                    {saved ? (
                        <>
                            <TbCheck className="w-4 h-4" />
                            შენახულია!
                        </>
                    ) : (
                        <>
                            <TbDeviceFloppy className="w-4 h-4" />
                            შენახვა
                        </>
                    )}
                </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="flex flex-wrap h-auto gap-1 p-1 bg-muted/50">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="gap-2 data-[state=active]:bg-background"
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* General Tab */}
                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TbWorld className="w-5 h-5 text-blue-500" />
                                ზოგადი პარამეტრები
                            </CardTitle>
                            <CardDescription>საიტის ძირითადი ინფორმაცია</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">საიტის სახელი</label>
                                    <Input
                                        value={generalSettings.siteName}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">საიტის URL</label>
                                    <Input
                                        value={generalSettings.siteUrl}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, siteUrl: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">აღწერა</label>
                                <Input
                                    value={generalSettings.siteDescription}
                                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">საკონტაქტო Email</label>
                                <Input
                                    type="email"
                                    value={generalSettings.email}
                                    onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Theme Tab */}
                <TabsContent value="theme" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TbPalette className="w-5 h-5 text-pink-500" />
                                თემის პარამეტრები
                            </CardTitle>
                            <CardDescription>საიტის იერსახისა და დიზაინის კონფიგურაცია</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Color Mode */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">ფერის რეჟიმი</label>
                                <div className="flex gap-2">
                                    {[
                                        { id: "light", label: "ღია", icon: TbSun },
                                        { id: "dark", label: "მუქი", icon: TbMoon },
                                        { id: "system", label: "სისტემის", icon: TbSettings }
                                    ].map((mode) => (
                                        <Button
                                            key={mode.id}
                                            variant={themeSettings.mode === mode.id ? "default" : "outline"}
                                            className="flex-1 gap-2"
                                            onClick={() => setThemeSettings({ ...themeSettings, mode: mode.id as typeof themeSettings.mode })}
                                        >
                                            <mode.icon className="w-4 h-4" />
                                            {mode.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Primary Color */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">პირველადი ფერი</label>
                                <div className="flex gap-2">
                                    {[
                                        { color: "#6366f1", name: "Indigo" },
                                        { color: "#8b5cf6", name: "Violet" },
                                        { color: "#ec4899", name: "Pink" },
                                        { color: "#f97316", name: "Orange" },
                                        { color: "#22c55e", name: "Green" },
                                        { color: "#0ea5e9", name: "Sky" },
                                    ].map((c) => (
                                        <button
                                            key={c.color}
                                            className={`w-10 h-10 rounded-lg transition-all ${themeSettings.primaryColor === c.color ? "ring-2 ring-offset-2 ring-offset-background" : ""}`}
                                            style={{ backgroundColor: c.color }}
                                            onClick={() => setThemeSettings({ ...themeSettings, primaryColor: c.color })}
                                            title={c.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Font Family */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">ფონტი</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: "inter", name: "Inter" },
                                        { id: "roboto", name: "Roboto" },
                                        { id: "poppins", name: "Poppins" }
                                    ].map((font) => (
                                        <Button
                                            key={font.id}
                                            variant={themeSettings.fontFamily === font.id ? "default" : "outline"}
                                            onClick={() => setThemeSettings({ ...themeSettings, fontFamily: font.id })}
                                        >
                                            {font.name}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Logo Upload */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">ლოგო</label>
                                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                        <TbUpload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground">ატვირთეთ ლოგო</p>
                                        <Button variant="outline" size="sm" className="mt-2">
                                            არჩევა
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">ფავიკონი</label>
                                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                        <TbUpload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground">ატვირთეთ ფავიკონი</p>
                                        <Button variant="outline" size="sm" className="mt-2">
                                            არჩევა
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Localization Tab */}
                <TabsContent value="localization" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TbLanguage className="w-5 h-5 text-green-500" />
                                ლოკალიზაცია
                            </CardTitle>
                            <CardDescription>ენა, დროის ზონა და ფორმატები</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">საიტის ენა</label>
                                    <select
                                        className="w-full h-10 px-3 rounded-md border bg-background"
                                        value={localizationSettings.language}
                                        onChange={(e) => setLocalizationSettings({ ...localizationSettings, language: e.target.value })}
                                    >
                                        <option value="ka">🇬🇪 ქართული</option>
                                        <option value="en">🇬🇧 English</option>
                                        <option value="ru">🇷🇺 Русский</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">დროის ზონა</label>
                                    <select
                                        className="w-full h-10 px-3 rounded-md border bg-background"
                                        value={localizationSettings.timezone}
                                        onChange={(e) => setLocalizationSettings({ ...localizationSettings, timezone: e.target.value })}
                                    >
                                        <option value="Asia/Tbilisi">თბილისი (GMT+4)</option>
                                        <option value="Europe/London">ლონდონი (GMT+0)</option>
                                        <option value="America/New_York">ნიუ-იორკი (GMT-5)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">თარიღის ფორმატი</label>
                                    <select
                                        className="w-full h-10 px-3 rounded-md border bg-background"
                                        value={localizationSettings.dateFormat}
                                        onChange={(e) => setLocalizationSettings({ ...localizationSettings, dateFormat: e.target.value })}
                                    >
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">დროის ფორმატი</label>
                                    <select
                                        className="w-full h-10 px-3 rounded-md border bg-background"
                                        value={localizationSettings.timeFormat}
                                        onChange={(e) => setLocalizationSettings({ ...localizationSettings, timeFormat: e.target.value })}
                                    >
                                        <option value="24h">24 საათიანი</option>
                                        <option value="12h">12 საათიანი (AM/PM)</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Email Tab */}
                <TabsContent value="email" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TbMail className="w-5 h-5 text-orange-500" />
                                SMTP კონფიგურაცია
                            </CardTitle>
                            <CardDescription>ელფოსტის სერვერის პარამეტრები</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">SMTP სერვერი</label>
                                    <Input
                                        placeholder="smtp.gmail.com"
                                        value={emailSettings.smtpHost}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">პორტი</label>
                                    <Input
                                        placeholder="587"
                                        value={emailSettings.smtpPort}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">მომხმარებელი</label>
                                    <Input
                                        placeholder="user@gmail.com"
                                        value={emailSettings.smtpUser}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">პაროლი</label>
                                    <div className="relative">
                                        <Input
                                            type={showSmtpPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={emailSettings.smtpPassword}
                                            onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                                        >
                                            {showSmtpPassword ? <TbEyeOff className="w-4 h-4" /> : <TbEye className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <ToggleSetting
                                label="SSL/TLS"
                                description="უსაფრთხო კავშირის გამოყენება"
                                checked={emailSettings.smtpSecure}
                                onChange={(checked) => setEmailSettings({ ...emailSettings, smtpSecure: checked })}
                            />
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">გამომგზავნის Email</label>
                                    <Input
                                        value={emailSettings.fromEmail}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">გამომგზავნის სახელი</label>
                                    <Input
                                        value={emailSettings.fromName}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <Button variant="outline" className="gap-2">
                                <TbSend className="w-4 h-4" />
                                ტესტ მეილის გაგზავნა
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Social Tab */}
                <TabsContent value="social" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TbShare className="w-5 h-5 text-blue-500" />
                                სოციალური ქსელები
                            </CardTitle>
                            <CardDescription>სოციალური მედიის ბმულები და ინტეგრაციები</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Facebook</label>
                                    <Input
                                        placeholder="https://facebook.com/..."
                                        value={socialSettings.facebook}
                                        onChange={(e) => setSocialSettings({ ...socialSettings, facebook: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Instagram</label>
                                    <Input
                                        placeholder="https://instagram.com/..."
                                        value={socialSettings.instagram}
                                        onChange={(e) => setSocialSettings({ ...socialSettings, instagram: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">YouTube</label>
                                    <Input
                                        placeholder="https://youtube.com/@..."
                                        value={socialSettings.youtube}
                                        onChange={(e) => setSocialSettings({ ...socialSettings, youtube: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Twitter/X</label>
                                    <Input
                                        placeholder="https://twitter.com/..."
                                        value={socialSettings.twitter}
                                        onChange={(e) => setSocialSettings({ ...socialSettings, twitter: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">LinkedIn</label>
                                    <Input
                                        placeholder="https://linkedin.com/in/..."
                                        value={socialSettings.linkedin}
                                        onChange={(e) => setSocialSettings({ ...socialSettings, linkedin: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">TikTok</label>
                                    <Input
                                        placeholder="https://tiktok.com/@..."
                                        value={socialSettings.tiktok}
                                        onChange={(e) => setSocialSettings({ ...socialSettings, tiktok: e.target.value })}
                                    />
                                </div>
                            </div>
                            <ToggleSetting
                                label="გაზიარების ღილაკები"
                                description="პოსტებზე სოციალური გაზიარების ღილაკების ჩვენება"
                                checked={socialSettings.enableSharing}
                                onChange={(checked) => setSocialSettings({ ...socialSettings, enableSharing: checked })}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TbShield className="w-5 h-5 text-green-500" />
                                უსაფრთხოების პარამეტრები
                            </CardTitle>
                            <CardDescription>დაცვა და წვდომის კონტროლი</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ToggleSetting
                                label="ორფაქტორიანი ავტორიზაცია (2FA)"
                                description="დამატებითი დაცვა ადმინ პანელისთვის"
                                checked={securitySettings.enable2FA}
                                onChange={(checked) => setSecuritySettings({ ...securitySettings, enable2FA: checked })}
                            />
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">მაქსიმალური შესვლის მცდელობა</label>
                                    <Input
                                        type="number"
                                        value={securitySettings.maxLoginAttempts}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })}
                                    />
                                    <p className="text-xs text-muted-foreground">წარუმატებელი მცდელობების შემდეგ დროებით დაბლოკვა</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">სესიის ვადა (წუთი)</label>
                                    <Input
                                        type="number"
                                        value={securitySettings.sessionTimeout}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                                    />
                                    <p className="text-xs text-muted-foreground">უმოქმედობის შემთხვევაში გასვლა</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">IP Whitelist</label>
                                <textarea
                                    className="w-full h-24 px-3 py-2 rounded-md border bg-background resize-none"
                                    placeholder="192.168.1.1&#10;10.0.0.1"
                                    value={securitySettings.ipWhitelist}
                                    onChange={(e) => setSecuritySettings({ ...securitySettings, ipWhitelist: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">თითო IP ხაზზე. ცარიელი = ყველა დაშვებული</p>
                            </div>
                            <ToggleSetting
                                label="CAPTCHA"
                                description="ადმინ შესვლაზე CAPTCHA-ს მოთხოვნა"
                                checked={securitySettings.enableCaptcha}
                                onChange={(checked) => setSecuritySettings({ ...securitySettings, enableCaptcha: checked })}
                            />
                            <ToggleSetting
                                label="HTTPS იძულება"
                                description="HTTP მოთხოვნების გადამისამართება HTTPS-ზე"
                                checked={securitySettings.forceHttps}
                                onChange={(checked) => setSecuritySettings({ ...securitySettings, forceHttps: checked })}
                            />
                            <Button variant="outline" className="gap-2 text-orange-500">
                                <TbRefresh className="w-4 h-4" />
                                ყველა სესიის დასრულება
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TbChartBar className="w-5 h-5 text-purple-500" />
                                ანალიტიკის ინტეგრაციები
                            </CardTitle>
                            <CardDescription>Tracking კოდები და ანალიტიკის სერვისები</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Google Analytics ID</label>
                                <Input
                                    placeholder="G-XXXXXXXXXX"
                                    value={analyticsSettings.googleAnalyticsId}
                                    onChange={(e) => setAnalyticsSettings({ ...analyticsSettings, googleAnalyticsId: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Facebook Pixel ID</label>
                                <Input
                                    placeholder="XXXXXXXXXXXXXXX"
                                    value={analyticsSettings.facebookPixelId}
                                    onChange={(e) => setAnalyticsSettings({ ...analyticsSettings, facebookPixelId: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Custom Tracking TbCode</label>
                                <textarea
                                    className="w-full h-32 px-3 py-2 rounded-md border bg-background font-mono text-sm resize-none"
                                    placeholder="<script>...</script>"
                                    value={analyticsSettings.customTrackingCode}
                                    onChange={(e) => setAnalyticsSettings({ ...analyticsSettings, customTrackingCode: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">ნებისმიერი დამატებითი tracking სკრიპტი</p>
                            </div>
                            <ToggleSetting
                                label="შიდა ანალიტიკა"
                                description="ჩაშენებული ანალიტიკის სისტემის გამოყენება"
                                checked={analyticsSettings.enableInternalAnalytics}
                                onChange={(checked) => setAnalyticsSettings({ ...analyticsSettings, enableInternalAnalytics: checked })}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* API Tab */}
                <TabsContent value="api" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TbKey className="w-5 h-5 text-yellow-500" />
                                API კონფიგურაცია
                            </CardTitle>
                            <CardDescription>API გასაღებები და TbWebhook-ები</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ToggleSetting
                                label="API წვდომა"
                                description="გარე API მოთხოვნების დაშვება"
                                checked={apiSettings.enableApi}
                                onChange={(checked) => setApiSettings({ ...apiSettings, enableApi: checked })}
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-medium">API გასაღები</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Input
                                            type={showApiKey ? "text" : "password"}
                                            value={apiSettings.apiKey}
                                            readOnly
                                            className="pr-20 font-mono"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-10 top-0 h-full px-2"
                                            onClick={() => setShowApiKey(!showApiKey)}
                                        >
                                            {showApiKey ? <TbEyeOff className="w-4 h-4" /> : <TbEye className="w-4 h-4" />}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-2"
                                            onClick={() => copyToClipboard(apiSettings.apiKey)}
                                        >
                                            <TbCopy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <Button variant="outline" onClick={regenerateApiKey} className="gap-2">
                                        <TbRefresh className="w-4 h-4" />
                                        რეგენერაცია
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">რეიტ ლიმიტი (მოთხ./წთ)</label>
                                <Input
                                    type="number"
                                    value={apiSettings.rateLimit}
                                    onChange={(e) => setApiSettings({ ...apiSettings, rateLimit: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">TbWebhook URL</label>
                                <Input
                                    placeholder="https://your-server.com/webhook"
                                    value={apiSettings.webhookUrl}
                                    onChange={(e) => setApiSettings({ ...apiSettings, webhookUrl: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">TbWebhook Secret</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={apiSettings.webhookSecret}
                                    onChange={(e) => setApiSettings({ ...apiSettings, webhookSecret: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Backups Tab */}
                <TabsContent value="backups" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TbDeviceSdCard className="w-5 h-5 text-cyan-500" />
                                სარეზერვო ასლები
                            </CardTitle>
                            <CardDescription>ბექაფების მართვა და აღდგენა</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Button className="gap-2">
                                    <TbPlus className="w-4 h-4" />
                                    ახალი ბექაფი
                                </Button>
                                <Button variant="outline" className="gap-2">
                                    <TbUpload className="w-4 h-4" />
                                    იმპორტი
                                </Button>
                            </div>

                            <div className="border rounded-lg divide-y">
                                {backups.map((backup) => (
                                    <div key={backup.id} className="flex items-center justify-between p-3">
                                        <div className="flex items-center gap-3">
                                            <TbDatabase className="w-5 h-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium text-sm">{backup.date}</p>
                                                <p className="text-xs text-muted-foreground">{backup.size}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-green-500">
                                                <TbCircleCheck className="w-3 h-3 mr-1" />
                                                წარმატებული
                                            </Badge>
                                            <Button variant="ghost" size="sm">
                                                <TbDownload className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <TbRefresh className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-red-500">
                                                <TbTrash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t space-y-4">
                                <h4 className="font-medium">ავტომატური ბექაფი</h4>
                                <ToggleSetting
                                    label="ავტო-ბექაფი"
                                    description="დაგეგმილი ავტომატური სარეზერვო ასლი"
                                    checked={backupSettings.autoBackup}
                                    onChange={(checked) => setBackupSettings({ ...backupSettings, autoBackup: checked })}
                                />
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">სიხშირე</label>
                                        <select
                                            className="w-full h-10 px-3 rounded-md border bg-background"
                                            value={backupSettings.backupFrequency}
                                            onChange={(e) => setBackupSettings({ ...backupSettings, backupFrequency: e.target.value })}
                                        >
                                            <option value="hourly">ყოველ საათს</option>
                                            <option value="daily">ყოველდღე</option>
                                            <option value="weekly">ყოველ კვირას</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">შენახვა (დღე)</label>
                                        <Input
                                            type="number"
                                            value={backupSettings.backupRetention}
                                            onChange={(e) => setBackupSettings({ ...backupSettings, backupRetention: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Maintenance Tab */}
                <TabsContent value="maintenance" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TbTools className="w-5 h-5 text-amber-500" />
                                მეინტენანს რეჟიმი
                            </CardTitle>
                            <CardDescription>საიტის დროებით გამორთვა</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className={`p-4 rounded-lg border-2 ${maintenanceSettings.enabled ? "border-amber-500 bg-amber-500/10" : "border-muted"}`}>
                                <ToggleSetting
                                    label="მეინტენანს რეჟიმი"
                                    description={maintenanceSettings.enabled ? "⚠️ საიტი ამჟამად მიუწვდომელია მომხმარებლებისთვის" : "საიტი ნორმალურад მუშაობს"}
                                    checked={maintenanceSettings.enabled}
                                    onChange={(checked) => setMaintenanceSettings({ ...maintenanceSettings, enabled: checked })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">შეტყობინება</label>
                                <textarea
                                    className="w-full h-24 px-3 py-2 rounded-md border bg-background resize-none"
                                    value={maintenanceSettings.message}
                                    onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, message: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">გამონაკლისი IP-ები</label>
                                <textarea
                                    className="w-full h-20 px-3 py-2 rounded-md border bg-background resize-none"
                                    placeholder="192.168.1.1&#10;127.0.0.1"
                                    value={maintenanceSettings.whitelistedIPs}
                                    onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, whitelistedIPs: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">ეს IP-ები იქნება დაშვებული მეინტენანსის დროსაც</p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">დაგეგმილი დაწყება</label>
                                    <Input
                                        type="datetime-local"
                                        value={maintenanceSettings.scheduledStart}
                                        onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, scheduledStart: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">დაგეგმილი დასრულება</label>
                                    <Input
                                        type="datetime-local"
                                        value={maintenanceSettings.scheduledEnd}
                                        onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, scheduledEnd: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* System Tab */}
                <TabsContent value="system" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TbServer className="w-5 h-5 text-blue-500" />
                                    სისტემის ინფორმაცია
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Next.js ვერსია</span>
                                    <Badge variant="secondary">14.0.4</Badge>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Node.js ვერსია</span>
                                    <Badge variant="secondary">20.10.0</Badge>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">React ვერსია</span>
                                    <Badge variant="secondary">18.2.0</Badge>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <TbCpu className="w-4 h-4" /> CPU
                                    </span>
                                    <span className="text-sm">45%</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <TbCpu className="w-4 h-4" /> მეხსიერება
                                    </span>
                                    <span className="text-sm">2.4 GB / 8 GB</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TbActivity className="w-5 h-5 text-green-500" />
                                    სისტემის სტატუსი
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { name: "Web სერვერი", status: "online" },
                                    { name: "მონაცემთა ბაზა", status: "online" },
                                    { name: "ქეში", status: "online" },
                                    { name: "Email სერვისი", status: "warning" },
                                ].map((service) => (
                                    <div key={service.name} className="flex justify-between py-2 border-b last:border-0">
                                        <span>{service.name}</span>
                                        <Badge variant={service.status === "online" ? "default" : "secondary"} className={service.status === "online" ? "bg-green-500" : "bg-amber-500"}>
                                            {service.status === "online" ? "ონლაინ" : "გაფრთხილება"}
                                        </Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <TbHistory className="w-5 h-5 text-purple-500" />
                                    აქტივობის ლოგები
                                </CardTitle>
                                <CardDescription>ბოლო მოქმედებები</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2 text-red-500">
                                <TbTrash className="w-4 h-4" />
                                გასუფთავება
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {logs.map((log) => (
                                    <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                        {log.type === "info" && <TbInfoCircle className="w-5 h-5 text-blue-500 mt-0.5" />}
                                        {log.type === "success" && <TbCircleCheck className="w-5 h-5 text-green-500 mt-0.5" />}
                                        {log.type === "warning" && <TbAlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />}
                                        {log.type === "error" && <TbCircleX className="w-5 h-5 text-red-500 mt-0.5" />}
                                        <div className="flex-1">
                                            <p className="text-sm">{log.message}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                <TbClock className="w-3 h-3" />
                                                {log.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-red-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-500">
                                <TbAlertCircle className="w-5 h-5" />
                                საშიში ზონა
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg border border-red-500/20 bg-red-500/5">
                                <div>
                                    <p className="font-medium">ქეშის გასუფთავება</p>
                                    <p className="text-sm text-muted-foreground">ყველა დროებითი ფაილის წაშლა</p>
                                </div>
                                <Button variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10">
                                    <TbTrash className="w-4 h-4 mr-2" />
                                    გასუფთავება
                                </Button>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border border-red-500/20 bg-red-500/5">
                                <div>
                                    <p className="font-medium">პარამეტრების გადატვირთვა</p>
                                    <p className="text-sm text-muted-foreground">ყველა პარამეტრის დაბრუნება ნაგულისხმევზე</p>
                                </div>
                                <Button variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10">
                                    <TbRefresh className="w-4 h-4 mr-2" />
                                    გადატვირთვა
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
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

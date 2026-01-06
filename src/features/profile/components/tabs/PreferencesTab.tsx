/**
 * Preferences Tab - Notifications, theme, and language
 */

"use client"

import * as React from "react"
import { TbSettings, TbBell, TbPalette, TbWorld } from "react-icons/tb"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { SettingToggle } from "../shared/SettingToggle"
import { cn } from "@/lib/utils"

export function PreferencesTab() {
    const [notifications, setNotifications] = React.useState({
        email: true,
        push: true,
        marketing: false,
    })
    const [selectedTheme, setSelectedTheme] = React.useState<"dark" | "light" | "system">("dark")
    const [selectedLanguage, setSelectedLanguage] = React.useState("ka")

    return (
        <Card className="border-border/50 shadow-xl backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TbSettings className="w-5 h-5 text-primary" />
                    პარამეტრები
                </CardTitle>
                <CardDescription>მორგეთ თქვენი გამოცდილება</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Notification Settings */}
                <div className="p-4 rounded-lg border border-border">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                        <TbBell className="w-4 h-4" />
                        შეტყობინებები
                    </h3>
                    <div className="space-y-4">
                        <SettingToggle
                            label="ელ. ფოსტის შეტყობინებები"
                            description="მიიღეთ განახლებები ელ. ფოსტით"
                            checked={notifications.email}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                            className="border-0 p-0"
                        />
                        <SettingToggle
                            label="Push შეტყობინებები"
                            description="მიიღეთ მყისიერი შეტყობინებები"
                            checked={notifications.push}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                            className="border-0 p-0"
                        />
                        <SettingToggle
                            label="მარკეტინგული წერილები"
                            description="მიიღეთ ინფორმაცია ახალი ფუნქციების შესახებ"
                            checked={notifications.marketing}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                            className="border-0 p-0"
                        />
                    </div>
                </div>

                {/* Theme Selection */}
                <div className="p-4 rounded-lg border border-border">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                        <TbPalette className="w-4 h-4" />
                        გარეგნობა
                    </h3>
                    <div className="flex gap-3">
                        {(["dark", "light", "system"] as const).map((theme) => (
                            <button
                                key={theme}
                                onClick={() => setSelectedTheme(theme)}
                                className={cn(
                                    "flex-1 px-4 py-2 rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    selectedTheme === theme
                                        ? "border-primary bg-primary/10 font-medium"
                                        : "border-border hover:border-primary/50"
                                )}
                            >
                                {theme === "dark" ? "მუქი" : theme === "light" ? "ღია" : "სისტემური"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Language Selection */}
                <div className="p-4 rounded-lg border border-border">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                        <TbWorld className="w-4 h-4" />
                        ენა
                    </h3>
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="ka">ქართული</option>
                        <option value="en">English</option>
                        <option value="ru">Русский</option>
                    </select>
                </div>
            </CardContent>
        </Card>
    )
}

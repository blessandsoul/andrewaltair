/**
 * Privacy Tab - Profile visibility and privacy settings
 */

"use client"

import * as React from "react"
import { TbUsers, TbEye } from "react-icons/tb"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { SettingToggle } from "../shared/SettingToggle"
import { useAuth } from "@/lib/auth"
import type { PrivacySettings } from "../../types"

export function PrivacyTab() {
    const { user } = useAuth()
    const [settings, setSettings] = React.useState<PrivacySettings>({
        profileVisible: true,
        showEmail: false,
        showActivity: true,
        showSubscriptions: true,
        allowMessages: true,
    })

    const handleToggle = (key: keyof PrivacySettings) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
        // TODO: Auto-save to API or show save button
    }

    return (
        <Card className="border-border/50 shadow-xl backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TbUsers className="w-5 h-5 text-primary" />
                    პროფილის ხილვადობა
                </CardTitle>
                <CardDescription>მართეთ ვინ ხედავს თქვენს ინფორმაციას</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Main Profile Visibility */}
                <div className="p-4 rounded-lg border border-border">
                    <SettingToggle
                        label="საჯარო პროფილი"
                        description="სხვა მომხმარებლებს შეუძლიათ თქვენი პროფილის ნახვა"
                        checked={settings.profileVisible}
                        onCheckedChange={() => handleToggle("profileVisible")}
                        className="border-0 p-0"
                    />
                </div>

                {/* Individual Privacy Settings */}
                <div className="space-y-4">
                    <SettingToggle
                        label="ელ. ფოსტის ჩვენება"
                        description="აჩვენეთ თქვენი ელ. ფოსტა პროფილზე"
                        checked={settings.showEmail}
                        onCheckedChange={() => handleToggle("showEmail")}
                    />
                    <SettingToggle
                        label="აქტივობის ჩვენება"
                        description="სხვებმა დაინახონ თქვენი აქტივობა"
                        checked={settings.showActivity}
                        onCheckedChange={() => handleToggle("showActivity")}
                    />
                    <SettingToggle
                        label="გამოწერების ჩვენება"
                        description="აჩვენეთ თქვენი გამოწერები"
                        checked={settings.showSubscriptions}
                        onCheckedChange={() => handleToggle("showSubscriptions")}
                    />
                    <SettingToggle
                        label="პირადი შეტყობინებები"
                        description="მიიღეთ შეტყობინებები სხვა მომხმარებლებისგან"
                        checked={settings.allowMessages}
                        onCheckedChange={() => handleToggle("allowMessages")}
                    />
                </div>

                {/* Public Profile Preview */}
                {settings.profileVisible && user && (
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-sm text-primary flex items-center gap-2">
                            <TbEye className="w-4 h-4" />
                            თქვენი პროფილი ხელმისაწვდომია: altair.ge/@{user.username}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

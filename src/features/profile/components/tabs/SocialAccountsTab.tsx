/**
 * Social Accounts Tab - Manage social media connections
 */

"use client"

import * as React from "react"
import { TbExternalLink, TbLink } from "react-icons/tb"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { SocialAccountCard } from "../shared/SocialAccountCard"
import type { SocialAccount } from "../../types"

const SOCIAL_PROVIDERS = [
    { id: "google", name: "Google" },
    { id: "github", name: "GitHub" },
    { id: "facebook", name: "Facebook" },
    { id: "telegram", name: "Telegram" },
] as const

interface SocialAccountsTabProps {
    socialAccounts?: SocialAccount[]
}

export function SocialAccountsTab({ socialAccounts = [] }: SocialAccountsTabProps) {
    const [accounts, setAccounts] = React.useState(socialAccounts)

    const handleConnect = (providerId: string) => {
        // TODO: Implement OAuth flow
    }

    const handleDisconnect = (providerId: string) => {
        // TODO: API call to disconnect
        setAccounts((prev) =>
            prev.map((acc) => (acc.id === providerId ? { ...acc, connected: false } : acc))
        )
    }

    return (
        <Card className="border-border/50 shadow-xl backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TbLink className="w-5 h-5 text-primary" />
                    დაკავშირებული ანგარიშები
                </CardTitle>
                <CardDescription>მართეთ სოციალური ქსელების კავშირები</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {SOCIAL_PROVIDERS.map((provider) => {
                    const account = accounts.find((a) => a.id === provider.id)
                    const isConnected = account?.connected || false

                    return (
                        <SocialAccountCard
                            key={provider.id}
                            provider={provider.id as any}
                            name={provider.name}
                            connected={isConnected}
                            onConnect={() => handleConnect(provider.id)}
                            onDisconnect={() => handleDisconnect(provider.id)}
                        />
                    )
                })}
            </CardContent>
        </Card>
    )
}

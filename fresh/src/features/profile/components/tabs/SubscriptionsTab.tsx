/**
 * Subscriptions Tab - Manage content subscriptions
 */

"use client"

import * as React from "react"
import { Bookmark, Wrench, FileText } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { SubscriptionCard } from "../shared/SubscriptionCard"
import type { SubscriptionItem } from "../../types"

interface SubscriptionsTabProps {
    subscriptions?: SubscriptionItem[]
    isLoading?: boolean
}

export function SubscriptionsTab({ subscriptions = [], isLoading = false }: SubscriptionsTabProps) {
    const [items, setItems] = React.useState(subscriptions)

    const handleToggle = (id: number) => {
        setItems((prev) =>
            prev.map((sub) => (sub.id === id ? { ...sub, subscribed: !sub.subscribed } : sub))
        )
        // TODO: API call to save
    }

    const toolsubs = items.filter((s) => s.type === "tool")
    const topicSubs = items.filter((s) => s.type === "topic")

    return (
        <Card className="border-border/50 shadow-xl backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-primary" />
                    გამოწერები
                </CardTitle>
                <CardDescription>მართეთ თქვენი გამოწერები</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading ? (
                    <p className="text-center text-muted-foreground py-8">იტვირთება...</p>
                ) : items.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">გამოწერები არ არის</p>
                ) : (
                    <>
                        {/* Tools Subscriptions */}
                        {toolSubs.length > 0 && (
                            <div>
                                <h3 className="font-medium mb-4 flex items-center gap-2">
                                    <Wrench className="w-4 h-4" />
                                    ინსტრუმენტები
                                </h3>
                                <div className="grid gap-3">
                                    {toolSubs.map((sub) => (
                                        <SubscriptionCard
                                            key={sub.id}
                                            name={sub.name}
                                            type={sub.type}
                                            subscribed={sub.subscribed}
                                            onToggle={() => handleToggle(sub.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Topics Subscriptions */}
                        {topicSubs.length > 0 && (
                            <div>
                                <h3 className="font-medium mb-4 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    თემები
                                </h3>
                                <div className="grid gap-3">
                                    {topicSubs.map((sub) => (
                                        <SubscriptionCard
                                            key={sub.id}
                                            name={sub.name}
                                            type={sub.type}
                                            subscribed={sub.subscribed}
                                            onToggle={() => handleToggle(sub.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Subscription Stats */}
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <p className="text-sm">
                                <span className="font-medium text-primary">{items.filter((s) => s.subscribed).length}</span>
                                <span className="text-muted-foreground"> აქტიური გამოწერა</span>
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

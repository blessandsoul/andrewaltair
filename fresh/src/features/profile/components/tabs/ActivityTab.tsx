/**
 * Activity Tab - User activity history
 */

"use client"

import * as React from "react"
import { History } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ActivityItem } from "../shared/ActivityItem"
import { ActivitySkeleton } from "../shared/ProfileSkeleton"
import type { ActivityItem as ActivityItemType } from "../../types"

interface ActivityTabProps {
    activity?: ActivityItemType[]
    isLoading?: boolean
}

export function ActivityTab({ activity = [], isLoading = false }: ActivityTabProps) {
    return (
        <Card className="border-border/50 shadow-xl backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    აქტივობის ისტორია
                </CardTitle>
                <CardDescription>თქვენი ბოლო მოქმედებები პლატფორმაზე</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <ActivitySkeleton />
                ) : activity.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">აქტივობა არ არის</p>
                ) : (
                    <>
                        <div className="space-y-4">
                            {activity.map((item) => (
                                <ActivityItem key={item.id} activity={item} />
                            ))}
                        </div>
                        <div className="mt-6 text-center">
                            <Button variant="outline" className="gap-2">
                                <History className="w-4 h-4" />
                                მეტის ნახვა
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

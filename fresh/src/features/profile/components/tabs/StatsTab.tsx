/**
 * Stats Tab - User statistics and analytics
 */

"use client"

import * as React from "react"
import { BarChart3, Clock, MousePointerClick, Wrench, Heart, TrendingUp } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { StatCard } from "../shared/StatCard"
import { StatsSkeleton } from "../shared/ProfileSkeleton"
import type { UserStats } from "../../types"

interface StatsTabProps {
    stats?: UserStats | null
    isLoading?: boolean
}

export function StatsTab({ stats, isLoading = false }: StatsTabProps) {
    return (
        <Card className="border-border/50 shadow-xl backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    სტატისტიკა
                </CardTitle>
                <CardDescription>თქვენი გამოყენების სტატისტიკა</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading ? (
                    <StatsSkeleton />
                ) : !stats ? (
                    <p className="text-center text-muted-foreground py-8">სტატისტიკა არ არის</p>
                ) : (
                    <>
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard
                                icon={Clock}
                                value={stats.totalTimeSpent}
                                label="ჯამური დრო"
                                color="blue"
                            />
                            <StatCard
                                icon={MousePointerClick}
                                value={stats.sessionsCount}
                                label="სესიები"
                                color="green"
                            />
                            <StatCard
                                icon={Wrench}
                                value={stats.toolsUsed}
                                label="ინსტრუმენტი"
                                color="purple"
                            />
                            <StatCard
                                icon={Heart}
                                value={stats.likesGiven}
                                label="მოწონება"
                                color="red"
                            />
                        </div>

                        {/* Top Sections */}
                        <div className="p-4 rounded-lg border border-border">
                            <h3 className="font-medium mb-4 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                ტოპ სექციები
                            </h3>
                            <div className="space-y-3">
                                {stats.topSections.map((section) => (
                                    <div key={section.name}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{section.name}</span>
                                            <span className="text-muted-foreground">{section.visits} ნახვა</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                                                style={{ width: `${section.percentage || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Activity Summary */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg border border-border">
                                <h3 className="font-medium mb-3">ბოლო აქტივობა</h3>
                                <p className="text-sm text-muted-foreground">{stats.lastActive}</p>
                            </div>
                            <div className="p-4 rounded-lg border border-border">
                                <h3 className="font-medium mb-3">ნანახი გვერდები</h3>
                                <p className="text-2xl font-bold text-primary">{stats.pagesVisited}</p>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

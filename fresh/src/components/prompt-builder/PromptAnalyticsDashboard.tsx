'use client'

import { useState, useEffect } from 'react'
import { TbChartBar, TbTrendingUp, TbClock, TbCircleCheck, TbCpu, TbActivity } from "react-icons/tb"
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AnalyticsData {
    eventCounts: Record<string, number>
    popularRoles: Array<{ role: string; count: number }>
    avgGenerationTimeMs: number
    dailyUsage: Array<{ date: string; count: number }>
    successRate: number
    modelUsage: Array<{ model: string; count: number }>
    totalEvents: number
}

export function PromptAnalyticsDashboard() {
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [days, setDays] = useState(30)

    useEffect(() => {
        fetchAnalytics()
    }, [days])

    const fetchAnalytics = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/prompts/analytics?days=${days}`)
            const stats = await res.json()
            // Only set data if it has expected structure (not error)
            if (stats && !stats.error && stats.eventCounts !== undefined) {
                setData(stats)
            } else {
                setData(null)
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error)
            setData(null)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <TbActivity className="w-6 h-6 animate-spin text-primary" />
            </div>
        )
    }

    if (!data || !data.eventCounts) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <TbChartBar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">ანალიტიკა ჯერ არ არის</p>
                <p className="text-xs mt-1">შექმენი პრომპტები სტატისტიკის სანახავად</p>
            </div>
        )
    }

    const maxRoleCount = Math.max(...((data.popularRoles || []).map(r => r.count)), 1)

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                    <TbChartBar className="w-4 h-4 text-blue-500" />
                    ანალიტიკა
                </h4>
                <div className="flex gap-1">
                    {[7, 30, 90].map(d => (
                        <Button
                            key={d}
                            variant={days === d ? 'default' : 'ghost'}
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => setDays(d)}
                        >
                            {d}დ
                        </Button>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="border">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                            <TbActivity className="w-3 h-3" />
                            სულ მოქმედებები
                        </div>
                        <p className="text-2xl font-bold">{data.totalEvents}</p>
                    </CardContent>
                </Card>

                <Card className="border">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                            <TbClock className="w-3 h-3" />
                            საშ. დრო
                        </div>
                        <p className="text-2xl font-bold">
                            {(data.avgGenerationTimeMs / 1000).toFixed(1)}წმ
                        </p>
                    </CardContent>
                </Card>

                <Card className="border">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                            <TbCircleCheck className="w-3 h-3" />
                            წარმატება
                        </div>
                        <p className="text-2xl font-bold text-green-500">
                            {data.successRate.toFixed(0)}%
                        </p>
                    </CardContent>
                </Card>

                <Card className="border">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                            <TbTrendingUp className="w-3 h-3" />
                            გენერაციები
                        </div>
                        <p className="text-2xl font-bold">
                            {data.eventCounts.generate || 0}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Popular Roles */}
            {data.popularRoles.length > 0 && (
                <div className="space-y-2">
                    <h5 className="text-xs font-medium text-muted-foreground">პოპულარული როლები</h5>
                    {data.popularRoles.slice(0, 5).map((role, i) => (
                        <div key={role.role} className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="truncate flex-1">{role.role}</span>
                                <span className="text-muted-foreground ml-2">{role.count}</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                                    style={{ width: `${(role.count / maxRoleCount) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Model Usage */}
            {data.modelUsage.length > 0 && (
                <div className="space-y-2">
                    <h5 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <TbCpu className="w-3 h-3" />
                        მოდელების გამოყენება
                    </h5>
                    <div className="flex flex-wrap gap-1">
                        {data.modelUsage.map(m => (
                            <span
                                key={m.model}
                                className="text-xs bg-secondary px-2 py-1 rounded-full"
                            >
                                {m.model.split('-')[0]} ({m.count})
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Event Breakdown */}
            <div className="space-y-2">
                <h5 className="text-xs font-medium text-muted-foreground">მოქმედებების ტიპები</h5>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(data.eventCounts).map(([event, count]) => (
                        <div key={event} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                            <span className="capitalize">{event}</span>
                            <span className="font-medium">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TbArrowUp, TbArrowDown, TbMinus, TbDoorEnter, TbDoorExit } from "react-icons/tb"

interface PerformanceData {
    pagePerformance: Array<{
        page: string
        views: number
        uniqueVisitors: number
        avgScrollDepth: number
    }>
    entryPages: Array<{ page: string; count: number }>
    exitPages: Array<{ page: string; count: number }>
    visitorBreakdown: { new: number; returning: number }
}

export function ContentPerformanceWidget() {
    const [data, setData] = useState<PerformanceData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/tracking/performance')
                const json = await res.json()
                if (json.success) {
                    setData(json.data)
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    Loading content analytics...
                </CardContent>
            </Card>
        )
    }

    if (!data) return null

    const totalVisitors = data.visitorBreakdown.new + data.visitorBreakdown.returning
    const returningPct = totalVisitors > 0
        ? Math.round((data.visitorBreakdown.returning / totalVisitors) * 100)
        : 0

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {/* New vs Returning */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Visitor Types</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">New</span>
                                <span className="text-sm font-medium">{data.visitorBreakdown.new}</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full">
                                <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${100 - returningPct}%` }}
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Returning</span>
                                <span className="text-sm font-medium">{data.visitorBreakdown.returning}</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full">
                                <div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: `${returningPct}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Entry/Exit Pages */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                        <TbDoorEnter className="w-4 h-4 text-green-500" />
                        Entry Pages
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {data.entryPages.slice(0, 3).map((p, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                            <span className="truncate max-w-[200px]">{p.page}</span>
                            <span className="text-muted-foreground">{p.count}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Top Content */}
            <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Top Content</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b">
                                    <th className="text-left py-2">Page</th>
                                    <th className="text-right py-2">Views</th>
                                    <th className="text-right py-2">Unique</th>
                                    <th className="text-right py-2">Scroll</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.pagePerformance.slice(0, 5).map((p, i) => (
                                    <tr key={i} className="border-b last:border-0">
                                        <td className="py-2 truncate max-w-[200px]">{p.page}</td>
                                        <td className="py-2 text-right">{p.views}</td>
                                        <td className="py-2 text-right">{p.uniqueVisitors}</td>
                                        <td className="py-2 text-right">
                                            <span className={
                                                (p.avgScrollDepth || 0) >= 70 ? 'text-green-500' :
                                                    (p.avgScrollDepth || 0) >= 40 ? 'text-yellow-500' : 'text-red-500'
                                            }>
                                                {p.avgScrollDepth || 0}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

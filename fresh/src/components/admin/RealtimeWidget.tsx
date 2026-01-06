"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TbUsers, TbDeviceDesktop, TbDeviceMobile, TbEye, TbSearch } from "react-icons/tb"

interface RealtimeData {
    online: number
    devices: { desktop: number; mobile: number; tablet: number }
    visitorsToday: number
    activitiesThisHour: number
    activePages: Array<{ page: string; viewers: number }>
    recentSearches: Array<{ query: string; time: string }>
    avgEngagementScore: number
}

export function RealtimeWidget() {
    const [data, setData] = useState<RealtimeData | null>(null)
    const [isLive, setIsLive] = useState(true)

    useEffect(() => {
        if (!isLive) return

        const fetchData = async () => {
            try {
                const res = await fetch('/api/tracking/realtime')
                const json = await res.json()
                if (json.success) {
                    setData(json.realtime)
                }
            } catch (e) {
                console.error(e)
            }
        }

        fetchData()
        const interval = setInterval(fetchData, 5000) // Poll every 5 seconds

        return () => clearInterval(interval)
    }, [isLive])

    if (!data) {
        return (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    Loading real-time data...
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-cyan-500/5">
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Real-Time
                    </span>
                    <button
                        onClick={() => setIsLive(!isLive)}
                        className={`text-xs px-2 py-1 rounded ${isLive ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'}`}
                    >
                        {isLive ? 'LIVE' : 'PAUSED'}
                    </button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Online Now */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TbUsers className="w-5 h-5 text-green-500" />
                        <span className="text-sm">Online Now</span>
                    </div>
                    <span className="text-2xl font-bold">{data.online}</span>
                </div>

                {/* Device Breakdown */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <TbDeviceDesktop className="w-3 h-3" /> {data.devices.desktop}
                    </span>
                    <span className="flex items-center gap-1">
                        <TbDeviceMobile className="w-3 h-3" /> {data.devices.mobile}
                    </span>
                    <span>📱 {data.devices.tablet}</span>
                </div>

                {/* Active Pages */}
                {data.activePages.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <TbEye className="w-3 h-3" /> Active Pages
                        </p>
                        {data.activePages.slice(0, 3).map((p, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <span className="truncate max-w-[180px]">{p.page}</span>
                                <span className="text-green-500 font-medium">{p.viewers}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Recent Searches */}
                {data.recentSearches.length > 0 && (
                    <div className="space-y-2 border-t pt-3">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <TbSearch className="w-3 h-3" /> Recent Searches
                        </p>
                        {data.recentSearches.map((s, i) => (
                            <div key={i} className="text-sm truncate text-muted-foreground">
                                "{s.query}"
                            </div>
                        ))}
                    </div>
                )}

                {/* Engagement Score */}
                <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Avg Engagement</span>
                        <span className={`text-sm font-medium ${data.avgEngagementScore >= 70 ? 'text-green-500' :
                                data.avgEngagementScore >= 40 ? 'text-yellow-500' : 'text-red-500'
                            }`}>
                            {data.avgEngagementScore}%
                        </span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full mt-1">
                        <div
                            className={`h-full rounded-full transition-all ${data.avgEngagementScore >= 70 ? 'bg-green-500' :
                                    data.avgEngagementScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                            style={{ width: `${data.avgEngagementScore}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

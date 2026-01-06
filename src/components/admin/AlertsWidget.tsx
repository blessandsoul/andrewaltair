"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TbAlertTriangle, TbBell, TbCheck, TbInfoCircle } from "react-icons/tb"

interface Alert {
    _id: string
    type: 'anomaly' | 'error' | 'system'
    severity: 'info' | 'warning' | 'critical'
    message: string
    createdAt: string
}

export function AlertsWidget() {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [status, setStatus] = useState<any>(null)

    const fetchAlerts = async () => {
        try {
            const res = await fetch('/api/tracking/anomalies')
            const data = await res.json()
            if (data.success) {
                setAlerts(data.alerts)
                setStatus(data.status)
            }
        } catch (e) {
            console.error(e)
        }
    }

    // Mark as read
    const markRead = async (id: string) => {
        try {
            await fetch('/api/tracking/anomalies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            // Remove from local state
            setAlerts(prev => prev.filter(a => a._id !== id))
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetchAlerts()
        // Poll every minute
        const interval = setInterval(fetchAlerts, 60000)
        return () => clearInterval(interval)
    }, [])

    return (
        <Card className="h-full border-l-4 border-l-indigo-500">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                        <TbBell className="w-5 h-5 text-indigo-500" />
                        System Alerts
                    </span>
                    {alerts.length > 0 && (
                        <Badge variant="destructive" className="animate-pulse">
                            {alerts.length} NEW
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {alerts.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground flex flex-col items-center gap-2">
                            <TbCheck className="w-8 h-8 text-green-500/50" />
                            <span className="text-sm">All systems normal</span>
                        </div>
                    ) : (
                        alerts.map(alert => (
                            <div key={alert._id} className="flex gap-3 bg-muted/50 p-3 rounded-lg text-sm group">
                                <div className="mt-0.5">
                                    {alert.severity === 'critical' ? (
                                        <TbAlertTriangle className="w-4 h-4 text-red-500" />
                                    ) : (
                                        <TbInfoCircle className="w-4 h-4 text-blue-500" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="font-medium">{alert.message}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(alert.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => markRead(alert._id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-background border px-2 py-1 rounded h-fit hover:bg-muted"
                                >
                                    Dismiss
                                </button>
                            </div>
                        ))
                    )}

                    {/* Status Footer */}
                    {status && (
                        <div className="pt-2 border-t mt-2 flex items-center justify-between text-xs text-muted-foreground">
                            <span>Current Load: {status.currentLoad} visitors/hr</span>
                            <span className={status.trafficStatus === 'high' ? 'text-green-500 font-bold' : ''}>
                                Status: {status.trafficStatus.toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

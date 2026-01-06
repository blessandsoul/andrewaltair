"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TbFilter } from "react-icons/tb"

interface FunnelStep {
    name: string
    count: number
    stepIndex: number
    conversionRate: number
    dropOff: number
}

export function FunnelChart() {
    const [data, setData] = useState<FunnelStep[]>([])
    const [loading, setLoading] = useState(true)
    const [funnelName, setFunnelName] = useState("")

    useEffect(() => {
        async function fetchFunnel() {
            try {
                const res = await fetch('/api/tracking/funnel')
                const json = await res.json()
                if (json.success) {
                    setData(json.steps)
                    setFunnelName(json.funnelName)
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchFunnel()
    }, [])

    if (loading) return <div className="h-[300px] flex items-center justify-center text-muted-foreground">იტვირთება...</div>

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TbFilter className="w-5 h-5 text-indigo-500" />
                    {funnelName || "Conversion Funnel"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {data.map((step, i) => (
                        <div key={i} className="relative">
                            {/* Connector Line */}
                            {i < data.length - 1 && (
                                <div className="absolute left-6 top-10 bottom-[-24px] w-0.5 bg-muted z-0" />
                            )}

                            <div className="flex items-start gap-4 relative z-10">
                                {/* Step Circle */}
                                <div className={`
                                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-4 border-background shrink-0
                                    ${i === 0 ? 'bg-indigo-500 text-white' : 'bg-indigo-500/10 text-indigo-500'}
                                `}>
                                    {i + 1}
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{step.name}</span>
                                        <span className="font-bold">{step.count} users</span>
                                    </div>

                                    {/* Bar */}
                                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                            style={{ width: `${step.conversionRate}%` }}
                                        />
                                    </div>

                                    {/* Metrics */}
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Conversion: {step.conversionRate}%</span>
                                        {i > 0 && <span className="text-red-500">Drop-off: {step.dropOff}%</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

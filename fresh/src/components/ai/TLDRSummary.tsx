"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TbSparkles, TbCheck, TbClock } from "react-icons/tb"

interface TLDRSummaryProps {
    summary: string
    keyPoints?: string[]
    readingTime?: number
}

// TL;DR Summary component for article overview
export function TLDRSummary({ summary, keyPoints, readingTime }: TLDRSummaryProps) {
    return (
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="gap-1">
                        <TbSparkles className="h-3 w-3" />
                        AI შეჯამება
                    </Badge>
                    {readingTime && (
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <TbClock className="h-3 w-3" />
                            {readingTime} წთ
                        </span>
                    )}
                </div>

                <p className="text-foreground/90 leading-relaxed mb-4">{summary}</p>

                {keyPoints && keyPoints.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">ძირითადი საკითხები:</p>
                        <ul className="space-y-1.5">
                            {keyPoints.map((point, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <TbCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default TLDRSummary

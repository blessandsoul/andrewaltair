"use client"

import * as React from "react"
import { TbHistory, TbClock, TbUser, TbArrowBack, TbChevronRight } from "react-icons/tb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Version {
    _id: string
    version: number
    title: string
    content: string
    changedBy: string
    changeNote?: string
    createdAt: string
}

interface VersionHistoryProps {
    articleId: string
    currentVersion: number
    onRestore?: (version: Version) => void
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("ka-GE", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export function VersionHistory({ articleId, currentVersion, onRestore }: VersionHistoryProps) {
    const [versions, setVersions] = React.useState<Version[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [selectedVersion, setSelectedVersion] = React.useState<Version | null>(null)
    const [showDiff, setShowDiff] = React.useState(false)

    React.useEffect(() => {
        async function fetchVersions() {
            try {
                const res = await fetch(`/api/encyclopedia/articles/${articleId}/versions`)
                if (res.ok) {
                    const data = await res.json()
                    setVersions(data.versions || [])
                }
            } catch (error) {
                console.error("Error fetching versions:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchVersions()
    }, [articleId])

    if (isLoading) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            </div>
        )
    }

    if (versions.length === 0) {
        return (
            <div className="p-6 text-center text-muted-foreground">
                <TbHistory className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>ვერსიების ისტორია ცარიელია</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <TbHistory className="w-5 h-5" />
                <h3 className="font-semibold">ვერსიების ისტორია</h3>
                <Badge variant="secondary">{versions.length} ვერსია</Badge>
            </div>

            {selectedVersion ? (
                <div className="space-y-4">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedVersion(null)}>
                        <TbArrowBack className="w-4 h-4 mr-2" />
                        უკან
                    </Button>
                    <div className="bg-muted/30 rounded-lg p-4 border">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <Badge>ვერსია {selectedVersion.version}</Badge>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {formatDate(selectedVersion.createdAt)}
                                </p>
                            </div>
                            {onRestore && selectedVersion.version !== currentVersion && (
                                <Button size="sm" onClick={() => onRestore(selectedVersion)}>
                                    აღდგენა
                                </Button>
                            )}
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <h4>{selectedVersion.title}</h4>
                            <pre className="text-xs bg-background p-4 rounded-lg overflow-x-auto max-h-96">
                                {selectedVersion.content}
                            </pre>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    {versions.map((version, i) => (
                        <button
                            key={version._id}
                            onClick={() => setSelectedVersion(version)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg bg-card border hover:border-primary/50 transition-colors text-left"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <Badge variant={i === 0 ? "default" : "secondary"}>
                                        v{version.version}
                                    </Badge>
                                    {i === 0 && (
                                        <Badge variant="outline" className="text-green-500">
                                            მიმდინარე
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm font-medium mt-1">{version.title}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <TbUser className="w-3 h-3" />
                                        {version.changedBy}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <TbClock className="w-3 h-3" />
                                        {formatDate(version.createdAt)}
                                    </span>
                                </div>
                                {version.changeNote && (
                                    <p className="text-xs text-muted-foreground mt-1 italic">
                                        &quot;{version.changeNote}&quot;
                                    </p>
                                )}
                            </div>
                            <TbChevronRight className="w-5 h-5 text-muted-foreground" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

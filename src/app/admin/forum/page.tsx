"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    TbMessages, TbPlus, TbRobot, TbTrash, TbExternalLink, TbLoader2,
    TbClock, TbCheck, TbInfoCircle, TbEye, TbSend, TbX, TbPhoto,
} from "react-icons/tb"

interface ForumTopicRow {
    id: string
    slug: string
    titleKa: string
    summaryKa?: string
    sourceImage?: string
    sourceDomain?: string
    status: "queued" | "published"
    postCount?: number
    createdAt?: string
}

export default function AdminForumPage() {
    const [topics, setTopics] = React.useState<ForumTopicRow[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    // Hero (write text + optional photo + optional source link → preview → publish)
    const [text, setText] = React.useState("")
    const [sourceUrl, setSourceUrl] = React.useState("")
    const [imageUrl, setImageUrl] = React.useState("")
    const [uploading, setUploading] = React.useState(false)
    const [previewing, setPreviewing] = React.useState(false)
    const [preview, setPreview] = React.useState<ForumTopicRow | null>(null)
    const [editTitle, setEditTitle] = React.useState("")
    const [editSummary, setEditSummary] = React.useState("")
    const [pubStage, setPubStage] = React.useState<"" | "publishing" | "done">("")
    const [publishedSlug, setPublishedSlug] = React.useState("")

    // List ops
    const [busyId, setBusyId] = React.useState<string | null>(null)
    const [bulkBusy, setBulkBusy] = React.useState(false)
    const [bulkProgress, setBulkProgress] = React.useState("")
    const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null)

    const load = React.useCallback(async () => {
        try {
            const res = await fetch("/api/admin/forum?status=all")
            if (res.ok) {
                const json = await res.json()
                setTopics(json.data?.topics || [])
            }
        } catch (error) {
            console.error("Error loading forum topics:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        load()
    }, [load])

    /* ---------------------------------------------------------- hero flow ---- */

    // Upload a cover photo (manual — no scraping). Returns a local /api/files URL.
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        try {
            const fd = new FormData()
            fd.append("file", file)
            fd.append("title", "forum")
            const res = await fetch("/api/upload", { method: "POST", body: fd })
            const json = await res.json().catch(() => null)
            if (res.ok && json?.data?.url) setImageUrl(json.data.url)
            else alert("ფოტოს ატვირთვა ვერ მოხერხდა")
        } catch {
            alert("ფოტოს ატვირთვა ვერ მოხერხდა")
        } finally {
            setUploading(false)
        }
    }

    // Step 1: build the Georgian topic from YOUR text (no URL parsing) → editable preview.
    const handlePreview = async (e: React.FormEvent) => {
        e.preventDefault()
        const t = text.trim()
        if (t.length < 10) return
        setPreviewing(true)
        try {
            const res = await fetch("/api/admin/forum", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: t, sourceUrl: sourceUrl.trim(), imageUrl: imageUrl.trim() }),
            })
            if (res.ok) {
                const json = await res.json()
                const tp: ForumTopicRow = json.data
                setPreview(tp)
                setEditTitle(tp.titleKa || "")
                setEditSummary(tp.summaryKa || "")
                setPubStage("")
                setPublishedSlug("")
                setText(""); setSourceUrl(""); setImageUrl("")
            } else {
                const j = await res.json().catch(() => null)
                alert(j?.error?.message || "თემის შექმნა ვერ მოხერხდა")
            }
        } catch (error) {
            console.error("Create error:", error)
            alert("თემის შექმნა ვერ მოხერხდა")
        } finally {
            setPreviewing(false)
        }
    }

    // Step 2: (save edits if any) → generate 20 opinions → publish
    const handlePublish = async () => {
        if (!preview) return
        setPubStage("publishing")
        try {
            const edited = editTitle !== preview.titleKa || editSummary !== preview.summaryKa
            if (edited) {
                await fetch(`/api/admin/forum/${preview.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ titleKa: editTitle, summaryKa: editSummary }),
                })
            }
            const res = await fetch(`/api/admin/forum/${preview.id}/generate`, { method: "POST" })
            const json = await res.json().catch(() => null)
            if (res.ok && json?.data?.ok) {
                setPubStage("done")
                setPublishedSlug(preview.slug)
                await load()
            } else if (res.ok && json?.data?.ok === false) {
                alert(`გამოტოვდა: ${json.data.reason}`)
                setPubStage("")
            } else {
                alert("გამოქვეყნება ვერ მოხერხდა (იხ. OPENROUTER_API_KEY)")
                setPubStage("")
            }
        } catch (error) {
            console.error("Publish error:", error)
            alert("გამოქვეყნება ვერ მოხერხდა")
            setPubStage("")
        }
    }

    // Drop a previewed-but-unpublished topic (it was saved as queued)
    const handleDiscardPreview = async () => {
        if (!preview) return
        const id = preview.id
        setPreview(null)
        setPubStage("")
        try {
            await fetch(`/api/admin/forum/${id}`, { method: "DELETE" })
        } catch {
            /* ignore */
        }
        await load()
    }

    const resetHero = () => {
        setPreview(null)
        setPubStage("")
        setPublishedSlug("")
    }

    /* ---------------------------------------------------------- list ops ----- */

    const handleGenerate = async (id: string): Promise<"generated" | "skipped" | "error"> => {
        setBusyId(id)
        try {
            const res = await fetch(`/api/admin/forum/${id}/generate`, { method: "POST" })
            const json = await res.json().catch(() => null)
            if (res.ok && json?.data?.ok) return "generated"
            if (res.ok && json?.data?.ok === false) return "skipped"
            return "error"
        } catch (error) {
            console.error("Generate error:", error)
            return "error"
        } finally {
            setBusyId(null)
        }
    }

    const generateOne = async (id: string) => {
        const r = await handleGenerate(id)
        await load()
        if (r === "error") alert("გენერაცია ვერ მოხერხდა (იხ. OPENROUTER_API_KEY)")
    }

    const generateAllQueued = async () => {
        const queued = topics.filter((t) => t.status === "queued")
        if (queued.length === 0) return
        if (!confirm(`გენერაცია ${queued.length} რიგში მყოფ თემაზე? უკვე გამზადებულები გამოტოვდება.`)) return
        setBulkBusy(true)
        let generated = 0, skipped = 0, errored = 0
        for (let i = 0; i < queued.length; i++) {
            setBulkProgress(`${i + 1}/${queued.length}`)
            const r = await handleGenerate(queued[i].id)
            if (r === "generated") generated++
            else if (r === "skipped") skipped++
            else errored++
        }
        setBulkBusy(false)
        setBulkProgress("")
        await load()
        alert(`+${generated} დაგენერირდა · ${skipped} გამოტოვდა · ${errored} შეცდომა`)
    }

    const handleDelete = async (id: string) => {
        setBusyId(id)
        try {
            const res = await fetch(`/api/admin/forum/${id}`, { method: "DELETE" })
            if (res.ok) setTopics((prev) => prev.filter((t) => t.id !== id))
            else alert("შეცდომა წაშლისას")
        } catch (error) {
            console.error("Delete error:", error)
            alert("შეცდომა წაშლისას")
        } finally {
            setBusyId(null)
            setDeleteConfirm(null)
        }
    }

    const queuedCount = topics.filter((t) => t.status === "queued").length
    // The queue list hides the topic currently held in the preview card
    const listTopics = preview ? topics.filter((t) => t.id !== preview.id) : topics

    return (
        <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <TbMessages className="w-6 h-6 text-primary" />
                        ფორუმი
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        ჩაწერე ამბავი — 20 ისტორიული პერსონა განიხილავს
                    </p>
                </div>
                {queuedCount > 0 && (
                    <Button onClick={generateAllQueued} disabled={bulkBusy} variant="outline" className="gap-2">
                        {bulkBusy ? <TbLoader2 className="w-4 h-4 animate-spin" /> : <TbRobot className="w-4 h-4" />}
                        ყველა რიგში {bulkBusy ? bulkProgress : `(${queuedCount})`}
                    </Button>
                )}
            </div>

            {/* HERO: paste → preview → publish */}
            <Card className="border-primary/30 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TbSend className="w-5 h-5 text-primary" />
                        ახალი დებატი — ჩაწერე ამბავი და გაუშვი ხალხთან
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Published success */}
                    {pubStage === "done" && publishedSlug ? (
                        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                                <TbCheck className="w-5 h-5" />
                                გამოქვეყნდა! დებატი ცოცხალია.
                            </div>
                            <div className="flex items-center gap-2">
                                <a href={`/forum/${publishedSlug}`} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" className="gap-1.5">
                                        <TbExternalLink className="w-4 h-4" />
                                        ნახვა საიტზე
                                    </Button>
                                </a>
                                <Button size="sm" variant="ghost" onClick={resetHero}>
                                    ახალი თემა
                                </Button>
                            </div>
                        </div>
                    ) : preview ? (
                        /* Preview + edit + publish */
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <div className="w-28 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                                    {preview.sourceImage ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={preview.sourceImage} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary-container/20" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div>
                                        <label className="text-xs text-muted-foreground">სათაური (ქართულად)</label>
                                        <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="mt-1" />
                                    </div>
                                    {preview.sourceDomain && (
                                        <div className="text-xs text-muted-foreground truncate">წყარო: {preview.sourceDomain}</div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground">მოკლე შინაარსი</label>
                                <textarea
                                    value={editSummary}
                                    onChange={(e) => setEditSummary(e.target.value)}
                                    rows={3}
                                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary resize-none"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button onClick={handlePublish} disabled={pubStage === "publishing"} className="gap-2">
                                    {pubStage === "publishing" ? (
                                        <>
                                            <TbLoader2 className="w-4 h-4 animate-spin" />
                                            20 პერსონა მსჯელობს…
                                        </>
                                    ) : (
                                        <>
                                            <TbSend className="w-4 h-4" />
                                            გამოქვეყნება ხალხისთვის
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={handleDiscardPreview}
                                    disabled={pubStage === "publishing"}
                                    className="gap-1.5 text-muted-foreground hover:text-destructive"
                                >
                                    <TbX className="w-4 h-4" />
                                    გაუქმება
                                </Button>
                                {pubStage === "publishing" && (
                                    <span className="text-xs text-muted-foreground">~40 წამი, არ დახურო</span>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Manual input: text + optional photo + optional source link (NO parsing) */
                        <form onSubmit={handlePreview} className="space-y-3">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={4}
                                placeholder="ჩაწერე ან ჩასვი ამბავი / თემა, რასაც პერსონები განიხილავენ..."
                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary resize-none"
                                required
                            />
                            <div className="flex flex-wrap items-center gap-3">
                                <label className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm cursor-pointer hover:bg-muted">
                                    {uploading ? <TbLoader2 className="w-4 h-4 animate-spin" /> : <TbPhoto className="w-4 h-4" />}
                                    {imageUrl ? "ფოტო ატვირთულია" : "ფოტოს ატვირთვა"}
                                    <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                                </label>
                                {imageUrl && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={imageUrl} alt="" className="w-12 h-9 rounded object-cover" />
                                )}
                                <Input
                                    type="url"
                                    value={sourceUrl}
                                    onChange={(e) => setSourceUrl(e.target.value)}
                                    placeholder="წყაროს ბმული (არასავალდებულო)"
                                    className="flex-1 min-w-50"
                                />
                            </div>
                            <Button type="submit" disabled={previewing || text.trim().length < 10} className="gap-2">
                                {previewing ? <TbLoader2 className="w-4 h-4 animate-spin" /> : <TbEye className="w-4 h-4" />}
                                გადახედვა
                            </Button>
                        </form>
                    )}
                    {!preview && pubStage !== "done" && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <TbInfoCircle className="w-3.5 h-3.5" />
                            ჩაწერე ამბავი, ატვირთე ფოტო — ბმული მხოლოდ წყაროდ ინახება (არ იპარსება). მერე ნახავ ქართულ სათაურს და გამოაქვეყნებ.
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Queue / published list */}
            <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
                    <TbPlus className="w-4 h-4" />
                    ყველა თემა
                </h2>
                {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <TbLoader2 className="w-6 h-6 animate-spin mx-auto" />
                    </div>
                ) : listTopics.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground text-sm">თემები ჯერ არ არის</div>
                ) : (
                    <div className="space-y-2">
                        {listTopics.map((t) => (
                            <Card key={t.id}>
                                <CardContent className="flex items-center gap-3 p-3">
                                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                                        {t.sourceImage ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={t.sourceImage} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary-container/20" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="font-medium text-sm truncate">{t.titleKa}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            {t.status === "published" ? (
                                                <Badge variant="default" className="text-xs h-5 gap-1">
                                                    <TbCheck className="w-3 h-3" />
                                                    გამოქვეყნებული
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="text-xs h-5 gap-1">
                                                    <TbClock className="w-3 h-3" />
                                                    რიგში
                                                </Badge>
                                            )}
                                            <span className="text-xs text-muted-foreground">{t.postCount || 0} მოსაზრება</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        {t.status === "published" && (
                                            <a
                                                href={`/forum/${t.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
                                                title="ნახვა"
                                            >
                                                <TbExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => generateOne(t.id)}
                                            disabled={busyId === t.id || bulkBusy}
                                            className="gap-1.5"
                                            title="მოსაზრებების დაგენერირება"
                                        >
                                            {busyId === t.id ? (
                                                <TbLoader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <TbRobot className="w-4 h-4" />
                                            )}
                                            <span className="hidden sm:inline">AI</span>
                                        </Button>
                                        {deleteConfirm === t.id ? (
                                            <>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(t.id)} disabled={busyId === t.id}>
                                                    დადასტურება
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)}>
                                                    გაუქმება
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeleteConfirm(t.id)}
                                                className="text-muted-foreground hover:text-destructive"
                                                title="წაშლა"
                                            >
                                                <TbTrash className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

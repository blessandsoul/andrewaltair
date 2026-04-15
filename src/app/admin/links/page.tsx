"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    TbLink,
    TbSearch,
    TbPlus,
    TbTrash,
    TbEdit,
    TbCopy,
    TbQrcode,
    TbChartBar,
    TbCheck,
    TbX,
    TbExternalLink,
    TbToggleLeft,
    TbToggleRight,
    TbClick,
    TbUsers,
    TbCalendar,
    TbDownload,
    TbFolder,
    TbTag,
    TbLock,
    TbBrandTelegram,
    TbFileExport,
} from "react-icons/tb"
import { toast } from "sonner"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://andrewaltair.ge"

interface LinkGroup {
    _id: string
    name: string
    color: string
    description?: string
}

interface ShortLink {
    _id: string
    slug: string
    originalUrl: string
    fallbackUrl: string
    title?: string
    expiresAt?: string
    maxClicks?: number
    totalClicks: number
    uniqueClicks: number
    isActive: boolean
    lastClickedAt?: string
    createdAt: string
    groupId?: LinkGroup | string
    tags: string[]
    password?: string
    showRedirectPage: boolean
    redirectPageDelay: number
    redirectPageMessage?: string
    webhookUrl?: string
    webhookOnFirstClick: boolean
    webhookOnClickCount?: number
}

function getStatusBadge(link: ShortLink) {
    if (!link.isActive) return <Badge variant="secondary">გამორთული</Badge>
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) return <Badge variant="destructive">ვადაგასული</Badge>
    if (link.maxClicks && link.totalClicks >= link.maxClicks) return <Badge variant="destructive">ლიმიტი</Badge>
    return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">აქტიური</Badge>
}

function truncateUrl(url: string, maxLen = 40): string {
    if (url.length <= maxLen) return url
    return url.slice(0, maxLen) + "..."
}

const GROUP_COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"]

export default function LinksPage() {
    const [links, setLinks] = React.useState<ShortLink[]>([])
    const [groups, setGroups] = React.useState<LinkGroup[]>([])
    const [allTags, setAllTags] = React.useState<string[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [search, setSearch] = React.useState("")
    const [filter, setFilter] = React.useState<string>("all")
    const [groupFilter, setGroupFilter] = React.useState<string>("all")
    const [tagFilter, setTagFilter] = React.useState<string>("all")
    const [page, setPage] = React.useState(1)
    const [totalPages, setTotalPages] = React.useState(1)

    // Create/Edit modal
    const [showModal, setShowModal] = React.useState(false)
    const [editingLink, setEditingLink] = React.useState<ShortLink | null>(null)
    const [formData, setFormData] = React.useState({
        originalUrl: "",
        slug: "",
        title: "",
        fallbackUrl: "",
        expiresAt: "",
        maxClicks: "",
        groupId: "",
        tagsInput: "",
        password: "",
        showRedirectPage: false,
        redirectPageDelay: "3",
        redirectPageMessage: "",
        webhookUrl: "",
        webhookOnFirstClick: false,
        webhookOnClickCount: "",
    })
    const [isSaving, setIsSaving] = React.useState(false)

    // Group modal
    const [showGroupModal, setShowGroupModal] = React.useState(false)
    const [groupForm, setGroupForm] = React.useState({ name: "", description: "", color: "#6366f1" })

    // QR modal
    const [qrData, setQrData] = React.useState<{ qrDataUrl: string; shortUrl: string } | null>(null)

    // Delete confirm
    const [deletingId, setDeletingId] = React.useState<string | null>(null)

    const fetchGroups = React.useCallback(async () => {
        try {
            const res = await fetch("/api/admin/link-groups")
            const json = await res.json()
            if (json.success) setGroups(json.data)
        } catch { }
    }, [])

    const fetchTags = React.useCallback(async () => {
        try {
            const res = await fetch("/api/admin/link-tags")
            const json = await res.json()
            if (json.success) setAllTags(json.data)
        } catch { }
    }, [])

    const fetchLinks = React.useCallback(async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams({ page: String(page), limit: "20" })
            if (search) params.set("search", search)
            if (filter !== "all") params.set("isActive", filter)
            if (groupFilter !== "all") params.set("groupId", groupFilter)
            if (tagFilter !== "all") params.set("tag", tagFilter)

            const res = await fetch(`/api/admin/links?${params}`)
            const json = await res.json()
            if (json.success) {
                setLinks(json.data.items)
                setTotalPages(json.data.pagination.totalPages)
            }
        } catch {
            toast.error("ლინკების ჩატვირთვა ვერ მოხერხდა")
        } finally {
            setIsLoading(false)
        }
    }, [page, search, filter, groupFilter, tagFilter])

    React.useEffect(() => {
        fetchGroups()
        fetchTags()
    }, [fetchGroups, fetchTags])

    React.useEffect(() => {
        fetchLinks()
    }, [fetchLinks])

    const handleCreate = () => {
        setEditingLink(null)
        setFormData({
            originalUrl: "", slug: "", title: "", fallbackUrl: "", expiresAt: "", maxClicks: "",
            groupId: "", tagsInput: "", password: "",
            showRedirectPage: false, redirectPageDelay: "3", redirectPageMessage: "",
            webhookUrl: "", webhookOnFirstClick: false, webhookOnClickCount: "",
        })
        setShowModal(true)
    }

    const handleEdit = (link: ShortLink) => {
        setEditingLink(link)
        const groupId = typeof link.groupId === 'object' && link.groupId ? link.groupId._id : (link.groupId as string || "")
        setFormData({
            originalUrl: link.originalUrl,
            slug: link.slug,
            title: link.title || "",
            fallbackUrl: link.fallbackUrl || "",
            expiresAt: link.expiresAt ? link.expiresAt.split("T")[0] : "",
            maxClicks: link.maxClicks ? String(link.maxClicks) : "",
            groupId,
            tagsInput: (link.tags || []).join(", "),
            password: link.password || "",
            showRedirectPage: link.showRedirectPage || false,
            redirectPageDelay: String(link.redirectPageDelay || 3),
            redirectPageMessage: link.redirectPageMessage || "",
            webhookUrl: link.webhookUrl || "",
            webhookOnFirstClick: link.webhookOnFirstClick || false,
            webhookOnClickCount: link.webhookOnClickCount ? String(link.webhookOnClickCount) : "",
        })
        setShowModal(true)
    }

    const handleSave = async () => {
        if (!formData.originalUrl) {
            toast.error("URL აუცილებელია")
            return
        }
        setIsSaving(true)
        try {
            const tags = formData.tagsInput ? formData.tagsInput.split(",").map(t => t.trim()).filter(Boolean) : []
            const body: Record<string, unknown> = {
                originalUrl: formData.originalUrl,
                title: formData.title || undefined,
                fallbackUrl: formData.fallbackUrl || undefined,
                expiresAt: formData.expiresAt || undefined,
                maxClicks: formData.maxClicks ? parseInt(formData.maxClicks, 10) : undefined,
                groupId: formData.groupId || null,
                tags,
                password: formData.password || null,
                showRedirectPage: formData.showRedirectPage,
                redirectPageDelay: parseInt(formData.redirectPageDelay, 10) || 3,
                redirectPageMessage: formData.redirectPageMessage || null,
                webhookUrl: formData.webhookUrl || null,
                webhookOnFirstClick: formData.webhookOnFirstClick,
                webhookOnClickCount: formData.webhookOnClickCount ? parseInt(formData.webhookOnClickCount, 10) : null,
            }
            if (formData.slug) body.slug = formData.slug

            const url = editingLink ? `/api/admin/links/${editingLink._id}` : "/api/admin/links"
            const method = editingLink ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
            const json = await res.json()
            if (json.success) {
                toast.success(editingLink ? "ლინკი განახლდა" : "ლინკი შეიქმნა")
                setShowModal(false)
                fetchLinks()
                fetchTags()
            } else {
                toast.error(json.error?.message || "შეცდომა")
            }
        } catch {
            toast.error("შენახვა ვერ მოხერხდა")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/links/${id}`, { method: "DELETE" })
            const json = await res.json()
            if (json.success) {
                toast.success("ლინკი წაიშალა")
                setDeletingId(null)
                fetchLinks()
            }
        } catch {
            toast.error("წაშლა ვერ მოხერხდა")
        }
    }

    const handleToggleActive = async (link: ShortLink) => {
        try {
            const res = await fetch(`/api/admin/links/${link._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !link.isActive }),
            })
            const json = await res.json()
            if (json.success) {
                toast.success(link.isActive ? "გამოირთო" : "ჩაირთო")
                fetchLinks()
            }
        } catch {
            toast.error("სტატუსის ცვლილება ვერ მოხერხდა")
        }
    }

    const handleCopy = (slug: string) => {
        navigator.clipboard.writeText(`${BASE_URL}/link/${slug}`)
        toast.success("დაკოპირდა!")
    }

    const handleQR = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/links/${id}/qr`)
            const json = await res.json()
            if (json.success) setQrData(json.data)
        } catch {
            toast.error("QR კოდის გენერაცია ვერ მოხერხდა")
        }
    }

    const handleExportCSV = async (id: string, slug: string) => {
        try {
            const res = await fetch(`/api/admin/links/${id}/export`)
            if (!res.ok) throw new Error()
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `clicks-${slug}.csv`
            a.click()
            URL.revokeObjectURL(url)
            toast.success("ექსპორტი წარმატებულია")
        } catch {
            toast.error("ექსპორტი ვერ მოხერხდა")
        }
    }

    const handleCreateGroup = async () => {
        if (!groupForm.name) return
        try {
            const res = await fetch("/api/admin/link-groups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(groupForm),
            })
            const json = await res.json()
            if (json.success) {
                toast.success("ჯგუფი შეიქმნა")
                setShowGroupModal(false)
                setGroupForm({ name: "", description: "", color: "#6366f1" })
                fetchGroups()
            }
        } catch {
            toast.error("ჯგუფის შექმნა ვერ მოხერხდა")
        }
    }

    const handleDeleteGroup = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/link-groups/${id}`, { method: "DELETE" })
            const json = await res.json()
            if (json.success) {
                toast.success("ჯგუფი წაიშალა")
                fetchGroups()
                fetchLinks()
            }
        } catch {
            toast.error("წაშლა ვერ მოხერხდა")
        }
    }

    const getGroupInfo = (link: ShortLink): LinkGroup | null => {
        if (typeof link.groupId === 'object' && link.groupId) return link.groupId as LinkGroup
        return null
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <TbLink className="w-7 h-7 text-indigo-500" />
                        ბმულების მართვა
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        შექმენი მოკლე ბმულები და აკონტროლე სტატისტიკა
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setShowGroupModal(true)} className="gap-2">
                        <TbFolder className="w-4 h-4" />
                        ჯგუფები
                    </Button>
                    <Button onClick={handleCreate} className="gap-2">
                        <TbPlus className="w-4 h-4" />
                        ახალი ბმული
                    </Button>
                </div>
            </div>

            {/* Groups Bar */}
            {groups.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    {groups.map((g) => (
                        <Badge
                            key={g._id}
                            variant={groupFilter === g._id ? "default" : "outline"}
                            className="cursor-pointer"
                            style={groupFilter === g._id ? { backgroundColor: g.color } : { borderColor: g.color, color: g.color }}
                            onClick={() => setGroupFilter(groupFilter === g._id ? "all" : g._id)}
                        >
                            {g.name}
                        </Badge>
                    ))}
                    {groupFilter !== "all" && (
                        <Button variant="ghost" size="sm" onClick={() => setGroupFilter("all")} className="h-6 text-xs">
                            <TbX className="w-3 h-3 mr-1" /> ფილტრის გასუფთავება
                        </Button>
                    )}
                </div>
            )}

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 max-w-sm">
                    <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="ძიება..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        className="pl-9"
                    />
                </div>
                <Select value={filter} onValueChange={(v) => { setFilter(v); setPage(1) }}>
                    <SelectTrigger className="w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">ყველა</SelectItem>
                        <SelectItem value="true">აქტიური</SelectItem>
                        <SelectItem value="false">გამორთული</SelectItem>
                    </SelectContent>
                </Select>
                {allTags.length > 0 && (
                    <Select value={tagFilter} onValueChange={(v) => { setTagFilter(v); setPage(1) }}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="თეგი" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">ყველა თეგი</SelectItem>
                            {allTags.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {/* Links List */}
            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}><CardContent className="p-4"><div className="h-16 animate-pulse bg-muted rounded" /></CardContent></Card>
                    ))}
                </div>
            ) : links.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <TbLink className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">ბმულები არ მოიძებნა</p>
                        <Button onClick={handleCreate} variant="outline" className="mt-4 gap-2">
                            <TbPlus className="w-4 h-4" />
                            შექმენი პირველი ბმული
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-2">
                    {links.map((link) => {
                        const group = getGroupInfo(link)
                        return (
                            <Card key={link._id} className="hover:border-indigo-500/30 transition-colors">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                {link.title && <span className="font-medium text-sm">{link.title}</span>}
                                                {getStatusBadge(link)}
                                                {link.password && <Badge variant="outline" className="text-xs gap-1"><TbLock className="w-3 h-3" />პაროლი</Badge>}
                                                {link.showRedirectPage && <Badge variant="outline" className="text-xs">redirect page</Badge>}
                                                {link.webhookUrl && <Badge variant="outline" className="text-xs gap-1"><TbBrandTelegram className="w-3 h-3" />webhook</Badge>}
                                                {group && (
                                                    <Badge variant="outline" className="text-xs" style={{ borderColor: group.color, color: group.color }}>
                                                        {group.name}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <code className="text-indigo-500 font-mono">/link/{link.slug}</code>
                                                <TbExternalLink className="w-3 h-3 text-muted-foreground" />
                                                <span className="text-muted-foreground truncate">{truncateUrl(link.originalUrl)}</span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                                                <span className="flex items-center gap-1"><TbClick className="w-3.5 h-3.5" />{link.totalClicks} კლიკი</span>
                                                <span className="flex items-center gap-1"><TbUsers className="w-3.5 h-3.5" />{link.uniqueClicks} უნიკალური</span>
                                                <span className="flex items-center gap-1"><TbCalendar className="w-3.5 h-3.5" />{new Date(link.createdAt).toLocaleDateString("ka-GE")}</span>
                                                {link.maxClicks && <span>ლიმიტი: {link.totalClicks}/{link.maxClicks}</span>}
                                                {link.tags?.length > 0 && link.tags.map(t => (
                                                    <Badge key={t} variant="secondary" className="text-xs h-5 cursor-pointer" onClick={() => { setTagFilter(t); setPage(1) }}>
                                                        <TbTag className="w-3 h-3 mr-0.5" />{t}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(link.slug)} title="კოპირება"><TbCopy className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQR(link._id)} title="QR"><TbQrcode className="w-4 h-4" /></Button>
                                            <Link href={`/admin/links/${link._id}`}><Button variant="ghost" size="icon" className="h-8 w-8" title="სტატისტიკა"><TbChartBar className="w-4 h-4" /></Button></Link>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleExportCSV(link._id, link.slug)} title="CSV"><TbFileExport className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleActive(link)} title={link.isActive ? "გამორთვა" : "ჩართვა"}>
                                                {link.isActive ? <TbToggleRight className="w-4 h-4 text-emerald-500" /> : <TbToggleLeft className="w-4 h-4" />}
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(link)} title="რედაქტირება"><TbEdit className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => setDeletingId(link._id)} title="წაშლა"><TbTrash className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-4">
                            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>წინა</Button>
                            <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
                            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>შემდეგი</Button>
                        </div>
                    )}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center overflow-y-auto py-8">
                    <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold">{editingLink ? "ბმულის რედაქტირება" : "ახალი ბმული"}</h2>
                            <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}><TbX className="w-4 h-4" /></Button>
                        </div>

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                            {/* Basic */}
                            <div>
                                <label className="text-sm font-medium mb-1 block">URL *</label>
                                <Input placeholder="https://example.com/very-long-url" value={formData.originalUrl} onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Slug (არასავალდებულო)</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground whitespace-nowrap">/link/</span>
                                    <Input placeholder="auto-generated" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">სახელი</label>
                                <Input placeholder="YouTube promo link" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Fallback URL</label>
                                <Input placeholder="https://andrewaltair.ge" value={formData.fallbackUrl} onChange={(e) => setFormData({ ...formData, fallbackUrl: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">ვადა</label>
                                    <Input type="date" value={formData.expiresAt} onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">მაქს. კლიკები</label>
                                    <Input type="number" placeholder="ულიმიტო" value={formData.maxClicks} onChange={(e) => setFormData({ ...formData, maxClicks: e.target.value })} />
                                </div>
                            </div>

                            {/* Group & Tags */}
                            <div className="border-t border-border pt-4">
                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5"><TbFolder className="w-4 h-4" />ორგანიზაცია</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">ჯგუფი</label>
                                        <Select value={formData.groupId || "none"} onValueChange={(v) => setFormData({ ...formData, groupId: v === "none" ? "" : v })}>
                                            <SelectTrigger><SelectValue placeholder="აირჩიე ჯგუფი" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">ჯგუფის გარეშე</SelectItem>
                                                {groups.map((g) => <SelectItem key={g._id} value={g._id}>{g.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">თეგები (მძიმით გამოყოფილი)</label>
                                        <Input placeholder="youtube, promo, april" value={formData.tagsInput} onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            {/* Password */}
                            <div className="border-t border-border pt-4">
                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5"><TbLock className="w-4 h-4" />დაცვა</h3>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">პაროლი (არასავალდებულო)</label>
                                    <Input type="text" placeholder="დატოვე ცარიელი თუ არ გინდა" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                </div>
                            </div>

                            {/* Redirect Page */}
                            <div className="border-t border-border pt-4">
                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5"><TbExternalLink className="w-4 h-4" />Redirect Page</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={formData.showRedirectPage}
                                            onCheckedChange={(c) => setFormData({ ...formData, showRedirectPage: !!c })}
                                        />
                                        <label className="text-sm">ბრენდირებული redirect გვერდის ჩვენება</label>
                                    </div>
                                    {formData.showRedirectPage && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-sm font-medium mb-1 block">დაყოვნება (წმ)</label>
                                                <Input type="number" value={formData.redirectPageDelay} onChange={(e) => setFormData({ ...formData, redirectPageDelay: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-1 block">შეტყობინება</label>
                                                <Input placeholder="Redirecting..." value={formData.redirectPageMessage} onChange={(e) => setFormData({ ...formData, redirectPageMessage: e.target.value })} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Webhook */}
                            <div className="border-t border-border pt-4">
                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5"><TbBrandTelegram className="w-4 h-4" />Webhook</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Webhook URL</label>
                                        <Input placeholder="https://api.telegram.org/bot.../sendMessage?chat_id=..." value={formData.webhookUrl} onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={formData.webhookOnFirstClick}
                                            onCheckedChange={(c) => setFormData({ ...formData, webhookOnFirstClick: !!c })}
                                        />
                                        <label className="text-sm">პირველ კლიკზე შეტყობინება</label>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">N-ე კლიკზე შეტყობინება</label>
                                        <Input type="number" placeholder="მაგ. 100" value={formData.webhookOnClickCount} onChange={(e) => setFormData({ ...formData, webhookOnClickCount: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
                            <Button variant="outline" onClick={() => setShowModal(false)}>გაუქმება</Button>
                            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                                <TbCheck className="w-4 h-4" />
                                {isSaving ? "ინახება..." : editingLink ? "განახლება" : "შექმნა"}
                            </Button>
                        </div>
                    </div>
                    <div className="fixed inset-0 -z-10" onClick={() => setShowModal(false)} />
                </div>
            )}

            {/* Group Modal */}
            {showGroupModal && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
                    <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold">ჯგუფების მართვა</h2>
                            <Button variant="ghost" size="icon" onClick={() => setShowGroupModal(false)}><TbX className="w-4 h-4" /></Button>
                        </div>

                        {/* Existing groups */}
                        {groups.length > 0 && (
                            <div className="space-y-2 mb-4">
                                {groups.map((g) => (
                                    <div key={g._id} className="flex items-center justify-between p-2 rounded-lg border border-border">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color }} />
                                            <span className="text-sm font-medium">{g.name}</span>
                                            {g.description && <span className="text-xs text-muted-foreground">— {g.description}</span>}
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => handleDeleteGroup(g._id)}>
                                            <TbTrash className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Create new group */}
                        <div className="border-t border-border pt-4 space-y-3">
                            <h3 className="text-sm font-semibold">ახალი ჯგუფი</h3>
                            <Input placeholder="სახელი" value={groupForm.name} onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })} />
                            <Input placeholder="აღწერა (არასავალდებულო)" value={groupForm.description} onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })} />
                            <div>
                                <label className="text-sm font-medium mb-1 block">ფერი</label>
                                <div className="flex gap-2">
                                    {GROUP_COLORS.map((c) => (
                                        <button
                                            key={c}
                                            className={`w-7 h-7 rounded-full border-2 transition-transform ${groupForm.color === c ? 'scale-110 border-foreground' : 'border-transparent'}`}
                                            style={{ backgroundColor: c }}
                                            onClick={() => setGroupForm({ ...groupForm, color: c })}
                                        />
                                    ))}
                                </div>
                            </div>
                            <Button onClick={handleCreateGroup} className="w-full gap-2">
                                <TbPlus className="w-4 h-4" />
                                ჯგუფის შექმნა
                            </Button>
                        </div>
                    </div>
                    <div className="fixed inset-0 -z-10" onClick={() => setShowGroupModal(false)} />
                </div>
            )}

            {/* Delete Confirm */}
            {deletingId && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
                    <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
                        <h3 className="text-lg font-bold mb-2">წაშლის დადასტურება</h3>
                        <p className="text-sm text-muted-foreground mb-4">ბმული და მისი სტატისტიკა სამუდამოდ წაიშლება.</p>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setDeletingId(null)}>გაუქმება</Button>
                            <Button variant="destructive" onClick={() => handleDelete(deletingId)} className="gap-2"><TbTrash className="w-4 h-4" />წაშლა</Button>
                        </div>
                    </div>
                    <div className="fixed inset-0 -z-10" onClick={() => setDeletingId(null)} />
                </div>
            )}

            {/* QR Modal */}
            {qrData && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
                    <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center">
                        <h3 className="text-lg font-bold mb-4">QR კოდი</h3>
                        <img src={qrData.qrDataUrl} alt="QR Code" className="mx-auto mb-3 rounded-lg" width={256} height={256} />
                        <p className="text-sm text-muted-foreground mb-4 font-mono">{qrData.shortUrl}</p>
                        <div className="flex justify-center gap-2">
                            <Button variant="outline" onClick={() => setQrData(null)}>დახურვა</Button>
                            <Button onClick={() => { const a = document.createElement("a"); a.href = qrData.qrDataUrl; a.download = "qr-code.png"; a.click() }} className="gap-2"><TbDownload className="w-4 h-4" />ჩამოტვირთვა</Button>
                        </div>
                    </div>
                    <div className="fixed inset-0 -z-10" onClick={() => setQrData(null)} />
                </div>
            )}
        </div>
    )
}

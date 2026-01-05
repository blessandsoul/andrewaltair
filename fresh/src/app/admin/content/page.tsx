"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TbFileText, TbEye, TbDeviceFloppy, TbClock, TbSend, TbCalendar, TbBold, TbItalic, TbLink, TbList, TbListNumbers, TbPhoto, TbCode, TbQuote, TbH1, TbH2, TbArrowBackUp, TbArrowForwardUp, TbSparkles, TbCircleCheck, TbAlertCircle } from "react-icons/tb"

// Simple Markdown to HTML converter
function markdownToHtml(markdown: string): string {
    let html = markdown
        // Headers
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
        // Bold & Italic
        .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        // Links
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-indigo-500 hover:underline">$1</a>')
        // TbCode blocks
        .replace(/```([\s\S]*?)```/gim, '<pre class="bg-muted p-3 rounded-lg my-3 overflow-x-auto"><code>$1</code></pre>')
        // Inline code
        .replace(/`(.*?)`/gim, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
        // Blockquotes
        .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-4 my-3 italic text-muted-foreground">$1</blockquote>')
        // Lists
        .replace(/^\- (.*$)/gim, '<li class="ml-4">• $1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
        // Line breaks
        .replace(/\n\n/gim, '</p><p class="my-3">')
        .replace(/\n/gim, '<br/>')

    return `<p class="my-3">${html}</p>`
}

interface Draft {
    id: string
    title: string
    content: string
    savedAt: string
    status: "draft" | "scheduled" | "published"
    scheduledFor?: string
}

export default function ContentEditorPage() {
    const [title, setTitle] = React.useState("")
    const [content, setContent] = React.useState("")
    const [showPreview, setShowPreview] = React.useState(true)
    const [drafts, setDrafts] = React.useState<Draft[]>([])
    const [currentDraftId, setCurrentDraftId] = React.useState<string | null>(null)
    const [autoSaveStatus, setAutoSaveStatus] = React.useState<"saved" | "saving" | "unsaved">("saved")
    const [scheduledDate, setScheduledDate] = React.useState("")
    const [showScheduler, setShowScheduler] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    // Load drafts from MongoDB API
    React.useEffect(() => {
        async function fetchDrafts() {
            try {
                const res = await fetch('/api/posts?status=draft&limit=50')
                if (res.ok) {
                    const data = await res.json()
                    const apiDrafts = (data.posts || []).map((p: { _id?: string; id?: string; title: string; content?: string; createdAt?: string; status?: string; scheduledFor?: string }) => ({
                        id: p.id || p._id,
                        title: p.title || 'უსათაურო',
                        content: p.content || '',
                        savedAt: p.createdAt || new Date().toISOString(),
                        status: p.status || 'draft',
                        scheduledFor: p.scheduledFor
                    }))
                    setDrafts(apiDrafts)
                }
            } catch (error) {
                console.error('Error fetching drafts:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchDrafts()
    }, [])

    // Auto-save every 30 seconds
    React.useEffect(() => {
        if (!title && !content) return

        const timer = setTimeout(() => {
            saveDraft()
        }, 30000)

        setAutoSaveStatus("unsaved")
        return () => clearTimeout(timer)
    }, [title, content])

    // Save draft to MongoDB
    const saveDraft = async () => {
        setAutoSaveStatus("saving")
        try {
            if (currentDraftId) {
                // Update existing draft
                const res = await fetch(`/api/posts/${currentDraftId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: title || 'უსათაურო',
                        content,
                        status: 'draft'
                    })
                })
                if (res.ok) {
                    setDrafts(drafts.map(d => d.id === currentDraftId ? { ...d, title: title || 'უსათაურო', content, savedAt: new Date().toISOString() } : d))
                }
            } else {
                // Create new draft
                const res = await fetch('/api/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: title || 'უსათაურო',
                        content,
                        slug: (title || 'draft').toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '') + '-' + Date.now(),
                        status: 'draft',
                        author: { name: 'Andrew Altair', avatar: '/avatar.jpg' },
                        category: 'Drafts',
                        tags: [],
                        readingTime: Math.ceil(content.split(' ').length / 200)
                    })
                })
                if (res.ok) {
                    const data = await res.json()
                    const newDraft: Draft = {
                        id: data.post.id,
                        title: title || 'უსათაურო',
                        content,
                        savedAt: new Date().toISOString(),
                        status: 'draft'
                    }
                    setDrafts([newDraft, ...drafts])
                    setCurrentDraftId(data.post.id)
                }
            }
            setAutoSaveStatus("saved")
        } catch (error) {
            console.error('Save draft error:', error)
            setAutoSaveStatus("unsaved")
        }
    }

    // Schedule post via API
    const schedulePost = async () => {
        if (!scheduledDate || !currentDraftId) return
        try {
            const res = await fetch(`/api/posts/${currentDraftId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'scheduled', scheduledFor: scheduledDate })
            })
            if (res.ok) {
                setDrafts(drafts.map(d => d.id === currentDraftId ? { ...d, status: 'scheduled', scheduledFor: scheduledDate } : d))
                setShowScheduler(false)
            }
        } catch (error) {
            console.error('Schedule post error:', error)
        }
    }

    // Load draft
    const loadDraft = (draft: Draft) => {
        setTitle(draft.title)
        setContent(draft.content)
        setCurrentDraftId(draft.id)
    }

    // Delete draft via API
    const deleteDraft = async (id: string) => {
        try {
            const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setDrafts(drafts.filter(d => d.id !== id))
                if (currentDraftId === id) {
                    setTitle("")
                    setContent("")
                    setCurrentDraftId(null)
                }
            }
        } catch (error) {
            console.error('Delete draft error:', error)
        }
    }

    // Insert markdown
    const insertMarkdown = (prefix: string, suffix = "") => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = content.substring(start, end)
        const newContent = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end)

        setContent(newContent)

        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + prefix.length, end + prefix.length)
        }, 0)
    }

    const toolbarButtons = [
        { icon: TbBold, action: () => insertMarkdown("**", "**"), title: "Bold" },
        { icon: TbItalic, action: () => insertMarkdown("*", "*"), title: "Italic" },
        { icon: TbH1, action: () => insertMarkdown("# "), title: "H1" },
        { icon: TbH2, action: () => insertMarkdown("## "), title: "H2" },
        { icon: TbLink, action: () => insertMarkdown("[", "](url)"), title: "Link" },
        { icon: TbList, action: () => insertMarkdown("- "), title: "List" },
        { icon: TbListNumbers, action: () => insertMarkdown("1. "), title: "Numbered List" },
        { icon: TbQuote, action: () => insertMarkdown("> "), title: "TbQuote" },
        { icon: TbCode, action: () => insertMarkdown("`", "`"), title: "TbCode" },
        { icon: TbPhoto, action: () => insertMarkdown("![alt](", ")"), title: "Image" },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <TbSparkles className="w-8 h-8 text-indigo-500" />
                        კონტენტ ედიტორი
                    </h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        {autoSaveStatus === "saved" && (
                            <>
                                <TbCircleCheck className="w-4 h-4 text-green-500" />
                                შენახულია
                            </>
                        )}
                        {autoSaveStatus === "saving" && (
                            <>
                                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                ინახება...
                            </>
                        )}
                        {autoSaveStatus === "unsaved" && (
                            <>
                                <TbAlertCircle className="w-4 h-4 text-yellow-500" />
                                შეუნახავი ცვლილებები
                            </>
                        )}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={saveDraft} className="gap-2">
                        <TbDeviceFloppy className="w-4 h-4" />
                        შენახვა
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setShowScheduler(!showScheduler)}
                        className="gap-2"
                    >
                        <TbClock className="w-4 h-4" />
                        დაგეგმვა
                    </Button>
                    <Button className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600">
                        <TbSend className="w-4 h-4" />
                        გამოქვეყნება
                    </Button>
                </div>
            </div>

            {/* Scheduler */}
            {showScheduler && (
                <Card className="border-indigo-500/20 bg-indigo-500/5">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4 flex-wrap">
                            <TbCalendar className="w-5 h-5 text-indigo-500" />
                            <span className="font-medium">დაგეგმეთ გამოქვეყნება:</span>
                            <Input
                                type="datetime-local"
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                                className="w-auto"
                            />
                            <Button onClick={schedulePost} size="sm">
                                დაგეგმვა
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 lg:grid-cols-4">
                {/* Drafts Sidebar */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                            <TbFileText className="w-4 h-4" />
                            დრაფტები ({drafts.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                            onClick={() => {
                                setTitle("")
                                setContent("")
                                setCurrentDraftId(null)
                            }}
                        >
                            <TbSparkles className="w-4 h-4" />
                            ახალი პოსტი
                        </Button>

                        {drafts.map((draft) => (
                            <div
                                key={draft.id}
                                className={`p-3 rounded-lg cursor-pointer transition-colors ${currentDraftId === draft.id
                                    ? "bg-indigo-500/10 border border-indigo-500/20"
                                    : "bg-muted/50 hover:bg-muted"
                                    }`}
                                onClick={() => loadDraft(draft)}
                            >
                                <p className="font-medium truncate text-sm">{draft.title}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <Badge variant={
                                        draft.status === "published" ? "default" :
                                            draft.status === "scheduled" ? "secondary" : "outline"
                                    } className="text-xs">
                                        {draft.status === "published" ? "გამოქვეყნებული" :
                                            draft.status === "scheduled" ? "დაგეგმილი" : "დრაფტი"}
                                    </Badge>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            deleteDraft(draft.id)
                                        }}
                                        className="text-xs text-muted-foreground hover:text-destructive"
                                    >
                                        წაშლა
                                    </button>
                                </div>
                            </div>
                        ))}

                        {drafts.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                დრაფტები არ არის
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Editor */}
                <Card className="lg:col-span-3">
                    <CardContent className="p-4 space-y-4">
                        {/* Title */}
                        <Input
                            placeholder="პოსტის სათაური..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-xl font-bold border-0 border-b rounded-none px-0 focus-visible:ring-0"
                        />

                        {/* Toolbar */}
                        <div className="flex items-center gap-1 flex-wrap border-b pb-3">
                            {toolbarButtons.map((btn, i) => (
                                <Button
                                    key={i}
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={btn.action}
                                    title={btn.title}
                                >
                                    <btn.icon className="w-4 h-4" />
                                </Button>
                            ))}
                            <div className="flex-1" />
                            <Button
                                variant={showPreview ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => setShowPreview(!showPreview)}
                                className="gap-2"
                            >
                                <TbEye className="w-4 h-4" />
                                Preview
                            </Button>
                        </div>

                        {/* Editor & Preview */}
                        <div className={`grid gap-4 ${showPreview ? "lg:grid-cols-2" : ""}`}>
                            {/* Textarea */}
                            <div className="min-h-[400px]">
                                <textarea
                                    ref={textareaRef}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="დაიწყეთ წერა... (Markdown supported)"
                                    className="w-full h-full min-h-[400px] resize-none bg-transparent outline-none font-mono text-sm"
                                />
                            </div>

                            {/* Preview */}
                            {showPreview && (
                                <div className="border-l pl-4 min-h-[400px]">
                                    <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                                        Preview
                                    </div>
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
                                    />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

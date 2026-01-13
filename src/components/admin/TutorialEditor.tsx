"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { TbDeviceFloppy, TbArrowLeft, TbCode, TbLoader2, TbTrash, TbPlus, TbBook, TbQuote, TbInfoCircle } from "react-icons/tb"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { parseTutorialPost, ParsedTutorial } from "@/lib/TutorialParser"

// Define the interface for form data
interface TutorialData {
    _id?: string;
    title: string;
    slug: string;
    intro: string;
    tools: string;
    modules: Array<{
        title: string;
        quote: string;
        explanation: string;
    }>;
    conclusion: string;
    metaAdvice: string;
    tags: string[];
    themeColor: string;
    character: string;
    songTrack: string;
    coverImage: string;
    mobileCoverImage: string;
    status: 'draft' | 'published' | 'archived';
    author: {
        name: string;
        avatar?: string;
        role?: string;
    };
}

const DEFAULT_TUTORIAL: TutorialData = {
    title: "",
    slug: "",
    intro: "",
    tools: "",
    modules: [],
    conclusion: "",
    metaAdvice: "",
    tags: [],
    themeColor: "",
    character: "",
    songTrack: "",
    coverImage: "",
    mobileCoverImage: "",
    status: "draft",
    author: {
        name: "Andrew Altair",
        role: "AI Mentor"
    }
}

interface TutorialEditorProps {
    initialData?: TutorialData // Allow partial if needed, but strict is better for now
    onSave: (data: TutorialData) => Promise<void>
    onCancel: () => void
    isEditing?: boolean
}

export function TutorialEditor({ initialData, onSave, onCancel, isEditing = false }: TutorialEditorProps) {
    const [tutorial, setTutorial] = React.useState<TutorialData>({
        ...DEFAULT_TUTORIAL,
        ...initialData
    })

    // Ensure modules is at least empty array if undefined
    React.useEffect(() => {
        if (!tutorial.modules) setTutorial(prev => ({ ...prev, modules: [] }));
    }, []);

    const [isSaving, setIsSaving] = React.useState(false)
    const [showImportDialog, setShowImportDialog] = React.useState(false)
    const [importText, setImportText] = React.useState("")

    const generateSlug = (title: string): string => {
        return title.toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim()
    }

    const handleImport = () => {
        if (!importText.trim()) return;

        const result = parseTutorialPost(importText);
        if (result.success) {
            setTutorial(prev => ({
                ...prev,
                title: result.title || prev.title,
                slug: result.title ? generateSlug(result.title) : prev.slug,
                intro: result.intro || prev.intro,
                tools: result.tools || prev.tools,
                modules: result.modules.length > 0 ? result.modules : prev.modules,
                conclusion: result.conclusion || prev.conclusion,
                metaAdvice: result.metaAdvice || prev.metaAdvice,
                tags: [...new Set([...prev.tags, ...result.tags])],
                themeColor: result.themeColor || prev.themeColor,
                // If we had a place for prompts, we'd use result.prompts
            }));
            setShowImportDialog(false);
            setImportText("");
            toast.success("Imported Blueprint successfully!");
        } else {
            toast.error("Failed to parse text: " + result.error);
        }
    }

    const handleModuleChange = (index: number, field: keyof typeof tutorial.modules[0], value: string) => {
        const newModules = [...tutorial.modules];
        newModules[index] = { ...newModules[index], [field]: value };
        setTutorial({ ...tutorial, modules: newModules });
    }

    const addModule = () => {
        setTutorial({
            ...tutorial,
            modules: [...tutorial.modules, { title: "", quote: "", explanation: "" }]
        })
    }

    const removeModule = (index: number) => {
        setTutorial({
            ...tutorial,
            modules: tutorial.modules.filter((_, i) => i !== index)
        })
    }

    const handleSaveClick = async () => {
        setIsSaving(true);
        try {
            await onSave(tutorial);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Top Bar */}
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-md p-4 rounded-xl border border-border/40 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                        <TbArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <TbBook className="text-primary w-6 h-6" />
                            {isEditing ? "Edit BluePrint" : "New BluePrint"}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setShowImportDialog(true)} className="gap-2">
                        <TbCode className="w-4 h-4" /> Paste Agent Output
                    </Button>
                    <Button onClick={handleSaveClick} disabled={isSaving} className="gap-2">
                        {isSaving ? <TbLoader2 className="animate-spin" /> : <TbDeviceFloppy />}
                        Save
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader><CardTitle>Core Info</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Title</Label>
                                <Input value={tutorial.title} onChange={e => setTutorial({ ...tutorial, title: e.target.value })} className="font-bold text-lg" />
                            </div>
                            <div>
                                <Label>Slug</Label>
                                <Input value={tutorial.slug} onChange={e => setTutorial({ ...tutorial, slug: e.target.value })} className="font-mono text-xs" />
                            </div>
                            <div>
                                <Label>Intro / Analogy</Label>
                                <Textarea value={tutorial.intro} onChange={e => setTutorial({ ...tutorial, intro: e.target.value })} className="min-h-[100px]" placeholder="Explain with a simple analogy..." />
                            </div>
                            <div>
                                <Label>Tools / Requirements</Label>
                                <Textarea value={tutorial.tools} onChange={e => setTutorial({ ...tutorial, tools: e.target.value })} placeholder="What is needed..." />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Modules */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Modules</h2>
                            <Button variant="outline" size="sm" onClick={addModule}><TbPlus className="mr-2" /> Add Module</Button>
                        </div>
                        {tutorial.modules.map((mod, i) => (
                            <Card key={i} className="relative">
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeModule(i)}>
                                    <TbTrash />
                                </Button>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex gap-2 items-center">
                                        <Badge variant="outline" className="h-6 w-6 flex items-center justify-center p-0">{i + 1}</Badge>
                                        <Input value={mod.title} onChange={e => handleModuleChange(i, 'title', e.target.value)} placeholder="Module Title" className="font-semibold" />
                                    </div>
                                    <div className="pl-8 space-y-3">
                                        <div className="relative">
                                            <TbQuote className="absolute top-3 left-3 text-muted-foreground opacity-50" />
                                            <Textarea value={mod.quote} onChange={e => handleModuleChange(i, 'quote', e.target.value)} placeholder="Quote / Code / Source" className="pl-10 font-mono text-sm bg-muted/50" />
                                        </div>
                                        <div className="relative">
                                            <TbInfoCircle className="absolute top-3 left-3 text-blue-500 opacity-50" />
                                            <Textarea value={mod.explanation} onChange={e => handleModuleChange(i, 'explanation', e.target.value)} placeholder="ELI5 Explanation" className="pl-10 text-sm" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Meta Advice */}
                    <Card className="border-yellow-500/20 bg-yellow-500/5">
                        <CardHeader><CardTitle className="text-yellow-600">Meta Advice (The Secret)</CardTitle></CardHeader>
                        <CardContent>
                            <Textarea value={tutorial.metaAdvice} onChange={e => setTutorial({ ...tutorial, metaAdvice: e.target.value })} className="font-serif italic" />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Status & Meta</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Status</Label>
                                <select
                                    className="w-full border rounded-md p-2 bg-background"
                                    value={tutorial.status}
                                    onChange={e => setTutorial({ ...tutorial, status: e.target.value as any })}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                            <div>
                                <Label>Tags</Label>
                                <Input
                                    placeholder="Enter (comma separated)"
                                    value={tutorial.tags.join(', ')}
                                    onChange={e => setTutorial({ ...tutorial, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Visuals</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Cover Image (16:9)</Label>
                                <Input value={tutorial.coverImage} onChange={e => setTutorial({ ...tutorial, coverImage: e.target.value })} placeholder="https://..." />
                                {tutorial.coverImage && <img src={tutorial.coverImage} className="mt-2 rounded-md border w-full h-32 object-cover" />}
                            </div>
                            <div>
                                <Label>Mobile Cover (9:16)</Label>
                                <Input value={tutorial.mobileCoverImage} onChange={e => setTutorial({ ...tutorial, mobileCoverImage: e.target.value })} placeholder="https://..." />
                                {tutorial.mobileCoverImage && <img src={tutorial.mobileCoverImage} className="mt-2 rounded-md border w-24 h-40 object-cover" />}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Import Dialog */}
            <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Import from Agent Alpha</DialogTitle>
                        <DialogDescription>Paste the generated output here.</DialogDescription>
                    </DialogHeader>
                    <Textarea
                        value={importText}
                        onChange={e => setImportText(e.target.value)}
                        className="min-h-[400px] font-mono text-xs"
                        placeholder="Paste the full output..."
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowImportDialog(false)}>Cancel</Button>
                        <Button onClick={handleImport}>Parse & Fill</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

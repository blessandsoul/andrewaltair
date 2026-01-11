"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast"
import { TbSparkles, TbPlus, TbTrash, TbArrowLeft, TbLoader2, TbCurrencyDollar, TbPhotoPlus, TbWand, TbX, TbChartBar, TbHistory, TbFlask, TbLink, TbRobot } from "react-icons/tb"

interface PromptVariable {
    name: string
    description?: string
    type: 'text' | 'number' | 'select' | 'boolean'
    options?: string[]
    default?: string
    required: boolean
}

interface ExampleImage {
    src: string
    alt?: string
    promptUsed?: string
}

interface MarketplacePromptData {
    id?: string
    slug: string
    title: string
    description: string
    excerpt?: string
    price: number
    currency: 'GEL' | 'USD'
    originalPrice?: number
    promptTemplate: string
    negativePrompt?: string
    variables: PromptVariable[]
    instructions: string
    aiModel: string
    aiModelVersion?: string
    generationType: 'text-to-image' | 'text-to-text' | 'image-to-image' | 'text-to-video'
    aspectRatio?: string
    coverImage: string
    exampleImages: ExampleImage[]
    category: string[]
    tags: string[]
    status: 'draft' | 'published' | 'archived'
    featuredOrder?: number
    metaTitle?: string
    metaDescription?: string

    // New Fields
    views: number
    purchases: number
    rating: number
    versions?: { version: number, date: string, changes: string }[]
    abTests?: { name: string, traffic: number, conversion: number }[]
    relatedPrompts?: string[]
    bundles?: string[]
}

const DEFAULT_DATA: MarketplacePromptData = {
    slug: "",
    title: "",
    description: "",
    excerpt: "",
    price: 0,
    currency: "GEL",
    promptTemplate: "",
    negativePrompt: "",
    variables: [],
    instructions: "",
    aiModel: "Gemini 2.0",
    generationType: "text-to-image",
    aspectRatio: "16:9",
    coverImage: "",
    exampleImages: [],
    category: [],
    tags: [],
    status: "published",
    views: 0,
    purchases: 0,
    rating: 0
}

const CATEGORIES = [
    { value: "illustration", label: "ილუსტრაცია" },
    { value: "photography", label: "ფოტოგრაფია" },
    { value: "art", label: "ხელოვნება" },
    { value: "design", label: "დიზაინი" },
    { value: "marketing", label: "მარკეტინგი" },
    { value: "writing", label: "წერა" },
    { value: "coding", label: "კოდირება" },
    { value: "business", label: "ბიზნესი" },
    { value: "3d-assets", label: "3D რენდერი" },
    { value: "fashion", label: "მოდა" },
    { value: "architecture", label: "არქიტექტურა" },
    { value: "gaming", label: "გეიმინგი" },
    { value: "logo", label: "ლოგოები" },
    { value: "ui-ux", label: "ინტერფეისი" },
    { value: "other", label: "სხვა" },
]

const ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4", "2:3", "3:2", "21:9"]
const VARIABLE_TYPES = ["text", "number", "select", "boolean"]

interface Props {
    initialData?: Partial<MarketplacePromptData>
    isEditing?: boolean
}

export default function MarketplacePromptEditor({ initialData, isEditing = false }: Props) {
    const router = useRouter()
    const [data, setData] = React.useState<MarketplacePromptData>(() => {
        const merged = { ...DEFAULT_DATA, ...initialData }
        // Runtime check for legacy data where category might be string
        if (merged.category && !Array.isArray(merged.category)) {
            // @ts-ignore
            merged.category = [merged.category]
        }
        return merged
    })
    const [isSaving, setIsSaving] = React.useState(false)
    const [isUploading, setIsUploading] = React.useState(false)
    const [isGenerating, setIsGenerating] = React.useState(false)
    const [newTag, setNewTag] = React.useState("")
    const { success, error } = useToast()

    // Import state
    const [showImportDialog, setShowImportDialog] = React.useState(false)
    const [importText, setImportText] = React.useState("")

    const handleBotImport = async () => {
        if (!importText.trim()) {
            error("იმპორტის შეცდომა", "გთხოვთ ჩასვათ ტექსტი იმპორტისთვის")
            return
        }

        console.log("Starting FAST Regex Import...")
        const newData = { ...data }

        // 1. EXTRACT PROMPT & NEGATIVE (Code Block)
        // We do this FIRST so we can remove it from the text to avoid polluting tags
        const rawText = importText.replace(/\r\n/g, '\n').trim()
        const codeBlockRegex = /```(?:markdown|md|txt)?\s*([\s\S]+?)```/i
        const codeMatch = rawText.match(codeBlockRegex)
        let cleanTextForMeta = rawText

        if (codeMatch) {
            const codeContent = codeMatch[1].trim()

            // Remove the code block from the text used for metadata
            cleanTextForMeta = rawText.replace(codeMatch[0], '')

            // Extract Negative
            const negRegex = /--negative_prompt:\s*([\s\S]+?)(?:$|--)/i
            const negMatch = codeContent.match(negRegex)

            if (negMatch) {
                newData.negativePrompt = negMatch[1].trim()
                // Remove negative prompt from body
                newData.promptTemplate = codeContent.replace(negRegex, '').trim()
            } else {
                newData.promptTemplate = codeContent
            }

            // Cleanup args
            newData.promptTemplate = newData.promptTemplate.replace(/--negative_prompt:.*(\n|$)/gi, '').trim()
        } else {
            error("ფორმატის ხარვეზი", "ვერ ვიპოვე კოდის ბლოკი (```) პრომპტისთვის.")
            return
        }

        // 2. PARSE METADATA FROM REMAINING TEXT
        const lines = cleanTextForMeta.split('\n').map(l => l.trim()).filter(Boolean)

        let titleFound = false
        let descFound = false
        let catsFound = false

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]

            // Skip garbage
            if (line.includes('როგორ მივიღოთ') || line.includes('---')) continue

            // A) CATEGORIES
            if (line.match(/^(📂|📁)?\s*\**\s*(კატეგორია|Category|Категория)/i)) {
                const lowerLine = line.toLowerCase()
                const catsToAdd: string[] = []

                CATEGORIES.forEach(cat => {
                    if (lowerLine.includes(cat.value.toLowerCase()) || lowerLine.includes(cat.label.toLocaleLowerCase())) {
                        catsToAdd.push(cat.value)
                    }
                })

                if (catsToAdd.length > 0) {
                    newData.category = [...new Set([...newData.category, ...catsToAdd])]
                    catsFound = true
                }
                continue
            }

            // B) TITLE
            if (!titleFound) {
                if (line.includes('**') || i === 0) {
                    let clean = line.replace(/\*\*/g, '')
                    clean = clean.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/u, '')
                    newData.title = clean.trim()
                    titleFound = true
                    continue
                }
            }

            // C) DESCRIPTION (Must be after title)
            if (titleFound && !descFound && !catsFound && !line.includes('კატეგორია')) {
                if (line.length > 20) {
                    let clean = line.replace(/^\**\s*/, '').replace(/\*\*/g, '')
                    clean = clean.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/u, '')
                    newData.description = clean.trim()
                    newData.excerpt = newData.description.substring(0, 150) + '...'
                    descFound = true
                    continue
                }
            }

            // D) TAGS
            // Stricter logic: Must contain commas, NOT contain "Code:", NOT contain URL, NOT be a sentence ending in '.'
            if (line.includes(',') && !line.includes('Code:') && !line.includes('Google') && !line.includes('http')) {
                // If it has >= 3 items
                if ((line.match(/,/g) || []).length >= 2) {
                    const items = line.split(/[,،]+/).map(s => s.trim())
                    // Filter: must be short (max 2 words or 30 chars), no **
                    const validTags = items.filter(t =>
                        t.length > 1 &&
                        t.length < 30 &&
                        !t.includes('**') &&
                        !t.includes('Maintain') && // Specific blacklist based on user screenshot
                        !t.includes('--')
                    )

                    if (validTags.length > 0) {
                        newData.tags = [...new Set([...newData.tags, ...validTags])]
                    }
                }
            }
        }

        // 3. VARIABLE EXTRACTION (Client Regex)
        const varRegex = /\[([A-Z0-9_]+)\]/g
        const matches = [...(newData.promptTemplate || "").matchAll(varRegex)]
        const foundVars = [...new Set(matches.map(m => m[1]))]

        if (foundVars.length > 0) {
            const variablesToAdd: PromptVariable[] = foundVars.map(name => ({
                name,
                description: "",
                type: "text",
                options: [],
                required: true
            }))
            const currentNames = newData.variables.map(v => v.name)
            const uniqueToAdd = variablesToAdd.filter(v => !currentNames.includes(v.name))
            newData.variables = [...newData.variables, ...uniqueToAdd]
        }

        newData.status = 'published'

        // 4. SET DATA INSTANTLY (UI Updates now)
        setData(newData)
        setShowImportDialog(false)
        setImportText("")
        success("იმპორტი დასრულდა ⚡", "მონაცემები ამოღებულია.")

        // 5. ASYNC SEO FILL (Background)
        // Only run if we are missing key SEO fields to avoid overwriting if user manually entered them (unlikely here but good practice)
        // Actually, for a fresh import, we always want to generate SLUG at least.
        const token = localStorage.getItem('auth_token')
        setIsGenerating(true)
        console.log("Triggering Background SEO Gen...")

        try {
            const genRes = await fetch('/api/marketplace-prompts/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: newData.title,
                    description: newData.description,
                    promptTemplate: newData.promptTemplate
                }),
            })

            if (genRes.ok) {
                const generated = await genRes.json()

                setData(current => ({
                    ...current,
                    slug: current.slug || generated.slug, // Only if empty
                    metaTitle: current.metaTitle || generated.metaTitle,
                    metaDescription: current.metaDescription || generated.metaDescription,
                    excerpt: current.excerpt || generated.excerpt,
                    // DO NOT TOUCH TAGS - User specific request
                }))
                success("SEO მონაცემები შეავსო AI-მ ✨", "Slug და Meta Tags დაემატა.")
            }
        } catch (e) {
            console.error("Background SEO Gen failed", e)
        } finally {
            setIsGenerating(false)
        }
    }

    // Auto-Generate Metadata
    const handleAutoGenerate = async () => {
        if (!data.title && !data.description && !data.promptTemplate) {
            alert('გთხოვთ შეავსოთ სათაური, აღწერა ან პრომპტი გენერაციისთვის')
            return
        }

        setIsGenerating(true)
        try {
            const res = await fetch('/api/marketplace-prompts/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: data.title,
                    description: data.description,
                    promptTemplate: data.promptTemplate
                }),
            })

            const generated = await res.json()

            if (res.ok) {
                setData(prev => ({
                    ...prev,
                    slug: generated.slug || prev.slug,
                    tags: generated.tags || prev.tags,
                    metaTitle: generated.metaTitle || prev.metaTitle,
                    metaDescription: generated.metaDescription || prev.metaDescription,
                    excerpt: generated.excerpt || prev.excerpt,
                    exampleImages: prev.exampleImages.map(img => ({
                        ...img,
                        alt: img.alt || generated.altText
                    }))
                }))
            }
        } catch (error) {
            console.error('Generation error:', error)
        } finally {
            setIsGenerating(false)
        }
    }

    // Parse variables from prompt template
    const extractVariables = () => {
        const regex = /\[([A-Z0-9_]+)\]/g
        const matches = [...data.promptTemplate.matchAll(regex)]
        const foundVars = [...new Set(matches.map(m => m[1]))]

        const currentVars = data.variables.map(v => v.name)
        const newVars = foundVars.filter(v => !currentVars.includes(v))

        if (newVars.length > 0) {
            const variablesToAdd: PromptVariable[] = newVars.map(name => ({
                name,
                description: "",
                type: "text",
                options: [],
                required: true
            }))
            setData(prev => ({
                ...prev,
                variables: [...prev.variables, ...variablesToAdd]
            }))
        }
    }

    // Handle title change
    const handleTitleChange = (title: string) => {
        setData(prev => ({
            ...prev,
            title,
        }))
    }

    // Handle file upload
    const handleFileUpload = async (files: FileList | null, type: 'cover' | 'example') => {
        if (!files || files.length === 0) return

        setIsUploading(true)
        try {
            // Bulk upload support
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                const formData = new FormData()
                formData.append('file', file)

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (res.ok) {
                    const { url } = await res.json()
                    if (type === 'cover') {
                        setData(prev => ({ ...prev, coverImage: url }))
                        break; // Only one cover image
                    } else {
                        setData(prev => ({
                            ...prev,
                            exampleImages: [...prev.exampleImages, { src: url, alt: '', promptUsed: '' }]
                        }))
                    }
                }
            }
        } catch (error) {
            console.error('Upload error:', error)
        } finally {
            setIsUploading(false)
        }
    }

    const addTag = () => {
        if (newTag && !data.tags.includes(newTag)) {
            setData(prev => ({ ...prev, tags: [...prev.tags, newTag] }))
            setNewTag("")
        }
    }

    const removeTag = (tag: string) => {
        setData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
    }

    // Save
    const handleSave = async () => {
        if (!data.title || !data.promptTemplate || data.category.length === 0) {
            alert('გთხოვთ შეავსოთ სათაური, პრომპტის შაბლონი და კატეგორია')
            return
        }

        setIsSaving(true)
        try {
            const url = isEditing
                ? `/api/marketplace-prompts/${data.id}`
                : '/api/marketplace-prompts'

            const res = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                router.push('/admin/marketplace-prompts')
            } else {
                const error = await res.json()
                alert(error.error || 'შეცდომა შენახვისას')
            }
        } catch (error) {
            console.error('Save error:', error)
            alert('შეცდომა შენახვისას')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b pb-4 pt-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <TbArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            {isEditing ? 'Edit Prompt' : 'New Prompt'}
                        </h1>
                        <p className="text-xs text-muted-foreground">{data.slug || 'untitled-prompt'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowImportDialog(true)}
                        className="hidden md:flex gap-2"
                    >
                        <TbRobot className="w-4 h-4" />
                        Bot Import
                    </Button>
                    <div className="h-6 w-px bg-border mx-2" />

                    <Select
                        value={data.status}
                        onValueChange={(v) => setData(prev => ({ ...prev, status: v as MarketplacePromptData['status'] }))}
                    >
                        <SelectTrigger className="w-[130px] border-none bg-secondary/50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={handleSave} disabled={isSaving} className="min-w-[100px]">
                        {isSaving ? <TbLoader2 className="w-4 h-4 animate-spin" /> : 'Save Prompt'}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="editor" className="w-full">
                <TabsList className="grid w-full grid-cols-4 max-w-2xl mb-8">
                    <TabsTrigger value="editor" className="gap-2"><TbSparkles className="w-4 h-4" /> Editor</TabsTrigger>
                    <TabsTrigger value="analytics" className="gap-2"><TbChartBar className="w-4 h-4" /> Analytics</TabsTrigger>
                    <TabsTrigger value="versions" className="gap-2"><TbHistory className="w-4 h-4" /> Versions</TabsTrigger>
                    <TabsTrigger value="abtest" className="gap-2"><TbFlask className="w-4 h-4" /> A/B Tests</TabsTrigger>
                </TabsList>

                <TabsContent value="editor" className="space-y-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column: Media & Meta */}
                        <div className="space-y-6 lg:col-span-1">
                            {/* Cover Image */}
                            <Card className="overflow-hidden border-dashed">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Cover Image</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {data.coverImage ? (
                                        <div className="relative aspect-video rounded-md overflow-hidden group">
                                            <Image
                                                src={data.coverImage}
                                                alt="Cover"
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                            />
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => setData(prev => ({ ...prev, coverImage: '' }))}
                                            >
                                                <TbTrash className="w-4 h-4" />
                                            </Button>
                                            <Badge className="absolute bottom-2 left-2 bg-black/50 text-white backdrop-blur-sm pointer-events-none">
                                                Main Cover
                                            </Badge>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center aspect-video bg-secondary/20 hover:bg-secondary/40 border-2 border-dashed rounded-md cursor-pointer transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    handleFileUpload(e.target.files, 'cover')
                                                }}
                                            />
                                            {isUploading ? (
                                                <TbLoader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                                            ) : (
                                                <>
                                                    <TbPhotoPlus className="w-8 h-8 text-muted-foreground mb-2" />
                                                    <span className="text-xs text-muted-foreground">Upload Cover</span>
                                                </>
                                            )}
                                        </label>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Configuration */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Configuration</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Price</Label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <TbCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    type="number"
                                                    value={data.price}
                                                    onChange={(e) => setData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                                    className="pl-9 !ring-0 !focus-visible:ring-0 !focus-visible:ring-offset-0"
                                                    min={0}
                                                    step={0.01}
                                                />
                                            </div>
                                            <Select
                                                value={data.currency}
                                                onValueChange={(v) => setData(prev => ({ ...prev, currency: v as 'GEL' | 'USD' }))}
                                            >
                                                <SelectTrigger className="w-[80px] !ring-0 !focus-visible:ring-0 !focus-visible:ring-offset-0">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="GEL">GEL</SelectItem>
                                                    <SelectItem value="USD">USD</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Categories</Label>
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {data.category.map(cat => (
                                                <Badge key={cat} variant="outline" className="text-[10px] px-1.5 h-5 gap-1 hover:bg-destructive hover:text-destructive-foreground cursor-pointer transition-colors"
                                                    onClick={() => setData(prev => ({ ...prev, category: prev.category.filter(c => c !== cat) }))}
                                                >
                                                    {CATEGORIES.find(c => c.value === cat)?.label || cat}
                                                </Badge>
                                            ))}
                                        </div>
                                        <Select
                                            value=""
                                            onValueChange={(v) => {
                                                if (!data.category.includes(v)) {
                                                    setData(prev => ({ ...prev, category: [...prev.category, v] }))
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="!ring-0 !focus-visible:ring-0 !focus-visible:ring-offset-0">
                                                <span className="text-muted-foreground text-xs">Select categories...</span>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CATEGORIES.map(cat => (
                                                    <SelectItem key={cat.value} value={cat.value} disabled={data.category.includes(cat.value)}>
                                                        {cat.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Aspect Ratio Removed */}

                                    <div className="pt-2 border-t">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Tags</Label>
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {data.tags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 h-5 gap-1 hover:bg-destructive hover:text-destructive-foreground cursor-pointer transition-colors" onClick={() => removeTag(tag)}>
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <Input
                                                className="h-8 text-xs !ring-0 !focus-visible:ring-0 !focus-visible:ring-offset-0"
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                placeholder="Add tag..."
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                            />
                                            <Button size="sm" variant="outline" onClick={addTag} className="h-8 w-8 p-0">
                                                <TbPlus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Relationships */}
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="relationships" className="border rounded-md px-4">
                                    <AccordionTrigger className="text-sm text-muted-foreground py-3"><TbLink className="mr-2 w-4 h-4" /> Related & Bundles</AccordionTrigger>
                                    <AccordionContent className="space-y-4 pt-2">
                                        <div className="space-y-2">
                                            <Label className="text-xs">Related Prompts (IDs)</Label>
                                            <Input
                                                value={data.relatedPrompts?.join(', ') || ''}
                                                onChange={(e) => setData(prev => ({ ...prev, relatedPrompts: e.target.value.split(',').map(s => s.trim()) }))}
                                                placeholder="Comma separated IDs..."
                                                className="h-8 text-xs !ring-0 !focus-visible:ring-0 !focus-visible:ring-offset-0"
                                            />
                                            <p className="text-[10px] text-muted-foreground">Feature coming soon: Visual selector</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Add to Bundle (IDs)</Label>
                                            <Input
                                                value={data.bundles?.join(', ') || ''}
                                                onChange={(e) => setData(prev => ({ ...prev, bundles: e.target.value.split(',').map(s => s.trim()) }))}
                                                placeholder="Comma separated IDs..."
                                                className="h-8 text-xs !ring-0 !focus-visible:ring-0 !focus-visible:ring-offset-0"
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            {/* Advanced / Auto-Filled (Collapsed) */}
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="advanced" className="border rounded-md px-4">
                                    <AccordionTrigger className="text-sm text-muted-foreground py-3">Advanced & SEO</AccordionTrigger>
                                    <AccordionContent className="space-y-4 pt-2">
                                        <div className="space-y-2">
                                            <Label className="text-xs">Meta Title</Label>
                                            <Input
                                                value={data.metaTitle || ''}
                                                onChange={(e) => setData(prev => ({ ...prev, metaTitle: e.target.value }))}
                                                className="h-8 text-xs !ring-0 !focus-visible:ring-0 !focus-visible:ring-offset-0"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Meta Description</Label>
                                            <Textarea
                                                value={data.metaDescription || ''}
                                                onChange={(e) => setData(prev => ({ ...prev, metaDescription: e.target.value }))}
                                                className="text-xs min-h-[60px] !ring-0 !focus-visible:ring-0 !focus-visible:ring-offset-0"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">URL Slug</Label>
                                            <Input
                                                value={data.slug}
                                                readOnly
                                                disabled
                                                className="h-8 text-xs bg-muted !ring-0 !focus-visible:ring-0 !focus-visible:ring-offset-0"
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        {/* Right Column: Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            <Card className="border-none shadow-none bg-transparent p-0 overflow-visible">
                                <CardContent className="p-0 space-y-6">
                                    <div className="space-y-2">
                                        <Input
                                            value={data.title}
                                            onChange={(e) => handleTitleChange(e.target.value)}
                                            placeholder="Enter prompt title..."
                                            className="text-3xl font-bold h-auto py-2 px-0 border-0 border-b rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-muted-foreground/50 !ring-0 !focus-visible:ring-0 !focus-visible:ring-offset-0"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-lg font-medium">Prompt Template</Label>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={extractVariables}
                                                className="h-7 text-xs gap-1"
                                            >
                                                <TbSparkles className="w-3 h-3" />
                                                Update Variables
                                            </Button>
                                        </div>
                                        <div className="relative">
                                            <Textarea
                                                value={data.promptTemplate}
                                                onChange={(e) => setData(prev => ({ ...prev, promptTemplate: e.target.value }))}
                                                placeholder="A futuristic city with [FLYING_CARS] and [NEON_LIGHTS]..."
                                                className="min-h-[200px] font-mono text-base leading-relaxed p-4 resize-y bg-muted/30 focus:bg-background transition-colors !ring-0 !focus-visible:ring-0 !focus-visible:ring-offset-0"
                                            />
                                            <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground bg-background/80 px-2 py-1 rounded border">
                                                Use [SQUARE_BRACKETS] for variables
                                            </div>
                                        </div>
                                    </div>

                                    {/* Negative Prompt */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">Negative Prompt (What to avoid)</Label>
                                        <Input
                                            value={data.negativePrompt || ''}
                                            onChange={(e) => setData(prev => ({ ...prev, negativePrompt: e.target.value }))}
                                            placeholder="blurry, low quality, deformed, ugly..."
                                            className="font-mono text-sm bg-muted/20 border-dashed !ring-0 !focus-visible:ring-0 !focus-visible:ring-offset-0"
                                        />
                                    </div>

                                    {/* Variables Section */}
                                    {data.variables.length > 0 && (
                                        <div className="space-y-3 p-4 border rounded-lg bg-card/50">
                                            <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Variables Configuration</Label>
                                            <div className="grid gap-3">
                                                {data.variables.map((variable, index) => (
                                                    <div key={index} className="flex flex-col gap-3 bg-background p-4 rounded-md border text-sm">
                                                        <div className="flex items-center gap-3">
                                                            <Badge variant="outline" className="font-mono text-primary border-primary/20 bg-primary/5">
                                                                [{variable.name}]
                                                            </Badge>
                                                            <div className="flex-1" />
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                                                onClick={() => setData(prev => ({ ...prev, variables: prev.variables.filter((_, i) => i !== index) }))}
                                                            >
                                                                <TbX className="w-4 h-4" />
                                                            </Button>
                                                        </div>

                                                        <div className="grid sm:grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <Label className="text-[10px] uppercase text-muted-foreground">Type</Label>
                                                                <Select
                                                                    value={variable.type}
                                                                    onValueChange={(v) => {
                                                                        const newVars = [...data.variables]
                                                                        newVars[index].type = v as any
                                                                        setData(prev => ({ ...prev, variables: newVars }))
                                                                    }}
                                                                >
                                                                    <SelectTrigger className="h-8 !ring-0 !focus-visible:ring-0 !focus-visible:ring-offset-0">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {VARIABLE_TYPES.map(t => (
                                                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-[10px] uppercase text-muted-foreground">Display Label</Label>
                                                                <Input
                                                                    value={variable.description || ''}
                                                                    onChange={(e) => {
                                                                        const newVars = [...data.variables]
                                                                        newVars[index].description = e.target.value
                                                                        setData(prev => ({ ...prev, variables: newVars }))
                                                                    }}
                                                                    className="h-8 !ring-0 !focus-visible:ring-0 !focus-visible:ring-offset-0"
                                                                    placeholder="e.g. Choose Color"
                                                                />
                                                            </div>
                                                        </div>

                                                        {(variable.type === 'select') && (
                                                            <div className="space-y-1">
                                                                <Label className="text-[10px] uppercase text-muted-foreground">Options (comma separated)</Label>
                                                                <Input
                                                                    value={variable.options?.join(', ') || ''}
                                                                    onChange={(e) => {
                                                                        const newVars = [...data.variables]
                                                                        newVars[index].options = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                                                        setData(prev => ({ ...prev, variables: newVars }))
                                                                    }}
                                                                    className="h-8 !ring-0 !focus-visible:ring-0 !focus-visible:ring-offset-0"
                                                                    placeholder="red, green, blue..."
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label className="text-lg font-medium">Description</Label>
                                        <Textarea
                                            value={data.description}
                                            onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Describe what this prompt does, best settings to use, etc."
                                            rows={6}
                                            className="resize-y !ring-0 !focus-visible:ring-0 !focus-visible:ring-offset-0"
                                        />
                                    </div>

                                    {/* Gallery Grid */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-lg font-medium">Example Gallery</Label>
                                            <label className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        handleFileUpload(e.target.files, 'example')
                                                    }}
                                                />
                                                <span className="flex items-center gap-2 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
                                                    <TbPlus className="w-3 h-3" />
                                                    Bulk Add Images
                                                </span>
                                            </label>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {data.exampleImages.map((img, index) => (
                                                <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border bg-muted">
                                                    <Image
                                                        src={img.src}
                                                        alt={img.alt || `Example ${index}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            className="h-8 w-8 rounded-full"
                                                            onClick={() => setData(prev => ({
                                                                ...prev,
                                                                exampleImages: prev.exampleImages.filter((_, i) => i !== index)
                                                            }))}
                                                        >
                                                            <TbTrash className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                    {img.alt && (
                                                        <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/60 text-white text-[10px] truncate px-2">
                                                            {img.alt}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {data.exampleImages.length === 0 && (
                                                <div className="col-span-full py-8 text-center text-muted-foreground bg-secondary/20 border-2 border-dashed rounded-lg">
                                                    <p className="text-sm">Drag and drop or click "Bulk Add Images" to upload examples.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="analytics" className="min-h-[400px]">
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle></CardHeader>
                            <CardContent><div className="text-2xl font-bold">{data.views}</div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Purchases</CardTitle></CardHeader>
                            <CardContent><div className="text-2xl font-bold">{data.purchases}</div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Rating</CardTitle></CardHeader>
                            <CardContent><div className="text-2xl font-bold">{data.rating.toFixed(1)} / 5.0</div></CardContent>
                        </Card>
                    </div>
                    <Card className="h-[300px] flex items-center justify-center border-dashed">
                        <div className="text-center text-muted-foreground">
                            <TbChartBar className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p>Detailed sales chart will appear here once data is available.</p>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="versions" className="min-h-[400px]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Version History</CardTitle>
                            <CardDescription>View and rollback to previous versions of your prompt.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.versions && data.versions.length > 0 ? (
                                <div className="space-y-4">
                                    {data.versions.map((version, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <p className="font-medium">Version {version.version}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(version.date).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-sm text-muted-foreground">{version.changes}</div>
                                            <Button variant="outline" size="sm">Rollback</Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-center py-10 text-muted-foreground">
                                    No previous versions saved yet. Versions are created automatically when you publish.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="abtest" className="min-h-[400px]">
                    <Card>
                        <CardHeader>
                            <CardTitle>A/B Testing</CardTitle>
                            <CardDescription>Create variants to test different prompt structures.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center mb-6">
                                <Button variant="outline"><TbPlus className="mr-2 w-4 h-4" /> Create Variant</Button>
                            </div>

                            {data.abTests && data.abTests.length > 0 ? (
                                <div className="space-y-4">
                                    {data.abTests.map((test, i) => (
                                        <div key={i} className="p-4 border rounded-lg bg-card text-card-foreground">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-semibold">{test.name}</span>
                                                <Badge variant={i === 0 ? 'default' : 'secondary'}>{i === 0 ? 'Control' : 'Variant'}</Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>Traffic: {(test.traffic * 100).toFixed(0)}%</div>
                                                <div>Conversion: {(test.conversion * 100).toFixed(1)}%</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-center py-10 text-muted-foreground border-t">
                                    Active A/B tests will be listed here.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Import from Bot Output</DialogTitle>
                        <DialogDescription>
                            Paste the full text output from your prompt generation bot. We'll extract the description, prompt, negative prompt, and aspect ratio.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Textarea
                            value={importText}
                            onChange={(e) => setImportText(e.target.value)}
                            placeholder="Paste bot output here..."
                            className="h-[300px] font-mono text-xs !ring-0 !focus-visible:ring-0 !focus-visible:ring-offset-0"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowImportDialog(false)}>Cancel</Button>
                        <Button onClick={handleBotImport} disabled={!importText.trim()}>Parse & Import</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

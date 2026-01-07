"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TbSparkles, TbPhoto, TbPlus, TbTrash, TbDeviceFloppy, TbArrowLeft, TbLoader2, TbCurrencyDollar, TbUpload, TbX, TbCode, TbFileText, TbSettings, TbPhotoPlus } from "react-icons/tb"

interface PromptVariable {
    name: string
    description?: string
    options?: string[]
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
    variables: PromptVariable[]
    instructions: string
    aiModel: string
    aiModelVersion?: string
    generationType: 'text-to-image' | 'text-to-text' | 'image-to-image' | 'text-to-video'
    coverImage: string
    exampleImages: ExampleImage[]
    category: string
    tags: string[]
    status: 'draft' | 'published' | 'archived'
    featuredOrder?: number
    metaTitle?: string
    metaDescription?: string
}

const DEFAULT_DATA: MarketplacePromptData = {
    slug: "",
    title: "",
    description: "",
    excerpt: "",
    price: 0,
    currency: "GEL",
    promptTemplate: "",
    variables: [],
    instructions: "",
    aiModel: "Gemini 2.0",
    generationType: "text-to-image",
    coverImage: "",
    exampleImages: [],
    category: "illustration",
    tags: [],
    status: "draft",
}

const AI_MODELS = [
    "Gemini 2.0",
    "Gemini 2.0 Flash",
    "Midjourney v6",
    "DALL-E 3",
    "Stable Diffusion XL",
    "Claude 3.5",
    "GPT-4",
    "Ideogram",
    "Flux",
]

const CATEGORIES = [
    { value: "illustration", label: "ილუსტრაცია" },
    { value: "photography", label: "ფოტოგრაფია" },
    { value: "art", label: "ხელოვნება" },
    { value: "design", label: "დიზაინი" },
    { value: "marketing", label: "მარკეტინგი" },
    { value: "writing", label: "წერა" },
    { value: "coding", label: "კოდირება" },
    { value: "business", label: "ბიზნესი" },
    { value: "other", label: "სხვა" },
]

const GENERATION_TYPES = [
    { value: "text-to-image", label: "ტექსტიდან სურათი" },
    { value: "text-to-text", label: "ტექსტიდან ტექსტი" },
    { value: "image-to-image", label: "სურათიდან სურათი" },
    { value: "text-to-video", label: "ტექსტიდან ვიდეო" },
]

interface Props {
    initialData?: Partial<MarketplacePromptData>
    isEditing?: boolean
}

export default function MarketplacePromptEditor({ initialData, isEditing = false }: Props) {
    const router = useRouter()
    const [data, setData] = React.useState<MarketplacePromptData>({
        ...DEFAULT_DATA,
        ...initialData,
    })
    const [isSaving, setIsSaving] = React.useState(false)
    const [isUploading, setIsUploading] = React.useState(false)
    const [newTag, setNewTag] = React.useState("")
    const [newVariableName, setNewVariableName] = React.useState("")
    const [newVariableOption, setNewVariableOption] = React.useState("")

    // Generate slug from title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[ა-ჰ]/g, (char) => {
                const map: Record<string, string> = {
                    'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v',
                    'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm',
                    'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's',
                    'ტ': 't', 'უ': 'u', 'ფ': 'f', 'ქ': 'q', 'ღ': 'gh', 'ყ': 'y',
                    'შ': 'sh', 'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'ch',
                    'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h'
                }
                return map[char] || char
            })
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }

    // Handle title change
    const handleTitleChange = (title: string) => {
        setData(prev => ({
            ...prev,
            title,
            slug: prev.slug ? prev.slug : generateSlug(title)
        }))
    }

    // Handle file upload
    const handleFileUpload = async (file: File, type: 'cover' | 'example') => {
        setIsUploading(true)
        try {
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
                } else {
                    setData(prev => ({
                        ...prev,
                        exampleImages: [...prev.exampleImages, { src: url, alt: '', promptUsed: '' }]
                    }))
                }
            }
        } catch (error) {
            console.error('Upload error:', error)
        } finally {
            setIsUploading(false)
        }
    }

    // Add tag
    const addTag = () => {
        if (newTag && !data.tags.includes(newTag)) {
            setData(prev => ({ ...prev, tags: [...prev.tags, newTag] }))
            setNewTag("")
        }
    }

    // Remove tag
    const removeTag = (tag: string) => {
        setData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
    }

    // Add variable
    const addVariable = () => {
        if (newVariableName) {
            setData(prev => ({
                ...prev,
                variables: [...prev.variables, {
                    name: newVariableName.toUpperCase().replace(/\s+/g, '_'),
                    description: '',
                    options: [],
                    required: true
                }]
            }))
            setNewVariableName("")
        }
    }

    // Update variable
    const updateVariable = (index: number, field: keyof PromptVariable, value: unknown) => {
        setData(prev => ({
            ...prev,
            variables: prev.variables.map((v, i) => i === index ? { ...v, [field]: value } : v)
        }))
    }

    // Add option to variable
    const addVariableOption = (index: number) => {
        if (newVariableOption) {
            setData(prev => ({
                ...prev,
                variables: prev.variables.map((v, i) =>
                    i === index ? { ...v, options: [...(v.options || []), newVariableOption] } : v
                )
            }))
            setNewVariableOption("")
        }
    }

    // Remove variable
    const removeVariable = (index: number) => {
        setData(prev => ({
            ...prev,
            variables: prev.variables.filter((_, i) => i !== index)
        }))
    }

    // Remove example image
    const removeExampleImage = (index: number) => {
        setData(prev => ({
            ...prev,
            exampleImages: prev.exampleImages.filter((_, i) => i !== index)
        }))
    }

    // Update example image
    const updateExampleImage = (index: number, field: keyof ExampleImage, value: string) => {
        setData(prev => ({
            ...prev,
            exampleImages: prev.exampleImages.map((img, i) =>
                i === index ? { ...img, [field]: value } : img
            )
        }))
    }

    // Save
    const handleSave = async () => {
        if (!data.title || !data.promptTemplate || !data.category) {
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <TbArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <TbSparkles className="w-6 h-6 text-primary" />
                            {isEditing ? 'პრომპტის რედაქტირება' : 'ახალი პრომპტი'}
                        </h1>
                        <p className="text-muted-foreground text-sm">მარკეტპლეისის პრომპტი</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Select
                        value={data.status}
                        onValueChange={(v) => setData(prev => ({ ...prev, status: v as MarketplacePromptData['status'] }))}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">დრაფტი</SelectItem>
                            <SelectItem value="published">გამოქვეყნება</SelectItem>
                            <SelectItem value="archived">არქივი</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <TbLoader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <TbDeviceFloppy className="w-4 h-4 mr-2" />
                        )}
                        შენახვა
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic" className="gap-1">
                        <TbFileText className="w-4 h-4" /> ძირითადი
                    </TabsTrigger>
                    <TabsTrigger value="prompt" className="gap-1">
                        <TbCode className="w-4 h-4" /> პრომპტი
                    </TabsTrigger>
                    <TabsTrigger value="gallery" className="gap-1">
                        <TbPhoto className="w-4 h-4" /> გალერეა
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-1">
                        <TbSettings className="w-4 h-4" /> პარამეტრები
                    </TabsTrigger>
                </TabsList>

                {/* Basic Tab */}
                <TabsContent value="basic" className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>ძირითადი ინფორმაცია</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>სათაური *</Label>
                                    <Input
                                        value={data.title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        placeholder="მაგ: Pinup Illustration Hotties"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Slug</Label>
                                    <Input
                                        value={data.slug}
                                        onChange={(e) => setData(prev => ({ ...prev, slug: e.target.value }))}
                                        placeholder="auto-generated-from-title"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>მოკლე აღწერა</Label>
                                    <Textarea
                                        value={data.excerpt}
                                        onChange={(e) => setData(prev => ({ ...prev, excerpt: e.target.value }))}
                                        placeholder="მოკლე აღწერა კარტებისთვის"
                                        rows={2}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>სრული აღწერა *</Label>
                                    <Textarea
                                        value={data.description}
                                        onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="დეტალური აღწერა..."
                                        rows={5}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>ფასი და კატეგორია</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>ფასი (0 = უფასო)</Label>
                                        <div className="relative">
                                            <TbCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                type="number"
                                                value={data.price}
                                                onChange={(e) => setData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                                className="pl-10"
                                                min={0}
                                                step={0.01}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ვალუტა</Label>
                                        <Select
                                            value={data.currency}
                                            onValueChange={(v) => setData(prev => ({ ...prev, currency: v as 'GEL' | 'USD' }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="GEL">GEL (ლარი)</SelectItem>
                                                <SelectItem value="USD">USD ($)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>ძველი ფასი (ფასდაკლებისთვის)</Label>
                                    <Input
                                        type="number"
                                        value={data.originalPrice || ''}
                                        onChange={(e) => setData(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || undefined }))}
                                        min={0}
                                        step={0.01}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>კატეგორია *</Label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(v) => setData(prev => ({ ...prev, category: v }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map(cat => (
                                                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>თეგები</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            placeholder="თეგი..."
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                        />
                                        <Button variant="outline" onClick={addTag}>
                                            <TbPlus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {data.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="gap-1">
                                                {tag}
                                                <button onClick={() => removeTag(tag)}>
                                                    <TbX className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Prompt Tab */}
                <TabsContent value="prompt" className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>პრომპტის შაბლონი</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>პრომპტი *</Label>
                                    <p className="text-xs text-muted-foreground">
                                        გამოიყენეთ [VARIABLE_NAME] სინტაქსი ცვლადებისთვის
                                    </p>
                                    <Textarea
                                        value={data.promptTemplate}
                                        onChange={(e) => setData(prev => ({ ...prev, promptTemplate: e.target.value }))}
                                        placeholder="Highly realistic portrait photo of an adult [GENDER] pin-up model wearing a stylish [CLOTHING]. The scene takes place in [ENVIRONMENT]..."
                                        rows={10}
                                        className="font-mono text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>ინსტრუქციები</Label>
                                    <Textarea
                                        value={data.instructions}
                                        onChange={(e) => setData(prev => ({ ...prev, instructions: e.target.value }))}
                                        placeholder="როგორ გამოიყენოთ ეს პრომპტი..."
                                        rows={5}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>ცვლადები</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={newVariableName}
                                        onChange={(e) => setNewVariableName(e.target.value)}
                                        placeholder="ცვლადის სახელი"
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addVariable())}
                                    />
                                    <Button onClick={addVariable}>
                                        <TbPlus className="w-4 h-4 mr-1" />
                                        დამატება
                                    </Button>
                                </div>

                                {data.variables.map((variable, index) => (
                                    <Card key={index} className="bg-muted/50">
                                        <CardContent className="p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Badge className="font-mono">[{variable.name}]</Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeVariable(index)}
                                                >
                                                    <TbTrash className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                            <Input
                                                value={variable.description || ''}
                                                onChange={(e) => updateVariable(index, 'description', e.target.value)}
                                                placeholder="აღწერა..."
                                            />
                                            <div className="flex gap-2">
                                                <Input
                                                    value={newVariableOption}
                                                    onChange={(e) => setNewVariableOption(e.target.value)}
                                                    placeholder="ვარიანტი"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault()
                                                            addVariableOption(index)
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addVariableOption(index)}
                                                >
                                                    <TbPlus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {variable.options?.map((opt, i) => (
                                                    <Badge key={i} variant="outline" className="text-xs">
                                                        {opt}
                                                        <button
                                                            onClick={() => updateVariable(index, 'options',
                                                                variable.options?.filter((_, j) => j !== i)
                                                            )}
                                                        >
                                                            <TbX className="w-3 h-3 ml-1" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Gallery Tab */}
                <TabsContent value="gallery" className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>გარეკანის სურათი</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.coverImage ? (
                                    <div className="relative aspect-video rounded-lg overflow-hidden">
                                        <Image
                                            src={data.coverImage}
                                            alt="Cover"
                                            fill
                                            className="object-cover"
                                        />
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="absolute top-2 right-2"
                                            onClick={() => setData(prev => ({ ...prev, coverImage: '' }))}
                                        >
                                            <TbTrash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg hover:border-primary cursor-pointer transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) handleFileUpload(file, 'cover')
                                            }}
                                        />
                                        {isUploading ? (
                                            <TbLoader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                                        ) : (
                                            <>
                                                <TbUpload className="w-8 h-8 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground mt-2">ატვირთეთ სურათი</span>
                                            </>
                                        )}
                                    </label>
                                )}

                                <div className="space-y-2">
                                    <Label>ან URL</Label>
                                    <Input
                                        value={data.coverImage}
                                        onChange={(e) => setData(prev => ({ ...prev, coverImage: e.target.value }))}
                                        placeholder="https://..."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>მაგალითების გალერეა</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg hover:border-primary cursor-pointer transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        multiple
                                        onChange={(e) => {
                                            const files = e.target.files
                                            if (files) {
                                                Array.from(files).forEach(file => handleFileUpload(file, 'example'))
                                            }
                                        }}
                                    />
                                    <TbPhotoPlus className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">დაამატეთ მაგალითები</span>
                                </label>

                                <div className="grid grid-cols-2 gap-4">
                                    {data.exampleImages.map((img, index) => (
                                        <Card key={index} className="overflow-hidden">
                                            <div className="relative aspect-square">
                                                <Image
                                                    src={img.src}
                                                    alt={img.alt || `Example ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => removeExampleImage(index)}
                                                >
                                                    <TbTrash className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <CardContent className="p-3 space-y-2">
                                                <Input
                                                    value={img.alt || ''}
                                                    onChange={(e) => updateExampleImage(index, 'alt', e.target.value)}
                                                    placeholder="Alt ტექსტი"
                                                    className="text-xs"
                                                />
                                                <Textarea
                                                    value={img.promptUsed || ''}
                                                    onChange={(e) => updateExampleImage(index, 'promptUsed', e.target.value)}
                                                    placeholder="გამოყენებული პრომპტი..."
                                                    rows={2}
                                                    className="text-xs"
                                                />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>AI მოდელი</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>AI მოდელი *</Label>
                                    <Select
                                        value={data.aiModel}
                                        onValueChange={(v) => setData(prev => ({ ...prev, aiModel: v }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {AI_MODELS.map(model => (
                                                <SelectItem key={model} value={model}>{model}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>მოდელის ვერსია</Label>
                                    <Input
                                        value={data.aiModelVersion || ''}
                                        onChange={(e) => setData(prev => ({ ...prev, aiModelVersion: e.target.value }))}
                                        placeholder="მაგ: Nano, Flash, Pro..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>გენერაციის ტიპი</Label>
                                    <Select
                                        value={data.generationType}
                                        onValueChange={(v) => setData(prev => ({ ...prev, generationType: v as MarketplacePromptData['generationType'] }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {GENERATION_TYPES.map(type => (
                                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>SEO</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Meta Title</Label>
                                    <Input
                                        value={data.metaTitle || ''}
                                        onChange={(e) => setData(prev => ({ ...prev, metaTitle: e.target.value }))}
                                        placeholder="SEO სათაური"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Meta Description</Label>
                                    <Textarea
                                        value={data.metaDescription || ''}
                                        onChange={(e) => setData(prev => ({ ...prev, metaDescription: e.target.value }))}
                                        placeholder="SEO აღწერა"
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Featured Order</Label>
                                    <Input
                                        type="number"
                                        value={data.featuredOrder || ''}
                                        onChange={(e) => setData(prev => ({ ...prev, featuredOrder: parseInt(e.target.value) || undefined }))}
                                        placeholder="რიგითი ნომერი (თუ featured)"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TbArrowLeft, TbDeviceFloppy, TbFolderOpen } from "react-icons/tb"

interface Section {
    _id: string
    slug: string
    title: string
}

export default function NewCategoryPage() {
    const router = useRouter()
    const [isSaving, setIsSaving] = React.useState(false)
    const [sections, setSections] = React.useState<Section[]>([])

    const [title, setTitle] = React.useState("")
    const [slug, setSlug] = React.useState("")
    const [icon, setIcon] = React.useState("📁")
    const [sectionId, setSectionId] = React.useState("")

    React.useEffect(() => {
        async function fetchSections() {
            try {
                const res = await fetch('/api/encyclopedia/sections')
                if (res.ok) {
                    const data = await res.json()
                    setSections(data.sections || [])
                }
            } catch (error) {
                console.error('Error:', error)
            }
        }
        fetchSections()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !sectionId) {
            alert('შეავსე სათაური და სექცია')
            return
        }

        setIsSaving(true)
        try {
            const res = await fetch('/api/encyclopedia/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    icon,
                    sectionId,
                }),
            })

            if (res.ok) {
                router.push('/admin/encyclopedia')
            } else {
                const error = await res.json()
                alert(error.error || 'შეცდომა')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('შეცდომა')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" onClick={() => router.back()}>
                    <TbArrowLeft className="w-5 h-5 mr-2" />
                    უკან
                </Button>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <TbFolderOpen className="w-6 h-6" />
                    ახალი კატეგორია
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="text-sm font-medium mb-2 block">სექცია *</label>
                    <Select value={sectionId} onValueChange={setSectionId}>
                        <SelectTrigger>
                            <SelectValue placeholder="აირჩიე სექცია" />
                        </SelectTrigger>
                        <SelectContent>
                            {sections.map((section) => (
                                <SelectItem key={section._id} value={section._id}>
                                    {section.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">სათაური *</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Basics"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">Slug</label>
                        <Input
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="basics"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium mb-2 block">ხატულა (emoji/icon)</label>
                    <Input
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        placeholder="📁"
                        className="w-24"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" type="button" onClick={() => router.back()}>
                        გაუქმება
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                        <TbDeviceFloppy className="w-4 h-4 mr-2" />
                        {isSaving ? 'ინახება...' : 'შენახვა'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

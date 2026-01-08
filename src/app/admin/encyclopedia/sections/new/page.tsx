"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TbArrowLeft, TbDeviceFloppy, TbBook } from "react-icons/tb"

interface Section {
    _id: string
    slug: string
    title: string
}

export default function NewSectionPage() {
    const router = useRouter()
    const [isSaving, setIsSaving] = React.useState(false)

    const [title, setTitle] = React.useState("")
    const [slug, setSlug] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [icon, setIcon] = React.useState("📚")
    const [gradientFrom, setGradientFrom] = React.useState("#8B5CF6")
    const [gradientTo, setGradientTo] = React.useState("#6366F1")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title) {
            alert('შეავსე სათაური')
            return
        }

        setIsSaving(true)
        try {
            const res = await fetch('/api/encyclopedia/sections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    description,
                    icon,
                    gradientFrom,
                    gradientTo,
                    isPublished: true,
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
                    <TbBook className="w-6 h-6" />
                    ახალი სექცია
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">სათაური *</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Prompt Engineering"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">Slug</label>
                        <Input
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="prompt-engineering"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium mb-2 block">აღწერა</label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="სექციის აღწერა..."
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">ხატულა</label>
                        <Input
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            placeholder="📚"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">გრადიენტი From</label>
                        <Input
                            type="color"
                            value={gradientFrom}
                            onChange={(e) => setGradientFrom(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">გრადიენტი To</label>
                        <Input
                            type="color"
                            value={gradientTo}
                            onChange={(e) => setGradientTo(e.target.value)}
                        />
                    </div>
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

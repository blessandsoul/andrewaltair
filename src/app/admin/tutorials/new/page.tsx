"use client"

import { TutorialEditor } from "@/components/admin/TutorialEditor"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function NewTutorialPage() {
    const router = useRouter()

    const handleSave = async (data: any) => {
        try {
            const res = await fetch('/api/tutorials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (!res.ok) throw new Error('Failed to create')

            toast.success('Tutorial created successfully')
            router.push('/admin/tutorials')
        } catch (error) {
            toast.error('Failed to create tutorial')
            console.error(error)
        }
    }

    return (
        <TutorialEditor
            onSave={handleSave}
            onCancel={() => router.back()}
        />
    )
}

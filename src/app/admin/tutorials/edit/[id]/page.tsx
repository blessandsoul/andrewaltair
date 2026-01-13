"use client"

import { TutorialEditor } from "@/components/admin/TutorialEditor"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function EditTutorialPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/tutorials/${params.id}`)
            .then(res => {
                if (!res.ok) throw new Error("Not found")
                return res.json()
            })
            .then(setData)
            .catch(err => {
                toast.error("Failed to load tutorial")
                router.push('/admin/tutorials')
            })
            .finally(() => setLoading(false))
    }, [params.id])

    const handleSave = async (newData: any) => {
        try {
            const res = await fetch(`/api/tutorials/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData)
            })

            if (!res.ok) throw new Error('Failed to update')

            toast.success('Tutorial updated successfully')
            router.push('/admin/tutorials')
        } catch (error) {
            toast.error('Failed to update tutorial')
            console.error(error)
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <TutorialEditor
            initialData={data}
            onSave={handleSave}
            onCancel={() => router.back()}
            isEditing
        />
    )
}

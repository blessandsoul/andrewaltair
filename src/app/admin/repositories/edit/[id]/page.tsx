"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { RepositoryEditor } from "@/components/admin/RepositoryEditor"
import { PostData } from "@/components/admin/PostEditor"
import { toast } from "sonner"

export default function EditRepositoryPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [repository, setRepository] = React.useState<PostData | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchRepo = async () => {
            try {
                const response = await fetch(`/api/posts/${params.id}`)
                if (!response.ok) throw new Error('Failed to load')
                const data = await response.json()
                setRepository(data)
            } catch (error) {
                toast.error("Error loading repository")
                router.push('/admin/repositories')
            } finally {
                setIsLoading(false)
            }
        }
        fetchRepo()
    }, [params.id, router])

    const handleSave = async (data: PostData) => {
        try {
            const response = await fetch(`/api/posts/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (!response.ok) throw new Error('Failed to update')

            toast.success("Repository updated")
            router.push('/admin/repositories')
        } catch (error) {
            console.error(error)
            toast.error("Failed to update repository")
        }
    }

    if (isLoading) return <div className="p-8 text-center">Loading editor...</div>

    return (
        <RepositoryEditor
            isEditing
            initialData={repository || undefined}
            onSave={handleSave}
            onCancel={() => router.back()}
        />
    )
}

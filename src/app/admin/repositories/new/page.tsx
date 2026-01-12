"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { RepositoryEditor } from "@/components/admin/RepositoryEditor"
import { PostData } from "@/components/admin/PostEditor"
import { toast } from "sonner"

export default function NewRepositoryPage() {
    const router = useRouter()

    const handleSave = async (data: PostData) => {
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (!response.ok) throw new Error('Failed to create repository')

            const result = await response.json()
            toast.success("Repository created successfully")
            router.push('/admin/repositories')
        } catch (error) {
            console.error(error)
            toast.error("Failed to save repository")
        }
    }

    return (
        <RepositoryEditor
            onSave={handleSave}
            onCancel={() => router.back()}
        />
    )
}

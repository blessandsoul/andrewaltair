"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PostEditor, PostData } from "@/components/admin/PostEditor"

export default function NewPostPage() {
    const router = useRouter()

    const handleSave = async (post: PostData) => {
        try {
            // Create post via MongoDB API
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: post.title,
                    slug: post.slug || post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, ''),
                    excerpt: post.excerpt,
                    content: post.content,
                    coverImage: post.coverImage,
                    category: post.category,
                    tags: post.tags,
                    author: { name: 'Andrew Altair', avatar: '/avatar.jpg' },
                    status: post.status || 'published',
                    featured: post.featured || false,
                    trending: post.trending || false,
                    readingTime: Math.ceil((post.content?.split(' ').length || 0) / 200),
                })
            })

            if (res.ok) {
                alert("პოსტი წარმატებით შეინახა!")
                router.push("/admin/posts")
            } else {
                const error = await res.json()
                alert(`შეცდომა: ${error.error || 'პოსტის შენახვა ვერ მოხერხდა'}`)
            }
        } catch (error) {
            console.error('Save post error:', error)
            alert("შეცდომა პოსტის შენახვისას")
        }
    }

    const handleCancel = () => {
        router.push("/admin/posts")
    }

    return (
        <PostEditor
            onSave={handleSave}
            onCancel={handleCancel}
        />
    )
}

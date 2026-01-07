"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PostEditor, PostData } from "@/components/admin/PostEditor"

export default function NewPostPage() {
    const router = useRouter()

    const handleSave = async (post: PostData) => {
        try {
            // Get admin token for authentication
            const token = localStorage.getItem('admin_token')
            if (!token) {
                alert('სესია ამოიწურა. გთხოვთ შეხვიდეთ თავიდან.')
                router.push('/admin')
                return
            }

            // Create post via MongoDB API
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: post.title,
                    slug: post.slug || post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, ''),
                    excerpt: post.excerpt,
                    content: post.content,
                    rawContent: post.rawContent,
                    coverImage: post.coverImages?.horizontal || post.coverImage,
                    coverImages: post.coverImages,
                    gallery: post.gallery,
                    sections: post.sections,
                    category: post.category,
                    tags: post.tags,
                    author: { name: 'Andrew Altair', avatar: '/avatar.jpg', role: 'AI ინოვატორი' },
                    status: post.status || 'published',
                    scheduledFor: post.scheduledFor,
                    featured: post.featured || false,
                    trending: post.trending || false,
                    readingTime: post.readingTime || Math.ceil((post.rawContent?.split(' ').length || 0) / 200),
                    videos: post.videos || [],
                    relatedPosts: post.relatedPosts || [],
                    seo: post.seo
                })
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'პოსტის შენახვა ვერ მოხერხდა')
            }

            // Success handled by PostEditor modal
        } catch (error: any) {
            console.error('Save post error:', error)
            alert(error.message || "შეცდომა პოსტის შენახვისას")
            throw error // Re-throw to prevent success modal
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


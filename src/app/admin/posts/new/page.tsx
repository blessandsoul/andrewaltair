"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PostEditor, PostData } from "@/components/admin/PostEditor"

export default function NewPostPage() {
    const router = useRouter()

    const handleSave = (post: PostData) => {
        // In a real app, this would save to a database
        // For now, we'll save to localStorage
        const existingPosts = JSON.parse(localStorage.getItem("blog_posts") || "[]")
        const newPost = {
            ...post,
            id: Date.now().toString(),
            publishedAt: new Date().toISOString().split("T")[0]
        }
        localStorage.setItem("blog_posts", JSON.stringify([newPost, ...existingPosts]))

        // Show success message
        alert("პოსტი წარმატებით შეინახა!")

        // Redirect back to posts list
        router.push("/admin/posts")
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

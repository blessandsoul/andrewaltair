"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PostEditor, PostData } from "@/components/admin/PostEditor"
import { TbLoader2 } from "react-icons/tb"

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [post, setPost] = React.useState<PostData | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const { id } = React.use(params)

    React.useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/posts/${id}`)
                if (res.ok) {
                    const data = await res.json()
                    const p = data.post
                    setPost({
                        id: p.id,
                        slug: p.slug,
                        title: p.title,
                        type: p.type || 'news',
                        excerpt: p.excerpt,
                        content: p.content,
                        rawContent: p.rawContent,
                        category: p.category,
                        tags: p.tags || [],
                        coverImage: p.coverImage,
                        coverImages: p.coverImages || {},
                        gallery: p.gallery || [],
                        sections: p.sections || [],
                        author: p.author,
                        publishedAt: p.publishedAt,
                        readingTime: p.readingTime,
                        views: p.views,
                        reactions: p.reactions || { fire: 0, love: 0, mindblown: 0, applause: 0, insightful: 0 },
                        featured: p.featured || false,
                        trending: p.trending || false,
                        status: p.status || 'published',
                        scheduledFor: p.scheduledFor,
                        videos: p.videos || [],
                        relatedPosts: p.relatedPosts || [],
                        seo: p.seo || {
                            metaTitle: "",
                            metaDescription: "",
                            keywords: "",
                            canonicalUrl: "",
                            focusKeyword: "",
                            seoScore: 0,
                            ogImage: ""
                        }
                    })
                } else {
                    alert("პოსტი ვერ მოიძებნა")
                    router.push("/admin/posts")
                }
            } catch (error) {
                console.error("Error fetching post:", error)
                alert("შეცდომა პოსტის წამოღებისას")
            } finally {
                setIsLoading(false)
            }
        }

        if (id) {
            fetchPost()
        }
    }, [id, router])

    const handleSave = async (updatedPost: PostData) => {
        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...updatedPost,
                    slug: updatedPost.slug || updatedPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, ''),
                    readingTime: updatedPost.readingTime || Math.ceil((updatedPost.rawContent?.split(' ').length || 0) / 200),
                })
            })

            if (res.ok) {
                alert("პოსტი წარმატებით განახლდა!")
                router.push("/admin/posts")
            } else {
                const error = await res.json()
                alert(`შეცდომა: ${error.error || 'პოსტის განახლება ვერ მოხერხდა'}`)
            }
        } catch (error) {
            console.error('Update post error:', error)
            alert("შეცდომა პოსტის განახლებისას")
        }
    }

    const handleCancel = () => {
        router.push("/admin/posts")
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <TbLoader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!post) return null

    return (
        <PostEditor
            initialData={post}
            onSave={handleSave}
            onCancel={handleCancel}
        />
    )
}

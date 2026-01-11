"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PostEditor, PostData } from "@/components/admin/PostEditor"
import { TbLoader2 } from "react-icons/tb"

export default function EditPostPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [post, setPost] = React.useState<PostData | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const { id } = params

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
                        categories: p.categories && p.categories.length > 0 ? p.categories : (p.category ? [p.category] : ['ai', 'articles']),
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
                        telegramContent: p.telegramContent || '',
                        seo: p.seo || {
                            metaTitle: "",
                            metaDescription: "",
                            keywords: "",
                            canonicalUrl: "",
                            focusKeyword: "",
                            seoScore: 0,

                            ogImage: ""
                        },
                        repository: p.repository
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
                    title: updatedPost.title,
                    slug: updatedPost.slug || updatedPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, ''),
                    excerpt: updatedPost.excerpt,
                    content: updatedPost.content,
                    rawContent: updatedPost.rawContent,
                    categories: updatedPost.categories,
                    tags: updatedPost.tags,
                    coverImage: updatedPost.coverImage,
                    coverImages: updatedPost.coverImages,
                    gallery: updatedPost.gallery,
                    sections: updatedPost.sections,
                    author: updatedPost.author,
                    status: updatedPost.status,
                    scheduledFor: updatedPost.scheduledFor,
                    settings: { featured: updatedPost.featured, trending: updatedPost.trending },
                    featured: updatedPost.featured,
                    trending: updatedPost.trending,
                    readingTime: updatedPost.readingTime || Math.ceil((updatedPost.rawContent?.split(' ').length || 0) / 200),
                    videos: updatedPost.videos || [],
                    relatedPosts: updatedPost.relatedPosts || [],
                    seo: updatedPost.seo,
                    telegramContent: updatedPost.telegramContent,
                    repository: updatedPost.repository
                })
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'პოსტის განახლება ვერ მოხერხდა')
            }

            // Success handled by PostEditor modal
        } catch (error: any) {
            console.error('Update post error:', error)
            alert(error.message || "შეცდომა პოსტის განახლებისას")
            throw error // Re-throw to prevent success modal
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

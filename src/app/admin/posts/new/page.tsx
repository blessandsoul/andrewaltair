"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PostEditor, PostData } from "@/components/admin/PostEditor"
import { TbCheck, TbExternalLink } from "react-icons/tb"

export default function NewPostPage() {
    const router = useRouter()
    const [successData, setSuccessData] = React.useState<{ slug: string; title: string } | null>(null)

    const handleSave = async (post: PostData) => {
        try {
            // Get admin token for authentication
            const token = localStorage.getItem('admin_token')
            if (!token) {
                alert('სესია ამოიწურა. გთხოვთ შეხვიდეთ თავიდან.')
                router.push('/admin')
                return
            }

            // Log payload for debugging
            const payload = {
                title: post.title,
                slug: post.slug || post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, ''),
                excerpt: post.excerpt,
                content: post.content,
                rawContent: post.rawContent,
                coverImage: post.coverImages?.horizontal || post.coverImage,
                coverImages: post.coverImages,
                gallery: post.gallery,
                sections: post.sections,
                categories: post.categories,
                tags: post.tags,
                author: post.author || { name: 'Andrew Altair', avatar: '/images/avatar.jpg', role: 'AI ინოვატორი' },
                status: post.status || 'published',
                scheduledFor: post.scheduledFor,
                featured: post.featured || false,
                trending: post.trending || false,
                readingTime: post.readingTime || Math.ceil((post.rawContent?.split(' ').length || 0) / 200),
                videos: post.videos || [],
                relatedPosts: post.relatedPosts || [],
                seo: post.seo,
                telegramContent: post.telegramContent || '',
                repository: post.repository,
                keyPoints: post.keyPoints,
                faq: post.faq,
                entities: post.entities
            };

            // Create post via MongoDB API
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (!res.ok) {
                const error = await res.json()
                console.error('API Error Response:', error);
                throw new Error(error.details || error.error || 'პოსტის შენახვა ვერ მოხერხდა')
            }

            const savedPost = await res.json()

            // 🎉 Show Success Modal
            setSuccessData({
                slug: savedPost.post?.slug || post.slug,
                title: post.title
            })

            // Check for Telegram results from the main API response
            if (savedPost.telegram) {
                if (savedPost.telegram.success) {
                    console.log('Posted to Telegram successfully:', savedPost.telegram.messageId)
                } else {
                    console.warn('Telegram post warning:', savedPost.telegram.error)
                    // Optional: You could show a toast here "Post saved, but Telegram failed"
                }
            }

        } catch (error: any) {
            console.error('Save post error:', error)
            alert(`შეცდომა: ${error.message}`)
            throw error
        }
    }

    const handleCancel = () => {
        router.push("/admin/posts")
    }

    return (
        <>
            <PostEditor
                onSave={handleSave}
                onCancel={handleCancel}
            />

            {/* Success Modal */}
            {successData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-background border rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
                        {/* Success Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center animate-pulse">
                                    <TbCheck className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-center mb-2">
                            პოსტი გამოქვეყნდა! 🎉
                        </h2>

                        {/* Post Title */}
                        <p className="text-muted-foreground text-center mb-6 line-clamp-2">
                            {successData.title}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <a
                                href={`/blog/${successData.slug}`}
                                target="_blank"
                                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                            >
                                <TbExternalLink className="w-5 h-5" />
                                პოსტის ნახვა
                            </a>
                            <button
                                onClick={() => router.push('/admin/posts')}
                                className="w-full py-3 px-4 bg-muted rounded-lg font-medium hover:bg-muted/80 transition-colors"
                            >
                                პოსტების სიაში დაბრუნება
                            </button>
                            <button
                                onClick={() => setSuccessData(null)}
                                className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                კიდევ ერთი პოსტის დამატება
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

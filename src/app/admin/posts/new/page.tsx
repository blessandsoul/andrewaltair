"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PostEditor, PostData } from "@/components/admin/PostEditor"

export default function NewPostPage() {
    const router = useRouter()

    const handleSave = async (post: PostData) => {
        console.log('🔥 handleSave called! Post:', post)
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
                repository: post.repository
            };
            console.log('Sending Post Payload:', payload);

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

            // 🎉 SUCCESS FEEDBACK
            alert(`✅ პოსტი წარმატებით შეინახა! Slug: ${savedPost.post?.slug || post.slug}`)

            // Post to Telegram if enabled
            if (post.postToTelegram && post.telegramContent) {
                try {
                    const telegramRes = await fetch('/api/telegram/post', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: post.title,
                            telegramContent: post.telegramContent,
                            postUrl: `https://andrewaltair.ge/blog/${savedPost.post?.slug || post.slug}`,
                            coverImage: post.coverImages?.horizontal || post.coverImage,
                            coverImages: post.coverImages
                        })
                    })
                    const telegramResult = await telegramRes.json()
                    if (telegramResult.success) {
                        console.log('Posted to Telegram successfully:', telegramResult.messageId)
                    } else {
                        console.warn('Telegram post failed:', telegramResult.error)
                    }
                } catch (telegramError) {
                    console.warn('Telegram post error:', telegramError)
                    // Don't throw - post was saved successfully, Telegram is optional
                }
            }

            // 🔄 REDIRECT to posts list
            router.push('/admin/posts')
        } catch (error: any) {
            console.error('Save post error:', error)
            alert(`შეცდომა: ${error.message}`)
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


"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast"
import { TbMessage, TbHeart, TbArrowBackUp, TbSend, TbClock } from "react-icons/tb"
import { cn } from "@/lib/utils"
import { useVisitorTracking } from "@/hooks/useVisitorTracking"
import { useAuth } from "@/lib/auth"

// 🎭 სასაცილო ავატარები კომენტატორებისთვის
const funnyAvatars = [
    "🤡", "👽", "🤖", "👹", "👺", "💀", "👻", "🎃", "🤠", "🥸",
    "🧐", "🤓", "😎", "🥳", "🤪", "😜", "🤑", "🤯", "🥴", "😵‍💫",
    "🐸", "🦊", "🐵", "🐷", "🐻", "🐼", "🐨", "🦁", "🐯", "🦄",
    "🐲", "🦖", "🦕", "🐙", "🦑", "🦞", "🦀", "🐡", "🐠", "🦈",
    "🌚", "🌝", "🌞", "🔮", "🎩", "👑", "🎪", "🎭", "🃏", "🧙‍♂️",
    "🧛", "🧟", "🧞", "🧜‍♂️", "🧝", "🦸", "🦹", "🥷", "🎅", "🤴",
    "👨‍🎤", "👩‍🚀", "👨‍🔬", "👩‍🎨", "🕵️", "👷", "💂", "🤵", "👸", "🧑‍🎄"
]

// იღებს სტრიქონის ჰეშს და აბრუნებს შესაბამის ავატარს
function getAvatarForName(name: string): string {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
        const char = name.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32bit integer
    }
    const index = Math.abs(hash) % funnyAvatars.length
    return funnyAvatars[index]
}

// რანდომული ავატარის არჩევა ახალი კომენტარებისთვის
function getRandomAvatar(): string {
    return funnyAvatars[Math.floor(Math.random() * funnyAvatars.length)]
}

interface Comment {
    id: string
    author: {
        name: string
        avatar?: string
    } | string
    content: string
    createdAt: string
    likes: number
    replies?: Comment[]
}

interface CommentsProps {
    postId: string
    postTitle?: string
    className?: string
}

function timeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return "ახლახანს"
    if (seconds < 3600) return `${Math.floor(seconds / 60)} წთ წინ`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} სთ წინ`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} დღე წინ`
    return date.toLocaleDateString("ka")
}

function CommentItem({
    comment,
    isReply = false,
    onLike
}: {
    comment: Comment
    isReply?: boolean
    onLike?: (commentId: string) => void
}) {
    const [liked, setLiked] = React.useState(false)
    const [likeCount, setLikeCount] = React.useState(comment.likes)
    const [showReplyForm, setShowReplyForm] = React.useState(false)

    const handleLike = () => {
        if (liked) {
            setLikeCount(c => c - 1)
        } else {
            setLikeCount(c => c + 1)
            onLike?.(comment.id)
        }
        setLiked(!liked)
    }

    // Get author name and avatar
    const authorName = typeof comment.author === 'string' ? comment.author : comment.author.name
    const authorAvatar = typeof comment.author === 'string' ? undefined : comment.author.avatar

    return (
        <div className={cn("group", isReply && "ml-12 mt-4")}>
            <div className="flex gap-3">
                <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-2xl",
                    authorName === "Andrew Altair"
                        ? "bg-gradient-to-br from-primary to-accent"
                        : "bg-secondary/50 backdrop-blur-sm"
                )}>
                    {authorName === "Andrew Altair"
                        ? "⭐"
                        : (authorAvatar || getAvatarForName(authorName))}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{authorName}</span>
                        {authorName === "Andrew Altair" && (
                            <Badge variant="secondary" className="text-xs">ავტორი</Badge>
                        )}
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <TbClock className="w-3 h-3" />
                            {timeAgo(comment.createdAt)}
                        </span>
                    </div>

                    <p className="mt-1 text-muted-foreground">{comment.content}</p>

                    <div className="flex items-center gap-4 mt-2">
                        <button
                            onClick={handleLike}
                            className={cn(
                                "flex items-center gap-1 text-sm transition-colors",
                                liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                            )}
                        >
                            <TbHeart className={cn("w-4 h-4", liked && "fill-current")} />
                            {likeCount}
                        </button>
                        {!isReply && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <TbArrowBackUp className="w-4 h-4" />
                                პასუხი
                            </button>
                        )}
                    </div>

                    {showReplyForm && (
                        <div className="mt-4 flex gap-2">
                            <Input placeholder="დაწერე პასუხი..." className="flex-1" />
                            <Button size="sm">
                                <TbSend className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    {comment.replies?.map((reply) => (
                        <CommentItem key={reply.id} comment={reply} isReply onLike={onLike} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export function Comments({ postId, postTitle, className }: CommentsProps) {
    const [comments, setComments] = React.useState<Comment[]>([])
    const [newComment, setNewComment] = React.useState("")
    const [authorName, setAuthorName] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(true)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const toast = useToast()
    const { recordActivity } = useVisitorTracking()
    const { user } = useAuth()

    // Set author name from authenticated user
    React.useEffect(() => {
        if (user) {
            setAuthorName(user.fullName || user.username)
        }
    }, [user])

    // Load comments from API on mount
    React.useEffect(() => {
        async function fetchComments() {
            try {
                const res = await fetch(`/api/comments?postId=${postId}&status=approved`)
                if (res.ok) {
                    const data = await res.json()
                    setComments(data.comments || [])
                }
            } catch (error) {
                // Silently fail
            } finally {
                setIsLoading(false)
            }
        }
        fetchComments()
    }, [postId])

    // Handle comment like - track activity
    const handleCommentLike = React.useCallback((commentId: string) => {
        recordActivity('reaction', {
            targetType: 'post',
            targetId: postId,
            targetTitle: postTitle,
            metadata: { commentId, reactionType: 'like' },
            isPublic: false // Comment likes are not shown in social proof
        })
    }, [recordActivity, postId, postTitle])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim() || !authorName.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId,
                    author: {
                        name: authorName,
                        avatar: user?.avatar || getRandomAvatar()
                    },
                    content: newComment
                })
            })

            if (res.ok) {
                // 🎯 TRACK COMMENT ACTIVITY
                recordActivity('comment', {
                    targetType: 'post',
                    targetId: postId,
                    targetTitle: postTitle,
                    metadata: { authorName },
                    isPublic: true // Comments are shown in social proof
                })

                setNewComment("")
                if (!user) setAuthorName("") // Only reset name for guests
                toast.success(
                    'კომენტარი გაიგზავნა!',
                    'მოდერაციის შემდეგ გამოჩნდება საიტზე'
                )
            } else {
                toast.error(
                    'შეცდომა',
                    'კომენტარის გაგზავნა ვერ მოხერხდა'
                )
            }
        } catch (error) {
            toast.error(
                'შეცდომა',
                'კომენტარის გაგზავნა ვერ მოხერხდა'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className={cn("space-y-6", className)}>
                <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">იტვირთება...</div>
                </div>
            </div>
        )
    }

    return (
        <div className={cn("space-y-6", className)}>
            <div className="flex items-center gap-2">
                <TbMessage className="w-5 h-5" />
                <h3 className="text-xl font-bold">კომენტარები ({comments.length})</h3>
            </div>

            {/* New Comment Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {user ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>კომენტარი როგორც:</span>
                        <Badge variant="secondary">{authorName}</Badge>
                    </div>
                ) : (
                    <Input
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="შენი სახელი..."
                        required
                    />
                )}
                <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="დაწერე კომენტარი..."
                    rows={3}
                    required
                />
                <div className="flex justify-end">
                    <Button type="submit" size="sm" className="gap-2" disabled={isSubmitting}>
                        <TbSend className="w-4 h-4" />
                        {isSubmitting ? 'იგზავნება...' : 'გაგზავნა'}
                    </Button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        onLike={handleCommentLike}
                    />
                ))}
            </div>
        </div>
    )
}

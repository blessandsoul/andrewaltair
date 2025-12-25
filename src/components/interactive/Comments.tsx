"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    MessageCircle,
    Heart,
    Reply,
    Send,
    Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

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
    author: string
    avatar?: string
    content: string
    createdAt: string
    likes: number
    replies?: Comment[]
}

interface CommentsProps {
    postId: string
    className?: string
}

// Sample comments for demo
const sampleComments: Comment[] = [
    {
        id: "1",
        author: "გიორგი",
        avatar: "🦊",
        content: "ძალიან სასარგებლო სტატია! მადლობა გაზიარებისთვის 🙏",
        createdAt: "2024-12-25T10:30:00",
        likes: 12,
        replies: [
            {
                id: "1-1",
                author: "Andrew Altair",
                content: "მადლობა! მოხარული ვარ რომ გამოადგა 😊",
                createdAt: "2024-12-25T11:00:00",
                likes: 5
            }
        ]
    },
    {
        id: "2",
        author: "ნინო",
        avatar: "🤖",
        content: "შეგიძლია DALL-E 3-ის შესახებ მეტი დაწერო? ძალიან მაინტერესებს!",
        createdAt: "2024-12-24T15:20:00",
        likes: 8
    },
    {
        id: "3",
        author: "დავით",
        avatar: "🐵",
        content: "ChatGPT-ს ხშირად ვიყენებ მაგრამ ეს ხრიკები არ ვიცოდი. მადლობა!",
        createdAt: "2024-12-23T09:45:00",
        likes: 15
    },
    {
        id: "4",
        author: "მარიამ",
        avatar: "🦄",
        content: "საუკეთესო ბლოგი AI-ზე ჩვენს ქვეყანაში! 💜",
        createdAt: "2024-12-22T18:15:00",
        likes: 23
    },
    {
        id: "5",
        author: "ლუკა",
        avatar: "🧙‍♂️",
        content: "Claude-ს ვერ გამომივლია ვერ, მაგრამ ახლა ვცდი!",
        createdAt: "2024-12-21T14:30:00",
        likes: 7
    }
]

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

function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
    const [liked, setLiked] = React.useState(false)
    const [likeCount, setLikeCount] = React.useState(comment.likes)
    const [showReplyForm, setShowReplyForm] = React.useState(false)

    const handleLike = () => {
        if (liked) {
            setLikeCount(c => c - 1)
        } else {
            setLikeCount(c => c + 1)
        }
        setLiked(!liked)
    }

    return (
        <div className={cn("group", isReply && "ml-12 mt-4")}>
            <div className="flex gap-3">
                <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-2xl",
                    comment.author === "Andrew Altair"
                        ? "bg-gradient-to-br from-primary to-accent"
                        : "bg-secondary/50 backdrop-blur-sm"
                )}>
                    {comment.author === "Andrew Altair"
                        ? "⭐"
                        : (comment.avatar || getAvatarForName(comment.author))}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{comment.author}</span>
                        {comment.author === "Andrew Altair" && (
                            <Badge variant="secondary" className="text-xs">ავტორი</Badge>
                        )}
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
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
                            <Heart className={cn("w-4 h-4", liked && "fill-current")} />
                            {likeCount}
                        </button>
                        {!isReply && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Reply className="w-4 h-4" />
                                პასუხი
                            </button>
                        )}
                    </div>

                    {showReplyForm && (
                        <div className="mt-4 flex gap-2">
                            <Input placeholder="დაწერე პასუხი..." className="flex-1" />
                            <Button size="sm">
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    {comment.replies?.map((reply) => (
                        <CommentItem key={reply.id} comment={reply} isReply />
                    ))}
                </div>
            </div>
        </div>
    )
}

export function Comments({ postId, className }: CommentsProps) {
    const [newComment, setNewComment] = React.useState("")
    const [comments, setComments] = React.useState(sampleComments)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return

        const comment: Comment = {
            id: Date.now().toString(),
            author: "სტუმარი",
            avatar: getRandomAvatar(),
            content: newComment,
            createdAt: new Date().toISOString(),
            likes: 0
        }

        setComments([comment, ...comments])
        setNewComment("")
    }

    return (
        <div className={cn("space-y-6", className)}>
            <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <h3 className="text-xl font-bold">კომენტარები ({comments.length})</h3>
            </div>

            {/* New Comment Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="დაწერე კომენტარი..."
                    rows={3}
                />
                <div className="flex justify-end">
                    <Button type="submit" disabled={!newComment.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        გაგზავნა
                    </Button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    )
}

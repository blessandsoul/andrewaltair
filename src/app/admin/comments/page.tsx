"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    MessageSquare,
    Search,
    Trash2,
    Heart,
    Clock,
    Reply,
    CheckCircle,
    XCircle,
    Filter
} from "lucide-react"

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

// Sample comments data (in real app, this would come from an API/database)
interface Comment {
    id: string
    postId: string
    postTitle: string
    author: string
    content: string
    createdAt: string
    likes: number
    isApproved: boolean
    parentId?: string
}

const sampleComments: Comment[] = [
    {
        id: "1",
        postId: "1",
        postTitle: "ChatGPT-ს \"ღმერთის რეჟიმი\"",
        author: "გიორგი",
        content: "ძალიან სასარგებლო სტატია! მადლობა გაზიარებისთვის 🙏",
        createdAt: "2024-12-25T10:30:00",
        likes: 12,
        isApproved: true
    },
    {
        id: "2",
        postId: "1",
        postTitle: "ChatGPT-ს \"ღმერთის რეჟიმი\"",
        author: "ნინო",
        content: "შეგიძლია DALL-E 3-ის შესახებ მეტი დაწერო? ძალიან მაინტერესებს!",
        createdAt: "2024-12-24T15:20:00",
        likes: 8,
        isApproved: true
    },
    {
        id: "3",
        postId: "2",
        postTitle: "DALL-E 3-ის 10 საიდუმლო ხრიკი",
        author: "დავით",
        content: "ChatGPT-ს ხშირად ვიყენებ მაგრამ ეს ხრიკები არ ვიცოდი. მადლობა!",
        createdAt: "2024-12-23T09:45:00",
        likes: 15,
        isApproved: true
    },
    {
        id: "4",
        postId: "3",
        postTitle: "Gemini vs ChatGPT 2024",
        author: "სტუმარი123",
        content: "ეს კომენტარი მოდერაციას საჭიროებს",
        createdAt: "2024-12-22T14:00:00",
        likes: 0,
        isApproved: false
    },
    {
        id: "5",
        postId: "1",
        postTitle: "ChatGPT-ს \"ღმერთის რეჟიმი\"",
        author: "თამარ",
        content: "წარმოუდგენელია რამდენად სასარგებლოა! გაზიარებული მაქვს მეგობრებთან.",
        createdAt: "2024-12-21T18:30:00",
        likes: 23,
        isApproved: true
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

export default function CommentsPage() {
    const [comments, setComments] = React.useState<Comment[]>(sampleComments)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState<"all" | "approved" | "pending">("all")
    const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null)

    // Filter comments
    const filteredComments = comments.filter(comment => {
        const matchesSearch =
            comment.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comment.postTitle.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "approved" && comment.isApproved) ||
            (statusFilter === "pending" && !comment.isApproved)

        return matchesSearch && matchesStatus
    })

    // Approve comment
    const handleApprove = (id: string) => {
        setComments(comments.map(c =>
            c.id === id ? { ...c, isApproved: true } : c
        ))
    }

    // Reject (unapprove) comment
    const handleReject = (id: string) => {
        setComments(comments.map(c =>
            c.id === id ? { ...c, isApproved: false } : c
        ))
    }

    // Delete comment
    const handleDelete = (id: string) => {
        setComments(comments.filter(c => c.id !== id))
        setDeleteConfirm(null)
    }

    const pendingCount = comments.filter(c => !c.isApproved).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-primary" />
                        კომენტარების მართვა
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {filteredComments.length} კომენტარი
                        {pendingCount > 0 && (
                            <Badge variant="destructive" className="ml-2">
                                {pendingCount} მოლოდინში
                            </Badge>
                        )}
                    </p>
                </div>

                <div className="flex gap-2">
                    {/* Status Filter */}
                    <div className="flex rounded-lg border overflow-hidden">
                        {([
                            { value: "all", label: "ყველა" },
                            { value: "approved", label: "დამტკიცებული" },
                            { value: "pending", label: "მოლოდინში" }
                        ] as const).map((item) => (
                            <button
                                key={item.value}
                                onClick={() => setStatusFilter(item.value)}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${statusFilter === item.value
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-60">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="ძიება..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {filteredComments.map((comment) => (
                    <Card
                        key={comment.id}
                        className={`transition-all ${!comment.isApproved ? "border-yellow-500/50 bg-yellow-500/5" : ""
                            }`}
                    >
                        <CardContent className="p-4">
                            <div className="flex gap-4">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-secondary/50 backdrop-blur-sm flex items-center justify-center flex-shrink-0 text-2xl">
                                    {getAvatarForName(comment.author)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    {/* Header */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold">{comment.author}</span>
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {timeAgo(comment.createdAt)}
                                        </span>
                                        {!comment.isApproved && (
                                            <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                                                მოლოდინში
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Post Reference */}
                                    <div className="text-sm text-muted-foreground mt-1">
                                        პოსტზე: <span className="text-foreground">{comment.postTitle}</span>
                                    </div>

                                    {/* Comment Content */}
                                    <p className="mt-2">{comment.content}</p>

                                    {/* Stats & Actions */}
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Heart className="w-4 h-4" />
                                                {comment.likes}
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            {!comment.isApproved ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-green-500 hover:text-green-600"
                                                    onClick={() => handleApprove(comment.id)}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                    დამტკიცება
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-yellow-500 hover:text-yellow-600"
                                                    onClick={() => handleReject(comment.id)}
                                                >
                                                    <XCircle className="w-4 h-4 mr-1" />
                                                    უარყოფა
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => setDeleteConfirm(comment.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredComments.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>კომენტარები ვერ მოიძებნა</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-destructive">წაშლის დადასტურება</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>ნამდვილად გსურთ ამ კომენტარის წაშლა?</p>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                                    გაუქმება
                                </Button>
                                <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>
                                    წაშლა
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

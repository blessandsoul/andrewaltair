"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TbMessage, TbSearch, TbTrash, TbHeart, TbClock, TbArrowBackUp, TbCircleCheck, TbCircleX, TbEdit, TbShield, TbMail, TbUser, TbChevronLeft, TbChevronRight, TbArrowsUpDown, TbCalendar, TbSend, TbBan, TbSettings, TbX, TbChevronDown, TbChevronUp } from "react-icons/tb"

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
    email?: string
    content: string
    createdAt: string
    likes: number
    isApproved: boolean
    parentId?: string
    isSpam?: boolean
    isBanned?: boolean
}

const sampleComments: Comment[] = [
    {
        id: "1",
        postId: "1",
        postTitle: "ChatGPT-ს \"ღმერთის რეჟიმი\"",
        author: "გიორგი",
        email: "giorgi@example.com",
        content: "ძალიან სასარგებლო სტატია! მადლობა გაზიარებისთვის 🙏",
        createdAt: "2024-12-28T10:30:00",
        likes: 12,
        isApproved: true
    },
    {
        id: "1-reply-1",
        postId: "1",
        postTitle: "ChatGPT-ს \"ღმერთის რეჟიმი\"",
        author: "Admin",
        content: "მადლობა გიორგი! 🙌",
        createdAt: "2024-12-28T11:00:00",
        likes: 5,
        isApproved: true,
        parentId: "1"
    },
    {
        id: "2",
        postId: "1",
        postTitle: "ChatGPT-ს \"ღმერთის რეჟიმი\"",
        author: "ნინო",
        email: "nino@example.com",
        content: "შეგიძლია DALL-E 3-ის შესახებ მეტი დაწერო? ძალიან მაინტერესებს!",
        createdAt: "2024-12-27T15:20:00",
        likes: 8,
        isApproved: true
    },
    {
        id: "3",
        postId: "2",
        postTitle: "DALL-E 3-ის 10 საიდუმლო ხრიკი",
        author: "დავით",
        email: "davit@example.com",
        content: "ChatGPT-ს ხშირად ვიყენებ მაგრამ ეს ხრიკები არ ვიცოდი. მადლობა!",
        createdAt: "2024-12-20T09:45:00",
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
        email: "tamar@example.com",
        content: "წარმოუდგენელია რამდენად სასარგებლოა! გაზიარებული მაქვს მეგობრებთან.",
        createdAt: "2024-12-15T18:30:00",
        likes: 23,
        isApproved: true
    },
    {
        id: "6",
        postId: "2",
        postTitle: "DALL-E 3-ის 10 საიდუმლო ხრიკი",
        author: "სპამერი",
        content: "იყიდე იაფად casino რეკლამა აქ!",
        createdAt: "2024-12-26T12:00:00",
        likes: 0,
        isApproved: false,
        isSpam: true
    },
    {
        id: "7",
        postId: "1",
        postTitle: "ChatGPT-ს \"ღმერთის რეჟიმი\"",
        author: "ლუკა",
        email: "luka@example.com",
        content: "საუკეთესო ბლოგი AI-ზე საქართველოში! 💜",
        createdAt: "2024-12-28T08:15:00",
        likes: 31,
        isApproved: true
    },
    {
        id: "8",
        postId: "3",
        postTitle: "Gemini vs ChatGPT 2024",
        author: "მარიამ",
        email: "mariam@example.com",
        content: "Gemini უკეთესია ჩემი აზრით",
        createdAt: "2024-12-27T20:00:00",
        likes: 7,
        isApproved: true
    },
    {
        id: "9",
        postId: "2",
        postTitle: "DALL-E 3-ის 10 საიდუმლო ხრიკი",
        author: "ანა",
        email: "ana@example.com",
        content: "მაგარი სტატიაა! 🎨",
        createdAt: "2024-12-26T16:45:00",
        likes: 4,
        isApproved: true
    },
    {
        id: "10",
        postId: "1",
        postTitle: "ChatGPT-ს \"ღმერთის რეჟიმი\"",
        author: "ზურა",
        email: "zura@example.com",
        content: "ძალიან სასარგებლო ინფორმაცია",
        createdAt: "2024-12-25T11:30:00",
        likes: 9,
        isApproved: true
    },
    {
        id: "11",
        postId: "2",
        postTitle: "DALL-E 3-ის 10 საიდუმლო ხრიკი",
        author: "ნიკა",
        email: "nika@example.com",
        content: "როგორ ვისარგებლო უფასოდ?",
        createdAt: "2024-12-24T09:00:00",
        likes: 2,
        isApproved: true
    },
    {
        id: "12",
        postId: "3",
        postTitle: "Gemini vs ChatGPT 2024",
        author: "ელენე",
        email: "elene@example.com",
        content: "ორივე კარგია სხვადასხვა მიზნებისთვის",
        createdAt: "2024-12-23T14:30:00",
        likes: 11,
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

function isWithinDateRange(dateString: string, filter: string): boolean {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    switch (filter) {
        case "today":
            return diffDays < 1
        case "week":
            return diffDays < 7
        case "month":
            return diffDays < 30
        default:
            return true
    }
}

const ITEMS_PER_PAGE = 5

export default function CommentsPage() {
    // Core state
    const [comments, setComments] = React.useState<Comment[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState<"all" | "approved" | "pending" | "spam">("all")

    // Fetch comments from MongoDB API
    React.useEffect(() => {
        async function fetchComments() {
            try {
                const res = await fetch('/api/comments?limit=100')
                if (res.ok) {
                    const data = await res.json()
                    const formattedComments = (data.comments || []).map((c: { id?: string; postId?: string; postTitle?: string; author?: { name?: string; email?: string }; content?: string; createdAt?: string; likes?: number; status?: string; parentId?: string; isSpam?: boolean }) => ({
                        id: c.id,
                        postId: c.postId,
                        postTitle: c.postTitle || 'Unknown Post',
                        author: c.author?.name || 'Anonymous',
                        email: c.author?.email,
                        content: c.content || '',
                        createdAt: c.createdAt,
                        likes: c.likes || 0,
                        isApproved: c.status === 'approved',
                        parentId: c.parentId,
                        isSpam: c.isSpam || c.status === 'spam'
                    }))
                    setComments(formattedComments)
                }
            } catch (error) {
                console.error('Error fetching comments:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchComments()
    }, [])

    // 1. Admin TbArrowBackUp
    const [replyingTo, setReplyingTo] = React.useState<string | null>(null)
    const [replyContent, setReplyContent] = React.useState("")

    // 2. Date Filter
    const [dateFilter, setDateFilter] = React.useState<"all" | "today" | "week" | "month">("all")

    // 3. Bulk Actions
    const [selectedComments, setSelectedComments] = React.useState<Set<string>>(new Set())

    // 4. Comment Editing
    const [editingComment, setEditingComment] = React.useState<string | null>(null)
    const [editContent, setEditContent] = React.useState("")

    // 5. Spam Filter
    const [blacklistedWords, setBlacklistedWords] = React.useState<string[]>(["სპამი", "რეკლამა", "casino", "იყიდე"])
    const [showSpamSettings, setShowSpamSettings] = React.useState(false)
    const [newBlacklistWord, setNewBlacklistWord] = React.useState("")

    // 6. Email Notifications
    const [emailSettings, setEmailSettings] = React.useState({
        notifyOnNew: true,
        notifyAuthorOnReply: true
    })
    const [showEmailSettings, setShowEmailSettings] = React.useState(false)

    // 7. Commenter Profile
    const [viewingAuthor, setViewingAuthor] = React.useState<string | null>(null)
    const [bannedAuthors, setBannedAuthors] = React.useState<Set<string>>(new Set())

    // 8. Pagination
    const [currentPage, setCurrentPage] = React.useState(1)

    // 9. Sorting
    const [sortBy, setSortBy] = React.useState<"date" | "likes" | "author">("date")
    const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc")

    // 10. Thread View
    const [expandedThreads, setExpandedThreads] = React.useState<Set<string>>(new Set())

    // Delete confirmation
    const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null)

    // Check for spam
    const isSpamContent = (content: string): boolean => {
        const lowerContent = content.toLowerCase()
        return blacklistedWords.some(word => lowerContent.includes(word.toLowerCase()))
    }

    // Get parent comments only (not replies)
    const parentComments = comments.filter(c => !c.parentId)

    // Filter comments
    const filteredComments = parentComments.filter(comment => {
        const matchesSearch =
            comment.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comment.postTitle.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "approved" && comment.isApproved && !comment.isSpam) ||
            (statusFilter === "pending" && !comment.isApproved && !comment.isSpam) ||
            (statusFilter === "spam" && (comment.isSpam || isSpamContent(comment.content)))

        const matchesDate = isWithinDateRange(comment.createdAt, dateFilter)

        const notBanned = !bannedAuthors.has(comment.author)

        return matchesSearch && matchesStatus && matchesDate && notBanned
    })

    // Sort comments
    const sortedComments = [...filteredComments].sort((a, b) => {
        let comparison = 0
        switch (sortBy) {
            case "date":
                comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                break
            case "likes":
                comparison = a.likes - b.likes
                break
            case "author":
                comparison = a.author.localeCompare(b.author)
                break
        }
        return sortOrder === "asc" ? comparison : -comparison
    })

    // Paginate
    const totalPages = Math.ceil(sortedComments.length / ITEMS_PER_PAGE)
    const paginatedComments = sortedComments.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    // Get replies for a comment
    const getReplies = (commentId: string) => {
        return comments.filter(c => c.parentId === commentId)
    }

    // Handlers with API
    const handleApprove = async (id: string) => {
        try {
            const res = await fetch(`/api/comments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'approved', isSpam: false })
            })
            if (res.ok) {
                setComments(comments.map(c =>
                    c.id === id ? { ...c, isApproved: true, isSpam: false } : c
                ))
            }
        } catch (error) {
            console.error('Approve error:', error)
        }
    }

    const handleReject = async (id: string) => {
        try {
            const res = await fetch(`/api/comments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'rejected' })
            })
            if (res.ok) {
                setComments(comments.map(c =>
                    c.id === id ? { ...c, isApproved: false } : c
                ))
            }
        } catch (error) {
            console.error('Reject error:', error)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setComments(comments.filter(c => c.id !== id && c.parentId !== id))
                setDeleteConfirm(null)
                setSelectedComments(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(id)
                    return newSet
                })
            }
        } catch (error) {
            console.error('Delete error:', error)
        }
    }

    // 1. Admin TbArrowBackUp Handler with API
    const handleSendReply = async (parentId: string) => {
        if (!replyContent.trim()) return
        const parent = comments.find(c => c.id === parentId)
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId: parent?.postId,
                    author: { name: 'Admin' },
                    content: replyContent,
                    parentId: parentId,
                    status: 'approved'
                })
            })
            if (res.ok) {
                const data = await res.json()
                const newReply: Comment = {
                    id: data.comment.id,
                    postId: parent?.postId || "",
                    postTitle: parent?.postTitle || "",
                    author: "Admin",
                    content: replyContent,
                    createdAt: new Date().toISOString(),
                    likes: 0,
                    isApproved: true,
                    parentId: parentId
                }
                setComments([...comments, newReply])
            }
        } catch (error) {
            console.error('TbArrowBackUp error:', error)
        }
        setReplyingTo(null)
        setReplyContent("")
    }

    // 3. Bulk Actions Handlers with API
    const handleSelectAll = () => {
        if (selectedComments.size === paginatedComments.length) {
            setSelectedComments(new Set())
        } else {
            setSelectedComments(new Set(paginatedComments.map(c => c.id)))
        }
    }

    const handleBulkApprove = async () => {
        try {
            await Promise.all(Array.from(selectedComments).map(id =>
                fetch(`/api/comments/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'approved', isSpam: false })
                })
            ))
            setComments(comments.map(c =>
                selectedComments.has(c.id) ? { ...c, isApproved: true, isSpam: false } : c
            ))
            setSelectedComments(new Set())
        } catch (error) {
            console.error('Bulk approve error:', error)
        }
    }

    const handleBulkReject = async () => {
        try {
            await Promise.all(Array.from(selectedComments).map(id =>
                fetch(`/api/comments/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'rejected' })
                })
            ))
            setComments(comments.map(c =>
                selectedComments.has(c.id) ? { ...c, isApproved: false } : c
            ))
            setSelectedComments(new Set())
        } catch (error) {
            console.error('Bulk reject error:', error)
        }
    }

    const handleBulkDelete = async () => {
        try {
            await Promise.all(Array.from(selectedComments).map(id =>
                fetch(`/api/comments/${id}`, { method: 'DELETE' })
            ))
            setComments(comments.filter(c => !selectedComments.has(c.id)))
            setSelectedComments(new Set())
        } catch (error) {
            console.error('Bulk delete error:', error)
        }
    }

    // 4. Edit Handler with API
    const handleSaveEdit = async (id: string) => {
        if (!editContent.trim()) return
        try {
            const res = await fetch(`/api/comments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editContent })
            })
            if (res.ok) {
                setComments(comments.map(c =>
                    c.id === id ? { ...c, content: editContent, isSpam: isSpamContent(editContent) } : c
                ))
                setEditingComment(null)
                setEditContent("")
            }
        } catch (error) {
            console.error('Edit error:', error)
        }
    }

    // 5. Spam Settings Handler
    const handleAddBlacklistWord = () => {
        if (newBlacklistWord.trim() && !blacklistedWords.includes(newBlacklistWord.trim())) {
            setBlacklistedWords([...blacklistedWords, newBlacklistWord.trim()])
            setNewBlacklistWord("")
        }
    }

    const handleRemoveBlacklistWord = (word: string) => {
        setBlacklistedWords(blacklistedWords.filter(w => w !== word))
    }

    // 7. TbBan Author Handler
    const handleBanAuthor = (author: string) => {
        setBannedAuthors(prev => {
            const newSet = new Set(prev)
            if (newSet.has(author)) {
                newSet.delete(author)
            } else {
                newSet.add(author)
            }
            return newSet
        })
    }

    // 10. Toggle Thread
    const toggleThread = (commentId: string) => {
        setExpandedThreads(prev => {
            const newSet = new Set(prev)
            if (newSet.has(commentId)) {
                newSet.delete(commentId)
            } else {
                newSet.add(commentId)
            }
            return newSet
        })
    }

    const pendingCount = comments.filter(c => !c.isApproved && !c.isSpam).length
    const spamCount = comments.filter(c => c.isSpam || isSpamContent(c.content)).length

    // Get author's comments for profile view
    const getAuthorComments = (author: string) => {
        return comments.filter(c => c.author === author)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <TbMessage className="w-8 h-8 text-primary" />
                        კომენტარების მართვა
                    </h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                        {filteredComments.length} კომენტარი
                        {pendingCount > 0 && (
                            <Badge variant="destructive">
                                {pendingCount} მოლოდინში
                            </Badge>
                        )}
                        {spamCount > 0 && (
                            <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                                {spamCount} სპამი
                            </Badge>
                        )}
                    </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                    {/* 5. Spam Settings Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSpamSettings(true)}
                    >
                        <TbShield className="w-4 h-4 mr-1" />
                        სპამ ფილტრი
                    </Button>

                    {/* 6. Email Settings Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowEmailSettings(true)}
                    >
                        <TbMail className="w-4 h-4 mr-1" />
                        შეტყობინებები
                    </Button>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* 2. Date Filter */}
                <div className="flex rounded-lg border overflow-hidden">
                    {([
                        { value: "all", label: "ყველა" },
                        { value: "today", label: "დღეს" },
                        { value: "week", label: "კვირა" },
                        { value: "month", label: "თვე" }
                    ] as const).map((item) => (
                        <button
                            key={item.value}
                            onClick={() => { setDateFilter(item.value); setCurrentPage(1) }}
                            className={`px-3 py-2 text-sm font-medium transition-colors ${dateFilter === item.value
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                                }`}
                        >
                            <TbCalendar className="w-3 h-3 inline mr-1" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Status Filter */}
                <div className="flex rounded-lg border overflow-hidden">
                    {([
                        { value: "all", label: "ყველა" },
                        { value: "approved", label: "დამტკიცებული" },
                        { value: "pending", label: "მოლოდინში" },
                        { value: "spam", label: "სპამი" }
                    ] as const).map((item) => (
                        <button
                            key={item.value}
                            onClick={() => { setStatusFilter(item.value); setCurrentPage(1) }}
                            className={`px-3 py-2 text-sm font-medium transition-colors ${statusFilter === item.value
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* 9. Sort Controls */}
                <div className="flex items-center gap-2">
                    <Select value={sortBy} onValueChange={(value: "date" | "likes" | "author") => setSortBy(value)}>
                        <SelectTrigger className="w-[140px]">
                            <TbArrowsUpDown className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="დალაგება" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="date">თარიღი</SelectItem>
                            <SelectItem value="likes">ლაიქები</SelectItem>
                            <SelectItem value="author">ავტორი</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    >
                        {sortOrder === "asc" ? <TbChevronUp className="w-4 h-4" /> : <TbChevronDown className="w-4 h-4" />}
                    </Button>
                </div>

                {/* TbSearch */}
                <div className="relative flex-1 min-w-[200px]">
                    <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="ძიება..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* 3. Bulk Actions Bar */}
            {selectedComments.size > 0 && (
                <Card className="bg-primary/10 border-primary/30">
                    <CardContent className="py-3 flex items-center justify-between">
                        <span className="font-medium">
                            {selectedComments.size} კომენტარი მონიშნულია
                        </span>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-green-500" onClick={handleBulkApprove}>
                                <TbCircleCheck className="w-4 h-4 mr-1" />
                                დამტკიცება
                            </Button>
                            <Button size="sm" variant="outline" className="text-yellow-500" onClick={handleBulkReject}>
                                <TbCircleX className="w-4 h-4 mr-1" />
                                უარყოფა
                            </Button>
                            <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                                <TbTrash className="w-4 h-4 mr-1" />
                                წაშლა
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Select All Checkbox */}
            {paginatedComments.length > 0 && (
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={selectedComments.size === paginatedComments.length && paginatedComments.length > 0}
                        onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm text-muted-foreground">ყველას მონიშვნა</span>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
                {paginatedComments.map((comment) => {
                    const replies = getReplies(comment.id)
                    const hasReplies = replies.length > 0
                    const isExpanded = expandedThreads.has(comment.id)
                    const isSpam = comment.isSpam || isSpamContent(comment.content)

                    return (
                        <Card
                            key={comment.id}
                            className={`transition-all ${!comment.isApproved && !isSpam ? "border-yellow-500/50 bg-yellow-500/5" : ""
                                } ${isSpam ? "border-red-500/50 bg-red-500/5" : ""
                                } ${selectedComments.has(comment.id) ? "ring-2 ring-primary" : ""
                                }`}
                        >
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    {/* 3. Checkbox for bulk selection */}
                                    <div className="flex items-start pt-1">
                                        <Checkbox
                                            checked={selectedComments.has(comment.id)}
                                            onCheckedChange={(checked) => {
                                                setSelectedComments(prev => {
                                                    const newSet = new Set(prev)
                                                    if (checked) {
                                                        newSet.add(comment.id)
                                                    } else {
                                                        newSet.delete(comment.id)
                                                    }
                                                    return newSet
                                                })
                                            }}
                                        />
                                    </div>

                                    {/* Avatar */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-2xl ${comment.author === "Admin"
                                        ? "bg-gradient-to-br from-primary to-accent"
                                        : "bg-secondary/50 backdrop-blur-sm"
                                        }`}>
                                        {comment.author === "Admin" ? "⭐" : getAvatarForName(comment.author)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        {/* Header */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {/* 7. Clickable Author Name */}
                                            <button
                                                onClick={() => setViewingAuthor(comment.author)}
                                                className="font-semibold hover:text-primary transition-colors flex items-center gap-1"
                                            >
                                                <TbUser className="w-3 h-3" />
                                                {comment.author}
                                            </button>
                                            {comment.author === "Admin" && (
                                                <Badge variant="secondary" className="text-xs">ადმინი</Badge>
                                            )}
                                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                <TbClock className="w-3 h-3" />
                                                {timeAgo(comment.createdAt)}
                                            </span>
                                            {!comment.isApproved && !isSpam && (
                                                <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                                                    მოლოდინში
                                                </Badge>
                                            )}
                                            {isSpam && (
                                                <Badge variant="destructive">
                                                    <TbShield className="w-3 h-3 mr-1" />
                                                    სპამი
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Post Reference */}
                                        <div className="text-sm text-muted-foreground mt-1">
                                            პოსტზე: <span className="text-foreground">{comment.postTitle}</span>
                                        </div>

                                        {/* Comment Content or Edit Mode */}
                                        {editingComment === comment.id ? (
                                            <div className="mt-2 space-y-2">
                                                <Textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    rows={3}
                                                />
                                                <div className="flex gap-2">
                                                    <Button size="sm" onClick={() => handleSaveEdit(comment.id)}>
                                                        შენახვა
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => setEditingComment(null)}>
                                                        გაუქმება
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="mt-2">{comment.content}</p>
                                        )}

                                        {/* Stats & Actions */}
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <TbHeart className="w-4 h-4" />
                                                    {comment.likes}
                                                </span>
                                                {/* 10. Thread Toggle */}
                                                {hasReplies && (
                                                    <button
                                                        onClick={() => toggleThread(comment.id)}
                                                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                                                    >
                                                        <TbMessage className="w-4 h-4" />
                                                        {replies.length} პასუხი
                                                        {isExpanded ? <TbChevronUp className="w-3 h-3" /> : <TbChevronDown className="w-3 h-3" />}
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex gap-2 flex-wrap">
                                                {/* 1. TbArrowBackUp Button */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setReplyingTo(comment.id)}
                                                >
                                                    <TbArrowBackUp className="w-4 h-4 mr-1" />
                                                    პასუხი
                                                </Button>

                                                {/* 4. Edit Button */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setEditingComment(comment.id)
                                                        setEditContent(comment.content)
                                                    }}
                                                >
                                                    <TbEdit className="w-4 h-4 mr-1" />
                                                    რედაქტირება
                                                </Button>

                                                {!comment.isApproved ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-green-500 hover:text-green-600"
                                                        onClick={() => handleApprove(comment.id)}
                                                    >
                                                        <TbCircleCheck className="w-4 h-4 mr-1" />
                                                        დამტკიცება
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-yellow-500 hover:text-yellow-600"
                                                        onClick={() => handleReject(comment.id)}
                                                    >
                                                        <TbCircleX className="w-4 h-4 mr-1" />
                                                        უარყოფა
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => setDeleteConfirm(comment.id)}
                                                >
                                                    <TbTrash className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* 1. TbArrowBackUp Form */}
                                        {replyingTo === comment.id && (
                                            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
                                                <Textarea
                                                    value={replyContent}
                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                    placeholder="დაწერე პასუხი..."
                                                    rows={3}
                                                />
                                                <div className="flex gap-2">
                                                    <Button size="sm" onClick={() => handleSendReply(comment.id)}>
                                                        <TbSend className="w-4 h-4 mr-1" />
                                                        გაგზავნა
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                                                        გაუქმება
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* 10. Thread View - Replies */}
                                        {isExpanded && hasReplies && (
                                            <div className="mt-4 ml-6 border-l-2 border-muted pl-4 space-y-4">
                                                {replies.map(reply => (
                                                    <div key={reply.id} className="flex gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-lg ${reply.author === "Admin"
                                                            ? "bg-gradient-to-br from-primary to-accent"
                                                            : "bg-secondary/50"
                                                            }`}>
                                                            {reply.author === "Admin" ? "⭐" : getAvatarForName(reply.author)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-sm">{reply.author}</span>
                                                                {reply.author === "Admin" && (
                                                                    <Badge variant="secondary" className="text-xs">ადმინი</Badge>
                                                                )}
                                                                <span className="text-xs text-muted-foreground">
                                                                    {timeAgo(reply.createdAt)}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm mt-1">{reply.content}</p>
                                                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                                <span className="flex items-center gap-1">
                                                                    <TbHeart className="w-3 h-3" />
                                                                    {reply.likes}
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-6 text-xs text-destructive"
                                                                    onClick={() => handleDelete(reply.id)}
                                                                >
                                                                    <TbTrash className="w-3 h-3 mr-1" />
                                                                    წაშლა
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}

                {paginatedComments.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            <TbMessage className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>კომენტარები ვერ მოიძებნა</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* 8. Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                    >
                        <TbChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                    >
                        <TbChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
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

            {/* 5. Spam Settings Modal */}
            {showSpamSettings && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <TbShield className="w-5 h-5" />
                                სპამ ფილტრის პარამეტრები
                            </CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setShowSpamSettings(false)}>
                                <TbX className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                კომენტარები, რომლებიც შეიცავს ამ სიტყვებს, ავტომატურად მოინიშნება როგორც სპამი.
                            </p>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="ახალი სიტყვა..."
                                    value={newBlacklistWord}
                                    onChange={(e) => setNewBlacklistWord(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddBlacklistWord()}
                                />
                                <Button onClick={handleAddBlacklistWord}>დამატება</Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {blacklistedWords.map(word => (
                                    <Badge key={word} variant="secondary" className="flex items-center gap-1">
                                        {word}
                                        <button onClick={() => handleRemoveBlacklistWord(word)}>
                                            <TbX className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* 6. Email Settings Modal */}
            {showEmailSettings && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <TbMail className="w-5 h-5" />
                                Email შეტყობინებები
                            </CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setShowEmailSettings(false)}>
                                <TbX className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">ახალი კომენტარები</p>
                                    <p className="text-sm text-muted-foreground">შეტყობინება ახალი კომენტარების შესახებ</p>
                                </div>
                                <Checkbox
                                    checked={emailSettings.notifyOnNew}
                                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, notifyOnNew: !!checked }))}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">პასუხები ავტორს</p>
                                    <p className="text-sm text-muted-foreground">აცნობე ავტორს პასუხის შესახებ</p>
                                </div>
                                <Checkbox
                                    checked={emailSettings.notifyAuthorOnReply}
                                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, notifyAuthorOnReply: !!checked }))}
                                />
                            </div>
                            <Button className="w-full" onClick={() => setShowEmailSettings(false)}>
                                შენახვა
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* 7. Author Profile Modal */}
            {viewingAuthor && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-2xl">
                                    {getAvatarForName(viewingAuthor)}
                                </div>
                                {viewingAuthor}
                                {bannedAuthors.has(viewingAuthor) && (
                                    <Badge variant="destructive">დაბლოკილი</Badge>
                                )}
                            </CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setViewingAuthor(null)}>
                                <TbX className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">სულ კომენტარები</p>
                                    <p className="text-2xl font-bold">{getAuthorComments(viewingAuthor).length}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">სულ ლაიქები</p>
                                    <p className="text-2xl font-bold">
                                        {getAuthorComments(viewingAuthor).reduce((sum, c) => sum + c.likes, 0)}
                                    </p>
                                </div>
                                <Button
                                    variant={bannedAuthors.has(viewingAuthor) ? "outline" : "destructive"}
                                    size="sm"
                                    onClick={() => handleBanAuthor(viewingAuthor)}
                                >
                                    <TbBan className="w-4 h-4 mr-1" />
                                    {bannedAuthors.has(viewingAuthor) ? "განბლოკვა" : "დაბლოკვა"}
                                </Button>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-3">კომენტარების ისტორია</h4>
                                <div className="space-y-3">
                                    {getAuthorComments(viewingAuthor).map(comment => (
                                        <div key={comment.id} className="p-3 bg-muted/50 rounded-lg">
                                            <p className="text-sm">{comment.content}</p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                <span>{comment.postTitle}</span>
                                                <span>{timeAgo(comment.createdAt)}</span>
                                                <span className="flex items-center gap-1">
                                                    <TbHeart className="w-3 h-3" />
                                                    {comment.likes}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

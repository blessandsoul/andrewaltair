"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TbDeviceFloppy, TbArrowLeft, TbWorld, TbFileText, TbStar, TbGitFork, TbCode, TbTag, TbBrandGithub, TbBrandGitlab, TbRefresh, TbX, TbLoader2, TbCheck } from "react-icons/tb"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAutosave } from "@/hooks/useAutosave"

// Reuse PostData interface but focus on repository fields
import { PostData } from "./PostEditor"

interface RepositoryEditorProps {
    initialData?: Partial<PostData>
    onSave: (data: PostData) => Promise<void> | void
    onCancel: () => void
    isEditing?: boolean
}

const DEFAULT_REPO_POST: PostData = {
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    rawContent: "",
    categories: ["resources"], // Default category for repos
    tags: [],
    coverImage: "",
    coverImages: {},
    gallery: [],
    sections: [],
    author: {
        name: "Andrew Altair",
        avatar: "/images/avatar.jpg",
        role: "AI ინოვატორი"
    },
    publishedAt: new Date().toISOString().split("T")[0],
    readingTime: 1,
    views: 0,
    reactions: { fire: 0, love: 0, mindblown: 0, applause: 0, insightful: 0 },
    featured: false,
    trending: false,
    type: "library", // 'library' fits well for repositories
    status: "published",
    relatedPosts: [],
    videos: [],
    seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: "",
        canonicalUrl: "",
        focusKeyword: "",
        seoScore: 0,
        ogImage: ""
    },
    // Initialize repository object
    repository: {
        type: 'other',
        url: '',
        name: '',
        description: '',
        stars: 0,
        forks: 0,
        language: '',
        topics: [],
        license: ''
    }
}

export function RepositoryEditor({ initialData, onSave, onCancel, isEditing = false }: RepositoryEditorProps) {
    const [post, setPost] = React.useState<PostData>({
        ...DEFAULT_REPO_POST,
        ...initialData,
        repository: {
            ...DEFAULT_REPO_POST.repository!,
            ...initialData?.repository
        }
    })

    const [isSaving, setIsSaving] = React.useState(false)
    const [isFetchingInfo, setIsFetchingInfo] = React.useState(false)

    // Generate slug from title (shared logic)
    const generateSlug = (title: string): string => {
        const geo: Record<string, string> = {
            'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v', 'ზ': 'z',
            'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o',
            'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's', 'ტ': 't', 'უ': 'u', 'ფ': 'p',
            'ქ': 'q', 'ღ': 'gh', 'ყ': 'y', 'შ': 'sh', 'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz',
            'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h'
        }
        let slug = title.toLowerCase()
        for (const [char, lat] of Object.entries(geo)) slug = slug.replace(new RegExp(char, 'g'), lat)
        return slug.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim()
    }

    // Handle Mock Fetch from GitHub
    const fetchRepoInfo = async () => {
        if (!post.repository?.url) return;
        setIsFetchingInfo(true);

        // Simulating fetch - in future connect to real GitHub API
        setTimeout(() => {
            const urlParts = post.repository?.url.split('/') || [];
            const name = urlParts[urlParts.length - 1] || 'Unknown Repo';

            setPost(prev => {
                const newName = prev.repository?.name || name;
                return {
                    ...prev,
                    title: newName,
                    slug: generateSlug(newName),
                    repository: {
                        ...prev.repository!,
                        name: newName,
                        type: prev.repository?.url.includes('gitlab') ? 'gitlab' : 'github',
                    }
                }
            });
            toast.success("Repository info fetched (Simulated)");
            setIsFetchingInfo(false);
        }, 1000);
    }

    const handleSave = async () => {
        if (!post.title || !post.repository?.url) {
            toast.error("Title and Repository URL are required");
            return;
        }

        setIsSaving(true);
        try {
            // Ensure ID exists
            const finalPost = {
                ...post,
                id: post.id || Date.now().toString(),
                slug: post.slug || generateSlug(post.title),
                // Ensure tags sync with topics
                tags: [...new Set([...(post.tags || []), ...(post.repository?.topics || [])])]
            };

            await onSave(finalPost);
            toast.success("Repository saved successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save repository");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-md p-4 rounded-xl border border-border/40 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                        <TbArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-purple-600 dark:text-purple-400">
                            <TbBrandGithub className="w-8 h-8" />
                            {isEditing ? "Edit Repository" : "New Repository"}
                        </h1>
                        <p className="text-sm text-muted-foreground">Add Open Source resource to the library</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                        {isSaving ? <TbLoader2 className="w-4 h-4 animate-spin" /> : <TbDeviceFloppy className="w-4 h-4" />}
                        Save Repository
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Repository Core Data */}
                    <Card className="border-2 border-purple-500/20 shadow-lg shadow-purple-500/5">
                        <CardHeader className="bg-purple-500/5 border-b border-purple-500/10 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Repository Details</CardTitle>
                                <Button variant="secondary" size="sm" onClick={fetchRepoInfo} disabled={isFetchingInfo} className="gap-2">
                                    {isFetchingInfo ? <TbLoader2 className="w-4 h-4 animate-spin" /> : <TbRefresh className="w-4 h-4" />}
                                    Auto-Fill
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            {/* URL */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <TbWorld className="w-4 h-4 text-muted-foreground" />
                                    Repository URL
                                </label>
                                <Input
                                    placeholder="https://github.com/username/project"
                                    value={post.repository?.url || ''}
                                    onChange={(e) => setPost(prev => ({
                                        ...prev,
                                        repository: { ...prev.repository!, url: e.target.value }
                                    }))}
                                    className="font-mono"
                                />
                            </div>

                            {/* Name & Title */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Repository Name</label>
                                    <Input
                                        placeholder="e.g. Next.js"
                                        value={post.repository?.name || ''}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setPost(prev => ({
                                                ...prev,
                                                title: val, // Sync with main title
                                                repository: { ...prev.repository!, name: val }
                                            }))
                                        }}
                                        className="font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Slug</label>
                                    <Input
                                        value={post.slug}
                                        onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                                        className="font-mono text-sm text-muted-foreground"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                                    placeholder="Short description of the project..."
                                    value={post.repository?.description || ''}
                                    onChange={(e) => setPost(prev => ({
                                        ...prev,
                                        excerpt: e.target.value,
                                        repository: { ...prev.repository!, description: e.target.value }
                                    }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats & Metadata */}
                    <Card>
                        <CardHeader><CardTitle className="text-lg">Stats & Metadata</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                    <TbStar className="w-3 h-3" /> Stars
                                </label>
                                <Input
                                    type="number"
                                    value={post.repository?.stars || 0}
                                    onChange={(e) => setPost(prev => ({
                                        ...prev,
                                        repository: { ...prev.repository!, stars: parseInt(e.target.value) || 0 }
                                    }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                    <TbGitFork className="w-3 h-3" /> Forks
                                </label>
                                <Input
                                    type="number"
                                    value={post.repository?.forks || 0}
                                    onChange={(e) => setPost(prev => ({
                                        ...prev,
                                        repository: { ...prev.repository!, forks: parseInt(e.target.value) || 0 }
                                    }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                    <TbCode className="w-3 h-3" /> Language
                                </label>
                                <Input
                                    placeholder="TypeScript"
                                    value={post.repository?.language || ''}
                                    onChange={(e) => setPost(prev => ({
                                        ...prev,
                                        repository: { ...prev.repository!, language: e.target.value }
                                    }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Readme / Long Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TbFileText className="w-5 h-5 text-muted-foreground" />
                                Readme / Detailed Content
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <textarea
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[300px]"
                                placeholder="# Project Readme..."
                                value={post.rawContent || ''}
                                onChange={(e) => setPost(prev => ({ ...prev, rawContent: e.target.value }))}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Topics */}
                    <Card>
                        <CardHeader><CardTitle className="text-sm">Topics</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                placeholder="Add topic (Enter)"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const val = e.currentTarget.value.trim();
                                        if (val && !post.repository?.topics.includes(val)) {
                                            setPost(prev => ({
                                                ...prev,
                                                repository: {
                                                    ...prev.repository!,
                                                    topics: [...(prev.repository?.topics || []), val]
                                                }
                                            }));
                                            e.currentTarget.value = '';
                                        }
                                    }
                                }}
                            />
                            <div className="flex flex-wrap gap-2">
                                {post.repository?.topics?.map(topic => (
                                    <Badge key={topic} variant="secondary" className="gap-1">
                                        {topic}
                                        <button onClick={() => setPost(prev => ({
                                            ...prev,
                                            repository: {
                                                ...prev.repository!,
                                                topics: prev.repository?.topics.filter(t => t !== topic) || []
                                            }
                                        }))}><TbX className="w-3 h-3 hover:text-destructive" /></button>
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status */}
                    <Card>
                        <CardHeader><CardTitle className="text-sm">Status</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-2 border rounded-md">
                                <span className="text-sm font-medium capitalize">{post.status}</span>
                                <Button variant="outline" size="sm" onClick={() => setPost(prev => ({
                                    ...prev,
                                    status: prev.status === 'published' ? 'draft' : 'published'
                                }))}>
                                    Toggle
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TbPlus, TbSearch, TbBrandGithub, TbStar, TbGitFork, TbEdit, TbTrash, TbExternalLink } from "react-icons/tb"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface RepositoryPost {
    _id: string;
    title: string;
    status: string;
    publishedAt: string;
    repository: {
        url: string;
        stars: number;
        forks: number;
        language: string;
    };
    views: number;
}

export default function RepositoriesPage() {
    const router = useRouter()
    const [repos, setRepos] = React.useState<RepositoryPost[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [searchQuery, setSearchQuery] = React.useState("")

    React.useEffect(() => {
        fetchRepos()
    }, [])

    const fetchRepos = async () => {
        try {
            // Fetch posts that have repository data
            const response = await fetch('/api/posts?type=repository')
            if (response.ok) {
                const data = await response.json()
                // Client-side filtering for posts with repository field (if API doesn't fully filter)
                const repoPosts = data.posts.filter((p: any) => p.repository && p.repository.url)
                setRepos(repoPosts)
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to load repositories")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigation
        if (!confirm("Are you sure you want to delete this repository entry?")) return

        try {
            const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
            if (response.ok) {
                toast.success("Repository deleted")
                setRepos(prev => prev.filter(p => p._id !== id))
            } else {
                throw new Error("Failed to delete")
            }
        } catch (error) {
            toast.error("Error deleting repository")
        }
    }

    const filteredRepos = repos.filter(repo =>
        repo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.repository?.language?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <TbBrandGithub className="text-purple-600" />
                        Repositories
                    </h1>
                    <p className="text-muted-foreground">Manage open source projects and tools</p>
                </div>
                <Link href="/admin/repositories/new">
                    <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                        <TbPlus className="w-5 h-5" />
                        Add Repository
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader className="pb-3 border-b">
                    <div className="relative">
                        <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search repositories..."
                            className="pl-10 max-w-md"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-8 text-center text-muted-foreground">Loading...</div>
                    ) : filteredRepos.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center gap-4 text-muted-foreground">
                            <TbBrandGithub className="w-12 h-12 opacity-20" />
                            <p>No repositories found. Add your first one!</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredRepos.map(repo => (
                                <Link
                                    key={repo._id}
                                    href={`/admin/repositories/edit/${repo._id}`}
                                    className="flex flex-col md:flex-row gap-4 p-4 hover:bg-muted/50 transition-colors group"
                                >
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-lg group-hover:text-purple-600 transition-colors">
                                                {repo.title}
                                            </span>
                                            {repo.status !== 'published' && (
                                                <Badge variant="outline" className="text-xs">Draft</Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <TbStar className="w-3.5 h-3.5" /> {repo.repository.stars}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <TbGitFork className="w-3.5 h-3.5" /> {repo.repository.forks}
                                            </span>
                                            {repo.repository.language && (
                                                <span className="px-1.5 py-0.5 rounded bg-muted text-xs">
                                                    {repo.repository.language}
                                                </span>
                                            )}
                                            <span className="text-xs opacity-50">{new Date(repo.publishedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" onClick={(e) => {
                                            e.preventDefault();
                                            window.open(repo.repository.url, '_blank');
                                        }}>
                                            <TbExternalLink className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={(e) => handleDelete(repo._id, e)}>
                                            <TbTrash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash, BookOpen } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
// import { format } from "date-fns" // Removed to use native Intl
import { ITutorial } from "@/models/Tutorial" // We might need to make this a type-only import or define a client interface

// Client-side interface mirroring the model
interface Tutorial {
    _id: string;
    title: string;
    slug: string;
    status: 'draft' | 'published' | 'archived';
    views: number;
    createdAt: string;
    author: { name: string };
    tags: string[];
}

export default function TutorialsAdminPage() {
    const [tutorials, setTutorials] = useState<Tutorial[]>([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchTutorials()
    }, [])

    const fetchTutorials = async () => {
        try {
            const res = await fetch('/api/tutorials?limit=50')
            const data = await res.json()
            setTutorials(data)
        } catch (error) {
            console.error("Failed to fetch tutorials", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this tutorial?")) return;
        try {
            await fetch(`/api/tutorials/${id}`, { method: 'DELETE' });
            fetchTutorials();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    }

    const filtered = tutorials.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tutorials</h2>
                    <p className="text-muted-foreground">Manage your educational blueprints and guides.</p>
                </div>
                <Link href="/admin/tutorials/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> New Tutorial
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tutorials..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    filtered.map((item) => (
                        <Card key={item._id} className="group hover:border-purple-500/50 transition-colors">
                            <CardContent className="p-6 flex items-center gap-6">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <BookOpen className="h-6 w-6 text-primary" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                                        <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        <span>•</span>
                                        <span>{item.views} views</span>
                                        <div className="flex gap-1">
                                            {item.tags.slice(0, 3).map(tag => (
                                                <Badge key={tag} variant="outline" className="text-xs px-1 py-0 h-5">
                                                    #{tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/admin/tutorials/edit/${item._id}`}>
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item._id)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}

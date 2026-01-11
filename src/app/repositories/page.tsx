import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    TbSearch,
    TbBrandGithub,
    TbArrowRight,
    TbCode,
    TbFilter
} from "react-icons/tb"
import { RepoCard } from "@/components/repositories/RepoCard"
import dbConnect from "@/lib/db"
import Post from "@/models/Post"

// Fetch repository posts directly from MongoDB
async function getRepositories() {
    try {
        await dbConnect()
        const posts = await Post.find({
            status: 'published',
            'repository.url': { $exists: true }
        })
            .sort({ order: 1, createdAt: -1 })
            .limit(50)
            .lean()

        // Transform MongoDB documents to plain objects with string IDs
        return posts.map((post) => ({
            ...post,
            id: post._id.toString(),
            _id: post._id.toString(),
        }))
    } catch (error) {
        console.error('Error fetching repositories:', error)
        return []
    }
}

export default async function RepositoriesPage() {
    const allRepos = await getRepositories()

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
                    <div className="absolute inset-0 noise-overlay"></div>
                </div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <Badge variant="secondary" className="px-4 py-2">
                            <TbCode className="w-3 h-3 mr-2" />
                            Open Source
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            <span className="text-gradient">კოდის საცავი</span>
                        </h1>

                        <p className="text-xl text-muted-foreground">
                            ჩემი ღია კოდის პროექტები, ბიბლიოთეკები და ინსტრუმენტები
                        </p>

                        {/* Search Bar */}
                        <div className="flex gap-3 max-w-lg mx-auto pt-4">
                            <div className="relative flex-1">
                                <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    placeholder="მოძებნე რეპოზიტორი..."
                                    className="pl-10 h-12 bg-card"
                                />
                            </div>
                            <Button size="lg" variant="outline" className="h-12">
                                <TbFilter className="w-4 h-4 mr-2" />
                                ფილტრი
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Repositories Grid */}
            <section className="py-16 lg:py-20 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                                <TbBrandGithub className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">ყველა პროექტი</h2>
                                <p className="text-muted-foreground">GitHub Repositories</p>
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            სულ: {allRepos.length} პროექტი
                        </div>
                    </div>

                    {allRepos.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {allRepos.map((post: any) => (
                                <RepoCard
                                    key={post.id}
                                    post={post}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 space-y-6">
                            <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                                <TbCode className="w-12 h-12 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">პროექტები მალე!</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    ახალი პროექტები მალე დაემატება.
                                </p>
                            </div>
                            <Button size="lg" asChild>
                                <Link href="/">
                                    <TbArrowRight className="w-4 h-4 mr-2" />
                                    მთავარ გვერდზე დაბრუნება
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

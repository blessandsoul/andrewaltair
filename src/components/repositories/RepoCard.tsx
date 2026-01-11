"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TbStar, TbGitFork, TbBook, TbExternalLink, TbBrandGithub, TbBrandGitlab } from "react-icons/tb"
import { getLanguageColor } from "@/lib/language-colors"
import { IRepository } from "@/models/Post" // Importing directly from model for type safety, or define interface locally if needed

// Local interface if import fails or to decouple
interface RepoData {
    type: 'github' | 'gitlab' | 'other'
    url: string
    name: string
    description: string
    stars: number
    forks: number
    language: string
    topics: string[]
}

interface PostWithRepo {
    slug: string
    title: string
    excerpt: string
    repository?: RepoData
}

interface RepoCardProps {
    post: PostWithRepo
}

export function RepoCard({ post }: RepoCardProps) {
    if (!post.repository) return null;

    const { repository } = post;
    const langColor = getLanguageColor(repository.language);

    return (
        <Link href={`/repositories/${post.slug}`} className="block h-full">
            <Card className="h-full border border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                <CardContent className="p-6 flex flex-col h-full">
                    {/* Header: Icon + Name */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-secondary/50 text-foreground">
                                {repository.type === 'gitlab' ? (
                                    <TbBrandGitlab className="w-6 h-6" />
                                ) : (
                                    <TbBrandGithub className="w-6 h-6" />
                                )}
                            </div>
                            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                                {repository.name}
                            </h3>
                        </div>
                        <Badge variant="outline" className="text-xs font-normal opacity-70">
                            Public
                        </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1">
                        {repository.description || post.excerpt}
                    </p>

                    {/* Stats & Footer */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                        <div className="flex items-center gap-4">
                            {repository.language && (
                                <div className="flex items-center gap-1.5">
                                    <span
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: langColor }}
                                    />
                                    <span>{repository.language}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-1 hover:text-foreground transition-colors">
                                <TbStar className="w-4 h-4" />
                                <span>{repository.stars}</span>
                            </div>

                            <div className="flex items-center gap-1 hover:text-foreground transition-colors">
                                <TbGitFork className="w-4 h-4" />
                                <span>{repository.forks}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

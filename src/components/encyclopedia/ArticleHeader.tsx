"use client"

import * as React from "react"
import Image from "next/image"
import { TbUser, TbCalendar, TbClock, TbRefresh } from "react-icons/tb"

interface Author {
    name: string
    avatar?: string
    role?: string
}

interface ArticleHeaderProps {
    title: string
    author: Author
    publishedAt?: Date | string
    updatedAt?: Date | string
    estimatedMinutes?: number
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

function formatRelativeTime(date: Date | string): string {
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "დღეს"
    if (diffDays === 1) return "გუშინ"
    if (diffDays < 7) return `${diffDays} დღის წინ`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} კვირის წინ`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} თვის წინ`
    return then.toLocaleDateString("ka-GE")
}

function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString("ka-GE", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

const difficultyLabels = {
    beginner: { label: "დამწყები", color: "bg-green-500/20 text-green-500" },
    intermediate: { label: "საშუალო", color: "bg-amber-500/20 text-amber-500" },
    advanced: { label: "მოწინავე", color: "bg-red-500/20 text-red-500" },
}

export function ArticleHeader({
    title,
    author,
    publishedAt,
    updatedAt,
    estimatedMinutes,
    difficulty = "beginner",
}: ArticleHeaderProps) {
    const isUpdated = updatedAt && publishedAt && new Date(updatedAt) > new Date(publishedAt)

    return (
        <div className="mb-8">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{title}</h1>

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
                {/* Author */}
                <div className="flex items-center gap-3">
                    {author.avatar ? (
                        <Image
                            src={author.avatar}
                            alt={author.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <TbUser className="w-5 h-5 text-primary" />
                        </div>
                    )}
                    <div>
                        <div className="font-medium">{author.name}</div>
                        {author.role && (
                            <div className="text-xs text-muted-foreground">{author.role}</div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                    {/* Published Date */}
                    {publishedAt && (
                        <span className="flex items-center gap-1">
                            <TbCalendar className="w-4 h-4" />
                            {formatDate(publishedAt)}
                        </span>
                    )}

                    {/* Updated */}
                    {isUpdated && (
                        <span className="flex items-center gap-1 text-primary">
                            <TbRefresh className="w-4 h-4" />
                            განახლდა {formatRelativeTime(updatedAt!)}
                        </span>
                    )}

                    {/* Reading Time */}
                    {estimatedMinutes && (
                        <span className="flex items-center gap-1">
                            <TbClock className="w-4 h-4" />
                            {estimatedMinutes} წთ კითხვა
                        </span>
                    )}

                    {/* Difficulty */}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyLabels[difficulty].color}`}>
                        {difficultyLabels[difficulty].label}
                    </span>
                </div>
            </div>
        </div>
    )
}

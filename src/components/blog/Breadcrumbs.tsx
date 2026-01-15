"use client"

import Link from "next/link"
import { TbChevronRight, TbHome } from "react-icons/tb"

interface BreadcrumbsProps {
    category: string
    categoryName: string
    title: string
}

export function Breadcrumbs({ category, categoryName, title }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4 overflow-x-auto">
            <Link
                href="/"
                className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0"
            >
                <TbHome className="w-4 h-4" />
                <span className="hidden sm:inline">მთავარი</span>
            </Link>
            <TbChevronRight className="w-4 h-4 shrink-0" />
            <Link
                href="/blog"
                className="hover:text-foreground transition-colors shrink-0"
            >
                ბლოგი
            </Link>
            <TbChevronRight className="w-4 h-4 shrink-0" />
            <Link
                href={`/blog?category=${category}`}
                className="hover:text-foreground transition-colors shrink-0"
            >
                {categoryName}
            </Link>
            <TbChevronRight className="w-4 h-4 shrink-0" />
            <span className="text-foreground font-medium truncate max-w-[200px]">
                {title}
            </span>
        </nav>
    )
}

export default Breadcrumbs

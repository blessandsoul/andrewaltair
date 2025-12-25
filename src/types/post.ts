// Types for the blog system

export interface Author {
    name: string
    avatar?: string
    role?: string
}

export interface Post {
    id: string
    slug: string
    title: string
    excerpt: string
    content?: string
    coverImage?: string
    category: string
    tags: string[]
    author: Author
    publishedAt: string
    readingTime: number
    views: number
    reactions: Reactions
    featured?: boolean
    trending?: boolean
}

export interface Reactions {
    fire: number
    love: number
    mindblown: number
    applause: number
    insightful: number
}

export interface Comment {
    id: string
    postId: string
    author: {
        name: string
        avatar?: string
    }
    content: string
    createdAt: string
    likes: number
    replies?: Comment[]
}

export interface Video {
    id: string
    title: string
    description: string
    youtubeId: string
    thumbnail?: string
    category: string
    publishedAt: string
    views: number
    duration?: string
    type: 'long' | 'short'
}

export interface Resource {
    id: string
    title: string
    description: string
    url: string
    category: 'book' | 'course' | 'tool' | 'article' | 'github'
    image?: string
    rating?: number
}

export interface Tool {
    id: string
    name: string
    description: string
    url: string
    logo?: string
    category: string
    pricing: 'free' | 'freemium' | 'paid'
    rating?: number
}

export interface GitHubRepo {
    name: string
    description: string
    url: string
    stars: number
    forks: number
    language?: string
    topics?: string[]
}

export interface NowItem {
    id: string
    type: 'reading' | 'watching' | 'learning' | 'building'
    title: string
    description?: string
    url?: string
    image?: string
    progress?: number
}

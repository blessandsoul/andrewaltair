"use client"

import { HubLayout } from "./layouts"

interface HomeLayoutSwitcherProps {
    posts: any[]
    videos: any[]
}

export function HomeLayoutSwitcher({ posts, videos }: HomeLayoutSwitcherProps) {
    return <HubLayout posts={posts} videos={videos} />
}

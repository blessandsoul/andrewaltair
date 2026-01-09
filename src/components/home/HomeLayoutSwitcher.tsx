"use client"

import { useLayout, LayoutType } from "@/lib/layoutContext"
import { MasonryLayout, CardsLayout, FeedLayout, HubLayout } from "./layouts"

interface HomeLayoutSwitcherProps {
    posts: any[]
    videos: any[]
}

export function HomeLayoutSwitcher({ posts, videos }: HomeLayoutSwitcherProps) {
    const { layout } = useLayout()

    const layoutComponents: Record<LayoutType, React.ReactNode> = {
        masonry: <MasonryLayout posts={posts} videos={videos} />,
        cards: <CardsLayout posts={posts} videos={videos} />,
        feed: <FeedLayout posts={posts} videos={videos} />,
        hub: <HubLayout posts={posts} videos={videos} />,
    }

    return layoutComponents[layout]
}

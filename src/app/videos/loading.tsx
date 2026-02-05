export default function VideosLoading() {
    return (
        <div className="min-h-screen">
            {/* Hero Section Skeleton */}
            <section className="relative py-20 lg:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <div className="h-8 w-36 bg-muted rounded-full animate-pulse mx-auto" />
                        <div className="h-12 w-80 max-w-full bg-muted rounded-lg animate-pulse mx-auto" />
                        <div className="h-6 w-96 max-w-full bg-muted rounded animate-pulse mx-auto" />
                    </div>
                </div>
            </section>

            {/* Featured Video Skeleton */}
            <section className="py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-muted rounded-xl animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-6 w-44 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-36 bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="aspect-video bg-muted animate-pulse" />
                        <div className="p-6 space-y-3">
                            <div className="h-6 w-72 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-96 max-w-full bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Grid Skeleton */}
            <section className="py-12 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded-xl animate-pulse" />
                            <div className="h-6 w-40 bg-muted rounded animate-pulse" />
                        </div>
                        <div className="flex gap-2">
                            <div className="h-8 w-20 bg-muted rounded-full animate-pulse" />
                            <div className="h-8 w-24 bg-muted rounded-full animate-pulse" />
                        </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                                {/* 16:9 Thumbnail */}
                                <div className="aspect-video bg-muted animate-pulse relative">
                                    <div className="absolute bottom-2 right-2 h-6 w-12 bg-secondary rounded animate-pulse" />
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="h-5 w-full bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-muted rounded-full animate-pulse" />
                                            <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-3 w-12 bg-muted rounded animate-pulse" />
                                            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Shorts Section Skeleton */}
            <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-muted rounded-xl animate-pulse" />
                        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                                <div className="aspect-[9/16] bg-muted animate-pulse" />
                                <div className="p-3 space-y-2">
                                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default function BlogLoading() {
    return (
        <div className="min-h-screen">
            {/* Hero Section Skeleton */}
            <section className="relative py-20 lg:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <div className="h-8 w-28 bg-muted rounded-full animate-pulse mx-auto" />
                        <div className="h-12 w-96 max-w-full bg-muted rounded-lg animate-pulse mx-auto" />
                        <div className="h-6 w-80 max-w-full bg-muted rounded animate-pulse mx-auto" />
                        <div className="flex gap-3 max-w-lg mx-auto pt-4">
                            <div className="flex-1 h-12 bg-muted rounded-lg animate-pulse" />
                            <div className="h-12 w-28 bg-muted rounded-lg animate-pulse" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Pills Skeleton */}
            <section className="py-8 border-y border-border bg-card/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-8 w-24 bg-muted rounded-full animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Posts Skeleton */}
            <section className="py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-muted rounded-xl animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-6 w-48 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-36 bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                                <div className="h-56 bg-muted animate-pulse" />
                                <div className="p-6 space-y-3">
                                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                    <div className="h-7 w-full bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* All Posts Grid Skeleton */}
            <section className="py-16 lg:py-20 bg-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded-xl animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-6 w-36 bg-muted rounded animate-pulse" />
                                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                            </div>
                        </div>
                        <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                                <div className="h-48 bg-muted animate-pulse" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                                    <div className="h-6 w-full bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                                    <div className="flex gap-2 mt-4">
                                        <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                                        <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

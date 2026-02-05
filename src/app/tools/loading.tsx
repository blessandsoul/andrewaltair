export default function ToolsLoading() {
    return (
        <div className="min-h-screen">
            {/* Hero Section Skeleton */}
            <section className="relative py-16 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <div className="h-8 w-40 bg-muted rounded-full animate-pulse mx-auto" />
                        <div className="h-12 w-80 max-w-full bg-muted rounded-lg animate-pulse mx-auto" />
                        <div className="h-6 w-96 max-w-full bg-muted rounded animate-pulse mx-auto" />

                        {/* Stats Cards Skeleton */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-card border border-border rounded-2xl p-4 text-center space-y-2">
                                    <div className="h-8 w-16 bg-muted rounded animate-pulse mx-auto" />
                                    <div className="h-4 w-20 bg-muted rounded animate-pulse mx-auto" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Search Bar Skeleton */}
            <section className="py-4 border-b border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 h-12 bg-muted rounded-lg animate-pulse" />
                        <div className="flex gap-2">
                            <div className="h-10 w-28 bg-muted rounded-lg animate-pulse" />
                            <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
                            <div className="h-10 w-28 bg-muted rounded-lg animate-pulse" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Tools Skeleton */}
            <section className="py-12 bg-card/50 border-b border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-muted rounded-xl animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-6 w-44 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-56 bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="w-14 h-14 bg-muted rounded-2xl animate-pulse" />
                                    <div className="flex gap-2">
                                        <div className="h-6 w-12 bg-muted rounded-full animate-pulse" />
                                        <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                                </div>
                                <div className="flex items-center gap-2 pt-3 border-t border-border">
                                    <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
                                    <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Skeleton */}
            <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="h-6 w-36 bg-muted rounded animate-pulse mb-6" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="p-4 rounded-xl bg-card border border-border space-y-3">
                                <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
                                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default function BotsLoading() {
    return (
        <div className="min-h-screen">
            {/* Hero Section Skeleton */}
            <section className="relative py-16 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <div className="h-8 w-36 bg-muted rounded-full animate-pulse mx-auto" />
                        <div className="h-12 w-72 max-w-full bg-muted rounded-lg animate-pulse mx-auto" />
                        <div className="h-6 w-96 max-w-full bg-muted rounded animate-pulse mx-auto" />
                    </div>
                </div>
            </section>

            {/* Search & Filters Skeleton */}
            <section className="py-4 border-y border-border bg-card/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 h-12 bg-muted rounded-lg animate-pulse" />
                        <div className="flex gap-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-10 w-24 bg-muted rounded-full animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Tier Filter Skeleton */}
            <section className="py-6">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex gap-3 justify-center">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-9 w-24 bg-muted rounded-full animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Bot Cards Grid Skeleton */}
            <section className="py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden p-6 space-y-4">
                                {/* Bot Icon & Badge */}
                                <div className="flex items-start justify-between">
                                    <div className="w-16 h-16 bg-muted rounded-2xl animate-pulse" />
                                    <div className="space-y-2">
                                        <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                                        <div className="h-5 w-12 bg-muted rounded-full animate-pulse" />
                                    </div>
                                </div>

                                {/* Bot Name & Version */}
                                <div className="space-y-2">
                                    <div className="h-6 w-36 bg-muted rounded animate-pulse" />
                                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-4/5 bg-muted rounded animate-pulse" />
                                </div>

                                {/* Features */}
                                <div className="space-y-2 pt-2">
                                    {Array.from({ length: 3 }).map((_, j) => (
                                        <div key={j} className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-muted rounded animate-pulse" />
                                            <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                                        </div>
                                    ))}
                                </div>

                                {/* Footer - Stats & Actions */}
                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="h-4 w-10 bg-muted rounded animate-pulse" />
                                        <div className="h-4 w-10 bg-muted rounded animate-pulse" />
                                        <div className="h-4 w-10 bg-muted rounded animate-pulse" />
                                    </div>
                                    <div className="h-9 w-24 bg-muted rounded-lg animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default function EncyclopediaLoading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Hero Section Skeleton */}
                <div className="text-center mb-16 space-y-6">
                    <div className="h-8 w-72 bg-muted rounded-full animate-pulse mx-auto" />
                    <div className="h-14 w-64 bg-muted rounded-lg animate-pulse mx-auto" />
                    <div className="h-6 w-96 max-w-full bg-muted rounded animate-pulse mx-auto" />
                    <div className="h-5 w-80 max-w-full bg-muted rounded animate-pulse mx-auto" />

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                        <div className="h-12 w-32 bg-muted rounded-xl animate-pulse" />
                        <div className="h-12 w-40 bg-muted rounded-xl animate-pulse" />
                    </div>
                </div>

                {/* Sections Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="rounded-2xl border border-border bg-card p-6 space-y-5">
                            {/* Header */}
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-muted rounded-xl animate-pulse flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-6 w-40 bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center gap-4 pt-2">
                                <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
                                <div className="h-5 w-24 bg-muted rounded-full animate-pulse" />
                                <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                            </div>

                            {/* Topics List */}
                            <div className="space-y-2 pt-2 border-t border-border">
                                {Array.from({ length: 3 }).map((_, j) => (
                                    <div key={j} className="flex items-center gap-3 py-2">
                                        <div className="w-5 h-5 bg-muted rounded animate-pulse" />
                                        <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <div className="h-10 w-full bg-muted rounded-lg animate-pulse" />
                        </div>
                    ))}
                </div>

                {/* Bottom Stats Section Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-border bg-card p-6 text-center space-y-2">
                            <div className="w-10 h-10 bg-muted rounded-lg animate-pulse mx-auto" />
                            <div className="h-8 w-16 bg-muted rounded animate-pulse mx-auto" />
                            <div className="h-4 w-24 bg-muted rounded animate-pulse mx-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

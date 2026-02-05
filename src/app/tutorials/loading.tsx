export default function TutorialsLoading() {
    return (
        <div className="container mx-auto py-20 px-4 min-h-screen">
            {/* Header Skeleton */}
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                <div className="h-12 w-64 bg-muted rounded-lg animate-pulse mx-auto" />
                <div className="h-6 w-52 bg-muted rounded animate-pulse mx-auto" />
            </div>

            {/* Tutorial Cards Grid Skeleton */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                        {/* Cover Image Area */}
                        <div className="aspect-video relative bg-muted animate-pulse">
                            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                                <div className="h-6 w-3/4 bg-secondary rounded animate-pulse" />
                                <div className="h-5 w-1/2 bg-secondary rounded animate-pulse" />
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                                <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                                <div className="h-6 w-14 bg-muted rounded-full animate-pulse" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

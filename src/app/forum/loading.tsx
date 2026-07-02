export default function ForumLoading() {
    return (
        <div className="min-h-screen">
            <section className="py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    <div className="space-y-4 mb-10">
                        <div className="h-10 w-64 max-w-full bg-muted rounded-lg animate-pulse" />
                        <div className="h-5 w-80 max-w-full bg-muted rounded animate-pulse" />
                    </div>
                    <div className="space-y-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="rounded-xl border border-border bg-card p-5">
                                <div className="flex items-start gap-4">
                                    <div className="h-11 w-11 rounded-full bg-muted animate-pulse shrink-0" />
                                    <div className="flex-1 space-y-3">
                                        <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                                        <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                        <div className="flex gap-3 pt-1">
                                            <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                                            <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                                        </div>
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

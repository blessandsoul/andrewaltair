export default function InsightsLoading() {
    return (
        <div className="min-h-screen">
            <section className="py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="max-w-3xl space-y-4 mb-12">
                        <div className="h-10 w-72 max-w-full bg-muted rounded-lg animate-pulse" />
                        <div className="h-5 w-96 max-w-full bg-muted rounded animate-pulse" />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                                <div className="h-44 bg-muted animate-pulse" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                                    <div className="h-6 w-full bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

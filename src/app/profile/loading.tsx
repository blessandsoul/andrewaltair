export default function ProfileLoading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Profile Header Skeleton */}
            <div className="border-b border-border bg-card">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 bg-muted rounded-full animate-pulse" />

                        {/* User Info */}
                        <div className="flex-1 text-center sm:text-left space-y-3">
                            <div className="h-7 w-48 bg-muted rounded animate-pulse mx-auto sm:mx-0" />
                            <div className="h-4 w-56 bg-muted rounded animate-pulse mx-auto sm:mx-0" />
                            <div className="flex gap-4 justify-center sm:justify-start pt-2">
                                <div className="h-8 w-24 bg-muted rounded-lg animate-pulse" />
                                <div className="h-8 w-28 bg-muted rounded-lg animate-pulse" />
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="h-10 w-36 bg-muted rounded-lg animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="border-b border-border bg-card">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    <div className="flex gap-1 overflow-x-auto py-1">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-10 w-28 bg-muted rounded-lg animate-pulse flex-shrink-0" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Content Skeleton */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-8 space-y-6">
                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-border bg-card p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
                                <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                                <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Activity List */}
                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                    <div className="h-5 w-36 bg-muted rounded animate-pulse" />
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                                <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                                <div className="flex-1 space-y-1">
                                    <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                                    <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
